import axios from 'axios';

// URL Limpia y oficial de tu MockAPI
const API_URL = 'https://6a1466bd6c7db8aac05473b1.mockapi.io/tasks';

export const getTareas = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error GET:", error);
    throw error;
  }
};

export const createTarea = async (nuevaReserva) => {
  try {
    const response = await axios.post(API_URL, nuevaReserva);
    return response.data;
  } catch (error) {
    console.error("Error POST:", error);
    throw error;
  }
};

// Nueva función PUT para actualizar campos o estados (Requerimiento 4.2)
export const updateTarea = async (id, datosActualizados) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, datosActualizados);
    return response.data;
  } catch (error) {
    console.error("Error PUT:", error);
    throw error;
  }
};

export const deleteTarea = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error DELETE:", error);
    throw error;
  }
};