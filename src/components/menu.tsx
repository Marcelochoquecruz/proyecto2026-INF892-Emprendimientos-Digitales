import { useState } from 'react';
import { Calendar, Gem, MapPin, Landmark } from 'lucide-react';
import { useTheme } from './useTheme';
import { Link } from 'react-router-dom';

const menuItems = [
  {
    nivel: 'Reserva de Visitas',
    descripcion: 'Planifica tu experiencia. Habilita y reserva turnos para recorrer nuestros salones.',
    icon: Calendar,
    href: '/reservas',
  },
  {
    nivel: 'Colección Mineral & Fósiles',
    descripcion: 'Explora muestras científicas de vetas auténticas y piezas artísticas en resina.',
    icon: Gem,
    href: '/coleccion',
  },
  {
    nivel: 'Rutas y Expediciones',
    descripcion: 'Descubre las crónicas y recorridos guiados por la riqueza del Cerro Rico.',
    icon: MapPin,
    href: '/rutas',
  },
  {
    nivel: 'Nuestra Historia',
    descripcion: 'Conoce los orígenes coloniales y la evolución de la Casa Museo Potosí Mineral.',
    icon: Landmark,
    href: '/historia',
  },
];

// Colores de acento cristalinos por tarjeta (basados en la paleta Índigo Cristal)
const cardAccents = [
  {
    // Reservas → Violeta/Índigo
    ring: 'rgba(99,102,241,0.4)',
    glow: 'rgba(99,102,241,0.25)',
    iconColorDark: '#c4b5fd',
    iconColorLight: '#4f46e5',
    topBar: 'from-violet-400 to-indigo-600',
    label: 'Visitas',
    badgeDark: 'bg-violet-900/30 text-violet-300',
    badgeLight: 'bg-violet-100 text-violet-700',
  },
  {
    // Colección → Azul cristal
    ring: 'rgba(56,189,248,0.4)',
    glow: 'rgba(56,189,248,0.25)',
    iconColorDark: '#38bdf8',
    iconColorLight: '#2563eb',
    topBar: 'from-blue-400 to-blue-600',
    label: 'Minerales',
    badgeDark: 'bg-blue-900/30 text-blue-300',
    badgeLight: 'bg-blue-100 text-blue-700',
  },
  {
    // Rutas → Verde esmeralda
    ring: 'rgba(16,185,129,0.4)',
    glow: 'rgba(16,185,129,0.25)',
    iconColorDark: '#34d399',
    iconColorLight: '#047857',
    topBar: 'from-emerald-400 to-emerald-600',
    label: 'Guiadas',
    badgeDark: 'bg-emerald-900/30 text-emerald-300',
    badgeLight: 'bg-emerald-100 text-emerald-700',
  },
  {
    // Historia → Rosa cristal (reemplaza al rojo colonial, ya que el rojo no está en la paleta)
    ring: 'rgba(236,72,153,0.4)',
    glow: 'rgba(236,72,153,0.25)',
    iconColorDark: '#f472b6',
    iconColorLight: '#be185d',
    topBar: 'from-rose-400 to-rose-600',
    label: 'Colonial',
    badgeDark: 'bg-rose-900/30 text-rose-300',
    badgeLight: 'bg-rose-100 text-rose-700',
  },
];

