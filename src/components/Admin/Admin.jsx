import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Admin.module.css";

function Admin() {
  const navigate = useNavigate();
  const [autos, setAutos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [filtroAdmin, setFiltroAdmin] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [cargando, setCargando] = useState(false);

  const API_URL = window.location.hostname === "localhost" 
    ? "http://localhost:5001/api/autos" 
    : "https://norte-production.up.railway.app/api/autos";

  const initialForm = {
    nombre: "",
    precio: "",
    moneda: "U$S",
    imagenes: [],
    motor: "",
    transmision: "Manual",
    anio: "",
    combustible: "Nafta",
    kilometraje: "",
    descripcion: "",
    reservado: false,
  };

  const [formData, setFormData] = useState(initialForm);

  // --- CARGA INICIAL Y LOGIN ---
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth !== "true") {
      navigate("/login");
    } else {
      cargarAutos();
    }
  }, [navigate]);

  const cargarAutos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setAutos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener autos:", err);
    }
  };

  // --- MANEJO DE FORMULARIO ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeSelectedFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  // --- SUBIDA A CLOUDINARY ---
  const uploadImagesToCloudinary = async (files) => {
    const uploadedUrls = [];
    const uploadPreset = "norte_autos"; // REEMPLAZAR
    const cloudName = "det2xmstl";     // REEMPLAZAR

    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", uploadPreset);
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: data,
        });
        const resData = await res.json();
        if (resData.secure_url) uploadedUrls.push(resData.secure_url);
      } catch (err) {
        console.error("Error en Cloudinary:", err);
      }
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      let urlsFinales = formData.imagenes;

      if (selectedFiles.length > 0) {
        const nuevasUrls = await uploadImagesToCloudinary(selectedFiles);
        urlsFinales = editandoId ? [...formData.imagenes, ...nuevasUrls] : nuevasUrls;
      }

      const autoParaEnviar = {
        ...formData,
        imagenes: urlsFinales,
        precio: Number(formData.precio),
        anio: Number(formData.anio),
        kilometraje: Number(formData.kilometraje),
      };

      const res = await fetch(editandoId ? `${API_URL}/${editandoId}` : API_URL, {
        method: editandoId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(autoParaEnviar),
      });

      if (res.ok) {
        alert(editandoId ? "✅ Actualizado correctamente" : "🚀 Publicado con éxito");
        limpiarFormulario();
        cargarAutos();
      }
    } catch (error) {
      alert("❌ Error al guardar");
    } finally {
      setCargando(false);
    }
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setFormData(initialForm);
    setSelectedFiles([]);
    setPreviews([]);
  };

  const prepararEdicion = (auto) => {
    setEditandoId(auto.id);
    setFormData({ ...auto, imagenes: auto.imagenes || [] });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este vehículo?")) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if(res.ok) cargarAutos();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("adminAuth");
    navigate("/login");
  };

  // --- FILTRO DE BÚSQUEDA ---
  const autosFiltrados = autos.filter((auto) =>
    auto.nombre.toLowerCase().includes(filtroAdmin.toLowerCase())
  );

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <div>
          <h1>{editandoId ? "📝 Editando" : "🚗 Panel de Carga"}</h1>
          <p>Norte Automotores</p>
        </div>
        <button onClick={cerrarSesion} className={styles.logoutBtn}>Cerrar Sesión</button>
      </header>

      <section className={styles.formSection}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Título / Marca y Modelo:</label>
            <input name="nombre" placeholder="Ej: VW Golf 2020" onChange={handleChange} value={formData.nombre} required />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Moneda:</label>
              <select name="moneda" onChange={handleChange} value={formData.moneda}>
                <option value="U$S">U$S</option>
                <option value="$">$</option>
              </select>
            </div>
            <div className={styles.formGroup} style={{flex: 2}}>
              <label>Precio:</label>
              <input name="precio" type="number" onChange={handleChange} value={formData.precio} required />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Imágenes (Desde Galería):</label>
            <label className={styles.fileLabel}>
              <span className={styles.uploadIcon}>📸</span>
              {selectedFiles.length > 0 ? `${selectedFiles.length} seleccionadas` : "Subir fotos desde la galería"}
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className={styles.hiddenFileInput} />
            </label>

            {previews.length > 0 && (
              <div className={styles.previewContainer}>
                {previews.map((url, index) => (
                  <div key={index} className={styles.previewItem}>
                    <img src={url} alt="Previa" />
                    <button type="button" onClick={() => removeSelectedFile(index)} className={styles.removePreview}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Motor:</label>
              <input name="motor" placeholder="Ej: 1.6 TDI" onChange={handleChange} value={formData.motor} />
            </div>
            <div className={styles.formGroup}>
              <label>Combustible:</label>
              <select name="combustible" onChange={handleChange} value={formData.combustible}>
                <option value="Nafta">Nafta</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Año:</label>
              <input name="anio" type="number" onChange={handleChange} value={formData.anio} />
            </div>
            <div className={styles.formGroup}>
              <label>Kilometraje:</label>
              <input name="kilometraje" type="number" onChange={handleChange} value={formData.kilometraje} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Descripción:</label>
            <textarea name="descripcion" placeholder="Más información (Ej: Asientos de cuero, A/A, Pantalla 7 pulgadas, etc)" onChange={handleChange} value={formData.descripcion} />
          </div>

          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="reservado" onChange={handleChange} checked={formData.reservado} />
            Marcar como RESERVADO
          </label>

          <div className={styles.buttonGroup}>
            <button type="submit" className={`${styles.submitBtn} ${cargando ? styles.loading : ""}`} disabled={cargando}>
              {cargando ? "⏳ Subiendo..." : editandoId ? "💾 Guardar Cambios" : "🚀 Publicar"}
            </button>
            {editandoId && (
              <button type="button" onClick={limpiarFormulario} className={styles.cancelBtn}>Cancelar Edición</button>
            )}
          </div>
        </form>
      </section>

      <hr className={styles.divider} />

      {/* --- LISTADO DE AUTOS CARGADOS --- */}
      <section className={styles.listSection}>
        <div className={styles.listHeader}>
          <h3>Inventario ({autos.length} unidades)</h3>
          <input 
            type="text" 
            placeholder="🔍 Buscar auto por nombre..." 
            className={styles.searchAdminInput} 
            onChange={(e) => setFiltroAdmin(e.target.value)} 
          />
        </div>

        <div className={styles.listaBorrar}>
          {autosFiltrados.length > 0 ? (
            autosFiltrados.map((auto) => (
              <div key={auto.id} className={styles.itemBorrar}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{auto.nombre}</span>
                  <span className={styles.itemDetails}>
                    {auto.moneda} {auto.precio?.toLocaleString()} | {auto.anio}
                  </span>
                </div>
                <div className={styles.acciones}>
                  <button onClick={() => prepararEdicion(auto)} className={styles.editBtn}>Editar</button>
                  <button onClick={() => handleDelete(auto.id)} className={styles.deleteBtn}>Borrar</button>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.emptyMsg}>No se encontraron vehículos.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Admin;