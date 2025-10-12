const Limit = 50;
const poblacion = 10;
const generaciones = 25;
const mutationRate = 0.1;
let generacionActual = 0;
let conjunto = [];

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function evaluateSet(set){
    let res = 0;
    for (let i = 0; i < set.length; i++){
        res += set[i];
        if (res > Limit){
            return -1
        }
    }
    return 0;
}

function createSet(){
    let set = [];
    let cont = 0
    let nElements = random(1,(Limit/5))
    while (cont < nElements){
        let num = random(1,Limit/2);
        cont += 1;
        set.push(num);
    }
    return set
}

function createPoblation(){
    let poblationSet = []
    for (let i = 0; i < poblacion; i++){
        let set = createSet();
        poblationSet.push(set);
    }
    return poblationSet;
}



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

poblacionInicialSet = fitnessFunction(createPoblation());
generacionActual = 1;

console.log(poblacionInicialSet);

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




// Exportar constantes para uso en otros componentes
export const CONFIG = {
    poblacion,
    generaciones
};

