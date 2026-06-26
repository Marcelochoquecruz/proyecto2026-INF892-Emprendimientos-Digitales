import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useTheme } from '../../components/useTheme';
import { Trash2, Gem, Bone, FlaskConical, MapPin, Clock } from 'lucide-react';

// Types for a gallery piece
interface Pieza {
  id: string;
  tipo: 'mineral' | 'fossil';
  nombreComun: string;
  nombreCientifico?: string;
  descripcion?: string;
  imagenUrl?: string;
  formulaQuimica?: string;
  procedencia?: string;
  eraGeologica?: string;
}

export const ColeccionAdmin: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'galeria_museo'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const lista = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Pieza[];
        setPiezas(lista);
      },
      (err) => {
        console.error('Error listening to galeria_museo:', err);
        setError('No se pudo cargar la galería.');
      }
    );
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este elemento de la galería?')) return;
    try {
      await deleteDoc(doc(db, 'galeria_museo', id));
    } catch (e) {
      console.error('Delete error:', e);
      alert('Error al eliminar el elemento.');
    }
  };

  // ── Paleta Índigo Cristal ──
  const pageBg = isDark
    ? 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)'
    : 'linear-gradient(135deg, #ece9ff 0%, #f8f7ff 50%, #ece9ff 100%)';
  const halo = isDark
    ? 'radial-gradient(circle at 20% 10%, rgba(139,92,246,0.12), transparent 50%)'
    : 'radial-gradient(circle at 20% 10%, rgba(139,92,246,0.10), transparent 50%)';

  const titleColor = isDark ? '#f5f3ff' : '#1e1b4b';
  const descColor = isDark ? '#c4b5fd' : '#3730a3';
  const labelColor = isDark ? '#a5b4fc' : '#4f46e5';
  const mutedColor = isDark ? 'rgba(165,180,252,0.6)' : 'rgba(79,70,229,0.5)';

  // Acentos cristalinos para cada sección
  const mineralAccent = {
    bg: isDark
      ? 'rgba(16,185,129,0.12)'
      : 'rgba(16,185,129,0.08)',
    border: isDark
      ? '1px solid rgba(16,185,129,0.25)'
      : '1px solid rgba(16,185,129,0.15)',
    glow: isDark
      ? 'rgba(16,185,129,0.15)'
      : 'rgba(16,185,129,0.08)',
    iconColor: isDark ? '#34d399' : '#047857',
    ring: isDark ? 'rgba(16,185,129,0.4)' : 'rgba(16,185,129,0.3)',
  };

  const fossilAccent = {
    bg: isDark
      ? 'rgba(250,204,21,0.12)'
      : 'rgba(250,204,21,0.08)',
    border: isDark
      ? '1px solid rgba(250,204,21,0.25)'
      : '1px solid rgba(250,204,21,0.15)',
    glow: isDark
      ? 'rgba(250,204,21,0.15)'
      : 'rgba(250,204,21,0.08)',
    iconColor: isDark ? '#facc15' : '#a16207',
    ring: isDark ? 'rgba(250,204,21,0.4)' : 'rgba(250,204,21,0.3)',
  };

  // Base de tarjeta glass
  const glassCardBg = isDark ? 'rgba(26,26,46,0.65)' : 'rgba(255,255,255,0.85)';
  const glassCardBorder = isDark ? '1px solid rgba(139,92,246,0.25)' : '1px solid rgba(99,102,241,0.18)';
  const glassCardShadow = isDark
    ? '0 8px 32px rgba(79,70,229,0.12)'
    : '0 8px 28px rgba(124,58,237,0.06)';

  // Color rosa para el ícono de eliminar (siempre rosa, pero más vivo en claro)
  const deleteRing = isDark ? 'rgba(244,63,94,0.4)' : 'rgba(190,18,60,0.3)';
  const deleteGlow = isDark ? 'rgba(244,63,94,0.2)' : 'rgba(244,63,94,0.12)';
  const deleteColor = isDark ? '#fb7185' : '#be123c';

  if (error) {
    return (
      <div className="p-4 text-red-500" style={{ color: isDark ? '#fb7185' : '#be123c' }}>
        {error}
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen p-4 sm:p-6 transition-colors duration-500"
      style={{ background: pageBg }}
    >
      {/* Halo estático */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: halo }} />

      <div className="relative z-10 max-w-7xl mx-auto space-y-12">

        {/* ─── SECCIÓN MINERALES (fondo verde cristal) ─── */}
        <section
          className="rounded-2xl p-6 backdrop-blur-sm transition-all duration-300"
          style={{
            background: mineralAccent.bg,
            border: mineralAccent.border,
            boxShadow: isDark
              ? `0 8px 32px rgba(16,185,129,0.05)`
              : `0 8px 28px rgba(16,185,129,0.03)`,
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            {/* Icono estilo macOS glass */}
            <div
              className="relative flex items-center justify-center w-12 h-12 rounded-2xl"
              style={{
                border: `1.5px solid ${mineralAccent.ring}`,
                background: isDark
                  ? `radial-gradient(circle at 30% 25%, ${mineralAccent.glow}, transparent 70%), rgba(26,26,46,0.6)`
                  : `radial-gradient(circle at 30% 25%, ${mineralAccent.glow}, transparent 70%), rgba(255,255,255,0.8)`,
                boxShadow: `0 0 16px ${mineralAccent.glow}, inset 0 1px 1px rgba(255,255,255,0.25)`,
              }}
            >
              <span
                className="absolute top-0 left-0 w-full h-1/2 rounded-2xl pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
                  opacity: 0.4,
                }}
              />
              <Gem size={24} strokeWidth={1.8} color={mineralAccent.iconColor} />
            </div>

            <div>
              <h2
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: 'Cinzel, serif', color: titleColor }}
              >
                Galería de Minerales Nativos
              </h2>
              <p className="text-xs" style={{ color: descColor }}>
                {piezas.filter(p => p.tipo === 'mineral').length} piezas en exhibición
              </p>
            </div>
          </div>

          {piezas.filter(p => p.tipo === 'mineral').length === 0 ? (
            <p className="italic" style={{ color: mutedColor }}>No hay minerales registrados.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {piezas
                .filter(p => p.tipo === 'mineral')
                .map((pieza) => (
                  <div
                    key={pieza.id}
                    className="relative rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{
                      background: glassCardBg,
                      border: glassCardBorder,
                      boxShadow: glassCardShadow,
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  >
                    {pieza.imagenUrl && (
                      <img
                        src={pieza.imagenUrl}
                        alt={pieza.nombreComun}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3
                        className="text-lg font-semibold pr-8"
                        style={{ fontFamily: 'Cinzel, serif', color: titleColor }}
                      >
                        {pieza.nombreComun}
                      </h3>
                      {pieza.nombreCientifico && (
                        <p className="text-sm italic mb-2" style={{ color: descColor }}>
                          {pieza.nombreCientifico}
                        </p>
                      )}
                      {pieza.descripcion && (
                        <p className="text-xs mb-3 line-clamp-3" style={{ color: descColor }}>
                          {pieza.descripcion}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {pieza.formulaQuimica && (
                          <span
                            className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                              background: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)',
                              color: labelColor,
                              border: isDark ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(99,102,241,0.1)',
                            }}
                          >
                            <FlaskConical size={12} strokeWidth={1.8} />
                            {pieza.formulaQuimica}
                          </span>
                        )}
                        {pieza.procedencia && (
                          <span
                            className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                              background: isDark ? 'rgba(56,189,248,0.15)' : 'rgba(56,189,248,0.08)',
                              color: isDark ? '#38bdf8' : '#2563eb',
                              border: isDark ? '1px solid rgba(56,189,248,0.2)' : '1px solid rgba(56,189,248,0.1)',
                            }}
                          >
                            <MapPin size={12} strokeWidth={1.8} />
                            {pieza.procedencia}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ─── Botón eliminar (ícono glass) ─── */}
                    <button
                      onClick={() => handleDelete(pieza.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-3 group"
                      style={{
                        border: `1.5px solid ${deleteRing}`,
                        background: isDark
                          ? `radial-gradient(circle at 30% 25%, ${deleteGlow}, transparent 70%), rgba(26,26,46,0.6)`
                          : `radial-gradient(circle at 30% 25%, ${deleteGlow}, transparent 70%), rgba(255,255,255,0.8)`,
                        boxShadow: `0 0 12px ${deleteGlow}, inset 0 1px 1px rgba(255,255,255,0.25)`,
                      }}
                      title="Eliminar"
                    >
                      <span
                        className="absolute top-0 left-0 w-full h-1/2 rounded-lg pointer-events-none"
                        style={{
                          background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
                          opacity: 0.4,
                        }}
                      />
                      <Trash2 size={14} strokeWidth={1.8} color={deleteColor} />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </section>

        {/* ─── SECCIÓN FÓSILES (fondo amarillo cristal) ─── */}
        <section
          className="rounded-2xl p-6 backdrop-blur-sm transition-all duration-300"
          style={{
            background: fossilAccent.bg,
            border: fossilAccent.border,
            boxShadow: isDark
              ? `0 8px 32px rgba(250,204,21,0.05)`
              : `0 8px 28px rgba(250,204,21,0.03)`,
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            {/* Icono estilo macOS glass */}
            <div
              className="relative flex items-center justify-center w-12 h-12 rounded-2xl"
              style={{
                border: `1.5px solid ${fossilAccent.ring}`,
                background: isDark
                  ? `radial-gradient(circle at 30% 25%, ${fossilAccent.glow}, transparent 70%), rgba(26,26,46,0.6)`
                  : `radial-gradient(circle at 30% 25%, ${fossilAccent.glow}, transparent 70%), rgba(255,255,255,0.8)`,
                boxShadow: `0 0 16px ${fossilAccent.glow}, inset 0 1px 1px rgba(255,255,255,0.25)`,
              }}
            >
              <span
                className="absolute top-0 left-0 w-full h-1/2 rounded-2xl pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
                  opacity: 0.4,
                }}
              />
              <Bone size={24} strokeWidth={1.8} color={fossilAccent.iconColor} />
            </div>

            <div>
              <h2
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: 'Cinzel, serif', color: titleColor }}
              >
                Galería de Fósiles Prehistóricos
              </h2>
              <p className="text-xs" style={{ color: descColor }}>
                {piezas.filter(p => p.tipo === 'fossil').length} piezas en exhibición
              </p>
            </div>
          </div>

          {piezas.filter(p => p.tipo === 'fossil').length === 0 ? (
            <p className="italic" style={{ color: mutedColor }}>No hay fósiles registrados.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {piezas
                .filter(p => p.tipo === 'fossil')
                .map((pieza) => (
                  <div
                    key={pieza.id}
                    className="relative rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{
                      background: glassCardBg,
                      border: glassCardBorder,
                      boxShadow: glassCardShadow,
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  >
                    {pieza.imagenUrl && (
                      <img
                        src={pieza.imagenUrl}
                        alt={pieza.nombreComun}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3
                        className="text-lg font-semibold pr-8"
                        style={{ fontFamily: 'Cinzel, serif', color: titleColor }}
                      >
                        {pieza.nombreComun}
                      </h3>
                      {pieza.nombreCientifico && (
                        <p className="text-sm italic mb-2" style={{ color: descColor }}>
                          {pieza.nombreCientifico}
                        </p>
                      )}
                      {pieza.descripcion && (
                        <p className="text-xs mb-3 line-clamp-3" style={{ color: descColor }}>
                          {pieza.descripcion}
                        </p>
                      )}
                      {pieza.eraGeologica && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            background: isDark ? 'rgba(250,204,21,0.15)' : 'rgba(250,204,21,0.08)',
                            color: isDark ? '#facc15' : '#a16207',
                            border: isDark ? '1px solid rgba(250,204,21,0.2)' : '1px solid rgba(250,204,21,0.1)',
                          }}
                        >
                          <Clock size={12} strokeWidth={1.8} />
                          Era: {pieza.eraGeologica}
                        </span>
                      )}
                    </div>

                    {/* ─── Botón eliminar (ícono glass) ─── */}
                    <button
                      onClick={() => handleDelete(pieza.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-3 group"
                      style={{
                        border: `1.5px solid ${deleteRing}`,
                        background: isDark
                          ? `radial-gradient(circle at 30% 25%, ${deleteGlow}, transparent 70%), rgba(26,26,46,0.6)`
                          : `radial-gradient(circle at 30% 25%, ${deleteGlow}, transparent 70%), rgba(255,255,255,0.8)`,
                        boxShadow: `0 0 12px ${deleteGlow}, inset 0 1px 1px rgba(255,255,255,0.25)`,
                      }}
                      title="Eliminar"
                    >
                      <span
                        className="absolute top-0 left-0 w-full h-1/2 rounded-lg pointer-events-none"
                        style={{
                          background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
                          opacity: 0.4,
                        }}
                      />
                      <Trash2 size={14} strokeWidth={1.8} color={deleteColor} />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};