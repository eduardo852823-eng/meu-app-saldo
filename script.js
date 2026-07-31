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
let emailUsuario = '';
let fotoUsuario = '';
let limiteGasto = null;
let tokenSessao = '';
let criadoEm = '';
let corEscolhida = 'azul';

// --- Chaves de armazenamento ---
const CHAVE_LANCAMENTOS = 'saldo_lancamentos';
const CHAVE_META = 'saldo_meta';
const CHAVE_METAS = 'saldo_metas';
const CHAVE_NOME = 'saldo_nome';
const CHAVE_TEMA = 'saldo_tema';
const CHAVE_OCULTO = 'saldo_oculto';
const CHAVE_PLANO = 'saldo_plano';
const CHAVE_DEV = 'saldo_dev';
const CHAVE_EMAIL = 'saldo_email';
const CHAVE_FOTO = 'saldo_foto';
const CHAVE_LIMITE = 'saldo_limite';
const CHAVE_CRIADOEM = 'saldo_criadoem';
const CHAVE_COR = 'saldo_cor';
const CHAVE_TUTORIAL_VISTO = 'saldo_tutorial_visto';
const SENHA_DEV = '1708';
const API_URL = 'https://meu-app-saldo.onrender.com';
const CHAVE_TOKEN = 'saldo_token';
const GOOGLE_CLIENT_ID = '1067162991665-o0md9cklrq9c1tco1qrk1jr9l62d0res.apps.googleusercontent.com';

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

// --- Tutorial de primeiro acesso ---
const modalTutorialInicial = document.getElementById('modalTutorialInicial');
const tutorialInicialSlides = document.querySelectorAll('.tutorial-slide-inicial');
const tutorialInicialPontosEl = document.getElementById('tutorialInicialPontos');
const btnTutorialInicialAnterior = document.getElementById('btnTutorialInicialAnterior');
const btnTutorialInicialProximo = document.getElementById('btnTutorialInicialProximo');
const btnFecharTutorialInicial = document.getElementById('btnFecharTutorialInicial');

let slideInicialAtual = 0;

function montarPontosTutorialInicial() {
  tutorialInicialPontosEl.innerHTML = '';
  tutorialInicialSlides.forEach((_, i) => {
    const ponto = document.createElement('span');
    ponto.className = 'tutorial-ponto' + (i === slideInicialAtual ? ' ativo' : '');
    tutorialInicialPontosEl.appendChild(ponto);
  });
}

function irParaSlideInicial(indice) {
  slideInicialAtual = indice;
  tutorialInicialSlides.forEach((slide, i) => slide.classList.toggle('ativo', i === indice));
  montarPontosTutorialInicial();
  btnTutorialInicialAnterior.style.visibility = indice === 0 ? 'hidden' : 'visible';
  const ultimo = indice === tutorialInicialSlides.length - 1;
  btnTutorialInicialProximo.style.display = ultimo ? 'none' : 'inline-block';
  btnFecharTutorialInicial.style.display = ultimo ? 'block' : 'none';
}

btnTutorialInicialAnterior.addEventListener('click', () => irParaSlideInicial(Math.max(0, slideInicialAtual - 1)));
btnTutorialInicialProximo.addEventListener('click', () => irParaSlideInicial(Math.min(tutorialInicialSlides.length - 1, slideInicialAtual + 1)));
btnFecharTutorialInicial.addEventListener('click', () => {
  modalTutorialInicial.classList.add('escondido');
  localStorage.setItem(CHAVE_TUTORIAL_VISTO, '1');
});

function mostrarTutorialInicialSeNecessario() {
  if (localStorage.getItem(CHAVE_TUTORIAL_VISTO) === '1') return;
  irParaSlideInicial(0);
  modalTutorialInicial.classList.remove('escondido');
}

// --- Personalização de cores (Ultimate) ---
function aplicarCor(cor) {
  document.documentElement.setAttribute('data-cor', cor);
}

