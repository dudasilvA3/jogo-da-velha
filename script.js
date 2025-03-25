let tabuleiro = ['', '', '', '', '', '', '', '', '']; 
let vezJogador = 'X';
let jogoAtivo = true; 
let placar = JSON.parse(sessionStorage.getItem('placar')) || { jogador1: 0, jogador2: 0 };
const placarElementos = document.querySelectorAll('.placar span');

function atualizarPlacar() {
    placarElementos[0].textContent = placar.jogador1;
    placarElementos[1].textContent = placar.jogador2;
    sessionStorage.setItem('placar', JSON.stringify(placar)); 
}

function jogar(posicao) {
    if (tabuleiro[posicao] || !jogoAtivo) return; // Se a célula já estiver preenchida ou o jogo estiver terminado, nada acontece

    tabuleiro[posicao] = vezJogador;
    document.querySelector(`button[data-pos='${posicao}']`).textContent = vezJogador;

    const resultado = verificarVitoria();

    if (resultado) {
        jogoAtivo = false; // Finaliza o jogo
        if (resultado === 'X') {
            placar.jogador1++;
        } else if (resultado === 'O') {
            placar.jogador2++;
        } else {
            placar.jogador1++;
            placar.jogador2++;
        }
        sessionStorage.setItem('placar', JSON.stringify(placar)); // Atualiza o placar no sessionStorage
        atualizarPlacar(); // Atualiza o placar na interface
        desabilitarBotoes(); // Desabilita os botões
        
        // Exibe a caixa de diálogo perguntando se o jogador quer jogar novamente
        if (window.confirm('O jogo terminou! Quer jogar novamente?')) {
            reiniciarJogo(); // Reinicia a partida sem alterar o placar
        }
        return;
    }

    // Alterna entre os jogadores
    vezJogador = vezJogador === 'X' ? 'O' : 'X';
}
function verificarVitoria() {
    const combinacoes = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < combinacoes.length; i++) {
        const [a, b, c] = combinacoes[i];
        if (tabuleiro[a] && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c]) {
            return tabuleiro[a]; // Retorna 'X' ou 'O'
        }
    }

    return tabuleiro.includes('') ? null : 'empate'; // Se não houver vitória e não houver mais espaços, é empate
}
function reiniciarJogo() {
    tabuleiro = ['', '', '', '', '', '', '', '', '']; // Limpa o tabuleiro
    vezJogador = 'X'; // Reseta a vez do jogador para 'X'
    jogoAtivo = true; // O jogo volta a estar ativo

    // Limpa os botões
    botoes.forEach(botao => {
        botao.textContent = '';
    });

    habilitarBotoes(); // Habilita os botões novamente
}
const botoes = document.querySelectorAll('button[data-pos]');

function desabilitarBotoes() {
    botoes.forEach(botao => {
        botao.disabled = true;
    });
}

function habilitarBotoes() {
    botoes.forEach(botao => {
        botao.disabled = false;
    });
}
botoes.forEach(botao => {
    botao.addEventListener('click', (e) => {
        const posicao = e.target.dataset.pos;
        jogar(posicao);
    });
});

document.getElementById('reiniciar').addEventListener('click', reiniciarJogo);

// Inicializa o placar na interface
atualizarPlacar();