const Menu = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // ── Paleta Índigo Cristal ──
  const pageBg = isDark
    ? 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)'
    : 'linear-gradient(135deg, #ece9ff 0%, #f8f7ff 50%, #ece9ff 100%)';
  const halo = isDark
    ? 'radial-gradient(circle at 20% 10%, rgba(139,92,246,0.12), transparent 50%)'
    : 'radial-gradient(circle at 20% 10%, rgba(139,92,246,0.10), transparent 50%)';

  const glassBg = isDark ? 'rgba(26,26,46,0.65)' : 'rgba(255,255,255,0.85)';
  const glassBorder = isDark ? '1px solid rgba(139,92,246,0.25)' : '1px solid rgba(99,102,241,0.18)';
  const glassShadow = isDark
    ? '0 8px 32px rgba(79,70,229,0.12)'
    : '0 8px 28px rgba(124,58,237,0.06)';

  const titleColor = isDark ? '#f5f3ff' : '#1e1b4b';
  const descColor = isDark ? '#c4b5fd' : '#3730a3';

  return (
    <div
      className="relative overflow-hidden transition-colors duration-500"
      style={{
        background: pageBg,
        position: 'relative',
      }}
    >
      {/* Halo índigo decorativo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: halo }}
      />

      <section className="relative py-8 sm:py-12">
        {/* Contenedor de las tarjetas con vidrio esmerilado */}
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 py-6 rounded-3xl backdrop-blur-xl"
          style={{
            background: glassBg,
            border: glassBorder,
            boxShadow: glassShadow,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <ul className="flex flex-col md:flex-row gap-5 transition-all duration-300">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isHovered = hoveredIndex === index;
              const accent = cardAccents[index];

              // Fondo de cristal específico para cada tarjeta
              const cardGlassBg = isDark
                ? `radial-gradient(circle at 30% 25%, ${accent.glow}, transparent 70%), rgba(26,26,46,0.6)`
                : `radial-gradient(circle at 30% 25%, ${accent.glow}, transparent 70%), rgba(255,255,255,0.8)`;
              const cardBorder = isDark
                ? `1px solid ${accent.ring}`
                : `1px solid ${accent.ring}`;
              const cardShadow = isDark
                ? `0 8px 28px rgba(79,70,229,0.08), 0 0 20px ${accent.glow}`
                : `0 8px 28px rgba(124,58,237,0.04), 0 0 20px ${accent.glow}`;

              return (
                <li
                  key={index}
                  className="flex-1 relative group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Link
                    to={item.href}
                    className="flex flex-col h-full items-center p-6 rounded-2xl
                      transition-all duration-300 hover:scale-[1.04] transform
                      focus-within:ring-2 focus-within:ring-[#818cf8]/50
                      relative overflow-hidden"
                    style={{
                      background: cardGlassBg,
                      border: cardBorder,
                      boxShadow: cardShadow,
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  >
                    {/* ── Barra superior con degradado (aparece en hover) ── */}
                    <div
                      className={`
                        absolute top-0 left-0 w-full h-[3px]
                        bg-gradient-to-r ${accent.topBar}
                        transform origin-left transition-transform duration-300
                        scale-x-0 group-hover:scale-x-100
                      `}
                    />

                    {/* ── Badge de categoría ── */}
                    <span
                      className={`
                        self-end text-[10px] font-bold uppercase tracking-widest
                        px-2 py-0.5 rounded-full mb-3
                        ${isDark ? accent.badgeDark : accent.badgeLight}
                      `}
                    >
                      {accent.label}
                    </span>

                    {/* ── Contenedor del ícono estilo macOS glass ── */}
                    <div
                      className="relative flex items-center justify-center
                        w-[76px] h-[76px] mb-5 rounded-[20px]
                        transition-all duration-300 group-hover:scale-110 group-hover:-rotate-1"
                      style={{
                        border: `1.5px solid ${accent.ring}`,
                        background: isDark
                          ? `radial-gradient(circle at 30% 25%, ${accent.glow}, transparent 70%), rgba(26,26,46,0.6)`
                          : `radial-gradient(circle at 30% 25%, ${accent.glow}, transparent 70%), rgba(255,255,255,0.8)`,
                        boxShadow: isHovered
                          ? `0 0 24px ${accent.glow}, inset 0 1px 1px rgba(255,255,255,0.25)`
                          : `0 0 16px ${accent.glow}, inset 0 1px 1px rgba(255,255,255,0.25)`,
                      }}
                    >
                      {/* Reflejo superior glass */}
                      <span
                        className="absolute top-0 left-0 w-full h-1/2 rounded-[20px] pointer-events-none"
                        style={{
                          background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)',
                          opacity: 0.4,
                        }}
                      />
                      <Icon
                        size={32}
                        strokeWidth={1.8}
                        className="relative transition-all duration-300 drop-shadow-sm group-hover:scale-105"
                        style={{
                          color: isDark ? accent.iconColorDark : accent.iconColorLight,
                          filter: isHovered ? `drop-shadow(0 0 8px ${accent.glow})` : 'none',
                        }}
                      />
                    </div>

                    {/* ── Título ── */}
                    <h2
                      className="font-['Cinzel',serif] text-base font-bold text-center mb-2 leading-snug tracking-tight transition-colors duration-300"
                      style={{ color: titleColor }}
                    >
                      {item.nivel}
                    </h2>

                    {/* ── Descripción ── */}
                    <p
                      className="text-xs font-normal text-center leading-relaxed transition-colors duration-300"
                      style={{ color: descColor }}
                    >
                      {item.descripcion}
                    </p>

                    {/* ── Separador decorativo ── */}
                    <div
                      className={`
                        mt-4 w-8 h-[2px] rounded-full
                        bg-gradient-to-r ${accent.topBar}
                        opacity-0 group-hover:opacity-100
                        transition-opacity duration-300
                      `}
                    />

                    {/* ── Resplandor decorativo en esquina inferior derecha ── */}
                    <div
                      className={`
                        absolute bottom-0 right-0 w-24 h-24 rounded-full
                        -mr-10 -mb-10
                        bg-gradient-to-br ${accent.topBar}
                        opacity-0 group-hover:opacity-10
                        scale-0 group-hover:scale-100
                        transition-all duration-500
                      `}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Menu;