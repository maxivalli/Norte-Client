import React from "react";
import styles from "./Contact.module.css";
import { Mail, Phone, MapPin, Send } from "lucide-react";

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("¡Gracias por tu mensaje! Un asesor te contactará pronto.");
  };

  return (
    <section className={styles.section} id="contacto">
      <h2 className={styles.title}>Contactanos</h2>

      <div className={styles.container}>
        {/* Lado izquierdo: Info */}
        <div className={styles.info}>
          <h3>Información de Venta</h3>

          <a href="https://maps.app.goo.gl/UwMuVebcnWzZrodo6">
            <MapPin size={20} /> Caseros 950 - San Cristóbal
          </a>

          <a>
            <Phone size={20} /> +54 3408 671423
          </a>
          <a href="mailto:joelpossi@gmail.com">
            <Mail size={20} /> joelpossi@gmail.com.com
          </a>
          <div style={{ marginTop: "20px", color: "#888" }}>
            <p>Lunes a Viernes: 08:00 - 12:00 hs / 16:00 - 20:00 hs</p>
            <p>Sábados: 8:00 - 12:00 hs</p>
          </div>
        </div>

        {/* Lado derecho: Formulario */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input type="text" placeholder="Nombre completo" required />
          </div>
          <div className={styles.inputGroup}>
            <input type="email" placeholder="Correo electrónico" required />
          </div>
          <div className={styles.inputGroup}>
            <textarea
              placeholder="¿En qué auto estás interesado?"
              rows="4"
              required
            ></textarea>
          </div>
          <button type="submit" className={styles.submitBtn}>
            Enviar Consulta <Send size={18} style={{ marginLeft: "8px" }} />
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
