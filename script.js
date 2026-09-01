// --- Ícones por tipo (categorias removidas para simplificar o app) ---
const ICONE_TIPO = { entrada: '💰', saida: '🛒' };

// --- Estado ---
let lancamentos = [];
let tipoAtual = 'saida';
let filtroAtual = 'todos';
let metaAlvo = null;
let metas = [];
let editandoId = null;
let saldoOculto = false;
let planoAtual = 'free';
let devAtivo = false;
let devPlanoEscolhido = 'ultimate';
let emailUsuario = '';
let fotoUsuario = '';
let limiteGasto = null;
let tokenSessao = '';
let criadoEm = '';
let corEscolhida = 'azul';
let corLivreHex = '#3b82f6';
let layoutAtual = 'poupix';

// --- Chaves de armazenamento ---
const CHAVE_LANCAMENTOS = 'saldo_lancamentos';
const CHAVE_META = 'saldo_meta';
const CHAVE_METAS = 'saldo_metas';
const CHAVE_NOME = 'saldo_nome';
const CHAVE_TEMA = 'saldo_tema';
const CHAVE_OCULTO = 'saldo_oculto';
const CHAVE_PLANO = 'saldo_plano';
const CHAVE_DEV = 'saldo_dev';
const CHAVE_DEV_PLANO = 'saldo_dev_plano';
const CHAVE_EMAIL = 'saldo_email';
const CHAVE_FOTO = 'saldo_foto';
const CHAVE_LIMITE = 'saldo_limite';
const CHAVE_CRIADOEM = 'saldo_criadoem';
const CHAVE_COR = 'saldo_cor';
const CHAVE_COR_HEX = 'saldo_cor_hex';
const CHAVE_LAYOUT = 'saldo_layout';
const CHAVE_TUTORIAL_VISTO = 'saldo_tutorial_visto';
const SENHA_DEV = '***REMOVIDA_DO_FRONT***';
const API_URL = 'https://meu-app-saldo.onrender.com';
const CHAVE_TOKEN = 'saldo_token';
const GOOGLE_CLIENT_ID = '1067162991665-o0md9cklrq9c1tco1qrk1jr9l62d0res.apps.googleusercontent.com';
const AVATAR_PADRAO = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#7b87a3"/>
  <circle cx="50" cy="38" r="18" fill="#c6cbdb"/>
  <path d="M50 60c-24 0-38 14-38 32v8h76v-8c0-18-14-32-38-32z" fill="#c6cbdb"/>
