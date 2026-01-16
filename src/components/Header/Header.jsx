import React, { useState } from "react";
import styles from "./Header.module.css";
import { Menu, X } from "lucide-react";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
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
        {/* Nuevo enlace al simulador */}

        <a href="#contacto" onClick={() => setIsOpen(false)}>
          Contacto
        </a>
        <a href="#simulador" onClick={() => setIsOpen(false)}>
          Simulador
        </a>
      </nav>
    </header>
  );
}

export default Header;
