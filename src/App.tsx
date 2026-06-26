import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Head from './components/head/Head';
import NavBar from './components/head/NavBar';
import WhatsAppFloating from './components/WhatsAppFloating';

import './App.css';
import { ThemeProvider } from './components/ThemeContext';
import AppRoutes from './routes'; // Importa las rutas

const AppContent = () => {
  const location = useLocation();
  const showWhatsApp = !location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative">
      <div  />
      
      <div className="min-h-screen">
        <Head />
        <NavBar />
        {/* Aquí van las rutas que cambiarán el contenido según la navegación */}
        <main>
          {/* Las rutas definidas en AppRoutes se manejarán aquí */}
          <AppRoutes />
        </main>
      </div>
      {showWhatsApp && <WhatsAppFloating />}
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;