</svg>`);

const CATEGORIAS = {
  comida:     { nome: 'Comida',      icone: '🍔' },
  jogos:      { nome: 'Jogos',       icone: '🎮' },
  transporte: { nome: 'Transporte',  icone: '🚌' },
  lazer:      { nome: 'Lazer',       icone: '🎬' },
  estudos:    { nome: 'Estudos',     icone: '📚' },
  mesada:     { nome: 'Mesada',      icone: '💰' },
  outros:     { nome: 'Outros',      icone: '📦' }
};

// --- Elementos ---
const form = document.getElementById('formLancamento');
const inputDesc = document.getElementById('descricao');
const inputValor = document.getElementById('valor');
const btnsTipo = document.querySelectorAll('.tipo-btn');
const btnSubmit = document.getElementById('btnSubmit');
const blocosMeses = document.getElementById('blocosMeses');
const vazio = document.getElementById('vazio');
const saldoTotalEl = document.getElementById('saldoTotal');
const totalEntradasEl = document.getElementById('totalEntradas');
const totalSaidasEl = document.getElementById('totalSaidas');
const dataAtualEl = document.getElementById('dataAtual');
const filtroBtns = document.querySelectorAll('.filtro-btn');
const listaMetasEl = document.getElementById('listaMetas');
const metasVazioEl = document.getElementById('metasVazio');
const novaMetaNome = document.getElementById('novaMetaNome');
const novaMetaValor = document.getElementById('novaMetaValor');
const btnAddMeta = document.getElementById('btnAddMeta');
const metasAvisoLimiteEl = document.getElementById('metasAvisoLimite');
const metasConcluidasSecao = document.getElementById('metasConcluidasSecao');
const listaMetasConcluidasEl = document.getElementById('listaMetasConcluidas');
const graficoSaidaEl = document.getElementById('topGastos');
const graficoSaidaVazioEl = document.getElementById('topGastosVazio');
const graficoEntradaEl = document.getElementById('topEntradas');
const graficoEntradaVazioEl = document.getElementById('topEntradasVazio');
const btnOcultar = document.getElementById('btnOcultar');
const iconeOlhoAberto = document.getElementById('iconeOlhoAberto');
const iconeOlhoFechado = document.getElementById('iconeOlhoFechado');
const tabsDica = document.getElementById('tabsDica');

// Config / perfil
const configNome = document.getElementById('configNome');
const configEmail = document.getElementById('configEmail');
const configTelefone = document.getElementById('configTelefone');
const configZapOptin = document.getElementById('configZapOptin');
const configTelefoneErro = document.getElementById('configTelefoneErro');
const btnSalvarPerfil = document.getElementById('btnSalvarPerfil');
const btnFoto = document.getElementById('btnFoto');
const inputFoto = document.getElementById('inputFoto');
const perfilFotoImg = document.getElementById('perfilFotoImg');
const perfilFotoPlaceholder = document.getElementById('perfilFotoPlaceholder');

// Plano
const planoAtualNomeEl = document.getElementById('planoAtualNome');
const comparativoPlanosEl = document.getElementById('comparativoPlanos');

// Dev mode
const devStatusEl = document.getElementById('devStatus');
const devSenhaInput = document.getElementById('devSenha');
const btnDevAtivar = document.getElementById('btnDevAtivar');
const btnDevDesativar = document.getElementById('btnDevDesativar');
const devForm = document.getElementById('devForm');

// Recursos Pro/Ultimate
const selectCat = document.getElementById('categoria');
const linhaCategoria = document.getElementById('linhaCategoria');
const linhaRecorrente = document.getElementById('linhaRecorrente');
const checkRecorrente = document.getElementById('checkRecorrente');
const painelBusca = document.getElementById('painelBusca');
const buscaLancamento = document.getElementById('buscaLancamento');
const painelLimite = document.getElementById('painelLimite');
const limiteValorInput = document.getElementById('limiteValor');
const btnSalvarLimite = document.getElementById('btnSalvarLimite');
const limiteAvisoEl = document.getElementById('limiteAviso');

// Perfil no topo
const btnPerfil = document.getElementById('btnPerfil');
const perfilTopoFoto = document.getElementById('perfilTopoFoto');
const perfilTopoInicial = document.getElementById('perfilTopoInicial');
const painelPerfilTopo = document.getElementById('painelPerfilTopo');
const perfilTopoFotoGrande = document.getElementById('perfilTopoFotoGrande');
const perfilTopoPlaceholderGrande = document.getElementById('perfilTopoPlaceholderGrande');
const btnFotoTopo = document.getElementById('btnFotoTopo');
const inputFotoTopo = document.getElementById('inputFotoTopo');
const painelPerfilNome = document.getElementById('painelPerfilNome');
const painelPerfilEmail = document.getElementById('painelPerfilEmail');
const painelPerfilData = document.getElementById('painelPerfilData');
const painelPerfilPlano = document.getElementById('painelPerfilPlano');
const btnPerfilConfig = document.getElementById('btnPerfilConfig');
const btnPerfilSair = document.getElementById('btnPerfilSair');

// Config em tela cheia
const configFullscreen = document.getElementById('configFullscreen');
const btnFecharConfig = document.getElementById('btnFecharConfig');
const configSideItens = document.querySelectorAll('.config-side-item');

// Senha visível
const btnMostrarSenha = document.getElementById('btnMostrarSenha');

// Recorrente com dia
const linhaDiaRecorrente = document.getElementById('linhaDiaRecorrente');
const diaRecorrenteSelect = document.getElementById('diaRecorrente');
const quantosMesesSelect = document.getElementById('quantosMeses');

// Modal de compra
const modalCompra = document.getElementById('modalCompra');
const btnFecharModalCompra = document.getElementById('btnFecharModalCompra');
const tutorialSlides = document.querySelectorAll('.tutorial-slide');
const tutorialPontosEl = document.getElementById('tutorialPontos');
const btnTutorialAnterior = document.getElementById('btnTutorialAnterior');
const btnTutorialProximo = document.getElementById('btnTutorialProximo');
const coresGradeEl = document.getElementById('coresGrade');
const coresExplicaEl = document.getElementById('coresExplica');

// --- Tour de spotlight nos botões reais ---
const tourOverlay = document.getElementById('tourOverlay');
const tourAnel = document.getElementById('tourAnel');
const tourBalao = document.getElementById('tourBalao');
const tourTitulo = document.getElementById('tourTitulo');
const tourTexto = document.getElementById('tourTexto');
const tourPontosEl = document.getElementById('tourPontos');
const btnTourAnterior = document.getElementById('btnTourAnterior');
const btnTourProximo = document.getElementById('btnTourProximo');
const btnTourFechar = document.getElementById('btnTourFechar');

const PASSOS_TOUR = [
  { seletor: '.hero', titulo: '👋 Bem-vindo ao Economix!', texto: 'Esse é o seu saldo: a soma de tudo que você já recebeu menos o que já gastou. Vamos dar uma volta rápida pelo app.' },
  { seletor: '[data-tab="lancar"]', titulo: '➕ Lançar', texto: 'Aqui você anota o que gastou ou recebeu. Escolhe "Gastei" ou "Recebi", marca se é uma dívida quando for o caso, e clica em Adicionar.' },
  { seletor: '[data-tab="meses"]', titulo: '📅 Meses', texto: 'Mostra se cada mês fechou no lucro ou no prejuízo, separadinho por período.' },
  { seletor: '[data-tab="analise"]', titulo: '📊 Análise', texto: 'Suas metas de economia, comparação com o mês passado e os maiores lançamentos.' },
  { seletor: '[data-tab="fixos"]', titulo: '🔁 Fixos', texto: 'Gerencie seus gastos e ganhos que se repetem todo mês, sem lotar sua tela.' },
  { seletor: '#btnPerfil', titulo: '👤 Seu perfil', texto: 'Clica aqui pra ver sua conta, sua foto e a data de criação.' },
  { seletor: '#btnConfig', titulo: '⚙️ Configurações', texto: 'Aqui ficam seu plano, a personalização visual, o modo desenvolvedor e mais. Você pode rever este tutorial quando quiser, aqui dentro.' }
];

let passoTourAtual = 0;

function posicionarTour(indice) {
  const passo = PASSOS_TOUR[indice];
  const alvo = document.querySelector(passo.seletor);
  if (!alvo) { irParaPassoTour(indice + 1); return; }

  const rect = alvo.getBoundingClientRect();
  const folga = 6;

  tourAnel.style.top = (rect.top - folga) + 'px';
  tourAnel.style.left = (rect.left - folga) + 'px';
  tourAnel.style.width = (rect.width + folga * 2) + 'px';
  tourAnel.style.height = (rect.height + folga * 2) + 'px';

  tourTitulo.textContent = passo.titulo;
  tourTexto.textContent = passo.texto;

  // Posiciona o balão embaixo do elemento (ou acima, se não couber)
  const balaoTop = rect.bottom + 16;
  const caberEmbaixo = balaoTop + 180 < window.innerHeight;
  tourBalao.style.top = caberEmbaixo ? balaoTop + 'px' : Math.max(16, rect.top - 190) + 'px';

  let left = rect.left + rect.width / 2 - 130;
  left = Math.max(16, Math.min(left, window.innerWidth - 276));
  tourBalao.style.left = left + 'px';
}

function montarPontosTour() {
  tourPontosEl.innerHTML = '';
  PASSOS_TOUR.forEach((_, i) => {
    const ponto = document.createElement('span');
    ponto.className = 'tutorial-ponto' + (i === passoTourAtual ? ' ativo' : '');
    tourPontosEl.appendChild(ponto);
  });
}

function irParaPassoTour(indice) {
  if (indice >= PASSOS_TOUR.length) {
    fecharTour();
    return;
  }
  passoTourAtual = indice;
  posicionarTour(indice);
  montarPontosTour();
  btnTourAnterior.style.visibility = indice === 0 ? 'hidden' : 'visible';
  const ultimo = indice === PASSOS_TOUR.length - 1;
  btnTourProximo.style.display = ultimo ? 'none' : 'inline-block';
  btnTourFechar.style.display = ultimo ? 'block' : 'none';
}

function fecharTour() {
  tourOverlay.classList.add('escondido');
  localStorage.setItem(CHAVE_TUTORIAL_VISTO, '1');
  if (typeof aposTutorialCallback === 'function') {
    const cb = aposTutorialCallback;
    aposTutorialCallback = null;
    setTimeout(cb, 500);
  }
}

btnTourAnterior.addEventListener('click', () => irParaPassoTour(Math.max(0, passoTourAtual - 1)));
btnTourProximo.addEventListener('click', () => irParaPassoTour(passoTourAtual + 1));
btnTourFechar.addEventListener('click', fecharTour);
window.addEventListener('resize', () => {
  if (!tourOverlay.classList.contains('escondido')) posicionarTour(passoTourAtual);
});

// Guarda o que deve rodar assim que o tutorial fechar (pra não ficar tudo empilhado na tela)
let aposTutorialCallback = null;
function mostrarTutorialInicialSeNecessario(aposFechar) {
  if (localStorage.getItem(CHAVE_TUTORIAL_VISTO) === '1') {
    if (typeof aposFechar === 'function') setTimeout(aposFechar, 400);
    return;
  }
  aposTutorialCallback = aposFechar || null;
  tourOverlay.classList.remove('escondido');
  setTimeout(() => irParaPassoTour(0), 50);
}

// --- Créditos animados estilo Minecraft ---
const creditosOverlay = document.getElementById('creditosOverlay');
const creditosScroll = document.getElementById('creditosScroll');
const btnVerCreditos = document.getElementById('btnVerCreditos');
const btnFecharCreditos = document.getElementById('btnFecharCreditos');

btnVerCreditos.addEventListener('click', () => {
  creditosScroll.style.animation = 'none';
  void creditosScroll.offsetWidth; // reinicia a animação toda vez que abre
  creditosScroll.style.animation = '';
  creditosOverlay.classList.remove('escondido');
});

btnFecharCreditos.addEventListener('click', () => {
  creditosOverlay.classList.add('escondido');
});

document.getElementById('btnReverTutorial').addEventListener('click', () => {
  configFullscreen.classList.add('escondido');
  tourOverlay.classList.remove('escondido');
  setTimeout(() => irParaPassoTour(0), 50);
});

// --- Personalização de cores (Ultimate) ---
function ajustarBrilhoHex(hex, qtd) {
  const num = parseInt(hex.replace('#', ''), 16);
  let r = (num >> 16) + qtd;
  let g = ((num >> 8) & 0x00FF) + qtd;
  let b = (num & 0x0000FF) + qtd;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

function aplicarCor(cor) {
  if (cor === 'livre') {
    document.documentElement.removeAttribute('data-cor');
    const raiz = document.documentElement.style;
    raiz.setProperty('--blue', corLivreHex);
    raiz.setProperty('--blue-bright', ajustarBrilhoHex(corLivreHex, 35));
    raiz.setProperty('--blue-deep', ajustarBrilhoHex(corLivreHex, -35));
    raiz.setProperty('--cyan', ajustarBrilhoHex(corLivreHex, 55));
  } else {
    ['--blue', '--blue-bright', '--blue-deep', '--cyan'].forEach(v => document.documentElement.style.removeProperty(v));
    document.documentElement.setAttribute('data-cor', cor);
  }
  const amostra = document.getElementById('amostraCorLivre');
  if (amostra) amostra.style.setProperty('--amostra', corLivreHex);
}

function renderizarGradeCores() {
  coresGradeEl.querySelectorAll('.cor-opcao[data-cor]').forEach(btn => {
    const cor = btn.dataset.cor;
    const nivel = btn.dataset.nivel;
    const liberado = temRecursoOuStreak(nivel, true);
    btn.classList.toggle('ativa', cor === corEscolhida);
    btn.classList.toggle('bloqueada', !liberado);
  });
  corLivreLabel.classList.toggle('ativa', corEscolhida === 'livre');
  corLivreLabel.classList.toggle('bloqueada', !temRecurso('ultimate'));
  corLivreInput.value = corLivreHex;
}

coresGradeEl.querySelectorAll('.cor-opcao[data-cor]').forEach(btn => {
  btn.addEventListener('click', () => {
    const cor = btn.dataset.cor;
    const nivel = btn.dataset.nivel;
    if (!temRecursoOuStreak(nivel, true)) {
      alert(nivel === 'pro' ? 'Essa cor é exclusiva dos planos Pro e Ultimate (ou desbloqueie mantendo um streak de 14 dias).' : 'Essa cor é exclusiva do plano Ultimate (ou desbloqueie mantendo um streak de 21 dias).');
      return;
    }
    corEscolhida = cor;
    aplicarCor(cor);
    salvar();
    renderizarGradeCores();
  });
});
const layoutGradeEl = document.getElementById('layoutGrade');
const nivelLayout = { padrao: 'free', poupix: 'free', moderno: 'pro', cards: 'ultimate', neon: 'ultimate' };

function neonLiberadoPorStreak() {
  return localStorage.getItem('saldo_layout_neon_liberado') === '1';
}
function podeUsarLayout(layout) {
  if (layout === 'neon' && neonLiberadoPorStreak()) return true;
  return temRecurso(nivelLayout[layout]);
}

function renderizarGradeLayout() {
  layoutGradeEl.querySelectorAll('.layout-opcao').forEach(btn => {
    const layout = btn.dataset.layout;
    btn.classList.toggle('ativa', layout === layoutAtual);
    btn.classList.toggle('bloqueada', !podeUsarLayout(layout));
  });
}

layoutGradeEl.querySelectorAll('.layout-opcao').forEach(btn => {
  btn.addEventListener('click', () => {
    const layout = btn.dataset.layout;
    if (!podeUsarLayout(layout)) {
      alert('Esse layout precisa de um plano superior.');
      return;
    }
    layoutAtual = layout;
    document.documentElement.setAttribute('data-layout', layoutAtual);
    salvar();
    renderizarGradeLayout();
  });
});

const corLivreInput = document.getElementById('corLivreInput');
const corLivreLabel = document.getElementById('corLivreLabel');
corLivreLabel.addEventListener('click', (e) => {
  if (!temRecurso('ultimate')) {
    e.preventDefault();
    alert('Essa cor é exclusiva do plano Ultimate.');
    return;
  }
});
corLivreInput.addEventListener('input', () => {
  corLivreHex = corLivreInput.value;
  corEscolhida = 'livre';
  aplicarCor('livre');
  salvar();
  renderizarGradeCores();
});

const comparacaoEl = document.getElementById('comparacao');
const modalBoasVindas = document.getElementById('modalBoasVindas');
const formAuth = document.getElementById('formAuth');
const formCodigo = document.getElementById('formCodigo');
const authCodigo = document.getElementById('authCodigo');
const btnReenviarCodigo = document.getElementById('btnReenviarCodigo');
const authTabs = document.querySelectorAll('.auth-tab');
const authNome = document.getElementById('authNome');
const authEmail = document.getElementById('authEmail');
const authSenha = document.getElementById('authSenha');
const btnAuthSubmit = document.getElementById('btnAuthSubmit');
const authErroEl = document.getElementById('authErro');
const authCarregandoEl = document.getElementById('authCarregando');
const btnSemConta = document.getElementById('btnSemConta');
const saudacaoEl = document.getElementById('saudacao');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabConteudos = document.querySelectorAll('.tab-conteudo');
const btnExportar = document.getElementById('btnExportar');
const btnImportar = document.getElementById('btnImportar');
const inputImportar = document.getElementById('inputImportar');
const btnResetar = document.getElementById('btnResetar');

const resumoMesesEl = document.getElementById('resumoMeses');
const resumoMesesVazioEl = document.getElementById('resumoMesesVazio');
const btnTema = document.getElementById('btnTema');
const iconeLua = document.getElementById('iconeLua');
const iconeSol = document.getElementById('iconeSol');
const themeColorMeta = document.getElementById('themeColorMeta');
let nomeUsuario = '';

// --- Verifica se um lançamento ainda não chegou na data (agendado) ---
function itemPendente(item) {
  const agora = new Date();
  agora.setHours(0, 0, 0, 0);
  const dataItem = new Date(item.data);
  dataItem.setHours(0, 0, 0, 0);
  return dataItem > agora;
}

// --- Verifica se um lançamento ainda não deve contar no saldo:
// agendado pra data futura, ou ainda não confirmado (não caiu / não foi pago) ---
function itemForaDoSaldo(item) {
  if (itemPendente(item)) return true;
  if (item.confirmado === false) return true;
  return false;
}

function lancamentosAtivos() {
  return lancamentos.filter(l => !itemForaDoSaldo(l));
}

// --- Persistência (localStorage, funciona offline, sem precisar de servidor/domínio) ---
function salvar() {
  try {
    localStorage.setItem(CHAVE_LANCAMENTOS, JSON.stringify(lancamentos));
    localStorage.setItem(CHAVE_META, metaAlvo === null ? '' : String(metaAlvo));
    localStorage.setItem(CHAVE_METAS, JSON.stringify(metas));
    localStorage.setItem(CHAVE_NOME, nomeUsuario);
    localStorage.setItem(CHAVE_PLANO, planoAtual);
    localStorage.setItem(CHAVE_DEV, devAtivo ? '1' : '0');
    localStorage.setItem(CHAVE_DEV_PLANO, devPlanoEscolhido);
    localStorage.setItem(CHAVE_EMAIL, emailUsuario);
    localStorage.setItem(CHAVE_FOTO, fotoUsuario);
    localStorage.setItem(CHAVE_LIMITE, limiteGasto === null ? '' : String(limiteGasto));
    localStorage.setItem(CHAVE_TOKEN, tokenSessao);
    localStorage.setItem(CHAVE_CRIADOEM, criadoEm);
    localStorage.setItem(CHAVE_COR, corEscolhida);
    localStorage.setItem(CHAVE_COR_HEX, corLivreHex);
    localStorage.setItem(CHAVE_LAYOUT, layoutAtual);
  } catch (e) {
    console.warn('Não foi possível salvar os dados localmente.', e);
  }
  agendarSincronizacao();
}

function carregar() {
  try {
    const dados = localStorage.getItem(CHAVE_LANCAMENTOS);
    if (dados) {
      lancamentos = JSON.parse(dados).map(l => ({ ...l, data: new Date(l.data) }));
    }
    const meta = localStorage.getItem(CHAVE_META);
    if (meta) metaAlvo = parseFloat(meta);
    const metasSalvas = localStorage.getItem(CHAVE_METAS);
    if (metasSalvas) {
      metas = JSON.parse(metasSalvas);
    } else if (metaAlvo) {
      // Migração de quem já tinha uma meta única salva antes
      metas = [{ id: Date.now(), nome: 'Minha meta', valor: metaAlvo }];
    }
    const nome = localStorage.getItem(CHAVE_NOME);
    if (nome) nomeUsuario = nome;
    const oculto = localStorage.getItem(CHAVE_OCULTO);
    if (oculto === '1') saldoOculto = true;
    const plano = localStorage.getItem(CHAVE_PLANO);
    if (plano) planoAtual = plano;
    devAtivo = localStorage.getItem(CHAVE_DEV) === '1';
    devPlanoEscolhido = localStorage.getItem(CHAVE_DEV_PLANO) || 'ultimate';
    emailUsuario = localStorage.getItem(CHAVE_EMAIL) || '';
    fotoUsuario = localStorage.getItem(CHAVE_FOTO) || '';
    const limite = localStorage.getItem(CHAVE_LIMITE);
    if (limite) limiteGasto = parseFloat(limite);
    tokenSessao = localStorage.getItem(CHAVE_TOKEN) || '';
    criadoEm = localStorage.getItem(CHAVE_CRIADOEM) || '';
    corEscolhida = localStorage.getItem(CHAVE_COR) || 'azul';
    corLivreHex = localStorage.getItem(CHAVE_COR_HEX) || '#3b82f6';
    layoutAtual = localStorage.getItem(CHAVE_LAYOUT) || 'poupix';
  } catch (e) {
    console.warn('Não foi possível carregar os dados salvos.', e);
    lancamentos = [];
  }
}

// --- Sistema de planos ---
function planoEfetivo() {
  const base = devAtivo ? devPlanoEscolhido : planoAtual;
  if (typeof trialUltimateAtivo === 'function' && trialUltimateAtivo()) {
    const ordem = { free: 0, pro: 1, ultimate: 2 };
    return ordem[base] >= ordem.ultimate ? base : 'ultimate';
  }
  return base;
}

function temRecurso(nivelMinimo) {
  const ordem = { free: 0, pro: 1, ultimate: 2 };
  return ordem[planoEfetivo()] >= ordem[nivelMinimo];
}
// Recurso liberado pelo plano pago OU por recompensa de streak (cor/tema cosméticos)
function temRecursoOuStreak(nivelMinimo, cor) {
  if (temRecurso(nivelMinimo)) return true;
  if (cor && typeof corLiberadaPorStreak === 'function') return corLiberadaPorStreak(nivelMinimo);
  return false;
}

const NIVEL_DA_COR = { azul: 'free', verde: 'pro', laranja: 'pro', roxo: 'ultimate', rosa: 'ultimate', vermelho: 'ultimate', livre: 'ultimate' };

function aplicarGating() {
  const pro = temRecurso('pro');
  linhaCategoria.style.display = pro ? 'flex' : 'none';
  linhaRecorrente.style.display = pro ? 'flex' : 'none';
  painelBusca.style.display = pro ? 'block' : 'none';
  painelLimite.style.display = pro ? 'block' : 'none';
  const painelDonut = document.getElementById('painelDonut');
  const donutBloqueado = document.getElementById('donutBloqueado');
  if (painelDonut && donutBloqueado) {
    painelDonut.style.display = pro ? 'block' : 'none';
    donutBloqueado.style.display = pro ? 'none' : 'block';
  }

  if (!temRecursoOuStreak(NIVEL_DA_COR[corEscolhida] || 'ultimate', true) && corEscolhida !== 'azul') {
    corEscolhida = 'azul';
  }
  aplicarCor(corEscolhida);

  const nivelLayout = { padrao: 'free', poupix: 'free', moderno: 'pro', cards: 'ultimate', neon: 'ultimate' };
  if (!temRecurso(nivelLayout[layoutAtual] || 'ultimate')) {
    layoutAtual = 'padrao';
  }
  document.documentElement.setAttribute('data-layout', layoutAtual);
  verificarMetaInicialPoupix();

  if (!temRecurso('ultimate')) {
    const ativasCount = metas.filter(m => !m.completa).length;
    if (ativasCount > 1) {
      let vistas = 0;
      metas = metas.filter(m => {
        if (m.completa) return true;
        vistas++;
        return vistas <= 1;
      });
    }
  }

  planoAtualNomeEl.textContent = devAtivo
    ? `${devPlanoEscolhido === 'pro' ? 'Pro' : 'Ultimate'} (modo dev)`
    : (planoAtual === 'pro' ? 'Pro' : planoAtual === 'ultimate' ? 'Ultimate' : 'Free');

  atualizarBotaoPerfilTopo();

  devStatusEl.textContent = devAtivo
    ? `Ativo — simulando o plano ${devPlanoEscolhido === 'pro' ? 'Pro' : 'Ultimate'}.`
    : 'Desbloqueia as funções Pro ou Ultimate pra testar.';
  devStatusEl.classList.toggle('ativo', devAtivo);
  devForm.style.display = devAtivo ? 'none' : 'flex';
  btnDevDesativar.style.display = devAtivo ? 'inline-block' : 'none';
  const devToggleWrap = document.getElementById('devToggleWrap');
  if (devToggleWrap) {
    devToggleWrap.style.display = devAtivo ? 'flex' : 'none';
    document.querySelectorAll('.dev-plano-btn').forEach(b => b.classList.toggle('active', b.dataset.plano === devPlanoEscolhido));
  }
}

document.querySelectorAll('.dev-plano-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    devPlanoEscolhido = btn.dataset.plano;
    salvar();
    aplicarGating();
    preencherCategorias();
  });
});

btnDevAtivar.addEventListener('click', () => {
  if (devSenhaInput.value === SENHA_DEV) {
    devAtivo = true;
    devSenhaInput.value = '';
    salvar();
    aplicarGating();
    preencherCategorias();
    irParaSlide(0);
    modalCompra.classList.remove('escondido');
  } else {
    alert('Senha incorreta.');
  }
});

btnFecharModalCompra.addEventListener('click', () => {
  modalCompra.classList.add('escondido');
});

// --- Tutorial em slides ---
let slideAtual = 0;

function montarPontosTutorial() {
  tutorialPontosEl.innerHTML = '';
  tutorialSlides.forEach((_, i) => {
    const ponto = document.createElement('span');
    ponto.className = 'tutorial-ponto' + (i === slideAtual ? ' ativo' : '');
    tutorialPontosEl.appendChild(ponto);
  });
}

function irParaSlide(indice) {
  slideAtual = indice;
  tutorialSlides.forEach((slide, i) => slide.classList.toggle('ativo', i === indice));
  montarPontosTutorial();
  btnTutorialAnterior.style.visibility = indice === 0 ? 'hidden' : 'visible';
  const ultimo = indice === tutorialSlides.length - 1;
  btnTutorialProximo.style.display = ultimo ? 'none' : 'inline-block';
  btnFecharModalCompra.style.display = ultimo ? 'block' : 'none';
}

btnTutorialAnterior.addEventListener('click', () => irParaSlide(Math.max(0, slideAtual - 1)));
btnTutorialProximo.addEventListener('click', () => irParaSlide(Math.min(tutorialSlides.length - 1, slideAtual + 1)));

btnDevDesativar.addEventListener('click', () => {
  devAtivo = false;
  salvar();
  aplicarGating();
});

// --- Comparativo de planos ---
const DADOS_PLANOS = [
  {
    nome: 'Free',
    itens: [
      { texto: 'Lançar gastos e ganhos', tem: true, detalhe: 'Até 40 lançamentos guardados. Depois disso, precisa de um plano pago.' },
      { texto: '1 meta de economia', tem: true, detalhe: 'Só uma meta ativa por vez. Ao completar, pode criar outra.' },
      { texto: 'Resumo por mês', tem: true, detalhe: 'Veja se cada mês fechou no lucro ou no prejuízo.' },
      { texto: 'Layouts Padrão e PoupPix', tem: true, detalhe: 'Só a cor azul disponível.' },
      { texto: 'Categorias', tem: false, detalhe: 'Organizar por tipo de gasto é recurso Pro.' },
      { texto: 'Gastos e ganhos fixos', tem: false, detalhe: 'Repetir lançamentos todo mês é recurso Pro.' },
      { texto: 'Gráfico de distribuição', tem: false, detalhe: 'O gráfico de rosca por categoria é recurso Pro.' },
      { texto: 'Busca e limite de gasto', tem: false, detalhe: 'Buscar lançamentos e travar um teto mensal é Pro.' }
    ]
  },
  {
    nome: 'Pro',
    itens: [
      { texto: 'Tudo do Free, sem limite de lançamentos', tem: true },
      { texto: 'Categorias personalizadas', tem: true, detalhe: 'Organize cada gasto por tipo.' },
      { texto: 'Gastos e ganhos fixos', tem: true, detalhe: 'Repita automaticamente todo mês, no dia que escolher.' },
      { texto: 'Gráfico de distribuição', tem: true, detalhe: 'Veja pra onde seu dinheiro está indo.' },
      { texto: 'Alerta de limite mensal', tem: true },
      { texto: 'Busca nos lançamentos', tem: true },
      { texto: 'Layouts Compacto e Moderno', tem: true },
      { texto: 'Cores Verde e Laranja', tem: true },
      { texto: 'Múltiplas metas', tem: false, detalhe: 'Só o Ultimate libera metas ilimitadas ao mesmo tempo.' },
      { texto: 'Foto de perfil personalizada', tem: false }
    ]
  },
  {
    nome: 'Ultimate',
    itens: [
      { texto: 'Tudo do Pro', tem: true },
      { texto: 'Metas ilimitadas', tem: true, detalhe: 'Junte dinheiro pra quantas metas quiser ao mesmo tempo.' },
      { texto: 'Foto de perfil personalizada', tem: true, detalhe: 'Com editor pra mover e dar zoom antes de salvar.' },
      { texto: 'Layouts Cards e Neon', tem: true },
      { texto: 'Cores Roxo, Rosa, Vermelho e Livre', tem: true, detalhe: 'Escolha qualquer cor com o seletor livre.' },
      { texto: 'Avisos por e-mail (dentro do app)', tem: true }
    ]
  }
];

// --- Botão de configurações (canto superior direito) ---
function abrirConfig() {
  configFullscreen.classList.remove('escondido');
  painelPerfilTopo.classList.add('escondido');
  document.body.style.overflow = 'hidden';
  atualizarVisibilidadeFab();
  atualizarStatusZapConfig();
  atualizarBotaoCheckinRapido();
  atualizarStreak();
  renderizarCalendarioXpPerfil();
}

document.getElementById('btnConfig').addEventListener('click', abrirConfig);
btnFecharConfig.addEventListener('click', () => {
  configFullscreen.classList.add('escondido');
  document.body.style.overflow = '';
  atualizarVisibilidadeFab();
});
btnPerfilConfig.addEventListener('click', abrirConfig);

// --- FAB (+) só aparece na Home/Dashboard (aba "lancar"); some em todas as outras telas ---
function atualizarVisibilidadeFab() {
  const fab = document.getElementById('fabAdd');
  if (!fab) return;
  const configAberta = !configFullscreen.classList.contains('escondido');
  const abaAtualBtn = document.querySelector('.tab-btn.active, [data-tab].active');
  const abaAtual = abaAtualBtn ? abaAtualBtn.dataset.tab : 'lancar';
  const deveMostrar = (abaAtual === 'lancar') && !configAberta;
  if (deveMostrar) {
    fab.style.pointerEvents = 'auto';
    fab.classList.remove('fab-escondido');
  } else {
    fab.style.pointerEvents = 'none';
    fab.classList.add('fab-escondido');
  }
}

// Check-in rápido agora mora em Config > Perfil — fica desabilitado se já fez check-in hoje
function atualizarBotaoCheckinRapido() {
  const checkinBtn = document.getElementById('btnCheckinRapido');
  if (!checkinBtn) return;
  const jaFezCheckinHoje = localStorage.getItem('saldo_ultimo_registro_global') === dataLocalISO(new Date());
  checkinBtn.disabled = jaFezCheckinHoje;
  checkinBtn.textContent = jaFezCheckinHoje ? '✅ Dia confirmado!' : '✅ Confirmar dia (gastei pouco hoje)';
}

document.getElementById('btnCheckinRapido')?.addEventListener('click', () => {
  const hoje = dataLocalISO(new Date());
  const jaTinhaConfirmadoHoje = localStorage.getItem('saldo_ultimo_registro_global') === hoje;
  const marco = registrarStreakAgora();
  ganharXp(5);
  atualizarBotaoCheckinRapido();
  if (!jaTinhaConfirmadoHoje && !marco) {
    setTimeout(() => alert('Anotado! Boa, você fechou o dia 🎉'), 0);
  }
});

configSideItens.forEach(item => {
  item.addEventListener('click', () => {
    const secao = item.dataset.secao;

    if (secao === 'sair') {
      confirmarSair();
      return;
    }

    configSideItens.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    document.querySelectorAll('.config-fs-secao').forEach(s => s.classList.remove('ativa'));
    const alvo = document.getElementById(`fs${secao.charAt(0).toUpperCase()}${secao.slice(1)}`);
    if (alvo) alvo.classList.add('ativa');
    if (secao === 'plano') renderizarComparativo();
    if (secao === 'cores') { renderizarGradeCores(); renderizarGradeLayout(); }
    if (secao === 'perfil') carregarCamposPerfil();
  });
});

async function confirmarSair() {
  if (!confirm('Isso vai sair da sua conta neste aparelho e apagar os dados salvos aqui (o que está no servidor continua guardado). Continuar?')) return;

  // Invalida o token no servidor também, não só neste aparelho
  if (tokenSessao) {
    try {
      await fetch(API_URL + '/logout', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + tokenSessao }
      });
    } catch (erro) {
      // Se o servidor estiver fora do ar, segue com o logout local mesmo assim
      console.error('Não foi possível avisar o servidor do logout:', erro);
    }
  }

  // Limpa TUDO que fica salvo neste aparelho — sem isso, o próximo uso (inclusive
  // "continuar sem conta") herdava lançamentos, metas, plano e telefone da conta anterior.
  const CHAVES_TUDO = [
    CHAVE_LANCAMENTOS, CHAVE_META, CHAVE_METAS, CHAVE_NOME, CHAVE_TEMA, CHAVE_OCULTO,
    CHAVE_PLANO, CHAVE_DEV, CHAVE_DEV_PLANO, CHAVE_EMAIL, CHAVE_FOTO, CHAVE_LIMITE,
    CHAVE_CRIADOEM, CHAVE_COR, CHAVE_COR_HEX, CHAVE_LAYOUT, CHAVE_TOKEN,
    'saldo_telefone', 'saldo_zap_pulado', 'saldo_zap_pulado_em', 'zap_perguntou_hoje', 'telefone_pendente_para_servidor'
  ];
  CHAVES_TUDO.forEach(chave => localStorage.removeItem(chave));

  location.reload();
}

// --- Perfil no topo (dropdown) ---
function atualizarBotaoPerfilTopo() {
  perfilTopoFoto.src = fotoUsuario || AVATAR_PADRAO;
  perfilTopoFoto.style.display = 'block';
  perfilTopoInicial.style.display = 'none';
}

btnPerfil.addEventListener('click', () => {
  painelPerfilNome.textContent = nomeUsuario || 'Sem nome';
  painelPerfilEmail.textContent = emailUsuario || 'Modo local (sem conta)';
  painelPerfilData.textContent = criadoEm
    ? new Date(criadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';
  painelPerfilPlano.textContent = devAtivo ? 'Ultimate (dev)' : (planoAtual === 'pro' ? 'Pro' : planoAtual === 'ultimate' ? 'Ultimate' : 'Free');

  perfilTopoFotoGrande.src = fotoUsuario || AVATAR_PADRAO;
  perfilTopoFotoGrande.style.display = 'block';
  perfilTopoPlaceholderGrande.style.display = 'none';

  painelPerfilTopo.classList.toggle('escondido');
});

document.addEventListener('click', (e) => {
  if (!painelPerfilTopo.contains(e.target) && !btnPerfil.contains(e.target)) {
    painelPerfilTopo.classList.add('escondido');
  }
});

btnPerfilSair.addEventListener('click', confirmarSair);

btnFotoTopo.addEventListener('click', () => {
  if (!temRecurso('ultimate')) {
    alert('Foto de perfil é um recurso Ultimate. Ative o modo desenvolvedor ou assine o plano pra usar.');
    return;
  }
  inputFotoTopo.click();
});
inputFotoTopo.addEventListener('change', (e) => {
  const arquivo = e.target.files[0];
  if (arquivo) abrirCropFoto(arquivo);
  inputFotoTopo.value = '';
});

function renderizarComparativo() {
  comparativoPlanosEl.innerHTML = DADOS_PLANOS.map((p, i) => `
    <div class="plano-card" data-plano-idx="${i}">
      <div class="plano-card-nome">${p.nome} <span class="plano-card-ver">Ver detalhes ›</span></div>
      <ul>
        ${p.itens.map(it => `<li class="${it.tem ? 'tem' : 'nao'}">${it.texto}</li>`).join('')}
      </ul>
    </div>
  `).join('');
  comparativoPlanosEl.querySelectorAll('.plano-card').forEach(card => {
    card.addEventListener('click', () => abrirDetalhePlano(DADOS_PLANOS[card.dataset.planoIdx]));
  });
}

const modalDetalhePlano = document.getElementById('modalDetalhePlano');
function abrirDetalhePlano(plano) {
  document.getElementById('detalhePlanoNome').textContent = plano.nome;
  document.getElementById('detalhePlanoDescricao').innerHTML = plano.itens.map(it =>
    `<li class="${it.tem ? 'tem' : 'nao'}"><b>${it.texto}</b><span>${it.detalhe || ''}</span></li>`
  ).join('');
  modalDetalhePlano.classList.remove('escondido');
}
document.getElementById('btnFecharDetalhePlano').addEventListener('click', () => modalDetalhePlano.classList.add('escondido'));

// --- Perfil (nome, e-mail, foto) ---
if (configTelefone) {
  configTelefone.addEventListener('input', () => {
    configTelefone.value = formatarTelefoneExibicao(configTelefone.value);
  });
}

function carregarCamposPerfil() {
  configNome.value = nomeUsuario;
  configEmail.value = emailUsuario;
  if (configTelefone) configTelefone.value = formatarTelefoneExibicao(localStorage.getItem('saldo_telefone') || '');
  if (configZapOptin) configZapOptin.checked = localStorage.getItem('saldo_zap_pulado') !== '1';
  perfilFotoImg.src = fotoUsuario || AVATAR_PADRAO;
  perfilFotoImg.style.display = 'block';
  perfilFotoPlaceholder.style.display = 'none';
}

// Aceita o telefone com ou sem máscara e devolve só números pra exibir formatado
function formatarTelefoneExibicao(numeros) {
  const d = String(numeros || '').replace(/\D/g, '').replace(/^55/, '');
  if (d.length < 10) return numeros ? d : '';
  const ddd = d.slice(0, 2);
  const resto = d.slice(2);
  return resto.length === 9
    ? `(${ddd}) ${resto.slice(0,5)}-${resto.slice(5)}`
    : `(${ddd}) ${resto.slice(0,4)}-${resto.slice(4)}`;
}

btnFoto.addEventListener('click', () => {
  if (!temRecurso('ultimate')) {
    alert('Foto de perfil é um recurso Ultimate. Ative o modo desenvolvedor ou assine o plano pra usar.');
    return;
  }
  inputFoto.click();
});

inputFoto.addEventListener('change', (e) => {
  const arquivo = e.target.files[0];
  if (arquivo) abrirCropFoto(arquivo);
  inputFoto.value = '';
});

// --- Editor de foto: mover e dar zoom antes de salvar ---
const modalCropFoto = document.getElementById('modalCropFoto');
const cropCanvas = document.getElementById('cropCanvas');
const cropCtx = cropCanvas.getContext('2d');
const cropZoom = document.getElementById('cropZoom');
let cropImg = null;
let cropOffsetX = 0, cropOffsetY = 0, cropEscala = 1, cropEscalaBase = 1;
let cropArrastando = false, cropUltimoX = 0, cropUltimoY = 0;

function abrirCropFoto(arquivo) {
  const leitor = new FileReader();
  leitor.onload = (evento) => {
    const img = new Image();
    img.onload = () => {
      cropImg = img;
      cropEscalaBase = Math.max(cropCanvas.width / img.width, cropCanvas.height / img.height);
      cropEscala = 1;
      cropZoom.value = 1;
      cropOffsetX = 0;
      cropOffsetY = 0;
      desenharCrop();
      modalCropFoto.classList.remove('escondido');
    };
    img.src = evento.target.result;
  };
  leitor.readAsDataURL(arquivo);
}

function desenharCrop() {
  if (!cropImg) return;
  const escalaFinal = cropEscalaBase * cropEscala;
  const w = cropImg.width * escalaFinal;
  const h = cropImg.height * escalaFinal;
  cropCtx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
  cropCtx.save();
  cropCtx.beginPath();
  cropCtx.arc(cropCanvas.width / 2, cropCanvas.height / 2, cropCanvas.width / 2, 0, Math.PI * 2);
  cropCtx.clip();
  cropCtx.drawImage(
    cropImg,
    (cropCanvas.width - w) / 2 + cropOffsetX,
    (cropCanvas.height - h) / 2 + cropOffsetY,
    w, h
  );
  cropCtx.restore();
}

function limitarOffsetCrop() {
  const escalaFinal = cropEscalaBase * cropEscala;
  const w = cropImg.width * escalaFinal;
  const h = cropImg.height * escalaFinal;
  const maxX = Math.max(0, (w - cropCanvas.width) / 2);
  const maxY = Math.max(0, (h - cropCanvas.height) / 2);
  cropOffsetX = Math.max(-maxX, Math.min(maxX, cropOffsetX));
  cropOffsetY = Math.max(-maxY, Math.min(maxY, cropOffsetY));
}

function posicaoEvento(e) {
  if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

['pointerdown', 'touchstart'].forEach(ev => cropCanvas.addEventListener(ev, (e) => {
  cropArrastando = true;
  const p = posicaoEvento(e);
  cropUltimoX = p.x;
  cropUltimoY = p.y;
}));
['pointerup', 'pointerleave', 'touchend'].forEach(ev => cropCanvas.addEventListener(ev, () => { cropArrastando = false; }));
['pointermove', 'touchmove'].forEach(ev => cropCanvas.addEventListener(ev, (e) => {
  if (!cropArrastando) return;
  e.preventDefault();
  const p = posicaoEvento(e);
  cropOffsetX += p.x - cropUltimoX;
  cropOffsetY += p.y - cropUltimoY;
  cropUltimoX = p.x;
  cropUltimoY = p.y;
  limitarOffsetCrop();
  desenharCrop();
}));

cropZoom.addEventListener('input', () => {
  cropEscala = parseFloat(cropZoom.value);
  limitarOffsetCrop();
  desenharCrop();
});

document.getElementById('btnCancelarCrop').addEventListener('click', () => {
  modalCropFoto.classList.add('escondido');
});

let cropDestino = null;
document.getElementById('btnConfirmarCrop').addEventListener('click', () => {
  // Comprime a foto final pra não pesar: reduz pra 200x200 e qualidade 0.7 antes de salvar
  const canvasFinal = document.createElement('canvas');
  canvasFinal.width = 200;
  canvasFinal.height = 200;
  canvasFinal.getContext('2d').drawImage(cropCanvas, 0, 0, 200, 200);
  fotoUsuario = canvasFinal.toDataURL('image/jpeg', 0.7);
  salvar();
  atualizarBotaoPerfilTopo();
  carregarCamposPerfil();
  modalCropFoto.classList.add('escondido');
});

btnSalvarPerfil.addEventListener('click', async () => {
  const telDigitado = configTelefone ? configTelefone.value.trim() : '';
  const telLimpo = telDigitado.replace(/\D/g, '');
  // WhatsApp obrigatório: precisa de DDD + número (10 ou 11 dígitos, com ou sem o 55 na frente)
  const telValido = telLimpo.length >= 10 && telLimpo.length <= 13;
  if (configTelefoneErro) configTelefoneErro.style.display = 'none';
  if (!telValido) {
    if (configTelefoneErro) {
      configTelefoneErro.textContent = 'Coloca um número de WhatsApp válido, com DDD (ex: (61) 99999-9999).';
      configTelefoneErro.style.display = 'block';
    } else {
      alert('Coloca um número de WhatsApp válido, com DDD.');
    }
    if (configTelefone) configTelefone.focus();
    return;
  }

  const nome = configNome.value.trim();
  if (nome) {
    nomeUsuario = nome;
    saudacaoEl.textContent = `Olá, ${nomeUsuario} 👋`;
  }
  emailUsuario = configEmail.value.trim();
  salvar();

  const optin = configZapOptin ? configZapOptin.checked : true;
  btnSalvarPerfil.disabled = true;
  const textoOriginal = btnSalvarPerfil.textContent;
  btnSalvarPerfil.textContent = 'Salvando...';
  try {
    await salvarTelefoneZap(telLimpo, optin);
  } finally {
    btnSalvarPerfil.disabled = false;
    btnSalvarPerfil.textContent = textoOriginal;
  }

  alert('Perfil salvo!');
});

// --- Busca nos lançamentos ---
let termoBusca = '';
buscaLancamento.addEventListener('input', () => {
  termoBusca = buscaLancamento.value.trim().toLowerCase();
  renderizarTudo();
});

// --- Limite de gasto mensal ---
btnSalvarLimite.addEventListener('click', () => {
  const valor = parseFloat(limiteValorInput.value);
  limiteGasto = !isNaN(valor) && valor > 0 ? valor : null;
  salvar();
  atualizarAvisoLimite();
});

function atualizarAvisoLimite() {
  const barraWrap = document.getElementById('limiteBarraWrap');
  const barraFill = document.getElementById('limiteBarraFill');
  if (!limiteGasto) {
    limiteAvisoEl.textContent = '';
    if (barraWrap) barraWrap.style.display = 'none';
    return;
  }
  const chaveAtual = chaveMes(new Date());
  const gastoMes = lancamentosAtivos()
    .filter(l => l.tipo === 'saida' && chaveMes(l.data) === chaveAtual)
    .reduce((s, l) => s + l.valor, 0);

  const pct = Math.min(100, (gastoMes / limiteGasto) * 100);
  if (barraWrap && barraFill) {
    barraWrap.style.display = 'block';
    barraFill.style.width = pct + '%';
    barraFill.classList.toggle('perigo', gastoMes >= limiteGasto);
    barraFill.classList.toggle('alerta', pct >= 80 && gastoMes < limiteGasto);
  }

  if (gastoMes >= limiteGasto) {
    limiteAvisoEl.textContent = `⚠️ Você já passou do limite de ${formatarMoeda(limiteGasto)} esse mês (gastou ${formatarMoeda(gastoMes)}).`;
    limiteAvisoEl.className = 'limite-aviso perigo';
  } else if (pct >= 80) {
    limiteAvisoEl.textContent = `😬 Cuidado! Já foi ${pct.toFixed(0)}% do limite de ${formatarMoeda(limiteGasto)} (gastou ${formatarMoeda(gastoMes)}).`;
    limiteAvisoEl.className = 'limite-aviso perigo';
  } else {
    limiteAvisoEl.textContent = `Gastou ${formatarMoeda(gastoMes)} de ${formatarMoeda(limiteGasto)} esse mês.`;
    limiteAvisoEl.className = 'limite-aviso ok';
  }
}

// --- Preencher categorias (Pro+) ---
function preencherCategorias() {
  selectCat.innerHTML = '<option value="">Sem categoria</option>';
  Object.entries(CATEGORIAS).forEach(([chave, cat]) => {
    const opt = document.createElement('option');
    opt.value = chave;
    opt.textContent = `${cat.icone}  ${cat.nome}`;
    selectCat.appendChild(opt);
  });
  preencherChipsCategoria();
}

// --- Chips de categoria (clicáveis, em vez do select) ---
const chipsCategoriaEl = document.getElementById('chipsCategoria');
function preencherChipsCategoria() {
  if (!chipsCategoriaEl) return;
  chipsCategoriaEl.innerHTML = '';
  Object.entries(CATEGORIAS).forEach(([chave, cat]) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip-categoria';
    chip.dataset.categoria = chave;
    chip.innerHTML = `<span>${cat.icone}</span> ${cat.nome}`;
    chip.addEventListener('click', () => {
      const jaAtiva = chip.classList.contains('ativa');
      chipsCategoriaEl.querySelectorAll('.chip-categoria').forEach(c => c.classList.remove('ativa'));
      selectCat.value = jaAtiva ? '' : chave; // clicar de novo desmarca
      if (!jaAtiva) chip.classList.add('ativa');
    });
    chipsCategoriaEl.appendChild(chip);
  });
}
function sincronizarChipAtiva() {
  if (!chipsCategoriaEl) return;
  chipsCategoriaEl.querySelectorAll('.chip-categoria').forEach(c =>
    c.classList.toggle('ativa', c.dataset.categoria === selectCat.value)
  );
}

// --- Sheet do formulário (abre de baixo pra cima ao clicar no FAB) ---
const sheetFormOverlay = document.getElementById('sheetFormOverlay');
function abrirSheetForm() {
  if (!sheetFormOverlay) return;
  sheetFormOverlay.classList.remove('escondido');
  requestAnimationFrame(() => sheetFormOverlay.classList.add('mostrar'));
  document.body.style.overflow = 'hidden';
  setTimeout(() => { const d = document.getElementById('descricao'); if (d) d.focus(); }, 300);
}
function fecharSheetForm() {
  if (!sheetFormOverlay) return;
  sheetFormOverlay.classList.remove('mostrar');
  document.body.style.overflow = '';
  setTimeout(() => sheetFormOverlay.classList.add('escondido'), 300);
}
if (sheetFormOverlay) {
  sheetFormOverlay.addEventListener('click', (e) => { if (e.target === sheetFormOverlay) fecharSheetForm(); });
}

// --- Ocultar/mostrar saldo ---
function aplicarSaldoOculto() {
  saldoTotalEl.classList.toggle('escondido', saldoOculto);
  iconeOlhoAberto.style.display = saldoOculto ? 'none' : 'block';
  iconeOlhoFechado.style.display = saldoOculto ? 'block' : 'none';
  localStorage.setItem(CHAVE_OCULTO, saldoOculto ? '1' : '0');
}

btnOcultar.addEventListener('click', () => {
  saldoOculto = !saldoOculto;
  aplicarSaldoOculto();
});

// --- Tema claro/escuro ---
function aplicarTema(tema) {
  document.documentElement.setAttribute('data-tema', tema);
  iconeLua.style.display = tema === 'escuro' ? 'block' : 'none';
  iconeSol.style.display = tema === 'claro' ? 'block' : 'none';
  themeColorMeta.setAttribute('content', tema === 'claro' ? '#f4f6fb' : '#05070d');
  localStorage.setItem(CHAVE_TEMA, tema);
}

btnTema.addEventListener('click', () => {
  const atual = document.documentElement.getAttribute('data-tema') || 'escuro';
  aplicarTema(atual === 'escuro' ? 'claro' : 'escuro');
});

(function iniciarTema() {
  const salvo = localStorage.getItem(CHAVE_TEMA);
  if (salvo) {
    aplicarTema(salvo);
  } else {
    const prefereClaro = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    aplicarTema(prefereClaro ? 'claro' : 'escuro');
  }
})();

// --- Registrar service worker (PWA / uso offline) ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // Falha silenciosa: se não puder registrar (ex: abrindo via file://), o app continua funcionando normalmente
    });
  });
}

// --- Modal de boas-vindas / login ---
function verificarNome() {
  if (nomeUsuario) {
    modalBoasVindas.classList.add('escondido');
  mostrarTutorialInicialSeNecessario();
    saudacaoEl.textContent = `Olá, ${nomeUsuario} 👋`;
  } else {
    modalBoasVindas.classList.remove('escondido');
  }
}

let modoAuth = 'entrar';

authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    authTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    modoAuth = tab.dataset.auth;
    authNome.style.display = modoAuth === 'cadastrar' ? 'block' : 'none';
    btnAuthSubmit.textContent = modoAuth === 'cadastrar' ? 'Criar conta' : 'Entrar';
    authErroEl.textContent = '';
  });
});

let emailPendenteVerificacao = '';

async function finalizarLogin(dados) {
  tokenSessao = dados.token;
  nomeUsuario = dados.nome;
  emailUsuario = dados.email;

  // Reseta tudo pro padrão ANTES de buscar — evita misturar dados
  // da conta/sessão anterior com a conta que está entrando agora
  lancamentos = [];
  metaAlvo = null;
  fotoUsuario = '';
  planoAtual = 'free';
  devAtivo = false;
  corEscolhida = 'azul';
  limiteGasto = null;
  metas = [];

  try {
    const respDados = await fetch(API_URL + '/dados', {
      headers: { Authorization: 'Bearer ' + tokenSessao }
    });
    if (respDados.ok) {
      const dadosServidor = await respDados.json();
      lancamentos = (dadosServidor.lancamentos || []).map(l => ({ ...l, data: new Date(l.data) }));
      metaAlvo = dadosServidor.metaAlvo ?? null;
      criadoEm = dadosServidor.criadoEm || criadoEm;
      fotoUsuario = dadosServidor.foto || '';
      planoAtual = dadosServidor.planoAtual || 'free';
      devAtivo = dadosServidor.devAtivo || false;
      corEscolhida = dadosServidor.corEscolhida || 'azul';
      corLivreHex = dadosServidor.corLivreHex || '#3b82f6';
      layoutAtual = dadosServidor.layoutAtual || 'poupix';
      limiteGasto = dadosServidor.limiteGasto ?? null;
      metas = dadosServidor.metas || [];
      if (dadosServidor.xpPendente > 0) {
        ganharXp(dadosServidor.xpPendente);
        fetch(API_URL + '/xp-aplicado', { method: 'POST', headers: { Authorization: 'Bearer ' + tokenSessao } }).catch(() => {});
      }
    }
  } catch (erroDados) {
    console.warn('Não consegui buscar os dados do servidor agora.', erroDados);
  }

  salvar();
  aplicarGating();
  saudacaoEl.textContent = `Olá, ${nomeUsuario} 👋`;
  atualizarBotaoPerfilTopo();
  modalBoasVindas.classList.add('escondido');
  renderizarTudo();
  document.querySelector('.hero').classList.add('flash-sucesso');
  setTimeout(() => document.querySelector('.hero').classList.remove('flash-sucesso'), 900);

  // Só verifica WhatsApp/meta DEPOIS que o tutorial (se precisar aparecer) já tiver fechado —
  // pra não empilhar tutorial + modal de telefone + modal de meta tudo ao mesmo tempo na tela.
  mostrarTutorialInicialSeNecessario(verificarZapEMetaPosLogin);
}

async function verificarZapEMetaPosLogin() {
  try {
    const respStatus = await fetch(API_URL + '/telefone/status', { headers: { Authorization: 'Bearer ' + tokenSessao } });
    if (respStatus.ok) {
      const statusZap = await respStatus.json();
      if (!statusZap.temTelefone) {
        const m = document.getElementById('modalTelefone'); if (m) m.classList.remove('escondido');
        return; // um modal de cada vez — a meta é checada depois que esse fechar (btnPularTel/btnSalvarTel)
      } else if (statusZap.temTelefone && statusZap.zapOptin && !statusZap.zapVerificado) {
        abrirModalCodigoZap();
        return;
      } else if (!statusZap.zapOptin) {
        const pulouEm = localStorage.getItem('saldo_zap_pulado_em');
        const diasDesdeQuePulou = pulouEm ? Math.floor((Date.now() - new Date(pulouEm).getTime()) / 86400000) : Infinity;
        if (diasDesdeQuePulou >= 3) {
          const m = document.getElementById('modalTelefone'); if (m) m.classList.remove('escondido');
          return;
        }
      }
      // Já tem telefone verificado (ou já pulou recentemente) — não precisa mostrar nada de zap agora
    }
  } catch (e) {}

  verificarMetaInicialPosLogin();
}

function verificarMetaInicialPosLogin() {
  if (metas.length === 0 && metaAlvo === null && modalMetaInicial) {
    modalMetaInicial.classList.remove('escondido');
  }
}

function mostrarFormCodigo(email) {
  emailPendenteVerificacao = email;
  formAuth.style.display = 'none';
  formCodigo.style.display = 'flex';
  authErroEl.textContent = '';
  authCodigo.focus();
}

formAuth.addEventListener('submit', async (e) => {
  e.preventDefault();
  authErroEl.textContent = '';

  const email = authEmail.value.trim();
  const senha = authSenha.value;
  const nome = authNome.value.trim();

  if (modoAuth === 'cadastrar' && !nome) {
    authErroEl.textContent = 'Digita seu nome também.';
    return;
  }

  const rota = modoAuth === 'cadastrar' ? '/cadastro' : '/login';
  const corpo = modoAuth === 'cadastrar' ? { nome, email, senha } : { email, senha };

  btnAuthSubmit.disabled = true;
  authCarregandoEl.style.display = 'block';

  try {
    const resp = await fetch(API_URL + rota, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo)
    });
    const dados = await resp.json();

    if (!resp.ok) {
      if (dados.precisaVerificar) {
        mostrarFormCodigo(dados.email || email);
        return;
      }
      authErroEl.textContent = dados.erro || 'Algo deu errado. Tenta de novo.';
      return;
    }

    if (dados.precisaVerificar) {
      mostrarFormCodigo(dados.email);
      return;
    }

    await finalizarLogin(dados);
  } catch (erro) {
    authErroEl.textContent = 'Não consegui conectar ao servidor. Confere sua internet ou tenta de novo em instantes (o servidor pode estar "acordando").';
  } finally {
    btnAuthSubmit.disabled = false;
    authCarregandoEl.style.display = 'none';
  }
});

formCodigo.addEventListener('submit', async (e) => {
  e.preventDefault();
  authErroEl.textContent = '';
  const codigo = authCodigo.value.trim();
  if (!codigo) return;

  authCarregandoEl.style.display = 'block';
  try {
    const resp = await fetch(API_URL + '/verificar-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailPendenteVerificacao, codigo })
    });
    const dados = await resp.json();

    if (!resp.ok) {
      authErroEl.textContent = dados.erro || 'Código incorreto.';
      return;
    }

    await finalizarLogin(dados);
  } catch (erro) {
    authErroEl.textContent = 'Não consegui conectar ao servidor agora.';
  } finally {
    authCarregandoEl.style.display = 'none';
  }
});

btnReenviarCodigo.addEventListener('click', async () => {
  authErroEl.textContent = '';
  try {
    const resp = await fetch(API_URL + '/reenviar-codigo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailPendenteVerificacao })
    });
    const dados = await resp.json();
    if (!resp.ok) {
      authErroEl.textContent = dados.erro || 'Não consegui reenviar o código.';
      return;
    }
    authErroEl.textContent = 'Código reenviado! Confere seu e-mail.';
    authErroEl.style.color = 'var(--cyan)';
  } catch (erro) {
    authErroEl.textContent = 'Não consegui conectar ao servidor agora.';
  }
});

btnSemConta.addEventListener('click', () => {
  const nome = prompt('Como podemos te chamar?');
  if (!nome || !nome.trim()) return;
  nomeUsuario = nome.trim();
  salvar();
  saudacaoEl.textContent = `Olá, ${nomeUsuario} 👋`;
  modalBoasVindas.classList.add('escondido');
  mostrarTutorialInicialSeNecessario();
});

// --- Login com Google ---
async function processarLoginGoogle(resposta) {
  authErroEl.textContent = '';
  authCarregandoEl.style.display = 'block';
  try {
    const resp = await fetch(API_URL + '/login-google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: resposta.credential })
    });
    const dados = await resp.json();

    if (!resp.ok) {
      authErroEl.textContent = dados.erro || 'Não consegui entrar com o Google.';
      return;
    }

    await finalizarLogin(dados);
  } catch (erro) {
    authErroEl.textContent = 'Não consegui conectar ao servidor agora.';
  } finally {
    authCarregandoEl.style.display = 'none';
  }
}

function iniciarBotaoGoogle() {
  if (!window.google || GOOGLE_CLIENT_ID.indexOf('COLOQUE_SEU') !== -1) return;
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: processarLoginGoogle,
    use_fedcm_for_prompt: false,
    ux_mode: 'popup'
  });
  const container = document.getElementById('botaoGoogle');
  const largura = Math.min(container.offsetWidth || 300, 350);
  google.accounts.id.renderButton(
    container,
    { theme: 'outline', size: 'large', text: 'continue_with', shape: 'pill', width: largura }
  );

  // O Google bloqueia o login dentro de apps instalados (PWA em modo standalone).
  // Se detectarmos isso, avisamos e oferecemos um link pra abrir no navegador normal.
  const rodandoInstalado = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  const avisoEl = document.getElementById('avisoGooglePwa');
  if (avisoEl) avisoEl.style.display = rodandoInstalado ? 'block' : 'none';
}
window.iniciarBotaoGoogle = iniciarBotaoGoogle;

window.addEventListener('resize', () => {
  const container = document.getElementById('botaoGoogle');
  if (container) container.innerHTML = '';
  iniciarBotaoGoogle();
});

// Se o script do Google já tiver carregado antes desse ponto, inicia direto.
// Senão, o próprio <script onload="..."> no HTML chama iniciarBotaoGoogle() quando terminar.
if (window.googleCarregou) iniciarBotaoGoogle();

// --- Sincronizar com o servidor (se logado) ---
//
// 3 correções aqui em relação ao original:
// 1) Debounce: antes, cada mudança disparava uma requisição na hora. Se
//    você fizesse várias ações rápidas (marcar 3 dívidas seguidas, por
//    exemplo), isso virava um monte de requisições ao mesmo tempo.
// 2) Cancelamento da requisição anterior: como as respostas podem chegar
//    fora de ordem, uma resposta "atrasada" de uma sincronização antiga
//    podia, na teoria, ser a última a valer e sobrescrever dados mais
//    novos. Agora, ao começar uma sincronização nova, a anterior (se
//    ainda estiver rodando) é cancelada.
// 3) Retry: antes, se a sincronização falhasse (sem internet, por
//    exemplo), a alteração ficava só salva no aparelho e nunca mais era
//    reenviada pro servidor — ou seja, sumia ao trocar de dispositivo.
//    Agora, se falhar, tenta de novo automaticamente mais tarde e assim
//    que a internet voltar.
let timerSincronizacao = null;
let controllerSincronizacao = null;
let retrySincronizacao = null;

function agendarSincronizacao() {
  if (!tokenSessao) return;
  clearTimeout(timerSincronizacao);
  timerSincronizacao = setTimeout(sincronizarComServidor, 600);
}

async function sincronizarComServidor() {
  if (!tokenSessao) return;

  if (controllerSincronizacao) controllerSincronizacao.abort();
  controllerSincronizacao = new AbortController();
  clearTimeout(retrySincronizacao);

  try {
    await fetch(API_URL + '/dados', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + tokenSessao
      },
      body: JSON.stringify({ lancamentos, metaAlvo, foto: fotoUsuario, planoAtual, devAtivo, corEscolhida, limiteGasto, metas, corLivreHex, layoutAtual }),
      signal: controllerSincronizacao.signal
    });
  } catch (erro) {
    if (erro.name === 'AbortError') return; // cancelada por uma sincronização mais nova, sem problema
    console.warn('Não consegui sincronizar com o servidor agora (dados continuam salvos neste aparelho). Vou tentar de novo em instantes.', erro);
    retrySincronizacao = setTimeout(sincronizarComServidor, 8000);
  }
}

window.addEventListener('online', () => { if (tokenSessao) sincronizarComServidor(); });

// --- Mostrar/ocultar senha no login ---
btnMostrarSenha.addEventListener('click', () => {
  const oculta = authSenha.type === 'password';
  authSenha.type = oculta ? 'text' : 'password';
  btnMostrarSenha.textContent = oculta ? '🙈' : '👁';
});

// --- Preencher dias do mês pro gasto recorrente ---
function preencherDiasRecorrente() {
  diaRecorrenteSelect.innerHTML = '';
  for (let dia = 1; dia <= 31; dia++) {
    const opt = document.createElement('option');
    opt.value = dia;
    opt.textContent = dia > 28 ? `Todo dia ${dia} (meses menores usam o último dia)` : `Todo dia ${dia}`;
    diaRecorrenteSelect.appendChild(opt);
  }
}

checkRecorrente.addEventListener('change', () => {
  linhaDiaRecorrente.style.display = checkRecorrente.checked ? 'block' : 'none';
  atualizarPreviewFimRecorrente();
});

const previewFimRecorrenteEl = document.getElementById('previewFimRecorrente');
function atualizarPreviewFimRecorrente() {
  let qtd = parseInt(quantosMesesSelect.value);
  if (isNaN(qtd) || qtd < 1) qtd = 1;
  if (qtd > 60) qtd = 60;
  const aplicarEsteMes = document.getElementById('checkAplicarEsteMes').checked;
  const agora = new Date();
  const inicio = new Date(agora.getFullYear(), agora.getMonth() + (aplicarEsteMes ? 0 : 1), 1);
  const fim = new Date(inicio.getFullYear(), inicio.getMonth() + qtd - 1, 1);
  previewFimRecorrenteEl.textContent = `Isso vai criar ${qtd} lançamento${qtd > 1 ? 's' : ''}, de ${nomeMes(inicio)} até ${nomeMes(fim)}.`;
}
quantosMesesSelect.addEventListener('input', atualizarPreviewFimRecorrente);
document.getElementById('checkAplicarEsteMes').addEventListener('change', atualizarPreviewFimRecorrente);

// --- Abas ---
const DICAS_ABA = {
  lancar: 'Adicione seus gastos e ganhos aqui',
  meses: 'Veja se cada mês fechou no lucro ou no prejuízo',
  analise: 'Acompanhe metas, comparações e maiores lançamentos',
  fixos: 'Gerencie seus gastos e ganhos fixos, sem lotar a tela',
  config: 'Ajuste seu perfil, plano e preferências'
};

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabConteudos.forEach(c => c.classList.remove('ativo'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('ativo');
    tabsDica.textContent = DICAS_ABA[btn.dataset.tab] || '';
    atualizarVisibilidadeFab();
  });
});

// Garante o estado correto do FAB assim que o app carrega
atualizarVisibilidadeFab();

// --- Atalhos de teclado ---
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && editandoId !== null) {
    sairModoEdicao();
    form.reset();
  }
});

// --- Exportar backup ---
btnExportar.addEventListener('click', () => {
  const backup = {
    lancamentos,
    metaAlvo,
    metas,
    nomeUsuario,
    exportadoEm: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `saldo-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

