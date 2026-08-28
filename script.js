
let lancamentos = JSON.parse(localStorage.getItem('saldo_lancamentos')||'[]').map(l=>({...l, data:new Date(l.data)}));
let tipoAtual='saida';
let filtroBusca='';
let fotoUsuario = localStorage.getItem('saldo_foto')||'';
let tokenSessao = localStorage.getItem('saldo_token')||'';
let limiteGasto = parseFloat(localStorage.getItem('saldo_limite')||'')||null;
const API_URL = 'https://meu-app-saldo.onrender.com';
const CATEGORIAS = {
  comida:{nome:'Comida',icone:'🍔'}, transporte:{nome:'Transporte',icone:'🚌'},
  jogos:{nome:'Jogos',icone:'🎮'}, lazer:{nome:'Lazer',icone:'🎬'},
  estudos:{nome:'Estudos',icone:'📚'}, mesada:{nome:'Mesada',icone:'💰'}, outros:{nome:'Outros',icone:'📦'}
};

function mascaraZap(input){
  let v = input.value.replace(/\D/g,'');
  if(v.length>11) v=v.slice(0,11);
  v=v.replace(/(\d{2})(\d)/,'($1) $2').replace(/(\d{5})(\d)/,'$1-$2');
  input.value=v;
}

function salvar(){
  localStorage.setItem('saldo_lancamentos', JSON.stringify(lancamentos));
  if(fotoUsuario) localStorage.setItem('saldo_foto', fotoUsuario);
  if(limiteGasto) localStorage.setItem('saldo_limite', String(limiteGasto));
  // sync server
  if(tokenSessao){
    fetch(API_URL+'/dados',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tokenSessao},body:JSON.stringify({lancamentos, foto:fotoUsuario, limiteGasto})}).catch(()=>{});
  }
  renderizarTudo();
}

function renderizarTudo(){
  const filtrados = filtroBusca ? lancamentos.filter(l=> (l.descricao||'').toLowerCase().includes(filtroBusca.toLowerCase())) : lancamentos;
  const entradas = filtrados.filter(l=>l.tipo==='entrada').reduce((s,l)=>s+l.valor,0);
  const saidas = filtrados.filter(l=>l.tipo==='saida').reduce((s,l)=>s+l.valor,0);
  const saldo = entradas - saidas;

  document.getElementById('saldoTotal').textContent = 'R$ '+saldo.toFixed(2).replace('.',',');
  document.getElementById('saldoTotal').classList.toggle('negativo', saldo<0);
  document.getElementById('totalEntradas').textContent = 'R$ '+entradas.toFixed(2);
  document.getElementById('totalSaidas').textContent = 'R$ '+saidas.toFixed(2);

  // barra limite
  const barra=document.getElementById('barraLimite');
  if(limiteGasto && barra){
    barra.style.display='block';
    const mes = new Date().getMonth(); const ano = new Date().getFullYear();
    const saidasMes = lancamentos.filter(l=>{ const d=new Date(l.data); return d.getMonth()===mes && d.getFullYear()===ano && l.tipo==='saida'; }).reduce((s,l)=>s+l.valor,0);
    const pct = Math.min(100, Math.round((saidasMes/limiteGasto)*100));
    document.getElementById('barraLimiteTexto').textContent = `Gastos: R$${saidasMes.toFixed(2)} / R$${limiteGasto.toFixed(2)}`;
    document.getElementById('barraLimitePct').textContent = pct+'%';
    const fill=document.getElementById('barraLimiteFill');
    fill.style.width=pct+'%';
    fill.style.background = pct>=100 ? '#ef4444' : pct>=80 ? '#f59e0b' : '#22c55e';
    const frase=document.getElementById('fraseDia');
    if(frase){
      if(pct>=100) frase.textContent='😬 Você estourou o limite esse mês!';
      else if(pct>=80) frase.textContent='⚠️ Atenção, 80% do limite já foi!';
      else if(saldo>0) frase.textContent='💜 Hoje você está mandando bem!';
      else frase.textContent='Bora anotar os gastos de hoje?';
    }
  } else if(barra){ barra.style.display='none'; }

  // lista
  const blocos=document.getElementById('blocosMeses');
  const vazio=document.getElementById('vazio');
  if(!filtrados.length){ blocos.innerHTML=''; vazio.style.display='block'; return; }
  vazio.style.display='none';
  blocos.innerHTML='';
  const porMes={};
  filtrados.sort((a,b)=> new Date(b.data)-new Date(a.data)).forEach(l=>{
    const d=new Date(l.data); const key=`${d.getMonth()}-${d.getFullYear()}`;
    if(!porMes[key]) porMes[key]=[];
    porMes[key].push(l);
  });
  Object.entries(porMes).forEach(([k,lista])=>{
    const div=document.createElement('div'); div.className='mes-card';
    div.innerHTML=`<div style="font-weight:800;margin-bottom:8px;font-size:13px;color:#7b87a3;">${k}</div>`;
    lista.forEach(l=>{
      const cat = CATEGORIAS[l.categoria]||CATEGORIAS.outros;
      const item=document.createElement('div'); item.className='item';
      item.innerHTML=`<div><div style="font-weight:600;">${cat.icone} ${l.descricao}</div><div style="font-size:11px;color:#7b87a3;">${new Date(l.data).toLocaleDateString('pt-BR')} • ${cat.nome}</div></div><div style="display:flex;gap:8px;align-items:center;"><b style="color:${l.tipo==='entrada'?'#22c55e':'#ef4444'}">${l.tipo==='entrada'?'+':'-'}R$${l.valor.toFixed(2)}</b><button onclick="editarLanc(${l.id})" style="background:none;border:none;cursor:pointer;">✏️</button><button onclick="deletarLanc(${l.id})" style="background:none;border:none;cursor:pointer;">🗑️</button></div>`;
      div.appendChild(item);
    });
    blocos.appendChild(div);
  });

  atualizarStreak(); atualizarFab();
}

