import React, { useEffect, useState } from 'react';

import { collection, query, onSnapshot } from 'firebase/firestore';

import { db } from '../../config/firebase';

import {

  Gem, FlaskConical, HardHat, Bone,

  Sparkles, ImageOff, ArrowUpRight,

  type LucideIcon,

} from 'lucide-react';

interface Pieza {
  id: string;
  tipo: 'mineral' | 'fossil';
  nombreComun: string;
  nombreCientifico?: string;
  descripcion?: string;
  imagenUrl?: string;
  formulaQuimica?: string;
  color?: string;
  dureza?: string;
  eraGeologica?: string;
}
type PiezaTipo = 'mineral' | 'fossil';

const ACCENTS: Record<PiezaTipo, { primary: string; soft: string; border: string }> = {
  mineral: { primary: '#FFD700', soft: 'rgba(255, 215, 0, 0.14)', border: 'rgba(255, 215, 0, 0.45)' },
  fossil:  { primary: '#FFB84D', soft: 'rgba(255,184,77, 0.14)', border: 'rgba(255,184,77, 0.45)' },
};

const LoadingState: React.FC = () => (
  <div className="min-h-screen bg-[#0A0B0E] flex flex-col items-center justify-center gap-6 p-8">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-2 border-[#FFD700]/20 border-t-[#FFD700] animate-spin" />
      <Gem className="absolute inset-0 m-auto text-[#FFD700] animate-pulse" size={20} />
    </div>
    <p className="text-gray-400 tracking-[0.3em] uppercase text-xs" style={{ fontFamily: 'Cinzel, serif' }}>
      Cargando catálogo...
    </p>
  </div>
);

const CornerOrnament: React.FC<{ color: string; position: 'tl'|'tr'|'bl'|'br' }> = ({ color, position }) => {
  const map: Record<string,string> = {
    tl:'top-3 left-3 border-t-2 border-l-2', tr:'top-3 right-3 border-t-2 border-r-2',
    bl:'bottom-3 left-3 border-b-2 border-l-2', br:'bottom-3 right-3 border-b-2 border-r-2',
  };
  return <span className={`absolute w-4 h-4 corner-ornament opacity-30 group-hover:opacity-100 ${map[position]}`} style={{ borderColor: color }} />;
};

const StatCard: React.FC<{ icon: LucideIcon; label: string; value: number; accent: string }> =
  ({ icon: Icon, label, value, accent }) => (
  <div className="group relative bg-gradient-to-br from-[#161920] to-[#0E1014] border border-gray-800 rounded-2xl p-6 text-center transition-all duration-500 hover:-translate-y-1 overflow-hidden">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
         style={{ background: `radial-gradient(circle at center, ${accent}10 0%, transparent 70%)` }} />
    <div className="relative">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 transition-transform duration-500 group-hover:scale-110"
           style={{ background: `${accent}15`, border: `1px solid ${accent}35` }}>
        <Icon size={20} style={{ color: accent }} />
      </div>
      <div className="text-3xl sm:text-4xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>{value}</div>
      <div className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-500" style={{ fontFamily: 'Cinzel, serif' }}>{label}</div>
    </div>
  </div>
);

const PiezaCard: React.FC<{ pieza: Pieza; tipo: PiezaTipo; index: number }> = ({ pieza, tipo, index }) => {
  const accent = ACCENTS[tipo];
  const isMineral = tipo === 'mineral';
  const TypeIcon = isMineral ? Gem : Bone;

  return (
    <article
      className={`group relative bg-gradient-to-b from-[#161920] to-[#0E1014] border border-gray-800 rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-2 ${isMineral ? 'card-mineral' : 'card-fossil'}`}
      style={{ animation: `fadeUp 0.6s ease-out ${index * 60}ms both` }}
    >
      <CornerOrnament color={accent.primary} position="tl" />
      <CornerOrnament color={accent.primary} position="tr" />
      <CornerOrnament color={accent.primary} position="bl" />
      <CornerOrnament color={accent.primary} position="br" />

      <div className="relative h-56 overflow-hidden bg-[#0A0B0E]">
        {pieza.imagenUrl ? (
          <>
            <img src={pieza.imagenUrl} alt={pieza.nombreComun}
                 className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 30%, ${accent.soft} 70%, rgba(15,18,22,0.95) 100%)` }} />
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0A0B0E]/70 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-600">
            <ImageOff size={40} />
            <span className="text-[10px] uppercase tracking-[0.3em]">Sin imagen</span>
          </div>
        )}
        <div className="absolute top-3 right-12 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold backdrop-blur-md z-10"
             style={{ background: 'rgba(10,11,14,0.7)', color: accent.primary, border: `1px solid ${accent.border}` }}>
          <TypeIcon size={10} />
          {isMineral ? 'Mineral' : 'Fósil'}
        </div>
      </div>

      <div className="p-5 relative">
        <div className="absolute top-0 left-5 right-5 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent.border}, transparent)` }} />
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-white leading-tight truncate" style={{ fontFamily: 'Cinzel, serif' }}>{pieza.nombreComun}</h3>
            {pieza.nombreCientifico && <p className="text-xs italic text-gray-500 mt-1 truncate">{pieza.nombreCientifico}</p>}
          </div>
          <ArrowUpRight size={18} className="arrow-icon flex-shrink-0 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        {pieza.descripcion && (
          <p className="text-xs text-gray-400 mb-4 line-clamp-3 leading-relaxed" style={{ fontFamily: 'Cinzel, serif' }}>
            {pieza.descripcion}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {isMineral && (
            <>
              {pieza.formulaQuimica && (
                <span className="inline-flex items-center px-2.5 py-1 bg-[#1F232C]/80 border border-gray-700/50 rounded-md text-xs text-gray-200 hover:border-[#FFD700]/50 transition-colors">
                  <FlaskConical className="mr-1.5" size={12} />{pieza.formulaQuimica}
                </span>
              )}
              {pieza.color && (
                <span className="inline-flex items-center px-2.5 py-1 bg-[#1F232C]/80 border border-gray-700/50 rounded-md text-xs text-gray-200 hover:border-[#FFD700]/50 transition-colors">
                  <HardHat className="mr-1.5" size={12} />{pieza.color}
                </span>
              )}
              {pieza.dureza && (
                <span className="inline-flex items-center px-2.5 py-1 bg-[#1F232C]/80 border border-gray-700/50 rounded-md text-xs text-gray-200 hover:border-[#FFD700]/50 transition-colors">
                  <HardHat className="mr-1.5" size={12} />{pieza.dureza}
                </span>
              )}
            </>
          )}
          {!isMineral && pieza.eraGeologica && (
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md"
                  style={{ background: accent.soft, color: accent.primary, border: `1px solid ${accent.border}` }}>
              Era: {pieza.eraGeologica}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

const GallerySection: React.FC<{
  title: string; emoji: string; icon: LucideIcon;
  items: Pieza[]; tipo: PiezaTipo; emptyText: string;
}> = ({ title, emoji, icon: Icon, items, tipo, emptyText }) => {
  const accent = ACCENTS[tipo];
  const subtitle = tipo === 'mineral' ? 'Colección Geológica' : 'Colección Paleontológica';

  return (
    <section>
      <div className="mb-10 sm:mb-12 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="h-px flex-1 max-w-[140px]" style={{ background: `linear-gradient(90deg, transparent, ${accent.border})` }} />
          <Icon size={20} style={{ color: accent.primary }} />
          <span className="h-px flex-1 max-w-[140px]" style={{ background: `linear-gradient(90deg, ${accent.border}, transparent)` }} />
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-wide flex items-center justify-center gap-3 flex-wrap"
            style={{ fontFamily: 'Cinzel, serif' }}>
          <span className="text-3xl sm:text-4xl lg:text-5xl">{emoji}</span>
          <span>{title}</span>
        </h2>
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-gray-500 mt-3" style={{ fontFamily: 'Cinzel, serif' }}>
          {subtitle} · {items.length} {items.length === 1 ? 'pieza' : 'piezas'}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-16 px-8 border-2 border-dashed rounded-2xl" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <Icon size={48} className="mx-auto mb-4 opacity-30" style={{ color: accent.primary }} />
          <p className="text-gray-500 italic" style={{ fontFamily: 'Cinzel, serif' }}>{emptyText}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((pieza, idx) => <PiezaCard key={pieza.id} pieza={pieza} tipo={tipo} index={idx} />)}
        </div>
      )}
    </section>
  );
};

export const ColeccionPublica: React.FC = () => {
  const [minerales, setMinerales] = useState<Pieza[]>([]);
  const [fósiles, setFosiles] = useState<Pieza[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'galeria_museo'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const all = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as Pieza[];
      setMinerales(all.filter((p) => p.tipo === 'mineral'));
      setFosiles(all.filter((p) => p.tipo === 'fossil'));
      setLoading(false);
    }, (error) => {
      console.error('Error loading galeria_museo:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingState />;

  const totalPieces = minerales.length + fósiles.length;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px);} to { opacity:1; transform:translateY(0);} }
        @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-6px);} }
        .animate-float { animation: float 3.5s ease-in-out infinite; }
        .corner-ornament { transition: all 0.5s ease; }
        .card-mineral, .card-fossil { transition: border-color 0.5s ease, box-shadow 0.5s ease, transform 0.5s ease; }
        .card-mineral:hover { border-color: rgba(255,215,0,0.45)!important; box-shadow: 0 25px 60px -15px rgba(255,215,0,0.28), 0 0 0 1px rgba(255,215,0,0.15) inset; }
        .card-fossil:hover  { border-color: rgba(255,184,77,0.45)!important; box-shadow: 0 25px 60px -15px rgba(255,184,77,0.28), 0 0 0 1px rgba(255,184,77,0.15) inset; }
        .card-mineral .arrow-icon { color: #4b5563; } .card-mineral:hover .arrow-icon { color: #FFD700; }
        .card-fossil  .arrow-icon { color: #4b5563; } .card-fossil:hover  .arrow-icon { color: #FFB84D; }
        .pattern-bg { background-image: radial-gradient(circle at 20% 0%, rgba(255,215,0,0.05) 0%, transparent 45%), radial-gradient(circle at 80% 100%, rgba(255,184,77,0.05) 0%, transparent 45%); }
        .line-clamp-3 { display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
      `}</style>

      <div className="min-h-screen bg-[#0A0B0E] text-gray-200 relative pattern-bg overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full opacity-40 animate-float"
               style={{ background:'radial-gradient(circle, rgba(255,215,0,0.18) 0%, transparent 70%)', filter:'blur(60px)' }} />
          <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full opacity-40 animate-float"
               style={{ background:'radial-gradient(circle, rgba(255,184,77,0.18) 0%, transparent 70%)', filter:'blur(60px)', animationDelay:'1.5s' }} />
          <div className="absolute inset-0 opacity-[0.025]"
               style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")` }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 space-y-20 sm:space-y-24">
          <header className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FFD700]/30 bg-gradient-to-r from-[#FFD700]/10 via-[#FFD700]/5 to-transparent text-[#FFD700] text-[10px] sm:text-xs uppercase tracking-[0.3em] font-medium backdrop-blur-sm">
              <Sparkles size={12} className="animate-float" /> Museo · Colección Permanente
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-wide"
                style={{ fontFamily:'Cinzel, serif', textShadow:'0 4px 30px rgba(255,215,0,0.18), 0 0 60px rgba(255,215,0,0.05)' }}>
              Sala de Exhibiciones
            </h1>
            <div className="flex items-center justify-center gap-3 text-[#FFD700]/60">
              <span className="h-px w-16 sm:w-28 bg-gradient-to-r from-transparent to-[#FFD700]/60" />
              <Sparkles size={14} className="animate-float" />
              <span className="h-px w-16 sm:w-28 bg-gradient-to-l from-transparent to-[#FFD700]/60" />
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed px-4"
               style={{ fontFamily:'Cinzel, serif' }}>
              Un recorrido visual por la riqueza mineral y paleontológica de nuestra colección.
            </p>
          </header>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <StatCard icon={Gem} label="Minerales" value={minerales.length} accent="#FFD700" />
            <StatCard icon={Bone} label="Fósiles" value={fósiles.length} accent="#FFB84D" />
            <StatCard icon={Sparkles} label="Total piezas" value={totalPieces} accent="#E5C07B" />
          </div>

          <GallerySection title="Galería de Minerales Nativos" emoji="💎" icon={Gem}
                          items={minerales} tipo="mineral"
                          emptyText="No hay minerales registrados todavía." />
          <GallerySection title="Galería de Fósiles Prehistóricos" emoji="🦴" icon={Bone}
                          items={fósiles} tipo="fossil"
                          emptyText="No hay fósiles registrados todavía." />
        </div>
      </div>
    </>
  );
};

export default ColeccionPublica;