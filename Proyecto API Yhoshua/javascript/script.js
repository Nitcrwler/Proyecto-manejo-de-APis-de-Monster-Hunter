const MONSTER_HUNTER_API = "https://api.mh-api.com/v1/monsters";
const botonNombre = document.getElementById("btnBuscarMonstruoNombre");

const contenedorTarjetas = document.getElementById("tarjetasMonstruosContainer");

let listaMonsters = [];
let proyectoMonsterHunterJSON = null;

// Creacion de la clase Monster
class Monster{
    constructor(monster_id, nombreJP, elemento, otroNombre, categoria, titulo, ranking, imagen, musica){
        this.monster_id = monster_id;
        this.nombreJP = nombreJP;
        this.elemento = elemento;
        this.otroNombre = otroNombre;
        this.categoria = categoria;
        this.titulo = titulo;
        this.ranking = ranking;
        this.imagen = imagen;
        this.musica = musica;
    }
}

// () => No cumplido        ( X ) => Tarea/TODO Cumplida
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// TODO: Falta revisar si estan todos los tipos de funciones: Normales()    Anonimas()  Tipo Flecha()
// TODO: Falta poner botones para demostrar errores ()





// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Funciones
async function BuscarMonstruoNombre(){
    // De donde se saca el la información del nombre
    let nombre = document.getElementById("nombreMonstruoBusqueda").value.trim();
    // Asigna el contenedor donde se van a mostrar las tarjetas de los nombres que coincidan
    let contenedor = document.getElementById("tarjetasMonstruosContainer")

    // Comprobación de que el campo de nombre no este vacío
    if(!nombre){
        // Mensaje de alerta, no se ha ingresado el nombre
        alert("Por favor ingrese un nombre");
        return;
    }
    try{
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // AÑADIR EL JSON CON LOS NOMBRES Y COMPARACIÓN CON EL DATO INGRESADO POR EL USUARIO
        // Creacion de array para guardar los nombres que coincidan con el nombre o letras ingresadas por el usuario
        let nombresMonstruos = [];
        await fetch("./JSON/mh_monsters_NombresCompletos.json") // Se agrega el json con los nombres en ingles, japones y el id del monstruo
            .then(response => response.json())
            .then(datos => {
                nombresMonstruos = datos.monsters;
                console.log("JSON con los nombres y el id")
                console.log(nombresMonstruos);  // Solo es para comprobar que si se agregaron los registros al arreglo
            })
            .catch(error => {
                console.error("Error al cargar el JSON: ",error);
            });

        let coincidenciasNombresMonstruos = []; // Arreglo para guardar los nombres que coincidan con lo ingresado por el usuario
        let n = 0;  // Contador para mover el indice de las coincidencias de nombres
        nombresMonstruos.forEach(element => {
            // Se seleccionan solo los monstruos cuyo nombre contenga el nombre(o letras) ingresado
            if(element.english_name.toLowerCase().includes(nombre.toLowerCase())){
                // Se guarda la coincidencia dentro del arreglo 
                coincidenciasNombresMonstruos[n] = element;
                n++;    // Se mueve el indice en 1
            }
        });
        console.log("Coincidencia de nombres"); // Comprobacion de las concidencias
        console.log(coincidenciasNombresMonstruos); 
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *





        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // Se hace la conexion con la API 
        // TODO: HACE FALTA METER EL JSON CON LOS NOMBRES EN INGLÉS DE LOS MONSTRUOS ( X )
        const apiMH = await fetch(MONSTER_HUNTER_API);

        // En caso de que ocurra un error con el acceso a la API
        if(!apiMH.ok){
            throw new Error(`Error HTTP: ${apiMH.status}`);
        }
        const registros = await apiMH.json();   // Se convierte a json los registros que se enviaron desde la API
        listaMonsters = registros.monsters.map(añadirMonstruo);  // Pasa por cada registro y lo guarda en un arreglo para que despues pueda ser usado para mostrar en tarjetas 
        console.log(registros);
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        
        
        
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        console.log("Lista Monstruos");
        console.log(listaMonsters);
        
        n = 0;
        let infoMonstruoCompleta = []; 
        listaMonsters.forEach(monstruos => {
            coincidenciasNombresMonstruos.forEach(nombresIngles => {
                if(nombresIngles.monster_id === monstruos.monster_id){
                    infoMonstruoCompleta[n] = {
                        ...monstruos,   // Se crea una copia de listaMonsters
                        english_name: nombresIngles.english_name // Se le añade una propiedad english_name y se le asigna el de coincidencias
                    };
                    n++; // Se mueve en 1 el indice
                }
            });
        });
        console.log("infoMonstruoCompleta");
        console.log(infoMonstruoCompleta);

        // Comparar con for each cada indice de las coincidencias, hacerlo con monster id para sacar lainformacion del arreglo de la api
        // y despues crear las tarjetas
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *








    }
    catch(error){
        alert(`Ha ocurrido un error, ${error.message}`)
    }
}


