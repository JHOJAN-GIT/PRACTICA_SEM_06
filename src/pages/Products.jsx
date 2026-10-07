// Página Products: lista de productos desde DummyJSON API
// Demuestra: consumo axios + async/await, loading/error/data, .map() con key,
// renderizado condicional (&&, ternario), AbortController cleanup en useProducts

import { useState } from 'react';
import useProducts from '../hooks/useProducts';
import styles from './Products.module.css';

// Sub-componente: tarjeta de producto individual
// Recibe datos por props → transmisión correcta de datos
function ProductCard({ product }) {
  const discount = product.discountPercentage
    ? Math.round(product.discountPercentage)
    : null;

  const originalPrice = discount
    ? (product.price / (1 - discount / 100)).toFixed(2)
    : null;

  return (
    <article className={styles.card}>
      {/* Renderizado condicional: badge de descuento solo si existe */}
      {discount && (
        <span className={styles.discountBadge}>-{discount}%</span>
      )}

      <div className={styles.cardImageWrap}>
        <img
          src={product.thumbnail}
          alt={product.title}
          className={styles.cardImage}
          loading="lazy"
        />
      </div>

      <div className={styles.cardBody}>
        <span className={styles.cardCategory}>{product.category}</span>
        <h3 className={styles.cardTitle}>{product.title}</h3>
        <p className={styles.cardDesc}>{product.description}</p>

        {/* Rating con estrellas */}
        <div className={styles.cardRating}>
          <span className={styles.stars}>
            {'★'.repeat(Math.round(product.rating))}
            {'☆'.repeat(5 - Math.round(product.rating))}
          </span>
          <span className={styles.ratingValue}>{product.rating.toFixed(1)}</span>
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.priceBlock}>
            <span className={styles.price}>${product.price}</span>
            {/* Ternario: precio tachado solo si hay descuento */}
            {originalPrice ? (
              <span className={styles.originalPrice}>${originalPrice}</span>
            ) : null}
          </div>
          <span className={`${styles.stock} ${product.stock < 10 ? styles.lowStock : ''}`}>
            {product.stock < 10 ? `⚠ ${product.stock} left` : `✓ In stock`}
          </span>
        </div>
      </div>
    </article>
  );
}

// Sub-componente: skeleton de carga
function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} style={{ width: '40%' }} />
        <div className={styles.skeletonLine} style={{ width: '80%' }} />
        <div className={styles.skeletonLine} style={{ width: '60%' }} />
      </div>
    </div>
  );
}

// Página principal
function Products() {
  const [search, setSearch] = useState('');
  const [query,  setQuery]  = useState('');

  // Hook personalizado: encapsula fetch + AbortController + loading/error/data
  // IA: problema con doble render en dev (StrictMode) → Solución manual:
  // AbortController en cleanup de useEffect cancela la petición duplicada
  const { products, loading, error, total } = useProducts(12, query);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search.trim());
  };

  const handleClear = () => {
    setSearch('');
    setQuery('');
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>

        {/* Header de página */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Catálogo de Productos</h1>
            {/* Renderizado condicional con ternario: total vs sin resultados */}
            <p className={styles.pageSubtitle}>
              {loading
                ? 'Cargando productos...'
                : total > 0
                  ? `${total} productos disponibles`
                  : 'Sin resultados para esta búsqueda'}
            </p>
          </div>

          {/* Formulario de búsqueda */}
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              className={styles.searchInput}
              aria-label="Buscar productos"
            />
            <button type="submit" className={styles.searchBtn}>
              🔍
            </button>
            {/* Renderizado condicional &&: botón limpiar solo si hay query */}
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className={styles.clearBtn}
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </form>
        </div>

        {/* === ESTADO: ERROR === */}
        {error && (
          <div className={styles.errorBox} role="alert">
            <span className={styles.errorIcon}>⚠️</span>
            <div>
              <strong>Error al cargar productos</strong>
              <p>{error}</p>
            </div>
            <button onClick={handleClear} className={styles.retryBtn}>
              Reintentar
            </button>
          </div>
        )}

        {/* === ESTADO: LOADING → skeletons === */}
        {loading && !error && (
          <div className={styles.grid}>
            {/* Renderizado iterativo de skeletons con key única */}
            {Array.from({ length: 12 }, (_, i) => (
              <SkeletonCard key={`skeleton-${i}`} />
            ))}
          </div>
        )}

        {/* === ESTADO: DATA → lista de productos === */}
        {!loading && !error && (
          <>
            {products.length > 0 ? (
              <div className={styles.grid}>
                {/* .map() con key estable (product.id único de la API) */}
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Renderizado condicional: estado vacío */
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>🔍</span>
                <h3>Sin resultados</h3>
                <p>No encontramos productos para "{query}"</p>
                <button onClick={handleClear} className={styles.retryBtn}>
                  Ver todos los productos
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}

export default Products;
