// Página NotFound (404): se muestra cuando ninguna ruta coincide

import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './NotFound.module.css';

function NotFound() {
  const navigate   = useNavigate();
  const [count, setCount] = useState(8);

  // Cuenta regresiva → redirige a Home automáticamente
  useEffect(() => {
    if (count <= 0) {
      navigate('/');
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, navigate]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>

        {/* Número 404 decorativo */}
        <div className={styles.errorCode}>
          <span className={styles.four}>4</span>
          <span className={styles.zero}>0</span>
          <span className={styles.four}>4</span>
        </div>

        <div className={styles.glitch} aria-hidden="true">404</div>

        <h1 className={styles.title}>Página no encontrada</h1>
        <p className={styles.subtitle}>
          La ruta que buscas no existe o fue movida a otra URL.
        </p>

        {/* Renderizado condicional con ternario: countdown */}
        <p className={styles.countdown}>
          {count > 0
            ? `Redirigiendo a Inicio en ${count}s...`
            : 'Redirigiendo...'}
        </p>

        <div className={styles.actions}>
          <Link to="/" className={styles.btnHome}>
            ← Volver al inicio
          </Link>
          <Link to="/products" className={styles.btnProducts}>
            Ver productos
          </Link>
        </div>

      </div>
    </main>
  );
}

export default NotFound;
