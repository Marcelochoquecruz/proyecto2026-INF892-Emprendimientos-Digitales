import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTheme } from './useTheme';
import slider1 from '../assets/slider1.png';
import slider2 from '../assets/slider2.png';
import slider3 from '../assets/slider3.png';
import slider4 from '../assets/slider4.png';

interface SlideData {
  image: string;
  titulo: string;
  descripcion: string;
}

const Carrousel: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [index, setIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const data: SlideData[] = [
    {
      image: slider1,
      titulo: 'Casa Museo Potosí Mineral',
      descripcion:
        'Un espacio cultural interactivo donde el arte, la historia y la riqueza mineralógica del Cerro Rico de Potosí se unen para ofrecer una experiencia patrimonial única.',
    },
    {
      image: slider2,
      titulo: 'Cuadros Decorativos y Arte',
      descripcion:
        'Obras artísticas exclusivas inspiradas en la identidad potosina, creadas con minerales naturales y pigmentos que resaltan la geología de la región.',
    },
    {
      image: slider3,
      titulo: 'Patrimonio de Potosí',
      descripcion:
        'Explora la profunda historia minera que convirtió a nuestra ciudad en un pilar económico global, documentada en maquetas e ilustraciones históricas.',
    },
    {
      image: slider4,
      titulo: 'Exhibición Geológica',
      descripcion:
        'Admira una imponente colección de cristales, muestras de vetas auténticas y piezas mineralógicas cuidadosamente clasificadas en nuestros salones.',
    },
  ];

  const changeSlide = (newIndex: number) => {
    setFade(false);
    setTimeout(() => {
      setIndex(newIndex);
      setFade(true);
    }, 300);
  };

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      changeSlide((index + 1) % data.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [index, data.length, isHovered]);

  const handlePrev = () => {
    changeSlide((index - 1 + data.length) % data.length);
  };

  const handleNext = () => {
    changeSlide((index + 1) % data.length);
  };

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
    ? '0 8px 32px rgba(79,70,229,0.15)'
    : '0 8px 28px rgba(124,58,237,0.08)';

  const titleColor = isDark ? '#f5f3ff' : '#1e1b4b';
  const descColor = isDark ? '#c4b5fd' : '#3730a3';
  const labelColor = isDark ? '#a5b4fc' : '#4f46e5';

  return (
    <section
      className="w-full py-6 sm:py-8 transition-colors duration-500 relative overflow-hidden"
      style={{
        background: pageBg,
        position: 'relative',
      }}
    >
      {/* Halo decorativo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: halo }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Contenedor principal con vidrio esmerilado */}
        <div
          className="grid lg:grid-cols-2 overflow-hidden rounded-2xl backdrop-blur-xl transition-all duration-500"
          style={{
            background: glassBg,
            border: glassBorder,
            boxShadow: glassShadow,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {/* ═══ BLOQUE IZQUIERDO: Imagen con Controles ═══ */}
          <div
            className="relative h-[220px] sm:h-[300px] lg:h-[360px] bg-[#0a0e27] overflow-hidden group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={data[index].image}
              alt={data[index].titulo}
              className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                fade ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            />

            {/* Efecto de difuminado en los bordes */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/40 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/40 to-transparent" />
            </div>

            {/* Contador de posición (estilo glass) */}
            <div
              className="absolute top-4 right-4 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium tracking-wider shadow-lg flex items-center gap-1"
              style={{
                background: isDark
                  ? 'rgba(26,26,46,0.7)'
                  : 'rgba(255,255,255,0.25)',
                border: isDark
                  ? '1px solid rgba(139,92,246,0.3)'
                  : '1px solid rgba(255,255,255,0.4)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{ color: isDark ? '#a5b4fc' : '#4f46e5' }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-white/60 dark:text-white/40">/</span>
              <span className="text-white/90 dark:text-white/70">
                {String(data.length).padStart(2, '0')}
              </span>
            </div>

            {/* Botón Izquierdo (estilo macOS glass) */}
            <button
              onClick={handlePrev}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full
                flex items-center justify-center z-20 shadow-xl transition-all duration-300
                hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#818cf8]/50"
              style={{
                background: isDark
                  ? 'radial-gradient(circle at 30% 25%, rgba(139,92,246,0.15), rgba(139,92,246,0.05) 70%), rgba(26,26,46,0.6)'
                  : 'radial-gradient(circle at 30% 25%, rgba(99,102,241,0.10), rgba(99,102,241,0.02) 70%), rgba(255,255,255,0.8)',
                border: isDark
                  ? '1.5px solid rgba(139,92,246,0.4)'
                  : '1.5px solid rgba(99,102,241,0.3)',
                boxShadow: isDark
                  ? '0 0 16px rgba(139,92,246,0.15), inset 0 1px 1px rgba(255,255,255,0.15)'
                  : '0 0 16px rgba(99,102,241,0.08), inset 0 1px 1px rgba(255,255,255,0.4)',
              }}
              title="Anterior"
              aria-label="Diapositiva anterior"
            >
              <span
                className="absolute top-0 left-0 w-full h-1/2 rounded-full pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
                  opacity: 0.4,
                }}
              />
              <FaChevronLeft
                size={14}
                style={{ color: isDark ? '#c4b5fd' : '#4f46e5' }}
              />
            </button>

            {/* Botón Derecho (estilo macOS glass) */}
            <button
              onClick={handleNext}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full
                flex items-center justify-center z-20 shadow-xl transition-all duration-300
                hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#818cf8]/50"
              style={{
                background: isDark
                  ? 'radial-gradient(circle at 30% 25%, rgba(139,92,246,0.15), rgba(139,92,246,0.05) 70%), rgba(26,26,46,0.6)'
                  : 'radial-gradient(circle at 30% 25%, rgba(99,102,241,0.10), rgba(99,102,241,0.02) 70%), rgba(255,255,255,0.8)',
                border: isDark
                  ? '1.5px solid rgba(139,92,246,0.4)'
                  : '1.5px solid rgba(99,102,241,0.3)',
                boxShadow: isDark
                  ? '0 0 16px rgba(139,92,246,0.15), inset 0 1px 1px rgba(255,255,255,0.15)'
                  : '0 0 16px rgba(99,102,241,0.08), inset 0 1px 1px rgba(255,255,255,0.4)',
              }}
              title="Siguiente"
              aria-label="Siguiente diapositiva"
            >
              <span
                className="absolute top-0 left-0 w-full h-1/2 rounded-full pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
                  opacity: 0.4,
                }}
              />
              <FaChevronRight
                size={14}
                style={{ color: isDark ? '#c4b5fd' : '#4f46e5' }}
              />
            </button>

            {/* Indicadores de navegación (estilo glass) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {data.map((_, i) => (
                <button
                  key={i}
                  onClick={() => changeSlide(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 shadow-md focus:outline-none backdrop-blur-md ${
                    i === index
                      ? 'w-10'
                      : 'w-2.5 hover:scale-110'
                  }`}
                  style={{
                    background: i === index
                      ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                      : isDark
                        ? 'rgba(255,255,255,0.25)'
                        : 'rgba(99,102,241,0.25)',
                    border: i === index
                      ? '1px solid rgba(139,92,246,0.5)'
                      : isDark
                        ? '1px solid rgba(255,255,255,0.15)'
                        : '1px solid rgba(99,102,241,0.15)',
                    boxShadow: i === index
                      ? '0 0 12px rgba(99,102,241,0.3)'
                      : 'none',
                  }}
                  aria-label={`Ir a diapositiva ${i + 1}`}
                  aria-current={i === index ? 'true' : 'false'}
                />
              ))}
            </div>
          </div>

          {/* ═══ BLOQUE DERECHO: Información y Acciones (vidrio esmerilado) ═══ */}
          <div
            className="flex flex-col justify-center p-5 sm:p-6 lg:p-10 transition-all duration-500"
            style={{
              background: isDark
                ? 'radial-gradient(circle at 30% 25%, rgba(99,102,241,0.05), transparent 70%), rgba(26,26,46,0.4)'
                : 'radial-gradient(circle at 30% 25%, rgba(99,102,241,0.03), transparent 70%), rgba(255,255,255,0.6)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              borderLeft: isDark
                ? '1px solid rgba(139,92,246,0.15)'
                : '1px solid rgba(99,102,241,0.10)',
            }}
          >
            <div
              className={`transition-all duration-500 ease-out ${
                fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {/* Etiqueta "Bienvenidos" */}
              <span
                className="uppercase tracking-[0.3em] text-xs mb-3 block font-semibold"
                style={{
                  fontFamily: 'Cinzel, serif',
                  color: labelColor,
                }}
              >
                Bienvenidos
              </span>

              {/* Título */}
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 leading-tight"
                style={{
                  fontFamily: 'Cinzel, serif',
                  color: titleColor,
                }}
              >
                {data[index].titulo}
              </h2>

              {/* Línea decorativa (gradiente índigo) */}
              <div
                className="w-20 h-1 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a78bfa] rounded-full mb-5"
                style={{
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)',
                }}
              />

              {/* Descripción */}
              <p
                className="text-sm sm:text-base leading-relaxed mb-8 min-h-[80px] font-medium"
                style={{ color: descColor }}
              >
                {data[index].descripcion}
              </p>

              {/* Botones de acción (estilo Índigo Cristal) */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/coleccion-publica"
                  className="px-5 py-2.5 text-sm rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#818cf8]/50"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    boxShadow: '0 0 20px rgba(99,102,241,0.3)',
                    color: '#fff',
                    border: 'none',
                  }}
                >
                  Explorar Colección
                </Link>

                <Link
                  to="/reservas"
                  className="px-5 py-2.5 text-sm rounded-lg font-semibold
                    transition-all duration-300 hover:scale-105
                    focus:outline-none focus:ring-2 focus:ring-[#818cf8]/50"
                  style={{
                    background: 'transparent',
                    border: isDark
                      ? '2px solid rgba(139,92,246,0.5)'
                      : '2px solid rgba(99,102,241,0.4)',
                    color: isDark ? '#c4b5fd' : '#4f46e5',
                  }}
                >
                  Reservar Visita
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carrousel;
