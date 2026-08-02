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
const SENHA_DEV = '1708';
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
  { seletor: '[data-tab="lancar"]', titulo: 'Lançar', texto: 'Aqui você anota o que gastou ou recebeu. Escolhe "Gastei" ou "Recebi" e clica em Adicionar.' },
  { seletor: '[data-tab="meses"]', titulo: 'Meses', texto: 'Mostra se cada mês fechou no lucro ou no prejuízo, separadinho por período.' },
  { seletor: '[data-tab="analise"]', titulo: 'Análise', texto: 'Suas metas de economia, comparação com o mês passado e maiores lançamentos.' },
  { seletor: '[data-tab="fixos"]', titulo: 'Fixos', texto: 'Gerencie seus gastos e ganhos que se repetem todo mês, sem lotar sua tela.' },
  { seletor: '#btnPerfil', titulo: 'Seu perfil', texto: 'Clica aqui pra ver sua conta, foto e data de criação.' },
  { seletor: '#btnConfig', titulo: 'Configurações', texto: 'Aqui ficam plano, personalização, modo desenvolvedor e mais.' }
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
}

btnTourAnterior.addEventListener('click', () => irParaPassoTour(Math.max(0, passoTourAtual - 1)));
btnTourProximo.addEventListener('click', () => irParaPassoTour(passoTourAtual + 1));
btnTourFechar.addEventListener('click', fecharTour);
window.addEventListener('resize', () => {
  if (!tourOverlay.classList.contains('escondido')) posicionarTour(passoTourAtual);
});

function mostrarTutorialInicialSeNecessario() {
  if (localStorage.getItem(CHAVE_TUTORIAL_VISTO) === '1') return;
  tourOverlay.classList.remove('escondido');
  setTimeout(() => irParaPassoTour(0), 50);
}

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
    const liberado = temRecurso(nivel);
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
    if (!temRecurso(nivel)) {
      alert(nivel === 'pro' ? 'Essa cor é exclusiva dos planos Pro e Ultimate.' : 'Essa cor é exclusiva do plano Ultimate.');
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

function renderizarGradeLayout() {
  layoutGradeEl.querySelectorAll('.layout-opcao').forEach(btn => {
    const layout = btn.dataset.layout;
    btn.classList.toggle('ativa', layout === layoutAtual);
    btn.classList.toggle('bloqueada', !temRecurso(nivelLayout[layout]));
  });
}

layoutGradeEl.querySelectorAll('.layout-opcao').forEach(btn => {
  btn.addEventListener('click', () => {
    const layout = btn.dataset.layout;
    if (!temRecurso(nivelLayout[layout])) {
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

function lancamentosAtivos() {
  return lancamentos.filter(l => !itemPendente(l));
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
  sincronizarComServidor();
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
  return devAtivo ? devPlanoEscolhido : planoAtual;
}

function temRecurso(nivelMinimo) {
  const ordem = { free: 0, pro: 1, ultimate: 2 };
  return ordem[planoEfetivo()] >= ordem[nivelMinimo];
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

  if (!temRecurso(NIVEL_DA_COR[corEscolhida] || 'ultimate') && corEscolhida !== 'azul') {
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
}

document.getElementById('btnConfig').addEventListener('click', abrirConfig);
btnFecharConfig.addEventListener('click', () => {
  configFullscreen.classList.add('escondido');
  document.body.style.overflow = '';
});
btnPerfilConfig.addEventListener('click', abrirConfig);

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

function confirmarSair() {
  if (!confirm('Isso vai sair da sua conta neste aparelho. Seus dados continuam salvos no servidor (se você tiver conta) e você pode entrar de novo quando quiser. Continuar?')) return;
  nomeUsuario = '';
  emailUsuario = '';
  fotoUsuario = '';
  tokenSessao = '';
  criadoEm = '';
  localStorage.removeItem(CHAVE_NOME);
  localStorage.removeItem(CHAVE_EMAIL);
  localStorage.removeItem(CHAVE_FOTO);
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_CRIADOEM);
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
function carregarCamposPerfil() {
  configNome.value = nomeUsuario;
  configEmail.value = emailUsuario;
  perfilFotoImg.src = fotoUsuario || AVATAR_PADRAO;
  perfilFotoImg.style.display = 'block';
  perfilFotoPlaceholder.style.display = 'none';
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
  fotoUsuario = cropCanvas.toDataURL('image/jpeg', 0.88);
  salvar();
  atualizarBotaoPerfilTopo();
  carregarCamposPerfil();
  modalCropFoto.classList.add('escondido');
});

btnSalvarPerfil.addEventListener('click', () => {
  const nome = configNome.value.trim();
  if (nome) {
    nomeUsuario = nome;
    saudacaoEl.textContent = `Olá, ${nomeUsuario}`;
  }
  emailUsuario = configEmail.value.trim();
  salvar();
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
  if (!limiteGasto) { limiteAvisoEl.textContent = ''; return; }
  const chaveAtual = chaveMes(new Date());
  const gastoMes = lancamentosAtivos()
    .filter(l => l.tipo === 'saida' && chaveMes(l.data) === chaveAtual)
    .reduce((s, l) => s + l.valor, 0);

  if (gastoMes >= limiteGasto) {
    limiteAvisoEl.textContent = `⚠️ Você já passou do limite de ${formatarMoeda(limiteGasto)} esse mês (gastou ${formatarMoeda(gastoMes)}).`;
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
    saudacaoEl.textContent = `Olá, ${nomeUsuario}`;
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
    }
  } catch (erroDados) {
    console.warn('Não consegui buscar os dados do servidor agora.', erroDados);
  }

  salvar();
  aplicarGating();
  saudacaoEl.textContent = `Olá, ${nomeUsuario}`;
  atualizarBotaoPerfilTopo();
  modalBoasVindas.classList.add('escondido');
  mostrarTutorialInicialSeNecessario();
  renderizarTudo();
  document.querySelector('.hero').classList.add('flash-sucesso');
  setTimeout(() => document.querySelector('.hero').classList.remove('flash-sucesso'), 900);
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
  saudacaoEl.textContent = `Olá, ${nomeUsuario}`;
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
async function sincronizarComServidor() {
  if (!tokenSessao) return;
  try {
    await fetch(API_URL + '/dados', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + tokenSessao
      },
      body: JSON.stringify({ lancamentos, metaAlvo, foto: fotoUsuario, planoAtual, devAtivo, corEscolhida, limiteGasto, metas, corLivreHex, layoutAtual })
    });
  } catch (erro) {
    console.warn('Não consegui sincronizar com o servidor agora (dados continuam salvos neste aparelho).', erro);
  }
}

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
  });
});

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

  const descricao = inputDesc.value.trim();
  const valor = parseFloat(inputValor.value);

  if (!descricao || isNaN(valor) || valor <= 0) return;

  if (editandoId === null && !temRecurso('pro') && lancamentos.length >= 40) {
    alert('Você atingiu o limite de 40 lançamentos do plano Free. Assine o Pro pra lançar sem limite.');
    return;
  }

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
      lancamentos.unshift({
        id: Date.now(),
        descricao,
        valor,
        tipo: tipoAtual,
        categoria: temRecurso('pro') ? selectCat.value : '',
        recorrente: false,
        diaRecorrente: null,
        data: new Date()
      });
    }
  }

  salvar();
  renderizarTudo();
  form.reset();
  inputDesc.focus();
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

  vazio.classList.toggle('mostrar', lancamentos.length === 0);
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
  li.className = `item ${item.tipo}${pendente ? ' pendente' : ''}`;
  li.dataset.id = item.id;

  const cat = item.categoria ? CATEGORIAS[item.categoria] : null;
  const icone = cat ? cat.icone : ICONE_TIPO[item.tipo];
  const sinal = item.tipo === 'saida' ? '-' : '+';
  const dataFormatada = item.data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  const tagRecorrente = item.recorrente ? `<span class="item-cat-tag">🔁 Fixo${item.diaRecorrente ? ' (dia ' + item.diaRecorrente + ')' : ''}</span>` : '';
  const tagCat = cat ? `<span class="item-cat-tag">${cat.nome}</span>` : '';
  const tagPendente = pendente ? `<span class="item-cat-tag item-tag-pendente">🕒 Agendado</span>` : '';

  li.innerHTML = `
    <div class="item-icone">${icone}</div>
    <div class="item-info">
      <div class="item-desc">${escapeHTML(item.descricao)}</div>
      <div class="item-data">${dataFormatada}</div>
      ${tagCat}${tagRecorrente}${tagPendente}
    </div>
    <div class="item-valor">${sinal} ${formatarMoeda(item.valor)}</div>
  `;

  li.addEventListener('click', () => abrirAcaoItem(item));

  return li;
}

