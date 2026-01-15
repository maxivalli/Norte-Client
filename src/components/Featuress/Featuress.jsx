import React from 'react';
import styles from './Featuress.module.css';
import { Award, ShieldCheck, Banknote } from 'lucide-react';

function Featuress() {
  const items = [
    {
      icon: <Award size={40} className={styles.icon} />,
      title: "Experiencia",
      desc: "Más de 30 años de trayectoria en el mercado nos avalan."
    },
    {
      icon: <ShieldCheck size={40} className={styles.icon} />,
      title: "Calidad",
      desc: "Unidades seleccionadas y revisadas bajo los más altos estándares."
    },
    {
      icon: <Banknote size={40} className={styles.icon} />,
      title: "Oportunidad",
      desc: "Ofrecemos el mejor precio del mercado y planes de financiación."
    }
  ];

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        {items.map((item, index) => (
          <div key={index} className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              {item.icon}
            </div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Featuress;