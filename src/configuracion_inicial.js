

const TAMANO_POBLACION = 10;
const NUM_GENERACIONES = 25;
const PROBABILIDAD_MUTACION = 0.3;
const ELITE_SIZE = 2;


function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
 * shuffle
 * Entrada: array 
 * Salida: nuevo arreglo con elementos en orden aleatorio
 * Descripción: Baraja los elementos del arreglo usando el algoritmo Fisher-Yates
 */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/*
 * createSet
 * Entrada: limite 
 * Salida: arreglo de números enteros
 * Descripción: Crea un individuo (subconjunto) con cantidad aleatoria de elementos.
 *              Cada elemento es un número aleatorio entre 1 y limite/2.
 */
function createSet(limite) {
  let set = [];
  let nElements = random(1, Math.floor(limite / 5));
  let cont = 0; // Variable contador inicializada

  while (cont < nElements){
    let num = random(1, Math.floor(limite / 2));
    cont += 1;
    set.push(num);
  }
  return set;
}

/*
 * createPoblation
 * Entrada: limite
 * Salida: arreglo de individuos (población inicial)
 * Descripción: Genera la población inicial con TAMANO_POBLACION individuos.
 *              Cada individuo es creado mediante createSet.
 */
export function createPoblation(limite) {
  let poblationSet = [];
  for (let i = 0; i < TAMANO_POBLACION; i++) {
    let set = createSet(limite);
    poblationSet.push(set);
  }
  return poblationSet;
}


// FUNCIÓN FITNESS


/*
 * evaluateSet
 * Entrada: individuo (arreglo de números), limite (número entero)
 * Salida: valor numérico de aptitud (fitness)
 * Descripción: Calcula el fitness del individuo como la suma de sus elementos.
 *              Si la suma excede el límite, retorna 0 (solución inválida).
 *              Si no excede, retorna la suma (mayor es mejor).
 */
export function evaluateSet(individuo, limite) {
  let suma = 0;
  for (let i = 0; i < individuo.length; i++) {
    suma += individuo[i];
  }

  if (suma > limite) {
    return 0;
  }

  return suma;
}

/*
 * evaluarPoblacion
 * Entrada: poblacion (arreglo de individuos), limite (número entero)
 * Salida: arreglo de objetos con individuo, fitness y suma
 * Descripción: Evalúa todos los individuos de la población y retorna
 *              un arreglo con la información de aptitud de cada uno.
 */
function evaluarPoblacion(poblacion, limite) {
  return poblacion.map(individuo => ({
    individuo: individuo,
    fitness: evaluateSet(individuo, limite),
    suma: individuo.reduce((acc, num) => acc + num, 0)
  }));
}

// SELECCIÓN


/*
 * seleccionPorTorneo
 * Entrada: poblacionEvaluada (arreglo de objetos con individuo y fitness),
 *          tamanoTorneo (número entero, por defecto 3)
 * Salida: individuo seleccionado (copia del arreglo)
 * Descripción: Implementa selección por torneo. Selecciona aleatoriamente
 *              tamanoTorneo individuos y retorna el de mayor fitness.
 */
function seleccionPorTorneo(poblacionEvaluada, tamanoTorneo = 3) {
  let competidores = [];
  
  for (let i = 0; i < tamanoTorneo; i++) {
    const indiceAleatorio = random(0, poblacionEvaluada.length - 1);
    competidores.push(poblacionEvaluada[indiceAleatorio]);
  }

  let mejor = competidores[0];
  for (let i = 1; i < competidores.length; i++) {
    if (competidores[i].fitness > mejor.fitness) {
      mejor = competidores[i];
    }
  }

  return [...mejor.individuo];
}

// ============================================================================
// CRUCE (CROSSOVER)
// ============================================================================

/*
 * cruce
 * Entrada: padre1 (arreglo de números), padre2 (arreglo de números)
 * Salida: hijo (arreglo de números)
 * Descripción: Combina dos padres para crear un hijo. Combina los elementos
 *              de ambos padres, elimina duplicados, baraja aleatoriamente
 *              y selecciona entre 30% y 70% de los elementos resultantes.
 */
function cruce(padre1, padre2) {
  let hijo = [];
  
  let combinado = [...padre1, ...padre2];
  
  combinado = [...new Set(combinado)];
  
  combinado = shuffle(combinado);
  
  const minElementos = Math.max(1, Math.floor(combinado.length * 0.3));
  const maxElementos = Math.max(minElementos, Math.floor(combinado.length * 0.7));
  const numElementos = random(minElementos, maxElementos);
  
  hijo = combinado.slice(0, numElementos);
  
  return hijo;
}