// --- Importar backup ---
btnImportar.addEventListener('click', () => inputImportar.click());

inputImportar.addEventListener('change', (e) => {
  const arquivo = e.target.files[0];
  if (!arquivo) return;

  const leitor = new FileReader();
  leitor.onload = (evento) => {
    try {
      const dados = JSON.parse(evento.target.result);
      if (!Array.isArray(dados.lancamentos)) throw new Error('Formato inválido');

      if (!confirm('Importar vai substituir os dados atuais. Continuar?')) return;

      lancamentos = dados.lancamentos.map(l => ({ ...l, data: new Date(l.data) }));
      metaAlvo = dados.metaAlvo || null;
      if (Array.isArray(dados.metas)) metas = dados.metas;
      if (dados.nomeUsuario) nomeUsuario = dados.nomeUsuario;

      salvar();
      verificarNome();
      renderizarTudo();
      alert('Backup importado com sucesso!');
    } catch (err) {
      alert('Não foi possível ler esse arquivo de backup.');
    }
  };
  leitor.readAsText(arquivo);
  inputImportar.value = '';
});

// --- Resetar tudo ---
btnResetar.addEventListener('click', async () => {
  const confirmacao = prompt('Isso vai apagar TODOS os dados. Digite "resetar" para confirmar:');
  if (confirmacao !== 'resetar') return;

  if (tokenSessao) {
    try {
      await fetch(API_URL + '/dados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tokenSessao },
        body: JSON.stringify({ lancamentos: [], metaAlvo: null, foto: '', planoAtual: 'free', devAtivo: false, corEscolhida: 'azul', limiteGasto: null, metas: [] })
      });
    } catch (erro) {
      console.warn('Não consegui limpar os dados no servidor agora.', erro);
    }
  }

  lancamentos = [];
  metaAlvo = null;
  metas = [];
  nomeUsuario = '';
  fotoUsuario = '';
  planoAtual = 'free';
  devAtivo = false;
  corEscolhida = 'azul';
  layoutAtual = 'padrao';
  limiteGasto = null;

  localStorage.clear();
  salvar();
  aplicarGating();
  aplicarCor(corEscolhida);
  atualizarBotaoPerfilTopo();
  renderizarTudo();
  verificarNome();
});

