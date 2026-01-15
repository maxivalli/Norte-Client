import React, { useState } from "react";
import styles from "./Contact.module.css";
import { Mail, Phone, MapPin, Send } from "lucide-react";

function Contact() {
  // Estado para capturar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Tu número de teléfono (sin el + ni espacios)
    const telefono = "5493408671423"; 

    // Redactamos el mensaje que te va a llegar
    const mensajeWpp = `Hola! Mi nombre es *${formData.nombre}*.\n` +
                       `Mi correo: ${formData.email}\n` +
                       `Consulta: ${formData.mensaje}`;

    // Codificamos el texto para que sea una URL válida
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensajeWpp)}`;

    // Abrimos WhatsApp en una pestaña nueva
    window.open(url, "_blank");
  };

  return (
    <section className={styles.section} id="contacto">
      <h2 className={styles.title}>Contactanos</h2>

      <div className={styles.container}>
        {/* Lado izquierdo: Info */}
        <div className={styles.info}>
          <h3>Información de Venta</h3>

          <a href="https://www.google.com/maps/search/?api=1&query=Caseros+950+San+Cristobal" target="_blank" rel="noopener noreferrer">
            <MapPin size={20} /> Caseros 950 - San Cristóbal
          </a>

          <a href="tel:+543408671423">
            <Phone size={20} /> +54 3408 671423
          </a>
          
          <a href="mailto:joelpossi@gmail.com">
            <Mail size={20} /> joelpossi@gmail.com
          </a>

          <div style={{ marginTop: "20px", color: "#888" }}>
            <p>Lunes a Viernes: 08:00 - 12:00 hs / 16:00 - 20:00 hs</p>
            <p>Sábados: 8:00 - 12:00 hs</p>
          </div>
        </div>

        {/* Lado derecho: Formulario */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              name="nombre"
              placeholder="Nombre completo" 
              value={formData.nombre}
              onChange={handleChange}
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <input 
              type="email" 
              name="email"
              placeholder="Correo electrónico" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <textarea
              name="mensaje"
              placeholder="¿En qué auto estás interesado?"
              rows="4"
              value={formData.mensaje}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className={styles.submitBtn}>
            Enviar a WhatsApp <Send size={18} style={{ marginLeft: "8px" }} />
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;