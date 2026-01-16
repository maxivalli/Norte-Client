import React, { useState } from "react";
import styles from "./CarModal.module.css";
import {
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Settings,
  Calendar,
  Fuel,
  Activity,
  Share2,
} from "lucide-react";

function CarModal({ auto, onClose }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [copiado, setCopiado] = useState(false);

  if (!auto) return null;

  const fotos = auto.imagenes || [];

  // Función para formatear el link usando la ruta de "share"
  c// Función para formatear el link directo
  const generarLinkCompartir = (nombre) => {
    const slug = nombre
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Ahora el link es el directo, el servidor se encargará del resto
    return `https://norteautomotores.up.railway.app/auto/${slug}`;
  };

  const handleCompartir = () => {
    const url = generarLinkCompartir(auto.nombre);
    const texto = `Mira este ${auto.nombre} en Norte Automotores: `;

    if (navigator.share) {
      navigator
        .share({
          title: auto.nombre,
          text: texto,
          url: url,
        })
        .catch(console.error);
    } else {
      // En PC, copiamos el link al portapapeles
      navigator.clipboard.writeText(`${texto} ${url}`);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.imageSide}>
          <div
            className={styles.mainImageContainer}
            onClick={() => setIsZoomed(true)}
          >
            <img
              src={fotos[currentImgIndex]}
              alt={auto.nombre}
              className={styles.mainImage}
            />
            {auto.reservado && (
              <div className={styles.badgeReservadoModal}>RESERVADO</div>
            )}
            <div className={styles.zoomIcon}>
              <Maximize2 size={18} color="white" />
            </div>
          </div>

          {fotos.length > 1 && (
            <div className={styles.thumbnailGrid}>
              {fotos.map((img, index) => (
                <div
                  key={index}
                  className={`${styles.thumbnail} ${
                    index === currentImgIndex ? styles.activeThumb : ""
                  }`}
                  onClick={() => setCurrentImgIndex(index)}
                >
                  <img src={img} alt={`Vista ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.contentSide}>
          <div className={styles.headerInfo}>
            <h2 className={styles.title}>{auto.nombre}</h2>
            <p className={styles.price}>
              {Number(auto.precio) === 0
                ? "Consultar"
                : `${auto.moneda} ${Number(auto.precio).toLocaleString(
                    "es-AR"
                  )}`}
            </p>
          </div>

          <div className={styles.specsGrid}>
            <div className={styles.specItem}>
              <Settings size={18} />
              <span>
                <strong>Motor:</strong> {auto.motor || "Consultar"}
              </span>
            </div>
            <div className={styles.specItem}>
              <Activity size={18} />
              <span>
                <strong>Transmisión:</strong> {auto.transmision || "Manual"}
              </span>
            </div>
            <div className={styles.specItem}>
              <Calendar size={18} />
              <span>
                <strong>Año:</strong> {auto.anio || "N/A"}
              </span>
            </div>
            <div className={styles.specItem}>
              <Gauge size={18} />
              <span>
                <strong>KM:</strong>{" "}
                {auto.kilometraje
                  ? Number(auto.kilometraje).toLocaleString("es-AR")
                  : "0"}{" "}
                km
              </span>
            </div>
            <div className={styles.specItem}>
              <Fuel size={18} />
              <span>
                <strong>Combustible:</strong> {auto.combustible || "Nafta"}
              </span>
            </div>
          </div>

          <div className={styles.descriptionSection}>
            <h4>Descripción:</h4>
            <p className={styles.descriptionText}>
              {auto.description ||
                auto.descripcion ||
                "Sin descripción disponible."}
            </p>
          </div>

          <button onClick={handleCompartir} className={styles.shareBtn}>
            <Share2 size={18} />
            {copiado ? "¡Enlace Copiado!" : "Compartir Vehículo"}
          </button>

          <button
            onClick={() =>
              !auto.reservado &&
              window.open(
                `https://wa.me/5493408671423?text=Hola! Estoy interesado en el ${auto.nombre}`,
                "_blank"
              )
            }
            className={styles.submitBtn}
            style={{
              backgroundColor: auto.reservado ? "#777" : "#25D366",
              cursor: auto.reservado ? "not-allowed" : "pointer",
            }}
            disabled={auto.reservado}
          >
            {auto.reservado ? "UNIDAD RESERVADA" : "Consultar por WhatsApp"}
          </button>
        </div>
      </div>

      {isZoomed && (
        <div
          className={styles.fullScreenOverlay}
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(false);
          }}
        >
          <button
            className={styles.closeZoom}
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
            }}
          >
            <X size={32} color="white" />
          </button>

          {fotos.length > 1 && (
            <>
              <button
                className={styles.navBtnLeft}
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage(e);
                }}
              >
                <ChevronLeft size={48} color="white" />
              </button>
              <button
                className={styles.navBtnRight}
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage(e);
                }}
              >
                <ChevronRight size={48} color="white" />
              </button>
            </>
          )}

          <img
            src={fotos[currentImgIndex]}
            alt="Zoom"
            className={styles.fullScreenImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default CarModal;