// --- Data no topo ---
function atualizarDataTopo() {
  const agora = new Date();
  const opcoes = { weekday: 'long', day: 'numeric', month: 'long' };
  dataAtualEl.textContent = agora.toLocaleDateString('pt-BR', opcoes);
}

// --- Formatação ---
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function nomeMes(data) {
  const nome = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return nome.charAt(0).toUpperCase() + nome.slice(1);
}

function chaveMes(data) {
  return `${data.getFullYear()}-${String(data.getMonth()).padStart(2, '0')}`;
}

// --- Alternar tipo (Gastei / Recebi) ---
btnsTipo.forEach(btn => {
  btn.addEventListener('click', () => {
    btnsTipo.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tipoAtual = btn.dataset.tipo;
  });
});

// --- Filtros ---
filtroBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filtroBtns.forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');
    filtroAtual = btn.dataset.filtro;
    renderizarTudo();
  });
});

// --- Adicionar / salvar edição ---
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!tokenSessao) {
    fecharSheetForm();
    alert('Faça login com Google pra lançar de verdade. O modo demo é só pra você ver como funciona.');
    modalBoasVindas.classList.remove('escondido');
    return;
  }

  const descricao = inputDesc.value.trim();
  const valor = parseFloat(inputValor.value);

  if (!descricao || isNaN(valor) || valor <= 0) return;

  if (editandoId === null && !temRecurso('pro')) {
    const chaveAtual = chaveMes(new Date());
    const lancamentosEsseMes = lancamentos.filter(l => chaveMes(l.data) === chaveAtual).length;
    if (lancamentosEsseMes >= 20) {
      alert('Você atingiu o limite de 20 lançamentos por mês do plano Free. Assine o Pro pra lançar sem limite.');
      return;
    }
  }

  let itemRecemCriado = null;

  if (editandoId !== null) {
    const item = lancamentos.find(l => l.id === editandoId);
    if (item) {
      item.descricao = descricao;
      item.valor = valor;
      item.tipo = tipoAtual;
      item.categoria = temRecurso('pro') ? selectCat.value : '';
    }
    sairModoEdicao();
  } else {
    const ehRecorrente = temRecurso('pro') && checkRecorrente.checked;

    if (ehRecorrente) {
      const dia = parseInt(diaRecorrenteSelect.value);
      let qtdMeses = parseInt(quantosMesesSelect.value);
      if (isNaN(qtdMeses) || qtdMeses < 1) qtdMeses = 1;
      if (qtdMeses > 60) qtdMeses = 60;
      const agora = new Date();
      const aplicarEsteMes = document.getElementById('checkAplicarEsteMes').checked;
      const inicioI = aplicarEsteMes ? 0 : 1;

      for (let i = inicioI; i < qtdMeses + inicioI; i++) {
        const dataLancamento = new Date(agora.getFullYear(), agora.getMonth() + i, 1);
        const ultimoDiaDoMes = new Date(dataLancamento.getFullYear(), dataLancamento.getMonth() + 1, 0).getDate();
        dataLancamento.setDate(Math.min(dia, ultimoDiaDoMes));

        lancamentos.unshift({
          id: Date.now() + i,
          descricao,
          valor,
          tipo: tipoAtual,
          categoria: selectCat.value,
          recorrente: true,
          diaRecorrente: dia,
          data: dataLancamento
        });
      }
    } else {
      itemRecemCriado = {
        id: Date.now(),
        descricao,
        valor,
        tipo: tipoAtual,
        categoria: temRecurso('pro') ? selectCat.value : '',
        recorrente: false,
        diaRecorrente: null,
        data: new Date(),
        confirmado: false
      };
      lancamentos.unshift(itemRecemCriado);
    }
  }

  salvar();
  renderizarTudo();
  form.reset();
  sincronizarChipAtiva();
  fecharSheetForm();

  if (itemRecemCriado) {
    registrarStreakAgora();
    ganharXp(10);
  }

  // Confetti quando é um ganho (não em edição, nem em lançamento recorrente em lote)
  if (itemRecemCriado && itemRecemCriado.tipo === 'entrada' && window.confetti) {
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
  }

  if (itemRecemCriado) {
    const texto = itemRecemCriado.tipo === 'entrada'
      ? 'Esse dinheiro já caiu na sua conta?'
      : 'Você já pagou isso?';
    abrirConfirmarNovo(itemRecemCriado, texto);
  }
});

