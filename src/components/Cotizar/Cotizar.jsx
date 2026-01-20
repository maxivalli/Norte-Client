import React, { useState, useEffect } from "react";
import { ChevronRight, Car, Loader2, RefreshCcw } from "lucide-react";
import style from "./Cotizar.module.css";

const CotizadorNorte = () => {
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [aniosDisponibles, setAniosDisponibles] = useState([]); // Ahora se cargan tras el modelo
  const [versionesFiltradas, setVersionesFiltradas] = useState([]); // Versiones que coinciden con el año
  
  const [seleccion, setSeleccion] = useState({ marca: "", modelo: "", anio: "", version: "", moneda: "$" });
  const [precioFinal, setPrecioFinal] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cambio de nombre: TIPO_CAMBIO -> MULTIPLICADOR
  const MULTIPLICADOR_USD = 1000; 
  const MULTIPLICADOR_GENERAL = 1000;
  const API_BASE = "https://norte-api.up.railway.app/api/guia/consulta";

  // Carga inicial de marcas
  useEffect(() => {
    fetch(API_BASE).then(res => res.json()).then(data => setMarcas(data));
  }, []);

  const handleReset = () => {
    setSeleccion({ marca: "", modelo: "", anio: "", version: "", moneda: "$" });
    setModelos([]);
    setAniosDisponibles([]);
    setVersionesFiltradas([]);
    setPrecioFinal(null);
  };

  const handleMarcaChange = async (e) => {
    const m = e.target.value;
    handleReset(); // Limpia todo
    setSeleccion(prev => ({ ...prev, marca: m }));
    if (m) {
      setLoading(true);
      const res = await fetch(`${API_BASE}?marca=${encodeURIComponent(m)}`);
      const data = await res.json();
      setModelos(data);
      setLoading(false);
    }
  };

  const handleModeloChange = async (e) => {
    const mod = e.target.value;
    setSeleccion(prev => ({ ...prev, modelo: mod, anio: "", version: "" }));
    setAniosDisponibles([]);
    setVersionesFiltradas([]);
    setPrecioFinal(null);

    if (mod) {
      setLoading(true);
      const res = await fetch(`${API_BASE}?marca=${encodeURIComponent(seleccion.marca)}&modelo=${encodeURIComponent(mod)}`);
      const todasLasVersiones = await res.json();
      
      // Extraemos todos los años únicos disponibles para este modelo
      const aniosSet = new Set();
      todasLasVersiones.forEach(v => {
        const precios = typeof v.precios_json === 'string' ? JSON.parse(v.precios_json) : v.precios_json;
        Object.keys(precios).forEach(a => aniosSet.add(a));
      });

      setAniosDisponibles(Array.from(aniosSet).sort((a, b) => b - a)); // Orden descendente
      // Guardamos temporalmente todas las versiones para filtrar después por año
      setSeleccion(prev => ({ ...prev, modelo: mod, _todasVersiones: todasLasVersiones }));
      setLoading(false);
    }
  };

  const handleAnioChange = (e) => {
    const anio = e.target.value;
    setSeleccion(prev => ({ ...prev, anio, version: "" }));
    setPrecioFinal(null);

    // Filtramos las versiones que tengan precios para el año seleccionado
    const filtradas = seleccion._todasVersiones.filter(v => {
      const precios = typeof v.precios_json === 'string' ? JSON.parse(v.precios_json) : v.precios_json;
      return precios[anio] !== undefined;
    });

    setVersionesFiltradas(filtradas);
  };

  const handleVersionChange = (e) => {
    const verNombre = e.target.value;
    const versionElegida = versionesFiltradas.find(v => v.version === verNombre);
    
    if (versionElegida) {
      const precios = typeof versionElegida.precios_json === 'string' 
        ? JSON.parse(versionElegida.precios_json) 
        : versionElegida.precios_json;
      
      const precioBase = precios[seleccion.anio];
      let valorConvertido = Number(precioBase);

      // Lógica de multiplicador
      if (versionElegida.moneda === "U$S") {
          valorConvertido = valorConvertido * MULTIPLICADOR_USD * MULTIPLICADOR_GENERAL;
      } else {
          valorConvertido = valorConvertido * MULTIPLICADOR_GENERAL;
      }

      setSeleccion(prev => ({ ...prev, version: verNombre, moneda: versionElegida.moneda }));
      setPrecioFinal(valorConvertido);
    }
  };

  return (
    <div id="tasador" className={style.container}>
      <div className={style.header}>
        <div className={style.iconWrapper}><Car className={style.accentIcon} size={32} /></div>
        <h2 className={style.title}>Tasador <span className={style.accentText}>Usados</span></h2>
        <p>Precios sugeridos de mercado</p>
      </div>

      <div className={style.selectorsGrid}>
        {/* 1. MARCA */}
        <div className={style.fieldGroup}>
          <label className={style.label}>Marca</label>
          <select className={style.select} onChange={handleMarcaChange} value={seleccion.marca}>
            <option value="">Seleccionar...</option>
            {marcas.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* 2. MODELO */}
        <div className={style.fieldGroup}>
          <label className={style.label}>Modelo</label>
          <select className={style.select} onChange={handleModeloChange} disabled={!seleccion.marca} value={seleccion.modelo}>
            <option value="">Seleccionar...</option>
            {modelos.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* 3. AÑO (Invertido) */}
        <div className={style.fieldGroup}>
          <label className={style.label}>Año</label>
          <select className={style.select} onChange={handleAnioChange} disabled={!seleccion.modelo} value={seleccion.anio}>
            <option value="">Seleccionar...</option>
            {aniosDisponibles.map(anio => <option key={anio} value={anio}>{anio}</option>)}
          </select>
        </div>

        {/* 4. VERSIÓN (Invertido) */}
        <div className={style.fieldGroup}>
          <label className={style.label}>Versión</label>
          <select className={style.select} onChange={handleVersionChange} disabled={!seleccion.anio} value={seleccion.version}>
            <option value="">Seleccionar...</option>
            {versionesFiltradas.map((v, i) => <option key={i} value={v.version}>{v.version}</option>)}
          </select>
        </div>
      </div>

      {precioFinal && (
        <div className={style.resultCard}>
          <p className={style.resultLabel}>Valor estimado (ARS)</p>
          <div className={style.priceDisplay}>
            <span className={style.currency}>$</span>
            <span className={style.amount}>{Math.round(precioFinal).toLocaleString('es-AR')}</span>
          </div>
          <button onClick={handleReset} className={style.resetButton}>
            <RefreshCcw size={16} /> NUEVA CONSULTA
          </button>
        </div>
      )}

      {loading && <div className={style.loadingWrapper}><Loader2 className={style.spinner} size={40} /></div>}
    </div>
  );
};

export default CotizadorNorte;