import React, { useEffect, useRef } from "react";
import styles from "./GoogleReviews.module.css";
import { Star } from "lucide-react";

const resenas = [
  {
    id: 1,
    nombre: "Walter Pistarini",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjX9GEUH014U1AtVzVFxZkBgIQYI18xZwYbgRWs0loG9IUzG5y4=w144-h144-p-rp-mo-ba3-br100", 
    texto: "Atención y unidades excelentes!!! Me recorrí 400 km para comprar una chata, la verdad q valió la pena, los recomiendo!",
    estrellas: 5,
    hace: "Hace 2 meses",
  },
  {
    id: 2,
    nombre: "Juan Cruz Ronchi",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjVCUajLywa4J895nFYCR_VtwIfjkwwwXTvw79J6768P1KlUSkdR=w72-h72-p-rp-mo-br100",
    texto: "Excelente atención. No recuerdo cuantos autos le compre. Pero son más de 6.",
    estrellas: 5,
    hace: "Hace 1 mes",
  },
  {
    id: 3,
    nombre: "Natalí Baez",
    foto: "https://lh3.googleusercontent.com/a-/ALV-UjWGEc4mPLwVWjOQieilhq0zUalEVUdx2HNi0mcVV_9txNwfggyQSA=w144-h144-p-rp-mo-br100",
    texto: "Muy buena atención!!!",
    estrellas: 5,
    hace: "Hace 3 semanas",
  },
  {
    id: 4,
    nombre: "Roberto Aicardi",
    foto: "https://lh3.googleusercontent.com/a/ACg8ocISS-4FF-T-I6ejjDSuMe8yoEBdJVAlcgE8T2KRJahMmFDZVA=w144-h144-p-rp-mo-br100",
    texto: "Excelente y amable atención",
    estrellas: 5,
    hace: "Hace 4 meses",
  },
  {
    id: 5,
    nombre: "Sebastián Godoy Fernandez",
    foto: "https://lh3.googleusercontent.com/a/ACg8ocKkdVm35epRLh1u6O2vAM-j91iY33TfBQeQx4lFmiNxgafSrkPy=w144-h144-p-rp-mo-ba3-br100",
    texto: "Bien, buen servicio, muy serio.",
    estrellas: 5,
    hace: "Hace 5 meses",
  },
  {
    id: 6,
    nombre: "Miguel González",
    foto: "https://lh3.googleusercontent.com/a/ACg8ocIEHjq9Z0tmPZ1RgUVUWAPc5RYYQaStbA_CRMoukWnybeKWcg=w144-h144-p-rp-mo-ba3-br100",
    texto: "Muy serio y coherente. Confiable! Excelente atención",
    estrellas: 5,
    hace: "Hace 2 semanas",
  },
];

const GoogleReviews = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const contenedor = scrollRef.current;
    let interval;

    const startAutoScroll = () => {
      interval = setInterval(() => {
        if (contenedor) {
          const { scrollLeft, scrollWidth, clientWidth } = contenedor;
          // Si llega al final (con margen de 10px), vuelve al inicio
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            contenedor.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            // Desplaza el ancho de una card aproximadamente
            contenedor.scrollBy({ left: 340, behavior: "smooth" });
          }
        }
      }, 2000);
    };

    startAutoScroll();

    // Pausar al pasar el mouse
    const handleMouseEnter = () => clearInterval(interval);
    const handleMouseLeave = () => startAutoScroll();

    if (contenedor) {
      contenedor.addEventListener("mouseenter", handleMouseEnter);
      contenedor.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      clearInterval(interval);
      if (contenedor) {
        contenedor.removeEventListener("mouseenter", handleMouseEnter);
        contenedor.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <section className={styles.reviewsSection} id="resenas">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.googleBadge}>
            <img
              width="40"
              height="40"
              src="https://img.icons8.com/color/48/google-logo.png"
              alt="google-logo"
            />
            <span>Opiniones en Google</span>
          </div>
          <h2>Lo que dicen nuestros clientes</h2>
          <div className={styles.ratingGeneral}>
            <span className={styles.score}>4.9</span>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#ffb400" color="#ffb400" />
              ))}
            </div>
            <span className={styles.totalReviews}>(150+ reseñas)</span>
          </div>
        </div>

        {/* --- CONEXIÓN DE LA REF AQUÍ --- */}
        <div className={styles.carousel} ref={scrollRef}>
          {resenas.map((resena) => (
            <div key={resena.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <img
                  src={resena.foto}
                  alt={resena.nombre}
                  className={styles.userPhoto}
                />
                <div className={styles.userInfo}>
                  <p className={styles.userName}>{resena.nombre}</p>
                  <p className={styles.date}>{resena.hace}</p>
                </div>
                <img
                  width="20"
                  height="20"
                  src="https://img.icons8.com/color/48/google-logo.png"
                  alt="google-logo"
                />
              </div>
              <div className={styles.starsRow}>
                {[...Array(resena.estrellas)].map((_, i) => (
                  <Star key={i} size={14} fill="#ffb400" color="#ffb400" />
                ))}
              </div>
              <p className={styles.text}>"{resena.texto}"</p>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <a
            href="https://www.google.com/maps" 
            target="_blank"
            rel="noopener noreferrer"
            className={styles.googleLink}
          >
            Ver todas las opiniones en Google Maps
          </a>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;







