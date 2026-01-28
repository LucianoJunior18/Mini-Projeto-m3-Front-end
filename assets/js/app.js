
// Configuracao  da api


const CONFIG_API = {
    urlBase: 'https://api-to-do-list-a7xp.onrender.com',
    endpoints: {
        tarefas: '/tasks'
    }
};


let todasTarefas = [];
let filtroAtual = 'todas';
let tarefaParaDeletar = null;


// elementos do dom


const elementos = {
    formulario: document.getElementById('formTarefa'),
    inputTitulo: document.getElementById('titulo'),
    inputDescricao: document.getElementById('descricao'),
    contadorCaracteres: document.querySelector('.contador-caracteres'),
    listaTarefas: document.getElementById('listaTarefas'),
    estadoCarregando: document.getElementById('estadoCarregando'),
    estadoErro: document.getElementById('estadoErro'),
    estadoVazio: document.getElementById('estadoVazio'),
    mensagemErro: document.getElementById('mensagemErro'),
    botoesFiltro: document.querySelectorAll('.botao-filtro'),
    contadorTodas: document.getElementById('contadorTodas'),
    contadorPendentes: document.getElementById('contadorPendentes'),
    contadorConcluidas: document.getElementById('contadorConcluidas'),
    modal: document.getElementById('modalConfirmacao'),
    botaoConfirmarExclusao: document.getElementById('confirmarExclusao'),
    notificacao: document.getElementById('notificacao'),
    mensagemNotificacao: document.getElementById('mensagemNotificacao')
};



document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
});

function inicializarApp() {
    // Esconder notificação ao carregar página
    elementos.notificacao.classList.add('escondido');
    elementos.notificacao.style.display = 'none';

    carregarTema();

    configurarEventos();
    carregarTarefas();
}


// eventos


function configurarEventos() {
    elementos.formulario.addEventListener('submit', criarNovaTarefa);
    elementos.inputDescricao.addEventListener('input', atualizarContador);

    elementos.botoesFiltro.forEach(function(botao) {
        botao.addEventListener('click', function() {
            mudarFiltro(botao.dataset.filtro);
        });
    });

    elementos.botaoConfirmarExclusao.addEventListener('click', confirmarExclusao);

    elementos.modal.addEventListener('click', function(e) {
        if (e.target === elementos.modal) {
            fecharModal();
        }
    });

    document.addEventListener('keydown', atalhosTeclado);
}


// requisicoes da API


async function fazerRequisicao(endpoint, opcoes = {}) {
    const url = `${CONFIG_API.urlBase}${endpoint}`;

    const opcoesDefault = {
        headers: {
            'Content-Type': 'application/json',
        },
        ...opcoes
    };

    try {
        const resposta = await fetch(url, opcoesDefault);

        if (!resposta.ok) {
            let mensagemErro = `Erro ${resposta.status}`;
            try {
                const corpo = await resposta.json();
                mensagemErro = corpo.mensagem || corpo.message || mensagemErro;
            } catch (e) {
                // se não conseguir ler o JSON  usa a mensagem padrão
            }
            throw new Error(mensagemErro);
        }

        const tipoConteudo = resposta.headers.get('content-type');
        if (tipoConteudo && tipoConteudo.includes('application/json')) {
            return await resposta.json();
        }

        return null;
    } catch (erro) {
        console.error('Erro na requisição:', erro);
        throw erro;
    }
}

async function buscarTarefas() {
    return await fazerRequisicao(CONFIG_API.endpoints.tarefas, {
        method: 'GET'
    });
}

async function criarTarefa(dadosTarefa) {
    return await fazerRequisicao(CONFIG_API.endpoints.tarefas, {
        method: 'POST',
        body: JSON.stringify(dadosTarefa)
    });
}

async function atualizarTarefa(idTarefa, dadosTarefa) {
    return await fazerRequisicao(`${CONFIG_API.endpoints.tarefas}/${idTarefa}`, {
        method: 'PUT',
        body: JSON.stringify(dadosTarefa)
    });
}

async function deletarTarefa(idTarefa) {
    return await fazerRequisicao(`${CONFIG_API.endpoints.tarefas}/${idTarefa}`, {
        method: 'DELETE'
    });
}

