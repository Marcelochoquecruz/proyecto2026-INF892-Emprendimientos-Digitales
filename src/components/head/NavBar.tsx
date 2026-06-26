import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logoMuseo from '../../assets/logo.png';
import {
  FaMoon,
  FaSun,
  FaBars,
  FaSearch,
  FaShoppingCart,
  FaTimes,
  FaHome,
  FaCalendarAlt,
  FaPalette,
  FaGem,
  FaMapMarkedAlt,
  FaLandmark,
  FaUserShield,
} from 'react-icons/fa';
import { useTheme } from '../useTheme';

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const location = useLocation();

  const menuItems = [
    { text: 'Inicio', link: '/', icon: FaHome },
    { text: 'Reserva de Visitas', link: '/reservas', icon: FaCalendarAlt },
    { text: 'Catálogo de Productos Artesanales', link: '/shop', icon: FaPalette },
    { text: 'Colección Mineral & Fósiles', link: '/coleccion-publica', icon: FaGem },
    { text: 'Rutas y Expediciones', link: '/rutas', icon: FaMapMarkedAlt },
    { text: 'Nuestra Historia', link: '/historia', icon: FaLandmark },
  ];

  const cartCount = 0;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ── Paleta Índigo Cristal ──
  const pageBg = isDark
    ? 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)'
    : 'linear-gradient(135deg, #ece9ff 0%, #f8f7ff 50%, #ece9ff 100%)';
  const halo = isDark
    ? 'radial-gradient(circle at 20% 10%, rgba(139,92,246,0.12), transparent 50%)'
    : 'radial-gradient(circle at 20% 10%, rgba(139,92,246,0.10), transparent 50%)';

  const glassBg = isDark ? 'rgba(26,26,46,0.75)' : 'rgba(255,255,255,0.85)';
  const glassBorder = isDark ? '1px solid rgba(139,92,246,0.25)' : '1px solid rgba(99,102,241,0.18)';
  const glassShadow = isDark
    ? '0 8px 32px rgba(79,70,229,0.15)'
    : '0 8px 28px rgba(124,58,237,0.08)';

  const titleColor = isDark ? '#f5f3ff' : '#1e1b4b';
  const labelColor = isDark ? '#a5b4fc' : '#4f46e5';
  const inputBg = isDark ? 'rgba(26,26,46,0.6)' : 'rgba(255,255,255,0.8)';

  const glassRing = isDark ? 'rgba(139,92,246,0.4)' : 'rgba(99,102,241,0.3)';
  const glassGlow = isDark ? 'rgba(139,92,246,0.2)' : 'rgba(99,102,241,0.15)';

  const themeTooltip = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 w-full z-50 transition-all duration-500"
        style={{
          background: scrolled ? glassBg : pageBg,
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled
            ? glassBorder
            : isDark
              ? '1px solid rgba(139,92,246,0.10)'
              : '1px solid rgba(99,102,241,0.08)',
          boxShadow: scrolled ? glassShadow : 'none',
        }}
      >
        {/* Halo decorativo */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: halo }}
        />

        {/* Línea decorativa superior */}
        <div
          className="h-[1.5px] bg-gradient-to-r from-transparent via-[#818cf8] to-transparent opacity-40 dark:opacity-30"
          style={{ background: 'linear-gradient(90deg, transparent, #818cf8, transparent)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-3">
          <div className="flex items-center justify-between gap-4">

            {/* ─── IZQUIERDA: Hamburguesa + Logo ─── */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Botón hamburguesa – glass + hover animation */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="relative p-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818cf8]/50"
                style={{
                  border: `1.5px solid ${glassRing}`,
                  background: isDark
                    ? `radial-gradient(circle at 30% 25%, ${glassGlow}, transparent 70%), rgba(26,26,46,0.6)`
                    : `radial-gradient(circle at 30% 25%, ${glassGlow}, transparent 70%), rgba(255,255,255,0.8)`,
                  boxShadow: `0 0 14px ${glassGlow}, inset 0 1px 1px rgba(255,255,255,0.25)`,
                  color: isDark ? '#c4b5fd' : '#4f46e5',
                }}
                title="Menú"
                aria-label="Abrir menú"
              >
                <span
                  className="absolute top-0 left-0 w-full h-1/2 rounded-full pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
                    opacity: 0.4,
                  }}
                />
                <FaBars size={18} />
              </motion.button>

              {/* Logo con animación de hover */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`transition-all duration-500 ease-out overflow-hidden ${
                  scrolled
                    ? 'max-w-[200px] opacity-100 translate-x-0'
                    : 'max-w-0 opacity-0 -translate-x-6'
                }`}
              >
                <Link
                  to="/"
                  className="flex items-center gap-2.5 group whitespace-nowrap"
                  title="Ir al inicio"
                >
                  <div className="relative">
                    <div
                      className="absolute inset-0 rounded-full blur-md transition-all duration-500"
                      style={{
                        background: isDark
                          ? 'rgba(139,92,246,0.25)'
                          : 'rgba(99,102,241,0.15)',
                      }}
                    />
                    <div
                      className="relative w-10 h-10 rounded-full p-[2px] transition-all duration-500"
                      style={{
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        boxShadow: '0 0 20px rgba(99,102,241,0.3)',
                      }}
                    >
                      <div className="w-full h-full rounded-full bg-white dark:bg-[#0f0f1a] p-0.5">
                        <img
                          src={logoMuseo}
                          alt="Logo"
                          className="w-full h-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block leading-tight">
                    <h1
                      className="text-base md:text-lg font-semibold uppercase tracking-wider"
                      style={{ fontFamily: 'Cinzel, serif', color: titleColor }}
                    >
                      Potosí
                    </h1>
                    <p
                      className="text-[8px] uppercase tracking-[0.25em]"
                      style={{ fontFamily: 'Cinzel, serif', color: labelColor }}
                    >
                      Mineral
                    </p>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* ─── CENTRO: Búsqueda ─── */}
            <div className="flex-1 max-w-xl relative hidden md:block">
              <div
                className={`relative transition-all duration-300 ${
                  searchFocused ? 'scale-[1.02]' : ''
                }`}
                style={{
                  background: inputBg,
                  borderRadius: '9999px',
                  border: searchFocused
                    ? `2px solid ${isDark ? '#818cf8' : '#6366f1'}`
                    : `1px solid ${isDark ? 'rgba(139,92,246,0.25)' : 'rgba(99,102,241,0.20)'}`,
                  boxShadow: searchFocused
                    ? `0 0 20px ${isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)'}`
                    : 'none',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              >
                <input
                  type="text"
                  placeholder="Buscar minerales, arte, expediciones..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`w-full bg-transparent border-none py-2.5 pl-5 pr-12 rounded-full text-sm outline-none transition-all ${
                    isDark ? 'placeholder-[#a5b4fc]/60' : 'placeholder-[#4f46e5]/50'
                  }`}
                  style={{
                    color: titleColor,
                    fontFamily: 'Cinzel, serif',
                  }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="transition-all duration-300"
                    style={{ color: labelColor }}
                    title="Buscar"
                    aria-label="Buscar"
                  >
                    <FaSearch size={14} />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* ─── DERECHA: Inicio + Carrito + Tema ─── */}
            <div className="flex items-center gap-1 md:gap-2 shrink-0">

              {/* Botón Inicio – glass + hover */}
              <motion.div
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/"
                  className="relative flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818cf8]/50"
                  style={{
                    border: `1.5px solid ${glassRing}`,
                    background: isDark
                      ? `radial-gradient(circle at 30% 25%, ${glassGlow}, transparent 70%), rgba(26,26,46,0.6)`
                      : `radial-gradient(circle at 30% 25%, ${glassGlow}, transparent 70%), rgba(255,255,255,0.8)`,
                    boxShadow: `0 0 14px ${glassGlow}, inset 0 1px 1px rgba(255,255,255,0.25)`,
                    color: isDark ? '#c4b5fd' : '#4f46e5',
                  }}
                  title="Volver a la página de inicio"
                >
                  <span
                    className="absolute top-0 left-0 w-full h-1/2 rounded-full pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
                      opacity: 0.4,
                    }}
                  />
                  <FaHome size={14} className="text-[#818cf8] dark:text-[#a5b4fc]" />
                  <span className="hidden sm:inline">Inicio</span>
                </Link>
              </motion.div>

              {/* Carrito – glass + hover */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818cf8]/50"
                style={{
                  border: `1.5px solid ${glassRing}`,
                  background: isDark
                    ? `radial-gradient(circle at 30% 25%, ${glassGlow}, transparent 70%), rgba(26,26,46,0.6)`
                    : `radial-gradient(circle at 30% 25%, ${glassGlow}, transparent 70%), rgba(255,255,255,0.8)`,
                  boxShadow: `0 0 14px ${glassGlow}, inset 0 1px 1px rgba(255,255,255,0.25)`,
                  color: isDark ? '#c4b5fd' : '#4f46e5',
                }}
                title="Ver carrito de compras"
                aria-label="Ver carrito de compras"
              >
                <span
                  className="absolute top-0 left-0 w-full h-1/2 rounded-full pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
                    opacity: 0.4,
                  }}
                />
                <FaShoppingCart size={18} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 text-white text-[9px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center font-bold shadow-md border-2 border-white dark:border-[#0f0f1a]"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Toggle tema – glass + hover con rotación */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="relative p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818cf8]/50"
                style={{
                  border: `1.5px solid ${glassRing}`,
                  background: isDark
                    ? `radial-gradient(circle at 30% 25%, ${glassGlow}, transparent 70%), rgba(26,26,46,0.6)`
                    : `radial-gradient(circle at 30% 25%, ${glassGlow}, transparent 70%), rgba(255,255,255,0.8)`,
                  boxShadow: `0 0 14px ${glassGlow}, inset 0 1px 1px rgba(255,255,255,0.25)`,
                  color: isDark ? '#c4b5fd' : '#4f46e5',
                }}
                title={themeTooltip}
                aria-label="Cambiar tema"
              >
                <span
                  className="absolute top-0 left-0 w-full h-1/2 rounded-full pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
                    opacity: 0.4,
                  }}
                />
                {isDark ? <FaSun size={18} /> : <FaMoon size={18} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Línea decorativa inferior */}
        <div
          className="h-[1.5px]"
          style={{
            background: 'linear-gradient(90deg, transparent, #818cf8, transparent)',
            opacity: isDark ? 0.3 : 0.4,
          }}
        />
      </motion.nav>

      {/* ═══════════════════ SIDEBAR ═══════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            />

            {/* Panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 left-0 h-full w-[320px] max-w-[85vw] z-[70] shadow-2xl flex flex-col"
              style={{
                background: glassBg,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRight: glassBorder,
                boxShadow: glassShadow,
              }}
            >
              {/* Header del sidebar */}
              <div
                className="p-6 flex items-center justify-between relative"
                style={{
                  borderBottom: isDark
                    ? '1px solid rgba(139,92,246,0.15)'
                    : '1px solid rgba(99,102,241,0.10)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="absolute inset-0 rounded-full blur-md"
                      style={{
                        background: isDark
                          ? 'rgba(139,92,246,0.25)'
                          : 'rgba(99,102,241,0.15)',
                      }}
                    />
                    <div
                      className="relative w-12 h-12 rounded-full p-[2px]"
                      style={{
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        boxShadow: '0 0 20px rgba(99,102,241,0.3)',
                      }}
                    >
                      <div className="w-full h-full rounded-full bg-white dark:bg-[#0f0f1a] p-0.5">
                        <img
                          src={logoMuseo}
                          alt="Logo"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="leading-tight">
                    <span
                      className="block text-lg font-semibold uppercase tracking-wider"
                      style={{ fontFamily: 'Cinzel, serif', color: titleColor }}
                    >
                      Potosí
                    </span>
                    <span
                      className="block text-[9px] uppercase tracking-[0.25em]"
                      style={{ fontFamily: 'Cinzel, serif', color: labelColor }}
                    >
                      Mineral
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="relative p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#818cf8]/50"
                  style={{
                    border: `1.5px solid ${glassRing}`,
                    background: isDark
                      ? `radial-gradient(circle at 30% 25%, ${glassGlow}, transparent 70%), rgba(26,26,46,0.6)`
                      : `radial-gradient(circle at 30% 25%, ${glassGlow}, transparent 70%), rgba(255,255,255,0.8)`,
                    boxShadow: `0 0 14px ${glassGlow}, inset 0 1px 1px rgba(255,255,255,0.25)`,
                    color: isDark ? '#c4b5fd' : '#4f46e5',
                  }}
                  aria-label="Cerrar menú"
                >
                  <span
                    className="absolute top-0 left-0 w-full h-1/2 rounded-full pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
                      opacity: 0.4,
                    }}
                  />
                  <FaTimes size={18} />
                </motion.button>
              </div>

              {/* Menú con hover en cada ítem */}
              <nav className="flex-1 overflow-y-auto py-6 px-4">
                <p
                  className={`px-4 mb-3 text-[10px] uppercase tracking-[0.3em] ${
                    isDark ? 'text-[#a5b4fc]/60' : 'text-[#4f46e5]/50'
                  }`}
                >
                  Navegación
                </p>

                <div className="flex flex-col gap-1">
                  {menuItems.map((item, idx) => {
                    const isActive = location.pathname === item.link;
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.link}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02, x: 6 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative"
                        >
                          <Link
                            to={item.link}
                            onClick={() => setIsOpen(false)}
                            className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                              isActive
                                ? isDark ? 'text-[#c4b5fd]' : 'text-[#4f46e5]'
                                : isDark ? 'text-[#c4b5fd] hover:text-white hover:bg-white/5' : 'text-[#3730a3] hover:text-[#4f46e5] hover:bg-[#4f46e5]/5'
                            }`}
                            style={{
                              background: isActive
                                ? isDark
                                  ? 'rgba(99,102,241,0.15)'
                                  : 'rgba(99,102,241,0.08)'
                                : 'transparent',
                            }}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="activeIndicator"
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                                style={{
                                  background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                                  boxShadow: '0 0 12px rgba(99,102,241,0.4)',
                                }}
                              />
                            )}

                            <Icon
                              size={16}
                              className={`transition-colors duration-300 ${
                                isActive
                                  ? ''
                                  : isDark ? 'text-[#a5b4fc]/60 group-hover:text-white' : 'text-[#4f46e5]/50 group-hover:text-[#4f46e5]'
                              }`}
                              style={isActive ? { color: isDark ? '#c4b5fd' : '#4f46e5' } : undefined}
                            />

                            <span
                              className="text-sm font-medium tracking-wide transition-colors duration-300"
                              style={{ fontFamily: 'Cinzel, serif' }}
                            >
                              {item.text}
                            </span>
                          </Link>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Separador */}
                <div
                  className="my-5 mx-4 h-px"
                  style={{
                    background: isDark
                      ? 'linear-gradient(90deg, transparent, rgba(139,92,246,0.2), transparent)'
                      : 'linear-gradient(90deg, transparent, rgba(99,102,241,0.15), transparent)',
                  }}
                />

                {/* Admin */}
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                      isDark ? 'text-[#c4b5fd] hover:text-white hover:bg-white/5' : 'text-[#3730a3] hover:text-[#4f46e5] hover:bg-[#4f46e5]/5'
                    }`}
                  >
                    <FaUserShield
                      size={16}
                      className={`transition-colors duration-300 ${
                        isDark ? 'text-[#a5b4fc]/60 group-hover:text-white' : 'text-[#4f46e5]/50 group-hover:text-[#4f46e5]'
                      }`}
                    />
                    <span
                      className="text-sm tracking-wide transition-colors duration-300"
                      style={{ fontFamily: 'Cinzel, serif' }}
                    >
                      Gestión Administrativa
                    </span>
                  </Link>
                </motion.div>
              </nav>

              {/* Footer del sidebar */}
              <div
                className="p-5"
                style={{
                  borderTop: isDark
                    ? '1px solid rgba(139,92,246,0.15)'
                    : '1px solid rgba(99,102,241,0.10)',
                  background: isDark
                    ? 'rgba(26,26,46,0.4)'
                    : 'rgba(255,255,255,0.4)',
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <span
                    className="h-px w-8"
                    style={{
                      background: isDark
                        ? 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3))'
                        : 'linear-gradient(90deg, transparent, rgba(99,102,241,0.2))',
                    }}
                  />
                  <p
                    className={`text-[10px] uppercase tracking-[0.3em] ${
                      isDark ? 'text-[#a5b4fc]/60' : 'text-[#4f46e5]/50'
                    }`}
                    style={{ fontFamily: 'Cinzel, serif' }}
                  >
                    Casa Museo
                  </p>
                  <span
                    className="h-px w-8"
                    style={{
                      background: isDark
                        ? 'linear-gradient(270deg, transparent, rgba(139,92,246,0.3))'
                        : 'linear-gradient(270deg, transparent, rgba(99,102,241,0.2))',
                    }}
                  />
                </div>
                <p
                  className={`text-center text-[9px] uppercase tracking-[0.25em] mt-1 ${
                    isDark ? 'text-[#a5b4fc]/60' : 'text-[#4f46e5]/50'
                  }`}
                >
                  Artesanías & Minerales
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
