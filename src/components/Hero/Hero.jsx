import React, { useState, useEffect } from "react";
import { Instagram, Facebook } from "lucide-react";
import styles from "./Hero.module.css";

function Hero() {
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => {
    setOffsetY(window.pageYOffset);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculamos la escala: empieza en 1 y aumenta un poco según el scroll
  // El 0.0005 es la velocidad del zoom, puedes ajustarlo
  const scale = 1 + offsetY * 0.0005;

  return (
    <section className={styles.hero}>
      {/* Capa de fondo separada para aplicar el zoom sin mover el texto */}
      <div
        className={styles.heroBackground}
        style={{ transform: `scale(${scale})` }}
      />

      <div className={styles.content}>
        <h1 className={styles.title}>Encuentra el auto que define tu estilo</h1>
        <p className={styles.subtitle}>
          Más de 100 unidades en stock con garantía certificada y financiación
          inmediata.
        </p>
        <a href="#catalogo" className={styles.ctaButton}>
          Ver catálogo
        </a>
      </div>
      <div className={styles.socials}>
        <a
          href="https://www.instagram.com/norte_automotores.sc/"
          target="_blank"
          className={styles.socialIcon}
          rel="noreferrer"
        >
          <Instagram size={20} />
        </a>
        <a
          href="https://www.facebook.com/profile.php?id=100031402316693"
          target="_blank"
          className={styles.socialIcon}
          rel="noreferrer"
        >
          <Facebook size={20} />
        </a>
      </div>
    </section>
  );
}

export default Hero;
