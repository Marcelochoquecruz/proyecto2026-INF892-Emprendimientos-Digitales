import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { registrarReservaTransaccional, Disponibilidad } from '../services/bookingService';
import { useTheme } from '../components/useTheme';
import { User, Mail, Phone, Users, Calendar, Clock, CheckCircle } from 'lucide-react';

const Inscripciones: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [turnos, setTurnos] = useState<Disponibilidad[]>([]);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<Disponibilidad | null>(null);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [personas, setPersonas] = useState(1);

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    const obtenerTurnos = async () => {
      try {
        const q = query(collection(db, 'disponibilidades'));
        const snapshot = await getDocs(q);

        const listaTurnos = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            activo: data.activo === true || data.activo === 'true',
            cupoDisponible: Number(data.cupoDisponible)
          };
        }) as Disponibilidad[];

        const turnosValidos = listaTurnos.filter(turno =>
          turno.activo === true && turno.cupoDisponible > 0
        );

        turnosValidos.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

        setTurnos(turnosValidos);
      } catch (error) {
        console.error("Error detallado cargando turnos:", error);
      }
    };
    obtenerTurnos();
  }, []);

  const handleReserva = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnoSeleccionado) {
      setMensaje({ tipo: 'error', texto: 'Por favor, seleccione un horario de la tabla.' });
      return;
    }

    setCargando(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      await registrarReservaTransaccional({
        disponibilidadId: turnoSeleccionado.id!,
        nombreCliente: nombre,
        correoCliente: correo,
        telefonoCliente: telefono,
        cantidadPersonas: personas,
        fechaReserva: turnoSeleccionado.fecha,
        horaReserva: `${turnoSeleccionado.horaInicio} - ${turnoSeleccionado.horaFin}`,
        estado: 'pendiente'
      });

      setMensaje({ tipo: 'exito', texto: '¡Solicitud de reserva enviada correctamente!' });
      setNombre('');
      setCorreo('');
      setTelefono('');
      setPersonas(1);
      setTurnoSeleccionado(null);

      // Refresh slots list
      const q = query(collection(db, 'disponibilidades'));
      const snapshot = await getDocs(q);
      const listaTurnos = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          activo: data.activo === true || data.activo === 'true',
          cupoDisponible: Number(data.cupoDisponible)
        };
      }) as Disponibilidad[];
      const turnosValidos = listaTurnos.filter(turno =>
        turno.activo === true && turno.cupoDisponible > 0
      );
      turnosValidos.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      setTurnos(turnosValidos);
    } catch (error) {
      const mensajeError = error instanceof Error ? error.message : 'Ocurrió un error inesperado';
      setMensaje({ tipo: 'error', texto: mensajeError });
    } finally {
      setCargando(false);
    }
  };

  // ── Paleta Índigo Cristal (fondo) ──
  const pageBg = isDark
    ? 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)'
    : 'linear-gradient(135deg, #ece9ff 0%, #f8f7ff 50%, #ece9ff 100%)';
  const halo = isDark
    ? 'radial-gradient(circle at 20% 10%, rgba(139,92,246,0.12), transparent 50%)'
    : 'radial-gradient(circle at 20% 10%, rgba(139,92,246,0.10), transparent 50%)';

  const glassBg = isDark ? 'rgba(26,26,46,0.65)' : 'rgba(255,255,255,0.85)';
  const glassBorder = isDark ? '1px solid rgba(139,92,246,0.25)' : '1px solid rgba(99,102,241,0.18)';
  const glassShadow = isDark
    ? '0 8px 32px rgba(79,70,229,0.15)'
    : '0 8px 28px rgba(124,58,237,0.08)';

  // ── Verde cristal unificado (formulario + tabla) ──
  const verdeCristal = isDark
    ? 'rgba(16,185,129,0.15)'
    : 'rgba(16,185,129,0.10)';
  const verdeBorde = isDark
    ? '1px solid rgba(16,185,129,0.30)'
    : '1px solid rgba(16,185,129,0.20)';
  const verdeSombra = isDark
    ? '0 4px 16px rgba(16,185,129,0.10)'
    : '0 4px 16px rgba(16,185,129,0.06)';

  // Aplicamos el mismo fondo y borde a ambas secciones
  const seccionBg = isDark
    ? `radial-gradient(circle at 30% 25%, ${verdeCristal}, rgba(16,185,129,0.05) 70%), rgba(26,26,46,0.6)`
    : `radial-gradient(circle at 30% 25%, ${verdeCristal}, rgba(16,185,129,0.02) 70%), rgba(255,255,255,0.8)`;
  const seccionBorder = verdeBorde;
  const seccionShadow = verdeSombra;

  const titleColor = isDark ? '#f5f3ff' : '#1e1b4b';
  const descColor = isDark ? '#c4b5fd' : '#3730a3';
  const labelColor = isDark ? '#a5b4fc' : '#4f46e5';
  const mutedColor = isDark ? 'rgba(165,180,252,0.6)' : 'rgba(79,70,229,0.5)';
  const inputBg = isDark ? 'rgba(26,26,46,0.6)' : 'rgba(255,255,255,0.8)';
  const inputBorder = isDark ? 'rgba(139,92,246,0.25)' : 'rgba(99,102,241,0.20)';

  return (
    <div
      className="relative flex items-center justify-center min-h-screen overflow-hidden p-4 sm:p-6"
      style={{ background: pageBg }}
    >
      {/* Fondo estático */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{ background: halo }} />
      </div>

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div
          className="relative rounded-2xl backdrop-blur-xl transition-all duration-500 p-6 sm:p-8"
          style={{
            background: glassBg,
            border: glassBorder,
            boxShadow: glassShadow,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {/* Línea superior decorativa */}
          <div className="relative h-[1.5px] bg-gradient-to-r from-transparent via-[#818cf8] to-transparent opacity-50 mb-6">
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
              w-1.5 h-1.5 rounded-full bg-[#a5b4fc] opacity-70" />
          </div>

          {/* Encabezado */}
          <div className="border-b pb-4 mb-6" style={{ borderColor: isDark ? 'rgba(139,92,246,0.15)' : 'rgba(99,102,241,0.10)' }}>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: titleColor, fontFamily: 'Cinzel, serif' }}>
              Reserva tu Visita
            </h1>
            <p className="text-base mt-1" style={{ color: descColor }}>
              Completa tus datos de contacto y selecciona un horario disponible abajo.
            </p>
          </div>

          {/* Mensaje de éxito/error */}
          

          <form onSubmit={handleReserva} className="space-y-5" autoComplete="off">
            {/* ─── SECCIÓN 1: FORMULARIO DE CONTACTO (VERDE CRISTAL) ─── */}
            <div
              className="rounded-xl p-5 transition-all duration-300 backdrop-blur-sm"
              style={{
                background: seccionBg,
                border: seccionBorder,
                boxShadow: seccionShadow,
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            >
              <h2
                className="text-base font-semibold uppercase tracking-[0.2em] mb-4"
                style={{ color: isDark ? '#34d399' : '#047857' }}
              >
                Datos Personales
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="group relative">
                  <label
                    className="block text-xs font-bold uppercase tracking-[0.2em] mb-1.5"
                    style={{ color: labelColor }}
                  >
                    Nombre Completo
                  </label>
                  <div
                    className="relative rounded-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-[#818cf8]/50"
                    style={{
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                    }}
                  >
                    <div
                      className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300"
                      style={{ color: mutedColor }}
                    >
                      <User className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    <input autoComplete="new-password"
                      type="text"
                      required
                      value={nombre}
                      onChange={e => setNombre(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-transparent border-none rounded-lg text-base outline-none transition-colors duration-300"
                      style={{ color: titleColor }}
                      placeholder="Ej. Juan Carlos"
                    />
                  </div>
                </div>

                {/* Correo */}
                <div className="group relative">
                  <label
                    className="block text-xs font-bold uppercase tracking-[0.2em] mb-1.5"
                    style={{ color: labelColor }}
                  >
                    Correo Electrónico
                  </label>
                  <div
                    className="relative rounded-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-[#818cf8]/50"
                    style={{
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                    }}
                  >
                    <div
                      className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300"
                      style={{ color: mutedColor }}
                    >
                      <Mail className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    <input
                      type="email"
                      required
                      value={correo}
                      onChange={e => setCorreo(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-transparent border-none rounded-lg text-base outline-none transition-colors duration-300"
                      style={{ color: titleColor }}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {/* Teléfono */}
                <div className="group relative">
                  <label
                    className="block text-xs font-bold uppercase tracking-[0.2em] mb-1.5"
                    style={{ color: labelColor }}
                  >
                    WhatsApp / Teléfono
                  </label>
                  <div
                    className="relative rounded-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-[#818cf8]/50"
                    style={{
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                    }}
                  >
                    <div
                      className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300"
                      style={{ color: mutedColor }}
                    >
                      <Phone className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    <input autoComplete="new-password"
                      type="tel"
                      required
                      value={telefono}
                      onChange={e => setTelefono(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-transparent border-none rounded-lg text-base outline-none transition-colors duration-300"
                      style={{ color: titleColor }}
                      placeholder="+591 ..."
                    />
                  </div>
                </div>

                {/* Personas */}
                <div className="group relative">
                  <label
                    className="block text-xs font-bold uppercase tracking-[0.2em] mb-1.5"
                    style={{ color: labelColor }}
                  >
                    Nº de Personas
                  </label>
                  <div
                    className="relative rounded-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-[#818cf8]/50"
                    style={{
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                    }}
                  >
                    <div
                      className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300"
                      style={{ color: mutedColor }}
                    >
                      <Users className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    <select
                      value={personas}
                      onChange={e => setPersonas(parseInt(e.target.value))}
                      className="w-full pl-10 pr-3 py-3 bg-transparent border-none rounded-lg text-base outline-none transition-colors duration-300 appearance-none"
                      style={{ color: titleColor }}
                    >
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n} style={{ background: isDark ? '#1a1a2e' : '#fff' }}>
                          {n} {n === 1 ? 'Persona' : 'Personas'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Horario elegido */}
                <div className="group relative">
                  <label
                    className="block text-xs font-bold uppercase tracking-[0.2em] mb-1.5"
                    style={{ color: labelColor }}
                  >
                    Horario Elegido
                  </label>
                  <div
                    className="relative rounded-lg flex items-center px-3 py-3 min-h-[48px] transition-all duration-300"
                    style={{
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                    }}
                  >
                    <div style={{ color: mutedColor }}>
                      <Clock className="w-5 h-5 mr-2" strokeWidth={1.8} />
                    </div>
                    <span
                      className="text-base truncate font-medium"
                      style={{ color: turnoSeleccionado ? titleColor : mutedColor }}
                    >
                      {turnoSeleccionado
                        ? `${turnoSeleccionado.fecha} [${turnoSeleccionado.horaInicio}]`
                        : 'Ninguno'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── SECCIÓN 2: TABLA DE HORARIOS (VERDE CRISTAL) ─── */}
            <div
              className="rounded-xl p-5 transition-all duration-300 backdrop-blur-sm"
              style={{
                background: seccionBg,
                border: seccionBorder,
                boxShadow: seccionShadow,
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            >
              <label
                className="block text-base font-bold uppercase tracking-[0.2em] mb-3"
                style={{ color: isDark ? '#34d399' : '#047857' }}
              >
                Seleccione un Turno del Cronograma:
              </label>

              <div
                className="rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  border: `1px solid ${isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.10)'}`,
                }}
              >
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: labelColor }}
                    >
                      <th className="p-3">Día</th>
                      <th className="p-3">Fecha</th>
                      <th className="p-3">Horario (Intervalo)</th>
                      <th className="p-3 text-center">Cupos Disponibles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {turnos.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-6 text-center italic" style={{ color: mutedColor }}>
                          No hay turnos programados para los próximos días.
                        </td>
                      </tr>
                    ) : (
                      turnos.map((turno) => {
                        const esSeleccionado = turnoSeleccionado?.id === turno.id;
                        const bajoCupo = turno.cupoDisponible <= 3;
                        const diaSemana = new Date(turno.fecha).toLocaleDateString('es-ES', { weekday: 'long' });

                        return (
                          <tr
                            key={turno.id}
                            onClick={() => setTurnoSeleccionado(turno)}
                            className={`cursor-pointer transition-all duration-200 ${
                              esSeleccionado
                                ? 'bg-[#818cf8]/10 dark:bg-[#818cf8]/15'
                                : 'hover:bg-[#818cf8]/5 dark:hover:bg-[#818cf8]/8'
                            }`}
                            style={{
                              borderTop: isDark
                                ? '1px solid rgba(16,185,129,0.08)'
                                : '1px solid rgba(16,185,129,0.06)',
                            }}
                          >
                            <td className="p-3 font-semibold capitalize" style={{ color: titleColor }}>
                              {diaSemana}
                            </td>
                            <td className="p-3 font-semibold" style={{ color: titleColor }}>
                              <div className="flex items-center gap-2">
                                {esSeleccionado && (
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                                  />
                                )}
                                <Calendar className="w-4 h-4" strokeWidth={1.8} style={{ color: mutedColor }} />
                                {turno.fecha}
                              </div>
                            </td>
                            <td className="p-3" style={{ color: descColor }}>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" strokeWidth={1.8} style={{ color: mutedColor }} />
                                {turno.horaInicio} - {turno.horaFin}
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <span
                                className={`text-xs font-bold px-2.5 py-0.5 rounded-full transition-all duration-300 ${
                                  bajoCupo
                                    ? isDark
                                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                      : 'bg-rose-100/80 text-rose-700 border border-rose-500/20'
                                    : isDark
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                      : 'bg-emerald-100/80 text-emerald-700 border border-emerald-500/20'
                                }`}
                              >
                                {turno.cupoDisponible} {turno.cupoDisponible === 1 ? 'lugar' : 'lugares'} libres
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>


            {/* Success / error message placed *below* the button area */}
            {mensaje.texto && mensaje.tipo === 'exito' &&                <div className="bg-orange-950/40 border border-orange-500 text-orange-400 p-3 rounded-lg mt-4 w-full text-sm font-semibold text-center flex items-center justify-center gap-2">
                <CheckCircle size={18} className="mr-2" />
                {mensaje.texto}
              </div>
            }
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={cargando || !turnoSeleccionado}
                className="group relative px-6 py-3 rounded-lg font-semibold text-white overflow-hidden transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                style={{
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  boxShadow: '0 0 24px rgba(16,185,129,0.35)',
                }}
              >
                <div className="flex items-center gap-2 text-base font-bold uppercase tracking-wide">
                  {cargando ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" strokeWidth={2} />
                      <span>Confirmar Reservación</span>
                    </>
                  )}
                </div>
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Inscripciones;