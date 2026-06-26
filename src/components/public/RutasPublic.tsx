import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useTheme } from '../../components/useTheme';
import { MapPin, Calendar, Compass } from 'lucide-react';

interface Expedicion {
  id: string;
  titulo: string;
  destino: string;
  fecha: string;
  descripcion?: string;
  imagenUrl?: string;
}

// Acentos rotativos por tarjeta
const ACCENTS = [
  { ring: 'rgba(99,102,241,0.45)',  glow: 'rgba(99,102,241,0.22)',  text: '#818cf8',  textL: '#4338ca', bg: 'rgba(99,102,241,0.10)',  bgL: 'rgba(99,102,241,0.06)'  },
  { ring: 'rgba(16,185,129,0.45)',  glow: 'rgba(16,185,129,0.22)',  text: '#34d399',  textL: '#047857', bg: 'rgba(16,185,129,0.10)',  bgL: 'rgba(16,185,129,0.06)'  },
  { ring: 'rgba(56,189,248,0.45)',  glow: 'rgba(56,189,248,0.22)',  text: '#38bdf8',  textL: '#0369a1', bg: 'rgba(56,189,248,0.10)',  bgL: 'rgba(56,189,248,0.06)'  },
  { ring: 'rgba(236,72,153,0.45)',  glow: 'rgba(236,72,153,0.22)',  text: '#f472b6',  textL: '#be185d', bg: 'rgba(236,72,153,0.10)',  bgL: 'rgba(236,72,153,0.06)'  },
  { ring: 'rgba(168,85,247,0.45)',  glow: 'rgba(168,85,247,0.22)',  text: '#c084fc',  textL: '#7e22ce', bg: 'rgba(168,85,247,0.10)',  bgL: 'rgba(168,85,247,0.06)'  },
  { ring: 'rgba(250,204,21,0.50)',  glow: 'rgba(250,204,21,0.18)',  text: '#facc15',  textL: '#a16207', bg: 'rgba(250,204,21,0.10)',  bgL: 'rgba(250,204,21,0.06)'  },
];

const ExpedicionCard: React.FC<{ exp: Expedicion; idx: number; isDark: boolean }> = ({ exp, idx, isDark }) => {
  const [hovered, setHovered] = useState(false);
  const ac = ACCENTS[idx % ACCENTS.length];
  const acText = isDark ? ac.text : ac.textL;
  const acBg   = isDark ? ac.bg   : ac.bgL;

  const cardBg     = isDark ? 'rgba(26,26,46,0.62)' : 'rgba(255,255,255,0.88)';
  const cardBorder = hovered ? ac.ring : (isDark ? 'rgba(139,92,246,0.22)' : 'rgba(99,102,241,0.15)');
  const titleColor = isDark ? '#f5f3ff' : '#1e1b4b';
  const metaColor  = isDark ? '#c4b5fd' : '#3730a3';
  const descColor  = isDark ? '#a5b4fc' : '#3730a3';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: hovered
          ? `0 20px 50px ${ac.glow}, 0 0 0 1px ${ac.ring}`
          : isDark ? '0 6px 24px rgba(0,0,0,0.25)' : '0 6px 20px rgba(99,102,241,0.06)',
        transform: hovered ? 'translateY(-8px) scale(1.015)' : 'none',
        transition: 'all 0.32s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      {/* Imagen con overlay */}
      {exp.imagenUrl ? (
        <div style={{ position: 'relative', height: 192, overflow: 'hidden' }}>
          <img
            src={exp.imagenUrl}
            alt={exp.titulo}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transform: hovered ? 'scale(1.07)' : 'scale(1)',
              transition: 'transform 0.5s ease',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: isDark
              ? 'linear-gradient(to bottom, transparent 35%, rgba(15,10,35,0.85) 100%)'
              : 'linear-gradient(to bottom, transparent 35%, rgba(236,233,255,0.78) 100%)',
          }} />
          {/* Insignia de destino flotante sobre imagen */}
          <div style={{
            position: 'absolute', bottom: 10, left: 12,
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 11px', borderRadius: 100,
            background: isDark ? 'rgba(26,26,46,0.75)' : 'rgba(255,255,255,0.82)',
            border: `1px solid ${ac.ring}`,
            backdropFilter: 'blur(8px)',
          }}>
            <MapPin size={11} strokeWidth={1.8} color={acText} />
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: acText }}>
              {exp.destino}
            </span>
          </div>
          {/* Insignia de categoría — esquina sup. derecha */}
          <div style={{
            position: 'absolute', top: 10, right: 10,
            width: 32, height: 32, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isDark ? 'rgba(26,26,46,0.72)' : 'rgba(255,255,255,0.82)',
            border: `1.5px solid ${ac.ring}`,
            backdropFilter: 'blur(8px)',
            boxShadow: `0 0 10px ${ac.glow}`,
            transform: hovered ? 'scale(1.12) rotate(4deg)' : 'none',
            transition: 'transform 0.3s ease',
          }}>
            <Compass size={15} strokeWidth={1.8} color={acText} style={{ filter: `drop-shadow(0 0 4px ${ac.glow})` }} />
          </div>
        </div>
      ) : (
        /* Placeholder sin imagen — insignia glass centrada */
        <div style={{
          height: 110,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isDark
            ? `radial-gradient(circle at 50% 60%, ${ac.ring}, rgba(15,15,26,0.9) 70%)`
            : `radial-gradient(circle at 50% 60%, ${ac.bgL}, rgba(248,247,255,0.9) 70%)`,
        }}>
          <div style={{
            width: 58, height: 58, borderRadius: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            background: `radial-gradient(circle at 30% 25%, ${ac.ring}, ${acBg} 70%)`,
            border: `1.5px solid ${ac.ring}`,
            boxShadow: hovered ? `0 0 22px ${ac.glow}, inset 0 1px 1px rgba(255,255,255,0.22)` : `inset 0 1px 1px rgba(255,255,255,0.15)`,
            transform: hovered ? 'scale(1.10) rotate(4deg)' : 'none',
            transition: 'all 0.3s ease',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', borderRadius: '18px 18px 0 0', background: 'linear-gradient(to bottom, rgba(255,255,255,0.32), transparent)', opacity: 0.45 }} />
            <Compass size={26} strokeWidth={1.8} color={acText} style={{ position: 'relative', zIndex: 1, filter: hovered ? `drop-shadow(0 0 7px ${ac.glow})` : 'none' }} />
          </div>
        </div>
      )}

      {/* Cuerpo */}
      <div style={{ padding: '0.9rem 1.1rem 1.1rem' }}>
        <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '0.95rem', fontWeight: 600, color: titleColor, margin: '0 0 8px', letterSpacing: '0.03em', lineHeight: 1.3 }}>
          {exp.titulo}
        </h3>

        {/* Meta — destino y fecha */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 9 }}>
          {!exp.imagenUrl && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={13} strokeWidth={1.8} color={acText} />
              <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.72rem', color: metaColor, letterSpacing: '0.04em' }}>{exp.destino}</span>
            </div>
          )}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={13} strokeWidth={1.8} color={acText} />
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.72rem', color: metaColor, letterSpacing: '0.04em' }}>{exp.fecha}</span>
          </div>
        </div>

        {exp.descripcion && (
          <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', color: descColor, lineHeight: 1.58, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {exp.descripcion}
          </p>
        )}

        {/* Tag de fecha pill */}
        <div style={{ marginTop: 10 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 10px', borderRadius: 100,
            fontSize: '0.62rem', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            fontFamily: 'Cinzel, serif',
            background: acBg, border: `1px solid ${ac.ring}`, color: acText,
          }}>
            <Calendar size={10} strokeWidth={1.8} />
            {exp.fecha}
          </span>
        </div>
      </div>
    </div>
  );
};

