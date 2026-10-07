// Componente Footer: información de la facultad y derechos reservados

import styles from './Footer.module.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* Columna 1: Brand */}
        <div className={styles.col}>
          <span className={styles.footerBrand}>◈ TechStore PRO</span>
          <p className={styles.footerDesc}>
            Plataforma moderna de exploración de productos tech construida con
            React + Vite + Axios.
          </p>
        </div>

        {/* Columna 2: Institución */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Institución</h4>
          <ul className={styles.colList}>
            <li>Universidad Nacional del Centro del Perú</li>
            <li>Facultad de Ingeniería de Sistemas</li>
            <li>Programa de Ingeniería de Sistemas</li>
            <li>Desarrollo de Aplicaciones Web — IS093A</li>
          </ul>
        </div>

        {/* Columna 3: Autor */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Autor</h4>
          <ul className={styles.colList}>
            <li className={styles.authorName}>Jhojan Antezana</li>
            <li>9no Ciclo · 2026</li>
            <li>Semana 06 — SPA con React</li>
          </ul>
        </div>
      </div>

      {/* Barra inferior */}
      <div className={styles.bottom}>
        <span>
          © {year} Jhojan Antezana · Ing. de Sistemas UNCP. Todos los derechos reservados.
        </span>
        <span className={styles.techStack}>
          React · Vite · Axios · React Router
        </span>
      </div>
    </footer>
  );
}

export default Footer;
