import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, Gem, Sparkles, Award, Mountain, FlaskConical } from 'lucide-react';
import { useTheme } from '../../components/useTheme';

export const Historia: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // ── Tokens Índigo Cristal ────────────────────────────────────────────────
  const pageBg    = isDark ? 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)' : 'linear-gradient(135deg, #ece9ff 0%, #f8f7ff 50%, #ece9ff 100%)';
  const halo1     = isDark ? 'radial-gradient(circle at 15% 10%, rgba(139,92,246,0.14), transparent 50%)' : 'radial-gradient(circle at 15% 10%, rgba(139,92,246,0.10), transparent 50%)';
  const halo2     = isDark ? 'radial-gradient(circle at 85% 40%, rgba(99,102,241,0.10), transparent 45%)' : 'radial-gradient(circle at 85% 40%, rgba(99,102,241,0.07), transparent 45%)';
  const halo3     = isDark ? 'radial-gradient(circle at 40% 85%, rgba(56,189,248,0.07), transparent 50%)' : 'radial-gradient(circle at 40% 85%, rgba(56,189,248,0.05), transparent 50%)';

  const titleColor  = isDark ? '#f5f3ff' : '#1e1b4b';
  const descColor   = isDark ? '#c4b5fd' : '#3730a3';
  // const labelColor  = isDark ? '#a5b4fc' : '#4f46e5';
  const cardBg      = isDark ? 'rgba(26,26,46,0.62)' : 'rgba(255,255,255,0.88)';
  const cardBorder  = isDark ? 'rgba(139,92,246,0.22)' : 'rgba(99,102,241,0.15)';

  // Imágenes — Potosí mineral / cristales / geología
  const IMG_MINERALES = '/images/arte.png';
  const IMG_RESINA    = '/images/mineral.png';
  const IMG_POTOSI    = 'src/assets/slider.png';

  // Accents para las secciones
  const accents = {
    violet: { ring: 'rgba(99,102,241,0.45)',  glow: 'rgba(99,102,241,0.22)',  text: isDark ? '#818cf8' : '#4338ca' },
    emerald:{ ring: 'rgba(16,185,129,0.45)',  glow: 'rgba(16,185,129,0.22)',  text: isDark ? '#34d399' : '#047857' },
    blue:   { ring: 'rgba(56,189,248,0.45)',  glow: 'rgba(56,189,248,0.22)',  text: isDark ? '#38bdf8' : '#0369a1' },
    purple: { ring: 'rgba(168,85,247,0.45)',  glow: 'rgba(168,85,247,0.22)',  text: isDark ? '#c084fc' : '#7e22ce' },
    pink:   { ring: 'rgba(236,72,153,0.45)',  glow: 'rgba(236,72,153,0.22)',  text: isDark ? '#f472b6' : '#be185d' },
  };

  // ── Sub-componente: Insignia macOS glass ─────────────────────────────────
  const GlassIcon: React.FC<{ icon: React.ReactNode; ring: string; glow: string; size?: number }> = ({ icon, ring, glow, size = 52 }) => (
    <div style={{
      width: size, height: size, borderRadius: Math.round(size * 0.34), flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      background: isDark
        ? `radial-gradient(circle at 30% 25%, ${ring}, rgba(26,26,46,0.7) 70%)`
        : `radial-gradient(circle at 30% 25%, ${ring}, rgba(255,255,255,0.8) 70%)`,
      border: `1.5px solid ${ring}`,
      boxShadow: `0 0 20px ${glow}, inset 0 1px 1px rgba(255,255,255,0.22)`,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', borderRadius: `${Math.round(size * 0.34)}px ${Math.round(size * 0.34)}px 0 0`, background: 'linear-gradient(to bottom, rgba(255,255,255,0.30), transparent)', opacity: 0.5 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{icon}</div>
    </div>
  );

  // ── Sub-componente: Separador decorativo ─────────────────────────────────
  const Divider: React.FC<{ color?: string }> = ({ color = '#8b5cf6' }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0.4rem 0 1rem' }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${color}55)` }} />
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${color}55)` }} />
    </div>
  );

  // ── Sub-componente: Bloque imagen con overlay glass ───────────────────────
  const ImageBlock: React.FC<{ src: string; alt: string; ring: string; glow: string; label: string }> = ({ src, alt, ring, glow, label }) => (
    <div style={{
      position: 'relative', borderRadius: 22, overflow: 'hidden',
      border: `1px solid ${ring}`,
      boxShadow: `0 16px 48px ${glow}, 0 0 0 1px ${ring}`,
      aspectRatio: '4/3',
    }}>
      <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      />
      {/* Overlay degradado */}
      <div style={{ position: 'absolute', inset: 0, background: isDark ? 'linear-gradient(135deg, transparent 40%, rgba(15,10,35,0.65) 100%)' : 'linear-gradient(135deg, transparent 40%, rgba(236,233,255,0.55) 100%)' }} />
      {/* Orbe decorativo esquina */}
      <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${ring}, transparent 70%)`, opacity: 0.35 }} />
      {/* Label flotante */}
      <div style={{
        position: 'absolute', bottom: 14, left: 14,
        padding: '5px 14px', borderRadius: 100,
        background: isDark ? 'rgba(15,15,26,0.78)' : 'rgba(255,255,255,0.82)',
        border: `1px solid ${ring}`, backdropFilter: 'blur(10px)',
        fontFamily: 'Cinzel, serif', fontSize: '0.62rem', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: isDark ? accents.violet.text : accents.violet.text,
      }}>
        {label}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: pageBg, position: 'relative', transition: 'background 0.4s ease', fontFamily: 'Cinzel, serif' }}>
      {/* Halos múltiples */}
      <div style={{ position: 'absolute', inset: 0, background: halo1, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: halo2, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: halo3, pointerEvents: 'none', zIndex: 0 }} />

      {/* Partículas decorativas */}
      <div style={{ position: 'absolute', top: '8%', left: '6%', width: 3, height: 3, borderRadius: '50%', background: 'rgba(139,92,246,0.6)', boxShadow: '0 0 10px rgba(139,92,246,0.8)', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '25%', right: '8%', width: 2, height: 2, borderRadius: '50%', background: 'rgba(56,189,248,0.6)', boxShadow: '0 0 8px rgba(56,189,248,0.8)', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '60%', left: '3%', width: 2, height: 2, borderRadius: '50%', background: 'rgba(236,72,153,0.5)', boxShadow: '0 0 8px rgba(236,72,153,0.7)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: 3, height: 3, borderRadius: '50%', background: 'rgba(16,185,129,0.5)', boxShadow: '0 0 10px rgba(16,185,129,0.7)', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '4rem 1.5rem 5rem' }}>

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          {/* Badge superior */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 20px', borderRadius: 100, background: isDark ? 'rgba(139,92,246,0.12)' : 'rgba(99,102,241,0.08)', border: isDark ? '1px solid rgba(139,92,246,0.35)' : '1px solid rgba(99,102,241,0.25)', marginBottom: '1.5rem', backdropFilter: 'blur(8px)' }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: isDark ? '#a5b4fc' : '#4f46e5' }}>✦ Casa Museo Potosí Mineral ✦</span>
          </div>

          {/* Insignia hero */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.4rem' }}>
            <GlassIcon
              size={76}
              ring={accents.violet.ring}
              glow={accents.violet.glow}
              icon={<Landmark size={36} strokeWidth={1.8} color={accents.violet.text} style={{ filter: `drop-shadow(0 0 8px ${accents.violet.glow})` }} />}
            />
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.2rem)', fontWeight: 700, color: titleColor, margin: '0 0 0.6rem', letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1.1, textShadow: isDark ? '0 0 60px rgba(139,92,246,0.4)' : 'none' }}>
            Nuestra Historia
          </h1>

          {/* Línea decorativa triple */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '1rem auto 1.4rem', width: 200 }}>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${isDark ? '#8b5cf6' : '#6366f1'})` }} />
            <div style={{ display: 'flex', gap: 4 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: isDark ? '#c084fc' : '#8b5cf6', boxShadow: `0 0 8px ${isDark ? '#c084fc' : '#8b5cf6'}` }} />
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: isDark ? '#818cf8' : '#6366f1', boxShadow: `0 0 12px ${isDark ? '#818cf8' : '#6366f1'}` }} />
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: isDark ? '#c084fc' : '#8b5cf6', boxShadow: `0 0 8px ${isDark ? '#c084fc' : '#8b5cf6'}` }} />
            </div>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${isDark ? '#8b5cf6' : '#6366f1'})` }} />
          </div>

          <p style={{ maxWidth: 560, margin: '0 auto', fontSize: '0.88rem', fontStyle: 'italic', color: descColor, lineHeight: 1.7, letterSpacing: '0.02em' }}>
            "Uniendo el pasado legendario de las profundidades de Potosí con el arte del mañana."
          </p>
        </motion.div>

        {/* ── SECCIÓN 1: El Origen ──────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'center', marginBottom: '4.5rem' }}>
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.6rem' }}>
              <GlassIcon size={48} ring={accents.violet.ring} glow={accents.violet.glow}
                icon={<Gem size={22} strokeWidth={1.8} color={accents.violet.text} style={{ filter: `drop-shadow(0 0 5px ${accents.violet.glow})` }} />}
              />
              <div>
                <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: accents.violet.text, margin: '0 0 2px' }}>Capítulo I</p>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: titleColor, margin: 0, letterSpacing: '0.04em' }}>El Origen en las Vetas</h2>
              </div>
            </div>
            <Divider color={isDark ? '#818cf8' : '#6366f1'} />
            <p style={{ fontSize: '0.82rem', lineHeight: 1.75, color: descColor, textAlign: 'justify', margin: 0 }}>
              Nuestra historia comienza en las entrañas de la histórica Villa Imperial de Potosí. Inspirados por la vasta tradición mineralógica y geológica de la región, nacimos como un espacio dedicado a rescatar y poner en valor muestras científicas colectadas en expediciones directas por los parajes andinos.
            </p>
            {/* Pill decorativo */}
            <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, background: isDark ? 'rgba(99,102,241,0.10)' : 'rgba(99,102,241,0.06)', border: `1px solid ${accents.violet.ring}` }}>
              <Mountain size={12} strokeWidth={1.8} color={accents.violet.text} />
              <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accents.violet.text }}>Andes · Potosí · Bolivia</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}>
            <ImageBlock src={IMG_MINERALES} alt="Minerales de Potosí" ring={accents.violet.ring} glow={accents.violet.glow} label="Minerales nativos" />
          </motion.div>
        </div>

        {/* ── SECCIÓN 2: Fusión ────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'center', marginBottom: '4.5rem' }}>
          <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
            style={{ order: 1 }}
          >
            <ImageBlock src={IMG_RESINA} alt="Arte en Picmentos de Mineral" ring={accents.emerald.ring} glow={accents.emerald.glow} label="Cristal & Resina" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{ order: 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.6rem' }}>
              <GlassIcon size={48} ring={accents.emerald.ring} glow={accents.emerald.glow}
                icon={<Sparkles size={22} strokeWidth={1.8} color={accents.emerald.text} style={{ filter: `drop-shadow(0 0 5px ${accents.emerald.glow})` }} />}
              />
              <div>
                <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: accents.emerald.text, margin: '0 0 2px' }}>Capítulo II</p>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: titleColor, margin: 0, letterSpacing: '0.04em' }}>Arte con Picmentos y Minerales</h2>
              </div>
            </div>
            <Divider color={isDark ? '#34d399' : '#047857'} />
            <p style={{ fontSize: '0.82rem', lineHeight: 1.75, color: descColor, textAlign: 'justify', margin: 0 }}>
              Más allá de la conservación, entendimos que el arte podía inmortalizar la ciencia. Incorporamos técnicas digitales y manufactura en resina de alta definición para crear piezas únicas que protegen la herencia mineralógica potosina en formatos vanguardistas para coleccionistas de todo el mundo.
            </p>
            <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, background: isDark ? 'rgba(16,185,129,0.10)' : 'rgba(16,185,129,0.06)', border: `1px solid ${accents.emerald.ring}` }}>
              <FlaskConical size={12} strokeWidth={1.8} color={accents.emerald.text} />
              <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accents.emerald.text }}>Arte · Ciencia · Diseño</span>
            </div>
          </motion.div>
        </div>

        {/* ── SECCIÓN 3: Potosí Hoy ────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'center', marginBottom: '4.5rem' }}>
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.6rem' }}>
              <GlassIcon size={48} ring={accents.blue.ring} glow={accents.blue.glow}
                icon={<Mountain size={22} strokeWidth={1.8} color={accents.blue.text} style={{ filter: `drop-shadow(0 0 5px ${accents.blue.glow})` }} />}
              />
              <div>
                <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: accents.blue.text, margin: '0 0 2px' }}>Capítulo III</p>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: titleColor, margin: 0, letterSpacing: '0.04em' }}>Potosí Hoy</h2>
              </div>
            </div>
            <Divider color={isDark ? '#38bdf8' : '#0369a1'} />
            <p style={{ fontSize: '0.82rem', lineHeight: 1.75, color: descColor, textAlign: 'justify', margin: 0 }}>
              El museo vive en la intersección entre tradición andina y modernidad digital. Hoy somos un punto de encuentro para geólogos, coleccionistas, educadores y viajeros que buscan comprender la complejidad geológica del altiplano boliviano desde una perspectiva viva y contemporánea.
            </p>
            <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, background: isDark ? 'rgba(56,189,248,0.10)' : 'rgba(56,189,248,0.06)', border: `1px solid ${accents.blue.ring}` }}>
              <Landmark size={12} strokeWidth={1.8} color={accents.blue.text} />
              <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accents.blue.text }}>Museo · Digital · Bolivia</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}>
            <ImageBlock src={IMG_POTOSI} alt="Potosí ciudad imperial" ring={accents.blue.ring} glow={accents.blue.glow} label="Villa Imperial de Potosí" />
          </motion.div>
        </div>

        {/* ── TARJETAS MISIÓN / VISIÓN ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Encabezado de bloque */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: isDark ? '#a5b4fc' : '#4f46e5', marginBottom: 6 }}>Nuestra identidad</p>
            <div style={{ width: 60, height: 1, background: `linear-gradient(to right, transparent, ${isDark ? '#8b5cf6' : '#6366f1'}, transparent)`, margin: '0 auto' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
            {/* Misión */}
            {[
              {
                ac: accents.purple,
                Icon: Award,
                titulo: 'Nuestra Misión',
                texto: 'Divulgar la riqueza natural de los minerales y fósiles potosinos a través del resguardo científico y la expresión artística contemporánea, promoviendo el turismo cultural y la educación geológica.',
              },
              {
                ac: accents.pink,
                Icon: Sparkles,
                titulo: 'La Visión',
                texto: 'Convertirnos en el principal referente digital e interactivo de conservación mineralógica y artesanía de diseño en Bolivia, conectando la tradición con entusiastas globales.',
              },
            ].map(({ ac, Icon, titulo, texto }, i) => (
              <motion.div
                key={titulo}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.12 }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'translateY(-6px)';
                  el.style.borderColor = ac.ring;
                  el.style.boxShadow = `0 16px 40px ${ac.glow}, 0 0 0 1px ${ac.ring}`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = 'none';
                  el.style.borderColor = cardBorder;
                  el.style.boxShadow = isDark ? '0 6px 24px rgba(0,0,0,0.22)' : '0 6px 20px rgba(99,102,241,0.06)';
                }}
                style={{
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: 20,
                  padding: '1.6rem 1.4rem',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  boxShadow: isDark ? '0 6px 24px rgba(0,0,0,0.22)' : '0 6px 20px rgba(99,102,241,0.06)',
                  transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                  cursor: 'default',
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <GlassIcon size={48} ring={ac.ring} glow={ac.glow}
                    icon={<Icon size={22} strokeWidth={1.8} color={ac.text} style={{ filter: `drop-shadow(0 0 5px ${ac.glow})` }} />}
                  />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: titleColor, margin: '0 0 6px', letterSpacing: '0.04em' }}>{titulo}</h3>
                <div style={{ width: 36, height: 2, background: ac.ring, borderRadius: 2, marginBottom: '0.8rem', boxShadow: `0 0 8px ${ac.glow}` }} />
                <p style={{ fontSize: '0.78rem', lineHeight: 1.72, color: descColor, margin: 0, textAlign: 'justify' }}>{texto}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Historia;