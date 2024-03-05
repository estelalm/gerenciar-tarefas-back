'use strict'

import {getUsuario} from "../funcoes_get.js"



//id do usuário atualmente conectado
let usuarioId = localStorage.getItem('usuarioId')
let idPerfil = 0

const fotoUsuario = document.getElementById('perfil-link')
fotoUsuario.addEventListener('click',() =>{
    idPerfil = usuarioId
    localStorage.setItem('idPerfil', idPerfil)
})


async function getTarefas() {
    const responseApi = await fetch('http://localhost:5080/tarefas')
    const listaTarefas = responseApi.json();

    return listaTarefas
}
async function getUsuarios() {
    const responseApi = await fetch('http://localhost:5080/usuario')
    const listaUsuarios = responseApi.json();

    return listaUsuarios
}

/***/

//criar as tarefas do usuário
const criarTarefa = (tarefas, tarefa) =>{

    const containerDeTarefas = document.getElementById('tarefas')
    const containerTarefaDeHoje = document.getElementById('tarefas-hoje')

    const containerTarefa = document.createElement('div')
    containerTarefa.classList.add('tarefa')

    const botaoEditarSalvar = document.createElement('button')
    botaoEditarSalvar.classList.add('icone-e-cor')

    const infoTarefa = document.createElement('div')
    infoTarefa.classList.add('info-tarefa')

    const tituloTarefa = document.createElement('span')
    tituloTarefa.textContent = tarefa.descricao
    tituloTarefa.classList.add('titulo-tarefa')
    
    const dataConclusao = document.createElement('span')
    dataConclusao.textContent = tarefa.dataConclusão
    dataConclusao.classList.add('data-tarefa')

    const deletarTarefa = document.createElement('button')
    deletarTarefa.style.backgroundImage = '../img/delete.svg'
    deletarTarefa.classList.add('deletar-tarefa')

    infoTarefa.replaceChildren(tituloTarefa, dataConclusao)
    containerTarefa.replaceChildren(botaoEditarSalvar, infoTarefa, deletarTarefa)


    let dataDeHoje = getDataAtual().split('/')
    let conclusao = tarefa.dataConclusão
    let dataDaTarefa = conclusao.split('/')
    console.log(dataDaTarefa)

    if(Number(dataDeHoje[2]) > Number(dataDaTarefa[2])){
    }else if(Number(dataDeHoje[1]) > Number(dataDaTarefa[1])){
    }else if(Number(dataDeHoje[0]) > Number(dataDaTarefa[0])){
    }else{
        if(tarefa.dataConclusão == getDataAtual()){

            if(containerTarefaDeHoje.textContent == "Nenhuma tarefa a ser realizada hoje!!")
            containerTarefaDeHoje.replaceChildren(containerTarefa)
            else
            containerTarefaDeHoje.appendChild(containerTarefa)
    
            }else{
            containerDeTarefas.appendChild(containerTarefa)
        }
    }
   
       
    


    let inputTitulo = document.createElement('input')
    let inputData = document.createElement('input')


    const url = `http://localhost:5080/tarefas/${tarefa.id}`
    botaoEditarSalvar.addEventListener('click', async (clickEvent) =>{

        let botaoEditar = clickEvent.target

        let novoTitulo = inputTitulo.value
        let novaData = inputData.value

        if(botaoEditar.classList[1] == 'edit-mode'){

            tituloTarefa.textContent = novoTitulo
            dataConclusao.textContent = novaData

            infoTarefa.replaceChildren(tituloTarefa, dataConclusao)

            const options = {
                method : 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        "id": tarefa.id,
                        "descricao": novoTitulo,
                        "dataConclusão": novaData,
                        "idUsuario": tarefa.idUsuario
                    }
                )
            }
            const response = await fetch(url, options)

            window.location.reload()

        }else{
            inputTitulo.value = tituloTarefa.textContent
            inputData.value = dataConclusao.textContent


            infoTarefa.replaceChildren(inputTitulo, inputData)
        }
    
        botaoEditar.classList.toggle('edit-mode')
    
    })


    
    deletarTarefa.addEventListener('click', async () =>{

            const options = {
                method: 'DELETE'
            }
            const response = await fetch(url, options)
            console.log (response.ok)

            window.location.reload()
    })



 }

 //criar um aviso sobre as permissões de usuários sem premium
const bloquearPremium = ()=>{

    const containerDeTarefas = document.querySelector('.container-minhas-tarefas')

    const painelPremium = document.createElement('div')
    painelPremium.classList.add('painel-premium')

    painelPremium.innerHTML = '<img src="../img/coroa.png" alt="Coroa"> <a href="../premium/premium.html"><h2>Seja Premium</h2></a> <p>Essa é uma função exclusiva para assinantes</p>'

    const botaoAdicionar = document.getElementById('add-tarefa')
    botaoAdicionar.href = "#"
    botaoAdicionar.innerHTML = 'Adicionar Tarefa <img src="../img/coroa.png">'
    botaoAdicionar.style.backgroundColor = 'var(--botao)'

    painelPremium.addEventListener('click', () =>{
        idPerfil = usuarioId
        localStorage.setItem('idPerfil', idPerfil)
    })

    containerDeTarefas.replaceChildren(painelPremium)
}

