import React, { useState, useRef } from 'react';
import { crearDisponibilidad } from '../services/bookingService';
import { useTheme } from '../components/useTheme';
import { CalendarDays, Clock, Minus, Plus, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export const ConfigurarTurno: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [horaFin, setHoraFin] = useState('10:00');
  const [cupoMaximo, setCupoMaximo] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const fechaRef = useRef<HTMLInputElement>(null);
  const horaInicioRef = useRef<HTMLInputElement>(null);
  const horaFinRef = useRef<HTMLInputElement>(null);

  const sumarUnaHora = (hora: string): string => {
    const [horas, minutos] = hora.split(':').map(Number);
    let nuevaHora = horas + 1;
    if (nuevaHora >= 24) nuevaHora = 0;
    return `${String(nuevaHora).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
  };

  const handleHoraInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaInicio = e.target.value;
    setHoraInicio(nuevaInicio);
    setHoraFin(sumarUnaHora(nuevaInicio));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fecha) {
      setMensaje({ tipo: 'error', texto: 'Por favor, selecciona una fecha válida.' });
      return;
    }

    setCargando(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      await crearDisponibilidad({
        fecha,
        horaInicio,
        horaFin,
        cupoMaximo,
        cupoDisponible: cupoMaximo,
        activo: true,
      });

      setMensaje({ tipo: 'exito', texto: '¡Turno de visita habilitado correctamente!' });
      setFecha('');
    } catch (error) {
      const mensajeError = error instanceof Error ? error.message : 'Ocurrió un error inesperado';
      setMensaje({ tipo: 'error', texto: mensajeError });
    } finally {
      setCargando(false);
    }
  };

  const abrirPicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        (ref.current as unknown as Record<string, () => void>).showPicker();
      } else {
        ref.current.click();
      }
    }
  };

  // ── Paleta Índigo Cristal ──
  const glassBg = isDark ? 'rgba(26,26,46,0.65)' : 'rgba(255,255,255,0.85)';
  const glassBorder = isDark ? '1px solid rgba(139,92,246,0.25)' : '1px solid rgba(99,102,241,0.18)';
  const glassShadow = isDark ? '0 8px 32px rgba(79,70,229,0.15)' : '0 8px 28px rgba(124,58,237,0.08)';

  const formBg = isDark
    ? 'radial-gradient(circle at 30% 25%, rgba(16,185,129,0.15), rgba(16,185,129,0.05) 70%), rgba(26,26,46,0.6)'
    : 'radial-gradient(circle at 30% 25%, rgba(16,185,129,0.10), rgba(16,185,129,0.02) 70%), rgba(255,255,255,0.8)';
  const formBorder = isDark ? '1px solid rgba(16,185,129,0.30)' : '1px solid rgba(16,185,129,0.20)';
  const formShadow = isDark ? '0 4px 16px rgba(16,185,129,0.10)' : '0 4px 16px rgba(16,185,129,0.06)';

  const titleColor = isDark ? '#f5f3ff' : '#1e1b4b';
  const descColor = isDark ? '#c4b5fd' : '#3730a3';
  const labelColor = isDark ? '#a5b4fc' : '#4f46e5';
  const mutedColor = isDark ? 'rgba(165,180,252,0.6)' : 'rgba(79,70,229,0.5)';
  const inputBg = 'transparent';
  const inputBorder = isDark ? 'rgba(139,92,246,0.25)' : 'rgba(99,102,241,0.20)';

  const inputFieldClass =
    'w-full pl-9 pr-2 py-2 rounded-lg text-sm font-medium outline-none transition-all duration-300 bg-transparent';

  const focusRing = (e: React.FocusEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.boxShadow = isDark ? '0 0 0 3px rgba(16,185,129,0.25)' : '0 0 0 3px rgba(16,185,129,0.18)';
    el.style.borderColor = isDark ? 'rgba(52,211,153,0.6)' : 'rgba(5,150,105,0.5)';
  };

  const blurRing = (e: React.FocusEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.boxShadow = 'none';
    el.style.borderColor = inputBorder;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-2 my-1">
      <div
        className="relative rounded-xl backdrop-blur-xl transition-all duration-500 p-4 sm:p-5"
        style={{
          background: glassBg,
          border: glassBorder,
          boxShadow: glassShadow,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="relative h-[1.5px] bg-gradient-to-r from-transparent via-[#818cf8] to-transparent opacity-50 mb-3">
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#a5b4fc] opacity-70" />
        </div>

        <div className="border-b pb-2 mb-3" style={{ borderColor: isDark ? 'rgba(139,92,246,0.15)' : 'rgba(99,102,241,0.10)' }}>
          <h1 className="text-lg font-bold tracking-tight" style={{ color: titleColor, fontFamily: 'Cinzel, serif' }}>
            Habilitar Turno de Visita
          </h1>
          <p className="text-[11px] mt-0.5" style={{ color: descColor }}>
            Crea una nueva disponibilidad para que los usuarios puedan reservar.
          </p>
        </div>

        {mensaje.texto && (
          <div
            className={`p-2.5 rounded-lg mb-3 text-xs font-semibold text-center flex items-center justify-center gap-2 ${
              mensaje.tipo === 'exito'
                ? isDark
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-emerald-100/80 text-emerald-800 border border-emerald-500/20'
                : isDark
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : 'bg-rose-100/80 text-rose-800 border border-rose-500/20'
            }`}
          >
            {mensaje.tipo === 'exito' ? <CheckCircle2 size={15} /> : <span>⚠️</span>}
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div
            className="rounded-xl p-3 transition-all duration-300 backdrop-blur-sm"
            style={{
              background: formBg,
              border: formBorder,
              boxShadow: formShadow,
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          >
            <h2
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-2"
              style={{ color: isDark ? '#34d399' : '#047857' }}
            >
              Datos del Turno
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Fecha */}
              <div className="relative">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: labelColor }}>
                  Fecha
                </label>
                <div
                  className="relative rounded-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-[#818cf8]/50"
                  style={{
                    background: inputBg,
                    border: `1px solid ${inputBorder}`,
                  }}
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300" style={{ color: mutedColor }}>
                    <CalendarDays className="w-4 h-4" strokeWidth={1.8} />
                  </div>
                  <input
                    ref={fechaRef}
                    type="date"
                    required
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className={inputFieldClass}
                    style={{
                      color: titleColor,
                      colorScheme: isDark ? 'dark' : 'light',
                    }}
                    placeholder="YYYY-MM-DD"
                    onClick={() => abrirPicker(fechaRef)}
                    onFocus={focusRing}
                    onBlur={blurRing}
                  />
                </div>
              </div>

              {/* Hora Inicio */}
              <div className="relative">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: labelColor }}>
                  Hora Inicio
                </label>
                <div
                  className="relative rounded-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-[#818cf8]/50"
                  style={{
                    background: inputBg,
                    border: `1px solid ${inputBorder}`,
                  }}
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300" style={{ color: mutedColor }}>
                    <Clock className="w-4 h-4" strokeWidth={1.8} />
                  </div>
                  <input
                    ref={horaInicioRef}
                    type="time"
                    required
                    value={horaInicio}
                    onChange={handleHoraInicioChange}
                    className={inputFieldClass}
                    style={{
                      color: titleColor,
                      colorScheme: isDark ? 'dark' : 'light',
                    }}
                    onClick={() => abrirPicker(horaInicioRef)}
                    onFocus={focusRing}
                    onBlur={blurRing}
                  />
                </div>
              </div>

              {/* Hora Fin */}
              <div className="relative">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: labelColor }}>
                  Hora Fin
                </label>
                <div
                  className="relative rounded-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-[#818cf8]/50"
                  style={{
                    background: inputBg,
                    border: `1px solid ${inputBorder}`,
                  }}
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300" style={{ color: mutedColor }}>
                    <Clock className="w-4 h-4" strokeWidth={1.8} />
                  </div>
                  <input
                    ref={horaFinRef}
                    type="time"
                    required
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                    className={inputFieldClass}
                    style={{
                      color: titleColor,
                      colorScheme: isDark ? 'dark' : 'light',
                    }}
                    onClick={() => abrirPicker(horaFinRef)}
                    onFocus={focusRing}
                    onBlur={blurRing}
                  />
                </div>
              </div>

              {/* Cupo Máximo */}
              <div className="relative">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: labelColor }}>
                  Cupo Máximo
                </label>
                <div
                  className="flex items-center justify-between h-[38px] rounded-lg px-2 transition-all duration-300"
                  style={{
                    background: inputBg,
                    border: `1px solid ${inputBorder}`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setCupoMaximo((prev) => Math.max(1, prev - 1))}
                    className="relative h-full aspect-square rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
                    style={{ color: mutedColor }}
                  >
                    <Minus size={13} strokeWidth={2.5} />
                  </button>
                  <span className="text-base font-extrabold min-w-[28px] text-center" style={{ color: titleColor }}>
                    {cupoMaximo}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCupoMaximo((prev) => Math.min(10, prev + 1))}
                    className="relative h-full aspect-square rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
                    style={{ color: mutedColor }}
                  >
                    <Plus size={13} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Botón de envío */}
              <div className="relative flex items-end">
                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full h-[38px] px-4 rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-[10px] flex items-center justify-center gap-1.5 hover:scale-[1.01] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#818cf8]/50"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#ffffff',
                    boxShadow: '0 0 20px rgba(99,102,241,0.3)',
                  }}
                >
                  {cargando ? (
                    <>
                      <Loader2 size={13} strokeWidth={2.5} className="animate-spin" /> Guardando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={13} strokeWidth={2.5} /> Habilitar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(to right, transparent, ${isDark ? '#a5b4fc' : '#4f46e5'}33)`,
              }}
            />
            <Sparkles size={11} strokeWidth={1.8} style={{ color: isDark ? '#c4b5fd' : '#4f46e5' }} />
            <div
              className="h-px flex-1"
              style={{
                background: `linear-gradient(to left, transparent, ${isDark ? '#a5b4fc' : '#4f46e5'}33)`,
              }}
            />
          </div>
        </form>
      </div>

      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          display: none !important;
          -webkit-appearance: none !important;
        }

        input[type="date"],
        input[type="time"] {
          -moz-appearance: textfield !important;
          appearance: none !important;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }

        input[type="date"]::-webkit-datetime-edit,
        input[type="time"]::-webkit-datetime-edit {
          color: ${isDark ? '#f5f3ff' : '#1e1b4b'};
        }

        input[type="date"]::-webkit-datetime-edit-fields-wrapper,
        input[type="time"]::-webkit-datetime-edit-fields-wrapper {
          background: transparent;
        }

        input[type="date"]::-webkit-datetime-edit-text,
        input[type="time"]::-webkit-datetime-edit-text,
        input[type="date"]::-webkit-datetime-edit-month-field,
        input[type="time"]::-webkit-datetime-edit-hour-field,
        input[type="date"]::-webkit-datetime-edit-day-field,
        input[type="time"]::-webkit-datetime-edit-minute-field,
        input[type="date"]::-webkit-datetime-edit-year-field,
        input[type="time"]::-webkit-datetime-edit-year-field {
          color: ${isDark ? '#f5f3ff' : '#1e1b4b'};
        }
      `}</style>
    </div>
  );
};

export default ConfigurarTurno;