function sairModoEdicao() {
  editandoId = null;
  btnSubmit.querySelector('span').textContent = 'Adicionar';
  btnSubmit.classList.remove('editando-btn');
}

// --- Escapar HTML ---
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// --- Renderizar lista agrupada por mês ---
function renderizarTudo() {
  const filtrados = lancamentos.filter(l => {
    const passaTipo = filtroAtual === 'todos' || l.tipo === filtroAtual;
    const passaBusca = !termoBusca || l.descricao.toLowerCase().includes(termoBusca);
    const passaPendente = !(l.recorrente && itemPendente(l));
    return passaTipo && passaBusca && passaPendente;
  });

  blocosMeses.innerHTML = '';

  const grupos = {};
  filtrados.forEach(item => {
    const chave = chaveMes(item.data);
    if (!grupos[chave]) grupos[chave] = [];
    grupos[chave].push(item);
  });

  const chavesOrdenadas = Object.keys(grupos).sort().reverse();

  chavesOrdenadas.forEach(chave => {
    const itensDoMes = grupos[chave];
    const bloco = document.createElement('div');
    bloco.className = 'bloco-mes';

    const titulo = document.createElement('div');
    titulo.className = 'mes-titulo';
    titulo.textContent = nomeMes(itensDoMes[0].data);
    bloco.appendChild(titulo);

    const ul = document.createElement('ul');
    ul.className = 'lista';

    itensDoMes.forEach(item => ul.appendChild(criarItemEl(item)));

    bloco.appendChild(ul);
    blocosMeses.appendChild(bloco);
  });

  const semResultado = filtrados.length === 0;
  vazio.classList.toggle('mostrar', semResultado);
  if (semResultado) {
    if (termoBusca) {
      const span = vazio.querySelector('span');
      if (span) span.textContent = MENSAGENS_VAZIO_BUSCA;
    } else {
      mostrarMensagemVaziaFofa();
    }
  }
  atualizarResumo(false);
  atualizarMeta();
  atualizarBarraHeroMeta();
  atualizarGrafico();
  atualizarDonut();
  atualizarComparacao();
  atualizarResumoMeses();
  atualizarAvisoLimite();
  atualizarFixos();
}

// --- Criar elemento de item ---
function criarItemEl(item) {
  const li = document.createElement('li');
  const pendente = itemPendente(item);
  const foraDoSaldo = itemForaDoSaldo(item);
  const statusClasse = item.confirmado === true ? ' pago' : (item.confirmado === false ? ' divida-pendente' : '');
  li.className = `item ${item.tipo}${pendente ? ' pendente' : ''}${foraDoSaldo ? ' aguardando' : ''}${statusClasse}`;
  li.dataset.id = item.id;

  const cat = item.categoria ? CATEGORIAS[item.categoria] : null;
  const icone = cat ? cat.icone : ICONE_TIPO[item.tipo];
  const corCat = item.categoria ? `cat-cor-${item.categoria}` : (item.tipo === 'saida' ? 'cat-cor-saida' : 'cat-cor-entrada');
  const sinal = item.tipo === 'saida' ? '-' : '+';
  const dataFormatada = item.data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  const tagRecorrente = item.recorrente ? `<span class="item-cat-tag">🔁 Fixo${item.diaRecorrente ? ' (dia ' + item.diaRecorrente + ')' : ''}</span>` : '';
  const tagCat = cat ? `<span class="item-cat-tag">${cat.nome}</span>` : '';
  const tagPendente = pendente ? `<span class="item-cat-tag item-tag-pendente">🕒 Agendado</span>` : '';

  let tagStatus = '';
  if (item.confirmado === true) {
    tagStatus = item.tipo === 'entrada'
      ? `<span class="item-cat-tag item-tag-confirmado">👍 Já caiu</span>`
      : `<span class="item-cat-tag item-tag-pago">👍 Já paguei</span>`;
  } else if (item.confirmado === false) {
    tagStatus = item.tipo === 'entrada'
      ? `<span class="item-cat-tag item-tag-pendente">🕒 Ainda não caiu · não entra no saldo</span>`
      : `<span class="item-cat-tag item-tag-divida">🕒 Ainda não paguei · não entra no saldo</span>`;
  }

  li.innerHTML = `
    <div class="item-icone ${corCat}">${icone}</div>
    <div class="item-info">
      <div class="item-desc">${escapeHTML(item.descricao)}</div>
      <div class="item-data">${dataFormatada}</div>
      ${tagCat}${tagRecorrente}${tagPendente}${tagStatus}
    </div>
    <div class="item-valor" data-id="${item.id}" title="Clique pra editar só o valor">${sinal} ${formatarMoeda(item.valor)}</div>
  `;

  li.querySelector('.item-valor').addEventListener('click', (e) => {
    e.stopPropagation();
    const novoValorStr = prompt('Novo valor:', item.valor.toFixed(2).replace('.', ','));
    if (novoValorStr === null) return;
    const novoValor = parseFloat(novoValorStr.replace(',', '.'));
    if (isNaN(novoValor) || novoValor <= 0) { alert('Valor inválido.'); return; }
    item.valor = novoValor;
    salvar();
    renderizarTudo();
  });

  li.addEventListener('click', () => abrirAcaoItem(item));

  return li;
}

// --- Popup de ação (editar/excluir) ---
const modalAcaoItem = document.getElementById('modalAcaoItem');
const acaoItemTitulo = document.getElementById('acaoItemTitulo');
const btnAcaoEditar = document.getElementById('btnAcaoEditar');
const btnAcaoExcluir = document.getElementById('btnAcaoExcluir');
const btnAcaoCancelar = document.getElementById('btnAcaoCancelar');
const confirmacaoPendente = document.getElementById('confirmacaoPendente');
const confirmacaoTexto = document.getElementById('confirmacaoTexto');
const btnJoinhaSim = document.getElementById('btnJoinhaSim');
const btnJoinhaNao = document.getElementById('btnJoinhaNao');
const rotuloJoinhaSim = btnJoinhaSim.querySelector('.rotulo');
const rotuloJoinhaNao = btnJoinhaNao.querySelector('.rotulo');
let itemAcaoAtual = null;

// Textos do joinha, de acordo com o tipo do lançamento
function textosJoinha(item) {
  return item.tipo === 'entrada'
    ? { pergunta: 'Esse dinheiro já caiu na sua conta?', sim: 'Já caiu', nao: 'Ainda não caiu' }
    : { pergunta: 'Você já pagou isso?', sim: 'Já paguei', nao: 'Ainda não paguei' };
}

function abrirAcaoItem(item) {
  itemAcaoAtual = item;
  acaoItemTitulo.textContent = item.descricao;

  const pendenteData = itemPendente(item);
  // participa do fluxo de confirmação (já caiu/já paguei) sempre que o item tiver esse status definido
  const participaConfirmacao = item.confirmado !== undefined;
  const mostrarConfirmacao = pendenteData || participaConfirmacao;

  confirmacaoPendente.classList.toggle('escondido', !mostrarConfirmacao);
  if (mostrarConfirmacao) {
    const t = textosJoinha(item);
    confirmacaoTexto.textContent = t.pergunta;
    rotuloJoinhaSim.textContent = t.sim;
    rotuloJoinhaNao.textContent = t.nao;
    // destaca visualmente qual é o status atual desse lançamento
    btnJoinhaSim.classList.toggle('joinha-atual', item.confirmado === true);
    btnJoinhaNao.classList.toggle('joinha-atual', item.confirmado === false);
  }

  modalAcaoItem.classList.remove('escondido');
}

function fecharAcaoItem() {
  modalAcaoItem.classList.add('escondido');
  itemAcaoAtual = null;
}

btnAcaoCancelar.addEventListener('click', fecharAcaoItem);
modalAcaoItem.addEventListener('click', (e) => { if (e.target === modalAcaoItem) fecharAcaoItem(); });

btnJoinhaSim.addEventListener('click', () => {
  if (!itemAcaoAtual) return;
  if (itemAcaoAtual.confirmado !== undefined) {
    itemAcaoAtual.confirmado = true;
    if (itemPendente(itemAcaoAtual)) itemAcaoAtual.data = new Date();
  } else {
    itemAcaoAtual.data = new Date();
  }
  salvar();
  fecharAcaoItem();
  renderizarTudo();
});

btnJoinhaNao.addEventListener('click', () => {
  if (itemAcaoAtual && itemAcaoAtual.confirmado !== undefined) {
    itemAcaoAtual.confirmado = false;
    salvar();
  }
  fecharAcaoItem();
  renderizarTudo();
});

// --- Modal de confirmação logo após adicionar (entrada / saída) ---
const modalConfirmarNovo = document.getElementById('modalConfirmarNovo');
const confirmarNovoTexto = document.getElementById('confirmarNovoTexto');
const btnConfirmarNovoSim = document.getElementById('btnConfirmarNovoSim');
const btnConfirmarNovoNao = document.getElementById('btnConfirmarNovoNao');
const rotuloConfirmarNovoSim = btnConfirmarNovoSim.querySelector('.rotulo');
const rotuloConfirmarNovoNao = btnConfirmarNovoNao.querySelector('.rotulo');
let itemConfirmarNovoAtual = null;

function abrirConfirmarNovo(item, texto) {
  itemConfirmarNovoAtual = item;
  confirmarNovoTexto.textContent = texto;
  const t = textosJoinha(item);
  rotuloConfirmarNovoSim.textContent = t.sim;
  rotuloConfirmarNovoNao.textContent = t.nao;
  modalConfirmarNovo.classList.remove('escondido');
}

function fecharConfirmarNovo() {
  modalConfirmarNovo.classList.add('escondido');
  itemConfirmarNovoAtual = null;
}

btnConfirmarNovoSim.addEventListener('click', () => {
  if (!itemConfirmarNovoAtual) return;
  itemConfirmarNovoAtual.confirmado = true;
  salvar();
  renderizarTudo();
  fecharConfirmarNovo();
});

btnConfirmarNovoNao.addEventListener('click', () => {
  if (!itemConfirmarNovoAtual) return;
  itemConfirmarNovoAtual.confirmado = false;
  salvar();
  renderizarTudo();
  fecharConfirmarNovo();
});

modalConfirmarNovo.addEventListener('click', (e) => { if (e.target === modalConfirmarNovo) fecharConfirmarNovo(); });

btnAcaoEditar.addEventListener('click', () => {
  if (itemAcaoAtual) iniciarEdicao(itemAcaoAtual);
  fecharAcaoItem();
});

document.getElementById('btnAcaoRepetir').addEventListener('click', () => {
  if (!itemAcaoAtual) return;
  if (!temRecurso('pro')) {
    fecharAcaoItem();
    alert('Repetir lançamento é um recurso Pro. Assine pra usar sem limite.');
    return;
  }
  const item = itemAcaoAtual;
  const dia = new Date(item.data).getDate();
  const qtdMesesStr = prompt('Repetir por quantos meses (a partir do mês que vem)?', '12');
  fecharAcaoItem();
  if (qtdMesesStr === null) return;
  let qtdMeses = parseInt(qtdMesesStr);
  if (isNaN(qtdMeses) || qtdMeses < 1) qtdMeses = 1;
  if (qtdMeses > 60) qtdMeses = 60;

  const agora = new Date();
  for (let i = 1; i <= qtdMeses; i++) {
    const dataLancamento = new Date(agora.getFullYear(), agora.getMonth() + i, 1);
    const ultimoDiaDoMes = new Date(dataLancamento.getFullYear(), dataLancamento.getMonth() + 1, 0).getDate();
    dataLancamento.setDate(Math.min(dia, ultimoDiaDoMes));
    lancamentos.unshift({
      id: Date.now() + i,
      descricao: item.descricao,
      valor: item.valor,
      tipo: item.tipo,
      categoria: item.categoria || '',
      recorrente: true,
      diaRecorrente: dia,
      data: dataLancamento
    });
  }
  salvar();
  renderizarTudo();
  alert(`"${item.descricao}" agora vai se repetir todo dia ${dia} pelos próximos ${qtdMeses} meses.`);
});

btnAcaoExcluir.addEventListener('click', () => {
  if (!itemAcaoAtual) return;
  const id = itemAcaoAtual.id;
  const elemento = document.querySelector(`.item[data-id="${id}"]`);
  fecharAcaoItem();
  if (elemento) removerItem(id, elemento);
  else { lancamentos = lancamentos.filter(l => l.id !== id); salvar(); renderizarTudo(); }
});

// --- Editar ---
function iniciarEdicao(item) {
  editandoId = item.id;
  inputDesc.value = item.descricao;
  inputValor.value = item.valor;
  btnsTipo.forEach(b => b.classList.toggle('active', b.dataset.tipo === item.tipo));
  tipoAtual = item.tipo;
  if (item.categoria) selectCat.value = item.categoria;
  sincronizarChipAtiva();
  btnSubmit.querySelector('span').textContent = 'Salvar edição';
  abrirSheetForm();
}

// --- Remover item ---
function removerItem(id, elemento) {
  elemento.classList.add('saindo');
  setTimeout(() => {
    lancamentos = lancamentos.filter(l => l.id !== id);
    salvar();
    renderizarTudo();
  }, 280);
}

// --- Mensagens fofas nos estados vazios ---
const MENSAGENS_VAZIO_LISTA = [
  'Ainda não tem gasto, bora adicionar o lanche? 🍔',
  'Tudo quietinho por aqui... hora de anotar alguma coisa? ✨',
  'Nada lançado ainda hoje. Café da manhã não conta? ☕',
  'Sem gastos, sem ganhos... começa por algum? 👀',
  'Bora registrar seu primeiro gasto do dia? 🚀'
];
function mostrarMensagemVaziaFofa() {
  const span = vazio.querySelector('span');
  if (span) span.textContent = MENSAGENS_VAZIO_LISTA[Math.floor(Math.random() * MENSAGENS_VAZIO_LISTA.length)];
}

