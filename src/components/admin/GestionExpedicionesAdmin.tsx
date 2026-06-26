import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { Trash2, Compass, MapPin, Calendar, FileText, Plus } from 'lucide-react';
import { useTheme } from '../../components/useTheme';

// Array of Unsplash image URLs for random selection
const unsplashImages = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800',
];

// Acentos rotativos por tarjeta (sin ámbar/naranja/amarillo, según Índigo Cristal)
const cardAccents = [
  { ring: 'rgba(99,102,241,0.35)', glow: 'rgba(99,102,241,0.25)', text: '#818cf8' },   // violeta/índigo
  { ring: 'rgba(59,130,246,0.35)', glow: 'rgba(59,130,246,0.25)', text: '#60a5fa' },   // azul
  { ring: 'rgba(16,185,129,0.35)', glow: 'rgba(16,185,129,0.25)', text: '#34d399' },   // verde
  { ring: 'rgba(168,85,247,0.35)', glow: 'rgba(168,85,247,0.25)', text: '#c084fc' },   // púrpura
];

export const GestionExpedicionesAdmin: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Form state
  const [titulo, setTitulo] = useState('');
  const [destino, setDestino] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // List state
  const [expediciones, setExpediciones] = useState<Array<any>>([]);
  const [error, setError] = useState<string | null>(null);

  // Real‑time listener
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'expediciones'), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setExpediciones(list as any);
    }, (e) => {
      console.error('Firestore listener error:', e);
      setError('Error cargando expediciones');
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !destino || !fecha) {
      alert('Complete los campos obligatorios');
      return;
    }
    const imageUrl = unsplashImages[Math.floor(Math.random() * unsplashImages.length)];
    try {
      await addDoc(collection(db, 'expediciones'), {
        titulo,
        destino,
        fecha,
        descripcion,
        imagenUrl: imageUrl,
        fechaRegistro: serverTimestamp(),
      });
      // Clear form
      setTitulo('');
      setDestino('');
      setFecha('');
      setDescripcion('');
    } catch (err) {
      console.error('Add expedition error:', err);
      alert('No se pudo crear la expedición');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar esta expedición?')) return;
    try {
      await deleteDoc(doc(db, 'expediciones', id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error al eliminar');
    }
  };

  // Estilos dependientes del tema
  const pageBg = isDark
    ? 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)'
    : 'linear-gradient(135deg, #ece9ff 0%, #f8f7ff 50%, #ece9ff 100%)';

  const cardBg = isDark
    ? 'rgba(26,26,46,0.55)'
    : 'rgba(255,255,255,0.65)';

  const cardBorder = isDark
    ? '1px solid rgba(139,92,246,0.18)'
    : '1px solid rgba(99,102,241,0.15)';

  const titleColor = isDark ? '#ede9fe' : '#1e1b4b';
  const descColor = isDark ? '#c4b5fd' : '#3730a3';
  const labelColor = isDark ? '#a5b4fc' : '#4f46e5';
  const inputBg = isDark ? 'rgba(15,15,26,0.6)' : 'rgba(255,255,255,0.8)';
  const inputBorder = isDark ? '1px solid rgba(139,92,246,0.25)' : '1px solid rgba(99,102,241,0.25)';
  const inputText = isDark ? '#ede9fe' : '#1e1b4b';
  const placeholderClass = isDark ? 'placeholder:text-indigo-300/40' : 'placeholder:text-indigo-900/30';

  return (
    <div
      className="relative min-h-screen p-6 overflow-hidden transition-colors duration-500"
      style={{ background: pageBg }}
    >
      {/* Halo radial decorativo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 20% 10%, rgba(139,92,246,0.12), transparent 50%), radial-gradient(circle at 80% 90%, rgba(99,102,241,0.10), transparent 50%)'
            : 'radial-gradient(circle at 20% 10%, rgba(139,92,246,0.10), transparent 50%), radial-gradient(circle at 80% 90%, rgba(99,102,241,0.08), transparent 50%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="relative flex items-center justify-center rounded-[20px]"
            style={{
              width: 56,
              height: 56,
              background: isDark
                ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.10))'
                : 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.06))',
              boxShadow: isDark
                ? 'inset 0 1px 1px rgba(255,255,255,0.15), 0 0 18px rgba(99,102,241,0.25)'
                : 'inset 0 1px 1px rgba(255,255,255,0.6), 0 0 14px rgba(99,102,241,0.15)',
              border: isDark ? '1px solid rgba(165,180,252,0.25)' : '1px solid rgba(79,70,229,0.2)',
            }}
          >
            <Compass strokeWidth={1.8} size={26} color={isDark ? '#c4b5fd' : '#4f46e5'} />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: titleColor }}>
              Gestión de Rutas y Expediciones
            </h2>
            <p className="text-sm" style={{ color: descColor }}>
              Crea y administra las rutas mineras del museo
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 p-6 rounded-2xl mb-10 backdrop-blur-xl"
          style={{
            background: cardBg,
            border: cardBorder,
            boxShadow: isDark
              ? '0 8px 32px rgba(0,0,0,0.35)'
              : '0 8px 32px rgba(99,102,241,0.08)',
          }}
        >
          <div className="flex flex-col">
            <label className="mb-1.5 text-xs font-medium uppercase tracking-wide flex items-center gap-1.5" style={{ color: labelColor }}>
              <Compass size={13} strokeWidth={2} /> Título
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Sendero de los Mineros"
              className={`rounded-xl px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 ${placeholderClass}`}
              style={{ background: inputBg, border: inputBorder, color: inputText }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.25)')}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1.5 text-xs font-medium uppercase tracking-wide flex items-center gap-1.5" style={{ color: labelColor }}>
              <MapPin size={13} strokeWidth={2} /> Destino
            </label>
            <input
              type="text"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              placeholder="Ej. Cerro Rico"
              className={`rounded-xl px-3 py-2.5 text-sm outline-none transition-all duration-200 ${placeholderClass}`}
              style={{ background: inputBg, border: inputBorder, color: inputText }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.25)')}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1.5 text-xs font-medium uppercase tracking-wide flex items-center gap-1.5" style={{ color: labelColor }}>
              <Calendar size={13} strokeWidth={2} /> Fecha
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="rounded-xl px-3 py-2.5 text-sm outline-none transition-all duration-200"
              style={{ background: inputBg, border: inputBorder, color: inputText, colorScheme: isDark ? 'dark' : 'light' }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.25)')}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
              required
            />
          </div>

          <div className="flex flex-col md:col-span-2 lg:col-span-3">
            <label className="mb-1.5 text-xs font-medium uppercase tracking-wide flex items-center gap-1.5" style={{ color: labelColor }}>
              <FileText size={13} strokeWidth={2} /> Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe brevemente la ruta o expedición..."
              className={`rounded-xl px-3 py-2.5 text-sm outline-none transition-all duration-200 h-24 resize-none ${placeholderClass}`}
              style={{ background: inputBg, border: inputBorder, color: inputText }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.25)')}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            />
          </div>

          {/* Input de archivo cosmético (oculto) */}
          <div className="hidden">
            <input type="file" />
          </div>

          <button
            type="submit"
            className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#ffffff',
              boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
            }}
          >
            <Plus size={16} strokeWidth={2.2} />
            Crear Expedición
          </button>
        </form>

        {/* Lista */}
        {error && (
          <p className="mb-4 text-sm font-medium" style={{ color: '#f87171' }}>
            {error}
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {expediciones.map((exp, idx) => {
            const accent = cardAccents[idx % cardAccents.length];
            return (
              <div
                key={exp.id}
                className="group relative rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: cardBg,
                  border: `1px solid ${accent.ring}`,
                  boxShadow: isDark
                    ? `0 8px 24px rgba(0,0,0,0.3)`
                    : `0 8px 24px rgba(99,102,241,0.06)`,
                }}
              >
                {/* Halo de color en hover */}
                <div
                  className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl"
                  style={{ background: accent.glow }}
                />

                {exp.imagenUrl && (
                  <div className="relative w-full h-44 overflow-hidden">
                    <img
                      src={exp.imagenUrl}
                      alt={exp.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: isDark
                          ? 'linear-gradient(to top, rgba(15,15,26,0.85), transparent 60%)'
                          : 'linear-gradient(to top, rgba(236,233,255,0.5), transparent 60%)',
                      }}
                    />
                  </div>
                )}

                <div className="relative p-4">
                  <h3 className="text-base font-semibold mb-1" style={{ color: accent.text }}>
                    {exp.titulo}
                  </h3>
                  <p className="text-sm flex items-center gap-1.5" style={{ color: descColor }}>
                    <MapPin size={13} strokeWidth={2} />
                    {exp.destino}
                  </p>
                  <p className="text-xs mt-0.5 flex items-center gap-1.5" style={{ color: labelColor, opacity: 0.8 }}>
                    <Calendar size={12} strokeWidth={2} />
                    {exp.fecha}
                  </p>
                  {exp.descripcion && (
                    <p
                      className="mt-2.5 text-sm line-clamp-2"
                      style={{ color: isDark ? '#d1d5db' : '#4b5563' }}
                    >
                      {exp.descripcion}
                    </p>
                  )}

                  <button
                    onClick={() => handleDelete(exp.id)}
                    title="Eliminar"
                    className="mt-3 flex items-center gap-1.5 text-xs font-medium rounded-lg px-2.5 py-1.5 transition-all duration-200 hover:scale-[1.03]"
                    style={{
                      color: '#f87171',
                      background: isDark ? 'rgba(248,113,113,0.10)' : 'rgba(248,113,113,0.08)',
                      border: isDark ? '1px solid rgba(248,113,113,0.25)' : '1px solid rgba(248,113,113,0.2)',
                    }}
                  >
                    <Trash2 size={14} strokeWidth={1.8} />
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {expediciones.length === 0 && !error && (
          <div
            className="flex flex-col items-center justify-center text-center py-16 rounded-2xl backdrop-blur-xl"
            style={{ background: cardBg, border: cardBorder }}
          >
            <Compass size={32} strokeWidth={1.5} color={isDark ? '#a5b4fc' : '#6366f1'} className="mb-3 opacity-60" />
            <p style={{ color: descColor }}>Aún no hay expediciones registradas</p>
          </div>
        )}
      </div>
    </div>
  );
};