function filtrarBusca(){ filtroBusca=document.getElementById('buscaLancamento').value; renderizarTudo(); }

function adicionarLancamento(e){
  e.preventDefault();
  const desc=document.getElementById('descricao').value.trim();
  const valor=parseFloat(document.getElementById('valor').value);
  const cat=document.getElementById('categoria').value;
  const dataVal=document.getElementById('dataLancamento').value;
  if(!desc||!valor) return;
  const novo={id:Date.now(), descricao:desc, valor:Math.abs(valor), tipo:tipoAtual, categoria:cat, data: dataVal ? new Date(dataVal) : new Date(), confirmado:true};
  lancamentos.unshift(novo);
  document.getElementById('formLancamento').reset();
  document.getElementById('dataLancamento').valueAsDate=new Date();
  // XP + streak
  let xp=parseInt(localStorage.getItem('saldo_xp')||'0'); localStorage.setItem('saldo_xp', String(xp+10));
  const hoje=new Date().toISOString().slice(0,10); localStorage.setItem('saldo_ultimo_acesso', hoje);
  let streak=parseInt(localStorage.getItem('saldo_streak')||'0'); 
  const ultimo=localStorage.getItem('saldo_ultimo_registro');
  const ontem=new Date(Date.now()-86400000).toISOString().slice(0,10);
  if(ultimo!==hoje){ streak = (ultimo===ontem)?streak+1:1; localStorage.setItem('saldo_streak',String(streak)); localStorage.setItem('saldo_ultimo_registro',hoje); if([3,7].includes(streak) && window.confetti) confetti({particleCount:100}); }
  salvar();
  if(window.confetti) confetti({particleCount:60, origin:{y:0.8}});
}

function editarLanc(id){
  const l=lancamentos.find(x=>x.id===id); if(!l) return;
  document.getElementById('descricao').value=l.descricao;
  document.getElementById('valor').value=l.valor;
  document.getElementById('categoria').value=l.categoria;
  tipoAtual=l.tipo; document.querySelectorAll('.tipo-btn').forEach(b=> b.classList.toggle('active', b.dataset.tipo===tipoAtual));
  lancamentos=lancamentos.filter(x=>x.id!==id);
  window.scrollTo({top:0, behavior:'smooth'});
}

function deletarLanc(id){ if(confirm('Apagar?')){ lancamentos=lancamentos.filter(l=>l.id!==id); salvar(); } }

function atualizarFab(){
  const fab=document.getElementById('fabAdd');
  const config=document.getElementById('painelConfig');
  const configVisivel = config && !config.classList.contains('escondido');
  if(!fab) return;
  if(configVisivel){ fab.classList.add('fab-escondido'); document.body.classList.add('modo-config'); }
  else { fab.classList.remove('fab-escondido'); document.body.classList.remove('modo-config'); }
}

