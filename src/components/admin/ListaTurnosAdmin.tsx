import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Disponibilidad } from '../../services/bookingService';
import { useTheme } from '../useTheme';
import { CalendarClock, Clock, Users, Pause, Play, Trash2, ListChecks } from 'lucide-react';

export const ListaTurnosAdmin: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [turnos, setTurnos] = useState<Disponibilidad[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'disponibilidades'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Disponibilidad[];
      lista.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      setTurnos(lista);
    });
    return () => unsubscribe();
  }, []);

  const alternarEstado = async (id: string, estadoActual: boolean) => {
    const docRef = doc(db, 'disponibilidades', id);
    await updateDoc(docRef, { activo: !estadoActual });
  };

    // modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | null>(null);

    const handleDelete = (id: string) => {
      setModalMessage('¿Seguro que deseas eliminar este horario habilitado?');
      setOnConfirmAction(() => async () => {
        await deleteDoc(doc(db, 'disponibilidades', id));
        setModalOpen(false);
      });
      setModalOpen(true);
    };

    const confirmDelete = async () => {
      if (onConfirmAction) await onConfirmAction();
    };

    // replace previous eliminarTurno call with handleDelete

  // ── Paleta Índigo Cristal ──
  const glassBg = isDark ? 'rgba(26,26,46,0.65)' : 'rgba(255,255,255,0.85)';
  const glassBorder = isDark ? '1px solid rgba(139,92,246,0.25)' : '1px solid rgba(99,102,241,0.18)';
  const glassShadow = isDark
    ? '0 8px 32px rgba(79,70,229,0.15)'
    : '0 8px 28px rgba(124,58,237,0.08)';

  const titleColor = isDark ? '#f5f3ff' : '#1e1b4b';
  const descColor = isDark ? '#c4b5fd' : '#3730a3';
  const labelColor = isDark ? '#a5b4fc' : '#4f46e5';
  const valueColor = isDark ? '#ede9fe' : '#1e1b4b';

  const badgeActive = isDark
    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    : 'bg-emerald-100 text-emerald-800 border-emerald-500/60';
  const badgePaused = isDark
    ? 'bg-gray-800/60 text-gray-400 border-gray-700'
    : 'bg-gray-200 text-gray-600 border-gray-400';

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
      {/* Encabezado */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center rounded-[16px]"
            style={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              boxShadow: '0 0 20px rgba(139,92,246,0.35)',
            }}
          >
            <ListChecks size={18} strokeWidth={2} color="#fff" />
          </span>
          <div>
            <h2 className="font-serif text-base tracking-[0.2em] uppercase" style={{ color: titleColor }}>
              Horarios Habilitados
            </h2>
            <p className="text-[9px] uppercase tracking-[0.15em] font-serif" style={{ color: descColor }}>
              Vista en tiempo real
            </p>
          </div>
        </div>
        <span
          className="text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{
            color: isDark ? '#c4b5fd' : '#6d28d9',
            border: isDark ? '1.5px solid rgba(139,92,246,0.4)' : '1.5px solid rgba(124,58,237,0.3)',
            background: isDark ? 'rgba(26,26,46,0.6)' : 'rgba(255,255,255,0.85)',
          }}
        >
          {turnos.length}
        </span>
      </div>

      {/* Lista de turnos */}
      <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
        {turnos.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs" style={{ color: isDark ? 'rgba(129,140,248,0.7)' : '#6b7280' }}>
              No has habilitado ningún turno todavía.
            </p>
          </div>
        ) : (
          turnos.map((turno) => {
            const activo = turno.activo;
            const rowBg = activo
              ? isDark
                ? 'rgba(99,102,241,0.08)'
                : 'rgba(255,255,255,0.7)'
              : isDark
                ? 'rgba(15,15,26,0.4)'
                : 'rgba(243,244,246,0.5)';
            const rowBorder = activo
              ? isDark
                ? '1px solid rgba(99,102,241,0.3)'
                : '1px solid rgba(124,58,237,0.2)'
              : isDark
                ? '1px solid rgba(75,75,95,0.25)'
                : '1px solid rgba(156,163,175,0.3)';

            return (
              <div
                key={turno.id}
                className="group relative w-full rounded-xl p-3 transition-all duration-300 flex flex-wrap items-center justify-between gap-2 hover:-translate-y-0.5"
                style={{ background: rowBg, border: rowBorder, opacity: activo ? 1 : 0.7 }}
              >
                {/* Fecha */}
                <div className="flex items-center gap-2.5 flex-1 min-w-[90px]">
                  <span
                    className="flex items-center justify-center rounded-xl"
                    style={{
                      width: 34,
                      height: 34,
                      background: isDark ? 'rgba(56,189,248,0.12)' : 'rgba(56,189,248,0.08)',
                      border: isDark ? '1px solid rgba(56,189,248,0.25)' : '1px solid rgba(56,189,248,0.15)',
                      boxShadow: isDark ? '0 0 10px rgba(56,189,248,0.08)' : 'none',
                    }}
                  >
                    <CalendarClock size={16} strokeWidth={1.8} color={isDark ? '#38bdf8' : '#2563eb'} />
                  </span>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider block" style={{ color: labelColor }}>
                      Fecha
                    </span>
                    <span className="font-semibold text-sm" style={{ color: valueColor }}>
                      {turno.fecha}
                    </span>
                  </div>
                </div>

                {/* Estado */}
                <div className="flex items-center gap-2 flex-1 min-w-[80px]">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider block" style={{ color: labelColor }}>
                      Estado
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        activo ? badgeActive : badgePaused
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${activo ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`}
                      ></span>
                      {activo ? 'Activo' : 'Pausado'}
                    </span>
                  </div>
                </div>

                {/* Horario */}
                <div className="flex items-center gap-2.5 flex-1 min-w-[120px]">
                  <span
                    className="flex items-center justify-center rounded-xl"
                    style={{
                      width: 34,
                      height: 34,
                      background: isDark ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.08)',
                      border: isDark ? '1px solid rgba(139,92,246,0.25)' : '1px solid rgba(139,92,246,0.15)',
                      boxShadow: isDark ? '0 0 10px rgba(139,92,246,0.08)' : 'none',
                    }}
                  >
                    <Clock size={16} strokeWidth={1.8} color={isDark ? '#c4b5fd' : '#7c3aed'} />
                  </span>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider block" style={{ color: labelColor }}>
                      Horario
                    </span>
                    <span className="font-medium text-sm" style={{ color: valueColor }}>
                      {turno.horaInicio} - {turno.horaFin}
                    </span>
                  </div>
                </div>

                {/* Cupos */}
                <div className="flex items-center gap-2.5 flex-1 min-w-[80px]">
                  <span
                    className="flex items-center justify-center rounded-xl"
                    style={{
                      width: 34,
                      height: 34,
                      background: isDark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.08)',
                      border: isDark ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(16,185,129,0.15)',
                      boxShadow: isDark ? '0 0 10px rgba(16,185,129,0.08)' : 'none',
                    }}
                  >
                    <Users size={16} strokeWidth={1.8} color={isDark ? '#34d399' : '#047857'} />
                  </span>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider block" style={{ color: labelColor }}>
                      Cupos
                    </span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-bold text-sm" style={{ color: valueColor }}>
                        {turno.cupoDisponible}
                      </span>
                      <span className="text-xs" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>
                        /{turno.cupoMaximo}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 ml-auto">
                  {/* Botón Pausar/Reactivar */}
                  <button
                    onClick={() => alternarEstado(turno.id!, turno.activo)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5"
                    style={
                      activo
                        ? {
                            border: isDark ? '1px solid rgba(156,163,175,0.4)' : '1px solid rgba(107,114,128,0.4)',
                            color: isDark ? '#d1d5db' : '#374151',
                            background: 'transparent',
                          }
                        : {
                            border: isDark ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(99,102,241,0.4)',
                            color: isDark ? '#a5b4fc' : '#4338ca',
                            background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.06)',
                            boxShadow: isDark ? '0 0 12px rgba(99,102,241,0.15)' : '0 0 12px rgba(99,102,241,0.05)',
                          }
                    }
                  >
                    {activo ? <Pause size={12} strokeWidth={2.2} /> : <Play size={12} strokeWidth={2.2} />}
                    {activo ? 'Pausar' : 'Reactivar'}
                  </button>

                  {/* 
                    Botón Eliminar – solo ícono de basurero 
                    Efectos glass al hover: escala, rotación y glow 
                  */}
                  <button
                    onClick={() => handleDelete(turno.id!)}
                    className="inline-flex items-center justify-center p-1 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-3 hover:shadow-[0_0_20px_rgba(244,63,94,0.5)]"
                    title="Eliminar"
                  >
                    <Trash2 size={16} strokeWidth={1.8} color={isDark ? '#fb7185' : '#be123c'} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            className="w-full max-w-sm rounded-2xl p-5 text-center shadow-xl"
            style={{
              background: glassBg,
              border: glassBorder,
              color: valueColor,
            }}
          >
            <p className="mb-5 text-sm font-semibold">{modalMessage}</p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider"
                style={{ border: glassBorder, color: descColor }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? 'rgba(99,102,241,0.08)' : 'rgba(124,58,237,0.08)'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark
            ? 'linear-gradient(180deg, #6366F1, #8B5CF6)'
            : 'linear-gradient(180deg, #818CF8, #A78BFA)'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark
            ? 'linear-gradient(180deg, #818CF8, #A78BFA)'
            : 'linear-gradient(180deg, #6366F1, #8B5CF6)'};
        }
      `}</style>
    </div>
  );
};
