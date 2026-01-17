import React, { useState, useEffect } from "react";
import { Trash2, Upload, Loader2 } from "lucide-react";
import styles from "./AdminBanners.module.css";

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const res = await fetch(
      "https://norte-production.up.railway.app/api/banners"
    );
    const data = await res.json();
    setBanners(data);
  };

  const handleSubirImagen = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubiendo(true);

    const formData = new FormData();
    formData.append("file", file);
    // 1. REEMPLAZA CON EL NOMBRE QUE PUSISTE EN EL PASO 5
    formData.append("upload_preset", "norte_banners");

    try {
      // 2. REEMPLAZA 'tu_cloud_name' CON EL NOMBRE DE TU DASHBOARD
      const resClou = await fetch(
        "https://api.cloudinary.com/v1_1/det2xmstl/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const dataClou = await resClou.json();

      if (dataClou.secure_url) {
        // 3. Enviamos el link que nos dio Cloudinary a tu base de datos en Railway
        await fetch("https://norte-production.up.railway.app/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imagen_url: dataClou.secure_url,
            titulo: file.name,
          }),
        });
        fetchBanners();
      } else {
        console.error("Error Cloudinary:", dataClou.error?.message);
        alert("Error de configuración: " + dataClou.error?.message);
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setSubiendo(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar banner?")) return;
    await fetch(`https://norte-production.up.railway.app/api/banners/${id}`, {
      method: "DELETE",
    });
    fetchBanners();
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.headerAdmin}>
        <h3>Banners Publicitarios</h3>
        <label className={styles.uploadBtn}>
          {subiendo ? (
            <Loader2 className={styles.spin} />
          ) : (
            <Upload size={20} />
          )}
          {subiendo ? "Subiendo..." : "Cargar"}
          <input
            type="file"
            accept="image/*"
            onChange={handleSubirImagen}
            hidden
            disabled={subiendo}
          />
        </label>
      </div>

      <div className={styles.grid}>
        {banners.map((banner) => (
          <div key={banner.id} className={styles.card}>
            <img src={banner.imagen_url} alt="Promo" />
            <button onClick={() => handleEliminar(banner.id)}>
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBanners;
