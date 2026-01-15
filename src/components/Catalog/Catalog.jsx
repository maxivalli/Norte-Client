import React, { useState, useEffect } from 'react';
import styles from './Catalog.module.css';
import CarModal from '../CarModal/CarModal.jsx';
import { Search, ChevronDown } from 'lucide-react';

function Catalog() {
  const [autos, setAutos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("recientes");
  const [selectedAuto, setSelectedAuto] = useState(null);

  const TASA_DOLAR = 1500; 

  useEffect(() => {
    const obtenerAutos = async () => {
      try {
        const res = await fetch('https://norte-production.up.railway.app/api/autos');
        const data = await res.json();
        setAutos(data);
      } catch (err) { console.error(err); }
    };
    obtenerAutos();
  }, []);

  const obtenerValorReal = (auto) => {
    const precio = Number(auto.precio) || 0;
    return auto.moneda === 'U$S' ? precio * TASA_DOLAR : precio;
  };

  const autosProcesados = autos
    .filter(auto => auto.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => {
      if (orden === "menor-precio") {
        return obtenerValorReal(a) - obtenerValorReal(b);
      } else if (orden === "mayor-precio") {
        return obtenerValorReal(b) - obtenerValorReal(a);
      } else {
        return b.id - a.id;
      }
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
          {autosProcesados.map(auto => (
            <div key={auto.id} className={styles.card} onClick={() => setSelectedAuto(auto)}>
              <div className={styles.imageWrapper}>
                <img src={auto.imagenes && auto.imagenes[0]} alt={auto.nombre} />
                {auto.reservado && <div className={styles.badgeReservado}>RESERVADO</div>}
              </div>
              <div className={styles.info}>
                <h3 className={styles.carName}>{auto.nombre}</h3>
                
                {/* CAMBIO AQUÍ: Lógica para precio 0 */}
                <p className={styles.price}>
                  {Number(auto.precio) === 0 
                    ? "Consultar" 
                    : `${auto.moneda} ${Number(auto.precio).toLocaleString('es-AR')}`
                  }
                </p>

                <div className={styles.detailsRow}>
                  <span>{auto.anio}</span>
                  <span>{auto.kilometraje?.toLocaleString()} km</span>
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