// --- Popup de ação (editar/excluir) ---
const modalAcaoItem = document.getElementById('modalAcaoItem');
const acaoItemTitulo = document.getElementById('acaoItemTitulo');
const btnAcaoEditar = document.getElementById('btnAcaoEditar');
const btnAcaoExcluir = document.getElementById('btnAcaoExcluir');
const btnAcaoCancelar = document.getElementById('btnAcaoCancelar');
let itemAcaoAtual = null;

function abrirAcaoItem(item) {
  itemAcaoAtual = item;
  acaoItemTitulo.textContent = item.descricao;
  modalAcaoItem.classList.remove('escondido');
}

function fecharAcaoItem() {
  modalAcaoItem.classList.add('escondido');
  itemAcaoAtual = null;
}

btnAcaoCancelar.addEventListener('click', fecharAcaoItem);
modalAcaoItem.addEventListener('click', (e) => { if (e.target === modalAcaoItem) fecharAcaoItem(); });

btnAcaoEditar.addEventListener('click', () => {
  if (itemAcaoAtual) iniciarEdicao(itemAcaoAtual);
  fecharAcaoItem();
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
  btnSubmit.querySelector('span').textContent = 'Salvar edição';
  inputDesc.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
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

// --- Resumo (saldo, entradas, saídas) ---
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

  if (total === 0) {
    donutSvg.innerHTML = '';
    donutLegendaEl.innerHTML = '';
    return;
  }

  const raio = 50, cx = 60, cy = 60, largura = 16;
  const circ = 2 * Math.PI * raio;
  let acumulado = 0;
  let svg = `<circle class="donut-fundo" cx="${cx}" cy="${cy}" r="${raio}" fill="none" stroke="var(--panel-2)" stroke-width="${largura}"/>`;

  entradas.forEach(([nome, valor], i) => {
    const pct = valor / total;
    const tamanho = pct * circ;
    const cor = CORES_DONUT[i % CORES_DONUT.length];
    svg += `<circle class="donut-fatia" cx="${cx}" cy="${cy}" r="${raio}" fill="none" stroke="${cor}" stroke-width="${largura}"
      stroke-dasharray="${tamanho} ${circ - tamanho}" stroke-dashoffset="${-acumulado}"
      transform="rotate(-90 ${cx} ${cy})" stroke-linecap="butt"/>`;
    acumulado += tamanho;
  });

  donutSvg.innerHTML = svg;

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
    buscarDadosServidorAoAbrir();
  }
});

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
buscarDadosServidorAoAbrir();