function atualizarStreak(){
  const hoje=new Date().toISOString().slice(0,10);
  let streak=parseInt(localStorage.getItem('saldo_streak')||'0');
  let xp=parseInt(localStorage.getItem('saldo_xp')||'0');
  const badge=document.getElementById('streakBadge');
  const xpBadge=document.getElementById('xpBadge');
  if(badge && streak>0){ badge.style.display='inline-flex'; badge.textContent=`🔥 ${streak} dia${streak>1?'s':''}`; }
  if(xpBadge){ xpBadge.style.display='inline-flex'; xpBadge.textContent=`${xp} XP`; }
}

function verificarCheckin(){
  const hoje=new Date().toISOString().slice(0,10);
  const jaFez=localStorage.getItem('saldo_checkin_'+hoje);
  const hora=new Date().getHours();
  if(!jaFez && hora>=18){
    document.getElementById('modalCheckin')?.classList.remove('escondido');
  }
}

function verificarDesafio(){
  const semana = new Date().getFullYear()+'-'+Math.ceil(new Date().getDate()/7);
  if(!localStorage.getItem('desafio_'+semana)){
    setTimeout(()=> document.getElementById('modalDesafio')?.classList.remove('escondido'), 2500);
  }
}

async function comprimirFoto(file){
  return new Promise(res=>{
    const img=new Image();
    img.onload=()=>{
      const canvas=document.createElement('canvas');
      const MAX=200; let w=img.width,h=img.height;
      if(w>h){ if(w>MAX){ h*=MAX/w; w=MAX; } } else { if(h>MAX){ w*=MAX/h; h=MAX; } }
      canvas.width=w; canvas.height=h;
      canvas.getContext('2d').drawImage(img,0,0,w,h);
      res(canvas.toDataURL('image/jpeg',0.6));
    };
    img.src=URL.createObjectURL(file);
  });
}

