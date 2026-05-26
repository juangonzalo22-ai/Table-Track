import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Tablero from './pages/Tablero'; // Este es el componente que cambiaremos de nombre en el Paso 2
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta Pública Requerida (Regla 4.1) */}
        <Route path="/login" element={<Login />} />

        {/* Ruta Privada Modificada a la exigida por la empresa (Regla 4.2) */}
        <Route 
          path="/panel" 
          element={
            <ProtectedRoute>
              <Tablero />
            </ProtectedRoute>
          } 
        />

        {/* Redirección automática al Login por seguridad */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}