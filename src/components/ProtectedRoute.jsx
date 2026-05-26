import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Verificamos si existe una sesión válida guardada en el LocalStorage
  const session = localStorage.getItem('user_session');

  // Si no hay sesión, forzamos la redirección estricta al login (Requerimiento 4.1)
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Si la sesión existe, permitimos el acceso al componente hijo (Tablero)
  return children;
}