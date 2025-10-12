import React, { useState } from 'react';
import './App.css';
import { createPoblation, CONFIG } from './configuracion_inicial';

function App() {
  const [limite, setLimite] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState('');
  const [poblacionInicial, setPoblacionInicial] = useState([]);

  const handleLimiteChange = (e) => {
    const value = e.target.value;
    // Solo permitir números positivos
    if (value === '' || /^[1-9]\d*$/.test(value)) {
      setLimite(value);
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (limite === '') {
      setError('Por favor, ingrese un valor límite');
      return;
    }
    const limiteNum = parseInt(limite);
    if (limiteNum < 10) {
      setError('El límite debe ser mayor o igual a 10');
      return;
    }
    
    
    const nuevaPoblacion = createPoblation(parseInt(limite));
    setPoblacionInicial(nuevaPoblacion);
    setIsConfigured(true);
    setError('');
  };

  const handleReset = () => {
    setLimite('');
    setIsConfigured(false);
    setError('');
    setPoblacionInicial([]);
  };

  const handleRegenerarPoblacion = () => {
    const nuevaPoblacion = createPoblation(parseInt(limite));
    setPoblacionInicial(nuevaPoblacion);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>Resolución de un Problema de Optimización usando Algoritmos Genéticos</h1>
        </header>

        {!isConfigured ? (
          <div className="config-section">
            <div className="card">
              <h3> Configuración Inicial</h3>
              <p className="description">
                Ingrese el valor límite <strong>L</strong> para la suma máxima del subconjunto.
              </p>
              
              <form onSubmit={handleSubmit} className="form">
                <div className="input-group">
                  <label htmlFor="limite">
                    Valor Límite (L):
                  </label>
                  <input
                    type="text"
                    id="limite"
                    value={limite}
                    onChange={handleLimiteChange}
                    placeholder="Ejemplo: 100"
                    className="input-field"
                    autoFocus
                  />
                  <small className="input-hint">
                    Ingrese un número entero positivo (mínimo 10)
                  </small>
                </div>

                {error && (
                  <div className="error-message">
                    ⚠️ {error}
                  </div>
                )}

                <button type="submit" className="btn btn-primary">
                   Iniciar Algoritmo
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="result-section">
            <div className="card">
              <div className="config-display">
                <h3> Configuración Establecida</h3>
                <div className="config-item">
                  <span className="config-label">Límite (L):</span>
                  <span className="config-value">{limite}</span>
                </div>
                <button onClick={handleReset} className="btn btn-secondary">
                   Cambiar Configuración
                </button>
              </div>
            </div>

            {/* Visualización de la Población Inicial */}
            <div className="card">
              <h3>Población Inicial</h3>
              <p className="description">
                Se ha generado una población de <strong>{CONFIG.TAMANO_POBLACION}</strong> individuos (subconjuntos).
              </p>

              <div className="poblacion-container">
                {poblacionInicial.map((individuo, index) => {
                  const suma = individuo.reduce((acc, num) => acc + num, 0);
                  const esValido = suma <= parseInt(limite);
                  
                  return (
                    <div key={index} className={`individuo-card ${esValido ? 'valido' : 'invalido'}`}>
                      <div className="individuo-header">
                        <span className="individuo-numero">Individuo #{index + 1}</span>
                        <span className={`individuo-badge ${esValido ? 'badge-valido' : 'badge-invalido'}`}>
                          {esValido ? '✓ Válido' : '✗ Excede límite'}
                        </span>
                      </div>
                      
                      <div className="individuo-conjunto">
                        {individuo.map((num, idx) => (
                          <span key={idx} className="individuo-numero-item">
                            {num}
                          </span>
                        ))}
                      </div>
                      
                      <div className="individuo-info">
                        <div className="info-detalle">
                          <span className="label">Cantidad:</span>
                          <span className="valor">{individuo.length}</span>
                        </div>
                        <div className="info-detalle">
                          <span className="label">Suma:</span>
                          <span className={`valor ${esValido ? 'suma-valida' : 'suma-invalida'}`}>
                            {suma}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="estadisticas-poblacion">
                <div className="stat-item">
                  <span className="stat-label"> Total individuos:</span>
                  <span className="stat-value">{poblacionInicial.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label"> Individuos válidos:</span>
                  <span className="stat-value">
                    {poblacionInicial.filter(ind => 
                      ind.reduce((acc, num) => acc + num, 0) <= parseInt(limite)
                    ).length}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Límite (L):</span>
                  <span className="stat-value">{limite}</span>
                </div>
              </div>

              <button onClick={handleRegenerarPoblacion} className="btn btn-regenerar">
                Regenerar Población
              </button>
            </div>

            <div className="info-message">
               Próximo paso: Ejecutar Algoritmo Genético
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;