async function atualizarStatusTarefa(idTarefa, status) {
    return await fazerRequisicao(`${CONFIG_API.endpoints.tarefas}/${idTarefa}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
    });
}


// carregar tarefas


async function carregarTarefas() {
    mostrarCarregando();
    esconderErro();

    try {
        const dados = await buscarTarefas();
        todasTarefas = Array.isArray(dados) ? dados : (dados.tarefas || dados.tasks || []);

        renderizarTarefas();
        atualizarContadores();
        esconderCarregando();
    } catch (erro) {
        console.error('Erro ao carregar tarefas:', erro);
        esconderCarregando();
        mostrarErro('Não foi possível carregar as tarefas. Verifique sua conexão.');
    }
}


// renderizar tarefas


function renderizarTarefas() {
    const tarefasFiltradas = obterTarefasFiltradas();
    elementos.listaTarefas.innerHTML = '';

    if (tarefasFiltradas.length === 0) {
        mostrarVazio();
        return;
    }

    esconderVazio();

    tarefasFiltradas.forEach(function(tarefa) {
        const cardTarefa = criarCardTarefa(tarefa);
        elementos.listaTarefas.appendChild(cardTarefa);
    });
}

function criarCardTarefa(tarefa) {
    const card = document.createElement('article');
    card.setAttribute('role', 'listitem');
    card.dataset.idTarefa = tarefa.id;

    const estaConcluida = tarefa.status === "done";
    card.className = `card-tarefa ${estaConcluida ? 'concluida' : ''}`;

    card.innerHTML = `
        <div class="cabecalho-tarefa">
            <div class="checkbox-tarefa ${estaConcluida ? 'marcado' : ''}"
                role="checkbox"
                aria-checked="${estaConcluida}"
                tabindex="0"
                data-id="${tarefa.id}">
            </div>
            <div class="conteudo-tarefa">
                <h3 class="titulo-tarefa">${escaparHtml(tarefa.title || tarefa.titulo)}</h3>
                <p class="descricao-tarefa">${escaparHtml(tarefa.description || tarefa.descricao)}</p>
            </div>
        </div>
        <div class="rodape-tarefa">
            <span class="status-tarefa ${estaConcluida ? 'concluida' : 'pendente'}">
                <i class="fas ${estaConcluida ? 'fa-check-circle' : 'fa-clock'}"></i>
                ${estaConcluida ? 'Concluída' : 'Pendente'}
            </span>
            <div class="acoes-tarefa">
                <button class="botao-icone deletar"
                        aria-label="Deletar tarefa"
                        data-id="${tarefa.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;

    const checkbox = card.querySelector('.checkbox-tarefa');
    const botaoDeletar = card.querySelector('.botao-icone.deletar');

    checkbox.addEventListener('click', function() {
        alternarStatusTarefa(tarefa.id);
    });

    checkbox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            alternarStatusTarefa(tarefa.id);
        }
    });

    botaoDeletar.addEventListener('click', function() {
        abrirModalExclusao(tarefa.id);
    });

    return card;
}


// cria nova tarefa


async function criarNovaTarefa(evento) {
    evento.preventDefault();

    const titulo = elementos.inputTitulo.value.trim();
    const descricao = elementos.inputDescricao.value.trim();

    if (!titulo || !descricao) {
        mostrarNotificacao('Por favor, preencha todos os campos', 'erro');
        return;
    }

    const botaoSubmit = elementos.formulario.querySelector('button[type="submit"]');
    const textoOriginal = botaoSubmit.innerHTML;
    botaoSubmit.disabled = true;
    botaoSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando...';

    try {
        // Calcula data de vencimento (7 dias a partir de hoje)
        const hoje = new Date();
        const dataVencimento = new Date(hoje);
        dataVencimento.setDate(hoje.getDate() + 7);

        const dia = String(dataVencimento.getDate()).padStart(2, '0');
        const mes = String(dataVencimento.getMonth() + 1).padStart(2, '0');
        const ano = dataVencimento.getFullYear();

        const novaTarefa = {
            title: titulo,
            description: descricao,
            status: "pending",
            dueDate: `${dia}/${mes}/${ano}`
        };

        await criarTarefa(novaTarefa);

        elementos.formulario.reset();
        atualizarContador();
        await carregarTarefas();

        mostrarNotificacao('Tarefa criada com sucesso!', 'sucesso');
        elementos.inputTitulo.focus();
    } catch (erro) {
        console.error('Erro ao criar tarefa:', erro);
        mostrarNotificacao('Erro ao criar tarefa. Tente novamente.', 'erro');
    } finally {
        botaoSubmit.disabled = false;
        botaoSubmit.innerHTML = textoOriginal;
    }
}


// alterar status


async function alternarStatusTarefa(idTarefa) {
    const tarefa = todasTarefas.find(function(t) {
        return t.id === idTarefa;
    });

    if (!tarefa) return;

    try {
        const novoStatus = tarefa.status === "done" ? "pending" : "done";

        await atualizarStatusTarefa(idTarefa, novoStatus);
        await carregarTarefas();

        const mensagem = novoStatus === "done" ? "concluída" : "pendente";
        mostrarNotificacao(`Tarefa marcada como ${mensagem}`, 'sucesso');
    } catch (erro) {
        console.error('Erro ao atualizar status:', erro);
        mostrarNotificacao('Erro ao atualizar tarefa', 'erro');
    }
}


// deleta tarefa

function abrirModalExclusao(idTarefa) {
    tarefaParaDeletar = idTarefa;
    abrirModal();
}

