const socket = io()

socket.on('products', data => {
    console.log("evento productos", data)
    loadList(data.payload)
})

socket.on('messagelog', data => {
    let p = document.getElementById("chatContainer")
    try {
        let messages = data.map((msg) => {
                return `<div><span><b style='color: blue'>${msg.email}</b> <span style='color: brown'>${msg.created_at}</span>: <i style='color: green'>${msg.message}</i></span></div>`
            }).join('')
        p.innerHTML = messages
        scrollToBottom('chatContainer')
    }catch (e) {
        console.log("error "+e)
    }

})

let input = document.getElementById("message")
let email = document.getElementById("email")
let first_name = document.getElementById("first_name")
let last_name = document.getElementById("last_name")
let age = document.getElementById("age")
let alias = document.getElementById("alias")
input.addEventListener('keyup', (e) => {
    if (e.key==="Enter" ) {
        if (!first_name.value) {
            Swal.fire({
                title: 'Error!',
                text: 'El nombre se encuentra vacío',
                icon: 'error',
                confirmButtonText: 'Cool'
            })
            return
        }
        if (!last_name.value) {
            Swal.fire({
                title: 'Error!',
                text: 'El apellido se encuentra vacío',
                icon: 'error',
                confirmButtonText: 'Cool'
            })
            return
        }
        if (!alias.value) {
            Swal.fire({
                title: 'Error!',
                text: 'El alias se encuentra vacío',
                icon: 'error',
                confirmButtonText: 'Cool'
            })
            return
        }
        if (!age.value) {
            Swal.fire({
                title: 'Error!',
                text: 'La edad se encuentra vacía',
                icon: 'error',
                confirmButtonText: 'Cool'
            })
            return
        }
        if (!e.target.value) {
            Swal.fire({
                title: 'Error!',
                text: 'El mensaje se encuentra vacío',
                icon: 'error',
                confirmButtonText: 'Cool'
            })
            return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){
            Swal.fire({
                title: 'Error!',
                text: 'El email no es válido',
                icon: 'error',
                confirmButtonText: 'Cool'
            })
            return
        }
        socket.emit('message', {

            author: {
                id: email.value,
                nombre: first_name.value,
                apellido: last_name.value,
                edad: age.value,
                alias: alias.value,
                avatar: "https://image.pngaaa.com/83/5311083-middle.png"
            },
            text: e.target.value
        })
        input.value = ""
    }
})

function loadList(products) {
    fetch('http://localhost:8080/list_template.handlebars')
    .then(response => response.text().then(function(text) {
        let template = Handlebars.compile(text);
        document.querySelector("#listContainer").innerHTML = template({products: products});
      }))

   

}

document.addEventListener('submit', event=> {
    event.preventDefault()

    let form = document.querySelector('#productForm')
    fetch('http://localhost:8080/api/productos', {
        method: 'POST',
        body: new FormData(form)
    }).then(result => {
        return result.json()
    }).then(json => {
        if (json["status"]=="success") {
            alert("Se agregó el producto")
            //document.getElementById("thumbnail").value = "";
            document.getElementById("title").value = "";
            document.getElementById("price").value = "";
        }
    })
})

document.getElementById("image").onchange = (e)=>{
    let read = new FileReader();
    read.onload = e =>{
        //document.querySelector('.image-text').innerHTML = "Vista previa del producto"
        document.getElementById("preview").src = e.target.result;
    }
    
    read.readAsDataURL(e.target.files[0])
}

function scrollToBottom (id) {
    var div = document.getElementById(id);
    div.scrollTop = div.scrollHeight - div.clientHeight;
 }

 function validateEmail(mail) {
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    return (false)
}