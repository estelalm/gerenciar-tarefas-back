'use strict'

const idUsuario = localStorage.getItem('idPerfil')
console.log(idUsuario)


const usuarioAtual = localStorage.getItem('usuarioId')

async function getUsuario() {
    const responseApi = await fetch('http://localhost:5080/usuario/' + idUsuario)
    const usuario = responseApi.json();

    return usuario
}
async function getUsuarioAtual() {
    const responseApi = await fetch('http://localhost:5080/usuario/' + usuarioAtual)
    const usuario = responseApi.json();

    return usuario
}



const criarPerfil = async () =>{

    const usuarioAtualJSON = await getUsuarioAtual()

    const card = document.querySelector('.card')

    let usuario = await getUsuario()
    const nomeUsuario = document.getElementById('nome-usuario')
    nomeUsuario.textContent = usuario.nome


    if(idUsuario == usuarioAtual){
        
        const informacoesContainer = document.createElement('div')
        informacoesContainer.classList.add('informacoes')

        let senha = '*'
        for(let index = 1 ; index < usuario.senha.length;index++){
            senha += '*'
        }

        informacoesContainer.innerHTML = `           
         <span>Email</span>
        <div class="info">
            <p>${usuario.email}</p>
        </div>
        <span>Senha</span>
        <div class="info">
            <p>${senha}</p>
        </div>`

        card.appendChild(informacoesContainer)

        if(!usuario.premium){
            const botaoSejaPremium = document.createElement('div')
            botaoSejaPremium.classList.add('serPremium')
    
        botaoSejaPremium.innerHTML = `
        <a class="premium" href="../premium/premium.html">
        <img src="../img/mdi_crown.png" alt="">
        Seja Premium</a>`
            
        card.appendChild(botaoSejaPremium)
        }
        
    }else{

        const usuarioContainer = document.querySelector('.usuario')

        if(usuario.premium){
           const coroa = document.createElement('img')
           coroa.classList.add('coroa')
           coroa.src = '../img/coroa.png'

           usuarioContainer.appendChild(coroa)
        }

        const botoes = document.createElement('div')
        botoes.classList.add('botoes')

        if(usuarioAtualJSON.seguindo.includes(idUsuario)){

            const botaoDeixarSeguir = document.createElement('button')
            botaoDeixarSeguir.classList.add('remover')
            botaoDeixarSeguir.textContent = "Deixar de Seguir"

            botoes.appendChild(botaoDeixarSeguir)

            
           botaoDeixarSeguir.addEventListener('click', deixarDeSeguir)

        }else{
            const botaoSeguir = document.createElement('button')
            botaoSeguir.classList.add('seguir')
            botaoSeguir.textContent = "Seguir"

            botoes.appendChild(botaoSeguir)
            botaoSeguir.addEventListener('click', seguir)
            botaoSeguir.usuario = usuario
        }

        card.appendChild(botoes)


    }
    
}

const seguir = async (event) =>{

    const usuario = await getUsuarioAtual()

    if(usuario.seguindo.includes(idUsuario) |usuario.seguindo.includes(idUsuario.toString())){

    }else{
        usuario.seguindo.push(idUsuario)
    }
    
    enviarSeguindo(usuario)
    window.location.reload()
}

const deixarDeSeguir = async () =>{
    const usuario = await getUsuarioAtual()

    const seguindoArray = usuario.seguindo

    seguindoArray.splice(seguindoArray.indexOf(idUsuario), 1)

    enviarSeguindo(usuario)
    window.location.reload()
}

const enviarSeguindo = async (usuario) =>{
    
        const url = `http://localhost:5080/usuario/${usuarioAtual}`
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


criarPerfil()


