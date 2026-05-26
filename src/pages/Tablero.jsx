import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import { getTareas, createTarea, updateTarea, deleteTarea } from '../services/api';

export default function Tablero() {
  const navigate = useNavigate();
  
  // Estados principales del CRUD
  const [listaReservas, setListaReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados del Formulario
  const [nombreCliente, setNombreCliente] = useState('');
  const [fechaHora, setFechaHora] = useState('');
  const [cantidadPersonas, setCantidadPersonas] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todas');

  // Estado para controlar si estamos editando una reserva existente
  const [idReservaEdicion, setIdReservaEdicion] = useState(null);

  // Sesión segura del LocalStorage
  const session = JSON.parse(localStorage.getItem('user_session')) || { fullName: 'Anfitrión', shift: 'Mañana' };

  useEffect(() => {
    cargarReservas();
  }, []);

  // GET: Cargar el libro de reservas
  const cargarReservas = async () => {
    try {
      setLoading(true);
      const datos = await getTareas();
      setListaReservas(datos);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de sincronización',
        text: 'No se pudo conectar con el servidor de Table-Track.',
        confirmButtonColor: '#2b5138'
      });
    } finally {
      setLoading(false);
    }
  };

  // POST / PUT: Procesar creación o actualización de reserva
  const handleGuardarReserva = async (e) => {
    e.preventDefault();
    
    if (nombreCliente.trim() === '' || cantidadPersonas === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'El nombre del cliente y la cantidad de personas son obligatorios.',
        confirmButtonColor: '#c05c34'
      });
      return;
    }

    const datosReserva = {
      nombreCliente: nombreCliente.trim(),
      cantidadPersonas: Number(cantidadPersonas),
      fechaHora: fechaHora || new Date().toISOString(),
      estado: idReservaEdicion ? (listaReservas.find(r => r.id === idReservaEdicion)?.estado || 'Confirmada') : 'Confirmada'
    };

    try {
      if (idReservaEdicion) {
        // Ejecuta PUT para actualización (Requerido Regla 4.2)
        await updateTarea(idReservaEdicion, datosReserva);
        Swal.fire({
          icon: 'success',
          title: 'Reserva Actualizada',
          text: `Los cambios de ${nombreCliente} se guardaron correctamente.`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        // Ejecuta POST para nueva creación
        await createTarea(datosReserva);
        Swal.fire({
          icon: 'success',
          title: '¡Mesa Reservada!',
          text: `La reserva de ${nombreCliente} se registró con éxito.`,
          timer: 2000,
          showConfirmButton: false
        });
      }

      // Limpieza y reseteo del formulario
      setNombreCliente('');
      setCantidadPersonas('');
      setFechaHora('');
      setIdReservaEdicion(null);
      cargarReservas();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error operativo',
        text: 'Hubo un problema al procesar los datos en el servidor.',
        confirmButtonColor: '#c05c34'
      });
    }
  };

  // Función para activar el modo edición (Sube los datos al formulario)
  const activarEdicion = (reserva) => {
    setIdReservaEdicion(reserva.id);
    // Controlamos fallbacks si el campo de la API viene cruzado
    setNombreCliente(reserva.nombreCliente || reserva.name || '');
    setCantidadPersonas(reserva.cantidadPersonas && !isNaN(reserva.cantidadPersonas) ? reserva.cantidadPersonas : '');
    
    if (reserva.fechaHora && typeof reserva.fechaHora === 'string') {
      setFechaHora(reserva.fechaHora.substring(0, 16));
    } else {
      setFechaHora('');
    }
    
    // Alerta sutil al usuario
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Reserva cargada en el formulario para editar',
      showConfirmButton: false,
      timer: 2500
    });
  };

  // PUT: Finalizar ciclo de la mesa
  const handleFinalizarReserva = async (reserva) => {
    try {
      const datosActualizados = { 
        ...reserva, 
        nombreCliente: reserva.nombreCliente || reserva.name || "Cliente",
        cantidadPersonas: reserva.cantidadPersonas && !isNaN(reserva.cantidadPersonas) ? Number(reserva.cantidadPersonas) : 2,
        estado: 'Finalizada' 
      };
      await updateTarea(reserva.id, datosActualizados);
      
      Swal.fire({
        icon: 'success',
        title: 'Mesa Liberada',
        text: 'La mesa ha sido marcada como Finalizada.',
        timer: 1500,
        showConfirmButton: false
      });
      cargarReservas();
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el estado.' });
    }
  };

  // DELETE: Cancelar reserva con confirmación obligatoria de SweetAlert2
  const handleCancelarReserva = async (id) => {
    Swal.fire({
      title: '¿Estás seguro de cancelar esta reserva?',
      text: "Esta acción eliminará de forma permanente el registro del libro.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c05c34',
      cancelButtonColor: '#8c6d53',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTarea(id);
          Swal.fire({
            title: '¡Cancelada!',
            text: 'La reserva ha sido removida del sistema de forma segura.',
            icon: 'success',
            confirmButtonColor: '#2b5138'
          });
          cargarReservas();
        } catch (error) {
          Swal.fire({ icon: 'error', title: 'Fallo', text: 'No se pudo eliminar el registro.' });
        }
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    navigate('/login');
  };

  const reservasFiltradas = listaReservas.filter(reserva => {
    if (filtroEstado === 'Todas') return true;
    if (!reserva.estado) return false;
    return reserva.estado.toLowerCase() === filtroEstado.toLowerCase();
  });

  const formatearFecha = (fechaString) => {
    if (!fechaString || typeof fechaString !== 'string' || fechaString.includes('http')) return 'Fecha por programar';
    try {
      const fecha = new Date(fechaString);
      if (isNaN(fecha.getTime())) return 'Fecha por programar';
      return fecha.toLocaleString('es-CO', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      });
    } catch {
      return 'Fecha por programar';
    }
  };

  return (
    <div style={{ backgroundColor: '#fbf7ed', minHeight: '100vh', padding: '30px 20px', fontFamily: "'Segoe UI', Roboto, sans-serif", boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #d4c5a9', paddingBottom: '20px', marginBottom: '25px' }}>
          <div>
            <h2 style={{ margin: 0, color: '#5c3826', fontSize: '28px', fontWeight: '700' }}>🛎️ Panel de Control — Table-Track</h2>
            <p style={{ color: '#8c6d53', margin: '6px 0 0 0', fontSize: '15px', fontWeight: '500' }}>
              Anfitrión Activo: <strong style={{ color: '#5c3826' }}>{session.fullName}</strong> | Turno: <strong style={{ color: '#c05c34' }}>{session.shift}</strong>
            </p>
          </div>
          <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#c05c34', color: '#f4ecd8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(192, 92, 52, 0.2)' }}>
            Cerrar Sesión
          </button>
        </header>

        {/* Formulario Dinámico (Crear / Editar) */}
        <section style={{ padding: '25px', border: '1px solid #d4c5a9', borderRadius: '10px', backgroundColor: '#f4ecd8', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', marginBottom: '35px' }}>
          <h3 style={{ marginTop: 0, color: '#5c3826', fontSize: '18px', marginBottom: '18px' }}>
            {idReservaEdicion ? '✏️ Modificar Detalles de Reserva' : 'Registrar Nueva Reserva 🍽️'}
          </h3>
          <form onSubmit={handleGuardarReserva} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Nombre del Cliente / Mesa" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} style={{ padding: '12px', flex: '2', minWidth: '220px', borderRadius: '6px', border: '1px solid #d4c5a9', fontSize: '15px', color: '#3d2417', outline: 'none' }} />
            <input type="number" placeholder="Pax" value={cantidadPersonas} onChange={(e) => setCantidadPersonas(e.target.value)} style={{ padding: '12px', flex: '0.8', minWidth: '90px', borderRadius: '6px', border: '1px solid #d4c5a9', fontSize: '15px', color: '#3d2417', outline: 'none' }} />
            <input type="datetime-local" value={fechaHora} onChange={(e) => setFechaHora(e.target.value)} style={{ padding: '12px', flex: '1.5', minWidth: '180px', borderRadius: '6px', border: '1px solid #d4c5a9', fontSize: '15px', color: '#3d2417', outline: 'none' }} />
            
            <button type="submit" style={{ padding: '12px 24px', backgroundColor: idReservaEdicion ? '#5c3826' : '#2b5138', color: '#f4ecd8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 8px rgba(43, 81, 56, 0.2)', transition: 'background-color 0.2s' }}>
              {idReservaEdicion ? 'Actualizar Reserva' : 'Confirmar Mesa'}
            </button>
            {idReservaEdicion && (
              <button type="button" onClick={() => { setIdReservaEdicion(null); setNombreCliente(''); setCantidadPersonas(''); setFechaHora(''); }} style={{ padding: '12px', backgroundColor: 'transparent', color: '#c05c34', border: '1px solid #c05c34', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cancelar Edición
              </button>
            )}
          </form>
        </section>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '25px' }}>
          <span style={{ fontWeight: '600', color: '#5c3826', fontSize: '15px' }}>Filtrar Libro:</span>
          {['Todas', 'Confirmada', 'En Espera', 'Finalizada'].map((estado) => (
            <button key={estado} onClick={() => setFiltroEstado(estado)} style={{ padding: '8px 18px', borderRadius: '20px', border: '1px solid #c05c34', backgroundColor: filtroEstado === estado ? '#c05c34' : 'transparent', color: filtroEstado === estado ? '#f4ecd8' : '#c05c34', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
              {estado}
            </button>
          ))}
        </div>

        {/* Libro de Reservas */}
        <main>
          <h3 style={{ color: '#5c3826', fontSize: '20px', borderBottom: '1px solid #d4c5a9', paddingBottom: '10px', marginBottom: '20px' }}>Libro de Reservas Activo</h3>
          {loading ? (
            <p style={{ color: '#2b5138', fontWeight: 'bold', textAlign: 'center', marginTop: '40px' }}>Consultando disponibilidad en tiempo real... ⏳</p>
          ) : reservasFiltradas.length === 0 ? (
            <p style={{ color: '#8c6d53', fontStyle: 'italic', textAlign: 'center', marginTop: '40px' }}>No se registran reservas bajo el estado "{filtroEstado}".</p>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {reservasFiltradas.map((reserva) => {
                const esFinalizada = reserva.estado?.toLowerCase() === 'finalizada';
                
                // CONTROL DE MAPEO API: Fallbacks seguros para evitar datos basura en la UI
                const nombreSeguro = reserva.nombreCliente || reserva.name || "Mesa sin Identificar";
                const paxSeguro = (reserva.cantidadPersonas && !isNaN(reserva.cantidadPersonas)) ? reserva.cantidadPersonas : 2;
                const fechaSegura = reserva.fechaHora && !reserva.fechaHora.includes('http') ? reserva.fechaHora : null;

                return (
                  <div key={reserva.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', border: '1px solid #d4c5a9', borderLeft: esFinalizada ? '6px solid #8c6d53' : '6px solid #2b5138', borderRadius: '8px', backgroundColor: esFinalizada ? '#eae3d2' : '#ffffff', opacity: esFinalizada ? 0.75 : 1 }}>
                    <div style={{ flex: '1', minWidth: '0', marginRight: '15px' }}>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '19px', color: '#5c3826', textDecoration: esFinalizada ? 'line-through' : 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {nombreSeguro}
                      </h4>
                      <p style={{ margin: '0 0 10px 0', color: '#6d523f', fontSize: '14px' }}>
                        <strong>Pax:</strong> {paxSeguro} | <strong>Fecha:</strong> {formatearFecha(fechaSegura)}
                      </p>
                      <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '12px', backgroundColor: esFinalizada ? '#d4c5a9' : '#d2e4d6', color: esFinalizada ? '#5c3826' : '#193822', fontWeight: 'bold' }}>
                        {reserva.estado || 'Confirmada'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                      {!esFinalizada && (
                        <>
                          <button onClick={() => activarEdicion(reserva)} style={{ padding: '10px 16px', backgroundColor: '#8c6d53', color: '#f4ecd8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                            ✏️ Editar
                          </button>
                          <button onClick={() => handleFinalizarReserva(reserva)} style={{ padding: '10px 16px', backgroundColor: '#2b5138', color: '#f4ecd8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                            ✅ Finalizar
                          </button>
                        </>
                      )}
                      <button onClick={() => handleCancelarReserva(reserva.id)} style={{ padding: '10px 16px', backgroundColor: 'transparent', color: '#c05c34', border: '1px solid #c05c34', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}