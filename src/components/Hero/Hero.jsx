import React from 'react'
import styles from './Hero.module.css';

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>Encuentra el auto que define tu estilo</h1>
        <p className={styles.subtitle}>
          Más de 100 unidades en stock con garantía certificada y financiación inmediata.
        </p>
        <a href="#catalogo" className={styles.ctaButton}>
          Ver catálogo
        </a>
      </div>
    </section>
  );
}

export default Hero;