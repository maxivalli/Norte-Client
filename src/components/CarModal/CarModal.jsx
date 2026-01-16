import React, { useState, useEffect } from "react";
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
  Eye,
  Palette,
  ChevronDown, // Importamos para el icono del desplegable
} from "lucide-react";

function CarModal({ auto, onClose }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [visitasLocales, setVisitasLocales] = useState(auto?.visitas || 0);

  useEffect(() => {
    if (auto && auto.id) {
      const backendUrl = "https://norte-production.up.railway.app";
      fetch(`${backendUrl}/api/autos/${auto.id}/visita`, {
        method: "PATCH",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.visitas) setVisitasLocales(data.visitas);
        })
        .catch((err) => console.error("Error al contar visita:", err));
    }
  }, [auto]);

  if (!auto) return null;

  const fotos = auto.imagenes || [];

  const generarLinkCompartir = (nombre) => {
    const slug = nombre
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return `https://norte-production.up.railway.app/share/auto/${slug}`;
  };

  const handleCompartir = () => {
    const url = generarLinkCompartir(auto.nombre);
    const texto = `Mira este ${auto.nombre} en Norte Automotores `;
    if (navigator.share) {
      navigator
        .share({ title: auto.nombre, text: texto, url })
        .catch(console.error);
    } else {
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

  const handleCloseZoom = (e) => {
    e.stopPropagation();
    setIsZoomed(false);
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
                : `${auto.moneda} ${Math.round(
                    Number(auto.precio)
                  ).toLocaleString("es-AR")}`}
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
                {Math.round(Number(auto.kilometraje || 0)).toLocaleString(
                  "es-AR"
                )}{" "}
                km
              </span>
            </div>
            <div className={styles.specItem}>
              <Fuel size={18} />
              <span>
                <strong>Combustible:</strong> {auto.combustible || "Nafta"}
              </span>
            </div>
            <div className={styles.specItem}>
              <Palette size={18} />
              <span>
                <strong>Color:</strong> {auto.color || "Consultar"}
              </span>
            </div>
            <div className={styles.specItem}>
              <Eye size={18} />
              <span>
                <strong>Visitas:</strong> {visitasLocales}
              </span>
            </div>
          </div>

          {/* SECCIÓN DESPLEGABLE CON DETAILS Y SUMMARY */}
          <details className={styles.detailsSection}>
            <summary className={styles.summaryTitle}>
              Equipamiento y descripción
              <ChevronDown size={18} className={styles.arrowIcon} />
            </summary>
            <div className={styles.detailsContent}>
              <p
                className={styles.descriptionText}
                style={{ whiteSpace: "pre-line" }}
              >
                {auto.descripcion ||
                  auto.description ||
                  "Sin descripción disponible."}
              </p>
            </div>
          </details>

          <button onClick={handleCompartir} className={styles.shareBtn}>
            <Share2 size={18} />
            {copiado ? "¡Enlace Copiado!" : "Compartir Vehículo"}
          </button>

          <button
            onClick={() =>
              !auto.reservado &&
              window.open(
                `https://wa.me/5493408671423?text=Hola! Estoy interesado en el ${auto.nombre}, modelo ${auto.anio}.`,
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
        <div className={styles.fullScreenOverlay} onClick={handleCloseZoom}>
          <button className={styles.closeZoom} onClick={handleCloseZoom}>
            <X size={32} color="white" />
          </button>
          {fotos.length > 1 && (
            <>
              <button className={styles.navBtnLeft} onClick={prevImage}>
                <ChevronLeft size={48} color="white" />
              </button>
              <button className={styles.navBtnRight} onClick={nextImage}>
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
