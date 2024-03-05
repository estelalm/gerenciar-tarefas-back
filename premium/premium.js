'use strict'

let idUsuario = localStorage.getItem('idPerfil')

async function getUsuarioAtual() {
    const responseApi = await fetch('http://localhost:5080/usuario/' + idUsuario)
    const usuario = responseApi.json();

    return usuario
}

const serPremium = async (event) =>{

    const usuario = await getUsuarioAtual()
    usuario.premium = true

    console.log(usuario)
    enviarPremium(usuario)
    window.location.assign('../pagina-inicial/inicio.html')
}

const botaoSejaPremium = document.getElementById('seja-premium')
botaoSejaPremium.addEventListener('click', serPremium)


const enviarPremium = async (usuario) =>{
    
        const url = `http://localhost:5080/usuario/${idUsuario}`
        const options = {
            method : 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        }
        const response = await fetch(url, options)
        console.log (response.ok)
        return response.ok

}


console.log( getUsuarioAtual())
