// src/routes/index.tsx
import { Routes, Route } from 'react-router-dom';

// Páginas Públicas
import Principal from '../pages/Principal';
import Shop from '../pages/shopify';

// IMPORTACIÓN CORRECTA: Jalamos el formulario real que está en la raíz de pages
import Inscripciones from '../pages/Inscripciones';
// Public Rutas and Expediciones page
import RutasPublic from '../components/public/RutasPublic';
import Historia from '../components/public/Historia';

// Páginas de Administración
import Login from '../pages/admin/Login';
import { ColeccionAdmin } from '../components/admin/ColeccionAdmin';
import Dashboard from '../pages/admin/Dashboard';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<Principal />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/login" element={<Login />} />
      
      {/* Vinculamos el path de tu menú (/reservas) con el formulario real */}
      <Route path="/reservas" element={<Inscripciones />} />

      {/* Rutas de Administración */}
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coleccion"
        element={
          <ProtectedRoute>
            <ColeccionAdmin />
          </ProtectedRoute>
        }
      />
        {/* Ruta pública de Rutas y Expediciones */}
          <Route path="/rutas" element={<RutasPublic />} />
          <Route path="/historia" element={<Historia />} />
    </Routes>
  );
};

export default AppRoutes;
