import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Login() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [shift, setShift] = useState('Mañana');

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (fullName.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Acceso Denegado',
        text: 'Por favor, introduce tu Nombre Completo para registrar el turno operativo.',
        confirmButtonColor: '#2b5138'
      });
      return;
    }

    const sessionData = {
      fullName: fullName.trim(),
      shift: shift
    };
    
    localStorage.setItem('user_session', JSON.stringify(sessionData));
    navigate('/panel');
  };

  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      width: '100vw',
      // Fondo difuminado ambiental de restaurante clásico usando un Unsplash libre de alta calidad
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      margin: 0,
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#f4ecd8', // Tono crema/papiro cálido del fondo de la tarjeta
        padding: '35px 40px', 
        borderRadius: '12px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '420px',
        borderTop: '8px solid #c05c34', // Línea superior terracota / arcilla del diseño
        boxSizing: 'border-box'
      }}>
        {/* Encabezado e Icono de la Campana Antigua */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{ fontSize: '45px', margin: '0 0 10px 0', lineHeight: '1' }}>🛎️</div>
          <h2 style={{ 
            margin: '0 0 5px 0', 
            color: '#5c3826', // Marrón oscuro tabaco para el título principal
            fontSize: '32px',
            fontWeight: '700',
            letterSpacing: '-0.5px'
          }}>
            Table-Track
          </h2>
          <p style={{ 
            margin: 0, 
            color: '#8c6d53', // Marrón suave para el subtítulo
            fontSize: '14px',
            fontWeight: '500',
            letterSpacing: '0.5px'
          }}>
            Sistema de Gestión de Reservas
          </p>
        </div>

        <form onSubmit={handleLoginSubmit}>
          {/* Campo: Nombre del Anfitrión */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#5c3826',
              fontSize: '14px'
            }}>
              Nombre Completo del Anfitrión
            </label>
            <input 
              type="text"
              placeholder="Ej. Abelardo de la Espriella"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '6px',
                border: '1px solid #d4c5a9',
                backgroundColor: '#eae0c9', // Input sutilmente más oscuro que la tarjeta
                color: '#3d2417',
                boxSizing: 'border-box',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#c05c34'}
              onBlur={(e) => e.target.style.borderColor = '#d4c5a9'}
            />
          </div>

          {/* Campo: Selector de Turno */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#5c3826',
              fontSize: '14px'
            }}>
              Turno Asignado
            </label>
            <div style={{ position: 'relative' }}>
              <select 
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '6px',
                  border: '1px solid #d4c5a9',
                  backgroundColor: '#eae0c9',
                  color: '#3d2417',
                  fontSize: '15px',
                  cursor: 'pointer',
                  appearance: 'none', // Limpia la flecha nativa fea del navegador
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              >
                <option value="Mañana">🌅 Mañana</option>
                <option value="Tarde">☀️ Tarde</option>
                <option value="Noche">🌙 Noche</option>
              </select>
              {/* Pequeño indicador de flecha personalizado */}
              <div style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#5c3826',
                pointerEvents: 'none',
                fontSize: '12px'
              }}>▼</div>
            </div>
          </div>

          {/* Botón Verde Oliva */}
          <button type="submit" style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#2b5138', // Color verde oliva profundo del diseño
            color: '#f4ecd8', // Texto en contraste crema claro
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(43, 81, 56, 0.3)',
            transition: 'all 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#213e2b';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#2b5138';
            e.target.style.transform = 'translateY(0)';
          }}
          >
            Ingresar al Panel
          </button>
        </form>
      </div>
    </div>
  );
}