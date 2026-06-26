import { db } from '../config/firebase'; // Tu configuración de Firebase App
import { collection, addDoc, doc, runTransaction } from 'firebase/firestore';

// Definición de la interfaz estricta en TypeScript
export interface Disponibilidad {
  id?: string;
  fecha: string;          // Formato: "2026-06-20"
  horaInicio: string;     // Formato: "09:00"
  horaFin: string;        // Formato: "10:30"
  cupoMaximo: number;     // Capacidad total
  cupoDisponible: number; // Inicialmente igual a cupoMaximo
  activo: boolean;
}

export interface Reserva {
  id?: string;
  nombreCliente: string;
  correoCliente: string;
  telefonoCliente: string;
  fechaReserva: string;
  horaReserva: string;
  cantidadPersonas: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
}

/**
 * Función para que el dueño guarde un nuevo turno disponible en el museo
 */
export const crearDisponibilidad = async (data: Omit<Disponibilidad, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'disponibilidades'), {
      ...data,
      creadoEn: new Date() // Timestamp de auditoría
    });
    return docRef.id;
  } catch (error) {
    console.error("Error al crear disponibilidad en Firestore:", error);
    throw new Error("No se pudo guardar el turno en la base de datos.");
  }
};

/**
 * Registrar una reserva descontando el cupo de forma transaccional
 */
export const registrarReservaTransaccional = async (data: Omit<Reserva, 'id'> & { disponibilidadId: string }): Promise<string> => {
  const { disponibilidadId, ...reservaData } = data;
  try {
    let reservaId = '';
    await runTransaction(db, async (transaction) => {
      const dispRef = doc(db, 'disponibilidades', disponibilidadId);
      const dispSnap = await transaction.get(dispRef);
      if (!dispSnap.exists()) {
        throw new Error("El horario seleccionado ya no está disponible.");
      }
      
      const disp = dispSnap.data() as Omit<Disponibilidad, 'id'>;
      if (!disp.activo) {
        throw new Error("Este turno ha sido pausado y no admite nuevas reservas.");
      }
      
      if (disp.cupoDisponible < reservaData.cantidadPersonas) {
        throw new Error(`Cupos insuficientes. Solo quedan ${disp.cupoDisponible} lugares disponibles.`);
      }
      
      // Descontar cupos
      transaction.update(dispRef, {
        cupoDisponible: disp.cupoDisponible - reservaData.cantidadPersonas
      });
      
      // Crear documento de reserva
      const newReservaRef = doc(collection(db, 'reservas'));
      transaction.set(newReservaRef, {
        ...reservaData,
        creadoEn: new Date()
      });
      reservaId = newReservaRef.id;
    });
    return reservaId;
  } catch (error: any) {
    console.error("Error en registrarReservaTransaccional:", error);
    throw new Error(error.message || "Error al procesar la reserva transaccional.");
  }
};
