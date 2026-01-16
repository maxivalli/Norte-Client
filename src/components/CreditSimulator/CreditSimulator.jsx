import React, { useState, useEffect } from "react";
import styles from "./CreditSimulator.module.css";
import { Calculator, Info, Wallet } from "lucide-react";

const CreditSimulator = ({ autos }) => {
  const [tipoTasa, setTipoTasa] = useState("FIJA"); // "FIJA" o "UVA"
  const [montoVehiculo, setMontoVehiculo] = useState("");
  const [entrega, setEntrega] = useState("");
  const [cuotas, setCuotas] = useState(24);
  const [anioAuto, setAnioAuto] = useState(new Date().getFullYear());
  const [resultado, setResultado] = useState(0);

  // --- CONFIGURACIÓN DE TASAS ---
  // Puedes ajustar estos números según tus convenios bancarios
  const TASAS = {
    FIJA: {
      usado: 0.85, // 85% TNA
      cero: 0.72   // 72% TNA
    },
    UVA: {
      usado: 0.16, // 16% + UVA
      cero: 0.12   // 12% + UVA
    }
  };

  useEffect(() => {
    const valorAuto = parseFloat(montoVehiculo) || 0;
    const valorEntrega = parseFloat(entrega) || 0;
    const montoFinanciar = valorAuto - valorEntrega;

    if (montoFinanciar > 0 && cuotas > 0) {
      // Determinamos si es 0km o Usado para elegir la tasa
      const esCeroKm = anioAuto >= new Date().getFullYear();
      const tna = esCeroKm ? TASAS[tipoTasa].cero : TASAS[tipoTasa].usado;
      
      const tasaMensual = tna / 12;
      // Fórmula Sistema Francés
      const cuota = (montoFinanciar * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -cuotas));
      setResultado(Math.round(cuota));
    } else {
      setResultado(0);
    }
  }, [montoVehiculo, entrega, cuotas, tipoTasa, anioAuto]);

  const handleSelectAuto = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setMontoVehiculo("");
      setAnioAuto(new Date().getFullYear());
      return;
    }
    const auto = autos.find(a => a.id === parseInt(selectedId));
    if (auto) {
      setMontoVehiculo(auto.precio);
      setAnioAuto(auto.anio);
      // Sugerimos una entrega del 40% por defecto
      setEntrega(Math.round(auto.precio * 0.4));
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <Calculator className={styles.icon} size={32} />
        <h2>Simulador de Financiación</h2>
        <p>Elegí un vehículo y compará planes de cuota fija o UVA.</p>
      </div>

      {/* TABS DE TIPO DE TASA */}
      <div className={styles.tabs}>
        <button 
          className={tipoTasa === "FIJA" ? styles.activeTab : ""} 
          onClick={() => setTipoTasa("FIJA")}
        >
          Tasa Fija $
        </button>
        <button 
          className={tipoTasa === "UVA" ? styles.activeTab : ""} 
          onClick={() => setTipoTasa("UVA")}
        >
          Crédito UVA
        </button>
      </div>

      <div className={styles.grid}>
        {/* INPUTS */}
        <div className={styles.inputSection}>
          <div className={styles.group}>
            <label>Seleccioná una unidad de stock:</label>
            <select onChange={handleSelectAuto} className={styles.select}>
              <option value="">-- Ingresar monto manual --</option>
              {Array.isArray(autos) && autos
                .filter(a => Number(a.precio) > 0)
                .map(a => (
                  <option key={a.id} value={a.id}>
                    {a.nombre} ({a.anio})
                  </option>
                ))
              }
            </select>
          </div>

          <div className={styles.group}>
            <label>Valor del Vehículo:</label>
            <input 
              type="number" 
              value={montoVehiculo}
              onChange={(e) => {setMontoVehiculo(e.target.value); setAnioAuto(2024);}}
              placeholder="Ej: 12000000"
            />
          </div>

          <div className={styles.group}>
            <label>Tu entrega inicial:</label>
            <input 
              type="number" 
              value={entrega}
              onChange={(e) => setEntrega(e.target.value)}
              placeholder="¿Cuánto dinero disponés?"
            />
          </div>

          <div className={styles.group}>
            <label>Plazo del crédito:</label>
            <div className={styles.cuotasGrid}>
              {[12, 24, 36, 48, 60].map((n) => (
                <button 
                  key={n}
                  className={cuotas === n ? styles.activeBtn : ""}
                  onClick={() => setCuotas(n)}
                >
                  {n} meses
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RESULTADOS */}
        <div className={styles.resultSection}>
          <div className={styles.resultCard}>
            <Wallet size={40} color={tipoTasa === "FIJA" ? "#25D366" : "#3498db"} />
            <span className={styles.labelResultado}>Cuota mensual estimada</span>
            <h3 className={styles.price}>
              $ {resultado.toLocaleString("es-AR")}
            </h3>
            
            <div className={tipoTasa === "FIJA" ? styles.infoFija : styles.infoUva}>
              <Info size={18} />
              <p>
                {tipoTasa === "FIJA" 
                  ? "Las cuotas son fijas y en pesos durante todo el préstamo." 
                  : "Cuotas bajas ajustables por índice UVA (inflación)."}
              </p>
            </div>

            <div className={styles.detalles}>
              <p>Vehículo: <strong>{anioAuto >= 2024 ? '0KM' : 'Usado'}</strong></p>
              <p>Monto a financiar: <strong>$ {(montoVehiculo - entrega).toLocaleString("es-AR")}</strong></p>
            </div>

            <button 
              className={styles.cta}
              onClick={() => window.open(`https://wa.me/5493408671423?text=Hola! Quiero consultar por el plan de ${cuotas} cuotas para un vehículo de $${montoVehiculo}.`, "_blank")}
            >
              Consultar por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreditSimulator;