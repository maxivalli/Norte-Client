import React, { useEffect, useState, useRef } from 'react';
import styles from './PromoBanners.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Importamos flechas

function PromoBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    fetch('https://norte-api.up.railway.app/api/banners/activos')
      .then(res => res.json())
      .then(data => {
        const bannersAleatorios = data.sort(() => Math.random() - 0.5);
        setBanners(bannersAleatorios);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando banners:", err);
        setLoading(false);
      });
  }, []);

  // --- FUNCIONES DE NAVEGACIÓN ---
  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = 340; // Ajusta según el ancho de tu card + gap
      if (direction === 'left') {
        containerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (loading || banners.length === 0) return null;

  return (
    <section className={styles.promoSection}>
      <div className={styles.wrapper}>
        
        {/* Flecha Izquierda */}
        <button 
          className={`${styles.navButton} ${styles.left}`} 
          onClick={() => scroll('left')}
          aria-label="Anterior"
        >
          <ChevronLeft size={32} />
        </button>

        <div className={styles.container} ref={containerRef}>
          {banners.map((banner) => (
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

        {/* Flecha Derecha */}
        <button 
          className={`${styles.navButton} ${styles.right}`} 
          onClick={() => scroll('right')}
          aria-label="Siguiente"
        >
          <ChevronRight size={32} />
        </button>

      </div>
    </section>
  );
}

export default PromoBanners;