import React, { useState } from 'react';
import './App.css';
import { createPoblation, CONFIG, ejecutarAlgoritmoGenetico } from './configuracion_inicial';

/*
 * App
 
 * Salida: interfaz de usuario renderizada
 * Descripción: Componente principal que maneja la interfaz del algoritmo genético.
 *              Controla los estados de configuración, población, ejecución y resultados.
 */
function App() {
  const [limite, setLimite] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState('');
  const [poblacionInicial, setPoblacionInicial] = useState([]);
  const [ejecutando, setEjecutando] = useState(false);
  const [resultado, setResultado] = useState(null);

  /*
   * handleLimiteChange
   * Salida: actualización del estado limite
   * Descripción: Valida y actualiza el valor del límite ingresado por el usuario.
   */
  const handleLimiteChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[1-9]\d*$/.test(value)) {
      setLimite(value);
      setError('');
    }
  };

  /*
   * handleSubmit
   * Salida: población inicial generada
   * Descripción: Valida el límite ingresado y genera la población inicial.
   */
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

  /*
   * handleReset
   * Salida: reseteo de todos los estados
   * Descripción: Reinicia la aplicación a su estado inicial.
   */
  const handleReset = () => {
    setLimite('');
    setIsConfigured(false);
    setError('');
    setPoblacionInicial([]);
    setResultado(null);
    setEjecutando(false);
  };

  /*
   * handleRegenerarPoblacion
   * Salida: nueva población generada
   * Descripción: Genera una nueva población inicial con el límite actual.
   */
  const handleRegenerarPoblacion = () => {
    const nuevaPoblacion = createPoblation(parseInt(limite));
    setPoblacionInicial(nuevaPoblacion);
    setResultado(null);
  };

  /*
   * handleEjecutarAlgoritmo
   * Salida: resultado del algoritmo genético
   * Descripción: Ejecuta el algoritmo genético con la población actual y muestra resultados.
   */
  const handleEjecutarAlgoritmo = () => {
    setEjecutando(true);
    setResultado(null);
    
    setTimeout(() => {
      const resultadoAG = ejecutarAlgoritmoGenetico(poblacionInicial, parseInt(limite));
      setResultado(resultadoAG);
      setEjecutando(false);
    }, 500);
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
              <h3>Configuración Inicial</h3>
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
                    {error}
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
                <h3>Configuración Establecida</h3>
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
                          {esValido ? 'Válido' : 'Excede límite'}
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
                  <span className="stat-label">Total individuos:</span>
                  <span className="stat-value">{poblacionInicial.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Individuos válidos:</span>
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

              <button onClick={handleRegenerarPoblacion} className="btn btn-regenerar" disabled={ejecutando}>
                Regenerar Población
              </button>
            </div>

            {!resultado && (
              <div className="card">
                <h3>Ejecutar Algoritmo Genético</h3>
                <p className="description">
                  El algoritmo evolucionará durante <strong>{CONFIG.NUM_GENERACIONES}</strong> generaciones
                  para encontrar el mejor subconjunto.
                </p>
                <button 
                  onClick={handleEjecutarAlgoritmo} 
                  className="btn btn-primary"
                  disabled={ejecutando}
                >
                  {ejecutando ? 'Ejecutando...' : 'Iniciar Evolución'}
                </button>
              </div>
            )}

            {/* Visualización del Resultado */}
            {resultado && (
              <>
                <div className="card resultado-final">
                  <h3>Mejor Solución Encontrada</h3>
                  
                  <div className="solucion-container">
                    <div className="solucion-info">
                      <div className="info-row">
                        <span className="info-label">Fitness (Suma Máxima):</span>
                        <span className="info-valor fitness">{resultado.mejorSolucion.fitness}</span>
                      </div>
                      
                      <div className="info-row">
                        <span className="info-label">Generación Encontrada:</span>
                        <span className="info-valor generacion">
                          Generación #{resultado.mejorSolucion.generacion}
                        </span>
                      </div>
                      
                      <div className="info-row">
                        <span className="info-label">Límite (L):</span>
                        <span className="info-valor">{limite}</span>
                      </div>
                    </div>

                    <div className="mejor-conjunto">
                      <h4>Subconjunto Óptimo:</h4>
                      <div className="numeros-solucion">
                        {resultado.mejorSolucion.individuo.map((num, idx) => (
                          <span key={idx} className="numero-solucion">
                            {num}
                          </span>
                        ))}
                      </div>
                      
                      <div className="formula">
                        {resultado.mejorSolucion.individuo.join(' + ')} = {resultado.mejorSolucion.suma}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3>Evolución por Generación</h3>
                  <p className="description">
                    Progreso del algoritmo a través de {CONFIG.NUM_GENERACIONES} generaciones.
                    La mejor solución global se destaca.
                  </p>

                  <div className="historial-container">
                    {resultado.historial.map((gen, idx) => (
                      <div 
                        key={idx} 
                        className={`generacion-item ${gen.esMejorGlobal ? 'mejor-global' : ''}`}
                      >
                        <div className="gen-numero">
                          <span>Generación #{gen.numero}</span>
                          {gen.esMejorGlobal && <span className="badge">Mejor Global</span>}
                        </div>
                        
                        <div className="gen-info">
                          <div className="gen-conjunto">
                            Conjunto: [{gen.mejorIndividuo.join(', ')}]
                          </div>
                          
                          <div className="gen-fitness">
                            Suma: <strong>{gen.suma}</strong> | Fitness: <strong>{gen.fitness}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={handleReset} className="btn btn-primary">
                  Nueva Ejecución
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;