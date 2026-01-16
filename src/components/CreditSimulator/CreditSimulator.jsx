import React, { useState, useEffect } from "react";
import styles from "./CreditSimulator.module.css";
import {
  Calculator,
  Wallet,
  Info,
  CheckCircle,
  Smartphone,
} from "lucide-react";

const CreditSimulator = ({ autos }) => {
  const [tipoTasa, setTipoTasa] = useState("FIJA");
  const [montoVehiculo, setMontoVehiculo] = useState("");
  const [entrega, setEntrega] = useState("");
  const [cuotas, setCuotas] = useState(24);
  const [anioAuto, setAnioAuto] = useState(2026); // Año actual
  const [resultado, setResultado] = useState(0);
  const [tasaAplicada, setTasaAplicada] = useState(0);

  useEffect(() => {
    const valorAuto = parseFloat(montoVehiculo) || 0;
    const valorEntrega = parseFloat(entrega) || 0;
    const montoFinanciar = valorAuto - valorEntrega;

    if (montoFinanciar > 0 && cuotas > 0) {
      const anioActual = 2026;
      const antiguedad = anioActual - anioAuto;

      // --- LÓGICA DE TASAS SEGÚN ANTIGÜEDAD (Estilo Prendarios) ---
      let tna;
      if (tipoTasa === "FIJA") {
        if (antiguedad <= 0) tna = 0.65; // 0KM: 65%
        else if (antiguedad <= 5) tna = 0.78; // 1 a 5 años: 78%
        else if (antiguedad <= 10) tna = 0.85; // 6 a 10 años: 85%
        else tna = 0.95; // +10 años: 95%
      } else {
        // UVA: Tasas bajas pero capital ajustable
        tna = antiguedad <= 0 ? 0.12 : 0.16;
      }

      setTasaAplicada(tna * 100);

      // Sistema Francés de Amortización
      const tasaMensual = tna / 12;
      const cuota =
        (montoFinanciar * tasaMensual) /
        (1 - Math.pow(1 + tasaMensual, -cuotas));
      setResultado(Math.round(cuota));
    } else {
      setResultado(0);
      setTasaAplicada(0);
    }
  }, [montoVehiculo, entrega, cuotas, tipoTasa, anioAuto]);

  const handleSelectAuto = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setMontoVehiculo("");
      setAnioAuto(2026);
      return;
    }
    const auto = autos.find((a) => a.id === parseInt(selectedId));
    if (auto) {
      setMontoVehiculo(auto.precio);
      setAnioAuto(auto.anio);
      setEntrega(Math.round(auto.precio * 0.35)); // Sugerir 35% de entrega
    }
  };

  const montoAFinanciar =
    (parseFloat(montoVehiculo) || 0) - (parseFloat(entrega) || 0);

  return (
    <section id="simulador" className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Calculator size={30} className={styles.brandIcon} />
          <div>
            <h2>Cotizador Prendario</h2>
            <p>La tasa se ajusta según el año de la unidad</p>
          </div>
        </div>

        {/* SELECTOR DE TASA */}
        <div className={styles.tabs}>
          <button
            className={tipoTasa === "FIJA" ? styles.active : ""}
            onClick={() => setTipoTasa("FIJA")}
          >
            Tasa Fija $
          </button>
          <button
            className={tipoTasa === "UVA" ? styles.active : ""}
            onClick={() => setTipoTasa("UVA")}
          >
            Créditos UVA
          </button>
        </div>

        <div className={styles.mainGrid}>
          {/* LADO IZQUIERDO: DATOS */}
          <div className={styles.formSide}>
            <div className={styles.inputBox}>
              <label>Elegir del stock:</label>
              <select onChange={handleSelectAuto} className={styles.select}>
                <option value="">Ingreso manual de monto</option>
                {Array.isArray(autos) &&
                  autos
                    .filter((a) => Number(a.precio) > 0)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nombre} ({a.anio})
                      </option>
                    ))}
              </select>
            </div>

            <div className={styles.rowInputs}>
              <div className={styles.inputBox}>
                <label>Valor Auto</label>
                <input
                  type="number"
                  value={montoVehiculo}
                  onChange={(e) => setMontoVehiculo(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className={styles.inputBox}>
                <label>Año</label>
                <input
                  type="number"
                  value={anioAuto}
                  onChange={(e) => setAnioAuto(e.target.value)}
                  placeholder="2026"
                />
              </div>
            </div>

            <div className={styles.inputBox}>
              <label>Tu entrega inicial</label>
              <input
                type="number"
                value={entrega}
                onChange={(e) => setEntrega(e.target.value)}
                placeholder="Monto en pesos"
              />
            </div>

            <div className={styles.inputBox}>
              <label>
                Plazo: <strong>{cuotas} meses</strong>
              </label>
              <input
                type="range"
                min="12"
                max="60"
                step="12"
                value={cuotas}
                onChange={(e) => setCuotas(parseInt(e.target.value))}
                className={styles.range}
              />
              <div className={styles.rangeLabels}>
                <span>12m</span>
                <span>24m</span>
                <span>36m</span>
                <span>48m</span>
                <span>60m</span>
              </div>
            </div>
          </div>

          {/* LADO DERECHO: RESULTADOS */}
          <div className={styles.resultSide}>
            <div
              className={`${styles.badge} ${
                anioAuto >= 2026 ? styles.nuevo : styles.usado
              }`}
            >
              {anioAuto >= 2026 ? "Unidad 0KM" : `Usado Año ${anioAuto}`}
            </div>

            <div className={styles.priceContainer}>
              <span className={styles.labelResultado}>
                Cuota Mensual Estimada
              </span>
              <h3 className={resultado > 0 ? styles.priceActive : ""}>
                $ {resultado.toLocaleString("es-AR")}
              </h3>
            </div>

            <div className={styles.dataList}>
              <div className={styles.dataItem}>
                <CheckCircle size={14} />{" "}
                <span>
                  Financiás: $
                  {montoAFinanciar > 0
                    ? montoAFinanciar.toLocaleString("es-AR")
                    : 0}
                </span>
              </div>
              <div className={styles.dataItem}>
                <CheckCircle size={14} />{" "}
                <span>TNA aplicada: {tasaAplicada}%</span>
              </div>
            </div>

            <div
              className={
                tipoTasa === "FIJA" ? styles.infoBoxFija : styles.infoBoxUva
              }
            >
              <Info size={16} />
              <p>
                {tipoTasa === "FIJA"
                  ? "Tasa fija en pesos. Sin sorpresas."
                  : "Cuota inicial baja ajustable por inflación."}
              </p>
            </div>

            <button
              className={styles.cta}
              onClick={() =>
                window.open(
                  `https://wa.me/5493408671423?text=Hola! Coticé un auto ${anioAuto} en el simulador, quisiera más información.`,
                  "_blank"
                )
              }
            >
              <Smartphone size={18} /> Consultar por Whatsapp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreditSimulator;