function renderizarGradeCores() {
  const liberado = temRecurso('ultimate');
  coresExplicaEl.textContent = liberado
    ? 'Escolha a cor de destaque do app.'
    : 'Escolha a cor de destaque do app. Recurso exclusivo do plano Ultimate — ative o modo desenvolvedor ou assine pra usar.';

  coresGradeEl.querySelectorAll('.cor-opcao').forEach(btn => {
    const cor = btn.dataset.cor;
    btn.classList.toggle('ativa', cor === corEscolhida);
    btn.classList.toggle('bloqueada', !liberado && cor !== 'azul');
  });
}

coresGradeEl.querySelectorAll('.cor-opcao').forEach(btn => {
  btn.addEventListener('click', () => {
    const cor = btn.dataset.cor;
    if (cor !== 'azul' && !temRecurso('ultimate')) {
      alert('Essa cor é exclusiva do plano Ultimate.');
      return;
    }
    corEscolhida = cor;
    aplicarCor(cor);
    salvar();
    renderizarGradeCores();
  });
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

// --- Persistência (localStorage, funciona offline, sem precisar de servidor/domínio) ---
function salvar() {
  try {
    localStorage.setItem(CHAVE_LANCAMENTOS, JSON.stringify(lancamentos));
    localStorage.setItem(CHAVE_META, metaAlvo === null ? '' : String(metaAlvo));
    localStorage.setItem(CHAVE_METAS, JSON.stringify(metas));
    localStorage.setItem(CHAVE_NOME, nomeUsuario);
    localStorage.setItem(CHAVE_PLANO, planoAtual);
    localStorage.setItem(CHAVE_DEV, devAtivo ? '1' : '0');
    localStorage.setItem(CHAVE_EMAIL, emailUsuario);
    localStorage.setItem(CHAVE_FOTO, fotoUsuario);
    localStorage.setItem(CHAVE_LIMITE, limiteGasto === null ? '' : String(limiteGasto));
    localStorage.setItem(CHAVE_TOKEN, tokenSessao);
    localStorage.setItem(CHAVE_CRIADOEM, criadoEm);
    localStorage.setItem(CHAVE_COR, corEscolhida);
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
    emailUsuario = localStorage.getItem(CHAVE_EMAIL) || '';
    fotoUsuario = localStorage.getItem(CHAVE_FOTO) || '';
    const limite = localStorage.getItem(CHAVE_LIMITE);
    if (limite) limiteGasto = parseFloat(limite);
    tokenSessao = localStorage.getItem(CHAVE_TOKEN) || '';
    criadoEm = localStorage.getItem(CHAVE_CRIADOEM) || '';
    corEscolhida = localStorage.getItem(CHAVE_COR) || 'azul';
  } catch (e) {
    console.warn('Não foi possível carregar os dados salvos.', e);
    lancamentos = [];
  }
}

// --- Sistema de planos ---
function planoEfetivo() {
  return devAtivo ? 'ultimate' : planoAtual;
}

function temRecurso(nivelMinimo) {
  const ordem = { free: 0, pro: 1, ultimate: 2 };
  return ordem[planoEfetivo()] >= ordem[nivelMinimo];
}

function aplicarGating() {
  const pro = temRecurso('pro');
  linhaCategoria.style.display = pro ? 'flex' : 'none';
  linhaRecorrente.style.display = pro ? 'flex' : 'none';
  painelBusca.style.display = pro ? 'block' : 'none';
  painelLimite.style.display = pro ? 'block' : 'none';

  if (!temRecurso('ultimate') && corEscolhida !== 'azul') {
    corEscolhida = 'azul';
  }
  aplicarCor(corEscolhida);

  if (!temRecurso('ultimate') && metas.length > 1) {
    metas = metas.slice(0, 1);
  }

  planoAtualNomeEl.textContent = devAtivo
    ? 'Ultimate (modo dev)'
    : (planoAtual === 'pro' ? 'Pro' : planoAtual === 'ultimate' ? 'Ultimate' : 'Free');

  atualizarBotaoPerfilTopo();

  devStatusEl.textContent = devAtivo
    ? 'Ativo — todas as funções Pro e Ultimate liberadas.'
    : 'Desbloqueia todas as funções Pro e Ultimate.';
  devStatusEl.classList.toggle('ativo', devAtivo);
  devForm.style.display = devAtivo ? 'none' : 'flex';
  btnDevDesativar.style.display = devAtivo ? 'inline-block' : 'none';
}

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
      { texto: 'Lançar gastos e ganhos', tem: true },
      { texto: 'Meta de economia', tem: true },
      { texto: 'Resumo por mês', tem: true },
      { texto: 'Categorias', tem: false },
      { texto: 'Gastos recorrentes', tem: false },
      { texto: 'Busca e limite de gasto', tem: false }
    ]
  },
  {
    nome: 'Pro',
    itens: [
      { texto: 'Tudo do Free', tem: true },
      { texto: 'Categorias personalizadas', tem: true },
      { texto: 'Gastos recorrentes', tem: true },
      { texto: 'Alerta de limite mensal', tem: true },
      { texto: 'Busca nos lançamentos', tem: true },
      { texto: 'Múltiplas metas', tem: false }
    ]
  },
  {
    nome: 'Ultimate',
    itens: [
      { texto: 'Tudo do Pro', tem: true },
      { texto: 'Múltiplas metas', tem: true },
      { texto: 'Perfil com foto', tem: true },
      { texto: 'Avisos por e-mail (dentro do app)', tem: true },
      { texto: 'Sincronizar entre aparelhos', tem: false },
      { texto: 'Vincular banco de verdade', tem: false }
    ]
  }
];

