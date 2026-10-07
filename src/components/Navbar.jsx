// Componente Navbar: navegación principal con NavLink activo
// NavLink aplica clase "active" automáticamente → feedback visual sin JS extra

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { to: '/',         label: 'Inicio',    icon: '⚡' },
  { to: '/products', label: 'Productos', icon: '🛒' },
  { to: '/form',     label: 'Contacto',  icon: '✉️'  },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu  = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* Logo / Brand */}
        <NavLink to="/" className={styles.brand} onClick={closeMenu}>
          <span className={styles.brandIcon}>◈</span>
          <span className={styles.brandName}>TechStore</span>
          <span className={styles.brandBadge}>PRO</span>
        </NavLink>

        {/* Links escritorio */}
        <ul className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}>
          {NAV_LINKS.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
                onClick={closeMenu}
              >
                <span className={styles.navIcon}>{icon}</span>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Botón hamburguesa (mobile) */}
        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`} />
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
