import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useTheme } from '../useTheme';
import { BarChart2, MapPin, Calendar, Printer } from 'lucide-react';
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Muestra {
  id: string;
  tipo: 'mineral' | 'fossil' | string;
}


export const EstadisticasAdmin: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [totalMuestras, setTotalMuestras] = useState(0);
  const [minerales, setMinerales] = useState(0);
  const [fosiles, setFosiles] = useState(0);
  const [expediciones, setExpediciones] = useState(0);
  const [reservas, setReservas] = useState(0);
  const [doughnutData, setDoughnutData] = useState<any>(null);
  const [barData, setBarData] = useState<any>(null);
  const [chartReady, setChartReady] = useState(false);

  // Cargar muestras
  useEffect(() => {
  const qMuestras = query(collection(db, 'galeria_museo'));
  const unsubM = onSnapshot(qMuestras, (snap) => {
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Muestra));
    setTotalMuestras(docs.length);
    setMinerales(docs.filter((d) => d.tipo === 'Mineral Nativo' || d.tipo === 'mineral').length);
    setFosiles(docs.filter((d) => d.tipo === 'Fósil Prehistórico' || d.tipo === 'fossil').length);
    // Prepare doughnut data
    setDoughnutData({
      labels: ['Minerales', 'Fósiles'],
      datasets: [{
        data: [
          docs.filter((d) => d.tipo === 'Mineral Nativo' || d.tipo === 'mineral').length,
          docs.filter((d) => d.tipo === 'Fósil Prehistórico' || d.tipo === 'fossil').length,
        ],
        backgroundColor: isDark ? ['#8b5cf6', '#f43f5e'] : ['#6366f1', '#ef4444'],
        borderColor: isDark ? ['#8b5cf6', '#f43f5e'] : ['#6366f1', '#ef4444'],
        borderWidth: 1,
      }],
    });
  });
    return () => unsubM();
  }, []);

  // Cargar expediciones
  useEffect(() => {
    const qExp = query(collection(db, 'expediciones'));
    const unsubE = onSnapshot(qExp, (snap) => {
      setExpediciones(snap.size);
    });
    return () => unsubE();
  }, []);

  // Cargar reservas y preparar datos para el gráfico de barras
  useEffect(() => {
    const qRes = query(collection(db, 'reservas'));
    const unsubR = onSnapshot(qRes, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      setReservas(docs.length);
      // Calcular reservas por mes (últimos 6 meses)
      const now = new Date();
      const months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return date.toLocaleString('default', { month: 'short', year: 'numeric' });
      }).reverse();
      const counts = months.map(() => 0);
      docs.forEach(doc => {
        const dateField = (doc as any).fecha;
        if (!dateField) return;
        const date = dateField.toDate ? dateField.toDate() : new Date(dateField);
        const monthIdx = months.findIndex(label => {
          const [abbr, year] = label.split(' ');
          const monthNum = new Date(`${abbr} 1, ${year}`).getMonth();
          return date.getFullYear() === parseInt(year) && date.getMonth() === monthNum;
        });
        if (monthIdx >= 0) counts[monthIdx]++;
      });
      setBarData({
        labels: months,
        datasets: [{
          label: 'Reservas por mes',
          data: counts,
          backgroundColor: isDark ? '#8b5cf6' : '#6366f1',
          borderColor: isDark ? '#8b5cf6' : '#6366f1',
          borderWidth: 1,
        }],
      });
      setChartReady(true);
    });
    return () => unsubR();
  }, []);


  const handlePrint = () => {
    window.print();
  };

  // ── Paleta Índigo Cristal ──
  const pageBg = isDark
    ? 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)'
    : 'linear-gradient(135deg, #ece9ff 0%, #f8f7ff 50%, #ece9ff 100%)';
  const halo = isDark
    ? 'radial-gradient(circle at 20% 10%, rgba(139,92,246,0.12), transparent 50%)'
    : 'radial-gradient(circle at 20% 10%, rgba(139,92,246,0.10), transparent 50%)';

  const titleColor = isDark ? '#f5f3ff' : '#1e1b4b';
  const chartOptions = {
    plugins: { legend: { labels: { color: isDark ? '#fff' : '#000' } } },
    scales: {
      y: { ticks: { color: isDark ? '#fff' : '#000' }, grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' } },
      x: { ticks: { color: isDark ? '#fff' : '#000' }, grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  const descColor = isDark ? '#c4b5fd' : '#3730a3';
  const valueColor = isDark ? '#ede9fe' : '#1e1b4b';

  // Configuración de acentos cristalinos para cada tarjeta
  const cardAccents = [
    {
      icon: BarChart2,
      // Violeta/Índigo
      glassBg: isDark
        ? 'radial-gradient(circle at 30% 25%, rgba(99,102,241,0.15), rgba(99,102,241,0.05) 70%), rgba(26,26,46,0.65)'
        : 'radial-gradient(circle at 30% 25%, rgba(99,102,241,0.10), rgba(99,102,241,0.02) 70%), rgba(255,255,255,0.85)',
      border: isDark ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(99,102,241,0.25)',
      shadow: isDark
        ? '0 8px 32px rgba(99,102,241,0.12)'
        : '0 8px 28px rgba(99,102,241,0.08)',
      iconRing: 'rgba(99,102,241,0.4)',
      iconGlow: 'rgba(99,102,241,0.25)',
      iconColor: isDark ? '#c4b5fd' : '#4f46e5',
      title: 'Muestras Científicas',
      statLabel: `Minerales: ${minerales} · Fósiles: ${fosiles}`,
    },
    {
      icon: MapPin,
      // Azul cristal
      glassBg: isDark
        ? 'radial-gradient(circle at 30% 25%, rgba(56,189,248,0.15), rgba(56,189,248,0.05) 70%), rgba(26,26,46,0.65)'
        : 'radial-gradient(circle at 30% 25%, rgba(56,189,248,0.10), rgba(56,189,248,0.02) 70%), rgba(255,255,255,0.85)',
      border: isDark ? '1px solid rgba(56,189,248,0.35)' : '1px solid rgba(56,189,248,0.25)',
      shadow: isDark
        ? '0 8px 32px rgba(56,189,248,0.12)'
        : '0 8px 28px rgba(56,189,248,0.08)',
      iconRing: 'rgba(56,189,248,0.4)',
      iconGlow: 'rgba(56,189,248,0.25)',
      iconColor: isDark ? '#38bdf8' : '#2563eb',
      title: 'Expediciones Planificadas',
      statLabel: 'Expediciones planificadas',
    },
    {
      icon: Calendar,
      // Verde esmeralda
      glassBg: isDark
        ? 'radial-gradient(circle at 30% 25%, rgba(16,185,129,0.15), rgba(16,185,129,0.05) 70%), rgba(26,26,46,0.65)'
        : 'radial-gradient(circle at 30% 25%, rgba(16,185,129,0.10), rgba(16,185,129,0.02) 70%), rgba(255,255,255,0.85)',
      border: isDark ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(16,185,129,0.25)',
      shadow: isDark
        ? '0 8px 32px rgba(16,185,129,0.12)'
        : '0 8px 28px rgba(16,185,129,0.08)',
      iconRing: 'rgba(16,185,129,0.4)',
      iconGlow: 'rgba(16,185,129,0.25)',
      iconColor: isDark ? '#34d399' : '#047857',
      title: 'Reservas Activas',
      statLabel: 'Reservas activas',
    },
  ];

  return (
    <div
      className="w-full min-h-screen p-6 space-y-8 transition-colors duration-500"
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

      {/* Header – con textos originales */}
      <div className="flex items-center justify-between relative z-10">
        <h2
          className="text-2xl font-bold tracking-wide"
          style={{ fontFamily: 'Cinzel, serif', color: titleColor }}
        >
          Estadísticas Administrativas
        </h2>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 0 20px rgba(99,102,241,0.3)',
            color: '#fff',
            border: 'none',
          }}
        >
          <Printer size={18} strokeWidth={1.8} />
          Imprimir Reporte Oficial (PDF)
        </button>
      </div>

      {/* Cards Grid – cada una con su propio color de cristal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {cardAccents.map((accent, idx) => {
          const Icon = accent.icon;
          const statValue = idx === 0 ? totalMuestras : idx === 1 ? expediciones : reservas;

          return (
            <div
              key={idx}
              className="relative p-4 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: accent.glassBg,
                border: accent.border,
                boxShadow: accent.shadow,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              {/* Icono estilo macOS glass */}
              <div
                className="flex items-center justify-center w-12 h-12 rounded-2xl mb-3"
                style={{
                  border: `1.5px solid ${accent.iconRing}`,
                  background: isDark
                    ? `radial-gradient(circle at 30% 25%, ${accent.iconGlow}, transparent 70%), rgba(26,26,46,0.6)`
                    : `radial-gradient(circle at 30% 25%, ${accent.iconGlow}, transparent 70%), rgba(255,255,255,0.8)`,
                  boxShadow: `0 0 16px ${accent.iconGlow}, inset 0 1px 1px rgba(255,255,255,0.25)`,
                  position: 'relative',
                }}
              >
                {/* Reflejo superior glass */}
                <span
                  className="absolute top-0 left-0 w-full h-1/2 rounded-2xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
                    opacity: 0.4,
                  }}
                />
                <Icon size={22} strokeWidth={1.8} color={accent.iconColor} />
              </div>

              {/* Título de la card (texto original) */}
              <h3
                className="text-lg font-semibold mb-1"
                style={{ fontFamily: 'Cinzel, serif', color: titleColor }}
              >
                {accent.title}
              </h3>

              {/* Valor principal */}
              <p className="text-3xl font-bold" style={{ color: valueColor }}>
                {statValue}
              </p>

              {/* Detalle secundario */}
              <p className="text-sm mt-1" style={{ color: descColor }}>
                {accent.statLabel}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 relative z-10">
        <div className="p-6 rounded-2xl backdrop-blur-xl" style={{background: cardAccents[0].glassBg, border: cardAccents[0].border, boxShadow: cardAccents[0].shadow}}>
          <h3 className="text-xl font-bold mb-4" style={{color: titleColor}}>Distribución de la Colección</h3>
          <div className="relative h-64 md:h-80 w-full">
            {doughnutData ? <Doughnut data={doughnutData} options={chartOptions} /> : <div className="h-64 flex items-center justify-center"><span className="animate-pulse">Cargando...</span></div>}
          </div>
        </div>
        <div className="p-6 rounded-2xl backdrop-blur-xl" style={{background: cardAccents[0].glassBg, border: cardAccents[0].border, boxShadow: cardAccents[0].shadow}}>
          <h3 className="text-xl font-bold mb-4" style={{color: titleColor}}>Reservas Activas por Mes</h3>
          <div className="relative h-64 md:h-80 w-full">
            {chartReady && barData ? <Bar data={barData} options={chartOptions} /> : <div className="h-64 flex items-center justify-center"><span className="animate-pulse">Cargando...</span></div>}
          </div>
        </div>
      </div>

      {/* Reporte imprimible – oculto en pantalla, visible en impresión */}
      <div className="hidden print:block mt-8 relative z-10">
        <h1
          className="text-center text-2xl font-bold mb-4"
          style={{ fontFamily: 'Cinzel, serif', color: '#1e1b4b' }}
        >
          CASA MUSEO POTOSÍ MINERAL - REPORTE OFICIAL DEL SISTEMA
        </h1>
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">Métrica</th>
              <th className="border p-2 text-left">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Total Muestras</td>
              <td className="border p-2">{totalMuestras}</td>
            </tr>
            <tr>
              <td className="border p-2">Minerales</td>
              <td className="border p-2">{minerales}</td>
            </tr>
            <tr>
              <td className="border p-2">Fósiles</td>
              <td className="border p-2">{fosiles}</td>
            </tr>
            <tr>
              <td className="border p-2">Expediciones Planificadas</td>
              <td className="border p-2">{expediciones}</td>
            </tr>
            <tr>
              <td className="border p-2">Reservas Activas</td>
              <td className="border p-2">{reservas}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-sm text-gray-600 text-center">
          Generado el {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default EstadisticasAdmin;
