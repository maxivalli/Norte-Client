import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { Lock } from 'lucide-react';

function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Contraseña para entrar al panel
    const CLAVE_CORRECTA = "Norte2024"; 

    if (password === CLAVE_CORRECTA) {
      // Guardamos la sesión en el navegador (local)
      localStorage.setItem('adminAuth', 'true');
      // Vamos al panel
      navigate('/admin');
    } else {
      setError(true);
      setPassword(''); // Limpiamos el input si falla
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginCard} onSubmit={handleLogin}>
        <div className={styles.iconBox}>
          <Lock size={30} />
        </div>
        <h2>Panel Administrativo</h2>
        <p>Introduce la clave para gestionar el stock</p>
        
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          className={error ? styles.inputError : ''}
          required
        />
        
        {error && <p className={styles.errorText}>Clave incorrecta. Reintenta.</p>}
        
        <button type="submit" className={styles.loginBtn}>
          Ingresar al Panel
        </button>
      </form>
    </div>
  );
}

export default Login;