// Hook personalizado: encapsula lógica de fetch de productos
// Maneja estados: loading, data, error + cleanup con AbortController

import { useState, useEffect } from 'react';
import { productsService } from '../services/api';

/**
 * useProducts
 * @param {number} limit  - Productos por carga (default 12)
 * @param {string} search - Término de búsqueda opcional
 * @returns {{ products, loading, error, total }}
 */
function useProducts(limit = 12, search = '') {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [total, setTotal]       = useState(0);

  useEffect(() => {
    // AbortController para cancelar la petición si el componente se desmonta
    // → evita actualizar estado en componentes no montados (memory leak)
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Prohibido usar .then().catch() anidados → async/await obligatorio
        const response = search
          ? await productsService.search(search, controller.signal)
          : await productsService.getAll(limit, 0, controller.signal);

        // Si la petición fue abortada, no actualizar estado
        if (!controller.signal.aborted) {
          setProducts(response.data.products);
          setTotal(response.data.total);
        }
      } catch (err) {
        // No reportar error si fue por abort (navegación / desmontaje)
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError(err.message || 'Error al cargar productos');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    // Cleanup: cancela la petición en vuelo al desmontar o cambiar dependencias
    return () => controller.abort();
  }, [limit, search]); // Re-ejecuta solo cuando cambia limit o search

  return { products, loading, error, total };
}

export default useProducts;
