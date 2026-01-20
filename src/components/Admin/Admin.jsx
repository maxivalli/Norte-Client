import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Car, ChevronRight, FileText, Smartphone } from "lucide-react";
import AdminBanners from "../AdminBanners/AdminBanners";
import styles from "./Admin.module.css";

function Admin() {
  const navigate = useNavigate();
  const [autos, setAutos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [filtroAdmin, setFiltroAdmin] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [cargandoGuia, setCargandoGuia] = useState(false);

  // --- EQUIPAMIENTO CORREGIDO CON CATEGORÍAS ---
  const equipamientoOpciones = [
    { id: "airbags", label: "Airbags", emoji: "🛡️", categoria: "Seguridad" },
    { id: "abs", label: "ABS", emoji: "🛑", categoria: "Seguridad" },
    { id: "traccion", label: "Control de tracción", emoji: "🏎️", categoria: "Seguridad" },
    { id: "estabilidad", label: "Cont. de est. (ESP)", emoji: "⚖️", categoria: "Seguridad" },
    { id: "isofix", label: "Anclajes ISOFIX", emoji: "👶", categoria: "Seguridad" },
    { id: "presion", label: "Sensor de presión", emoji: "🎡", categoria: "Seguridad" },
    { id: "aire", label: "Aire acondicionado", emoji: "❄️", categoria: "Confort" },
    { id: "clima", label: "Climatizador", emoji: "🌡️", categoria: "Confort" },
    { id: "crucero", label: "Control crucero", emoji: "🛣️", categoria: "Confort" },
    { id: "cuero", label: "Asientos de cuero", emoji: "💺", categoria: "Confort" },
    { id: "techo", label: "Techo solar", emoji: "☀️", categoria: "Confort" },
    { id: "pantalla", label: "Pantalla multimedia", emoji: "📺", categoria: "Tecnología" },
    { id: "apple_android", label: "CarPlay / A. Auto", emoji: "📱", categoria: "Tecnología" },
    { id: "bluetooth", label: "Bluetooth", emoji: "🛜", categoria: "Tecnología" },
    { id: "camara", label: "Cámara de retroceso", emoji: "📷", categoria: "Tecnología" },
    { id: "sensores", label: "Sen. de estac.", emoji: "🚥", categoria: "Tecnología" },
    { id: "luces", label: "Luces antinieblas", emoji: "💡", categoria: "Exterior" },
    { id: "4x4", label: "Tracción 4x4", emoji: "⛰️", categoria: "Exterior" },
    { id: "aleacion", label: "Llantas de aleación", emoji: "🛞", categoria: "Exterior" }
  ];

  const [equipamientoSeleccionado, setEquipamientoSeleccionado] = useState({});

  const BASE_URL = window.location.hostname === "localhost"
      ? "http://localhost:5001/api"
      : "https://norte-production.up.railway.app/api";

  const API_URL = `${BASE_URL}/autos`;

  const initialForm = {
    nombre: "",
    precio: "",
    moneda: "$",
    imagenes: [],
    motor: "",
    transmision: "Manual",
    anio: "",
    combustible: "Nafta",
    kilometraje: "",
    descripcion: "", 
    color: "",
    reservado: false,
    etiqueta: "",
    tipo: "Automóvil"
  };

  const [formData, setFormData] = useState(initialForm);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEquipamientoChange = (e) => {
    const { name, checked } = e.target;
    setEquipamientoSeleccionado((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeSelectedFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  // NUEVA FUNCIÓN: Subir XLSX al Servidor
  const handleUploadGuia = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Verificación de extensión
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension !== 'xlsx' && extension !== 'xls' && extension !== 'csv') {
      alert("⚠️ Por favor, sube un archivo Excel (.xlsx o .xls)");
      return;
    }

    if (!window.confirm("¿Seguro que quieres reemplazar toda la base de precios con este archivo?")) {
      return;
    }

    setCargandoGuia(true);
    const formDataGuia = new FormData();
    formDataGuia.append("archivo", file);

    // Apuntamos a la nueva ruta del backend
    const destinoUrl = `${BASE_URL}/admin/upload-guia`;

    try {
      const res = await fetch(destinoUrl, {
        method: "POST",
        body: formDataGuia,
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ ¡Éxito! Se procesaron ${data.count} vehículos correctamente.`);
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setCargandoGuia(false);
      e.target.value = null; // Resetear input
    }
  };

  const uploadImagesToCloudinary = async (files) => {
    const uploadedUrls = [];
    const uploadPreset = "norte_autos";
    const cloudName = "det2xmstl";

    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", uploadPreset);
      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: data }
        );
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
      const descripcionConEmojis = equipamientoOpciones
        .filter((op) => equipamientoSeleccionado[op.id])
        .map((op) => `${op.emoji} ${op.label}`)
        .join("\n");

      let urlsFinales = formData.imagenes;
      if (selectedFiles.length > 0) {
        const nuevasUrls = await uploadImagesToCloudinary(selectedFiles);
        urlsFinales = editandoId
          ? [...formData.imagenes, ...nuevasUrls]
          : nuevasUrls;
      }

      const autoParaEnviar = {
        ...formData,
        descripcion: descripcionConEmojis,
        imagenes: urlsFinales,
        precio: formData.precio,
        anio: Math.round(Number(formData.anio)),
        kilometraje:formData.kilometraje,
      };

      const res = await fetch(
        editandoId ? `${API_URL}/${editandoId}` : API_URL,
        {
          method: editandoId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(autoParaEnviar),
        }
      );

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
    setEquipamientoSeleccionado({});
    setSelectedFiles([]);
    setPreviews([]);
  };

  const prepararEdicion = (auto) => {
    setEditandoId(auto.id);
    setFormData({ 
      ...auto, 
      imagenes: auto.imagenes || [],
      etiqueta: auto.etiqueta || "",
      tipo: auto.tipo || "Automóvil"
    });

    const nuevosChecks = {};
    equipamientoOpciones.forEach((op) => {
      if (auto.descripcion?.includes(op.label)) {
        nuevosChecks[op.id] = true;
      }
    });
    setEquipamientoSeleccionado(nuevosChecks);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este vehículo?")) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (res.ok) cargarAutos();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("adminAuth");
    navigate("/login");
  };

  const goHome = () => navigate("/");

  const autosFiltrados = autos.filter((auto) =>
    auto.nombre.toLowerCase().includes(filtroAdmin.toLowerCase())
  );

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <div>
          <h1>{editandoId ? "📝 Editando Auto" : "🚗 Panel de Carga"}</h1>
          <p>Norte Automotores</p>
        </div>
        <div className={styles.headerButtons}>
          <button onClick={goHome} className={styles.homeBtn}>Ir al Inicio</button>
          <button onClick={cerrarSesion} className={styles.logoutBtn}>Cerrar Sesión</button>
        </div>
      </header>

      {/* SECCIÓN: ACTUALIZACIÓN DE GUÍA DE PRECIOS (EXCEL) */}
      <section className={styles.acaraSection} style={{ backgroundColor: '#f0f9ff', padding: '25px', borderRadius: '10px', marginBottom: '30px', border: '2px solid #bae6fd' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
          <div style={{ backgroundColor: '#0284c7', padding: '10px', borderRadius: '12px' }}>
            <FileText color="white" size={24} />
          </div>
          <h3 style={{ margin: 0, fontSize: '20px', color: '#0369a1' }}>
            Actualizar Guía de Precios
          </h3>
        </div>
        
        <p style={{ color: '#0c4a6e', fontSize: '14px', marginBottom: '20px' }}>
          Sube tu archivo <strong>Excel (.xlsx)</strong> para actualizar los valores de tasación. 
          El sistema procesará automáticamente marcas, modelos y precios por año.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            onChange={handleUploadGuia} 
            disabled={cargandoGuia}
            style={{ display: 'none' }}
            id="excel-upload"
          />
          <label 
            htmlFor="excel-upload"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              backgroundColor: cargandoGuia ? '#94a3b8' : '#0284c7',
              color: 'white',
              borderRadius: '14px',
              cursor: cargandoGuia ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)',
              transition: 'all 0.2s active:scale-95'
            }}
          >
            {cargandoGuia ? (
              <>⏳ Procesando base de datos...</>
            ) : (
              <>📊 Seleccionar Archivo</>
            )}
          </label>
          
          {cargandoGuia && (
            <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: '500' }}>
              No cierres el navegador, esto puede demorar unos segundos...
            </span>
          )}
        </div>
      </section>

      <section className={styles.formSection}>
        <form onSubmit={handleSubmit} className={styles.form}>
          
          <div className={styles.formGroup}>
            <label>Tipo de Vehículo:</label>
            <div className={styles.tipoVehiculoGrid}>
              {["Automóvil", "Camioneta", "Motocicleta"].map((t) => (
                <label key={t} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="tipo"
                    value={t}
                    checked={formData.tipo === t}
                    onChange={handleChange}
                  />
                  <span>{t === "Automóvil" ? "🚗" : t === "Camioneta" ? "🛻" : "🏍️"} {t}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Marca y Modelo:</label>
            <input
              name="nombre"
              placeholder="Ej: VW Golf 2020"
              onChange={handleChange}
              value={formData.nombre}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Moneda:</label>
              <select name="moneda" onChange={handleChange} value={formData.moneda}>
                <option value="$">$ Pesos</option>
                <option value="U$S">U$S Dólares</option>
              </select>
            </div>
            <div className={styles.formGroup} style={{ flex: 2 }}>
              <label>Precio (0 para "Consultar"):</label>
              <input
                name="precio"
                type="number"
                onChange={handleChange}
                value={formData.precio}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Imágenes:</label>
            <label className={styles.fileLabel}>
              <span className={styles.uploadIcon}>📸</span>
              {selectedFiles.length > 0 ? `${selectedFiles.length} seleccionadas` : "Subir fotos"}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className={styles.hiddenFileInput}
              />
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
              <label>Color:</label>
              <input name="color" placeholder="Ej: Blanco" onChange={handleChange} value={formData.color} />
            </div>
            <div className={styles.formGroup}>
              <label>Año:</label>
              <input name="anio" placeholder="Ej: 2020" type="number" onChange={handleChange} value={formData.anio} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Motor:</label>
              <input name="motor" placeholder="Ej: 1.6 Turbo" onChange={handleChange} value={formData.motor} />
            </div>
            <div className={styles.formGroup}>
              <label>Transmisión:</label>
              <select name="transmision" onChange={handleChange} value={formData.transmision}>
                <option value="Manual">Manual</option>
                <option value="Automática">Automática</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Combustible:</label>
              <select name="combustible" onChange={handleChange} value={formData.combustible}>
                <option value="Nafta">Nafta</option>
                <option value="Diesel">Diesel</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Eléctrico">Eléctrico</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Kilometraje:</label>
              <input name="kilometraje" placeholder="Ej: 75000" type="number" onChange={handleChange} value={formData.kilometraje} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Promoción Especial / Etiqueta:</label>
            <select
              name="etiqueta"
              onChange={handleChange}
              value={formData.etiqueta || ""}
              style={{ 
                border: formData.etiqueta ? '2px solid #25D366' : '1px solid #ddd',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: formData.etiqueta ? '#f0fff4' : '#fff'
              }}
            >
              <option value="">Sin etiqueta (Venta Normal)</option>
              <option value="bonificado">💎 Unidad Bonificada</option>
              <option value="tasa_cero">🔥 Tasa 0% Interés</option>
              <option value="oportunidad">⚡ Oportunidad / Liquidación</option>
            </select>
          </div>

          {/* SECCIÓN DE EQUIPAMIENTO AGRUPADO */}
          <div className={styles.formGroup}>
            <label className={styles.mainLabel}>Equipamiento destacado:</label>
            <div className={styles.equipamientoContainer}>
              {["Seguridad", "Confort", "Tecnología", "Exterior"].map((cat) => (
                <div key={cat} className={styles.categoriaBlock}>
                  <h4 className={styles.categoriaTitulo}>
                    {cat === "Seguridad" && "🛡️ "}
                    {cat === "Confort" && "🌡️ "}
                    {cat === "Tecnología" && "📱 "}
                    {cat === "Exterior" && "🚘 "}
                    {cat}
                  </h4>
                  <div className={styles.equipamientoGrid}>
                    {equipamientoOpciones
                      .filter((op) => op.categoria === cat)
                      .map((op) => (
                        <label key={op.id} className={styles.equipamientoItem}>
                          <input
                            type="checkbox"
                            name={op.id}
                            checked={!!equipamientoSeleccionado[op.id]}
                            onChange={handleEquipamientoChange}
                          />
                          <span className={styles.checkboxCustom}>
                            {op.emoji} {op.label}
                          </span>
                        </label>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="reservado" onChange={handleChange} checked={formData.reservado} />
            Marcar como RESERVADO
          </label>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitBtn} disabled={cargando}>
              {cargando ? "⏳ Subiendo..." : editandoId ? "💾 Guardar Cambios" : "🚀 Publicar"}
            </button>
            {editandoId && (
              <button type="button" onClick={limpiarFormulario} className={styles.cancelBtn}>Cancelar</button>
            )}
          </div>
        </form>
      </section>

      <section className={styles.listSection}>
        <div className={styles.listHeader}>
          <h3>Inventario ({autos.length} unidades)</h3>
          <input
            type="text"
            placeholder="🔍 Buscar..."
            className={styles.searchAdminInput}
            onChange={(e) => setFiltroAdmin(e.target.value)}
          />
        </div>
        <div className={styles.listaBorrar}>
          {autosFiltrados.map((auto) => (
            <div key={auto.id} className={styles.itemBorrar}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{auto.nombre}</span>
                <span className={styles.itemDetails}>
                   {auto.tipo ? `[${auto.tipo}] ` : ''} Visitas: {auto.visitas || 0} | {auto.etiqueta ? `🏷️ ${auto.etiqueta}` : 'Normal'}
                </span>
              </div>
              <div className={styles.acciones}>
                <button onClick={() => prepararEdicion(auto)} className={styles.editBtn}>Editar</button>
                <button onClick={() => handleDelete(auto.id)} className={styles.deleteBtn}>Borrar</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <AdminBanners />
    </div>
  );
}

export default Admin;