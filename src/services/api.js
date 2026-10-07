// Servicio centralizado de API usando axios
// Todas las peticiones al backend pasan por aquí

import axios from 'axios';

// Instancia base de axios con configuración compartida
const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor de respuesta para manejo global de errores ---
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normaliza el error para que siempre tenga un mensaje legible
    const message =
      error.response?.data?.message ||
      error.message ||
      'Error desconocido en la petición';
    return Promise.reject(new Error(message));
  }
);

// --- Endpoints de productos ---
export const productsService = {
  /**
   * Obtiene lista paginada de productos
   * @param {number} limit - Cantidad de productos
   * @param {number} skip  - Offset para paginación
   * @param {AbortSignal} signal - Para cancelar la petición (AbortController)
   */
  getAll: (limit = 12, skip = 0, signal) =>
    apiClient.get('/products', { params: { limit, skip }, signal }),

  /**
   * Obtiene un producto por ID
   */
  getById: (id, signal) =>
    apiClient.get(`/products/${id}`, { signal }),

  /**
   * Busca productos por texto
   */
  search: (query, signal) =>
    apiClient.get('/products/search', { params: { q: query }, signal }),

  /**
   * Obtiene todas las categorías disponibles
   */
  getCategories: (signal) =>
    apiClient.get('/products/categories', { signal }),
};

export default apiClient;