// Init
document.addEventListener('DOMContentLoaded', ()=>{
  // categorias
  const sel=document.getElementById('categoria');
  if(sel){ sel.innerHTML=''; Object.entries(CATEGORIAS).forEach(([k,v])=>{ const o=document.createElement('option'); o.value=k; o.textContent=v.icone+' '+v.nome; sel.appendChild(o); }); }
  // data hoje
  const dataInput=document.getElementById('dataLancamento');
  if(dataInput) dataInput.valueAsDate=new Date();
  // form
  document.getElementById('formLancamento')?.addEventListener('submit', adicionarLancamento);
  // tipo
  document.querySelectorAll('.tipo-btn').forEach(btn=> btn.addEventListener('click', ()=>{ tipoAtual=btn.dataset.tipo; document.querySelectorAll('.tipo-btn').forEach(b=>b.classList.toggle('active', b===btn)); }));
  // fab
  document.getElementById('fabAdd')?.addEventListener('click', ()=>{ document.getElementById('formLancamento')?.scrollIntoView({behavior:'smooth'}); });
  // config
  document.getElementById('btnConfig')?.addEventListener('click', ()=>{ document.getElementById('painelConfig').classList.remove('escondido'); atualizarFab(); });
  document.getElementById('btnVoltarConfig')?.addEventListener('click', ()=>{ document.getElementById('painelConfig').classList.add('escondido'); atualizarFab(); });
  document.querySelectorAll('.config-side-item').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.config-side-item').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.config-painel').forEach(p=>p.classList.remove('ativo'));
      document.querySelectorAll('.config-painel').forEach(p=>p.style.display='none');
      const alvo = document.getElementById('config'+btn.dataset.config.charAt(0).toUpperCase()+btn.dataset.config.slice(1)+'Painel');
      if(alvo){ alvo.classList.add('ativo'); alvo.style.display='block'; }
      atualizarFab();
    });
  });
  // foto
  document.getElementById('btnFoto')?.addEventListener('click', ()=> document.getElementById('inputFoto').click());
  document.getElementById('inputFoto')?.addEventListener('change', async (e)=>{
    const file=e.target.files[0]; if(!file) return;
    fotoUsuario = await comprimirFoto(file);
    document.getElementById('perfilFotoImg').src=fotoUsuario; document.getElementById('perfilFotoImg').style.display='block'; document.getElementById('perfilFotoPlaceholder').style.display='none';
    salvar();
  });
  // salvar perfil com zap
  document.getElementById('btnSalvarPerfil')?.addEventListener('click', async ()=>{
    const nome=document.getElementById('configNome').value.trim();
    const tel=document.getElementById('configTelefone').value.replace(/\D/g,'');
    const zapOptin=document.getElementById('configZapOptin').checked;
    if(tel && tel.length<10){ document.getElementById('configTelefoneErro').textContent='Número inválido'; document.getElementById('configTelefoneErro').style.display='block'; return; }
    document.getElementById('configTelefoneErro').style.display='none';
    localStorage.setItem('saldo_telefone', tel);
    localStorage.setItem('saldo_nome', nome);
    localStorage.setItem('saldo_zap_optin', zapOptin?'1':'0');
    if(tokenSessao && tel){
      try{
        await fetch(API_URL+'/telefone',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tokenSessao},body:JSON.stringify({telefone:tel, zapOptin})});
        alert('Perfil salvo! Zap ativado ✅');
      }catch{ alert('Perfil salvo local!'); }
    } else { alert('Perfil salvo!'); }
  });
  // checkin
  document.querySelectorAll('.btn-checkin').forEach(btn=> btn.addEventListener('click', ()=>{
    const hoje=new Date().toISOString().slice(0,10);
    localStorage.setItem('saldo_checkin_'+hoje, btn.dataset.humor);
    localStorage.setItem('saldo_ultimo_acesso', hoje);
    let xp=parseInt(localStorage.getItem('saldo_xp')||'0'); localStorage.setItem('saldo_xp', String(xp+10));
    document.getElementById('modalCheckin').classList.add('escondido');
    if(window.confetti) confetti({particleCount:60});
    atualizarStreak();
  }));
  // desafio
  document.getElementById('btnAceitarDesafio')?.addEventListener('click', ()=>{
    const semana=new Date().getFullYear()+'-'+Math.ceil(new Date().getDate()/7);
    localStorage.setItem('desafio_'+semana, 'aceito');
    document.getElementById('modalDesafio').classList.add('escondido');
    let xp=parseInt(localStorage.getItem('saldo_xp')||'0'); localStorage.setItem('saldo_xp', String(xp+20));
    atualizarStreak();
    if(window.confetti) confetti();
  });
  document.getElementById('btnPularDesafio')?.addEventListener('click', ()=> document.getElementById('modalDesafio').classList.add('escondido'));
  // zap modal
  document.getElementById('btnSalvarTelefone')?.addEventListener('click', async ()=>{
    const tel=document.getElementById('inputTelefoneZap').value.replace(/\D/g,'');
    if(tel.length<10){ alert('Número inválido'); return; }
    localStorage.setItem('saldo_telefone', tel);
    if(tokenSessao){
      try{ await fetch(API_URL+'/telefone',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tokenSessao},body:JSON.stringify({telefone:tel, zapOptin:true})}); }catch{}
    } else {
      try{ await fetch(API_URL+'/testar-zap',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({telefone:tel})}); }catch{}
    }
    document.getElementById('modalTelefone').classList.add('escondido');
    if(window.confetti) confetti();
  });
  document.getElementById('btnPularTelefone')?.addEventListener('click', ()=>{ localStorage.setItem('saldo_zap_pulado','1'); document.getElementById('modalTelefone').classList.add('escondido'); });

  // carregar nome
  const nomeSalvo=localStorage.getItem('saldo_nome');
  if(nomeSalvo) document.getElementById('configNome').value=nomeSalvo;
  const telSalvo=localStorage.getItem('saldo_telefone');
  if(telSalvo) document.getElementById('configTelefone').value=telSalvo;
  if(fotoUsuario){ const img=document.getElementById('perfilFotoImg'); if(img){ img.src=fotoUsuario; img.style.display='block'; document.getElementById('perfilFotoPlaceholder').style.display='none'; } }

  renderizarTudo();
  setTimeout(()=>{ verificarCheckin(); verificarDesafio(); }, 1500);
  setInterval(atualizarFab, 500);

  // verificar zap pendente
  const temTel=localStorage.getItem('saldo_telefone');
  const pulou=localStorage.getItem('saldo_zap_pulado');
  if(!temTel && !pulou){
    setTimeout(()=> document.getElementById('modalTelefone')?.classList.remove('escondido'), 2000);
  }
});
