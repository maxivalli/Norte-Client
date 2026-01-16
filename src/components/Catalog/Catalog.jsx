import React, { useState, useEffect } from "react";
import styles from "./Catalog.module.css";
import CarModal from "../CarModal/CarModal.jsx";
import { Search, ChevronDown } from "lucide-react";

function Catalog() {
  const [autos, setAutos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("recientes");
  const [selectedAuto, setSelectedAuto] = useState(null);

  // URL dinámica: detecta si estás en Local o Railway automáticamente
  const API_URL = window.location.hostname === "localhost" 
    ? "http://localhost:5001/api/autos" 
    : "https://norte-production.up.railway.app/api/autos";

  useEffect(() => {
    const obtenerAutos = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setAutos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar autos:", err);
      }
    };
    obtenerAutos();
  }, [API_URL]);

  // Procesamiento simple: Filtro y Orden directo por el valor numérico
  const autosProcesados = autos
    .filter((auto) =>
      auto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )
    .sort((a, b) => {
      const precioA = Number(a.precio) || 0;
      const precioB = Number(b.precio) || 0;

      if (orden === "menor-precio") return precioA - precioB;
      if (orden === "mayor-precio") return precioB - precioA;
      return b.id - a.id; // Recientes
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
              onClick={() => setSelectedAuto(auto)}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={auto.imagenes && auto.imagenes[0]}
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
                    : `${auto.moneda} ${Number(auto.precio).toLocaleString("es-AR")}`}
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
        <CarModal auto={selectedAuto} onClose={() => setSelectedAuto(null)} />
      )}
    </div>
  );
}

export default Catalog;