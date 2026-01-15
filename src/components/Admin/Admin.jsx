import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- AGREGADO
import styles from './Admin.module.css';

function Admin() {
  const navigate = useNavigate(); // <--- AGREGADO
  const [autos, setAutos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [filtroAdmin, setFiltroAdmin] = useState("");
  
  const initialForm = {
    nombre: '', 
    precio: '', 
    moneda: 'U$S', 
    imagenes: '', 
    motor: '',
    transmision: 'Manual', 
    anio: '', 
    combustible: 'Nafta',
    kilometraje: '', 
    descripcion: '', 
    reservado: false
  };

  const [formData, setFormData] = useState(initialForm);

  // --- NUEVA LÓGICA DE LOGIN (Sin modificar lo anterior) ---
  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth !== 'true') {
      navigate('/login'); // Expulsa si no está logueado
    } else {
      cargarAutos(); // Solo carga si hay permiso
    }
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem('adminAuth');
    navigate('/login');
  };
  // ---------------------------------------------------------

  const cargarAutos = async () => {
    try {
      const res = await fetch('https://norte-production.up.railway.app/api/autos');
      const data = await res.json();
      setAutos(data);
    } catch (err) {
      console.error("Error al obtener autos:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const prepararEdicion = (auto) => {
    setEditandoId(auto.id);
    setFormData({
      ...auto,
      imagenes: auto.imagenes.join(', '), 
      anio: auto.anio || '',
      kilometraje: auto.kilometraje || '',
      precio: auto.precio || '',
      moneda: auto.moneda || 'U$S',
      combustible: auto.combustible || 'Nafta'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imagenesArray = formData.imagenes.split(',').map(img => img.trim());
    const autoParaEnviar = {
      ...formData,
      imagenes: imagenesArray,
      precio: parseInt(formData.precio) || 0,
      anio: parseInt(formData.anio) || 0,
      kilometraje: parseInt(formData.kilometraje) || 0
    };

    try {
      const url = editandoId 
        ? `https://norte-production.up.railway.app/api/autos/${editandoId}` 
        : 'https://norte-production.up.railway.app/api/autos';
      
      const method = editandoId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(autoParaEnviar)
      });

      if (response.ok) {
        alert(editandoId ? "✅ Vehículo actualizado con éxito" : "✅ Vehículo publicado con éxito");
        setFormData(initialForm);
        setEditandoId(null);
        cargarAutos();
      }
    } catch (err) {
      console.error(err);
      alert("❌ Hubo un error al procesar la solicitud");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este vehículo?")) {
      try {
        const res = await fetch(`https://norte-production.up.railway.app/api/autos/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          cargarAutos();
        }
      } catch (err) {
        console.error("Error al borrar:", err);
      }
    }
  };

  const autosFiltrados = autos.filter(auto => 
    auto.nombre.toLowerCase().includes(filtroAdmin.toLowerCase())
  );

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <div>
          <h1>{editandoId ? '📝 Editando Vehículo' : '🚗 Panel de Carga'}</h1>
          <p>Control de stock - Norte Automotores</p>
        </div>
        {/* BOTÓN DE CERRAR SESIÓN AGREGADO */}
        <button onClick={cerrarSesion} className={styles.logoutBtn}>
          Cerrar Sesión
        </button>
      </header>
      
      <section className={styles.formSection}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input 
            name="nombre" 
            placeholder="Marca y modelo (Ej: VW Golf Trendline)" 
            onChange={handleChange} 
            value={formData.nombre} 
            required 
          />
          
          <div className={styles.row}>
            <select name="moneda" onChange={handleChange} value={formData.moneda} className={styles.selectInput}>
              <option value="U$S">U$S (Dólares)</option>
              <option value="$">$ (Pesos)</option>
            </select>
            <input name="precio" type="number" placeholder="Precio (Ej: 23.000)" onChange={handleChange} value={formData.precio} required />
          </div>

          <input name="imagenes" placeholder="Links de fotos (comas)" onChange={handleChange} value={formData.imagenes} required />
          
          <div className={styles.row}>
            <input name="motor" placeholder="Motor (Ej: 1.6 TDI)" onChange={handleChange} value={formData.motor} />
            <select name="combustible" onChange={handleChange} value={formData.combustible} className={styles.selectInput}>
              <option value="Nafta">Nafta</option>
              <option value="Diesel">Diesel</option>
              <option value="Eléctrico">Eléctrico</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>

          <div className={styles.row}>
            <input name="anio" placeholder="Año (Ej: 2020)" type="number" onChange={handleChange} value={formData.anio} />
            <input name="kilometraje" placeholder="Kilometraje (Ej: 45.000)" type="number" onChange={handleChange} value={formData.kilometraje} />
          </div>

          <textarea name="descripcion" placeholder="Descripción detallada (Ej: Asientos de cuero, pantalla multimedia, lavafaros)" onChange={handleChange} value={formData.descripcion} />

          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="reservado" onChange={handleChange} checked={formData.reservado} />
            Marcar como RESERVADO
          </label>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitBtn}>
              {editandoId ? 'Guardar Cambios' : 'Publicar Vehículo'}
            </button>
            {editandoId && (
              <button type="button" onClick={() => { setEditandoId(null); setFormData(initialForm); }} className={styles.cancelBtn}>
                Cancelar Edición
              </button>
            )}
          </div>
        </form>
      </section>

      <hr className={styles.divider} />

      <section className={styles.listSection}>
        <div className={styles.listHeader}>
          <h3>Inventario ({autos.length})</h3>
          <input 
            type="text" 
            placeholder="🔍 Buscar unidad..." 
            className={styles.searchAdminInput}
            onChange={(e) => setFiltroAdmin(e.target.value)}
            value={filtroAdmin}
          />
        </div>

        <div className={styles.listaBorrar}>
          {autosFiltrados.map(auto => (
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
          ))}
        </div>
      </section>
    </div>
  );
}

export default Admin;