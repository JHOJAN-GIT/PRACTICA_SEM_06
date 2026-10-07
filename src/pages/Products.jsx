// Página Products: catálogo estático de productos tech con imágenes reales
// Demuestra: .map() con key, renderizado condicional (&&, ternario), búsqueda con useState

import { useState, useMemo } from 'react';
import styles from './Products.module.css';

// Datos estáticos de productos tech con imágenes de Unsplash
const TECH_PRODUCTS = [
  {
    id: 1,
    title: 'MacBook Pro 16"',
    category: 'Laptops',
    price: 2499,
    originalPrice: 2799,
    rating: 4.9,
    stock: 8,
    badge: 'Top Ventas',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=280&fit=crop',
    desc: 'Chip M3 Pro, 18GB RAM, pantalla Liquid Retina XDR. Potencia profesional sin compromisos.',
  },
  {
    id: 2,
    title: 'iPhone 16 Pro',
    category: 'Smartphones',
    price: 1199,
    originalPrice: 1299,
    rating: 4.8,
    stock: 15,
    badge: 'Nuevo',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=280&fit=crop',
    desc: 'Camera Control, chip A18 Pro, titanio grado aeroespacial y pantalla Always-On.',
  },
  {
    id: 3,
    title: 'Sony WH-1000XM5',
    category: 'Audio',
    price: 349,
    originalPrice: 399,
    rating: 4.8,
    stock: 22,
    badge: null,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=280&fit=crop',
    desc: 'Cancelación de ruido líder en la industria, 30h de batería, audio LDAC Hi-Res.',
  },
  {
    id: 4,
    title: 'Dell XPS 15',
    category: 'Laptops',
    price: 1899,
    originalPrice: null,
    rating: 4.7,
    stock: 5,
    badge: 'Pocas unidades',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=280&fit=crop',
    desc: 'Intel Core i9, RTX 4070, pantalla OLED 3.5K táctil. La workstation portátil definitiva.',
  },
  {
    id: 5,
    title: 'iPad Pro M4',
    category: 'Tablets',
    price: 1099,
    originalPrice: 1199,
    rating: 4.9,
    stock: 18,
    badge: 'Nuevo',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=280&fit=crop',
    desc: 'El iPad más delgado y potente. Pantalla Ultra Retina XDR con nanotextura.',
  },
  {
    id: 6,
    title: 'Samsung Galaxy S25 Ultra',
    category: 'Smartphones',
    price: 1299,
    originalPrice: 1399,
    rating: 4.7,
    stock: 12,
    badge: null,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=280&fit=crop',
    desc: 'Snapdragon 8 Elite, S Pen integrado, cámara 200MP con zoom espacial 100x.',
  },
  {
    id: 7,
    title: 'LG UltraWide 34"',
    category: 'Monitores',
    price: 799,
    originalPrice: 899,
    rating: 4.6,
    stock: 9,
    badge: null,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a573d5e6b3?w=400&h=280&fit=crop',
    desc: 'Panel IPS 21:9, 144Hz, 1ms, HDR400. Productividad y gaming en un solo monitor.',
  },
  {
    id: 8,
    title: 'Apple Watch Ultra 2',
    category: 'Wearables',
    price: 799,
    originalPrice: null,
    rating: 4.8,
    stock: 7,
    badge: 'Top Ventas',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=280&fit=crop',
    desc: 'Titanio aeroespacial, GPS de doble frecuencia, 60h batería en modo Ultra.',
  },
  {
    id: 9,
    title: 'Logitech MX Master 3S',
    category: 'Accesorios',
    price: 99,
    originalPrice: 119,
    rating: 4.9,
    stock: 40,
    badge: null,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=280&fit=crop',
    desc: 'Sensor óptico 8000 DPI, scroll MagSpeed, carga USB-C, compatible con 3 dispositivos.',
  },
  {
    id: 10,
    title: 'DJI Osmo Pocket 3',
    category: 'Cámaras',
    price: 519,
    originalPrice: 559,
    rating: 4.7,
    stock: 14,
    badge: null,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=280&fit=crop',
    desc: 'Sensor 1" CMOS, 4K/120fps, ActiveTrack 6.0, pantalla táctil giratoria 2".',
  },
  {
    id: 11,
    title: 'Keychron Q1 Pro',
    category: 'Accesorios',
    price: 199,
    originalPrice: null,
    rating: 4.8,
    stock: 25,
    badge: null,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=280&fit=crop',
    desc: 'Teclado mecánico inalámbrico 75%, aluminio CNC, switches Gateron Pro, RGB.',
  },
  {
    id: 12,
    title: 'Steam Deck OLED',
    category: 'Gaming',
    price: 549,
    originalPrice: 599,
    rating: 4.8,
    stock: 11,
    badge: 'Hot',
    image: 'https://images.unsplash.com/photo-1625805866449-3671ee1b90bf?w=400&h=280&fit=crop',
    desc: 'Pantalla OLED HDR 7.4", AMD APU, 1TB SSD, 12h batería. PC gaming de bolsillo.',
  },
];