export const RutasPublic: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [expediciones, setExpediciones] = useState<Expedicion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'expediciones'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Expedicion[];
        setExpediciones(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading expediciones:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // ── Tokens Índigo Cristal ──────────────────────────────────────────────────
  const pageBg   = isDark ? 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)' : 'linear-gradient(135deg, #ece9ff 0%, #f8f7ff 50%, #ece9ff 100%)';
  const halo     = isDark ? 'radial-gradient(circle at 20% 10%, rgba(139,92,246,0.12), transparent 50%)' : 'radial-gradient(circle at 20% 10%, rgba(139,92,246,0.10), transparent 50%)';
  const titleColor = isDark ? '#f5f3ff' : '#1e1b4b';
  const labelColor = isDark ? '#818cf8' : '#4f46e5';

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#8b5cf6', borderRightColor: 'rgba(139,92,246,0.3)', animation: 'rp-spin 1s linear infinite' }} />
        <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#a5b4fc' }}>Cargando expediciones…</p>
        <style>{`@keyframes rp-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: pageBg, position: 'relative', transition: 'background 0.4s ease' }}>
      {/* Halo radial */}
      <div style={{ position: 'absolute', inset: 0, background: halo, pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '2rem 1.25rem 4rem' }}>

        {/* Encabezado de sección */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2rem', paddingBottom: '1rem', borderBottom: isDark ? '1px solid rgba(139,92,246,0.15)' : '1px solid rgba(99,102,241,0.12)' }}>
          {/* Insignia macOS glass */}
          <div style={{
            width: 52, height: 52, borderRadius: 17, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            background: isDark
              ? 'radial-gradient(circle at 30% 25%, rgba(99,102,241,0.45), rgba(26,26,46,0.7) 70%)'
              : 'radial-gradient(circle at 30% 25%, rgba(99,102,241,0.20), rgba(255,255,255,0.8) 70%)',
            border: '1.5px solid rgba(99,102,241,0.45)',
            boxShadow: '0 0 20px rgba(99,102,241,0.25), inset 0 1px 1px rgba(255,255,255,0.22)',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', borderRadius: '17px 17px 0 0', background: 'linear-gradient(to bottom, rgba(255,255,255,0.30), transparent)', opacity: 0.5 }} />
            <MapPin size={24} strokeWidth={1.8} color={isDark ? '#818cf8' : '#4f46e5'} style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 0 6px rgba(99,102,241,0.5))' }} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.2rem', fontWeight: 700, color: titleColor, margin: '0 0 3px', letterSpacing: '0.05em' }}>
              Rutas y Expediciones
            </h2>
            <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.68rem', color: labelColor, textTransform: 'uppercase', letterSpacing: '0.14em', margin: 0, fontWeight: 600 }}>
              {expediciones.length} {expediciones.length === 1 ? 'expedición disponible' : 'expediciones disponibles'}
            </p>
          </div>
        </div>

        {/* Vacío */}
        {expediciones.length === 0 ? (
          <div style={{
            padding: '2.5rem 1.5rem', borderRadius: 16, textAlign: 'center',
            background: isDark ? 'rgba(99,102,241,0.07)' : 'rgba(99,102,241,0.04)',
            border: isDark ? '1px dashed rgba(99,102,241,0.3)' : '1px dashed rgba(99,102,241,0.2)',
          }}>
            <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.82rem', color: isDark ? '#818cf8' : '#4f46e5', letterSpacing: '0.08em', margin: 0 }}>
              — No hay expediciones registradas todavía —
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
            {expediciones.map((exp, i) => (
              <ExpedicionCard key={exp.id} exp={exp} idx={i} isDark={isDark} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RutasPublic;