function añadirMonstruo(registro){
    return new Monster(registro.monster_id, registro.name, registro.element, registro.another_name, registro.category, registro.title, registro.ranking, registro.image_url, registro.bgm);
}



 

function CrearTarjetas(arreglo){    
    // Contenedor de la tarjeta del monstruo
    let contenedorTarjetaMonstruo = document.createElement("div");
    contenedorTarjetaMonstruo.className = "tarjetaMonstruo-container";

    // Contenedor de la imagen del monstruo
    let contenedorImagenMonstruo = document.createElement("img")
    contenedorImagenMonstruo.className = "imagenMonstruo-container";

    // Contenedor de la información del monstruo
    let contenedorInfoMonstruo = document.createElement("div");
    contenedorInfoMonstruo.className = "infoMonstruo-container";

    // Nombre en inglés del monstruo
    let nombreEnglishMonstruo = document.createElement("p");
    nombreEnglishMonstruo.className = "nombreEnglish";

    // Nombre en japones 
    let nombreJapaneseMonstruo = document.createElement("p");
    nombreJapaneseMonstruo.className = "nombreJapanese";

    // Categoria del monstruo       TODO: Falta pasar el nombre a español   ()
    let categoriaMonstruo = document.createElement("p");
    categoriaMonstruo.className = "categoriaMosntruo";

    // Elemento principal del monstruo      TODO: Falta pasar el elemento a español ()
    let elementoMonstruo = document.createElement("p");
    elementoMonstruo.className = "elementoMonstruo";

    // Primer juego de aparacion del monstruo
    let primerJuegoDeApararicion = document.createElement("p");
    primerJuegoDeApararicion.className = "primerJuego";

    // Puesto y año del ranking de popularidad
    let rankingPopularidad = document.createElement("p");
    rankingPopularidad.className = "rankingPopuralidad";

    // Contenedor del video de musica
    let contenedorMusicaMonstruo = document.createElement("div");
    contenedorMusicaMonstruo.className = "musicaMonstruo-container";

    // Musica de batalla del monstruo
    let musicaMonstruo = document.createElement("iframe");
    musicaMonstruo.className = "musicaMonstruo";


    // TODO: Agregar los JSONs creado la categoria y el elemento en español ()
    arreglo.forEach(element => {
        contenedorImagenMonstruo.src = element.image_url;    
        nombreEnglishMonstruo.textContent = `Nombre: ${element.english_name}`;
        nombreJapaneseMonstruo.textContent = `Nombre japónes: ${element.name}`;
        categoriaMonstruo.textContent = `Categoria: ${element.category}`;
        elementoMonstruo.textContent = `Elemento: ${element.element}`;
        primerJuegoDeApararicion.textContent = `Primera aparición: ${element.title[0]}`;
        rankingPopularidad.textContent = `Ranking: N°${element.ranking.ranking}, año ${element.ranking.vote_year}`;

        // Variable que va a contener la url de la musica de batalla del monstruo
        let url = element.bgm.url;
        let idVideo = new URL(url).searchParams("v");
        musicaMonstruo.src = `https://www.youtube.com/embed/${idVideo}`;



        // TODO:    Falta armar las tarjetas en el html ()
    });
}







botonNombre.addEventListener("click",() =>{
    BuscarMonstruoNombre();
})