const CATEGORIES = ['Todas', ...new Set(TECH_PRODUCTS.map((p) => p.category))];

// Tarjeta de producto
function ProductCard({ product }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <article className={styles.card}>
      {/* Renderizado condicional &&: badge solo si existe */}
      {product.badge && (
        <span className={`${styles.badge} ${styles[`badge_${product.badge.replace(/\s/g,'_')}`] || ''}`}>
          {product.badge}
        </span>
      )}

      <div className={styles.imageWrap}>
        <img src={product.image} alt={product.title} className={styles.image} loading="lazy" />
      </div>

      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.desc}>{product.desc}</p>

        <div className={styles.rating}>
          <span className={styles.stars}>
            {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
          </span>
          <span className={styles.ratingVal}>{product.rating}</span>
        </div>

        <div className={styles.footer}>
          <div className={styles.priceRow}>
            <span className={styles.price}>${product.price}</span>
            {/* Ternario: precio original tachado */}
            {product.originalPrice ? (
              <span className={styles.oldPrice}>${product.originalPrice}</span>
            ) : null}
            {discount && <span className={styles.discountPill}>-{discount}%</span>}
          </div>
          <span className={`${styles.stock} ${product.stock <= 8 ? styles.stockLow : ''}`}>
            {product.stock <= 8 ? `⚠ ${product.stock} uds` : '✓ Disponible'}
          </span>
        </div>
      </div>
    </article>
  );
}

function Products() {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('Todas');

  // useMemo: evita recalcular el filtro en cada render no relacionado
  // → optimización que se documenta en comentario según guía (Paso 5)
  const filtered = useMemo(() => {
    return TECH_PRODUCTS.filter((p) => {
      const matchCat    = category === 'Todas' || p.category === category;
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Catálogo Tech</h1>
            <p className={styles.pageSubtitle}>
              {/* Ternario: texto dinámico según resultados */}
              {filtered.length > 0
                ? `${filtered.length} producto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`
                : 'Sin resultados'}
            </p>
          </div>

          {/* Búsqueda */}
          <div className={styles.searchWrap}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              className={styles.searchInput}
              aria-label="Buscar"
            />
            {/* && : botón limpiar solo si hay texto */}
            {search && (
              <button onClick={() => setSearch('')} className={styles.clearBtn} aria-label="Limpiar">✕</button>
            )}
          </div>
        </div>

        {/* Filtros de categoría — renderizado iterativo con .map() */}
        <div className={styles.filters}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`${styles.filterBtn} ${category === cat ? styles.filterActive : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de productos o estado vacío */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🔍</span>
            <h3>Sin resultados</h3>
            <p>Intenta con otro término o categoría</p>
            <button onClick={() => { setSearch(''); setCategory('Todas'); }} className={styles.resetBtn}>
              Ver todos
            </button>
          </div>
        )}

      </div>
    </main>
  );
}

export default Products;
