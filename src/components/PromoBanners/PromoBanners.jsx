import React, { useEffect, useState, useRef } from 'react';
import styles from './PromoBanners.module.css';

function PromoBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
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

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Ajustamos el desplazamiento para que coincida con el ancho de tus cards + gap
          containerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [banners]);

  if (loading || banners.length === 0) return null;

  return (
    <section className={styles.promoSection}>
      <div className={styles.container} ref={containerRef}>
        {banners.map((banner) => (
          /* Envolvemos la imagen con el enlace */
          <div key={banner.id} className={styles.promoCard}>
            <a href="#catalogo" className={styles.cardLink}>
              <img 
                src={banner.imagen_url} 
                alt={banner.titulo || "Promoción"} 
                className={styles.bgImage} 
              />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PromoBanners;