const MENSAGENS_VAZIO_BUSCA = 'Não achei nada com esse nome 🔍 tenta outra palavra?';

function atualizarResumo(pulsar) {
  const ativos = lancamentosAtivos();
  const entradas = ativos.filter(l => l.tipo === 'entrada').reduce((s, l) => s + l.valor, 0);
  const saidas = ativos.filter(l => l.tipo === 'saida').reduce((s, l) => s + l.valor, 0);
  const saldo = entradas - saidas;

  totalEntradasEl.textContent = formatarMoeda(entradas);
  totalSaidasEl.textContent = formatarMoeda(saidas);
  saldoTotalEl.textContent = formatarMoeda(saldo);
  saldoTotalEl.classList.toggle('negativo', saldo < 0);

  if (pulsar) {
    saldoTotalEl.classList.remove('pulsa');
    void saldoTotalEl.offsetWidth;
    saldoTotalEl.classList.add('pulsa');
  }
}

// --- Meta de economia ---
btnAddMeta.addEventListener('click', () => {
  const nome = novaMetaNome.value.trim();
  const valor = parseFloat(novaMetaValor.value);

  if (!nome || isNaN(valor) || valor <= 0) {
    alert('Preenche o nome e um valor válido pra meta.');
    return;
  }

  if (!temRecurso('ultimate') && metas.filter(m => !m.completa).length >= 1) {
    metasAvisoLimiteEl.style.display = 'block';
    return;
  }

  metas.push({ id: Date.now(), nome, valor, acumulado: 0, completa: false });
  novaMetaNome.value = '';
  novaMetaValor.value = '';
  metasAvisoLimiteEl.style.display = 'none';
  salvar();
  atualizarMeta();
});

function removerMeta(id) {
  metas = metas.filter(m => m.id !== id);
  salvar();
  atualizarMeta();
}

function atualizarMeta() {
  if (!temRecurso('ultimate')) {
    const ativasCount = metas.filter(m => !m.completa).length;
    if (ativasCount > 1) {
      let vistas = 0;
      metas = metas.filter(m => {
        if (m.completa) return true;
        vistas++;
        return vistas <= 1;
      });
      salvar();
    }
  }

  listaMetasEl.innerHTML = '';
  listaMetasConcluidasEl.innerHTML = '';

  let precisaSalvar = false;

  metas.forEach(meta => {
    if (meta.acumulado === undefined) meta.acumulado = 0;
    if (meta.completa === undefined) meta.completa = false;
    if (meta.acumulado >= meta.valor && !meta.completa) {
      meta.completa = true;
      precisaSalvar = true;
      mostrarParabensMeta(meta);
    }
  });

  const ativas = metas.filter(m => !m.completa);
  const concluidas = metas.filter(m => m.completa);

  metasVazioEl.classList.toggle('mostrar', ativas.length === 0);

  ativas.forEach(meta => {
    const pct = Math.min((meta.acumulado / meta.valor) * 100, 100);
    const card = document.createElement('div');
    card.className = 'meta-card';
    card.innerHTML = `
      <div class="meta-card-topo">
        <span class="meta-card-nome">${escapeHTML(meta.nome)}</span>
        <button class="meta-card-del" title="Remover meta">✕</button>
      </div>
      <div class="meta-card-valores">${formatarMoeda(meta.acumulado)} de <b>${formatarMoeda(meta.valor)}</b></div>
      <div class="meta-barra-fundo">
        <div class="meta-barra" style="width:${pct}%"></div>
      </div>
      <div class="meta-card-acoes">
        <button class="btn-ghost-sm btn-guardar-meta">+ Guardar</button>
        ${meta.acumulado > 0 ? '<button class="btn-ghost-sm btn-retirar-meta">− Retirar</button>' : ''}
      </div>
    `;
    card.querySelector('.meta-card-del').addEventListener('click', () => removerMeta(meta.id));
    card.querySelector('.btn-guardar-meta').addEventListener('click', () => guardarNaMeta(meta.id));
    const btnRetirar = card.querySelector('.btn-retirar-meta');
    if (btnRetirar) btnRetirar.addEventListener('click', () => retirarDaMeta(meta.id));
    listaMetasEl.appendChild(card);
  });

  metasConcluidasSecao.style.display = concluidas.length > 0 ? 'block' : 'none';
  concluidas.forEach(meta => {
    const card = document.createElement('div');
    card.className = 'meta-card meta-completa';
    card.innerHTML = `
      <div class="meta-card-topo">
        <span class="meta-card-nome">🏆 ${escapeHTML(meta.nome)}</span>
        <button class="meta-card-del" title="Remover meta">✕</button>
      </div>
      <div class="meta-card-valores">${formatarMoeda(meta.valor)} concluída</div>
    `;
    card.querySelector('.meta-card-del').addEventListener('click', () => removerMeta(meta.id));
    listaMetasConcluidasEl.appendChild(card);
  });

  if (precisaSalvar) salvar();

  btnAddMeta.style.display = (!temRecurso('ultimate') && metas.filter(m => !m.completa).length >= 1) ? 'none' : 'inline-block';
}

let metaValorAcaoId = null;
let metaValorAcaoTipo = null;

function guardarNaMeta(id) {
  abrirModalValorMeta(id, 'guardar');
}

function retirarDaMeta(id) {
  abrirModalValorMeta(id, 'retirar');
}

const modalValorMeta = document.getElementById('modalValorMeta');
const valorMetaTitulo = document.getElementById('valorMetaTitulo');
const valorMetaInput = document.getElementById('valorMetaInput');

function abrirModalValorMeta(id, tipo) {
  const meta = metas.find(m => m.id === id);
  if (!meta) return;
  metaValorAcaoId = id;
  metaValorAcaoTipo = tipo;
  valorMetaTitulo.textContent = tipo === 'guardar'
    ? `Quanto guardar em "${meta.nome}"?`
    : `Quanto retirar de "${meta.nome}"? (máx. ${formatarMoeda(meta.acumulado)})`;
  valorMetaInput.value = '';
  modalValorMeta.classList.remove('escondido');
  setTimeout(() => valorMetaInput.focus(), 50);
}

document.getElementById('btnCancelarValorMeta').addEventListener('click', () => {
  modalValorMeta.classList.add('escondido');
});

document.getElementById('formValorMeta').addEventListener('submit', (e) => {
  e.preventDefault();
  const meta = metas.find(m => m.id === metaValorAcaoId);
  const valor = parseFloat(valorMetaInput.value);
  if (!meta || isNaN(valor) || valor <= 0) return;

  if (metaValorAcaoTipo === 'guardar') {
    meta.acumulado = (meta.acumulado || 0) + valor;
    lancamentos.unshift({
      id: Date.now(), descricao: `Guardado para: ${meta.nome}`, valor, tipo: 'saida',
      categoria: '', recorrente: false, diaRecorrente: null, data: new Date()
    });
  } else {
    const valorReal = Math.min(valor, meta.acumulado);
    meta.acumulado -= valorReal;
    lancamentos.unshift({
      id: Date.now(), descricao: `Retirado de: ${meta.nome}`, valor: valorReal, tipo: 'entrada',
      categoria: '', recorrente: false, diaRecorrente: null, data: new Date()
    });
  }

  modalValorMeta.classList.add('escondido');
  salvar();
  renderizarTudo();
});

// --- Modal de parabéns ao completar meta ---
const modalParabensMeta = document.getElementById('modalParabensMeta');
const parabensMetaNome = document.getElementById('parabensMetaNome');

function mostrarParabensMeta(meta) {
  parabensMetaNome.textContent = meta.nome;
  modalParabensMeta.classList.remove('escondido');
}

document.getElementById('btnFecharParabensMeta').addEventListener('click', () => {
  modalParabensMeta.classList.add('escondido');
});

// --- Maiores lançamentos do mês atual ---
function montarTopLista(tipo, containerEl, vazioEl) {
  const chaveAtual = chaveMes(new Date());
  const itens = lancamentosAtivos()
    .filter(l => l.tipo === tipo && chaveMes(l.data) === chaveAtual)
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 5);

  containerEl.innerHTML = '';
  vazioEl.classList.toggle('mostrar', itens.length === 0);

  itens.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'top-item';
    const dataFormatada = item.data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    div.innerHTML = `
      <div class="top-pos">${i + 1}º</div>
      <div class="top-info">
        <div class="top-desc">${escapeHTML(item.descricao)}</div>
        <div class="top-data">${dataFormatada}</div>
      </div>
      <div class="top-valor">${formatarMoeda(item.valor)}</div>
    `;
    containerEl.appendChild(div);
  });
}

function atualizarGrafico() {
  montarTopLista('saida', graficoSaidaEl, graficoSaidaVazioEl);
  montarTopLista('entrada', graficoEntradaEl, graficoEntradaVazioEl);
}

// --- Resumo por mês (lucro/prejuízo) ---
function atualizarResumoMeses() {
  const grupos = {};
  lancamentos.forEach(l => {
    const chave = chaveMes(l.data);
    if (!grupos[chave]) grupos[chave] = { entradas: 0, saidas: 0, data: l.data, pendentes: 0 };
    if (itemPendente(l)) { grupos[chave].pendentes++; return; }
    if (l.tipo === 'entrada') grupos[chave].entradas += l.valor;
    else grupos[chave].saidas += l.valor;
  });

  const chaveAtual = chaveMes(new Date());
  const chaves = Object.keys(grupos).filter(c => c <= chaveAtual).sort().reverse();

  resumoMesesEl.innerHTML = '';
  resumoMesesVazioEl.classList.toggle('mostrar', chaves.length === 0);

  chaves.forEach(chave => {
    const { entradas, saidas, data, pendentes } = grupos[chave];
    const saldo = entradas - saidas;
    const total = entradas + saidas;
    const pctIn = total ? (entradas / total) * 100 : 0;
    const pctOut = total ? (saidas / total) * 100 : 0;

    let classeSaldo = 'zerado';
    let selo = 'neutro';
    let seloTexto = 'Neutro';
    if (saldo > 0) { classeSaldo = 'positivo'; selo = 'lucro'; seloTexto = 'Lucro'; }
    else if (saldo < 0) { classeSaldo = 'negativo'; selo = 'prejuizo'; seloTexto = 'Prejuízo'; }

    const statusPendente = pendentes > 0
      ? `<div class="mes-card-status pendente">🕒 Ainda tem ${pendentes} lançamento${pendentes > 1 ? 's' : ''} fixo${pendentes > 1 ? 's' : ''} agendado${pendentes > 1 ? 's' : ''}</div>`
      : '';

    const card = document.createElement('div');
    card.className = 'mes-card';
    card.innerHTML = `
      <div class="mes-card-topo">
        <span class="mes-card-nome">${nomeMes(data)}</span>
        <span class="mes-card-saldo ${classeSaldo}">${saldo >= 0 ? '+' : ''}${formatarMoeda(saldo)}</span>
      </div>
      <div class="mes-card-barras">
        <div class="mes-card-barra-in" style="width:${pctIn}%"></div>
        <div class="mes-card-barra-out" style="width:${pctOut}%"></div>
      </div>
      <div class="mes-card-linhas">
        <span>Entrou <b>${formatarMoeda(entradas)}</b></span>
        <span class="mes-card-selo ${selo}">${seloTexto}</span>
        <span>Saiu <b>${formatarMoeda(saidas)}</b></span>
      </div>
      ${statusPendente}
    `;
    resumoMesesEl.appendChild(card);
  });
}

// --- Gráfico de rosca: distribuição de gastos por categoria (mês atual) ---
const CORES_DONUT = ['#60a5fa', '#f97316', '#34d399', '#f472b6', '#a78bfa', '#facc15', '#f87171', '#22d3ee'];
const donutSvg = document.getElementById('donutSvg');
const donutTotalEl = document.getElementById('donutTotal');
const donutLegendaEl = document.getElementById('donutLegenda');
const donutVazioEl = document.getElementById('donutVazio');

function atualizarDonut() {
  const chaveAtual = chaveMes(new Date());
  const doMes = lancamentosAtivos().filter(l => l.tipo === 'saida' && chaveMes(l.data) === chaveAtual);

  const grupos = {};
  doMes.forEach(l => {
    const nome = (l.categoria && CATEGORIAS[l.categoria]) ? CATEGORIAS[l.categoria].nome : 'Outros';
    grupos[nome] = (grupos[nome] || 0) + l.valor;
  });

  const total = doMes.reduce((s, l) => s + l.valor, 0);
  const entradas = Object.entries(grupos).sort((a, b) => b[1] - a[1]);

  donutVazioEl.classList.toggle('mostrar', total === 0);
  donutTotalEl.textContent = formatarMoeda(total);

  const fraseEl = document.getElementById('fraseInteligente');
  if (fraseEl) {
    if (total > 0 && entradas.length > 0) {
      const [nomeMaior, valorMaior] = entradas[0];
      const pctMaior = Math.round((valorMaior / total) * 100);
      fraseEl.style.display = 'block';
      fraseEl.textContent = pctMaior >= 30
        ? `👀 ${nomeMaior} foi ${pctMaior}% dos seus gastos esse mês.`
        : `Seus gastos esse mês estão bem espalhados entre as categorias 👍`;
    } else {
      fraseEl.style.display = 'none';
    }
  }

  if (total === 0) {
    donutSvg.innerHTML = '';
    donutLegendaEl.innerHTML = '';
    return;
  }

  const raio = 50, cx = 60, cy = 60, largura = 16;
  const circ = 2 * Math.PI * raio;
  let acumulado = 0;
  const primeiraRenderizacao = donutSvg.innerHTML === '';
  let svg = `<circle class="donut-fundo" cx="${cx}" cy="${cy}" r="${raio}" fill="none" stroke="var(--panel-2)" stroke-width="${largura}"/>`;

  entradas.forEach(([nome, valor], i) => {
    const pct = valor / total;
    const tamanho = pct * circ;
    const cor = CORES_DONUT[i % CORES_DONUT.length];
    // Na primeira renderização começa zerado e anima até o valor real (entrada suave)
    const dashInicial = primeiraRenderizacao ? `0 ${circ}` : `${tamanho} ${circ - tamanho}`;
    svg += `<circle class="donut-fatia" cx="${cx}" cy="${cy}" r="${raio}" fill="none" stroke="${cor}" stroke-width="${largura}"
      stroke-dasharray="${dashInicial}" stroke-dashoffset="${-acumulado}"
      transform="rotate(-90 ${cx} ${cy})" stroke-linecap="butt"/>`;
    acumulado += tamanho;
  });

  donutSvg.innerHTML = svg;

  if (primeiraRenderizacao) {
    // Força o navegador a aplicar o estado "zerado" antes de animar pro valor real
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        let acumuladoAnim = 0;
        entradas.forEach(([nome, valor], i) => {
          const pct = valor / total;
          const tamanho = pct * circ;
          const fatia = donutSvg.querySelectorAll('.donut-fatia')[i];
          if (fatia) fatia.setAttribute('stroke-dasharray', `${tamanho} ${circ - tamanho}`);
          acumuladoAnim += tamanho;
        });
      });
    });
  }

  donutLegendaEl.innerHTML = entradas.map(([nome, valor], i) => {
    const pct = ((valor / total) * 100).toFixed(0);
    const cor = CORES_DONUT[i % CORES_DONUT.length];
    return `
      <div class="donut-legenda-item">
        <span class="donut-legenda-dot" style="background:${cor}"></span>
        <span class="donut-legenda-nome">${escapeHTML(nome)}</span>
        <span class="donut-legenda-pct">${pct}% · ${formatarMoeda(valor)}</span>
      </div>
    `;
  }).join('');
}

// --- Barra de meta no topo (layout PoupPix) ---
const heroMetaBarraWrap = document.getElementById('heroMetaBarraWrap');
const heroMetasListaEl = document.getElementById('heroMetasLista');

function atualizarBarraHeroMeta() {
  const ativas = metas.filter(m => !m.completa);
  if (ativas.length === 0) { heroMetaBarraWrap.style.display = 'none'; heroMetasListaEl.innerHTML = ''; return; }
  heroMetaBarraWrap.style.display = 'block';

  heroMetasListaEl.innerHTML = ativas.map(m => {
    const p = Math.min(((m.acumulado || 0) / m.valor) * 100, 100);
    return `
      <div class="hero-mini-meta">
        <div class="hero-mini-meta-topo">
          <span>${escapeHTML(m.nome)}</span>
          <span>${p.toFixed(0)}%</span>
        </div>
        <div class="hero-meta-barra-fundo"><div class="hero-meta-barra-preenchida" style="width:${p}%"></div></div>
      </div>
    `;
  }).join('');
}

// --- Modal de meta inicial (PoupPix) ---
const modalMetaInicial = document.getElementById('modalMetaInicial');
const metaPersonalizadaCampo = document.getElementById('metaPersonalizadaCampo');
const CHAVE_META_INICIAL_VISTA = 'saldo_meta_inicial_vista';

function verificarMetaInicialPoupix() {
  if (layoutAtual !== 'poupix') return;
  if (metas.length > 0) return;
  if (localStorage.getItem(CHAVE_META_INICIAL_VISTA) === '1') return;
  modalMetaInicial.classList.remove('escondido');
}

function criarMetaInicial(valor) {
  metas.push({ id: Date.now(), nome: 'Minha meta', valor, acumulado: 0, completa: false });
  localStorage.setItem(CHAVE_META_INICIAL_VISTA, '1');
  salvar();
  atualizarMeta();
  atualizarBarraHeroMeta();
  modalMetaInicial.classList.add('escondido');
}

document.querySelectorAll('.meta-inicial-opcao[data-valor]').forEach(btn => {
  btn.addEventListener('click', () => criarMetaInicial(parseFloat(btn.dataset.valor)));
});

document.getElementById('btnMetaPersonalizada').addEventListener('click', () => {
  metaPersonalizadaCampo.style.display = 'block';
});

