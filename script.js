// ==================================================
// BANCO DE DADOS DOS SUPERCARROS (FICHA TÉCNICA)
// ==================================================
const dadosCarros = {
  porsche: {
    nome: "Porsche 911 GT3 RS",
    descricao: "O ápice da engenharia de pista homologado para as ruas. Motor aspirado de alta rotação, embreagem dupla PDK e um sistema de aerodinâmica ativa extrema.",
    velocidade: "312 KM/H",
    aceleracao: "3.2s",
    potencia: "525 CV",
    barraVelocidade: "85%",
    barraAceleracao: "95%",
    barraPotencia: "75%",
    freqBase: 35, // Frequência do motor Boxer
    tipoOnda: "sawtooth"
  },
  lambo: {
    nome: "Lamborghini Huracán",
    descricao: "Performance visceral embalada por um design geométrico agressivo. Sinta o urro do motor V10 aspirado despejando tração integral direto no asfalto.",
    velocidade: "325 KM/H",
    aceleracao: "3.0s",
    potencia: "640 CV",
    barraVelocidade: "90%",
    barraAceleracao: "97%",
    barraPotencia: "85%",
    freqBase: 42, // Frequência do motor V10
    tipoOnda: "sawtooth"
  },
  ferrari: {
    nome: "Ferrari SF90 Stradale",
    descricao: "A revolução híbrida de Maranello. Combinando um motor V8 Biturbo com três motores elétricos para entregar uma aceleração brutal de hipercarro.",
    velocidade: "340 KM/H",
    aceleracao: "2.5s",
    potencia: "1000 CV",
    barraVelocidade: "98%",
    barraAceleracao: "100%",
    barraPotencia: "100%",
    freqBase: 28, // Frequência do motor V8 Bi-turbo
    tipoOnda: "triangle"
  }
};

// ==================================================
// MAPEAMENTO DOS ELEMENTOS DO HTML
// ==================================================
const cards = document.querySelectorAll('.car-card');
const painelNome = document.getElementById('car-nome');
const painelDesc = document.getElementById('car-descricao');
const txtVelocidade = document.getElementById('txt-velocidade');
const txtAceleracao = document.getElementById('txt-aceleracao');
const txtPotencia = document.getElementById('txt-potencia');

const barVelocidade = document.getElementById('bar-velocidade');
const barAceleracao = document.getElementById('bar-aceleracao');
const barPotencia = document.getElementById('bar-potencia');
const painelTelemetria = document.querySelector('.telemetria-panel');

// ==================================================
// ENGINE DE SOM TRIDIMENSIONAL NATIVA (SEM ARQUIVOS)
// ==================================================
function simularAceleracaoMotor(idCarro) {
  const carro = dadosCarros[idCarro];
  
  try {
    // Inicializa o contexto de áudio do navegador na hora do clique
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const mainGain = audioCtx.createGain();
    const lowpass = audioCtx.createBiquadFilter();

    // Configura o tipo de ronco baseado no motor escolhido
    osc1.type = carro.tipoOnda;
    osc2.type = "sawtooth";
    
    // Frequência de marcha lenta inicial
    let fInicial = carro.freqBase;
    osc1.frequency.setValueAtTime(fInicial, audioCtx.currentTime);
    osc2.frequency.setValueAtTime(fInicial * 2, audioCtx.currentTime);

    // Filtro acústico para encorpar o som
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(350, audioCtx.currentTime);

    // Volume seguro e limpo
    mainGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    mainGain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.1);

    // Conexões
    osc1.connect(lowpass);
    osc2.connect(lowpass);
    lowpass.connect(mainGain);
    mainGain.connect(audioCtx.destination);

    osc1.start();
    osc2.start();

    // SIMULAÇÃO DA ARRANCADA: Sobe o giro e abre o filtro durante 1.5 segundos
    osc1.frequency.linearRampToValueAtTime(fInicial * 5, audioCtx.currentTime + 1.5);
    osc2.frequency.linearRampToValueAtTime((fInicial * 2) * 4, audioCtx.currentTime + 1.5);
    lowpass.frequency.linearRampToValueAtTime(1500, audioCtx.currentTime + 1.5);

    // Alivia o pé do acelerador no final (desaceleração rápida)
    osc1.frequency.linearRampToValueAtTime(fInicial, audioCtx.currentTime + 2.0);
    osc2.frequency.linearRampToValueAtTime(fInicial * 2, audioCtx.currentTime + 2.0);
    mainGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 2.0);

    // Desliga totalmente os osciladores e limpa a memória do processador após 2 segundos
    setTimeout(() => {
      osc1.stop();
      osc2.stop();
      audioCtx.close();
    }, 2000);

  } catch (error) {
    console.log("Navegador aguardando interação física completa.");
  }
}

// ==================================================
// FUNÇÃO QUE ATUALIZA O PAINEL COM ANIMAÇÃO
// ==================================================
function atualizarShowroom(idCarro) {
  const carro = dadosCarros[idCarro];

  // Efeito visual: Pisca o painel simulando carregamento de dados
  painelTelemetria.style.opacity = '0.3';
  painelTelemetria.style.transform = 'scale(0.99)';
  painelTelemetria.style.transition = 'all 0.2s ease';

  // Reseta a largura das barras para dar o efeito de subir do zero
  barVelocidade.style.width = '0%';
  barAceleracao.style.width = '0%';
  barPotencia.style.width = '0%';

  // Espera o efeito de sumir terminar para injetar os novos dados técnicos
  setTimeout(() => {
    painelNome.textContent = carro.nome;
    painelDesc.textContent = carro.descricao;
    txtVelocidade.textContent = carro.velocidade;
    txtAceleracao.textContent = carro.aceleracao;
    txtPotencia.textContent = carro.potencia;

    painelTelemetria.style.opacity = '1';
    painelTelemetria.style.transform = 'scale(1)';

    // Injeta as novas larguras fazendo as barras dispararem com animação fluida
    setTimeout(() => {
      barVelocidade.style.width = carro.barraVelocidade;
      barAceleracao.style.width = carro.barraAceleracao;
      barPotencia.style.width = carro.barraPotencia;
    }, 100);

  }, 200);
}

// ==================================================
// GERENCIADOR DE CLIQUES NOS CARDS DE SELEÇÃO
// ==================================================
cards.forEach(card => {
  card.addEventListener('click', () => {
    if (card.classList.contains('active')) return;

    cards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');

    const carroSelecionado = card.getAttribute('data-car');

    // Executa as duas ações juntas no mesmo clique: atualiza a tela e bessa o motor
    atualizarShowroom(carroSelecionado);
    simularAceleracaoMotor(carroSelecionado);
  });
});

// ==================================================
// DISPARO INICIAL (Carrega o Porsche ao abrir o site)
// ==================================================
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    barVelocidade.style.width = dadosCarros.porsche.barraVelocidade;
    barAceleracao.style.width = dadosCarros.porsche.barraAceleracao;
    barPotencia.style.width = dadosCarros.porsche.barraPotencia;
  }, 300);
});