//criar ou excluir comentários
const criarComentario = (event) =>{ 

    const comentarios = event.target.comentariosArray
    const comentarioContainer = event.target.comentarioContainer
    const tarefa = event.target.jsonTarefa

    let comentarContainer = document.createElement('div')
    comentarContainer.classList.add('comentar-container')

    let inputComentario = document.createElement('input')
    inputComentario.classList.add('campoComentar')
    
    let botaoEnviar = document.createElement('button')
    botaoEnviar.classList.add('enviar')
    botaoEnviar.innerHTML = 'Enviar'
    comentarContainer.replaceChildren(inputComentario, botaoEnviar)

    comentarioContainer.appendChild(comentarContainer)
    botaoEnviar.addEventListener('click', () =>{

    let idComentario = comentarios.length + 1
       let novoComentarioConteudo =  inputComentario.value
       let novoComentario = {
        "id": idComentario,
        "idUsuario": usuarioId,
        "conteudo": novoComentarioConteudo,
        "dataComentario": getDataAtual()
       }
       comentarios.push(novoComentario)

       tarefa.comentarios = comentarios

       enviarComentario(tarefa)
       window.location.reload()
    })
}
const excluirComentario = event =>{
    const tarefa = event.target.jsonTarefa
    
    const comentarios = tarefa.comentarios
    const comentario = event.target.comentario

    const indexComentario = comentarios.indexOf(comentario)

    comentarios.splice(indexComentario, 1)

    //atualiza os comentários da tarefa
    tarefa.comentarios = comentarios

    enviarComentario(tarefa)
    window.location.reload()
}

//função para atualizar a tarefa com os novos comentários
async function enviarComentario (tarefa){
    const url = `http://localhost:5080/tarefas/${tarefa.id}`
    const options = {
        method : 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tarefa)
    }
    const response = await fetch(url, options)
    console.log (response.ok)
    return response.ok
}

//criar as tarefas que aparecem na timeline do usuário
const criarTarefaTimeline = (tarefa, usuarios) =>{

    const containerTimeline = document.getElementById('container-timeline')
 
    const postTarefa = document.createElement('div')
    postTarefa.classList.add('post-tarefa')

    const fotoPerfil = document.createElement('div')
    fotoPerfil.classList.add('foto-perfil')
    let imagemUsuario 
    const username = document.createElement('p')
    usuarios.forEach(usuario =>{
        if(tarefa.idUsuario == usuario.id){
            fotoPerfil.addEventListener('click', () =>{
                idPerfil = usuario.id
                localStorage.setItem('idPerfil', idPerfil)
            })
            username.textContent = usuario.nome

            if(usuario.imagem == null)
            imagemUsuario = '../img/usuario.webp'
            else
            imagemUsuario = usuario.imagem
        
            if(usuario.premium){
                fotoPerfil.innerHTML = `<img class="coroa" src="../img/coroa.png" alt=""> <a href="../perfil/perfil.html"><img src="${imagemUsuario}" alt=""></a>`   
            }else{
                fotoPerfil.innerHTML = `<a href="../perfil/perfil.html"><img src="${imagemUsuario}" alt=""></a>`   
            }
        }
    })


    const containerTarefa = document.createElement('div')
    containerTarefa.classList.add('tarefa')
    containerTarefa.classList.add('time-tarefa')

    const botaoComentar = document.createElement('button')
    botaoComentar.classList.add('icone-e-cor')

    botaoComentar.addEventListener('click', criarComentario)
    botaoComentar.comentariosArray = tarefa.comentarios
    botaoComentar.jsonTarefa = tarefa

    const infoTarefa = document.createElement('div')
    infoTarefa.classList.add('info-tarefa')

    const tituloTarefa = document.createElement('span')
    tituloTarefa.textContent = tarefa.descricao
    tituloTarefa.classList.add('titulo-tarefa')
    
    const dataConclusao = document.createElement('span')
    dataConclusao.textContent = tarefa.dataConclusão
    dataConclusao.classList.add('data-tarefa')

    infoTarefa.replaceChildren(tituloTarefa, dataConclusao)
    containerTarefa.replaceChildren(botaoComentar, infoTarefa)

    postTarefa.replaceChildren(username, containerTarefa)
    
    ///////////////////////////////////////////////////////////////////////


    let postContainer = document.createElement('div')
    postContainer.classList.add('post-container')

    postContainer.replaceChildren(fotoPerfil, postTarefa)
    //////////////////////////////////////////////////////////////////////

    const postComentarios = document.createElement('div')
    postComentarios.classList.add('post-comentarios')
    botaoComentar.comentarioContainer = postComentarios
    tarefa.comentarios.forEach(comentario =>{
        const postComentario = document.createElement('div')
        postComentario.classList.add('post-comentario')

        const fotoComentario = document.createElement('div')
        fotoComentario.classList.add('foto-perfil')
        fotoComentario.classList.add('foto-comentario')

        let fotoPerfilComentario
        let nomeComentario
        usuarios.forEach(usuarioComentario =>{
            if(usuarioComentario.id == comentario.idUsuario){
                if(usuarioComentario.imagem == null)
                fotoPerfilComentario = '../img/usuario.webp' 
                else
                fotoPerfilComentario = usuarioComentario.imagem

            if(usuarioComentario.premium){
                let coroaPremium = document.createElement('img')
                coroaPremium.src = '../img/coroa.png'
                coroaPremium.classList.add('coroa')

                fotoComentario.appendChild(coroaPremium)
            }
            nomeComentario = usuarioComentario.nome

            const linkPerfil = document.createElement('a')
            linkPerfil.href = '../perfil/perfil.html'
            linkPerfil.style.backgroundImage = `url('${fotoPerfilComentario}')`

            linkPerfil.addEventListener('click', () => {
                idPerfil = usuarioComentario.id
                localStorage.setItem('idPerfil', idPerfil)
            })

            fotoComentario.appendChild(linkPerfil)
        }
        })
        
        const conteudoComentario = document.createElement('p')
        conteudoComentario.classList.add('comentario')
        conteudoComentario.textContent = `${nomeComentario}: ${comentario.conteudo}`

        //caso o comentário seja do usuário conectado, haverá a função de deletar
        if(comentario.idUsuario == usuarioId) {
            const deletarComentario = document.createElement('button')
            deletarComentario.classList.add('deletar-comentario')
            conteudoComentario.appendChild(deletarComentario)

            deletarComentario.jsonTarefa = tarefa
            deletarComentario.comentario = comentario

            deletarComentario.addEventListener('click', excluirComentario)
        }
        postComentario.replaceChildren(fotoComentario, conteudoComentario)
        postComentarios.appendChild(postComentario)
    })

    const tarefaTimeline = document.createElement('div')
    tarefaTimeline.classList.add('tarefa-timeline')
    tarefaTimeline.replaceChildren(postContainer,postComentarios)

    containerTimeline.appendChild(tarefaTimeline)

}

