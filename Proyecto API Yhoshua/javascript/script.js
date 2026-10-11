// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
const MONSTER_HUNTER_API = "https://api.mh-api.com/v1/monsters"; // Dirección de la API
const formBusquedaMosntruo = document.getElementById("formBusquedaMosntruo"); // Formulario para buscar monstruos por coincidencias (Primera página)
const btnListaCompleta = document.getElementById("btnListaCompleta");   // Botón para mostrar la lista completa de monstruos (Segunda página)
const seleccionTitulo = document.getElementById("seleccionTitulo"); // Selección de título (Tercera página)
const mensaje = document.getElementById("mensaje"); // Mensaje que se muestra antes de todas las tarjetas
const btnFalloApi = document.getElementById("btnFalloApi");             // Boton de fallo (Página de fallos)
const btnFalloUrl = document.getElementById("btnFalloUrl");             // Boton de fallo (Página de fallos)
const btnFalloHttp = document.getElementById("btnFalloHttp");           // Boton de fallo (Página de fallos)
const btnFalloRegistro = document.getElementById("btnFalloRegistro");   // Boton de fallo (Página de fallos)
const btnFalloJson = document.getElementById("btnFalloJson");           // Boton de fallo (Página de fallos)
const btnFalloGuardar = document.getElementById("btnFalloGuardar");     // Boton de fallo (Página de fallos)
const btnFalloEliminar = document.getElementById("btnFalloEliminar");   // Boton de fallo (Página de fallos)




// Asigna el contenedor donde se van a mostrar las tarjetas de los nombres que coincidan
let contenedorTarjetas = document.getElementById("tarjetasMonstruosContainer"); 

// Lista donde se guardaran todos los datos de monstruos de la API
let listaMonsters = []; 
// Creacion de array para guardar los nombres que coincidan con el nombre o letras ingresadas por el usuario
let nombresMonstruos = [];

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
        this.english_name = "";
    }

    aparecioEn(titulo){
        return this.titulo.includes(titulo);
    }

    textoRanking(){
        if(this.ranking.length > 0 && this.ranking[0].ranking !== "0"){
            return `N°${this.ranking[0].ranking}`;
        }
        return "Sin ranking";
    }
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *


// () => No cumplido        ( X ) => Tarea/TODO Cumplida
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// TODO: Falta revisar si estan todos los tipos de funciones: Normales( X )    Anonimas( X )  Tipo Flecha( X )
// TODO: Falta poner botones para demostrar errores ( X )





// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Funciones


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Se crea una clase Monster con los datos del json
function añadirMonstruo(registro){
    return new Monster(registro.monster_id, registro.name, registro.element, registro.another_name, registro.category, registro.title, registro.ranking, registro.image_url, registro.bgm);
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Funcion para conseguir el error especifico(en caso de que sea necesario)
async function pedirJSON(url){
    let respuesta;

    try{
        respuesta = await fetch(url);
    }
    catch(error){// En caso de que no se pueda conectar al servidor
        throw new Error("No se pudo conectar con el servidor")
    }
    if(!respuesta.ok){
        if(respuesta.status === 404){
            throw new Error("No se encontró lo que buscabas");
        }
        throw new Error(`El servidor contesto con un error (error ${respuesta.status})`);
    }
    try{
        return await respuesta.json();
    }
    catch(error){
        throw new Error("La información recibida no tiene un formato JSON válido");
    }
    
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *




// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Funcion que va a cargar el JSON con los nombres en inglés, japónes y el id del monstruo
function nombresEnJSON(){
    return pedirJSON("/JSON/mh_monsters_NombresCompletos.json") // Se agrega el json con los nombres en ingles, japones y el id del monstruo
            .then(datos => {
                return datos.monsters;
            })
            .catch(error => {
                console.error("Respuesta HTTP no exitosa: ",error);
                throw error;
            });
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Funcion para cargar la API
function cargarAPI(){
    // Se hace la conexion con la API 
    return pedirJSON(MONSTER_HUNTER_API)
        .then(datos => { // Despues de la conversion a JSON
            return datos.monsters;  // Devuelve el arreglo monsters en lugar de todo el objeto
        });
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *



// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Funcion para juntar los nombres en ingles con el resto de la información
function juntarInformacionDeNombres(listaMonsters,nombresMonstruos){
        let n = 0;
        let infoMonstruoCompleta = []; // Se crea un arreglo para ser utilizado
        // Se guarda en el indice indicado por n
        listaMonsters.forEach(monstruos => {
            nombresMonstruos.forEach(nombresIngles => {
                if(nombresIngles.monster_id === monstruos.monster_id){
                    monstruos.english_name = nombresIngles.english_name;// Se agrega el nombre en ingles a monstruos
                    infoMonstruoCompleta[n] = monstruos   // Se crea una copia de listaMonsters
                    n++;
                }
            });
        });
        return infoMonstruoCompleta;
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Funcion para mostrar mensajes
function mostrarMensaje(texto,tipo){
    mensaje.textContent = texto;
    mensaje.className = tipo;
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Función para obtener los favoritos
function obtenerFavoritos(){
    try{    // Lee la lista de favoritos y si no tiene devuelve vacio
        return JSON.parse(localStorage.getItem("mhFavoritos")) || [];
    }
    catch(error){
        return [];
    }
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Funcion para guardar el monstruo en favoritos
function guardarFavorito(id,simularFallo){
    try{
        if(simularFallo){
            throw new Error("Fallo simulado"); // SOlo para la pagina de fallos
        }
        let favoritos = obtenerFavoritos();// Llama a la función que obtiene los favoritos anteriores
        if(favoritos.includes(id)){ // Indica que si ya se encontró el id es que ya esta el monstruo en favoritos y no lo guarda nuevamente
            mostrarMensaje("Este monstruo ya esta en los favoritos", "aviso");
            return;
        }
        favoritos.push(id); // Se agrega a la lista
        localStorage.setItem("mhFavoritos", JSON.stringify(favoritos));  // Se guarda como texto
        mostrarMensaje("Monstruo agregado a favoritos","exito");
    }
    catch(error){
        mostrarMensaje("No se pudo guardar en favoritos","error");
    }
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *



// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function eliminarFavorito(id,simularFallo){
    try{
        if(simularFallo){
            throw new Error("Fallo simulado");
        }
        let favoritos = obtenerFavoritos();
        if(!favoritos.includes(id)){
            mostrarMensaje("Este monstruo no este entre los favoritos","aviso");
            return;
        }   
        let nuevaLista = favoritos.filter(favorito => favorito !== id);// Va a filtrar la lista dejando solo los que no tengan el id 
        localStorage.setItem("mhFavoritos",JSON.stringify(nuevaLista));
        mostrarMensaje("Monstruo eliminado de favoritos","exito");
    }
    catch(error){
        mostrarMensaje("No se pudo eliminar el monstruo de favoritos","error");
    }
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Funcion que guarda la cookie
function guardarCookie(nombre,valor,dias){
    let fecha = new Date();
    fecha.setTime(fecha.getTime() + dias * 24 * 60 * 60 * 1000);
    document.cookie = `${nombre}=${encodeURIComponent(valor)}; expires=${fecha.toUTCString()}; path=/`;
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function leerCookie(nombre){
    let cookies = document.cookie.split("; ")
    let encontrada = cookies.find(cookie => cookie.startsWith(nombre + "="));
    if(!encontrada){
        return null;
    }
    return decodeURIComponent(encontrada.split("=")[1]);
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *



// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
async function probarFallo(url){
    try{
        await pedirJSON(url);
        mostrarMensaje("La petición funciono, no hubo fallo","aviso");
    }
    catch(error){
        mostrarMensaje(error.message,"error");
    }
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *





// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Función para buscar monstruos que contengan las letras ingresadas por el usuario(o el nombre) ( X )
async function BuscarMonstruoNombre(){
    // De donde se saca el la información del nombre
    let nombre = document.getElementById("nombreMonstruoBusqueda").value.trim();
    // Comprobación de que el campo de nombre no este vacío
    if(!nombre){
        // Mensaje de alerta, no se ha ingresado el nombre
        mostrarMensaje("Por favor escriba el nombre de un monstruo","aviso");
        return;
    }
    try{
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // AÑADIR EL JSON CON LOS NOMBRES Y COMPARACIÓN CON EL DATO INGRESADO POR EL USUARIO
        // Primera versión
        // await fetch("/JSON/mh_monsters_NombresCompletos.json") // Se agrega el json con los nombres en ingles, japones y el id del monstruo
        //     .then(response => response.json())
        //     .then(datos => {
        //         nombresMonstruos = datos.monsters;
        //         console.log("JSON con los nombres y el id")
        //         console.log(nombresMonstruos);  // Solo es para comprobar que si se agregaron los registros al arreglo
        //     })
        //     .catch(error => {
        //         console.error("Error al cargar el JSON: ",error);
        //     });
        // AÑADIR EL JSON CON LOS NOMBRES Y COMPARACIÓN CON EL DATO INGRESADO POR EL USUARIO
        let nombresMonstruos = await nombresEnJSON();
        console.log("JSON con los nombres y el id");
        console.log(nombresMonstruos);

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
        if(coincidenciasNombresMonstruos.length === 0){
            CrearTarjetas([]); // Para limpiar las tarjetas ya creadas anteriormente
            mostrarMensaje(`No se han encontrado monstruos con el nombre/que contengan ${nombre}`,"aviso");
            return; // Para todo
        }
        guardarCookie("ultimaBusqueda",nombre,7);
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *





        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // Se hace la conexion con la API 
        // TODO: HACE FALTA METER EL JSON CON LOS NOMBRES EN INGLÉS DE LOS MONSTRUOS ( X )
        // Se hace la conexion con la API 
        let apiMH = await fetch(MONSTER_HUNTER_API);

        // En caso de que ocurra un error con el acceso a la API
        if(!apiMH.ok){
            throw new Error(`Error HTTP: ${apiMH.status}`);
        }
        let registros = await apiMH.json();   // Se convierte a json los registros que se enviaron desde la API
        listaMonsters = registros.monsters.map(añadirMonstruo);  // Pasa por cada registro y lo guarda en un arreglo para que despues pueda ser usado para mostrar en tarjetas 
        console.log(registros); // Solo es para comprobar que se cargó correctamente
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        


        console.log("Lista Monstruos"); // Solo es para comprobar que se cargó correctamente
        console.log(listaMonsters);
        


        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        n = 0;  // Se reinicia el contador para ser utilizado nuevamente
        let infoMonstruoCompleta = []; // Se crea un arreglo para ser utilizado
        listaMonsters.forEach(monstruos => {    // Se hace un recorrido por todo el arreglo de monstruos para encontrar coincidencias
            coincidenciasNombresMonstruos.forEach(nombresIngles => {    // Se hace un recorrido por todo el arreglo de JSON con nombres en idiomas para compararlos con lo que ha ingresado el usuario
                if(nombresIngles.monster_id === monstruos.monster_id){  // Se hace una comprobación de nombre o letra con el arreglo
                    monstruos.english_name = nombresIngles.english_name; // Se agrega el nombre en ingles a monstruos
                    infoMonstruoCompleta[n] = monstruos;    // Se crea una copia de listaMonsters
                    n++; // Se mueve en 1 el indice
                }
            });
        });
        console.log("infoMonstruoCompleta");
        console.log(infoMonstruoCompleta);
        // Comparar con for each cada indice de las coincidencias, hacerlo con monster id para sacar lainformacion del arreglo de la api
        // y despues crear las tarjetas
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        mostrarResultados(infoMonstruoCompleta, total => {
            mostrarMensaje(`Se han encontrado un total de ${total} monstruos`,"exito");
        })
    }
    catch(error){
        mostrarMensaje(`Ha ocurrido un error, ${error.message}`,"error");
    }
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *



// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// TODO: Crear la funcion para mostrar todos los monstruos ( X )
// pasando la API completa, el JSON y el llamado a la función de la creación de las tarjetas
async function ListaCompleta(){
    try{
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // AÑADIR EL JSON CON LOS NOMBRES
        let nombresMonstruos = await nombresEnJSON();
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // CARGAR LOS DATOS DE LA API EN registros
        let registros = await cargarAPI();   // Llama a la función que carga la API guardando el arreglo en registros
        listaMonsters = registros.map(añadirMonstruo);  // Pasa por cada registro y lo guarda en un arreglo para que despues pueda ser usado para mostrar en tarjetas 
        console.log(registros); // Solo es para comprobar que se cargó correctamente
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *


        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // TODO: Hacer este ciclo una funcion ()
        // let n = 0;
        // let infoMonstruoCompleta = []; // Se crea un arreglo para ser utilizado
        // // Se guarda en el indice indicado por n
        // listaMonsters.forEach(monstruos => {
        //     nombresMonstruos.forEach(nombresIngles => {
        //         if(nombresIngles.monster_id === monstruos.monster_id){
        //             infoMonstruoCompleta[n] = {
        //                 ...monstruos,   // Se crea una copia de listaMonsters
        //                 english_name: nombresIngles.english_name // Se le añade una propiedad english_name y se le asigna el de coincidencias
        //             };
        //         }
        //         n++;
        //     });
        // });
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *


        

        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // Se crean las tarjetas en la página
        mostrarResultados(juntarInformacionDeNombres(listaMonsters,nombresMonstruos), total => {
            mostrarMensaje(`Se han encontrado un total de ${total} monstruos`,"aviso");
        })
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    }
    catch(error){
        mostrarMensaje(`Ha ocurrido un error, ${error.message}`,"error");
    }
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *



// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// TODO: Función para mostrar los monstruos basado en el título buscado
async function BuscarPorTitulo(){
    try{
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // AÑADIR EL JSON CON LOS NOMBRES
        let nombresMonstruos = await nombresEnJSON();
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *


        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // CARGAR LOS DATOS DE LA API EN registros
        let registros = await cargarAPI();   // Llama a la función que carga la API guardando el arreglo en registros
        listaMonsters = registros.map(añadirMonstruo);  // Pasa por cada registro y lo guarda en un arreglo para que despues pueda ser usado para mostrar en tarjetas 
        console.log(registros); // Solo es para comprobar que se cargó correctamente
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

        // Título seleccionado
        console.log(seleccionTitulo.value);
        let n = 0;
        let listaCompleta = juntarInformacionDeNombres(listaMonsters,nombresMonstruos); // Aqui se juntan los datos recogidos por la api mas los nombres que estan en el JSON
        let monstruosPorTitulo = listaCompleta.filter(monster => monster.aparecioEn(seleccionTitulo.value)); // Filtra la listaCompleta de monstruos basado en si han aparecido en el titulo seleccionado por el usuario

        
        // aparecioEn(titulo)
        // listaCompleta.forEach(monstruo => {
        //     monstruo.titulo.forEach(element =>{
        //         if(element === seleccionTitulo.value){
        //             monstruosPorTitulo[n] = monstruo;
        //             n++;
        //             return;
        //         }
        //     })
        // })
        console.log(monstruosPorTitulo); // Comprobacion de que si se encontraron todos los de un solo titulo


        mostrarResultados(monstruosPorTitulo, total => {
            mostrarMensaje(`Se han encontrado un total de ${total} monstruos`,"aviso");
        })
    }
    catch(error){
        mostrarMensaje(`Ha ocurrido un error: ${error.message}`,"error");
    }


}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Función para mostrar cuantos monstruos se han encontrado / callback con funcion de flecha
function mostrarResultados(lista, callback){
    CrearTarjetas(lista);   // Se crean las tarjetas con los monstruos encontrados
    callback(lista.length); // Se muestra la cantidad de monstruos encontrados
}


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *



// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Funcion para crear las tarjetas en la página
function CrearTarjetas(arreglo){    
    contenedorTarjetas.replaceChildren();   // Borra las tarjetas anteriores
    arreglo.forEach(element => {
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // Contenedor de la tarjeta del monstruo
        let contenedorTarjetaMonstruo = document.createElement("div");
        contenedorTarjetaMonstruo.className = "tarjetaMonstruo-container";

        // Contenedor de la imagen del monstruo
        let contenedorImagenMonstruo = document.createElement("div");
        contenedorImagenMonstruo.className = "imagenMonstruo-container";

        // Imagen del monstruo
        let imagenMonstruo = document.createElement("img");
        imagenMonstruo.className = "imagenMonstruo";

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

        // Primer juego de aparicion del monstruo
        let primerJuegoDeAparicion = document.createElement("p");
        primerJuegoDeAparicion.className = "primerJuego";

        // Puesto y año del ranking de popularidad
        let rankingPopularidad = document.createElement("p");
        rankingPopularidad.className = "rankingPopuralidad";

        // Contenedor del video de musica
        let contenedorMusicaMonstruo = document.createElement("div");
        contenedorMusicaMonstruo.className = "musicaMonstruo-container";

        // Musica de batalla del monstruo
        let musicaMonstruo = document.createElement("iframe");
        musicaMonstruo.className = "musicaMonstruo";

        // Botón de favoritos
        let botonFavorito = document.createElement("button");
        botonFavorito.textContent = "Añadir a favoritos";
        botonFavorito.addEventListener("click",() => {
            guardarFavorito(element.monster_id,false);
        })
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *




        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // TODO: Agregar los JSONs creado la categoria y el elemento en español ()
        // Se asigna la informacion del arreglo a lo que van a ser etiquetas del HTML
        imagenMonstruo.src = element.imagen  // Enlace alternativo en caso de que no funcione(Por el internet del INA)  "https://monsterhunterwiki.org/images/thumb/4/4b/MHWA-Rathian_Render_001.webp/300px-MHWA-Rathian_Render_001.webp"  
        nombreEnglishMonstruo.textContent = `Nombre: ${element.english_name}`;
        nombreJapaneseMonstruo.textContent = `Nombre japónes: ${element.nombreJP}`;
        categoriaMonstruo.textContent = `Categoria: ${element.categoria}`;
        elementoMonstruo.textContent = `Elemento: ${element.elemento}`;
        primerJuegoDeAparicion.textContent = `Primera aparición: ${element.titulo[0]}`;
        // Acceder al array dentro de ranking
        rankingPopularidad.textContent = `Ranking: ${element.textoRanking()}`;

        //TODO: Variable que va a contener la url de la musica de batalla del monstruo ( X )
        let url = new URL(element.musica[0].url);
        let idVideo = url.searchParams.get("v");
        musicaMonstruo.src = `https://www.youtube.com/embed/${idVideo}?si=ZWBNKpjy_mPzxtn_`;
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *



        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
        // TODO:    Falta armar las tarjetas en el html ( X )
        // Se agregan al HTML las etiquetas con la información para mostrar
        contenedorTarjetas.appendChild(contenedorTarjetaMonstruo);
        contenedorTarjetaMonstruo.appendChild(contenedorImagenMonstruo);
        contenedorImagenMonstruo.appendChild(imagenMonstruo);
        contenedorTarjetaMonstruo.appendChild(contenedorInfoMonstruo);
        contenedorInfoMonstruo.appendChild(nombreEnglishMonstruo);
        contenedorInfoMonstruo.appendChild(nombreJapaneseMonstruo);
        contenedorInfoMonstruo.appendChild(categoriaMonstruo);
        contenedorInfoMonstruo.appendChild(elementoMonstruo);
        contenedorInfoMonstruo.appendChild(primerJuegoDeAparicion);
        contenedorInfoMonstruo.appendChild(rankingPopularidad);
        contenedorInfoMonstruo.appendChild(musicaMonstruo);
        contenedorTarjetaMonstruo.appendChild(botonFavorito);
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    });
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *




// Botones del HTMl
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Botón para mostrar los monstruos que coincidan con el nombre o letras ingresados por el usuario
if(formBusquedaMosntruo){
formBusquedaMosntruo.addEventListener("submit",evento => {
    evento.preventDefault();
    BuscarMonstruoNombre();
})}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *



// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Botón para mostrar la lista completa de monstruos
if(btnListaCompleta){
btnListaCompleta.addEventListener("click",() => {
    ListaCompleta();
})}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *



// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Botón para buscar monstruos por título de aparición
if(seleccionTitulo){
seleccionTitulo.addEventListener("change", function(){
    BuscarPorTitulo();  
})}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *



// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
let inputNombre = document.getElementById("nombreMonstruoBusqueda");
let ultimaBusqueda = leerCookie("ultimaBusqueda");
if(inputNombre && ultimaBusqueda){
    inputNombre.value = ultimaBusqueda;
    mostrarMensaje(`Tu ultima busqueda fue ${ultimaBusqueda}`, "aviso");
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
if(btnFalloApi){
    btnFalloApi.addEventListener("click",() =>{
        probarFallo("https://api.mh-api.invalid/v1/monsters");
    });
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
if(btnFalloUrl){
    btnFalloUrl.addEventListener("click",() =>{
        probarFallo("/JSON/noExiste.json");
    });
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
if(btnFalloHttp){
    btnFalloHttp.addEventListener("click",() =>{
        probarFallo("https://api.mh-api.com/v1/monstruos");
    });
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
if(btnFalloRegistro){
    btnFalloRegistro.addEventListener("click",() =>{
        probarFallo(MONSTER_HUNTER_API + "/99999");
    });
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
if(btnFalloJson){
    btnFalloJson.addEventListener("click",() =>{
        probarFallo("/pages/index.html");
    });
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
if(btnFalloGuardar){
    btnFalloGuardar.addEventListener("click",() =>{
        guardarFavorito("1",true); // true simula el fallo
    });
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
if(btnFalloEliminar){
    btnFalloEliminar.addEventListener("click",() =>{
        eliminarFavorito("1",true);
    });
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
