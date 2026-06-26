import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Reserva } from '../../services/bookingService';
import { useTheme } from '../useTheme';
import { Inbox } from 'lucide-react'; // importamos Inbox

interface TablaReservasAdminProps {
  searchTerm?: string;
}

export const TablaReservasAdmin: React.FC<TablaReservasAdminProps> = ({ searchTerm = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'reservas'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reserva[];
      lista.sort((a, b) => {
        const valA = a.fechaReserva ? new Date(a.fechaReserva).getTime() : 0;
        const valB = b.fechaReserva ? new Date(b.fechaReserva).getTime() : 0;
        return valB - valA;
      });
      setReservas(lista);
    });
    return () => unsubscribe();
  }, []);

  const cambiarEstadoReserva = async (id: string, nuevoEstado: 'confirmada' | 'cancelada') => {
    try {
      const docRef = doc(db, 'reservas', id);
      await updateDoc(docRef, { estado: nuevoEstado });
    } catch (error) {
      console.error("Error al actualizar el estado de la reserva:", error);
    }
  };

  // ── Paleta Índigo Cristal ──
  const glassBg = isDark 
    ? 'rgba(26,26,46,0.65)' 
    : 'rgba(255,255,255,0.85)';
  const glassBorder = isDark 
    ? '1px solid rgba(139,92,246,0.25)' 
    : '1px solid rgba(99,102,241,0.18)';
  const glassShadow = isDark
    ? '0 8px 32px rgba(79,70,229,0.15)'
    : '0 8px 28px rgba(124,58,237,0.08)';

  const titleColor = isDark ? '#f5f3ff' : '#1e1b4b';
  const descColor = isDark ? '#c4b5fd' : '#3730a3';
  const labelColor = isDark ? '#a5b4fc' : '#4f46e5';
  const valueColor = isDark ? '#ede9fe' : '#1e1b4b';
  const mutedColor = isDark ? 'rgba(165,180,252,0.6)' : 'rgba(79,70,229,0.5)';

  const reservasFiltradas = reservas.filter(reserva => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (reserva.nombreCliente && reserva.nombreCliente.toLowerCase().includes(term)) ||
      (reserva.correoCliente && reserva.correoCliente.toLowerCase().includes(term)) ||
      (reserva.telefonoCliente && reserva.telefonoCliente.toLowerCase().includes(term)) ||
      (reserva.estado && reserva.estado.toLowerCase().includes(term))
    );
  });

  return (
    <div
      className="w-full rounded-2xl p-4 transition-all duration-500 backdrop-blur-xl"
      style={{
        background: glassBg,
        border: glassBorder,
        boxShadow: glassShadow,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Encabezado – con icono Inbox y textos más grandes */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center rounded-[16px]"
            style={{
              width: 44,
              height: 44,
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              boxShadow: '0 0 20px rgba(139,92,246,0.35)',
            }}
          >
            <Inbox size={22} strokeWidth={2} color="#fff" />
          </span>
          <div>
            <h3 className="text-xl font-bold font-serif" style={{ color: titleColor }}>
              Bandeja de Solicitudes de Reserva
            </h3>
           
          </div>
        </div>
        <span
          className="text-sm font-bold px-3 py-1.5 rounded-full" // más grande
          style={{
            color: isDark ? '#c4b5fd' : '#6d28d9',
            border: isDark ? '1.5px solid rgba(139,92,246,0.4)' : '1.5px solid rgba(124,58,237,0.3)',
            background: isDark ? 'rgba(26,26,46,0.6)' : 'rgba(255,255,255,0.85)',
          }}
        >
          {reservasFiltradas.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className="text-xs font-bold uppercase tracking-wider border-b" // aumentado de 10px a xs
              style={{
                color: labelColor,
                borderColor: isDark ? 'rgba(139,92,246,0.2)' : 'rgba(99,102,241,0.15)',
              }}
            >
              <th className="p-3">Visitante</th>
              <th className="p-3">Contacto</th>
              <th className="p-3">Fecha y Horario</th>
              <th className="p-3 text-center">Personas</th>
              <th className="p-3 text-center">Estado</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: isDark ? 'rgba(139,92,246,0.1)' : 'rgba(99,102,241,0.08)' }}>
            {reservasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-base font-medium" style={{ color: mutedColor }}>
                  No se han registrado solicitudes de reserva en la plataforma.
                </td>
              </tr>
            ) : (
              reservasFiltradas.map((reserva) => {
                const estado = reserva.estado || 'pendiente';
                let estadoColor, estadoBg, estadoBorder;
                if (estado === 'confirmada') {
                  estadoColor = isDark ? '#34d399' : '#047857';
                  estadoBg = isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.10)';
                  estadoBorder = isDark ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(16,185,129,0.2)';
                } else if (estado === 'cancelada') {
                  estadoColor = isDark ? '#fb7185' : '#be123c';
                  estadoBg = isDark ? 'rgba(244,63,94,0.15)' : 'rgba(244,63,94,0.10)';
                  estadoBorder = isDark ? '1px solid rgba(244,63,94,0.3)' : '1px solid rgba(244,63,94,0.2)';
                } else {
                  estadoColor = isDark ? '#facc15' : '#a16207';
                  estadoBg = isDark ? 'rgba(250,204,21,0.15)' : 'rgba(250,204,21,0.10)';
                  estadoBorder = isDark ? '1px solid rgba(250,204,21,0.3)' : '1px solid rgba(250,204,21,0.2)';
                }

                return (
                  <tr
                    key={reserva.id}
                    className="transition-colors hover:bg-opacity-40"
                    style={{
                      backgroundColor: isDark ? 'rgba(26,26,46,0.2)' : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    {/* Nombre */}
                    <td className="p-3 font-semibold text-base" style={{ color: valueColor }}> {/* aumentado a text-base */}
                      {reserva.nombreCliente}
                    </td>

                    {/* Contacto – textos con emojis pero los mantenemos, solo aumentamos tamaño */}
                    <td className="p-3 text-sm space-y-0.5"> {/* aumentado a text-sm */}
                      <p className="font-medium" style={{ color: descColor }}>
                        ✉️ {reserva.correoCliente}
                      </p>
                      {reserva.telefonoCliente && (
                        <a
                          href={`https://wa.me/${reserva.telefonoCliente.replace('+', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 font-semibold transition-colors hover:underline"
                          style={{ color: isDark ? '#34d399' : '#047857' }}
                        >
                          📱 {reserva.telefonoCliente}
                        </a>
                      )}
                    </td>

                    {/* Fecha y Horario */}
                    <td className="p-3 text-sm font-medium" style={{ color: descColor }}> {/* aumentado a text-sm */}
                      <p className="font-bold" style={{ color: valueColor }}>{reserva.fechaReserva}</p>
                      <p style={{ color: mutedColor }}>{reserva.horaReserva}</p>
                    </td>

                    {/* Personas */}
                    <td className="p-3 text-center font-bold text-base" style={{ color: valueColor }}> {/* aumentado a text-base */}
                      {reserva.cantidadPersonas}
                    </td>

                    {/* Estado */}
                    <td className="p-3 text-center">
                      <span
                        className="inline-block text-xs font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full" // más grande
                        style={{
                          color: estadoColor,
                          background: estadoBg,
                          border: estadoBorder,
                        }}
                      >
                        {estado}
                      </span>
                    </td>

                    {/* Acciones – botones más grandes */}
                    <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                      {estado === 'pendiente' && (
                        <>
                          <button
                            onClick={() => cambiarEstadoReserva(reserva.id!, 'confirmada')}
                            className="text-sm font-bold px-3 py-1.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5" // aumentado
                            style={{
                              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                              boxShadow: '0 0 16px rgba(99,102,241,0.3)',
                              color: '#fff',
                              border: 'none',
                            }}
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => cambiarEstadoReserva(reserva.id!, 'cancelada')}
                            className="text-sm font-bold px-3 py-1.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5" // aumentado
                            style={{
                              background: isDark
                                ? 'radial-gradient(circle at 30% 25%, rgba(244,63,94,0.12), rgba(244,63,94,0.04) 70%), rgba(26,26,46,0.6)'
                                : 'radial-gradient(circle at 30% 25%, rgba(244,63,94,0.08), rgba(244,63,94,0.02) 70%), rgba(255,255,255,0.8)',
                              border: isDark
                                ? '1px solid rgba(244,63,94,0.4)'
                                : '1px solid rgba(190,18,60,0.3)',
                              color: isDark ? '#fb7185' : '#be123c',
                              boxShadow: isDark
                                ? '0 0 12px rgba(244,63,94,0.08)'
                                : '0 0 12px rgba(244,63,94,0.04)',
                            }}
                          >
                            Declinar
                          </button>
                        </>
                      )}
                      {estado !== 'pendiente' && (
                        <span className="text-sm italic" style={{ color: mutedColor }}>
                          Procesada
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};