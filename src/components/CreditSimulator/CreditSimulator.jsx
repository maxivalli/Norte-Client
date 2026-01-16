import React, { useState, useEffect } from "react";
import styles from "./CreditSimulator.module.css";
import { Calculator, Info, Wallet } from "lucide-react";

const CreditSimulator = ({ autos }) => {
  const [montoVehiculo, setMontoVehiculo] = useState("");
  const [entrega, setEntrega] = useState("");
  const [cuotas, setCuotas] = useState(12);
  const [resultado, setResultado] = useState(0);

  // Configuración de tasas (puedes ajustar estos valores)
  const TASA_ANUAL = 0.35; // 35% ejemplo

  useEffect(() => {
    const valorAuto = parseFloat(montoVehiculo) || 0;
    const valorEntrega = parseFloat(entrega) || 0;
    const montoFinanciar = valorAuto - valorEntrega;

    if (montoFinanciar > 0 && cuotas > 0) {
      const tasaMensual = TASA_ANUAL / 12;
      // Fórmula de cuota fija (Sistema Francés)
      const cuota =
        (montoFinanciar * tasaMensual) /
        (1 - Math.pow(1 + tasaMensual, -cuotas));
      setResultado(Math.round(cuota));
    } else {
      setResultado(0);
    }
  }, [montoVehiculo, entrega, cuotas]);

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <Calculator className={styles.icon} size={32} />
        <h2>Simulador de Créditos Prendarios</h2>
        <p>Elegí tu próximo auto y calculá tu financiación en el acto.</p>
      </div>

      <div className={styles.grid}>
        {/* LADO IZQUIERDO: INPUTS */}
        <div className={styles.inputSection}>
          <div className={styles.group}>
            <label>Seleccioná un vehículo del catálogo:</label>
            <select
              onChange={(e) => setMontoVehiculo(e.target.value)}
              className={styles.select}
              defaultValue=""
            >
              <option value="">-- Ingresar monto manual --</option>

              {Array.isArray(autos) &&
                autos
                  // 1. Filtramos: Solo pasan los autos con precio mayor a 0
                  .filter((auto) => Number(auto.precio) > 0)
                  // 2. Mapeamos: Mostramos solo los que pasaron el filtro
                  .map((auto) => (
                    <option key={auto.id} value={auto.precio}>
                      {auto.nombre} ({auto.moneda}{" "}
                      {Number(auto.precio).toLocaleString("es-AR")})
                    </option>
                  ))}
            </select>
          </div>

          <div className={styles.group}>
            <label>Valor del vehículo:</label>
            <input
              type="number"
              value={montoVehiculo}
              onChange={(e) => setMontoVehiculo(e.target.value)}
              placeholder="Ej: 15000000"
            />
          </div>

          <div className={styles.group}>
            <label>Tu entrega inicial:</label>
            <input
              type="number"
              value={entrega}
              onChange={(e) => setEntrega(e.target.value)}
              placeholder="Ej: 8000000"
            />
          </div>

          <div className={styles.group}>
            <label>Plazo en meses:</label>
            <div className={styles.cuotasGrid}>
              {[12, 24, 36, 48].map((n) => (
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

        {/* LADO DERECHO: RESULTADO */}
        <div className={styles.resultSection}>
          <div className={styles.resultCard}>
            <Wallet size={40} color="#25D366" />
            <span>Cuota mensual estimada</span>
            <p>Tasa promedio: 35%</p>
            <h3 className={styles.price}>
              $ {resultado.toLocaleString("es-AR")}
            </h3>
            <div className={styles.infoBox}>
              <Info size={16} />
              <p>
                Tasa fija en pesos. Sujeto a aprobación crediticia según perfil
                del cliente.
              </p>
            </div>
            <button
              className={styles.cta}
              onClick={() =>
                window.open(
                  `https://wa.me/5493408671423?text=Hola! Estuve usando el simulador y me interesa financiar un vehículo.`,
                  "_blank"
                )
              }
            >
              Consultar por este plan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreditSimulator;
