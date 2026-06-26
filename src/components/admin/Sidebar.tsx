import React from 'react';
import { useTheme } from '../useTheme';

type SidebarProps = {
  /** Callback to log the user out */
  onLogout: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const { theme } = useTheme();
  const bgClass = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white';
  const borderClass = 'border-r border-gray-200 dark:border-gray-700';

  return (
    <aside className={`${bgClass} ${borderClass} w-64 min-h-screen p-4`}>
      <h2 className="text-xl font-bold mb-4 text-center">Menú Admin</h2>
      <nav className="flex flex-col space-y-2">
        <a href="/admin/reservas" className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="mr-2">📅</span>
          <span>Reservas</span>
        </a>
        <a href="/admin/expediciones" className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="mr-2">🧭</span>
          <span>Expediciones</span>
        </a>
        <a href="/admin/catalogo" className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="mr-2">💎</span>
          <span>Catálogo</span>
        </a>
        <button
          onClick={onLogout}
          className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 mt-4 border-t pt-2 w-full text-left"
        >
          <span className="mr-2">🚪</span>
          <span>Cerrar Sesión</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