document.getElementById('btnConfirmarMetaPersonalizada').addEventListener('click', () => {
  const valor = parseFloat(document.getElementById('metaPersonalizadaValor').value);
  if (isNaN(valor) || valor <= 0) { alert('Digita um valor válido.'); return; }
  criarMetaInicial(valor);
});

document.getElementById('btnPularMetaInicial').addEventListener('click', () => {
  localStorage.setItem(CHAVE_META_INICIAL_VISTA, '1');
  modalMetaInicial.classList.add('escondido');
});

// --- Aba Fixos: agrupa lançamentos recorrentes por série ---
const listaFixosEl = document.getElementById('listaFixos');
const fixosVazioEl = document.getElementById('fixosVazio');

function chaveSerie(item) {
  return `${item.descricao}|${item.valor}|${item.diaRecorrente}|${item.tipo}`;
}

function atualizarFixos() {
  const recorrentes = lancamentos.filter(l => l.recorrente);
  const series = {};
  recorrentes.forEach(item => {
    const chave = chaveSerie(item);
    if (!series[chave]) series[chave] = [];
    series[chave].push(item);
  });

  const chaves = Object.keys(series);
  fixosVazioEl.classList.toggle('mostrar', chaves.length === 0);
  listaFixosEl.innerHTML = '';

  chaves.forEach(chave => {
    const itens = series[chave].sort((a, b) => new Date(a.data) - new Date(b.data));
    const primeiro = itens[0];
    const lancados = itens.filter(i => !itemPendente(i)).length;
    const pendentes = itens.filter(i => itemPendente(i)).length;
    const ultimaData = itens[itens.length - 1].data;

    const card = document.createElement('div');
    card.className = 'fixo-card';
    card.innerHTML = `
      <div class="fixo-card-topo">
        <span class="fixo-card-nome">${ICONE_TIPO[primeiro.tipo]} ${escapeHTML(primeiro.descricao)}</span>
        <span class="fixo-card-valor ${primeiro.tipo}">${formatarMoeda(primeiro.valor)}</span>
      </div>
      <div class="fixo-card-info">Todo dia ${primeiro.diaRecorrente || '—'} · até ${nomeMes(ultimaData)}</div>
      <div class="fixo-card-progresso">
        <span>${lancados} lançado${lancados !== 1 ? 's' : ''}</span>
        ${pendentes > 0 ? `<span class="fixo-pendente-tag">🕒 ${pendentes} agendado${pendentes !== 1 ? 's' : ''}</span>` : '<span class="fixo-completo-tag">✓ completo</span>'}
      </div>
      <div class="fixo-card-acoes">
        ${pendentes > 0 ? '<button class="btn-ghost-sm btn-cancelar-serie">Cancelar restantes</button>' : ''}
        <button class="btn-ghost-sm btn-excluir-serie" style="color:var(--red);">Excluir tudo</button>
      </div>
    `;
    const btnCancelar = card.querySelector('.btn-cancelar-serie');
    if (btnCancelar) btnCancelar.addEventListener('click', () => {
      if (!confirm('Cancelar os lançamentos futuros dessa série? Os que já foram lançados continuam no histórico.')) return;
      lancamentos = lancamentos.filter(l => !(chaveSerie(l) === chave && itemPendente(l)));
      salvar();
      renderizarTudo();
    });
    card.querySelector('.btn-excluir-serie').addEventListener('click', () => {
      if (!confirm('Excluir TODOS os lançamentos dessa série, inclusive os que já entraram?')) return;
      lancamentos = lancamentos.filter(l => chaveSerie(l) !== chave);
      salvar();
      renderizarTudo();
    });
    listaFixosEl.appendChild(card);
  });
}

// --- Comparação com o mês anterior ---
function atualizarComparacao() {
  const agora = new Date();
  const chaveAtual = chaveMes(agora);
  const mesPassado = new Date(agora.getFullYear(), agora.getMonth() - 1, 1);
  const chaveAnterior = chaveMes(mesPassado);

  function totaisDoMes(chave) {
    const itens = lancamentosAtivos().filter(l => chaveMes(l.data) === chave);
    const saidas = itens.filter(l => l.tipo === 'saida').reduce((s, l) => s + l.valor, 0);
    const entradas = itens.filter(l => l.tipo === 'entrada').reduce((s, l) => s + l.valor, 0);
    return { saidas, entradas };
  }

  const atual = totaisDoMes(chaveAtual);
  const anterior = totaisDoMes(chaveAnterior);

  comparacaoEl.innerHTML = '';

  function linhaComparacao(label, valorAtual, valorAnterior) {
    let tagClasse = 'igual';
    let tagTexto = 'Igual';

    if (valorAnterior > 0) {
      const diffPct = ((valorAtual - valorAnterior) / valorAnterior) * 100;
      if (Math.abs(diffPct) < 1) {
        tagTexto = 'Igual';
        tagClasse = 'igual';
      } else if (diffPct > 0) {
        tagTexto = `+${diffPct.toFixed(0)}%`;
        tagClasse = label === 'Gastos' ? 'sobe' : 'desce';
      } else {
        tagTexto = `${diffPct.toFixed(0)}%`;
        tagClasse = label === 'Gastos' ? 'desce' : 'sobe';
      }
    } else if (valorAtual > 0) {
      tagTexto = 'Novo';
      tagClasse = label === 'Gastos' ? 'sobe' : 'desce';
    }

    const div = document.createElement('div');
    div.className = 'comp-linha';
    div.innerHTML = `
      <span class="comp-nome">${label}: ${formatarMoeda(valorAtual)}</span>
      <span class="comp-tag ${tagClasse}">${tagTexto}</span>
    `;
    comparacaoEl.appendChild(div);
  }

  linhaComparacao('Gastos', atual.saidas, anterior.saidas);
  linhaComparacao('Recebido', atual.entradas, anterior.entradas);
}

// --- Buscar dados do servidor ao abrir o app (se já logado) ---
async function buscarDadosServidorAoAbrir() {
  if (!tokenSessao) return;
  try {
    const resp = await fetch(API_URL + '/dados', {
      headers: { Authorization: 'Bearer ' + tokenSessao }
    });
    if (resp.ok) {
      const dadosServidor = await resp.json();
      lancamentos = (dadosServidor.lancamentos || []).map(l => ({ ...l, data: new Date(l.data) }));
      metaAlvo = dadosServidor.metaAlvo ?? null;
      criadoEm = dadosServidor.criadoEm || criadoEm;
      fotoUsuario = dadosServidor.foto || '';
      planoAtual = dadosServidor.planoAtual || 'free';
      devAtivo = dadosServidor.devAtivo || false;
      corEscolhida = dadosServidor.corEscolhida || 'azul';
      corLivreHex = dadosServidor.corLivreHex || '#3b82f6';
      layoutAtual = dadosServidor.layoutAtual || 'poupix';
      limiteGasto = dadosServidor.limiteGasto ?? null;
      metas = dadosServidor.metas || [];
      if (dadosServidor.xpPendente > 0) {
        ganharXp(dadosServidor.xpPendente);
        fetch(API_URL + '/xp-aplicado', { method: 'POST', headers: { Authorization: 'Bearer ' + tokenSessao } }).catch(() => {});
      }
      salvar();
      aplicarGating();
      atualizarBotaoPerfilTopo();
      renderizarTudo();
    } else if (resp.status === 401) {
      // Token expirado/inválido — desloga silenciosamente
      tokenSessao = '';
      localStorage.removeItem(CHAVE_TOKEN);
    }
  } catch (erro) {
    console.warn('Não consegui buscar dados do servidor agora — usando os dados salvos neste aparelho.', erro);
  }
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && tokenSessao) {
    buscarDadosServidorAoAbrir(); if(typeof enviarTelefonePendenteSeExistir==='function') enviarTelefonePendenteSeExistir();
  }
});

// --- Bloquear zoom da página (pinça, Ctrl+scroll, Ctrl +/-) ---
document.addEventListener('wheel', (e) => {
  if (e.ctrlKey) e.preventDefault();
}, { passive: false });

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0'].includes(e.key)) e.preventDefault();
});

document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());

