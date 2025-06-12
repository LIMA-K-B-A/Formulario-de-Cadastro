// Array para armazenar os participantes
let participantes = [];

// Função para mostrar notificações
function mostrarNotificacao(mensagem, tipo = 'success') {
    const notificacao = document.createElement('div');
    notificacao.className = `notification ${tipo}`;
    notificacao.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
            <span>${mensagem}</span>
        </div>
    `;
    document.body.appendChild(notificacao);

    // Adicionar efeito de digitação
    const texto = notificacao.querySelector('span');
    texto.classList.add('typing-effect');

    setTimeout(() => {
        notificacao.style.opacity = '0';
        setTimeout(() => notificacao.remove(), 5000);
    }, 5000);
}

// Função para atualizar a data e hora
function atualizarDataHora() {
    const dataHoraElement = document.getElementById('data-hora');
    const agora = new Date();
    const opcoes = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    // Adicionar efeito de digitação
    dataHoraElement.classList.add('typing-effect');
    dataHoraElement.textContent = agora.toLocaleDateString('pt-BR', opcoes);
}

// Função para mostrar mensagem de boas-vindas
function mostrarBoasVindas() {
    const hora = new Date().getHours();
    let mensagem = '';

    if (hora >= 5 && hora < 12) {
        mensagem = 'Bom dia!';
    } else if (hora >= 12 && hora < 18) {
        mensagem = 'Boa tarde!';
    } else {
        mensagem = 'Boa noite!';
    }

    // Adicionar efeito de digitação
    const titulo = document.querySelector('h1');
    titulo.classList.add('glitch-text');

    mostrarNotificacao(`${mensagem} Bem-vindo ao HackCon!`);
}

// Função para criar elemento de participante
function criarElementoParticipante(participante) {
    const div = document.createElement('div');
    div.className = `participante ${participante.tipoIngresso} hover-card`;

    const iconeTipo = {
        'vip': 'fa-crown text-yellow-500',
        'convidado': 'fa-user-tie text-green-500',
        'padrao': 'fa-user text-blue-500'
    }[participante.tipoIngresso];

    const conteudo = `
        <div class="flex items-start justify-between">
            <div class="flex-1">
                <h3 class="text-xl font-mono text-green-500 mb-2">
                    <i class="fas ${iconeTipo} mr-2"></i>
                    ${participante.nome}
                </h3>
                <p class="text-green-400/80 mb-1">
                    <i class="fas fa-envelope text-green-500 mr-2"></i>
                    ${participante.email}
                </p>
                <p class="text-green-400/80 mb-1">
                    <i class="fas ${participante.presenca ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500'} mr-2"></i>
                    Presença: ${participante.presenca ? 'Confirmada' : 'Não confirmada'}
                </p>
                <p class="text-green-400/80 mb-1">
                    <i class="fas fa-ticket-alt text-green-500 mr-2"></i>
                    Tipo de ingresso: ${participante.tipoIngresso.toUpperCase()}
                </p>
                ${participante.novidades ? `
                    <p class="text-green-400/80">
                        <i class="fas fa-star text-yellow-500 mr-2"></i>
                        Interesse em: ${participante.assuntos.join(', ')}
                    </p>
                ` : ''}
            </div>
            <button class="btn-remover bg-red-500/20 text-red-500 px-3 py-1 rounded hover:bg-red-500/30 transition-colors border border-red-500/30" 
                    data-email="${participante.email}">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;

    div.innerHTML = conteudo;

    // Adicionar efeito de brilho
    div.classList.add('glow');

    return div;
}

// Função para atualizar a lista de participantes
function atualizarListaParticipantes() {
    const container = document.getElementById('participantes-container');
    container.innerHTML = '';

    if (participantes.length === 0) {
        container.innerHTML = `
            <div class="text-center text-green-400/80 py-8">
                <i class="fas fa-users text-4xl mb-4"></i>
                <p class="typing-effect">Nenhum participante registrado.</p>
            </div>
        `;
        return;
    }

    participantes.forEach(participante => {
        const elemento = criarElementoParticipante(participante);
        container.appendChild(elemento);
    });
}

