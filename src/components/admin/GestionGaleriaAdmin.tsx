import React, { useState } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { PlusCircle, Gem, Bone, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '../../components/useTheme';

export const GestionGaleriaAdmin: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [tipo, setTipo] = useState<'mineral' | 'fossil'>('mineral');
  const [nombreComun, setNombreComun] = useState('');
  const [nombreCientifico, setNombreCientifico] = useState('');
  const [procedencia, setProcedencia] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [formulaQuimica, setFormulaQuimica] = useState('');
  const [color, setColor] = useState('');
  const [dureza, setDureza] = useState('');
  const [eraGeologica, setEraGeologica] = useState('');
  const [guardando, setGuardando] = useState(false);

  // URLs directas de tus imágenes de Minerales seleccionadas
  const imagenesMinerales = [
    'https://images.unsplash.com/photo-1599940778173-e276d4acb2bb?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1535401991443-012ae354bc85?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1603827457577-309ed85285af?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1550852826-5369a2d5e585?w=600&auto=format&fit=crop&q=60'
  ];

  // URLs directas de tus imágenes de Fósiles seleccionadas
  const imagenesFosiles = [
    'https://images.unsplash.com/photo-1505066211222-7577577515c1?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1707048945763-f3c8e3cca24a?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1631631648875-87ba160d9329?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1711075741270-b71059da26c5?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1543336520-4ee3044af16a?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1631631648773-fbfe9872ca70?w=600&auto=format&fit=crop&q=60'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreComun || !nombreCientifico || !procedencia || !descripcion) {
      alert('Por favor, rellene todos los campos obligatorios.');
      return;
    }

    setGuardando(true);

    try {
      // Selección aleatoria de imagen según categoría
      const pool = tipo === 'mineral' ? imagenesMinerales : imagenesFosiles;
      const urlAleatoria = pool[Math.floor(Math.random() * pool.length)];

      const nuevaPieza: any = {
        tipo,
        nombreComun,
        nombreCientifico,
        procedencia,
        descripcion,
        imagenUrl: urlAleatoria,
        fechaRegistro: new Date().toISOString().split('T')[0]
      };

      if (tipo === 'mineral') {
        nuevaPieza.formulaQuimica = formulaQuimica || 'N/A';
        nuevaPieza.color = color || 'N/A';
        nuevaPieza.dureza = dureza || 'N/A';
      } else {
        nuevaPieza.eraGeologica = eraGeologica || 'N/A';
      }

      await addDoc(collection(db, 'galeria_museo'), nuevaPieza);

      // Limpiar formulario
      setNombreComun('');
      setNombreCientifico('');
      setProcedencia('');
      setDescripcion('');
      setFormulaQuimica('');
      setColor('');
      setDureza('');
      setEraGeologica('');
      const fileInput = document.getElementById('image-upload-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      alert('¡Muestra guardada con éxito! (Simulación de imagen completada)');
    } catch (error) {
      console.error('Error al guardar en Firestore:', error);
      alert('Ocurrió un error al guardar los datos.');
    } finally {
      setGuardando(false);
    }
  };

  // ---- Paleta Índigo Cristal (mineral = esmeralda/verde cristal, fósil = rosa cristal) ----
  const acento = tipo === 'mineral'
    ? {
        text: isDark ? '#34d399' : '#047857',
        ring: 'rgba(16,185,129,0.45)',
        glow: 'rgba(16,185,129,0.22)',
        solidBg: isDark ? 'rgba(16,185,129,0.16)' : 'rgba(16,185,129,0.10)',
        gradient: 'linear-gradient(135deg, #10b981, #6366f1)',
      }
    : {
        text: isDark ? '#f472b6' : '#be185d',
        ring: 'rgba(236,72,153,0.45)',
        glow: 'rgba(236,72,153,0.22)',
        solidBg: isDark ? 'rgba(236,72,153,0.16)' : 'rgba(236,72,153,0.10)',
        gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      };

  const cardBg = isDark ? 'rgba(26,26,46,0.6)' : 'rgba(255,255,255,0.7)';
  const cardBorder = isDark ? '1px solid rgba(139,92,246,0.22)' : '1px solid rgba(99,102,241,0.22)';
  const titleColor = isDark ? '#f5f3ff' : '#1e1b4b';
  const labelColor = isDark ? '#c4b5fd' : '#4338ca';
  const inputBg = isDark ? 'rgba(15,15,26,0.65)' : 'rgba(255,255,255,0.9)';
  const inputBorder = isDark ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(79,70,229,0.3)';
  const inputText = isDark ? '#ede9fe' : '#1e1b4b';
  const placeholderClass = isDark ? 'placeholder:text-indigo-300/35' : 'placeholder:text-indigo-900/35';

  const inputClass = `w-full rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-all duration-200 ${placeholderClass}`;

  const focusRing = (e: React.FocusEvent<HTMLElement>, ring: string) => {
    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 3px ${ring}`;
    (e.currentTarget as HTMLElement).style.borderColor = isDark ? 'rgba(165,180,252,0.6)' : 'rgba(79,70,229,0.5)';
  };
  const blurRing = (e: React.FocusEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
    (e.currentTarget as HTMLElement).style.borderColor = isDark ? 'rgba(139,92,246,0.3)' : 'rgba(79,70,229,0.3)';
  };

  return (
    <div
      className="relative max-w-4xl mx-auto rounded-2xl p-6 backdrop-blur-xl transition-colors duration-500"
      style={{
        background: cardBg,
        border: cardBorder,
        boxShadow: isDark
          ? '0 8px 32px rgba(0,0,0,0.4)'
          : '0 8px 28px rgba(99,102,241,0.10)',
      }}
    >
      <h2 className="text-xl font-bold flex items-center gap-2.5 mb-6" style={{ color: titleColor }}>
        <span
          className="flex items-center justify-center rounded-[14px]"
          style={{
            width: 38,
            height: 38,
            background: acento.gradient,
            boxShadow: `0 0 16px ${acento.glow}`,
          }}
        >
          <PlusCircle className="w-4.5 h-4.5" size={18} strokeWidth={2} color="#ffffff" />
        </span>
        Registrar Nueva Pieza de Exhibición
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Selector de categoría */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: labelColor }}>
            Categoría del Hallazgo
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTipo('mineral')}
              className="py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5"
              style={
                tipo === 'mineral'
                  ? {
                      background: isDark ? 'rgba(16,185,129,0.14)' : 'rgba(16,185,129,0.10)',
                      border: '1.5px solid rgba(16,185,129,0.55)',
                      color: isDark ? '#34d399' : '#047857',
                      boxShadow: isDark ? '0 0 18px rgba(16,185,129,0.2)' : '0 0 14px rgba(16,185,129,0.12)',
                    }
                  : {
                      background: isDark ? 'rgba(15,15,26,0.5)' : 'rgba(255,255,255,0.6)',
                      border: isDark ? '1.5px solid rgba(139,92,246,0.18)' : '1.5px solid rgba(99,102,241,0.18)',
                      color: isDark ? '#9ca3af' : '#6b7280',
                    }
              }
            >
              <Gem size={17} strokeWidth={2} />
              Mineral Nativo
            </button>
            <button
              type="button"
              onClick={() => setTipo('fossil')}
              className="py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5"
              style={
                tipo === 'fossil'
                  ? {
                      background: isDark ? 'rgba(236,72,153,0.14)' : 'rgba(236,72,153,0.10)',
                      border: '1.5px solid rgba(236,72,153,0.55)',
                      color: isDark ? '#f472b6' : '#be185d',
                      boxShadow: isDark ? '0 0 18px rgba(236,72,153,0.2)' : '0 0 14px rgba(236,72,153,0.12)',
                    }
                  : {
                      background: isDark ? 'rgba(15,15,26,0.5)' : 'rgba(255,255,255,0.6)',
                      border: isDark ? '1.5px solid rgba(139,92,246,0.18)' : '1.5px solid rgba(99,102,241,0.18)',
                      color: isDark ? '#9ca3af' : '#6b7280',
                    }
              }
            >
              <Bone size={17} strokeWidth={2} />
              Fósil Prehistórico
            </button>
          </div>
        </div>

        {/* Campos de nombre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: labelColor }}>
              Nombre Común
            </label>
            <input
              type="text"
              value={nombreComun}
              onChange={e => setNombreComun(e.target.value)}
              placeholder={tipo === 'mineral' ? 'Ej. Pirita, Cuarzo, Galena' : 'Ej. Trilobite, Amonita'}
              className={inputClass}
              style={{ background: inputBg, border: inputBorder, color: inputText }}
              onFocus={(e) => focusRing(e, acento.ring)}
              onBlur={blurRing}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: labelColor }}>
              {tipo === 'mineral' ? 'Clasificación' : 'Nombre Científico'}
            </label>
            <input
              type="text"
              value={nombreCientifico}
              onChange={e => setNombreCientifico(e.target.value)}
              placeholder={tipo === 'mineral' ? 'Ej. Sulfuro, Óxido, Silicato' : 'Ej. Paradoxides pinus'}
              className={inputClass}
              style={{ background: inputBg, border: inputBorder, color: inputText }}
              onFocus={(e) => focusRing(e, acento.ring)}
              onBlur={blurRing}
            />
          </div>
        </div>

        {/* Campos dinámicos según tipo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tipo === 'mineral' ? (
            <>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: labelColor }}>
                  Fórmula Química
                </label>
                <input
                  type="text"
                  value={formulaQuimica}
                  onChange={e => setFormulaQuimica(e.target.value)}
                  placeholder="Ej. FeS₂"
                  className={inputClass}
                  style={{ background: inputBg, border: inputBorder, color: inputText }}
                  onFocus={(e) => focusRing(e, acento.ring)}
                  onBlur={blurRing}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: labelColor }}>
                  Mina / Lugar de Extracción
                </label>
                <input
                  type="text"
                  value={procedencia}
                  onChange={e => setProcedencia(e.target.value)}
                  placeholder="Ej. Cerro Rico de Potosí"
                  className={inputClass}
                  style={{ background: inputBg, border: inputBorder, color: inputText }}
                  onFocus={(e) => focusRing(e, acento.ring)}
                  onBlur={blurRing}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: labelColor }}>
                  Color Característico
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  placeholder="Ej. Dorado metálico"
                  className={inputClass}
                  style={{ background: inputBg, border: inputBorder, color: inputText }}
                  onFocus={(e) => focusRing(e, acento.ring)}
                  onBlur={blurRing}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: labelColor }}>
                  Dureza (Escala de Mohs)
                </label>
                <input
                  type="text"
                  value={dureza}
                  onChange={e => setDureza(e.target.value)}
                  placeholder="Ej. 6 – 6.5 Mohs"
                  className={inputClass}
                  style={{ background: inputBg, border: inputBorder, color: inputText }}
                  onFocus={(e) => focusRing(e, acento.ring)}
                  onBlur={blurRing}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: labelColor }}>
                  Era Geológica
                </label>
                <input
                  type="text"
                  value={eraGeologica}
                  onChange={e => setEraGeologica(e.target.value)}
                  placeholder="Ej. Paleozoico - Devónico"
                  className={inputClass}
                  style={{ background: inputBg, border: inputBorder, color: inputText }}
                  onFocus={(e) => focusRing(e, acento.ring)}
                  onBlur={blurRing}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: labelColor }}>
                  Yacimiento / Procedencia
                </label>
                <input
                  type="text"
                  value={procedencia}
                  onChange={e => setProcedencia(e.target.value)}
                  placeholder="Ej. Yacimiento Cal Orck'o"
                  className={inputClass}
                  style={{ background: inputBg, border: inputBorder, color: inputText }}
                  onFocus={(e) => focusRing(e, acento.ring)}
                  onBlur={blurRing}
                />
              </div>
            </>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: labelColor }}>
            Descripción del Hallazgo
          </label>
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            rows={3}
            placeholder={tipo === 'mineral' ? 'La pirita es un mineral compuesto por hierro y azufre...' : 'Describa el estado de conservación...'}
            className={`${inputClass} resize-none`}
            style={{ background: inputBg, border: inputBorder, color: inputText }}
            onFocus={(e) => focusRing(e, acento.ring)}
            onBlur={blurRing}
          />
        </div>

        {/* Input de archivo (solo estético) */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1.5" style={{ color: labelColor }}>
            <ImageIcon size={13} strokeWidth={2} /> Fotografía de la Muestra
          </label>
          <input
            id="image-upload-input"
            type="file"
            accept="image/*"
            className="w-full rounded-xl px-3 py-2 text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:cursor-pointer transition-all duration-200"
            style={{
              background: inputBg,
              border: inputBorder,
              color: isDark ? '#9ca3af' : '#6b7280',
            }}
          />
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={guardando}
          className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0"
          style={
            guardando
              ? {
                  background: isDark ? 'rgba(55,55,75,0.6)' : 'rgba(209,213,219,0.7)',
                  color: isDark ? '#6b7280' : '#9ca3af',
                  cursor: 'not-allowed',
                }
              : {
                  background: acento.gradient,
                  boxShadow: `0 6px 22px ${acento.glow}`,
                }
          }
        >
          {guardando ? 'Guardando en Firestore...' : 'Registrar Muestra'}
        </button>
      </form>
    </div>
  );
};