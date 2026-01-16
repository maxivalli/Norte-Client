import React, { useEffect } from "react";
import styles from "./GoogleReviews.module.css";

const GoogleReviews = () => {
  useEffect(() => {
    // Creamos la etiqueta script dinámicamente
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js"; // O el link que te dé tu proveedor
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Limpieza al desmontar el componente
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className={styles.reviewsContainer} id="resenas">
      <div className={styles.header}>
        <h2>Lo que dicen nuestros clientes</h2>
        <p>Transparencia y confianza en cada operación</p>
      </div>
      
      <div class="elfsight-app-988bb118-5d31-48e3-8065-c83abcbe708d" data-elfsight-app-lazy></div>
      <div 
        className="elfsight-app-TU_CODIGO_UNICO_AQUI" 
        data-elfsight-app-lazy
      ></div>
    </section>
  );
};

export default GoogleReviews;