let ultimoToqueDuplo = 0;
document.addEventListener('touchend', (e) => {
  const agora = Date.now();
  if (agora - ultimoToqueDuplo < 300) e.preventDefault();
  ultimoToqueDuplo = agora;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

// --- Inicialização ---
atualizarDataTopo();
carregar();
aplicarCor(corEscolhida);
verificarNome();
aplicarSaldoOculto();
aplicarGating();
preencherCategorias();
preencherDiasRecorrente();
carregarCamposPerfil();
atualizarBotaoPerfilTopo();
renderizarTudo();
buscarDadosServidorAoAbrir(); if(typeof enviarTelefonePendenteSeExistir==='function') enviarTelefonePendenteSeExistir();


// === ECONOMIX V3 FINAL - DEMO + STREAK + FAB + ZAP ===
const DEMO_LANCAMENTOS = [
  { id: 9001, descricao: 'Salário', valor: 2500, tipo: 'entrada', categoria: 'mesada', data: new Date(Date.now()-9*86400000), confirmado: true },
  { id: 9002, descricao: 'Freela', valor: 450, tipo: 'entrada', categoria: 'mesada', data: new Date(Date.now()-8*86400000), confirmado: true },
  { id: 9003, descricao: 'Mesada', valor: 200, tipo: 'entrada', categoria: 'mesada', data: new Date(Date.now()-7*86400000), confirmado: true },
  { id: 9004, descricao: 'Venda usado', valor: 120, tipo: 'entrada', categoria: 'outros', data: new Date(Date.now()-6*86400000), confirmado: true },
  { id: 9005, descricao: 'Prêmio', valor: 80, tipo: 'entrada', categoria: 'outros', data: new Date(Date.now()-5*86400000), confirmado: true },
  { id: 9006, descricao: 'iFood', valor: 48.9, tipo: 'saida', categoria: 'comida', data: new Date(Date.now()-4*86400000), confirmado: true },
  { id: 9007, descricao: 'Uber', valor: 22.5, tipo: 'saida', categoria: 'transporte', data: new Date(Date.now()-3*86400000), confirmado: true },
  { id: 9008, descricao: 'Cinema', valor: 65, tipo: 'saida', categoria: 'lazer', data: new Date(Date.now()-2*86400000), confirmado: true },
  { id: 9009, descricao: 'Curso online', valor: 39.9, tipo: 'saida', categoria: 'estudos', data: new Date(Date.now()-1*86400000), confirmado: true },
  { id: 9010, descricao: 'Jogo Steam', valor: 59.9, tipo: 'saida', categoria: 'jogos', data: new Date(Date.now()), confirmado: true },
];
// Modo demo: some SEMPRE que não há login (sem token e sem "sem conta" salvo). "Começar do zero" só
// esconde pelo resto dessa sessão de navegador (sessionStorage) — na próxima vez que abrir sem login, volta.
function aplicarModoDemoSeVazio(){
  const temSessao = typeof tokenSessao !== 'undefined' && tokenSessao;
  const escondidoNestaSessao = sessionStorage.getItem('demo_escondido_sessao') === '1';
  if(!temSessao && !escondidoNestaSessao && typeof lancamentos !== 'undefined' && lancamentos.length===0){
    lancamentos = DEMO_LANCAMENTOS.map(l=>({...l}));
    if (typeof metaAlvo === 'undefined' || metaAlvo === null || metaAlvo === undefined) {
      metaAlvo = 2500;
      const inputMeta = document.getElementById('metaAlvo'); if (inputMeta) inputMeta.value = 2500;
      const nomeMeta = document.getElementById('metaNome'); if (nomeMeta) nomeMeta.value = 'iPhone';
    }
    const b = document.getElementById('demoBanner'); if(b) b.style.display='flex';
    if(typeof renderizarTudo==='function') renderizarTudo();
    if(typeof atualizarMeta==='function') atualizarMeta();
  }
}
function limparDemo(){
  lancamentos = [];
  sessionStorage.setItem('demo_escondido_sessao','1'); // só nessa sessão — sem login, o demo volta na próxima
  const b = document.getElementById('demoBanner'); if(b) b.style.display='none';
  if(typeof salvar==='function') salvar(); if(typeof renderizarTudo==='function') renderizarTudo();
}
// --- Utilidades de data local (evita bug de fuso: nunca usar toISOString p/ "hoje") ---
function dataLocalISO(d){
  const ano = d.getFullYear();
  const mes = String(d.getMonth()+1).padStart(2,'0');
  const dia = String(d.getDate()).padStart(2,'0');
  return `${ano}-${mes}-${dia}`;
}
function dataLocalDeStr(str){
  const [a,m,d] = str.split('-').map(Number);
  return new Date(a, m-1, d);
}
function diaAnteriorStr(str){
  const d = dataLocalDeStr(str);
  d.setDate(d.getDate()-1);
  return dataLocalISO(d);
}
function diaSeguinteStr(str){
  const d = dataLocalDeStr(str);
  d.setDate(d.getDate()+1);
  return dataLocalISO(d);
}

// Se o último registro não foi hoje nem ontem, o streak já quebrou — zera na hora
// (antes só quebrava "lazy" na próxima confirmação; agora reflete assim que o dia vira)
function verificarStreakQuebrado(){
  const hoje = dataLocalISO(new Date());
  const ultimo = localStorage.getItem('saldo_ultimo_registro_global');
  if (!ultimo) return;
  const aindaVivo = ultimo === hoje || ultimo === diaAnteriorStr(hoje);
  if (!aindaVivo && parseInt(localStorage.getItem('saldo_streak_global')||'0') !== 0) {
    localStorage.setItem('saldo_streak_global', '0');
  }
}

function atualizarStreak(){
  verificarStreakQuebrado();
  let streak = parseInt(localStorage.getItem('saldo_streak_global')||'0');
  const badge = document.getElementById('streakBadge');
  if(badge){
    badge.style.display = streak>0 ? 'inline-flex' : 'none';
    badge.textContent = `🔥 ${streak} dia${streak>1?'s':''}`;
  }
}
function registrarDiaAtivoHistorico(dataStr, streakValor){
  let hist = {};
  try { hist = JSON.parse(localStorage.getItem('saldo_dias_ativos_hist') || '{}'); } catch(e) { hist = {}; }
  hist[dataStr] = streakValor;
  localStorage.setItem('saldo_dias_ativos_hist', JSON.stringify(hist));
}

// --- Marcos de recompensa do streak: cada marco dá algo diferente ---
const MARCOS_RECOMPENSA_STREAK = [
  { dias: 3,  xp: 20,  desc: '+20 XP' },
  { dias: 7,  xp: 50,  desc: '+50 XP e tema Neon', tema: 'neon' },
  { dias: 14, xp: 80,  desc: '+80 XP e uma cor Pro', cor: 'pro' },
  { dias: 21, xp: 120, desc: '+120 XP e uma cor Ultimate', cor: 'ultimate' },
  { dias: 30, xp: 0,   desc: 'Ultimate grátis por 3 dias', trialDias: 3 },
  { dias: 60, xp: 200, desc: '+200 XP' },
  { dias: 90, xp: 300, desc: '+300 XP e Ultimate grátis por 1 ano', trialDias: 365 },
];
function marcoPorDias(dias){
  return MARCOS_RECOMPENSA_STREAK.find(m => m.dias === dias);
}
function proximoMarcoApos(streakAtual){
  return MARCOS_RECOMPENSA_STREAK.find(m => m.dias > streakAtual) || null;
}

// Libera bônus cosmético por streak sem mexer no plano pago real (mesmo padrão do tema Neon)
function corLiberadaPorStreak(nivel){
  if (nivel === 'pro') return localStorage.getItem('saldo_cor_pro_liberada') === '1';
  if (nivel === 'ultimate') return localStorage.getItem('saldo_cor_ultimate_liberada') === '1';
  return false;
}
function trialUltimateAtivo(){
  const expira = parseInt(localStorage.getItem('saldo_trial_ultimate_expira') || '0');
  return expira > Date.now();
}
function concederTrialUltimate(dias){
  const atual = parseInt(localStorage.getItem('saldo_trial_ultimate_expira') || '0');
  const base = Math.max(atual, Date.now());
  const novaExpiracao = base + dias * 86400000;
  localStorage.setItem('saldo_trial_ultimate_expira', String(novaExpiracao));
}
function aplicarRecompensaMarco(marco){
  if (marco.xp > 0) ganharXp(marco.xp);
  if (marco.tema === 'neon') localStorage.setItem('saldo_layout_neon_liberado', '1');
  if (marco.cor === 'pro') localStorage.setItem('saldo_cor_pro_liberada', '1');
  if (marco.cor === 'ultimate') localStorage.setItem('saldo_cor_ultimate_liberada', '1');
  if (marco.trialDias) concederTrialUltimate(marco.trialDias);
}

function renderizarCalendarioXpPerfil(){
  const grade = document.getElementById('miniCalGrade');
  const cabecalho = document.getElementById('miniCalCabecalho');
  if (!grade || !cabecalho) return;

  let hist = {};
  try { hist = JSON.parse(localStorage.getItem('saldo_dias_ativos_hist') || '{}'); } catch(e) { hist = {}; }

  const marcosResgatados = new Set();
  MARCOS_RECOMPENSA_STREAK.forEach(m => {
    if (localStorage.getItem(`saldo_marco_${m.dias}_resgatado`) === '1') marcosResgatados.add(m.dias);
  });

  const hojeDate = new Date();
  const ano = hojeDate.getFullYear();
  const mes = hojeDate.getMonth();
  const hojeStr = dataLocalISO(hojeDate);
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const totalDiasMes = new Date(ano, mes + 1, 0).getDate();

  const streakAtual = parseInt(localStorage.getItem('saldo_streak_global') || '0');
  const ultimoRegistro = localStorage.getItem('saldo_ultimo_registro_global');
  // O streak só "conta vivo" se o último registro foi hoje ou ontem (senão já quebrou)
  const streakVivo = ultimoRegistro === hojeStr || ultimoRegistro === diaAnteriorStr(hojeStr);
  const diasParaProximoMarco = {}; // dataStr -> marco previsto (dias futuros, projetando streak diário a partir de hoje)
  if (streakVivo) {
    let dataProjecao = dataLocalDeStr(hojeStr);
    // Se hoje ainda não registrou, o dia de hoje seria streak+1; senão hoje já é o streak atual
    let streakDeHoje = (ultimoRegistro === hojeStr) ? streakAtual : streakAtual + 1;
    let streakProjetado = streakDeHoje;
    // projeta os próximos ~120 dias a partir de hoje (cobre o marco de 90 dias)
    for (let i = 0; i < 120; i++) {
      const dStr = dataLocalISO(dataProjecao);
      const marco = marcoPorDias(streakProjetado);
      if (marco && !marcosResgatados.has(marco.dias)) {
        diasParaProximoMarco[dStr] = marco;
      }
      dataProjecao.setDate(dataProjecao.getDate() + 1);
      streakProjetado++;
    }
  }

  cabecalho.innerHTML = ['D','S','T','Q','Q','S','S'].map(d => `<span>${d}</span>`).join('');

  let html = '';
  for (let i = 0; i < primeiroDiaSemana; i++) {
    html += '<div class="mini-cal-dia mini-cal-vazio"></div>';
  }
  let ativosNoMes = 0;
  for (let dia = 1; dia <= totalDiasMes; dia++) {
    const dataStr = `${ano}-${String(mes+1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
    const streakDoDia = hist[dataStr];
    const foiAtivo = streakDoDia !== undefined;
    const marcoDoDia = foiAtivo ? marcoPorDias(streakDoDia) : null;
    const foiRecompensaGanha = !!marcoDoDia;
    const ehFuturo = dataStr > hojeStr;
    const previstoParaEsseDia = ehFuturo ? diasParaProximoMarco[dataStr] : null;
    const ehHoje = dataStr === hojeStr;
    if (foiAtivo) ativosNoMes++;
    let classes = 'mini-cal-dia';
    if (foiRecompensaGanha) classes += ' mini-cal-recompensa-ganha';
    else if (foiAtivo) classes += ' mini-cal-ativo';
    else if (previstoParaEsseDia) classes += ' mini-cal-recompensa-prevista';
    if (ehHoje) classes += ' mini-cal-hoje';
    const titulo = foiRecompensaGanha ? ` title="${marcoDoDia.desc}"` : (previstoParaEsseDia ? ` title="Se manter o streak: ${previstoParaEsseDia.desc}"` : '');
    html += `<div class="${classes}"${titulo}>${dia}</div>`;
  }
  grade.innerHTML = html;

  const qtdEl = document.getElementById('xpCalDiasQtd');
  if (qtdEl) qtdEl.textContent = `${ativosNoMes} dia${ativosNoMes===1?'':'s'} este mês`;

  const xp = parseInt(localStorage.getItem('saldo_xp_global') || '0');
  let nivel = 1, restante = xp;
  while (restante >= xpNecessarioPara(nivel)) { restante -= xpNecessarioPara(nivel); nivel++; }
  const precisa = xpNecessarioPara(nivel);
  const nivelTexto = document.getElementById('xpCalNivelTexto');
  const valorTexto = document.getElementById('xpCalValorTexto');
  const barra = document.getElementById('xpBarraPreenchimento');
  if (nivelTexto) nivelTexto.textContent = `Nível ${nivel}`;
  if (valorTexto) valorTexto.textContent = `${restante}/${precisa} XP`;
  if (barra) barra.style.width = `${Math.min(100, (restante / precisa) * 100)}%`;

  renderizarProximasRecompensas(streakVivo, streakAtual, ultimoRegistro, hojeStr, marcosResgatados);
}

// Lista abaixo do calendário com os próximos marcos, mesmo que caiam no mês que vem
function renderizarProximasRecompensas(streakVivo, streakAtual, ultimoRegistro, hojeStr, marcosResgatados){
  const lista = document.getElementById('xpCalProximosLista');
  if (!lista) return;

  const streakBase = !streakVivo ? 0 : ((ultimoRegistro === hojeStr) ? streakAtual : streakAtual + 1);
  // dia "0" da projeção = hoje (se ainda não registrado) ou o dia já registrado hoje
  let dataCursor = dataLocalDeStr(hojeStr);
  let streakCursor = streakBase || 1; // se streak quebrado, o próximo dia ativo recomeça em 1

  const proximos = [];
  for (let i = 0; i < 400 && proximos.length < 4; i++) {
    const marco = marcoPorDias(streakCursor);
    if (marco && !marcosResgatados.has(marco.dias)) {
      const dStr = dataLocalISO(dataCursor);
      let quando;
      if (dStr === hojeStr) quando = 'Hoje';
      else if (dStr === diaSeguinteStr(hojeStr)) quando = 'Amanhã';
      else {
        const d = dataLocalDeStr(dStr);
        quando = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      }
      proximos.push({ dia: marco.dias, desc: marco.desc, quando, dStr });
    }
    dataCursor.setDate(dataCursor.getDate() + 1);
    streakCursor++;
  }

  if (proximos.length === 0) {
    lista.innerHTML = `<div class="xp-cal-proximo-item"><span class="xp-cal-proximo-desc">Você já resgatou todas as recompensas de streak 🎉</span></div>`;
    return;
  }

  lista.innerHTML = proximos.map(p => `
    <div class="xp-cal-proximo-item${p.quando === 'Amanhã' ? ' xp-cal-proximo-amanha' : ''}">
      <div class="xp-cal-proximo-esq">
        <span class="xp-cal-proximo-dia">Dia ${p.dia}</span>
        <span class="xp-cal-proximo-desc">${p.desc}</span>
      </div>
      <span class="xp-cal-proximo-quando">${p.quando}</span>
    </div>
  `).join('');
}

function registrarStreakAgora(){
  const hoje = dataLocalISO(new Date());
  const ultimo = localStorage.getItem('saldo_ultimo_registro_global');
  let streak = parseInt(localStorage.getItem('saldo_streak_global')||'0');
  let marcoAtingido = null;
  if(ultimo!==hoje){
    const ontem = diaAnteriorStr(hoje);
    streak = (ontem===ultimo) ? streak+1 : 1;
    localStorage.setItem('saldo_streak_global', String(streak));
    localStorage.setItem('saldo_ultimo_registro_global', hoje);
    registrarDiaAtivoHistorico(hoje, streak);
    atualizarStreak();

    const marco = marcoPorDias(streak);
    if (marco && localStorage.getItem(`saldo_marco_${marco.dias}_resgatado`) !== '1') {
      localStorage.setItem(`saldo_marco_${marco.dias}_resgatado`, '1');
      aplicarRecompensaMarco(marco);
      if (window.confetti) confetti({ particleCount: 130, spread: 85, origin: { y: 0.7 } });
      setTimeout(() => alert(`🔥 ${marco.dias} dias seguidos! Recompensa: ${marco.desc}`), 400);
      marcoAtingido = marco;
    }
    renderizarCalendarioXpPerfil();
  }
  return marcoAtingido;
}

// --- XP e nível: ganha XP a cada lançamento novo e a cada dia de streak ---
function xpNecessarioPara(nivel) {
  return nivel * 100; // nível 1->100xp, nível 2->200xp, etc (crescente e simples)
}
function atualizarBadgeXp() {
  const xp = parseInt(localStorage.getItem('saldo_xp_global') || '0');
  let nivel = 1;
  let restante = xp;
  while (restante >= xpNecessarioPara(nivel)) {
    restante -= xpNecessarioPara(nivel);
    nivel++;
  }
  const badge = document.getElementById('xpBadge');
  if (badge) {
    badge.style.display = 'inline-flex';
    badge.textContent = `⭐ Nível ${nivel}`;
    badge.title = `${restante}/${xpNecessarioPara(nivel)} XP pro próximo nível`;
  }
  return nivel;
}
function ganharXp(quantidade) {
  const nivelAntes = atualizarBadgeXp();
  const xpAtual = parseInt(localStorage.getItem('saldo_xp_global') || '0');
  localStorage.setItem('saldo_xp_global', String(xpAtual + quantidade));
  const nivelDepois = atualizarBadgeXp();
  renderizarCalendarioXpPerfil();
  if (nivelDepois > nivelAntes) {
    const badge = document.getElementById('xpBadge');
    if (badge) {
      badge.classList.remove('subiu-nivel');
      void badge.offsetWidth;
      badge.classList.add('subiu-nivel');
    }
    if (window.confetti) confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
  }
}
// ZAP
async function verificarTelefonePendente(){
  const temLocal = localStorage.getItem('saldo_telefone');
  const pulou = localStorage.getItem('saldo_zap_pulado');
  const pulouEm = localStorage.getItem('saldo_zap_pulado_em');
  const diasDesdeQuePulou = pulouEm ? Math.floor((Date.now() - new Date(pulouEm).getTime()) / 86400000) : Infinity;
  const jaPerguntouHoje = localStorage.getItem('zap_perguntou_hoje') === new Date().toISOString().slice(0,10);
  // Pergunta de novo se: nunca perguntou, OU pulou mas já fazem 3+ dias — mas só uma vez por dia
  const podePerguntarDeNovo = pulou && diasDesdeQuePulou >= 3;
  if(!temLocal && (!pulou || podePerguntarDeNovo) && !jaPerguntouHoje){
    setTimeout(()=>{ const m=document.getElementById('modalTelefone'); if(m) m.classList.remove('escondido'); }, 1800);
  }
}
async function salvarTelefoneZap(telefone, optin){
  const telLimpo = telefone.replace(/\D/g,'');
  if(telLimpo.length < 10 || telLimpo.length > 13){ alert('Número inválido, coloca DDD. Ex: 61999999999'); return false; }
  localStorage.setItem('saldo_telefone', telLimpo);
  localStorage.setItem('saldo_zap_pulado', optin ? '0' : '1');
  localStorage.setItem('saldo_zap_pulado_em', new Date().toISOString());
  localStorage.setItem('zap_perguntou_hoje', new Date().toISOString().slice(0,10));

  if(typeof tokenSessao === 'undefined' || !tokenSessao){
    // Sem login ainda: guarda pra mandar quando logar (não dá pra verificar código sem sessão)
    localStorage.setItem('telefone_pendente_para_servidor', JSON.stringify({telefone:telLimpo, zapOptin:optin}));
    return true;
  }

  try{
    const resp = await fetch(API_URL + '/telefone', {
      method:'POST',
      headers:{'Content-Type':'application/json', Authorization:'Bearer '+tokenSessao},
      body: JSON.stringify({telefone:telLimpo, zapOptin:optin})
    });
    const dados = await resp.json();
    if (!resp.ok) { alert(dados.erro || 'Não consegui salvar seu telefone.'); return false; }
    atualizarStatusZapConfig();
    if (dados.precisaVerificar) {
      abrirModalCodigoZap();
    }
    return true;
  }catch(e){
    alert('Erro de conexão ao salvar telefone.');
    return false;
  }
}

// --- Modal de código de verificação do WhatsApp ---
function abrirModalCodigoZap(){
  const m = document.getElementById('modalCodigoZap');
  const inputCodigo = document.getElementById('inputCodigoZap');
  const erroEl = document.getElementById('codigoZapErro');
  if (!m) return;
  if (inputCodigo) inputCodigo.value = '';
  if (erroEl) erroEl.style.display = 'none';
  m.classList.remove('escondido');
  setTimeout(() => { if (inputCodigo) inputCodigo.focus(); }, 250);
}
async function confirmarCodigoZap(){
  const inputCodigo = document.getElementById('inputCodigoZap');
  const erroEl = document.getElementById('codigoZapErro');
  const codigo = inputCodigo ? inputCodigo.value.trim() : '';
  if (erroEl) erroEl.style.display = 'none';
  if (!codigo || codigo.length !== 6) {
    if (erroEl) { erroEl.textContent = 'Digita os 6 números do código.'; erroEl.style.display = 'block'; }
    return;
  }
  try{
    const resp = await fetch(API_URL + '/verificar-zap', {
      method:'POST',
      headers:{'Content-Type':'application/json', Authorization:'Bearer '+tokenSessao},
      body: JSON.stringify({codigo})
    });
    const dados = await resp.json();
    if (!resp.ok) {
      if (erroEl) { erroEl.textContent = dados.erro || 'Código inválido.'; erroEl.style.display = 'block'; }
      return;
    }
    document.getElementById('modalCodigoZap').classList.add('escondido');
    if (window.confetti) confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    atualizarStatusZapConfig();
    setTimeout(verificarMetaInicialPosLogin, 500);
  }catch(e){
    if (erroEl) { erroEl.textContent = 'Erro de conexão, tenta de novo.'; erroEl.style.display = 'block'; }
  }
}

// --- Status do zap em Configurações > Perfil ---
async function atualizarStatusZapConfig(){
  const statusEl = document.getElementById('statusZap');
  const btnRemover = document.getElementById('btnRemoverZap');
  if (!statusEl || typeof tokenSessao === 'undefined' || !tokenSessao) return;
  try{
    const resp = await fetch(API_URL + '/telefone/status', { headers:{ Authorization:'Bearer '+tokenSessao } });
    if (!resp.ok) return;
    const dados = await resp.json();
    if (dados.temTelefone && dados.zapOptin && dados.zapVerificado) {
      statusEl.textContent = '✅ Zap ativo';
      statusEl.className = 'limite-aviso ok';
      if (btnRemover) btnRemover.style.display = 'inline-block';
    } else if (dados.temTelefone && dados.zapOptin && !dados.zapVerificado) {
      statusEl.textContent = '⏳ Falta confirmar o código que mandamos no seu WhatsApp';
      statusEl.className = 'limite-aviso perigo';
      if (btnRemover) btnRemover.style.display = 'inline-block';
    } else {
      statusEl.textContent = '❌ Zap desativado';
      statusEl.className = 'limite-aviso';
      if (btnRemover) btnRemover.style.display = 'none';
    }
  }catch(e){}
}
async function removerZap(){
  if (!confirm('Remover seu número de WhatsApp? Você não vai receber mais resumos por lá.')) return;
  try{
    await fetch(API_URL + '/telefone/remover', { method:'POST', headers:{ Authorization:'Bearer '+tokenSessao } });
    localStorage.removeItem('saldo_telefone');
    if (configTelefone) configTelefone.value = '';
    if (configZapOptin) configZapOptin.checked = false;
    atualizarStatusZapConfig();
  }catch(e){ alert('Erro ao remover o WhatsApp.'); }
}
document.addEventListener('DOMContentLoaded', ()=>{
  setTimeout(()=>{
    aplicarModoDemoSeVazio(); atualizarStreak(); atualizarBadgeXp(); renderizarCalendarioXpPerfil(); verificarTelefonePendente();
    const btnDemo=document.getElementById('btnLimparDemo'); if(btnDemo) btnDemo.addEventListener('click', limparDemo);
    const fab=document.getElementById('fabAdd'); if(fab) fab.addEventListener('click', ()=>{
      if (!tokenSessao) {
        const msgEl = document.querySelector('#modalBoasVindas .modal-card p, #modalBoasVindas p');
        if (msgEl) msgEl.textContent = 'Faça login com Google pra lançar seus gastos de verdade (o modo demo é só pra você experimentar).';
        modalBoasVindas.classList.remove('escondido');
        return;
      }
      abrirSheetForm();
    });
    const btnSalvarTel=document.getElementById('btnSalvarTelefone'); const btnPularTel=document.getElementById('btnPularTelefone');
    if(btnSalvarTel) btnSalvarTel.addEventListener('click', async ()=>{ const input=document.getElementById('inputTelefoneZap'); const check=document.getElementById('checkZapOptin'); const tel=input?input.value:''; const optin=check?check.checked:true; if(!tel){ alert('Coloca seu número'); return; } btnSalvarTel.textContent='Salvando...'; const ok=await salvarTelefoneZap(tel,optin); btnSalvarTel.textContent='Ativar alertas no Zap'; if(ok){ document.getElementById('modalTelefone').classList.add('escondido'); if(window.confetti) confetti({particleCount:100}); const modalCodigo=document.getElementById('modalCodigoZap'); if(modalCodigo && modalCodigo.classList.contains('escondido')){ setTimeout(verificarMetaInicialPosLogin, 500); } } });
    if(btnPularTel) btnPularTel.addEventListener('click', ()=>{ localStorage.setItem('saldo_zap_pulado','1'); localStorage.setItem('saldo_zap_pulado_em', new Date().toISOString()); localStorage.setItem('zap_perguntou_hoje', new Date().toISOString().slice(0,10)); document.getElementById('modalTelefone').classList.add('escondido'); setTimeout(verificarMetaInicialPosLogin, 500); });

    const btnConfirmarCodigo = document.getElementById('btnConfirmarCodigoZap');
    if (btnConfirmarCodigo) btnConfirmarCodigo.addEventListener('click', confirmarCodigoZap);
    const btnReenviarCodigo = document.getElementById('btnReenviarCodigoZap');
    if (btnReenviarCodigo) btnReenviarCodigo.addEventListener('click', async () => {
      const tel = localStorage.getItem('saldo_telefone');
      if (!tel) return;
      btnReenviarCodigo.textContent = 'Reenviando...';
      await salvarTelefoneZap(tel, true);
      btnReenviarCodigo.textContent = 'Reenviar código';
    });
    const btnRemover = document.getElementById('btnRemoverZap');
    if (btnRemover) btnRemover.addEventListener('click', removerZap);
  }, 700);
});
async function enviarTelefonePendenteSeExistir(){
  const pend = localStorage.getItem('telefone_pendente_para_servidor');
  if(pend && typeof tokenSessao !== 'undefined' && tokenSessao){
    try{
      const obj = JSON.parse(pend);
      await fetch(API_URL + '/telefone', { method:'POST', headers:{'Content-Type':'application/json', Authorization:'Bearer '+tokenSessao}, body:JSON.stringify(obj) });
      localStorage.removeItem('telefone_pendente_para_servidor');
    }catch(e){}
  }
}