// Função para validar o formulário
function validarFormulario(formData) {
    const nome = formData.get('nome');
    const email = formData.get('email');
    const tipoIngresso = formData.get('tipo-ingresso');

    if (!nome || !email || !tipoIngresso) {
        mostrarNotificacao('Por favor, preencha todos os campos obrigatórios.', 'error');
        return false;
    }

    if (!email.includes('@')) {
        mostrarNotificacao('Por favor, insira um e-mail válido.', 'error');
        return false;
    }

    // Verificar se o e-mail já está cadastrado
    if (participantes.some(p => p.email === email)) {
        mostrarNotificacao('Este e-mail já está cadastrado.', 'error');
        return false;
    }

    return true;
}

// Função para lidar com o envio do formulário
function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    if (!validarFormulario(formData)) {
        return;
    }

    const participante = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        presenca: formData.get('presenca') === 'on',
        tipoIngresso: formData.get('tipo-ingresso'),
        novidades: formData.get('novidades') === 'on',
        assuntos: formData.getAll('assuntos')
    };

    participantes.push(participante);
    console.log('Novo participante cadastrado:', participante);

    atualizarListaParticipantes();
    form.reset();
    document.getElementById('assuntos-interesse').classList.add('hidden');

    mostrarNotificacao('Participante registrado com sucesso!');
}

// Função para lidar com a remoção de participante
function handleRemoverParticipante(event) {
    if (event.target.closest('.btn-remover')) {
        const email = event.target.closest('.btn-remover').dataset.email;
        if (confirm('Tem certeza que deseja remover este participante?')) {
            participantes = participantes.filter(p => p.email !== email);
            atualizarListaParticipantes();
            mostrarNotificacao('Participante removido com sucesso!');
        }
    }
}

// Função para mostrar/ocultar campo de assuntos
function toggleAssuntosInteresse(event) {
    const assuntosDiv = document.getElementById('assuntos-interesse');
    if (event.target.checked) {
        assuntosDiv.classList.remove('hidden');
        assuntosDiv.style.animation = 'fadeIn 0.3s ease-out';
    } else {
        assuntosDiv.classList.add('hidden');
    }
}

// Função para lidar com o menu mobile
function toggleMenuMobile() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
}

// Função para adicionar efeito de digitação
function adicionarEfeitoDigitacao(elemento, texto) {
    let i = 0;
    elemento.textContent = '';

    function digitar() {
        if (i < texto.length) {
            elemento.textContent += texto.charAt(i);
            i++;
            setTimeout(digitar, 100);
        }
    }

    digitar();
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar mensagem de boas-vindas
    mostrarBoasVindas();

    // Atualizar data e hora inicialmente e a cada minuto
    atualizarDataHora();
    setInterval(atualizarDataHora, 60000);

    // Configurar eventos
    const form = document.getElementById('cadastro-form');
    form.addEventListener('submit', handleSubmit);

    const novidadesCheckbox = document.getElementById('novidades');
    novidadesCheckbox.addEventListener('change', toggleAssuntosInteresse);

    const participantesContainer = document.getElementById('participantes-container');
    participantesContainer.addEventListener('click', handleRemoverParticipante);

    const menuButton = document.getElementById('menuButton');
    menuButton.addEventListener('click', toggleMenuMobile);

    // Atualizar lista de participantes ao carregar a página
    atualizarListaParticipantes();

    // Adicionar efeito de loading ao carregar a página
    document.body.classList.add('loading');
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 1000);

    // Adicionar efeito de digitação nos títulos
    const titulos = document.querySelectorAll('h1, h2');
    titulos.forEach(titulo => {
        const texto = titulo.textContent;
        adicionarEfeitoDigitacao(titulo, texto);
    });
}); 