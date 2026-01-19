import React, { useState, useEffect } from "react";
import styles from "./Catalog.module.css";
import CarModal from "../CarModal/CarModal.jsx";
import CreditSimulator from "../CreditSimulator/CreditSimulator.jsx";
import { Search, ChevronDown, Sparkles, Percent, Gem, Car, Truck, Bike, LayoutGrid } from "lucide-react";

function Catalog({ autoUrl }) {
  const [autos, setAutos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("recientes");
  const [tipoFiltro, setTipoFiltro] = useState("Todos"); // <-- NUEVO ESTADO
  const [selectedAuto, setSelectedAuto] = useState(null);
  const [autoParaSimular, setAutoParaSimular] = useState(null);

  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5001/api/autos"
      : "https://norte-production.up.railway.app/api/autos";

  const generarSlug = (nombre) => {
    return nombre
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  useEffect(() => {
    const obtenerAutos = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const listaAutos = Array.isArray(data) ? data : [];
        setAutos(listaAutos);

        if (autoUrl) {
          const encontrado = listaAutos.find(
            (auto) => generarSlug(auto.nombre) === autoUrl
          );
          if (encontrado) {
            setSelectedAuto(encontrado);
          }
        }
      } catch (err) {
        console.error("Error al cargar autos:", err);
      }
    };
    obtenerAutos();
  }, [API_URL, autoUrl]);

  const handleOpenModal = (auto) => {
    setSelectedAuto(auto);
    const slug = generarSlug(auto.nombre);
    window.history.pushState(null, "", `/auto/${slug}`);
  };

  const handleCloseModal = () => {
    setSelectedAuto(null);
    window.history.pushState(null, "", "/");
  };

  // --- LÓGICA DE FILTRADO (Búsqueda + Tipo) Y ORDENAMIENTO ---
  const autosProcesados = autos
    .filter((auto) => {
      const coincideBusqueda = auto.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideTipo = tipoFiltro === "Todos" || auto.tipo === tipoFiltro;
      return coincideBusqueda && coincideTipo;
    })
    .sort((a, b) => {
      const precioA = Number(a.precio) || 0;
      const precioB = Number(b.precio) || 0;
      const anioA = Number(a.anio) || 0;
      const anioB = Number(b.anio) || 0;

      if (orden === "menor-precio") return precioA - precioB;
      if (orden === "mayor-precio") return precioB - precioA;
      if (orden === "anio-nuevo") return anioB - anioA;
      if (orden === "anio-viejo") return anioA - anioB;
      return b.id - a.id;
    });

  const renderEtiqueta = (auto) => {
    if (auto.reservado)
      return <div className={styles.badgeReservado}>RESERVADO</div>;

    switch (auto.etiqueta) {
      case "tasa_cero":
        return (
          <div className={`${styles.promoBadge} ${styles.badgeTasa}`}>
            <Percent size={12} /> TASA 0%
          </div>
        );
      case "bonificado":
        return (
          <div className={`${styles.promoBadge} ${styles.badgeBonificado}`}>
            <Gem size={12} /> BONIFICADO
          </div>
        );
      case "oportunidad":
        return (
          <div className={`${styles.promoBadge} ${styles.badgeOportunidad}`}>
            <Sparkles size={12} /> OPORTUNIDAD
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.catalogSection}>
      <div className={styles.container}>
        {/* BARRA SUPERIOR: BUSQUEDA Y ORDEN */}
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
                <option value="anio-nuevo">Año (Más nuevo)</option>
                <option value="anio-viejo">Año (Más antiguo)</option>
              </select>
              <ChevronDown size={16} className={styles.arrowIcon} />
            </div>
          </div>
        </div>

        {/* --- NUEVO: SELECTOR DE CATEGORÍAS (TIPO) --- */}
        <div className={styles.filterTabs}>
          <button 
            className={tipoFiltro === "Todos" ? styles.activeTab : ""} 
            onClick={() => setTipoFiltro("Todos")}
          >
            <LayoutGrid size={18} /> Todos
          </button>
          <button 
            className={tipoFiltro === "Automóvil" ? styles.activeTab : ""} 
            onClick={() => setTipoFiltro("Automóvil")}
          >
            <Car size={18} /> Autos
          </button>
          <button 
            className={tipoFiltro === "Camioneta" ? styles.activeTab : ""} 
            onClick={() => setTipoFiltro("Camioneta")}
          >
            <Truck size={18} /> Camionetas
          </button>
          <button 
            className={tipoFiltro === "Motocicleta" ? styles.activeTab : ""} 
            onClick={() => setTipoFiltro("Motocicleta")}
          >
            <Bike size={18} /> Motos
          </button>
        </div>

        {/* GRILLA DE AUTOS */}
        <div className={styles.grid}>
          {autosProcesados.length > 0 ? (
            autosProcesados.map((auto) => (
              <div
                key={auto.id}
                className={styles.card}
                onClick={() => handleOpenModal(auto)}
              >
                <div className={styles.imageWrapper}>
                  <img
                    src={auto.imagenes && auto.imagenes[0]}
                    alt={auto.nombre}
                  />
                  {renderEtiqueta(auto)}
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
            ))
          ) : (
            <div className={styles.noResults}>
              <p>No se encontraron vehículos en esta categoría.</p>
            </div>
          )}
        </div>
      </div>

      {selectedAuto && (
        <CarModal
          auto={selectedAuto}
          onClose={handleCloseModal}
          onSimulate={(auto) => setAutoParaSimular(auto)}
        />
      )}
      <CreditSimulator autos={autos} autoPreseleccionado={autoParaSimular} />
    </div>
  );
}

export default Catalog;