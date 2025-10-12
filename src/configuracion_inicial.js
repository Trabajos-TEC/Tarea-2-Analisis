// Configuración del Algoritmo Genético
const TAMANO_POBLACION = 10;
const NUM_GENERACIONES = 25;

// Función auxiliar para generar números aleatorios
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Crear un individuo (conjunto de números) basado en el límite
function createSet(limite){
    let set = [];
    let cont = 0;
    let nElements = random(1, Math.floor(limite / 5));

    while (cont < nElements){
        let num = random(1, Math.floor(limite / 2));
        cont += 1;
        set.push(num);
    }
    return set;
}

// Crear población inicial
export function createPoblation(limite){
    let poblationSet = [];
    for (let i = 0; i < TAMANO_POBLACION; i++){
        let set = createSet(limite);
        poblationSet.push(set);
    }
    return poblationSet;
}

// Evaluar un conjunto (devuelve la suma si no excede el límite, 0 si lo excede)
function evaluateSet(set, limite){
    let res = 0;
    for (let i = 0; i < set.length; i++){
        res += set[i];
    }

    if (res > limite){
        return 0;
    }

    return res;
}

// Exportar constantes para uso en otros componentes
export const CONFIG = {
    TAMANO_POBLACION,
    NUM_GENERACIONES
};

//Funcion de adaptabilidad, eliminamos los conjuntos de poblaciones no aptos( aquellos que la suma de sus elementos es mayor al limite)
function fitnessFunction(poblationSet){
    let set = []
    for (let i = 0; i < poblationSet.length; i++){
        if (evaluateSet(poblationSet[i]) == 0){
            set.push(poblationSet[i])
        }
    }
    return set;
}


function cruce(poblationSet){
    let cruceSet = [];
    let cont = 0
    let temp = [];
    for (let i = 0; i < poblationSet.length; i++){
        temp.push(poblationSet[i])
        cont += 1
        if (cont == 2){
            cruceSet.push(temp);
            cont = 0
            temp = []
        }
    }
    if (cont > 0){
        cruceSet.push(temp);
    }
    console.log(cruceSet)
    for (let i = 0; i < cruceSet.length; i++){
        if (cruceSet.length >= 2){
            //La idea es hacer por cada par de conjuntos algun tipo de modificacion ya sea agregar las posiciones pares del conjunto B al conjunto A
            //  o algun otro tipo de cruce q se ocurra.
        }
    }

}