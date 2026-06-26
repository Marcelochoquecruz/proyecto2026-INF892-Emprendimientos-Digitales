import React, { useState } from 'react';
import EstadisticasAdmin from '../../components/admin/EstadisticasAdmin';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { ConfigurarTurno } from '../../components/ConfigurarTurno';
import { ListaTurnosAdmin } from '../../components/admin/ListaTurnosAdmin';
import { TablaReservasAdmin } from '../../components/admin/TablaReservasAdmin';
import { GestionGaleriaAdmin } from '../../components/admin/GestionGaleriaAdmin';
import { GestionExpedicionesAdmin } from '../../components/admin/GestionExpedicionesAdmin';
import { ListaGaleriaAdmin } from '../../components/admin/ListaGaleriaAdmin';
import { useTheme } from '../../components/useTheme';
import {
  CalendarDays,
  Compass,
  Gem,
  BarChart3,
  LogOut,
  Sliders,
} from 'lucide-react';

type Modulo = 'reservas' | 'expediciones' | 'galeria' | 'estadisticas';

const badgeColors: Record<Modulo | 'salir', { ring: string; glowFrom: string; glowTo: string; icon: string }> = {
  reservas: {
    ring: 'rgba(16,185,129,0.55)',
    glowFrom: 'rgba(16,185,129,0.35)',
    glowTo: 'rgba(5,150,105,0.05)',
    icon: '#34d399',
  },
  expediciones: {
    ring: 'rgba(168,85,247,0.55)',
    glowFrom: 'rgba(168,85,247,0.35)',
    glowTo: 'rgba(124,58,237,0.05)',
    icon: '#c084fc',
  },
  galeria: {
    ring: 'rgba(250,204,21,0.55)',
    glowFrom: 'rgba(250,204,21,0.32)',
    glowTo: 'rgba(202,138,4,0.05)',
    icon: '#facc15',
  },
  estadisticas: {
    ring: 'rgba(56,189,248,0.55)',
    glowFrom: 'rgba(56,189,248,0.32)',
    glowTo: 'rgba(2,132,199,0.05)',
    icon: '#38bdf8',
  },
  salir: {
    ring: 'rgba(244,63,94,0.5)',
    glowFrom: 'rgba(244,63,94,0.3)',
    glowTo: 'rgba(190,18,60,0.05)',
    icon: '#fb7185',
  },
};

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [moduloActivo, setModuloActivo] = useState<Modulo>('reservas');

  const handleCerrarSesion = async () => {
    const confirmar = window.confirm("¿Está seguro de que desea cerrar la sesión de administración?");
    if (confirmar) {
      try {
        await signOut(auth);
        window.location.href = '/';
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    }
  };

  // ── Badge horizontal (icono + texto) ──
  const IconBadge: React.FC<{
    moduloKey: Modulo | 'salir';
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick: () => void;
  }> = ({ moduloKey, icon, label, active, onClick }) => {
    const c = badgeColors[moduloKey];
    return (
      <button
        onClick={onClick}
        className="group flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-all duration-200 hover:scale-105"
        style={{
          background: active
            ? isDark
              ? 'rgba(99,102,241,0.15)'
              : 'rgba(99,102,241,0.08)'
            : 'transparent',
          border: active
            ? isDark
              ? '1px solid rgba(99,102,241,0.3)'
              : '1px solid rgba(99,102,241,0.2)'
            : '1px solid transparent',
        }}
      >
        <div
          className="relative flex items-center justify-center rounded-[12px] transition-all duration-300 flex-shrink-0"
          style={{
            width: 40,
            height: 40,
            background: isDark
              ? `radial-gradient(circle at 30% 25%, ${c.glowFrom}, ${c.glowTo} 70%), linear-gradient(160deg, rgba(40,40,60,0.9), rgba(20,20,32,0.9))`
              : `radial-gradient(circle at 30% 25%, ${c.glowFrom}, ${c.glowTo} 70%), linear-gradient(160deg, rgba(255,255,255,0.95), rgba(245,245,255,0.85))`,
            border: active ? `1.5px solid ${c.ring}` : isDark ? '1.5px solid rgba(255,255,255,0.08)' : '1.5px solid rgba(0,0,0,0.06)',
            boxShadow: active
              ? `0 0 16px ${c.glowFrom}, inset 0 1px 1px rgba(255,255,255,0.25)`
              : isDark
                ? 'inset 0 1px 1px rgba(255,255,255,0.06)'
                : 'inset 0 1px 1px rgba(255,255,255,0.7), 0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <div
            className="pointer-events-none absolute top-0 left-0 right-0 h-1/2 rounded-t-[12px] opacity-40"
            style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)' }}
          />
          <div
            className="relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            style={{ color: c.icon, filter: active ? `drop-shadow(0 0 6px ${c.glowFrom})` : 'none' }}
          >
            {icon}
          </div>
        </div>
        <span
          className="text-sm font-bold uppercase tracking-wider transition-colors duration-200"
          style={{
            color: active
              ? c.icon
              : isDark
                ? 'rgba(165,180,252,0.8)'
                : 'rgba(55,48,163,0.7)',
          }}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans flex ${
      isDark
        ? 'bg-[#0F0F1A] text-[#A5B4FC]'
        : 'bg-[#ece9ff] text-gray-900'
    }`}>
      {/* ─── SIDEBAR (top: 100px) ─── */}
      <aside
        className="fixed z-5 flex flex-col transition-all duration-500"
        style={{
          top: '100px',
          left: 0,
          width: '220px',
          height: 'calc(100vh - 100px)',
          background: isDark
            ? 'rgba(19,19,31,0.92)'
            : 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRight: isDark
            ? '1px solid rgba(139,92,246,0.25)'
            : '1px solid rgba(99,102,241,0.18)',
          boxShadow: isDark
            ? '4px 0 32px rgba(79,70,229,0.15)'
            : '4px 0 28px rgba(124,58,237,0.08)',
          borderRadius: '0 12px 12px 0',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: isDark ? 'rgba(139,92,246,0.15)' : 'rgba(99,102,241,0.10)' }}>
          <span
            className="flex items-center justify-center rounded-[12px]"
            style={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 0 14px rgba(99,102,241,0.4)',
            }}
          >
            <Sliders size={16} strokeWidth={2} color="#fff" />
          </span>
          <div>
            <h1 className={`text-[12px] font-serif tracking-[0.2em] uppercase ${
              isDark ? 'text-[#A5B4FC]' : 'text-gray-900'
            }`}>
              Admin
            </h1>
            <p className={`text-[7px] uppercase tracking-[0.15em] ${
              isDark ? 'text-[#818CF8]' : 'text-gray-600'
            }`}>
              Potosí Mineral
            </p>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1  py-2 px-2 flex flex-col gap-1">
          <IconBadge
            moduloKey="reservas"
            icon={<CalendarDays size={20} strokeWidth={1.8} />}
            label="Reservas"
            active={moduloActivo === 'reservas'}
            onClick={() => setModuloActivo('reservas')}
          />
          <IconBadge
            moduloKey="expediciones"
            icon={<Compass size={20} strokeWidth={1.8} />}
            label="Expediciones"
            active={moduloActivo === 'expediciones'}
            onClick={() => setModuloActivo('expediciones')}
          />
          <IconBadge
            moduloKey="galeria"
            icon={<Gem size={20} strokeWidth={1.8} />}
            label="Galería"
            active={moduloActivo === 'galeria'}
            onClick={() => setModuloActivo('galeria')}
          />
          <IconBadge
            moduloKey="estadisticas"
            icon={<BarChart3 size={20} strokeWidth={1.8} />}
            label="Estadisticas"
            active={moduloActivo === 'estadisticas'}
            onClick={() => setModuloActivo('estadisticas')}
          />
          
            <button
            onClick={handleCerrarSesion}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105"
            style={{
              background: isDark
                ? 'rgba(244,63,94,0.12)'
                : 'rgba(244,63,94,0.06)',
              border: isDark
                ? '1px solid rgba(244,63,94,0.3)'
                : '1px solid rgba(190,18,60,0.2)',
              color: isDark ? '#fb7185' : '#be123c',
            }}
          >
            <LogOut size={16} strokeWidth={1.8} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Salir</span>
          </button>
        </nav>       
        
      </aside>

      {/* ─── CONTENIDO PRINCIPAL (margin-top: 100px) ─── */}
      <main className="flex-1 min-h-screen transition-all duration-500" style={{ marginLeft: '220px', marginTop: '10px' }}>
        {/* Header sticky */}
        <div className="sticky top-0 z-40 bg-opacity-80 backdrop-blur-md border-b transition-all duration-500 px-6 py-3 flex flex-wrap items-center justify-between gap-3"
          style={{
            background: isDark
              ? 'rgba(15,15,26,0.85)'
              : 'rgba(236,233,255,0.85)',
            borderColor: isDark
              ? 'rgba(139,92,246,0.15)'
              : 'rgba(99,102,241,0.10)',
          }}
        >
          <div className="flex items-center gap-4">
            <h2 className={`text-sm font-serif tracking-[0.2em] uppercase ${
              isDark ? 'text-[#A5B4FC]' : 'text-gray-900'
            }`}>
              {moduloActivo.charAt(0).toUpperCase() + moduloActivo.slice(1)}
            </h2>
          </div>
        </div>

        {/* Contenido */}
        <div className="max-w-6xl mx-auto mt-6 px-6 pb-8 space-y-6">
          {moduloActivo === 'reservas' && (
            <>
              <div className="space-y-4">
                <ConfigurarTurno />
                <ListaTurnosAdmin />
              </div>
              <TablaReservasAdmin searchTerm={''} />
            </>
          )}

          {moduloActivo === 'expediciones' && (
            <div className="space-y-4">
              <GestionExpedicionesAdmin />
            </div>
          )}

          {moduloActivo === 'galeria' && (
            <div className="space-y-4">
              <GestionGaleriaAdmin />
              <ListaGaleriaAdmin searchTerm={''} />
            </div>
          )}

          {moduloActivo === 'estadisticas' && (
            <div className="space-y-4">
              <EstadisticasAdmin />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;