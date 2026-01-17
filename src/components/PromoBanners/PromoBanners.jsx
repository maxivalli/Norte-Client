import React, { useEffect, useState } from 'react';
import styles from './PromoBanners.module.css';

function PromoBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cambia la URL por tu dominio de Railway cuando lo subas
    fetch('https://norte-production.up.railway.app/api/banners/activos')
      .then(res => res.json())
      .then(data => {
        setBanners(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando banners:", err);
        setLoading(false);
      });
  }, []);

  if (loading || banners.length === 0) return null;

  return (
    <section className={styles.promoSection}>
      
      <div className={styles.container}>
        {banners.map((banner, index) => (
          <div 
            key={banner.id} 
            className={styles.promoCard} 
            style={{ opacity: 1, transform: 'translateY(0)' }} // Puedes re-activar la animación de IntersectionObserver aquí
          >
            <img src={banner.imagen_url} alt={banner.titulo || "Promoción"} className={styles.bgImage} />
          </div>
        ))}
      </div>
      <p className={styles.swipeHint}> {"< Desliza para ver conocer más >"}</p>
    </section>
  );
}

export default PromoBanners;