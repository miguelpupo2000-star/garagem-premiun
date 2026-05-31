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
    barraPotencia: "75%"
  },
  lambo: {
    nome: "Lamborghini Huracán",
    descricao: "Performance visceral embalada por um design geométrico agressivo. Sinta o urro do motor V10 aspirado despejando tração integral direto no asfalto.",
    velocidade: "325 KM/H",
    aceleracao: "3.0s",
    potencia: "640 CV",
    barraVelocidade: "90%",
    barraAceleracao: "97%",
    barraPotencia: "85%"
  },
  ferrari: {
    nome: "Ferrari SF90 Stradale",
    descricao: "A revolução híbrida de Maranello. Combinando um motor V8 Biturbo com três motores elétricos para entregar uma aceleração brutal de hipercarro.",
    velocidade: "340 KM/H",
    aceleracao: "2.5s",
    potencia: "1000 CV",
    barraVelocidade: "98%",
    barraAceleracao: "100%",
    barraPotencia: "100%"
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
// FUNÇÃO QUE ATUALIZA O PAINEL COM ANIMAÇÃO
// ==================================================
function atualizarShowroom(idCarro) {
  const carro = dadosCarros[idCarro];

  // 1. Efeito visual: Pisca o painel simulando carregamento de dados
  painelTelemetria.style.opacity = '0.3';
  painelTelemetria.style.transform = 'scale(0.99)';
  painelTelemetria.style.transition = 'all 0.2s ease';

  // 2. Reseta a largura das barras para dar o efeito de subir do zero
  barVelocidade.style.width = '0%';
  barAceleracao.style.width = '0%';
  barPotencia.style.width = '0%';

  // 3. Espera o efeito de sumir terminar para injetar os novos dados técnicos
  setTimeout(() => {
    // Troca os textos do painel
    painelNome.textContent = carro.nome;
    painelDesc.textContent = carro.descricao;
    txtVelocidade.textContent = carro.velocidade;
    txtAceleracao.textContent = carro.aceleracao;
    txtPotencia.textContent = carro.potencia;

    // Restaura a opacidade do painel
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
    // Se o card já estiver ativo, ignora o clique
    if (card.classList.contains('active')) return;

    // Remove a borda acesa vermelha de todos os cards
    cards.forEach(c => c.classList.remove('active'));

    // Acende em vermelho apenas o card que foi clicado
    card.classList.add('active');

    // Pega o nome do carro guardado no atributo "data-car" do HTML
    const carroSelecionado = card.getAttribute('data-car');

    // Chame a função para atualizar a tela
    atualizarShowroom(carroSelecionado);
  });
});

// ==================================================
// DISPARO INICIAL (Carrega o Porsche ao abrir o site)
// ==================================================
document.addEventListener('DOMContentLoaded', () => {
  // Anima as barras do primeiro carro logo após o carregamento da página
  setTimeout(() => {
    barVelocidade.style.width = dadosCarros.porsche.barraVelocidade;
    barAceleracao.style.width = dadosCarros.porsche.barraAceleracao;
    barPotencia.style.width = dadosCarros.porsche.barraPotencia;
  }, 300);
});