//carregar as tarefas na página inicial, dependendo do premium e dos usuários seguidos
 const carregarTarefas = async (usuario, usuarios) =>{
     const tarefas = await getTarefas()
     tarefas.forEach(tarefa =>{
         if(tarefa.idUsuario == usuarioId){
            criarTarefa(tarefas, tarefa)
         }
     })
 }

 const carregarTarefasTimeline = async(usuarios) =>{

    let usuario = await getUsuario(usuarioId) 
    const tarefas = await getTarefas()
    
    tarefas.forEach(tarefa =>{
        usuario.seguindo.forEach(seguindoId =>{
            if(tarefa.idUsuario == seguindoId){
                if(tarefa.publico)
                criarTarefaTimeline(tarefa, usuarios)
            }
        })
    })

 }

//identificar o usuário e suas permissões
 const carregarUsuario = async () =>{
     const usuarios = await getUsuarios()
     usuarios.forEach(usuario =>{
        if(usuario.id == usuarioId){
            let nomeUsuario = usuario.nome.split(" ")
            let campoNomeUsuario = document.getElementById('nomeUsuario')
            campoNomeUsuario.textContent = nomeUsuario[0]
            criarRecomendados(usuario)

            carregarTarefasTimeline(usuarios)
            if(usuario.premium){
                carregarTarefas(usuario, usuarios)
            }else{
                bloquearPremium()
            }
        }
     })
 }

 //identificar a data atual
const getDataAtual = () =>{
    let dataAtual = new Date().toLocaleDateString()
    return dataAtual
}

const criarRecomendados = async (usuarioAtual) =>{

    let usuarios = await getUsuarios()

    const menu = document.getElementById('menu')
    
    usuarios.forEach(usuario =>{
        if(usuarioAtual.seguindo.includes(usuario.id) || usuarioAtual.seguindo.includes(usuario.id.toString()) || usuarioAtual.id == usuario.id){
           
        }else{
            let recomendado = document.createElement('a')
            recomendado.href = '../perfil/perfil.html'
            recomendado.style.backgroundImage =`url(../img/usuario.webp)`
            recomendado.addEventListener('click', () => {
                idPerfil = usuario.id
                localStorage.setItem('idPerfil', idPerfil)
    
            })
            menu.appendChild(recomendado)
        }
    })

}


//chamar as funções iniciais
getDataAtual()
carregarUsuario()