async function confirmarExclusao() {
    if (!tarefaParaDeletar) return;

    const botao = elementos.botaoConfirmarExclusao;
    const textoOriginal = botao.innerHTML;
    botao.disabled = true;
    botao.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Excluindo...';

    try {
        await deletarTarefa(tarefaParaDeletar);
        await carregarTarefas();

        fecharModal();
        mostrarNotificacao('Tarefa excluída com sucesso', 'sucesso');
    } catch (erro) {
        console.error('Erro ao deletar tarefa:', erro);
        mostrarNotificacao('Erro ao excluir tarefa', 'erro');
    } finally {
        botao.disabled = false;
        botao.innerHTML = textoOriginal;
        tarefaParaDeletar = null;
    }
}


// filtros


function mudarFiltro(filtro) {
    filtroAtual = filtro;

    elementos.botoesFiltro.forEach(function(botao) {
        if (botao.dataset.filtro === filtro) {
            botao.classList.add('ativo');
        } else {
            botao.classList.remove('ativo');
        }
    });

    renderizarTarefas();
}

function obterTarefasFiltradas() {
    if (filtroAtual === 'pendentes') {
        return todasTarefas.filter(function(tarefa) {
            return tarefa.status !== "done";
        });
    }

    if (filtroAtual === 'concluidas') {
        return todasTarefas.filter(function(tarefa) {
            return tarefa.status === "done";
        });
    }

    return todasTarefas;
}


// funcoes de controle


function mostrarCarregando() {
    elementos.estadoCarregando.classList.remove('escondido');
    elementos.listaTarefas.classList.add('escondido');
}

function esconderCarregando() {
    elementos.estadoCarregando.classList.add('escondido');
    elementos.listaTarefas.classList.remove('escondido');
}

function mostrarErro(mensagem) {
    elementos.mensagemErro.textContent = mensagem;
    elementos.estadoErro.classList.remove('escondido');
    elementos.listaTarefas.classList.add('escondido');
}

function esconderErro() {
    elementos.estadoErro.classList.add('escondido');
}

function mostrarVazio() {
    elementos.estadoVazio.classList.remove('escondido');
}

function esconderVazio() {
    elementos.estadoVazio.classList.add('escondido');
}

function abrirModal() {
    elementos.modal.classList.remove('escondido');
    elementos.botaoConfirmarExclusao.focus();
}

function fecharModal() {
    elementos.modal.classList.add('escondido');
    tarefaParaDeletar = null;
}

function mostrarNotificacao(mensagem, tipo) {
    tipo = tipo || 'sucesso';
    
    // remove qualquer timer anterior
    if (window.timerNotificacao) {
        clearTimeout(window.timerNotificacao);
    }
    
    elementos.mensagemNotificacao.textContent = mensagem;
    elementos.notificacao.className = `notificacao ${tipo}`;
    elementos.notificacao.classList.remove('escondido');
    
    // força o display
    elementos.notificacao.style.display = 'flex';

    window.timerNotificacao = setTimeout(function() {
        elementos.notificacao.classList.add('escondido');
        elementos.notificacao.style.display = 'none';
    }, 3000);
}

function atualizarContador() {
    const atual = elementos.inputDescricao.value.length;
    const maximo = elementos.inputDescricao.maxLength;
    elementos.contadorCaracteres.textContent = `${atual}/${maximo}`;
}

function atualizarContadores() {
    const pendentes = todasTarefas.filter(function(t) {
        return t.status !== "done";
    }).length;

    const concluidas = todasTarefas.filter(function(t) {
        return t.status === "done";
    }).length;

    elementos.contadorTodas.textContent = todasTarefas.length;
    elementos.contadorPendentes.textContent = pendentes;
    elementos.contadorConcluidas.textContent = concluidas;
}


function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function atalhosTeclado(e) {
    if (e.key === 'Escape' && !elementos.modal.classList.contains('escondido')) {
        fecharModal();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        elementos.inputTitulo.focus();
    }
}


// alterar tema

const botaoTema = document.getElementById('botaoTema');
const iconeTema = botaoTema.querySelector('i');

// Carregar tema salvo ao iniciar
function carregarTema() {
    const temaSalvo = localStorage.getItem('tema') || 'escuro';
    document.documentElement.setAttribute('data-tema', temaSalvo);
    atualizarIconeTema(temaSalvo);
}

// alterna teema
function alternarTema() {
    const temaAtual = document.documentElement.getAttribute('data-tema') || 'escuro';
    const novoTema = temaAtual === 'escuro' ? 'claro' : 'escuro';
    
    document.documentElement.setAttribute('data-tema', novoTema);
    localStorage.setItem('tema', novoTema);
    atualizarIconeTema(novoTema);
}

function atualizarIconeTema(tema) {
    if (tema === 'claro') {
        iconeTema.className = 'fas fa-sun';
    } else {
        iconeTema.className = 'fas fa-moon';
    }
}


botaoTema.addEventListener('click', alternarTema);



