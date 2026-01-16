import React, { useState, useEffect } from "react";
// PASO 2.1: Importamos las herramientas de navegación
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Catalog.module.css";
import CarModal from "../CarModal/CarModal.jsx";
import { Search, ChevronDown } from "lucide-react";

function Catalog() {
  // PASO 2.2: Capturamos el ID de la URL y preparamos el "navegador"
  const { id } = useParams();
  const navigate = useNavigate();

  const [autos, setAutos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("recientes");
  const [selectedAuto, setSelectedAuto] = useState(null);

  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5001/api/autos"
      : "https://norte-production.up.railway.app/api/autos";

  const crearSlug = (nombre) => {
    return nombre
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Quita caracteres especiales
      .replace(/[\s_-]+/g, "-") // Cambia espacios por guiones
      .replace(/^-+|-+$/g, ""); // Limpia guiones al inicio o final
  };

  const optimizarImagen = (url) => {
    if (!url) return "";
    // Si la URL es de Cloudinary, insertamos los parámetros de optimización
    if (url.includes("cloudinary.com")) {
      // Reemplaza '/upload/' por '/upload/f_auto,q_auto/'
      // f_auto: elige el formato más liviano (webp, avif, etc)
      // q_auto: elige la mejor compresión sin perder calidad visual
      return url.replace("/upload/", "/upload/f_auto,q_auto/");
    }
    return url;
  };

  useEffect(() => {
    const obtenerAutos = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const listaAutos = Array.isArray(data) ? data : [];
        setAutos(listaAutos);
        if (id) {
          const autoEncontrado = listaAutos.find(
            (a) => crearSlug(a.nombre) === id
          );
          if (autoEncontrado) {
            setSelectedAuto(autoEncontrado);
          }
        }
        // PASO 2.3: Si entramos por un link de auto (ej: /auto/5), lo buscamos y abrimos
        if (id) {
          const autoEncontrado = listaAutos.find(
            (a) => String(a.id) === String(id)
          );
          if (autoEncontrado) {
            setSelectedAuto(autoEncontrado);
          }
        }
      } catch (err) {
        console.error("Error al cargar autos:", err);
      }
    };
    obtenerAutos();
  }, [API_URL, id]); // Se ejecuta si cambia la URL o la API

  // PASO 2.4: Nueva función para cerrar el modal y limpiar la URL
  const manejarCerrarModal = () => {
    setSelectedAuto(null);
    navigate("/"); // Esto quita el "/auto/5" de la barra de direcciones al cerrar
  };

  const autosProcesados = autos
    .filter((auto) =>
      auto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )
    .sort((a, b) => {
      const precioA = Number(a.precio) || 0;
      const precioB = Number(b.precio) || 0;
      if (orden === "menor-precio") return precioA - precioB;
      if (orden === "mayor-precio") return precioB - precioA;
      return b.id - a.id;
    });

  return (
    <div className={styles.catalogSection}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.searchBox}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar marca o modelo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className={styles.sortContainer}>
            <label htmlFor="orden">Ordenar por:</label>
            <div className={styles.selectWrapper}>
              <select
                id="orden"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                className={styles.selectSort}
              >
                <option value="recientes">Más recientes</option>
                <option value="menor-precio">Menor precio</option>
                <option value="mayor-precio">Mayor precio</option>
              </select>
              <ChevronDown size={16} className={styles.arrowIcon} />
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          {autosProcesados.map((auto) => (
            <div
              key={auto.id}
              className={styles.card}
              onClick={() => {
                setSelectedAuto(auto);
                navigate(`/auto/${crearSlug(auto.nombre)}`); // Ahora usamos el nombre!
              }}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={optimizarImagen(auto.imagenes && auto.imagenes[0])}
                  alt={auto.nombre}
                />
                {auto.reservado && (
                  <div className={styles.badgeReservado}>RESERVADO</div>
                )}
              </div>
              <div className={styles.info}>
                <h3 className={styles.carName}>{auto.nombre}</h3>
                <p className={styles.price}>
                  {Number(auto.precio) === 0
                    ? "Consultar"
                    : `${auto.moneda} ${Number(auto.precio).toLocaleString(
                        "es-AR"
                      )}`}
                </p>
                <div className={styles.detailsRow}>
                  <span>{auto.anio}</span>
                  <span>
                    {Number(auto.kilometraje).toLocaleString("es-AR")} km
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedAuto && (
        <CarModal auto={selectedAuto} onClose={manejarCerrarModal} />
      )}
    </div>
  );
}

export default Catalog;
