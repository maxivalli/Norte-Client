import React from 'react'
import styles from './Footer.module.css';
import { Car, Instagram, Facebook, Twitter, Home } from 'lucide-react';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Columna 1: Marca */}
        <div className={styles.brand}>
          <h2 className={styles.logo}>
            Norte Automotores
          </h2>
          <p>
            Líderes en la venta de vehículos seleccionados. 
            Calidad, confianza y transparencia en cada operación.
          </p>
          <div className={styles.socials}>
            <a href="https://www.instagram.com/norte_automotores.sc/" target="_blank" className={styles.socialIcon}><Instagram size={20} /></a>
            <a href="https://www.facebook.com/profile.php?id=100031402316693" target="_blank" className={styles.socialIcon}><Facebook size={20} /></a>
            <a href="#" className={styles.socialIcon}><Home size={20} /></a>
          </div>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div className={styles.links}>
          <h3>Navegación</h3>
          <ul>
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#catalogo">Inventario</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>

        {/* Columna 3: Legal/Ayuda */}
        <div className={styles.links}>
          <h3>Soporte</h3>
          <ul>
            <li><a href="/admin">Admin Section</a></li>
            <li><a href="#">Términos y Condiciones</a></li>
            <li><a href="#">Política de Privacidad</a></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} Norte Automotores. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;