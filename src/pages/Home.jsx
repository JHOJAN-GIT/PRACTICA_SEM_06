// Página Home: hero section + tarjetas de features + CTA
// Renderizado condicional con && y ternario demostrado en stats

import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const FEATURES = [
  {
    id: 1,
    icon: '🚀',
    title: 'Rendimiento Ultra',
    desc: 'Construido con Vite para tiempos de carga sub-segundo y HMR instantáneo.',
    color: 'purple',
  },
  {
    id: 2,
    icon: '🛡️',
    title: 'API Segura',
    desc: 'Consumo de datos con Axios, manejo de errores robusto y AbortController.',
    color: 'cyan',
  },
  {
    id: 3,
    icon: '🎨',
    title: 'UI Moderna',
    desc: 'Diseño glassmorphism con CSS Modules, gradientes y animaciones fluidas.',
    color: 'pink',
  },
  {
    id: 4,
    icon: '⚡',
    title: 'React 19',
    desc: 'Hooks modernos, renderizado optimizado y arquitectura basada en componentes.',
    color: 'amber',
  },
];

const STATS = [
  { id: 1, value: '194+', label: 'Productos' },
  { id: 2, value: '4',    label: 'Páginas SPA' },
  { id: 3, value: '0ms',  label: 'Recarga' },
  { id: 4, value: '100%', label: 'React' },
];

function Home() {
  // Renderizado condicional con ternario: muestra badge de estado
  const isOnline = navigator.onLine;

  return (
    <main className={styles.main}>

      {/* === HERO === */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          {/* Renderizado condicional con && */}
          {isOnline && (
            <span className={styles.heroBadge}>
              <span className={styles.badgeDot} />
              API Conectada
            </span>
          )}

          <h1 className={styles.heroTitle}>
            Descubre el futuro
            <br />
            <span className={styles.heroGradient}>del Tech Shopping</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Explora más de 194 productos de tecnología en tiempo real. Datos
            frescos desde la API, experiencia sin recarga de página.
          </p>

          <div className={styles.heroCtas}>
            <Link to="/products" className={styles.ctaPrimary}>
              Ver Productos →
            </Link>
            <Link to="/form" className={styles.ctaSecondary}>
              Contactar
            </Link>
          </div>
        </div>

        {/* Decoración visual */}
        <div className={styles.heroVisual}>
          <div className={styles.orb1} />
          <div className={styles.orb2} />
          <div className={styles.orb3} />
          <div className={styles.heroCard}>
            <span className={styles.heroCardIcon}>◈</span>
            <span className={styles.heroCardText}>TechStore PRO</span>
          </div>
        </div>
      </section>

      {/* === STATS === */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {/* Renderizado iterativo con .map() → key = id único y estable */}
          {STATS.map(({ id, value, label }) => (
            <div key={id} className={styles.statCard}>
              <span className={styles.statValue}>{value}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* === FEATURES === */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>¿Por qué TechStore?</h2>
          <p className={styles.sectionSubtitle}>
            Tecnología moderna, experiencia impecable
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {FEATURES.map(({ id, icon, title, desc, color }) => (
            <article key={id} className={`${styles.featureCard} ${styles[`card_${color}`]}`}>
              <span className={styles.featureIcon}>{icon}</span>
              <h3 className={styles.featureTitle}>{title}</h3>
              <p className={styles.featureDesc}>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* === CTA FINAL === */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBox}>
          <h2 className={styles.ctaTitle}>¿Listo para explorar?</h2>
          <p className={styles.ctaText}>
            Más de 194 productos cargados en tiempo real desde DummyJSON API
          </p>
          <Link to="/products" className={styles.ctaPrimary}>
            Explorar catálogo completo →
          </Link>
        </div>
      </section>

    </main>
  );
}

export default Home;
