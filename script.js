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
    freqBase: 44,       // Giro inicial padrão do Boxer
    multiplicador: 6.5, // Grita super agudo (alta rotação de 9.000 RPM)
    tipoOnda: "sawtooth",
    filtro: 450
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
    freqBase: 36,       // Tom mais grosso para o bloco V10 grande
    multiplicador: 4.8, // Sobe o giro forte e metálico
    tipoOnda: "sawtooth",
    filtro: 320         // Filtro mais fechado para encorpar o som
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
    freqBase: 26,       // V8 Bi-turbo muito grave e encorpado por causa dos turbos
    multiplicador: 3.5, // Arrancada brutal com subida de rotação curta e cheia de torque
    tipoOnda: "triangle", // Onda mais aveludada simulando o fluxo dos turbos
    filtro: 260         // Som abafado e muito forte de escapamento grosso
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
// ENGINE DE SOM CUSTOMIZADA PARA CADA MOTOR
// ==================================================
function simularAceleracaoMotor(idCarro) {
  const carro = dadosCarros[idCarro];
  
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const mainGain = audioCtx.createGain();
    const lowpass = audioCtx.createBiquadFilter();

    // Injeta a configuração exclusiva da identidade de cada marca
    osc1.type = carro.tipoOnda;
    osc2.type = "sawtooth"; // Garante o atrito metálico do escape
    
    let fInicial = carro.freqBase;
    osc1.frequency.setValueAtTime(fInicial, audioCtx.currentTime);
    osc2.frequency.setValueAtTime(fInicial * 1.5, audioCtx.currentTime);

    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(carro.filtro, audioCtx.currentTime);

    mainGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    mainGain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.1);

    osc1.connect(lowpass);
    osc2.connect(lowpass);
    lowpass.connect(mainGain);
    mainGain.connect(audioCtx.destination);

    osc1.start();
    osc2.start();

    // A MÁGICA: Cada carro agora multiplica e abre o filtro no seu próprio ritmo mecânico
    osc1.frequency.linearRampToValueAtTime(fInicial * carro.multiplicador, audioCtx.currentTime + 1.4);
    osc2.frequency.linearRampToValueAtTime((fInicial * 1.5) * (carro.multiplicador * 0.9), audioCtx.currentTime + 1.4);
    lowpass.frequency.linearRampToValueAtTime(carro.filtro + 1200, audioCtx.currentTime + 1.4);

    // Alivia o pé do acelerador gerando o corte rápido
    osc1.frequency.linearRampToValueAtTime(fInicial, audioCtx.currentTime + 1.9);
    osc2.frequency.linearRampToValueAtTime(fInicial * 1.5, audioCtx.currentTime + 1.9);
    mainGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 2.0);

    setTimeout(() => {
      osc1.stop();
      osc2.stop();
      audioCtx.close();
    }, 2000);

  } catch (error) {
    console.log("Aguardando interação física.");
  }
}

// ==================================================
// FUNÇÃO QUE ATUALIZA O PAINEL COM ANIMAÇÃO
// ==================================================
function atualizarShowroom(idCarro) {
  const carro = dadosCarros[idCarro];

  painelTelemetria.style.opacity = '0.3';
  painelTelemetria.style.transform = 'scale(0.99)';
  painelTelemetria.style.transition = 'all 0.2s ease';

  barVelocidade.style.width = '0%';
  barAceleracao.style.width = '0%';
  barPotencia.style.width = '0%';

  setTimeout(() => {
    painelNome.textContent = carro.nome;
    painelDesc.textContent = carro.descricao;
    txtVelocidade.textContent = carro.velocidade;
    txtAceleracao.textContent = carro.aceleracao;
    txtPotencia.textContent = carro.potencia;

    painelTelemetria.style.opacity = '1';
    painelTelemetria.style.transform = 'scale(1)';

    setTimeout(() => {
      barVelocidade.style.width = carro.barraVelocidade;
      barAceleracao.style.width = carro.barraAceleracao;
      barPotencia.style.width = carro.barraPotencia;
    }, 100);

  }, 200);
}

// ==================================================
// GERENCIADOR DE CLIQUES
// ==================================================
cards.forEach(card => {
  card.addEventListener('click', () => {
    if (card.classList.contains('active')) return;

    cards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');

    const carroSelecionado = card.getAttribute('data-car');

    atualizarShowroom(carroSelecionado);
    simularAceleracaoMotor(carroSelecionado);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    barVelocidade.style.width = dadosCarros.porsche.barraVelocidade;
    barAceleracao.style.width = dadosCarros.porsche.barraAceleracao;
    barPotencia.style.width = dadosCarros.porsche.barraPotencia;
  }, 300);
});
