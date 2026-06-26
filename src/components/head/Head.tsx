import logoMuseo from '../../assets/logo.png';

/**
 * ─── PALETA ÍNDIGO CRISTAL ───────────────────────────────────────────────────
 * Acento principal   : #818cf8  (índigo 400)
 * Acento brillante   : #a5b4fc  (índigo 300)
 * Acento profundo    : #4f46e5  (índigo 600)
 * Fondo oscuro base  : #0f0f1a
 * Fondo medio        : #13131f  /  #1a1a2e
 * Fondo claro base   : #f8f7ff
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * TIPOGRAFÍA
 * Display / logotipo : Cinzel (serif clásico, cargado vía Google Fonts en index.html)
 * Subtítulos         : Cinzel Decorative o Cinzel normal, tracking amplio
 * Tamaños:
 *   - Nombre museo   : 1.5rem  (24px)  font-semibold
 *   - Subtítulo logo : 0.625rem (10px)  tracking-[0.3em]
 *   - Título central : 1.25rem (20px)  tracking-[0.35em]
 *   - Subtítulo cent.: 0.625rem (10px)  tracking-[0.25em]
 */

const Head = () => {
  return (
    <header className="w-full relative overflow-hidden transition-colors duration-500
      dark:bg-[#0f0f1a]
      bg-[#f0eeff]
    ">

      {/* ── Capa de degradado de fondo (modo oscuro) ── */}
      <div className="
        absolute inset-0 pointer-events-none
        dark:bg-gradient-to-r dark:from-[#0f0f1a] dark:via-[#1a1a2e] dark:to-[#0f0f1a]
        bg-gradient-to-r from-[#ece9ff] via-[#f8f7ff] to-[#ece9ff]
      " />

      {/* ── Brillo central sutil (halo índigo) ── */}
      <div className="
        absolute inset-0 pointer-events-none
        dark:[background:radial-gradient(ellipse_60%_120%_at_50%_0%,rgba(129,140,248,0.08)_0%,transparent_70%)]
        [background:radial-gradient(ellipse_60%_120%_at_50%_0%,rgba(99,102,241,0.07)_0%,transparent_70%)]
      " />

      {/* ── Línea decorativa superior — rayo índigo ── */}
      <div className="
        relative h-[2px]
        dark:bg-gradient-to-r dark:from-transparent dark:via-[#818cf8] dark:to-transparent
        bg-gradient-to-r from-transparent via-[#6366f1] to-transparent
        dark:opacity-70 opacity-50
      " />

      {/* ── Contenido principal ── */}
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex items-center h-[76px] gap-6">

          {/* ════ LOGO ════ */}
          <a
            href="/"
            className="flex items-center gap-3 group shrink-0 select-none"
            aria-label="Inicio — Casa Museo Potosí Mineral"
          >
            {/* Anillo exterior con brillo índigo */}
            <div className="relative">
              <div className="
                absolute inset-0 rounded-full blur-md
                dark:bg-gradient-to-br dark:from-[#818cf8] dark:to-[#4f46e5]
                bg-gradient-to-br from-[#6366f1] to-[#4338ca]
                opacity-0 group-hover:opacity-40 transition-opacity duration-500
              " />

              {/* Borde con degradado índigo */}
              <div className="
                relative w-14 h-14 rounded-full p-[2.5px]
                dark:bg-gradient-to-br dark:from-[#a5b4fc] dark:via-[#818cf8] dark:to-[#4f46e5]
                bg-gradient-to-br from-[#818cf8] via-[#6366f1] to-[#4338ca]
                shadow-[0_0_16px_rgba(129,140,248,0.25)]
                group-hover:shadow-[0_0_24px_rgba(129,140,248,0.45)]
                transition-shadow duration-500
              ">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden shadow-inner">
                  <img
                    src={logoMuseo}
                    alt="Logo Casa Museo Potosí Mineral"
                    className="w-full h-full rounded-full object-contain
                      transition-transform duration-500
                      group-hover:scale-105 group-hover:rotate-3"
                  />
                </div>
              </div>
            </div>

            {/* Nombre del museo */}
            <div className="leading-tight">
              <h1
                className="
                  text-[1.5rem] font-semibold uppercase tracking-[0.18em] leading-none
                  dark:text-[#e0e7ff]
                  text-[#1e1b4b]
                  dark:drop-shadow-[0_0_12px_rgba(165,180,252,0.3)]
                  drop-shadow-none
                  transition-colors duration-300
                "
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Potosí
              </h1>

              <div className="flex items-center gap-2 mt-[5px]">
                <span className="h-px w-5 dark:bg-[#4f46e5] bg-[#818cf8]" />
                <p
                  className="
                    text-[0.625rem] uppercase tracking-[0.28em] leading-none
                    dark:text-[#a5b4fc] text-[#4f46e5]
                    transition-colors duration-300
                  "
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Mineral
                </p>
                <span className="h-px w-5 dark:bg-[#4f46e5] bg-[#818cf8]" />
              </div>
            </div>
          </a>

          {/* ════ TÍTULO CENTRAL ════ */}
          <div className="flex-1 flex flex-col items-center justify-center gap-1 select-none">

            {/* Líneas decorativas flanqueando el título */}
            <div className="flex items-center gap-4 w-full justify-center">
              <div className="hidden sm:block h-px flex-1 max-w-[80px]
                dark:bg-gradient-to-r dark:from-transparent dark:to-[#4f46e5]
                bg-gradient-to-r from-transparent to-[#818cf8]
                opacity-60"
              />

              <h2
                className="
                  text-[1.1rem] md:text-[1.25rem] uppercase tracking-[0.35em] leading-none font-medium
                  dark:text-[#e0e7ff] text-[#1e1b4b]
                  transition-colors duration-300
                "
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Casa Museo
              </h2>

              <div className="hidden sm:block h-px flex-1 max-w-[80px]
                dark:bg-gradient-to-l dark:from-transparent dark:to-[#4f46e5]
                bg-gradient-to-l from-transparent to-[#818cf8]
                opacity-60"
              />
            </div>

            {/* Puntos decorativos + subtítulo */}
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full dark:bg-[#818cf8] bg-[#6366f1] opacity-60" />
              <p
                className="
                  text-[0.625rem] uppercase tracking-[0.28em] leading-none
                  dark:text-[#6366f1] text-[#6366f1]
                  dark:opacity-80 opacity-70
                  transition-colors duration-300
                "
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Artesanías & Minerales
              </p>
              <span className="w-1 h-1 rounded-full dark:bg-[#818cf8] bg-[#6366f1] opacity-60" />
            </div>
          </div>

          {/* Espaciador equilibrador (mismo ancho que el logo) */}
          <div className="w-[148px] shrink-0" />

        </div>
      </div>

      {/* ── Línea decorativa inferior — degradado índigo con partícula central ── */}
      <div className="relative h-[1.5px]
        dark:bg-gradient-to-r dark:from-transparent dark:via-[#4f46e5] dark:to-transparent
        bg-gradient-to-r from-transparent via-[#818cf8] to-transparent
        dark:opacity-60 opacity-40
      ">
        {/* Punto brillante central */}
        <div className="
          absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
          w-2 h-2 rounded-full
          dark:bg-[#a5b4fc] bg-[#818cf8]
          dark:shadow-[0_0_8px_3px_rgba(165,180,252,0.5)]
          shadow-[0_0_6px_2px_rgba(99,102,241,0.4)]
        " />
      </div>

    </header>
  );
};

export default Head;