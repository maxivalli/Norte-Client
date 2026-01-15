import React from "react";
import { Car, Instagram, Facebook, Twitter, Home } from "lucide-react";
import styles from "./Hero.module.css";

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>Encuentra el auto que define tu estilo</h1>
        <p className={styles.subtitle}>
          Más de 100 unidades en stock con garantía certificada y financiación
          inmediata.
        </p>
        <a href="#catalogo" className={styles.ctaButton}>
          Ver catálogo
        </a>
        <div className={styles.socials}>
          <a
            href="https://www.instagram.com/norte_automotores.sc/"
            target="_blank"
            className={styles.socialIcon}
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=100031402316693"
            target="_blank"
            className={styles.socialIcon}
          >
            <Facebook size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
