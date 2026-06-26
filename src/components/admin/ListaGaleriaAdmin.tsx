import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, onSnapshot, query, deleteDoc, doc } from 'firebase/firestore';
import { useTheme } from '../useTheme'; // Asegúrate de que la ruta sea correcta

interface PiezaExhibicion {
  id: string;
  tipo: 'mineral' | 'fossil';
  nombreComun: string;
  nombreCientifico: string;
  procedencia: string;
  descripcion: string;
  imagenUrl: string;
  formulaQuimica?: string;
  eraGeologica?: string;
}

interface ListaGaleriaAdminProps {
  searchTerm?: string;
}

export const ListaGaleriaAdmin: React.FC<ListaGaleriaAdminProps> = ({ searchTerm = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [piezas, setPiezas] = useState<PiezaExhibicion[]>([]);
  const [imagenesFallidas, setImagenesFallidas] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const q = query(collection(db, 'galeria_museo'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot || snapshot.empty) {
          setPiezas([]);
          return;
        }
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PiezaExhibicion[];
        setPiezas(lista);
      }, (error) => {
        console.error("Firestore snapshot error ignored:", error);
        setPiezas([]);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error("Effect execution error:", err);
      setPiezas([]);
    }
  }, []);

  const handleEliminarPieza = async (id: string, nombre: string) => {
    if (window.confirm(`¿Está seguro de eliminar "${nombre}" de la exhibición pública?`)) {
      try {
        await deleteDoc(doc(db, 'galeria_museo', id));
      } catch (error) {
        console.error("Error al eliminar pieza:", error);
      }
    }
  };

  const piezasFiltradas = piezas.filter(pieza => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      pieza.nombreComun.toLowerCase().includes(term) ||
      (pieza.nombreCientifico && pieza.nombreCientifico.toLowerCase().includes(term)) ||
      (pieza.procedencia && pieza.procedencia.toLowerCase().includes(term)) ||
      (pieza.tipo && pieza.tipo.toLowerCase().includes(term))
    );
  });

  const marcarImagenFallida = (id: string) => {
    setImagenesFallidas(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border-2 shadow-lg transition-all duration-500 ${
      isDark
        ? 'bg-[#0a0a14] border-[#4f46e5]/30 shadow-[#4f46e5]/10'
        : 'bg-white border-gray-900 shadow-gray-300/30'
    }`}>
      {/* Línea decorativa superior */}
      <div className={`relative h-[2px] bg-gradient-to-r from-transparent via-${
        isDark ? '[#818cf8]' : '[#1f2937]'
      }/80 to-transparent`} />

      {/* Contenido principal con padding reducido */}
      <div className={`relative p-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {/* Header compacto */}
        <div className={`border-b pb-2 mb-3 ${
          isDark ? 'border-[#4f46e5]/30' : 'border-gray-900'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-9 h-9 rounded-xl ${
              isDark
                ? 'bg-gradient-to-br from-[#818cf8]/30 to-[#4f46e5]/30 border-2 border-[#818cf8]/50'
                : 'bg-gray-200 border-2 border-gray-700'
            }`}>
              <span className="text-xl">🏛️</span>
            </div>
            <div>
              <h2 className={`text-base font-bold tracking-wide ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Inventario de Exhibición
              </h2>
              <p className={`text-xs flex items-center gap-2 mt-0.5 ${
                isDark ? 'text-[#c7d2fe]' : 'text-gray-700'
              }`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                  isDark ? 'bg-[#818cf8]' : 'bg-gray-700'
                } animate-pulse`} />
                Piezas científicas visibles en el catálogo digital
                <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isDark
                    ? 'bg-gradient-to-r from-[#4f46e5]/40 to-[#818cf8]/40 text-white border-[#818cf8]/50'
                    : 'bg-gray-200 text-gray-800 border-gray-700'
                }`}>
                  {piezasFiltradas.length} {piezasFiltradas.length === 1 ? 'pieza' : 'piezas'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {piezasFiltradas.length === 0 ? (
          <div className={`text-center py-8 border-2 border-dashed rounded-xl ${
            isDark
              ? 'border-[#4f46e5]/40 bg-[#13131f]/70 text-[#c7d2fe]'
              : 'border-gray-700 bg-gray-100/70 text-gray-700'
          }`}>
            <p className="text-sm italic font-medium">No hay muestras registradas en la galería.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {piezasFiltradas.map((pieza) => (
              <div
                key={pieza.id}
                className={`group relative rounded-xl p-3 flex gap-3 border-2 transition-all duration-300 ${
                  isDark
                    ? 'bg-gradient-to-br from-[#1a1a2e] via-[#1e1e35] to-[#13131f] border-[#4f46e5]/30 hover:border-[#818cf8]/60 hover:shadow-2xl hover:shadow-[#818cf8]/30'
                    : 'bg-white border-gray-800 hover:border-gray-600 hover:shadow-xl hover:shadow-gray-300/50'
                }`}
              >
                {/* Imagen */}
                <div className="shrink-0">
                  {pieza.imagenUrl?.trim() && !imagenesFallidas[pieza.id] ? (
                    <img
                      src={pieza.imagenUrl}
                      alt={pieza.nombreComun}
                      onError={() => marcarImagenFallida(pieza.id)}
                      className={`w-20 h-20 rounded-lg object-cover border-2 transition-all duration-300 ${
                        isDark
                          ? 'bg-[#0a0a14] border-[#4f46e5]/40 group-hover:border-[#818cf8]/60'
                          : 'bg-gray-100 border-gray-600 group-hover:border-gray-900'
                      }`}
                    />
                  ) : (
                    <div
                      className={`flex h-20 w-20 flex-col items-center justify-center rounded-lg border-2 text-center backdrop-blur-xl transition-all duration-300 ${
                        isDark
                          ? 'border-[#818cf8]/50 bg-gradient-to-br from-[#4f46e5]/25 via-[#1e1e35]/80 to-[#0a0a14]/90 text-[#e0e7ff] shadow-[0_0_20px_rgba(129,140,248,0.18)] group-hover:border-[#a5b4fc]/70'
                          : 'border-indigo-300 bg-white/75 text-indigo-900 shadow-[0_8px_24px_rgba(99,102,241,0.12)] group-hover:border-indigo-500'
                      }`}
                    >
                      <span className="text-2xl leading-none" aria-hidden="true">
                        {pieza.tipo === 'mineral' ? '💎' : '🦴'}
                      </span>
                      <span className="mt-1 text-[10px] font-bold uppercase tracking-wider">
                        Sin foto
                      </span>
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h3 className={`text-sm font-bold truncate leading-tight ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {pieza.nombreComun}
                    </h3>
                    <span
                      className={`shrink-0 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                        pieza.tipo === 'mineral'
                          ? isDark
                            ? 'bg-gradient-to-r from-[#818cf8]/30 to-[#6366f1]/30 text-white border-[#818cf8]/60'
                            : 'bg-blue-100 text-gray-800 border-blue-800'
                          : isDark
                            ? 'bg-gradient-to-r from-[#a78bfa]/30 to-[#8b5cf6]/30 text-white border-[#a78bfa]/60'
                            : 'bg-purple-100 text-gray-800 border-purple-800'
                      }`}
                    >
                      {pieza.tipo === 'mineral' ? '💎 Mineral' : '🦴 Fósil'}
                    </span>
                  </div>

                  <p className={`text-xs font-mono italic truncate mb-1.5 ${
                    isDark ? 'text-[#e0e7ff]' : 'text-gray-700'
                  }`}>
                    {pieza.nombreCientifico}
                  </p>

                  {/* Fórmula / Era */}
                  {pieza.tipo === 'mineral' && pieza.formulaQuimica && (
                    <div className={`rounded-lg p-1.5 mb-1.5 ${
                      isDark
                        ? 'bg-[#4f46e5]/20 border border-[#818cf8]/40'
                        : 'bg-blue-50 border border-blue-300'
                    }`}>
                      <p className={`text-[10px] font-semibold flex items-center gap-1.5 ${
                        isDark ? 'text-[#c7d2fe]' : 'text-gray-800'
                      }`}>
                        <span>💎</span>
                        <span className={isDark ? 'text-[#a5b4fc]' : 'text-blue-700'}>Fórmula:</span>
                        <span className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded border ${
                          isDark
                            ? 'bg-[#1e1e35] border-[#818cf8]/30 text-white'
                            : 'bg-white border-blue-500 text-gray-900'
                        }`}>
                          {pieza.formulaQuimica}
                        </span>
                      </p>
                    </div>
                  )}
                  {pieza.tipo === 'fossil' && pieza.eraGeologica && (
                    <div className={`rounded-lg p-1.5 mb-1.5 ${
                      isDark
                        ? 'bg-[#6366f1]/20 border border-[#a78bfa]/40'
                        : 'bg-purple-50 border border-purple-300'
                    }`}>
                      <p className={`text-[10px] font-semibold flex items-center gap-1.5 ${
                        isDark ? 'text-[#e0e7ff]' : 'text-gray-800'
                      }`}>
                        <span>⏳</span>
                        <span className={isDark ? 'text-[#c4b5fd]' : 'text-purple-700'}>Era:</span>
                        <span className={`font-bold text-xs px-1.5 py-0.5 rounded border ${
                          isDark
                            ? 'bg-[#1e1e35] border-[#a78bfa]/30 text-white'
                            : 'bg-white border-purple-500 text-gray-900'
                        }`}>
                          {pieza.eraGeologica}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Procedencia */}
                  <div className={`rounded-lg p-1.5 ${
                    isDark
                      ? 'bg-[#1e1e35]/60 border border-[#4f46e5]/30'
                      : 'bg-gray-100 border border-gray-700'
                  }`}>
                    <p className={`text-[10px] flex items-center gap-1.5 ${
                      isDark ? 'text-[#c7d2fe]' : 'text-gray-800'
                    }`}>
                      <span>📍</span>
                      <span className={isDark ? 'text-[#a5b4fc]' : 'text-gray-700'}>Procedencia:</span>
                      <span className={`truncate font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{pieza.procedencia}</span>
                    </p>
                  </div>
                </div>

                {/* Botón eliminar */}
                <div className="flex items-start">
                  <button
                    onClick={() => handleEliminarPieza(pieza.id, pieza.nombreComun)}
                    className={`p-1.5 rounded-lg border-2 transition-all duration-300 ${
                      isDark
                        ? 'text-[#94a3b8] hover:text-white hover:bg-red-500/20 hover:border-red-500/50'
                        : 'text-gray-600 hover:text-red-700 hover:bg-red-100/50 hover:border-red-700'
                    }`}
                    title="Eliminar pieza"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Línea decorativa inferior */}
      <div className={`relative h-[2px] bg-gradient-to-r from-transparent via-${
        isDark ? '[#4f46e5]' : '[#1f2937]'
      }/60 to-transparent`}>
        <div className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
          isDark ? 'bg-[#a5b4fc] shadow-[0_0_10px_4px_rgba(165,180,252,0.6)]' : 'bg-gray-700 shadow-[0_0_10px_4px_rgba(0,0,0,0.3)]'
        }`} />
      </div>
    </div>
  );
};