// --- Botão de configurações (canto superior direito) ---
function abrirConfig() {
  configFullscreen.classList.remove('escondido');
  painelPerfilTopo.classList.add('escondido');
}

document.getElementById('btnConfig').addEventListener('click', abrirConfig);
btnFecharConfig.addEventListener('click', () => configFullscreen.classList.add('escondido'));
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
    if (secao === 'cores') renderizarGradeCores();
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
  if (fotoUsuario) {
    perfilTopoFoto.src = fotoUsuario;
    perfilTopoFoto.style.display = 'block';
    perfilTopoInicial.style.display = 'none';
  } else {
    perfilTopoFoto.style.display = 'none';
    perfilTopoInicial.style.display = 'block';
    perfilTopoInicial.textContent = nomeUsuario ? nomeUsuario.charAt(0).toUpperCase() : '?';
  }
}

btnPerfil.addEventListener('click', () => {
  painelPerfilNome.textContent = nomeUsuario || 'Sem nome';
  painelPerfilEmail.textContent = emailUsuario || 'Modo local (sem conta)';
  painelPerfilData.textContent = criadoEm
    ? new Date(criadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';
  painelPerfilPlano.textContent = devAtivo ? 'Ultimate (dev)' : (planoAtual === 'pro' ? 'Pro' : planoAtual === 'ultimate' ? 'Ultimate' : 'Free');

  if (fotoUsuario) {
    perfilTopoFotoGrande.src = fotoUsuario;
    perfilTopoFotoGrande.style.display = 'block';
    perfilTopoPlaceholderGrande.style.display = 'none';
  } else {
    perfilTopoFotoGrande.style.display = 'none';
    perfilTopoPlaceholderGrande.style.display = 'flex';
  }

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
  if (!arquivo) return;
  const leitor = new FileReader();
  leitor.onload = (evento) => {
    fotoUsuario = evento.target.result;
    salvar();
    atualizarBotaoPerfilTopo();
    carregarCamposPerfil();
  };
  leitor.readAsDataURL(arquivo);
});

function renderizarComparativo() {
  comparativoPlanosEl.innerHTML = DADOS_PLANOS.map(p => `
    <div class="plano-card">
      <div class="plano-card-nome">${p.nome}</div>
      <ul>
        ${p.itens.map(i => `<li class="${i.tem ? 'tem' : 'nao'}">${i.texto}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

// --- Perfil (nome, e-mail, foto) ---
function carregarCamposPerfil() {
  configNome.value = nomeUsuario;
  configEmail.value = emailUsuario;
  if (fotoUsuario) {
    perfilFotoImg.src = fotoUsuario;
    perfilFotoImg.style.display = 'block';
    perfilFotoPlaceholder.style.display = 'none';
  } else {
    perfilFotoImg.style.display = 'none';
    perfilFotoPlaceholder.style.display = 'flex';
  }
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
  if (!arquivo) return;
  const leitor = new FileReader();
  leitor.onload = (evento) => {
    fotoUsuario = evento.target.result;
    carregarCamposPerfil();
  };
  leitor.readAsDataURL(arquivo);
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
  const gastoMes = lancamentos
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
    callback: processarLoginGoogle
  });
  const container = document.getElementById('botaoGoogle');
  const largura = Math.min(container.offsetWidth || 300, 350);
  google.accounts.id.renderButton(
    container,
    { theme: 'outline', size: 'large', text: 'continue_with', shape: 'pill', width: largura }
  );
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
      body: JSON.stringify({ lancamentos, metaAlvo, foto: fotoUsuario, planoAtual, devAtivo, corEscolhida, limiteGasto, metas })
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

  quantosMesesSelect.innerHTML = '';
  [1, 2, 3, 6, 9, 12, 18, 24].forEach(qtd => {
    const opt = document.createElement('option');
    opt.value = qtd;
    opt.textContent = qtd === 1 ? 'Só este mês' : `Por ${qtd} meses`;
    quantosMesesSelect.appendChild(opt);
  });
  quantosMesesSelect.value = 12;
}

checkRecorrente.addEventListener('change', () => {
  linhaDiaRecorrente.style.display = checkRecorrente.checked ? 'flex' : 'none';
});

// --- Abas ---
const DICAS_ABA = {
  lancar: 'Adicione seus gastos e ganhos aqui',
  meses: 'Veja se cada mês fechou no lucro ou no prejuízo',
  analise: 'Acompanhe metas, comparações e maiores lançamentos',
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
btnResetar.addEventListener('click', () => {
  const confirmacao = prompt('Isso vai apagar TODOS os dados, incluindo seu nome e meta. Digite "resetar" para confirmar:');
  if (confirmacao !== 'resetar') return;

  lancamentos = [];
  metaAlvo = null;
  nomeUsuario = '';
  localStorage.removeItem(CHAVE_LANCAMENTOS);
  localStorage.removeItem(CHAVE_META);
  localStorage.removeItem(CHAVE_NOME);

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
      const qtdMeses = parseInt(quantosMesesSelect.value);
      const agora = new Date();

      for (let i = 0; i < qtdMeses; i++) {
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
    return passaTipo && passaBusca;
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
  atualizarGrafico();
  atualizarComparacao();
  atualizarResumoMeses();
  atualizarAvisoLimite();
}

// --- Criar elemento de item ---
function criarItemEl(item) {
  const li = document.createElement('li');
  li.className = `item ${item.tipo}`;
  li.dataset.id = item.id;

  const cat = item.categoria ? CATEGORIAS[item.categoria] : null;
  const icone = cat ? cat.icone : ICONE_TIPO[item.tipo];
  const sinal = item.tipo === 'saida' ? '-' : '+';
  const dataFormatada = item.data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  const tagRecorrente = item.recorrente ? `<span class="item-cat-tag">🔁 Fixo${item.diaRecorrente ? ' (dia ' + item.diaRecorrente + ')' : ''}</span>` : '';
  const tagCat = cat ? `<span class="item-cat-tag">${cat.nome}</span>` : '';

  li.innerHTML = `
    <div class="item-icone">${icone}</div>
    <div class="item-info">
      <div class="item-desc">${escapeHTML(item.descricao)}</div>
      <div class="item-data">${dataFormatada}</div>
      ${tagCat}${tagRecorrente}
    </div>
    <div class="item-valor">${sinal} ${formatarMoeda(item.valor)}</div>
    <button class="item-editar" title="Editar">✎</button>
    <button class="item-del" title="Remover">✕</button>
  `;

  li.querySelector('.item-del').addEventListener('click', () => removerItem(item.id, li));
  li.querySelector('.item-editar').addEventListener('click', () => iniciarEdicao(item));

  return li;
}

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
  const entradas = lancamentos.filter(l => l.tipo === 'entrada').reduce((s, l) => s + l.valor, 0);
  const saidas = lancamentos.filter(l => l.tipo === 'saida').reduce((s, l) => s + l.valor, 0);
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

  if (!temRecurso('ultimate') && metas.length >= 1) {
    metasAvisoLimiteEl.style.display = 'block';
    return;
  }

  metas.push({ id: Date.now(), nome, valor });
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
  if (!temRecurso('ultimate') && metas.length > 1) {
    metas = metas.slice(0, 1);
    salvar();
  }

  const entradas = lancamentos.filter(l => l.tipo === 'entrada').reduce((s, l) => s + l.valor, 0);
  const saidas = lancamentos.filter(l => l.tipo === 'saida').reduce((s, l) => s + l.valor, 0);
  const saldo = Math.max(entradas - saidas, 0);

  listaMetasEl.innerHTML = '';
  metasVazioEl.classList.toggle('mostrar', metas.length === 0);

  metas.forEach(meta => {
    const pct = Math.min((saldo / meta.valor) * 100, 100);
    const card = document.createElement('div');
    card.className = 'meta-card';
    card.innerHTML = `
      <div class="meta-card-topo">
        <span class="meta-card-nome">${escapeHTML(meta.nome)}</span>
        <button class="meta-card-del" title="Remover meta">✕</button>
      </div>
      <div class="meta-card-valores">${formatarMoeda(saldo)} de <b>${formatarMoeda(meta.valor)}</b></div>
      <div class="meta-barra-fundo">
        <div class="meta-barra" style="width:${pct}%"></div>
      </div>
    `;
    card.querySelector('.meta-card-del').addEventListener('click', () => removerMeta(meta.id));
    listaMetasEl.appendChild(card);
  });

  btnAddMeta.style.display = (!temRecurso('ultimate') && metas.length >= 1) ? 'none' : 'inline-block';
}

// --- Maiores lançamentos do mês atual ---
function montarTopLista(tipo, containerEl, vazioEl) {
  const chaveAtual = chaveMes(new Date());
  const itens = lancamentos
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
    if (!grupos[chave]) grupos[chave] = { entradas: 0, saidas: 0, data: l.data };
    if (l.tipo === 'entrada') grupos[chave].entradas += l.valor;
    else grupos[chave].saidas += l.valor;
  });

  const chaves = Object.keys(grupos).sort().reverse();

  resumoMesesEl.innerHTML = '';
  resumoMesesVazioEl.classList.toggle('mostrar', chaves.length === 0);

  chaves.forEach(chave => {
    const { entradas, saidas, data } = grupos[chave];
    const saldo = entradas - saidas;
    const total = entradas + saidas;
    const pctIn = total ? (entradas / total) * 100 : 0;
    const pctOut = total ? (saidas / total) * 100 : 0;

    let classeSaldo = 'zerado';
    let selo = 'neutro';
    let seloTexto = 'Neutro';
    if (saldo > 0) { classeSaldo = 'positivo'; selo = 'lucro'; seloTexto = 'Lucro'; }
    else if (saldo < 0) { classeSaldo = 'negativo'; selo = 'prejuizo'; seloTexto = 'Prejuízo'; }

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
    `;
    resumoMesesEl.appendChild(card);
  });
}

// --- Comparação com o mês anterior ---
function atualizarComparacao() {
  const agora = new Date();
  const chaveAtual = chaveMes(agora);
  const mesPassado = new Date(agora.getFullYear(), agora.getMonth() - 1, 1);
  const chaveAnterior = chaveMes(mesPassado);

  function totaisDoMes(chave) {
    const itens = lancamentos.filter(l => chaveMes(l.data) === chave);
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
