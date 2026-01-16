import React, { useEffect, useRef, useState } from 'react';
import styles from './Featuress.module.css';
import { Award, ShieldCheck, Banknote } from 'lucide-react';

// Sub-componente para manejar la lógica de aparición individual
function FeatureCard({ item, index }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    });

    const { current } = domRef;
    observer.observe(current);

    return () => observer.unobserve(current);
  }, []);

  return (
    <div
      ref={domRef}
      className={`${styles.featureCard} ${isVisible ? styles.isVisible : ''}`}
      style={{ transitionDelay: `${index * 150}ms` }} // Escalonado (0ms, 150ms, 300ms)
    >
      <div className={styles.iconWrapper}>
        {item.icon}
      </div>
      <h3>{item.title}</h3>
      <p>{item.desc}</p>
    </div>
  );
}

function Featuress() {
  const items = [
    {
      icon: <Award size={40} className={styles.icon} />,
      title: "Experiencia",
      desc: "Más de 50 años de trayectoria en el mercado nos avalan."
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
          <FeatureCard key={index} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

export default Featuress;