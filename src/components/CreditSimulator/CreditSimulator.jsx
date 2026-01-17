import React, { useState, useEffect } from "react";
import styles from "./CreditSimulator.module.css";
import {
  Calculator,
  Wallet,
  Info,
  CheckCircle,
  Smartphone,
  Percent, // Icono para tasa cero
} from "lucide-react";

const CreditSimulator = ({ autos }) => {
  const [tipoTasa, setTipoTasa] = useState("FIJA");
  const [montoVehiculo, setMontoVehiculo] = useState("");
  const [entrega, setEntrega] = useState("");
  const [cuotas, setCuotas] = useState(24);
  const [anioAuto, setAnioAuto] = useState(2026);
  const [resultado, setResultado] = useState(0);
  const [tasaAplicada, setTasaAplicada] = useState(0);
  const [autoSeleccionado, setAutoSeleccionado] = useState(null); // Nuevo: Guardar el objeto auto
  const MIN_ENTREGA_PORCENTAJE = 0.3; // 30%

  useEffect(() => {
    const valorAuto = parseFloat(montoVehiculo) || 0;
    const valorEntrega = parseFloat(entrega) || 0;
    const montoFinanciar = valorAuto - valorEntrega;

    if (montoFinanciar > 0) {
      let tna;
      let cuotasCalculo = cuotas; // Usamos las cuotas del estado por defecto

      // Si es Tasa Cero, forzamos a 12 cuotas y TNA 0
      if (autoSeleccionado?.etiqueta === "tasa_cero") {
        tna = 0;
        cuotasCalculo = 12; // Forzamos el divisor a 12
      } else {
        // Lógica normal de tasas
        const antiguedad = 2026 - anioAuto;
        if (tipoTasa === "FIJA") {
          if (antiguedad <= 0) tna = 0.65;
          else if (antiguedad <= 5) tna = 0.78;
          else if (antiguedad <= 10) tna = 0.85;
          else tna = 0.95;
        } else {
          tna = antiguedad <= 0 ? 0.12 : 0.16;
        }
      }

      setTasaAplicada(tna * 100);

      if (tna === 0) {
        setResultado(Math.round(montoFinanciar / 12));
      } else {
        const tasaMensual = tna / 12;
        const cuota =
          (montoFinanciar * tasaMensual) /
          (1 - Math.pow(1 + tasaMensual, -cuotasCalculo));
        setResultado(Math.round(cuota));
      }
    } else {
      setResultado(0);
      setTasaAplicada(0);
    }
  }, [montoVehiculo, entrega, cuotas, tipoTasa, anioAuto, autoSeleccionado]);

  const handleSelectAuto = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setMontoVehiculo("");
      setAnioAuto(2026);
      setAutoSeleccionado(null);
      setEntrega(""); // Limpiamos entrega
      return;
    }
    const auto = autos.find((a) => a.id === parseInt(selectedId));
    if (auto) {
      setAutoSeleccionado(auto);
      setMontoVehiculo(auto.precio);
      setAnioAuto(auto.anio);

      // Sugerimos el 35%, que ya es mayor al 30% obligatorio
      setEntrega(Math.round(auto.precio * 0.35));

      if (auto.etiqueta === "tasa_cero") {
        setCuotas(12);
      }
    }
  };

  const validarEntrega = () => {
    const valorAuto = parseFloat(montoVehiculo) || 0;
    const valorEntrega = parseFloat(entrega) || 0;
    const minimoRequerido = Math.round(valorAuto * MIN_ENTREGA_PORCENTAJE);

    if (valorEntrega < minimoRequerido && valorAuto > 0) {
      setEntrega(minimoRequerido);
      alert(
        `La entrega mínima permitida es del 30% ($${minimoRequerido.toLocaleString(
          "es-AR"
        )})`
      );
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

        {/* SELECTOR DE TASA (Se oculta o bloquea si es Tasa Cero) */}
        <div className={styles.tabs}>
          <button
            className={tipoTasa === "FIJA" ? styles.active : ""}
            onClick={() => setTipoTasa("FIJA")}
            disabled={autoSeleccionado?.etiqueta === "tasa_cero"}
          >
            Tasa Fija $
          </button>
          <button
            className={tipoTasa === "UVA" ? styles.active : ""}
            onClick={() => setTipoTasa("UVA")}
            disabled={autoSeleccionado?.etiqueta === "tasa_cero"}
          >
            Créditos UVA
          </button>
        </div>

        <div className={styles.mainGrid}>
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
                        {a.nombre} ({a.anio}){" "}
                        {a.etiqueta === "tasa_cero" ? " 🔥 [TASA 0%]" : ""}
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
              <label>Tu entrega inicial (Mín. 30%)</label>
              <input
                type="number"
                value={entrega}
                onChange={(e) => setEntrega(e.target.value)}
                onBlur={validarEntrega} // <--- Se dispara al salir del input
                placeholder="Monto en pesos"
              />
              {montoVehiculo > 0 && (
                <small style={{ color: "#888", fontSize: "0.7rem" }}>
                  Mínimo requerido: $
                  {(montoVehiculo * 0.3).toLocaleString("es-AR")}
                </small>
              )}
            </div>

            <div className={styles.inputBox}>
              <label>
                Plazo:{" "}
                <strong>
                  {autoSeleccionado?.etiqueta === "tasa_cero"
                    ? "12 meses (Fijo)"
                    : `${cuotas} meses`}
                </strong>
              </label>
              <input
                type="range"
                min="12"
                max="60"
                step="12"
                value={cuotas}
                onChange={(e) => setCuotas(parseInt(e.target.value))}
                disabled={autoSeleccionado?.etiqueta === "tasa_cero"} // <-- Bloqueamos el slider
                className={styles.range}
                style={{
                  opacity: autoSeleccionado?.etiqueta === "tasa_cero" ? 0.5 : 1,
                }}
              />
              <div className={styles.rangeLabels}>
                <span>12m</span>
                <span>24m</span>
                <span>36m</span>
                <span>48m</span>
                <span>60m</span>
              </div>
              {autoSeleccionado?.etiqueta === "tasa_cero" && (
                <p
                  style={{
                    color: "#ff4b2b",
                    fontSize: "0.8rem",
                    marginTop: "5px",
                    fontWeight: "bold",
                  }}
                >
                  * El beneficio de Tasa 0% aplica únicamente en 12 cuotas
                  fijas.
                </p>
              )}
            </div>
          </div>

          <div className={styles.resultSide}>
            {/* Si es Tasa Cero, mostramos un badge especial en el resultado */}
            {autoSeleccionado?.etiqueta === "tasa_cero" ? (
              <div
                className={`${styles.badge} ${styles.nuevo}`}
                style={{ background: "#ff4b2b", color: "#fff" }}
              >
                ¡BENEFICIO TASA 0%!
              </div>
            ) : (
              <div
                className={`${styles.badge} ${
                  anioAuto >= 2026 ? styles.nuevo : styles.usado
                }`}
              >
                {anioAuto >= 2026 ? "Unidad 0KM" : `Usado Año ${anioAuto}`}
              </div>
            )}

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

            {/* INFO BOX DINÁMICO */}
            {autoSeleccionado?.etiqueta === "tasa_cero" ? (
              <div
                className={styles.infoBoxFija}
                style={{ backgroundColor: "#e3f2fd", color: "#1565c0" }}
              >
                <Percent size={16} />
                <p>Esta unidad cuenta con financiación especial sin interés.</p>
              </div>
            ) : (
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
            )}

            <button
              className={styles.cta}
              onClick={() =>
                window.open(
                  `https://wa.me/5493408671423?text=Hola! Coticé el ${
                    autoSeleccionado?.nombre || "auto"
                  } con Tasa 0%, quisiera más información.`,
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
