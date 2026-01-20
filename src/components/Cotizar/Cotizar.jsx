import React, { useState, useEffect } from "react";
import { ChevronRight, Car, Loader2, RefreshCcw } from "lucide-react";
import style from "./Cotizar.module.css";

const CotizadorNorte = () => {
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [versiones, setVersiones] = useState([]);
  const [aniosDisponibles, setAniosDisponibles] = useState([]);
  
  const [seleccion, setSeleccion] = useState({ marca: "", modelo: "", version: "", anio: "", moneda: "$" });
  const [precioFinal, setPrecioFinal] = useState(null);
  const [loading, setLoading] = useState(false);

  const TIPO_CAMBIO = 1000;
  const API_BASE = "http://localhost:5001/api/guia/consulta";

  useEffect(() => {
    fetch(API_BASE).then(res => res.json()).then(data => setMarcas(data));
  }, []);

  // Función para restablecer todo el formulario
  const handleReset = () => {
    setSeleccion({ marca: "", modelo: "", version: "", anio: "", moneda: "$" });
    setModelos([]);
    setVersiones([]);
    setAniosDisponibles([]);
    setPrecioFinal(null);
  };

  const handleMarcaChange = async (e) => {
    const m = e.target.value;
    setSeleccion({ marca: m, modelo: "", version: "", anio: "", moneda: "$" });
    setVersiones([]); setAniosDisponibles([]); setPrecioFinal(null);
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
    setSeleccion(prev => ({ ...prev, modelo: mod, version: "", anio: "" }));
    if (mod) {
      setLoading(true);
      const res = await fetch(`${API_BASE}?marca=${encodeURIComponent(seleccion.marca)}&modelo=${encodeURIComponent(mod)}`);
      const data = await res.json();
      setVersiones(data);
      setLoading(false);
    }
  };

  const handleVersionChange = (e) => {
    const verNombre = e.target.value;
    const versionElegida = versiones.find(v => v.version === verNombre);
    if (versionElegida) {
      const precios = typeof versionElegida.precios_json === 'string' 
        ? JSON.parse(versionElegida.precios_json) 
        : versionElegida.precios_json;
      
      setAniosDisponibles(Object.entries(precios));
      setSeleccion(prev => ({ ...prev, version: verNombre, anio: "", moneda: versionElegida.moneda }));
      setPrecioFinal(null);
    }
  };

  const handleAnioChange = (e) => {
    const anio = e.target.value;
    const precioBase = aniosDisponibles.find(([a]) => a === anio)?.[1];
    
    let valorConvertido = Number(precioBase);
    if (seleccion.moneda === "U$S") {
        valorConvertido = valorConvertido * 1000 * TIPO_CAMBIO;
    } else {
        valorConvertido = valorConvertido * 1000;
    }

    setSeleccion(prev => ({ ...prev, anio }));
    setPrecioFinal(valorConvertido);
  };

  return (
    <div id="tasador" className={style.container}>
      <div className={style.header}>
        <div className={style.iconWrapper}><Car className={style.accentIcon} size={32} /></div>
        <h2 className={style.title}>Tasador <span className={style.accentText}>Usados</span></h2>
        <p>Desde 2012 hasta 2025</p>
      </div>

      <div className={style.selectorsGrid}>
        <div className={style.fieldGroup}>
          <label className={style.label}>Marca</label>
          <select className={style.select} onChange={handleMarcaChange} value={seleccion.marca}>
            <option value="">Seleccionar...</option>
            {marcas.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className={style.fieldGroup}>
          <label className={style.label}>Modelo</label>
          <select className={style.select} onChange={handleModeloChange} disabled={!seleccion.marca} value={seleccion.modelo}>
            <option value="">Seleccionar...</option>
            {modelos.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className={style.fieldGroup}>
          <label className={style.label}>Versión</label>
          <select className={style.select} onChange={handleVersionChange} disabled={!seleccion.modelo} value={seleccion.version}>
            <option value="">Seleccionar...</option>
            {versiones.map((v, i) => <option key={i} value={v.version}>{v.version}</option>)}
          </select>
        </div>

        <div className={style.fieldGroup}>
          <label className={style.label}>Año</label>
          <select className={style.select} onChange={handleAnioChange} disabled={!seleccion.version} value={seleccion.anio}>
            <option value="">Seleccionar...</option>
            {aniosDisponibles.map(([anio]) => <option key={anio} value={anio}>{anio}</option>)}
          </select>
        </div>
      </div>

      {precioFinal && (
        <div className={style.resultCard}>
          <p className={style.resultLabel}>Valor de Mercado estimado (ARS)</p>
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