// MUTACIÓN

/*
 * mutacion
 * Entrada: individuo (arreglo de números), limite (número entero)
 * Salida: individuo mutado (arreglo de números)
 * Descripción: Aplica una mutación aleatoria al individuo. Existen tres tipos:
 *              1. Agregar un número aleatorio al subconjunto
 *              2. Eliminar un número aleatorio del subconjunto
 *              3. Modificar un número existente por otro aleatorio
 */
function mutacion(individuo, limite) {
  let mutado = [...individuo];
  
  if (mutado.length === 0) {
    mutado.push(random(1, Math.floor(limite / 2)));
    return mutado;
  }
  
  const tipoMutacion = random(1, 3);
  
  switch (tipoMutacion) {
    case 1:
      mutado.push(random(1, Math.floor(limite / 2)));
      break;
      
    case 2:
      if (mutado.length > 1) {
        const indiceEliminar = random(0, mutado.length - 1);
        mutado.splice(indiceEliminar, 1);
      }
      break;
      
    case 3:
      const indiceModificar = random(0, mutado.length - 1);
      mutado[indiceModificar] = random(1, Math.floor(limite / 2));
      break;
  }
  
  return mutado;
}


// ALGORITMO GENÉTICO PRINCIPAL

/*
 * ejecutarAlgoritmoGenetico
 * Entrada: poblacionInicial (arreglo de individuos), limite (número entero)
 * Salida: objeto con mejorSolucion y historial de generaciones
 * Descripción: Ejecuta el algoritmo genético completo durante NUM_GENERACIONES.
 *              En cada generación: evalúa población, selecciona mejor, actualiza
 *              mejor global, aplica elitismo, selección, cruce y mutación.
 *              Retorna la mejor solución encontrada y el historial completo.
 */
export function ejecutarAlgoritmoGenetico(poblacionInicial, limite) {
  let poblacionActual = poblacionInicial.map(ind => [...ind]);
  let mejorGlobal = null;
  let historialGeneraciones = [];
  
  for (let generacion = 0; generacion < NUM_GENERACIONES; generacion++) {
    const poblacionEvaluada = evaluarPoblacion(poblacionActual, limite);
    
    let mejorGeneracion = poblacionEvaluada[0];
    for (let i = 1; i < poblacionEvaluada.length; i++) {
      if (poblacionEvaluada[i].fitness > mejorGeneracion.fitness) {
        mejorGeneracion = poblacionEvaluada[i];
      }
    }
    
    if (mejorGlobal === null || mejorGeneracion.fitness > mejorGlobal.fitness) {
      mejorGlobal = {
        individuo: [...mejorGeneracion.individuo],
        fitness: mejorGeneracion.fitness,
        suma: mejorGeneracion.suma,
        generacion: generacion
      };
    }
    
    historialGeneraciones.push({
      numero: generacion,
      mejorIndividuo: [...mejorGeneracion.individuo],
      fitness: mejorGeneracion.fitness,
      suma: mejorGeneracion.suma,
      esMejorGlobal: mejorGeneracion.fitness === mejorGlobal.fitness && generacion === mejorGlobal.generacion
    });
    
    if (generacion < NUM_GENERACIONES - 1) {
      let nuevaPoblacion = [];
      
      // Elitismo: preservar los mejores individuos
      const poblacionOrdenada = [...poblacionEvaluada].sort((a, b) => b.fitness - a.fitness);
      for (let i = 0; i < ELITE_SIZE && i < poblacionOrdenada.length; i++) {
        nuevaPoblacion.push([...poblacionOrdenada[i].individuo]);
      }
      
      // Generar nuevos individuos mediante selección, cruce y mutación
      while (nuevaPoblacion.length < TAMANO_POBLACION) {
        const padre1 = seleccionPorTorneo(poblacionEvaluada);
        const padre2 = seleccionPorTorneo(poblacionEvaluada);
        
        let hijo = cruce(padre1, padre2);
        
        if (Math.random() < PROBABILIDAD_MUTACION) {
          hijo = mutacion(hijo, limite);
        }
        
        nuevaPoblacion.push(hijo);
      }
      
      poblacionActual = nuevaPoblacion;
    }
  }
  
  return {
    mejorSolucion: mejorGlobal,
    historial: historialGeneraciones
  };
}



export const CONFIG = {
  TAMANO_POBLACION,
  NUM_GENERACIONES,
  PROBABILIDAD_MUTACION,
  ELITE_SIZE
};