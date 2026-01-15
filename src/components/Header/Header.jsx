import React, { useState } from "react";
import styles from "./Header.module.css";
import { Menu, X } from "lucide-react"; // Quitamos 'Car' porque usaremos tu imagen

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        {/* Reemplazamos el icono por tu imagen de la carpeta public */}
        <img
          src="/Norte logo.png"
          alt="Norte Automotores Logo"
          className={styles.logoImg}
        />
      </div>

      <button className={styles.menuButton} onClick={toggleMenu}>
        {isOpen ? <X size={30} /> : <Menu size={30} />}
      </button>

      <nav className={`${styles.nav} ${isOpen ? styles.navOpen : ""}`}>
        <a href="#catalogo" onClick={() => setIsOpen(false)}>
          Catálogo
        </a>
        <a href="#contacto" onClick={() => setIsOpen(false)}>
          Contacto
        </a>
      </nav>
    </header>
  );
}

export default Header;
