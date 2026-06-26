import React from 'react';
import { MapPin, Mail, Youtube, ChevronRight } from 'lucide-react';
import { useTheme } from './useTheme';
import logoMuseo from '../assets/logo.png';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // ── Paleta Índigo Cristal ──
  const footerBg = isDark
    ? 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)'
    : 'linear-gradient(135deg, #ece9ff 0%, #f8f7ff 50%, #ece9ff 100%)';
  const halo = isDark
    ? 'radial-gradient(circle at 20% 10%, rgba(139,92,246,0.12), transparent 50%)'
    : 'radial-gradient(circle at 20% 10%, rgba(139,92,246,0.10), transparent 50%)';

  const glassBg = isDark ? 'rgba(26,26,46,0.55)' : 'rgba(255,255,255,0.65)';
  const glassBorder = isDark ? '1px solid rgba(139,92,246,0.18)' : '1px solid rgba(99,102,241,0.15)';
  const glassShadow = isDark
    ? '0 8px 32px rgba(79,70,229,0.12)'
    : '0 8px 28px rgba(124,58,237,0.06)';

  const titleColor = isDark ? '#f5f3ff' : '#1e1b4b';
  const descColor = isDark ? '#c4b5fd' : '#3730a3';
  const labelColor = isDark ? '#a5b4fc' : '#4f46e5';
  const mutedColor = isDark ? 'rgba(165,180,252,0.6)' : 'rgba(79,70,229,0.5)';

  const iconRing = isDark ? 'rgba(139,92,246,0.35)' : 'rgba(99,102,241,0.25)';
  const iconGlow = isDark ? 'rgba(139,92,246,0.2)' : 'rgba(99,102,241,0.15)';

  return (
    <footer
      className="mt-auto relative overflow-hidden transition-colors duration-500"
      style={{
        background: footerBg,
        position: 'relative',
      }}
    >
      {/* Halo decorativo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: halo }}
      />

      {/* Línea decorativa superior (mantenida) */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#818cf8] to-transparent opacity-50 dark:opacity-40 z-10">
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
          w-1.5 h-1.5 rounded-full bg-[#a5b4fc]
          shadow-[0_0_6px_2px_rgba(165,180,252,0.5)]" />
      </div>

      {/* Contenedor principal con vidrio esmerilado */}
      <div
        className="relative mx-4 md:mx-8 my-6 rounded-2xl backdrop-blur-xl"
        style={{
          background: glassBg,
          border: glassBorder,
          boxShadow: glassShadow,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

            {/* ── Columna 1: Marca ── */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#a5b4fc] via-[#818cf8] to-[#4f46e5] opacity-40 blur-md" />
                  <div className="relative w-14 h-14 rounded-full p-[2.5px]
                    bg-gradient-to-br from-[#a5b4fc] via-[#818cf8] to-[#4f46e5]
                    shadow-[0_0_16px_rgba(129,140,248,0.3)]
                    transition-shadow duration-500
                  ">
                    <div className="w-full h-full rounded-full bg-white dark:bg-[#0f0f1a] flex items-center justify-center overflow-hidden">
                      <img src={logoMuseo} alt="Logo" className="w-11 h-11 object-contain" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#818cf8] dark:text-[#a5b4fc] opacity-80 font-['Cinzel',serif]">
                    Casa Museo
                  </span>
                  <span className="text-lg font-bold uppercase tracking-wider" style={{ fontFamily: 'Cinzel, serif', color: titleColor }}>
                    POTOSÍ
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#818cf8] dark:text-[#a5b4fc] opacity-80 font-['Cinzel',serif]">
                    Mineral
                  </span>
                </div>
              </div>

              <p className="text-sm leading-relaxed" style={{ color: descColor }}>
                Un viaje al corazón de la tierra. Minerales únicos, historia viva y arte artesanal del altiplano boliviano.
              </p>
            </div>

            {/* ── Columna 2: Enlaces ── */}
            <div className="flex flex-col gap-4">
              <h3 className="font-['Cinzel',serif] text-xs font-bold uppercase tracking-[0.2em]" style={{ color: labelColor }}>
                Secciones
              </h3>
              <nav className="flex flex-col gap-2">
                {[
                  { href: '/', label: 'Inicio' },
                  { href: '#salas', label: 'Exhibición' },
                  { href: '#catalogo', label: 'Tienda' },
                  { href: '#reservas', label: 'Reservas' },
                ].map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="flex items-center gap-2 text-sm transition-colors duration-300 group focus:outline-none focus:ring-2 focus:ring-[#818cf8]/50 rounded"
                    style={{ color: descColor }}
                    onMouseEnter={(e) => e.currentTarget.style.color = isDark ? '#a5b4fc' : '#4f46e5'}
                    onMouseLeave={(e) => e.currentTarget.style.color = isDark ? '#c4b5fd' : '#3730a3'}
                  >
                    <ChevronRight className="w-3 h-3 text-[#818cf8] dark:text-[#a5b4fc] opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                    {label}
                  </a>
                ))}
              </nav>
            </div>

            {/* ── Columna 3: Contacto ── */}
            <div className="flex flex-col gap-4">
              <h3 className="font-['Cinzel',serif] text-xs font-bold uppercase tracking-[0.2em]" style={{ color: labelColor }}>
                Contacto
              </h3>

              {/* Dirección */}
              <div className="flex items-start gap-3">
                <div
                  className="relative w-10 h-10 rounded-[14px] flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-105"
                  style={{
                    border: `1.5px solid ${iconRing}`,
                    background: isDark
                      ? `radial-gradient(circle at 30% 25%, ${iconGlow}, transparent 70%), rgba(26,26,46,0.6)`
                      : `radial-gradient(circle at 30% 25%, ${iconGlow}, transparent 70%), rgba(255,255,255,0.8)`,
                    boxShadow: `0 0 14px ${iconGlow}, inset 0 1px 1px rgba(255,255,255,0.25)`,
                  }}
                >
                  <span
                    className="absolute top-0 left-0 w-full h-1/2 rounded-[14px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
                      opacity: 0.4,
                    }}
                  />
                  <MapPin className="w-[18px] h-[18px]" strokeWidth={1.8} style={{ color: isDark ? '#c4b5fd' : '#4f46e5' }} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-90 mb-1" style={{ color: labelColor }}>
                    Dirección
                  </div>
                  <div className="text-sm leading-relaxed" style={{ color: descColor }}>
                    Calle Días de Horopeza N° 237<br />
                    Potosí · Bolivia
                  </div>
                </div>
              </div>

              {/* Correo */}
              <div className="flex items-start gap-3">
                <div
                  className="relative w-10 h-10 rounded-[14px] flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-105"
                  style={{
                    border: `1.5px solid ${iconRing}`,
                    background: isDark
                      ? `radial-gradient(circle at 30% 25%, ${iconGlow}, transparent 70%), rgba(26,26,46,0.6)`
                      : `radial-gradient(circle at 30% 25%, ${iconGlow}, transparent 70%), rgba(255,255,255,0.8)`,
                    boxShadow: `0 0 14px ${iconGlow}, inset 0 1px 1px rgba(255,255,255,0.25)`,
                  }}
                >
                  <span
                    className="absolute top-0 left-0 w-full h-1/2 rounded-[14px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
                      opacity: 0.4,
                    }}
                  />
                  <Mail className="w-[18px] h-[18px]" strokeWidth={1.8} style={{ color: isDark ? '#c4b5fd' : '#4f46e5' }} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-90 mb-1" style={{ color: labelColor }}>
                    Correo
                  </div>
                  <a
                    href="mailto:museopotosimineral@gmail.com"
                    className="text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#818cf8]/50 rounded"
                    style={{ color: descColor }}
                    onMouseEnter={(e) => e.currentTarget.style.color = isDark ? '#a5b4fc' : '#4f46e5'}
                    onMouseLeave={(e) => e.currentTarget.style.color = isDark ? '#c4b5fd' : '#3730a3'}
                  >
                    museopotosimineral@gmail.com
                  </a>
                </div>
              </div>

              {/* Redes sociales */}
              <div className="pt-2">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-90 mb-3" style={{ color: labelColor }}>
                  Síguenos
                </h4>
                <div className="flex gap-2">
                  {[
                    {
                      href: 'https://www.youtube.com/@PotosiMineralmuseo',
                      icon: Youtube,
                      label: 'YouTube',
                      colorRing: 'rgba(255,0,0,0.4)',
                      colorGlow: 'rgba(255,0,0,0.25)',
                      iconColor: isDark ? '#fb7185' : '#dc2626',
                    },
                    {
                      href: 'https://vt.tiktok.com/ZSQeb4k1v/',
                      icon: TikTokIcon,
                      label: 'TikTok',
                      colorRing: 'rgba(0,0,0,0.4)',
                      colorGlow: 'rgba(0,0,0,0.25)',
                      iconColor: isDark ? '#e0e7ff' : '#1f2937',
                    },
                  ].map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={social.label}
                        className="relative w-11 h-11 rounded-[14px] flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                        style={{
                          border: `1.5px solid ${social.colorRing}`,
                          background: isDark
                            ? `radial-gradient(circle at 30% 25%, ${social.colorGlow}, transparent 70%), rgba(26,26,46,0.6)`
                            : `radial-gradient(circle at 30% 25%, ${social.colorGlow}, transparent 70%), rgba(255,255,255,0.8)`,
                          boxShadow: `0 0 14px ${social.colorGlow}, inset 0 1px 1px rgba(255,255,255,0.25)`,
                        }}
                      >
                        <span
                          className="absolute top-0 left-0 w-full h-1/2 rounded-[14px] pointer-events-none"
                          style={{
                            background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
                            opacity: 0.4,
                          }}
                        />
                        <Icon className="w-5 h-5" strokeWidth={1.8} style={{ color: social.iconColor }} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Columna 4: Mapa ── */}
            <div className="flex flex-col gap-3">
              <h3 className="font-['Cinzel',serif] text-xs font-bold uppercase tracking-[0.2em]" style={{ color: labelColor }}>
                Ubicación
              </h3>
              <div
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  border: isDark ? '1px solid rgba(139,92,246,0.25)' : '1px solid rgba(99,102,241,0.2)',
                  boxShadow: isDark ? '0 8px 32px rgba(79,70,229,0.12)' : '0 8px 28px rgba(124,58,237,0.06)',
                }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d240.78694831878516!2d-65.74656993802428!3d-19.596777875996544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e1!3m2!1ses!2sbo!4v1781274827365!5m2!1ses!2sbo"
                  className="w-full h-48 sm:h-56 border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="flex items-center justify-center gap-2 text-xs" style={{ color: descColor }}>
                <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: labelColor }} />
                <span className="text-center">Calle Días de Horopeza N° 237, Potosí</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Barra inferior ── */}
      <div
        className="relative mx-4 md:mx-8 mb-4 rounded-2xl backdrop-blur-sm"
        style={{
          background: isDark ? 'rgba(10,10,20,0.5)' : 'rgba(255,255,255,0.5)',
          border: glassBorder,
          boxShadow: glassShadow,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs" style={{ color: mutedColor }}>
            © {new Date().getFullYear()}{' '}
            <span className="font-semibold" style={{ color: labelColor }}>Museo Potosí Mineral</span>
            {' '}· Todos los derechos reservados.
          </p>
          <p className="text-xs" style={{ color: mutedColor }}>
            Hecho por chelisimo27@gmail.com en Potosí, Bolivia
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;