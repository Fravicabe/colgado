let players = null

function GetPlayers(){
    fetch("players.json")
        .then(function(resp){
            return resp.json()
        }).then(function(respJSON){
            players = respJSON
        }).catch(function(error){
            console.log(error)
        })
}
// Cargar jugadores desde el JSON
GetPlayers()


function validarDatos(e){
    e.preventDefault() // Suspender el envío de datos al servidor pero
    //Manteniendo la validación en el FORM HTML
    //alert("Hola mundo!")

    // DOM
    const txtJugador = document.getElementById("txtJugador")
    //alert(txtJugador.value)
    // Validaciones mediante EXPRESIONES REGULARES (RegEx)
    if(!txtJugador.value.match(/[a-z]/) || !txtJugador.value.match(/[A-Z]/) || !txtJugador.value.match(/\d/)){
        Swal.fire({
            title: "¡Error de validación!",
            text: "El nombre del jugador debe contener mayúsculas, minúsculas y al menos un número",
            icon: "error"   
        });
        document.getElementById("mensaje").style.display = "block"
        document.getElementById("mensaje2").style.display = "none"
    }else {
        //Todo bien validado
        // Búsqueda del jugador en el array de jugadores/archivo JSON
        for(let player of players){
            if(player.nombre == txtJugador.value){
                // Encontrado el jugador
                Swal.fire({
                    title: "¡Error de registro!",
                    text: "El jugador ya existe en el registro. No le puedes dar de alta.",
                    icon: "error"    
                });
                document.getElementById("mensaje2").style.display = "none"
                break
            } else{
                // No existe el jogador
                document.getElementById("mensaje2").innerText = "Olee, " + txtJugador.value + " ha sido dado de alta correctamente 😼👍"
                document.getElementById("mensaje2").style.display = "block"
                Swal.fire({
                    title: "De locos",
                    text: txtJugador.value,
                    icon: "success"
                });
        document.getElementById("mensaje").style.display = "none"
            }
        }
    }
}

function cambiarImagen(){
    const imgVini = document.getElementById("imgVini")
    const mensajeVini = document.getElementById("Vinipringao")
    // input = value

    if(imgVini.src.includes("vini1")){
        imgVini.src = "img/img/vini2.jpeg"
        mensajeVini.innerText = "Oh mamma mia!"
        mensajeVini.style.color = "red"
    }else{
        imgVini.src = "img/img/vini1.jpeg"
        mensajeVini.innerText = "Mandril ladrones!!"
        mensajeVini.style.color = "blue"
    }

}