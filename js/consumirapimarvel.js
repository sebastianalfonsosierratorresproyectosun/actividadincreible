
var index = 0
// porque eso de 3000 peticiones por dia al parecer no me alcanzó, la proxima ya guardo el json en una variable
var apikeys = ["6769e27eec02d224ae308c8ad95b69d1", "be73fca609554a6b86ea60694f0dbade"]
var hashes = ["efc445361233003bc181c1c6baedf618", "18411005f1b18437240534a687b93894"]

var apikey = apikeys[index]; 
var ts = "1000";
var hash = hashes[index];

var limite = "20"; //no puede superar 100, por defecto es 20

function consumirAPIPaginaPrincipal() {


    console.log("INICIANDO BUSQUEDA");


    var url = 'https://gateway.marvel.com/v1/public/characters?ts=' + ts + "&apikey=" + apikey + "&hash=" + hash + "&limit=" + limite;

    console.log(url);

    //var tablaMarvel = document.getElementById("tablaMarvel");
    var grilla = document.getElementById("cpm")

    fetch(url)
        .then(response => response.json())
        .then(json => {

            for (item of json.data.results) {

                console.log(item.name)

                var div = document.createElement("div");

                var img = document.createElement("img");
                img.src = item.thumbnail.path + "." + item.thumbnail.extension;

                var parrafoDescripcion = document.createElement("p")
                if (item.description == ""){
                    parrafoDescripcion.innerText = "Sin descripción"
                }else{
                    parrafoDescripcion.innerText = item.description
                }
                

                var label = document.createElement("label");
                label.innerText = item.name;

                div.appendChild(label);
                div.appendChild(img);
                div.appendChild(parrafoDescripcion);

                var link1 = document.createElement("a");
                link1.innerText = "Ver Series";
                link1.href = "html/verseries.html?idPersonaje=" + item.id + "&nombrePersonaje=" + item.name;
                div.appendChild(link1);

                var link2 = document.createElement("a");
                link2.innerText = "Ver Comics";
                link2.href = "html/vercomics.html?idPersonaje=" + item.id + "&nombrePersonaje=" + item.name;
                div.appendChild(link2);

                var link3 = document.createElement("a");
                link3.innerText = "Ver Eventos";
                link3.href = "html/vereventos.html?idPersonaje=" + item.id + "&nombrePersonaje=" + item.name;
                div.appendChild(link3);

                var link4 = document.createElement("a");
                link4.innerText = "Ver Stories";
                link4.href = "html/verstories.html?idPersonaje=" + item.id + "&nombrePersonaje=" + item.name;
                div.appendChild(link4);


                grilla.appendChild(div);





            }


        });
}

function consumirAPIMarvelVer(tipo) {
    const paramURL = window.location.search;
    const parametrosURL = new URLSearchParams(paramURL);
    const idPersonaje = parametrosURL.get('idPersonaje');
    const nombrePersonaje = parametrosURL.get('nombrePersonaje');
    
    console.log(idPersonaje);

    document.title = nombrePersonaje + " - " + tipo;

    var url = 'https://gateway.marvel.com/v1/public/characters/' + idPersonaje + '/' + tipo + '?ts=' + ts + "&apikey=" + apikey + "&hash=" + hash + "&limit=" + limite;
    console.log(url);

    var tabla = document.getElementById("tablita")

    fetch(url)
        .then(response => response.json())
        .then(json => {

            for (item of json.data.results) {
                var tr = document.createElement("tr");

                var columnaNombre = document.createElement("td");

                var columnaURL = document.createElement("td");


                //var div = document.createElement("div");
                var label = document.createElement("label");
                var link = document.createElement("a");

                label.innerText = item.title;
                //div.appendChild(label);


                link.href = item.urls[0].url;
                link.innerText = item.urls[0].url;
                link.target = "_blank"

                columnaNombre.appendChild(label);
                columnaURL.appendChild(link);

                tr.appendChild(columnaNombre);
                tr.appendChild(columnaURL)

                tabla.appendChild(tr);

                //div.appendChild(link);
                // document.body.appendChild(div);
            }



        });

}

function obtenerURLStories(resourceURL) {
    var URLSegura = "https://" + resourceURL.substring(7, resourceURL.length); //no me sirve http, necesito https

    var URLCompleta = URLSegura + '?ts=' + ts + "&apikey=" + apikey + "&hash=" + hash

    return URLCompleta
}

function consumirAPIMarvelVerStories() {
    const paramURL = window.location.search;
    const parametrosURL = new URLSearchParams(paramURL);
    const idPersonaje = parametrosURL.get('idPersonaje');
    const nombrePersonaje = parametrosURL.get('nombrePersonaje');
    document.title = nombrePersonaje + " - stories";

    console.log(idPersonaje);
    var url = 'https://gateway.marvel.com/v1/public/characters/' + idPersonaje + '/stories?ts=' + ts + "&apikey=" + apikey + "&hash=" + hash + "&limit=" + limite;
    console.log(url);

    var tabla = document.getElementById("tablaStories")
    var urlExterno = [];
    var urlamostrar = [];

    fetch(url)
        .then(response => response.json())
        .then(json => {

            for (var i = 0; i < json.data.results.length; i++) {

                var item = json.data.results[i]

                var fila = tabla.insertRow();
                var tituloHistoriaColumna = fila.insertCell(0);
                tituloHistoriaColumna.innerHTML = item.title;

                var tipoHistoriaColumna = fila.insertCell(1);
                tipoHistoriaColumna.innerHTML = item.type;


                urlExterno.splice(i, 0, obtenerURLStories(item.originalIssue.resourceURI))

            }


        })
        .then(() => {

            //console.log(urlExterno[1])

            for (let i = 0; i < urlExterno.length; i++) {


                fetch(urlExterno[i])
                    .then(response => response.json())
                    .then(json => {
                        var urls = json.data.results[0].urls

                        urlquesemuestra = Object.values(urls)[0].url

                        

                        urlamostrar.splice(i,0,urlquesemuestra)

                        
                        console.log(urlamostrar.length)

                        if (urlamostrar.length == urlExterno.length){

                            var textoAviso = document.getElementById("textoOrganizandoURLS")
                            textoAviso.innerText = ""
                        

                            var tabla2 = document.getElementById("tablaURL")

                            for (let i = 0 ; i < urlamostrar.length ; i++){
                                var fila = tabla2.insertRow();
                                var celdaLink = fila.insertCell(0);
                
                                var link = document.createElement("a");
                                link.href = urlamostrar[i]
                                link.innerText = "Link"
                                link.target = "_blank"
                                celdaLink.appendChild(link);
                                console.log(i)
                            }
                        }

                    });


                

            }

        })

}












