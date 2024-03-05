'use strict' 

async function getUsuarios() {
    const responseApi = await fetch('http://localhost:5080/usuario')
    const listaUsuario = responseApi.json();

    return listaUsuario
}

const botaoEntrar= document.getElementById('criar')

const criarConta = () =>{


    let nomeUsuario = document.getElementById('nome').value
    let emailUsuario =  document.getElementById('email').value
    let senhaUsuario = document.getElementById('senha').value
    let senhaConfirmada = document.getElementById('confirma-senha').value

    if(nomeUsuario == "" || emailUsuario == "" || senhaUsuario == ""|| senhaConfirmada == ""){
        alert('Preencha todos os campos!')
    }else if(!(senhaUsuario == senhaConfirmada)){
        alert('As senhas devem ser iguais')
    } else {
        alert('Conta criada, voltando para a página de Login.')

        let userId
       let usuarioJSON = {}
        getUsuarios().then(usuariosArray =>{
        userId = usuariosArray.length++
    })
        usuarioJSON = {
            "id": userId,
            "nome": nomeUsuario,
            "email": emailUsuario,
            "senha": senhaUsuario,
            "imagem": null,
            "premium": false,
            "seguindo": [ ]
        }

         fetch('http://localhost:5080/usuario' , {
            method: 'POST', 
            headers:{
            'content-type': 'application/json',
            }, 
            body: JSON.stringify(usuarioJSON)
            })
            
        window.location.assign('../index.html')
    }
}

botaoEntrar.addEventListener('click', criarConta)