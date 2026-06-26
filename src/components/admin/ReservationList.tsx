import { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot, query, type DocumentData } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useTheme } from '../useTheme';

interface AdminReservation {
  id: string;
  nombreCliente: string;
  correoCliente: string;
  telefonoCliente: string;
  fechaReserva: string;
  horaReserva: string;
  cantidadPersonas: number;
  estado: string;
}

const getString = (data: DocumentData, keys: string[], fallback = 'Sin dato') => {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }
  return fallback;
};

const getNumber = (data: DocumentData, keys: string[], fallback = 0) => {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === 'number') {
      return value;
    }
  }
  return fallback;
};

const mapReservation = (id: string, data: DocumentData): AdminReservation => ({
  id,
  nombreCliente: getString(data, ['nombreCliente', 'cliente', 'name']),
  correoCliente: getString(data, ['correoCliente', 'email']),
  telefonoCliente: getString(data, ['telefonoCliente', 'telefono']),
  fechaReserva: getString(data, ['fechaReserva', 'fecha', 'date']),
  horaReserva: getString(data, ['horaReserva', 'hora']),
  cantidadPersonas: getNumber(data, ['cantidadPersonas', 'personas'], 1),
  estado: getString(data, ['estado'], 'pendiente'),
});

const ReservationList = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [reservas, setReservas] = useState<AdminReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActive, setShowActive] = useState<boolean>(true);

  // Subscribe to real‑time updates
  useEffect(() => {
    const reservasQuery = query(collection(db, 'reservas'));
    const unsubscribe = onSnapshot(
      reservasQuery,
      snapshot => {
        const reservasFirestore = snapshot.docs.map(doc => mapReservation(doc.id, doc.data()));
        setReservas(reservasFirestore);
        setLoading(false);
        setError(null);
      },
      () => {
        setError('No se pudieron cargar las reservas.');
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  // Filter reservations client‑side: active = today or future, or pending
  const reservasFiltradas = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return reservas.filter(r => {
      const fecha = new Date(r.fechaReserva);
      const esActiva = fecha >= hoy || r.estado.toLowerCase() === 'pendiente';
      return showActive ? esActiva : !esActiva;
    });
  }, [reservas, showActive]);

  return (
    <section
      className={`rounded-xl border p-5 transition-colors duration-300 ${
        isDark ? 'border-slate-800 bg-slate-950 text-slate-100' : 'border-slate-200 bg-white text-slate-800'
      }`}
    >
      {/* Header with toggle tabs */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold tracking-wide" style={{ fontFamily: 'Cinzel, serif' }}>
          Reservas registradas
        </h2>
        <nav className="flex space-x-2">
          <button
            className={`px-4 py-1 rounded ${showActive ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setShowActive(true)}
          >
            Activas
          </button>
          <button
            className={`px-4 py-1 rounded ${!showActive ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setShowActive(false)}
          >
            Historial
          </button>
        </nav>
      </div>

      {loading && <p className="text-sm text-slate-500">Cargando reservas…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && reservasFiltradas.length === 0 && (
        <p className="text-sm text-slate-500">No hay reservas registradas.</p>
      )}

      {!loading && !error && reservasFiltradas.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                <th className="border-b border-slate-200/20 px-3 py-2">Cliente</th>
                <th className="border-b border-slate-200/20 px-3 py-2">Correo</th>
                <th className="border-b border-slate-200/20 px-3 py-2">Telefono</th>
                <th className="border-b border-slate-200/20 px-3 py-2">Fecha</th>
                <th className="border-b border-slate-200/20 px-3 py-2">Hora</th>
                <th className="border-b border-slate-200/20 px-3 py-2">Personas</th>
                <th className="border-b border-slate-200/20 px-3 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.map(reserva => (
                <tr key={reserva.id} className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                  <td className="border-b border-slate-200/10 px-3 py-3">{reserva.nombreCliente}</td>
                  <td className="border-b border-slate-200/10 px-3 py-3">{reserva.correoCliente}</td>
                  <td className="border-b border-slate-200/10 px-3 py-3">{reserva.telefonoCliente}</td>
                  <td className="border-b border-slate-200/10 px-3 py-3">{reserva.fechaReserva}</td>
                  <td className="border-b border-slate-200/10 px-3 py-3">{reserva.horaReserva}</td>
                  <td className="border-b border-slate-200/10 px-3 py-3">{reserva.cantidadPersonas}</td>
                  <td className="border-b border-slate-200/10 px-3 py-3 capitalize">{reserva.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ReservationList;

