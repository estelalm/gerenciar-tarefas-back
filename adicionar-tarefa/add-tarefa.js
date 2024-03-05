

const tituloInput = document.getElementById('titulo')
const conclusaoInput = document.getElementById('dataConclusao')


const botaoAdicionar = document.getElementById('adicionar')

let usuarioId = localStorage.getItem('usuarioId')

async function getTarefas() {
    const responseApi = await fetch('http://localhost:5080/tarefas')
    const listaTarefas = responseApi.json();

    return listaTarefas
}


const adicionarTarefa = () => {

    let tituloTarefa = tituloInput.value
    let conclusaoTarefa = conclusaoInput.value.split('-').reverse().join('/')

    const privado = document.getElementById('privado')
    const publico = document.getElementById('publico')

    if (tituloTarefa == "" || conclusaoTarefa == ""){
        alert('Preencha todos os campos!')
    } else {
        if(privado.checked || publico.checked){
            alert('Tarefa Criada Com sucesso')

            let idTarefa
            let tarefas = getTarefas().then(tarefasArray => {
    
                idTarefa = tarefasArray.length++
    
    
            })
    
            let ePremium
    
            if (privado.checked) {
                ePremium = false
            }
            if (publico.checked) {
                ePremium = true
            }
    
            let tarefaJSON = {
                "id": idTarefa,
                "descricao": tituloTarefa,
                "dataConclusão": conclusaoTarefa,
                "publico": ePremium,
                "idUsuario": usuarioId,
                "comentarios": []
            }
            fetch('http://localhost:5080/tarefas', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(tarefaJSON)
            })
    
            window.location.reload()
        }
        
    }
}

botaoAdicionar.addEventListener('click', adicionarTarefa)