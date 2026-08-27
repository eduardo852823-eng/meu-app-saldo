(() => {
  "use strict";

  /* ---------------- STORAGE ---------------- */
  const CONFIG_KEY = "ponto_config_v1";
  const RECORDS_KEY = "ponto_records_v1";
  const WEEKDAY_NAMES = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

  function loadConfig(){
    try{
      const raw = localStorage.getItem(CONFIG_KEY);
      if(!raw) return sanitizeConfig({});
      return sanitizeConfig(JSON.parse(raw));
    }catch(e){
      return sanitizeConfig({});
    }
  }
  function safeSetItem(key, value){
    try{
      localStorage.setItem(key, value);
      return true;
    }catch(e){
      alert("Não foi possível salvar: o armazenamento do dispositivo está cheio. Tente remover fotos de perfil grandes ou exportar/limpar o histórico antigo.");
      return false;
    }
  }
  function saveConfig(cfg){
    safeSetItem(CONFIG_KEY, JSON.stringify(cfg));
  }
  // garante números válidos e não-negativos, e workDays só com 0-6 sem duplicar
  function sanitizeConfig(cfg){
    cfg = cfg || {};
    const salary = Math.max(0, Number(cfg.salary) || 0);
    const hoursPerDay = Math.max(0, Number(cfg.hoursPerDay) || 0);
    const workDays = Array.isArray(cfg.workDays)
      ? [...new Set(cfg.workDays.map(Number).filter(d => Number.isInteger(d) && d>=0 && d<=6))]
      : [];
    // redução progressiva da taxa por hora extra (depois de bater a meta diária)
    const decayEnabled = !!cfg.decayEnabled;
    const decayIntervalMinutes = Math.max(1, Number(cfg.decayIntervalMinutes) || 30);
    const decayPercent = Math.min(100, Math.max(0, Number(cfg.decayPercent) || 0));
    const decayScope = cfg.decayScope === "limited" ? "limited" : "all"; // "all" = o dia todo, "limited" = só por X horas
    const decayLimitHours = Math.max(0, Number(cfg.decayLimitHours) || 0);
    return {
      salary, hoursPerDay, workDays,
      decayEnabled, decayIntervalMinutes, decayPercent, decayScope, decayLimitHours
    };
  }
  // config completa o bastante pra calcular valor/hora (precisa pra começar a bater ponto)
  function isConfigComplete(cfg){
    return !!cfg && cfg.salary > 0 && cfg.hoursPerDay > 0 && Array.isArray(cfg.workDays) && cfg.workDays.length > 0;
  }
  function loadRecords(){
    try{
      const raw = localStorage.getItem(RECORDS_KEY);
      if(!raw) return [];
      return sanitizeRecords(JSON.parse(raw));
    }catch(e){
      return [];
    }
  }
  function saveRecords(records){
    safeSetItem(RECORDS_KEY, JSON.stringify(records));
    warnIfRecordsGrowingTooMuch(records);
  }
  const RECORDS_WARN_THRESHOLD = 3000;
  let recordsSizeWarned = false;
  function warnIfRecordsGrowingTooMuch(records){
    if(recordsSizeWarned) return;
    if(records.length >= RECORDS_WARN_THRESHOLD){
      recordsSizeWarned = true;
      alert("Seu histórico já tem muitos registros. Vale exportar um backup e, se quiser, apagar dados antigos na aba Configurar > Zona de risco, pra evitar que o app fique lento ou o armazenamento estoure.");
    }
  }
  // filtra qualquer registro sem o formato mínimo esperado (protege contra backup corrompido)
  function sanitizeRecords(arr){
    if(!Array.isArray(arr)) return [];
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    return arr.filter(r =>
      r && typeof r === "object" &&
      typeof r.date === "string" && dateRe.test(r.date) &&
      typeof r.seconds === "number" && isFinite(r.seconds) && r.seconds >= 0
    ).map(r => ({
      date: r.date,
      seconds: r.seconds,
      rate: typeof r.rate === "number" && isFinite(r.rate) ? r.rate : undefined,
      earned: typeof r.earned === "number" && isFinite(r.earned) ? r.earned : undefined,
      startTime: typeof r.startTime === "number" ? r.startTime : undefined,
      endTime: typeof r.endTime === "number" ? r.endTime : undefined
    }));
  }

  const PROFILE_KEY = "ponto_profile_v1";
  function loadProfile(){
    try{
      const raw = localStorage.getItem(PROFILE_KEY);
      if(!raw) return { name: "", photo: "" };
      const p = JSON.parse(raw);
      return {
        name: typeof p.name === "string" ? p.name : "",
        photo: typeof p.photo === "string" ? p.photo : ""
      };
    }catch(e){
      return { name: "", photo: "" };
    }
  }
  function saveProfile(p){
    safeSetItem(PROFILE_KEY, JSON.stringify(p));
  }

  let config = loadConfig();
  let records = loadRecords();
  let profile = loadProfile();

  /* ---------------- HELPERS ---------------- */
  function pad(n){ return String(n).padStart(2,"0"); }

  function todayISO(){
    return isoFromTimestamp(Date.now());
  }
  function isoFromTimestamp(ts){
    const d = new Date(ts);
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  }
  function timeFromTimestamp(ts){
    const d = new Date(ts);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  function monthKeyOf(iso){ return iso.slice(0,7); } // YYYY-MM
  function currentMonthKey(){ return monthKeyOf(todayISO()); }

  function formatHMS(totalSeconds){
    const h = Math.floor(totalSeconds/3600);
    const m = Math.floor((totalSeconds%3600)/60);
    const s = Math.floor(totalSeconds%60);
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  function formatHoursMinutes(totalSeconds){
    if(totalSeconds < 60) return `${Math.round(totalSeconds)}s`;
    const h = Math.floor(totalSeconds/3600);
    const m = Math.round((totalSeconds%3600)/60);
    return `${h}h ${pad(m)}m`;
  }
  function formatMoney(v){
    if(!isFinite(v)) v = 0;
    return v.toLocaleString("pt-BR", { style:"currency", currency:"BRL" });
  }

  // conta quantos dias de determinado weekday-set existem num mês (0-11)
  function countWorkDaysInMonth(year, monthIndex, workDaysSet){
    let count = 0;
    const daysInMonth = new Date(year, monthIndex+1, 0).getDate();
    for(let d=1; d<=daysInMonth; d++){
      const wd = new Date(year, monthIndex, d).getDay();
      if(workDaysSet.has(wd)) count++;
    }
    return count;
  }

  // calcula o valor da hora de um mês específico, usando uma configuração dada
  function hourlyRateForMonth(monthKey, cfg){
    const [y,m] = monthKey.split("-").map(Number);
    const workDaysSet = new Set(cfg.workDays || []);
    const workDaysInMonth = countWorkDaysInMonth(y, m-1, workDaysSet);
    const monthGoalHours = workDaysInMonth * (cfg.hoursPerDay || 0);
    return monthGoalHours > 0 ? (cfg.salary || 0) / monthGoalHours : 0;
  }

  // seconds já registrados numa data específica (soma de todos os turnos salvos daquele dia)
  function secondsWorkedOnDate(dateISO){
    return records.filter(r => r.date === dateISO).reduce((s,r)=>s+r.seconds,0);
  }

  // calcula o ganho total de um dia dado o total de segundos trabalhados nele,
  // aplicando a redução progressiva da taxa depois da jornada diária (cfg.hoursPerDay)
  function earnedForDaySeconds(totalSeconds, baseRate, cfg){
    const goalSeconds = (cfg.hoursPerDay || 0) * 3600;
    if(!cfg.decayEnabled || goalSeconds <= 0 || totalSeconds <= goalSeconds || baseRate <= 0){
      return (totalSeconds/3600) * baseRate;
    }
    let earned = (goalSeconds/3600) * baseRate;
    let overtimeRemaining = totalSeconds - goalSeconds;
    const intervalSeconds = Math.max(1, cfg.decayIntervalMinutes * 60);
    const limitSeconds = cfg.decayScope === "limited" ? (cfg.decayLimitHours * 3600) : Infinity;
    let elapsedOvertime = 0;

    while(overtimeRemaining > 0){
      const stepsSoFar = Math.min(elapsedOvertime, limitSeconds) / intervalSeconds | 0;
      const multiplier = Math.max(0, 1 - stepsSoFar * (cfg.decayPercent/100));
      const nextStepBoundary = (stepsSoFar + 1) * intervalSeconds;
      let chunk = Math.min(overtimeRemaining, nextStepBoundary - elapsedOvertime);
      if(elapsedOvertime >= limitSeconds){
        // depois do limite configurado, a taxa fica travada no nível que atingiu
        chunk = overtimeRemaining;
      } else if(elapsedOvertime + chunk > limitSeconds){
        chunk = limitSeconds - elapsedOvertime;
      }
      earned += (chunk/3600) * (baseRate * multiplier);
      elapsedOvertime += chunk;
      overtimeRemaining -= chunk;
    }
    return earned;
  }

  /* ---------------- TEMA ---------------- */
  const THEME_KEY = "ponto_theme_v1";
  const themeToggle = document.getElementById("theme-toggle");
  const themeToggleIcon = document.getElementById("theme-toggle-icon");
  const metaThemeColor = document.getElementById("meta-theme-color");

  function applyTheme(theme){
    document.documentElement.setAttribute("data-theme", theme);
    themeToggleIcon.textContent = theme === "light" ? "☀" : "☾";
    metaThemeColor.setAttribute("content", theme === "light" ? "#eef0f3" : "#14171c");
  }

  function loadTheme(){
    return localStorage.getItem(THEME_KEY) || "dark";
  }

  let currentTheme = loadTheme();
  applyTheme(currentTheme);

  themeToggle.addEventListener("click", () => {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    localStorage.setItem(THEME_KEY, currentTheme);
    applyTheme(currentTheme);
  });

  /* ---------------- VERSÃO (gatilho oculto) ---------------- */
  const APP_VERSION = "1.5";
  const brandMarkBtn = document.getElementById("brand-mark-btn");
  const brandVersion = document.getElementById("brand-version");
  let versionTapCount = 0;
  let versionTapTimer = null;

  brandVersion.textContent = `v${APP_VERSION}`;

  brandMarkBtn.addEventListener("click", () => {
    versionTapCount++;
    clearTimeout(versionTapTimer);
    versionTapTimer = setTimeout(() => { versionTapCount = 0; }, 1500);

    if(versionTapCount >= 5){
      versionTapCount = 0;
      brandVersion.classList.remove("hidden");
      clearTimeout(brandVersion._hideTimer);
      brandVersion._hideTimer = setTimeout(() => {
        brandVersion.classList.add("hidden");
      }, 4000);
    }
  });

  /* ---------------- TABS ---------------- */
  const tabBtns = document.querySelectorAll(".tab-btn");
  const screens = document.querySelectorAll(".screen");
  tabBtns.forEach(btn=>{
    btn.addEventListener("click", () => {
      tabBtns.forEach(b=>b.classList.remove("active"));
      screens.forEach(s=>s.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`screen-${btn.dataset.tab}`).classList.add("active");
      if(btn.dataset.tab === "historico") renderHistory();
      if(btn.dataset.tab === "config") renderConfigForm();
    });
  });

  /* ---------------- PERFIL ---------------- */
  const inputName = document.getElementById("input-name");
  const profilePhotoBtn = document.getElementById("profile-photo-btn");
  const profilePhotoImg = document.getElementById("profile-photo-img");
  const profilePhotoPlaceholder = document.getElementById("profile-photo-placeholder");
  const profilePhotoInput = document.getElementById("profile-photo-input");
  const brandUserPhoto = document.getElementById("brand-user-photo");
  const brandUserName = document.getElementById("brand-user-name");

  function renderProfile(){
    inputName.value = profile.name || "";

    if(profile.photo){
      profilePhotoImg.src = profile.photo;
      profilePhotoImg.classList.remove("hidden");
      profilePhotoPlaceholder.classList.add("hidden");
      brandUserPhoto.src = profile.photo;
      brandUserPhoto.classList.remove("hidden");
    } else {
      profilePhotoImg.classList.add("hidden");
      profilePhotoPlaceholder.classList.remove("hidden");
      brandUserPhoto.classList.add("hidden");
    }
    brandUserName.textContent = profile.name || "";
  }

  profilePhotoBtn.addEventListener("click", () => profilePhotoInput.click());

  profilePhotoInput.addEventListener("change", () => {
    const file = profilePhotoInput.files[0];
    if(!file) return;
    const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2MB
    if(file.size > MAX_PHOTO_BYTES){
      alert("Essa foto é muito grande (máx. 2MB). Escolha uma imagem menor.");
      profilePhotoInput.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      profile.photo = reader.result;
      saveProfile(profile);
      renderProfile();
    };
    reader.readAsDataURL(file);
  });

  inputName.addEventListener("input", () => {
    profile.name = inputName.value;
    saveProfile(profile);
    brandUserName.textContent = profile.name || "";
  });

  /* ---------------- CONFIG SCREEN ---------------- */
  const inputSalary = document.getElementById("input-salary");
  const inputHoursDay = document.getElementById("input-hours-day");
  const weekdayGrid = document.getElementById("weekday-grid");
  const weekdayBtns = weekdayGrid.querySelectorAll(".weekday-btn");
  const btnSaveConfig = document.getElementById("btn-save-config");
  const saveConfirm = document.getElementById("save-confirm");

  const decayEnabledToggle = document.getElementById("decay-enabled-toggle");
  const decayFields = document.getElementById("decay-fields");
  const decayGoalPreview = document.getElementById("decay-goal-preview");
  const inputDecayInterval = document.getElementById("input-decay-interval");
  const inputDecayPercent = document.getElementById("input-decay-percent");
  const inputDecayScope = document.getElementById("input-decay-scope");
  const decayLimitWrap = document.getElementById("decay-limit-wrap");
  const inputDecayLimit = document.getElementById("input-decay-limit");

  function updateDecayGoalPreview(){
    const hours = parseFloat(inputHoursDay.value);
    decayGoalPreview.textContent = (hours > 0)
      ? `${hours} ${hours === 1 ? "hora" : "horas"} por dia`
      : "configure as horas por dia acima";
  }

  function updateDecayFieldsVisibility(){
    decayFields.classList.toggle("disabled", decayEnabledToggle.getAttribute("aria-checked") !== "true");
    decayLimitWrap.classList.toggle("hidden", inputDecayScope.value !== "limited");
  }

  decayEnabledToggle.addEventListener("click", () => {
    const nowOn = decayEnabledToggle.getAttribute("aria-checked") !== "true";
    decayEnabledToggle.setAttribute("aria-checked", String(nowOn));
    updateDecayFieldsVisibility();
  });
  inputDecayScope.addEventListener("change", updateDecayFieldsVisibility);
  inputHoursDay.addEventListener("input", updateDecayGoalPreview);

  function renderConfigForm(){
    inputSalary.value = config.salary || "";
    inputHoursDay.value = config.hoursPerDay || "";
    weekdayBtns.forEach(b=>{
      const day = Number(b.dataset.day);
      b.classList.toggle("selected", config.workDays.includes(day));
    });

    decayEnabledToggle.setAttribute("aria-checked", String(!!config.decayEnabled));
    inputDecayInterval.value = config.decayIntervalMinutes || "";
    inputDecayPercent.value = config.decayPercent || "";
    inputDecayScope.value = config.decayScope || "all";
    inputDecayLimit.value = config.decayLimitHours || "";
    updateDecayFieldsVisibility();
    updateDecayGoalPreview();
  }

  weekdayBtns.forEach(b=>{
    b.addEventListener("click", () => {
      b.classList.toggle("selected");
    });
  });

  [inputSalary, inputHoursDay, inputDecayInterval, inputDecayPercent, inputDecayLimit].forEach(inp => {
    inp.addEventListener("input", () => {
      if(inp.value !== "" && Number(inp.value) < 0) inp.value = 0;
    });
  });

  btnSaveConfig.addEventListener("click", () => {
    const selectedDays = [...weekdayBtns]
      .filter(b=>b.classList.contains("selected"))
      .map(b=>Number(b.dataset.day));

    config = sanitizeConfig({
      salary: inputSalary.value,
      hoursPerDay: inputHoursDay.value,
      workDays: selectedDays,
      decayEnabled: decayEnabledToggle.getAttribute("aria-checked") === "true",
      decayIntervalMinutes: inputDecayInterval.value,
      decayPercent: inputDecayPercent.value,
      decayScope: inputDecayScope.value,
      decayLimitHours: inputDecayLimit.value
    });
    saveConfig(config);
    saveConfirm.classList.remove("hidden");
    setTimeout(()=>saveConfirm.classList.add("hidden"), 2000);
    updateEarningsPanel();
    updateClockAvailability();
  });

  /* ---------------- MODO DEV (velocidade do cronômetro p/ testes) ---------------- */
  const devPanel = document.getElementById("dev-panel");
  const devSpeedBtns = devPanel.querySelectorAll(".dev-speed-btn");
  const historicoTabBtn = document.querySelector('.tab-btn[data-tab="historico"]');

  let devMode = false;
  let devSpeedMultiplier = 1;
  let devTapCount = 0;
  let devTapTimer = null;
  const DEV_TAP_WINDOW_MS = 1500;
  const DEV_TAPS_NEEDED = 5;

  function setDevMode(on){
    devMode = on;
    devPanel.classList.toggle("hidden", !devMode);
    if(!devMode){
      devSpeedMultiplier = 1;
      devSpeedBtns.forEach(b=>b.classList.toggle("selected", b.dataset.speed === "1"));
    }
  }

  historicoTabBtn.addEventListener("click", () => {
    devTapCount++;
    clearTimeout(devTapTimer);
    devTapTimer = setTimeout(() => { devTapCount = 0; }, DEV_TAP_WINDOW_MS);
    if(devTapCount >= DEV_TAPS_NEEDED){
      devTapCount = 0;
      setDevMode(!devMode);
    }
  });

  devSpeedBtns.forEach(b=>{
    b.addEventListener("click", () => {
      devSpeedMultiplier = Math.max(1, Number(b.dataset.speed) || 1);
      devSpeedBtns.forEach(x=>x.classList.remove("selected"));
      b.classList.add("selected");
    });
  });

  /* ---------------- CRONÔMETRO ---------------- */
  const clockDisplay = document.getElementById("clock-display");
  const clockStatus = document.getElementById("clock-status");
  const btnToggle = document.getElementById("btn-toggle");
  const btnToggleLabel = document.getElementById("btn-toggle-label");

  const TIMER_STATE_KEY = "ponto_timer_running_v1";

  let timerInterval = null;
  let startTimestamp = null; // ms

  function restoreRunningTimer(){
    const raw = localStorage.getItem(TIMER_STATE_KEY);
    if(!raw) return;
    try{
      const state = JSON.parse(raw);
      const MAX_SESSION_MS = 24 * 60 * 60 * 1000; // 24h
      if(state && typeof state.startTimestamp === "number"){
        const age = Date.now() - state.startTimestamp;
        // descarta timer travado no localStorage: no futuro, ou rodando há mais de 24h
        // (provavelmente esqueceram de finalizar, ou o relógio do aparelho mudou)
        if(age < 0 || age > MAX_SESSION_MS){
          localStorage.removeItem(TIMER_STATE_KEY);
          return;
        }
        startTimestamp = state.startTimestamp;
        beginTicking();
      }
    }catch(e){
      localStorage.removeItem(TIMER_STATE_KEY);
    }
  }

  function beginTicking(){
    clockDisplay.classList.add("running");
    clockStatus.classList.add("running");
    clockStatus.textContent = "Trabalhando...";
    btnToggle.classList.add("running");
    btnToggleLabel.textContent = "Finalizar";

    tick();
    timerInterval = setInterval(tick, 1000);
  }

  function tick(){
    const elapsed = Math.max(0, Math.floor((Date.now() - startTimestamp)/1000 * devSpeedMultiplier));
    clockDisplay.textContent = formatHMS(elapsed);
    updateEarningsPanel(elapsed);
  }

  function stopTicking(){
    clearInterval(timerInterval);
    timerInterval = null;
    clockDisplay.classList.remove("running");
    clockStatus.classList.remove("running");
    btnToggle.classList.remove("running");
    btnToggleLabel.textContent = "Iniciar";
    clockDisplay.textContent = "00:00:00";
    updateClockAvailability();
  }

  function updateClockAvailability(){
    if(startTimestamp !== null) return; // não mexe se já estiver rodando
    if(isConfigComplete(config)){
      clockStatus.textContent = "Pronto para começar";
    } else {
      clockStatus.textContent = "Configure salário e dias pra começar";
    }
  }

  btnToggle.addEventListener("click", () => {
    if(startTimestamp === null){
      // iniciar — só permite se salário, horas/dia e dias da semana já estiverem configurados
      if(!isConfigComplete(config)){
        alert("Antes de começar, preencha salário mensal, horas por dia e os dias que você trabalha na aba Configurar.");
        tabBtns.forEach(b=>b.classList.remove("active"));
        screens.forEach(s=>s.classList.remove("active"));
        const configTabBtn = document.querySelector('.tab-btn[data-tab="config"]');
        configTabBtn.classList.add("active");
        document.getElementById("screen-config").classList.add("active");
        renderConfigForm();
        return;
      }
      startTimestamp = Date.now();
      safeSetItem(TIMER_STATE_KEY, JSON.stringify({ startTimestamp }));
      beginTicking();
    } else {
      // finalizar e salvar
      const endTimestamp = Date.now();
      const elapsedSeconds = Math.max(0, Math.floor((endTimestamp - startTimestamp)/1000 * devSpeedMultiplier));
      if(elapsedSeconds > 0){
        // usa a data do INÍCIO do turno (corrige o registro indo pro dia errado
        // quando o cronômetro cruza a meia-noite)
        const dateISO = isoFromTimestamp(startTimestamp);
        const rate = hourlyRateForMonth(monthKeyOf(dateISO), config);
        const priorSecondsToday = secondsWorkedOnDate(dateISO);
        const earned = earnedForDaySeconds(priorSecondsToday + elapsedSeconds, rate, config)
                      - earnedForDaySeconds(priorSecondsToday, rate, config);
        records.push({
          date: dateISO,
          seconds: elapsedSeconds,
          rate,
          earned,
          startTime: startTimestamp,
          endTime: endTimestamp
        });
        saveRecords(records);
      }
      startTimestamp = null;
      localStorage.removeItem(TIMER_STATE_KEY);
      stopTicking();
      updateEarningsPanel();
    }
  });

  window.addEventListener("beforeunload", (e) => {
    if(startTimestamp !== null){
      e.preventDefault();
      e.returnValue = "";
    }
  });

  /* ---------------- PAINEL DE GANHOS ---------------- */
  const statHours = document.getElementById("stat-hours");
  const statMoney = document.getElementById("stat-money");
  const statRate = document.getElementById("stat-rate");
  const progressFill = document.getElementById("progress-fill");
  const progressCaption = document.getElementById("progress-caption");

  function secondsWorkedInMonth(monthKey, extraSeconds){
    let total = records
      .filter(r => monthKeyOf(r.date) === monthKey)
      .reduce((sum, r) => sum + r.seconds, 0);
    if(extraSeconds) total += extraSeconds;
    return total;
  }

  // soma os ganhos de um mês usando a taxa travada de cada registro
  // (registros antigos sem taxa salva usam a taxa atual como aproximação)
  function earnedInMonth(monthKey, cfg, runningElapsedSeconds){
    let total = records
      .filter(r => monthKeyOf(r.date) === monthKey)
      .reduce((sum, r) => {
        if(typeof r.earned === "number") return sum + r.earned;
        const rate = (typeof r.rate === "number") ? r.rate : hourlyRateForMonth(monthKey, cfg);
        return sum + (r.seconds/3600) * rate;
      }, 0);
    if(runningElapsedSeconds){
      // turno em andamento: aplica a mesma redução por hora extra, com base no que já foi
      // trabalhado hoje (turnos salvos) somado ao tempo corrido deste turno
      const dateISO = todayISO();
      const rate = hourlyRateForMonth(monthKey, cfg);
      const priorSecondsToday = secondsWorkedOnDate(dateISO);
      total += earnedForDaySeconds(priorSecondsToday + runningElapsedSeconds, rate, cfg)
             - earnedForDaySeconds(priorSecondsToday, rate, cfg);
    }
    return total;
  }

  function updateEarningsPanel(runningElapsedSeconds){
    const now = new Date();
    const monthKey = currentMonthKey();
    const secondsThisMonth = secondsWorkedInMonth(monthKey, runningElapsedSeconds);
    const hoursThisMonth = secondsThisMonth / 3600;

    const workDaysSet = new Set(config.workDays || []);
    const workDaysInMonth = countWorkDaysInMonth(now.getFullYear(), now.getMonth(), workDaysSet);
    const monthGoalHours = workDaysInMonth * (config.hoursPerDay || 0);
    const currentRate = hourlyRateForMonth(monthKey, config);
    const earned = earnedInMonth(monthKey, config, runningElapsedSeconds);
    const progressPct = monthGoalHours > 0 ? Math.min(100, (hoursThisMonth/monthGoalHours)*100) : 0;

    statHours.textContent = formatHoursMinutes(secondsThisMonth);
    statMoney.textContent = formatMoney(earned);
    statRate.textContent = formatMoney(currentRate);
    progressFill.style.width = `${progressPct}%`;
    progressCaption.textContent = monthGoalHours > 0
      ? `${progressPct.toFixed(0)}% do mês trabalhado`
      : `configure salário e dias na aba Configurar`;
  }

  /* ---------------- INTERVALO (TEMPORIZADOR + ALARME) ---------------- */
  const breakIdle = document.getElementById("break-idle");
  const breakActive = document.getElementById("break-active");
  const breakMinutesInput = document.getElementById("break-minutes");
  const breakSecondsInput = document.getElementById("break-seconds");
  const breakCountdown = document.getElementById("break-countdown");
  const btnBreakStart = document.getElementById("btn-break-start");
  const btnBreakCancel = document.getElementById("btn-break-cancel");
  const flashOverlay = document.getElementById("flash-overlay");

  let breakInterval = null;
  let breakEndTimestamp = null;
  let alarmRinging = false;
  let audioCtx = null;
  let beepInterval = null;

  function playBeep(){
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if(audioCtx.state === "suspended") audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "square";
    osc.frequency.value = 880;
    gain.gain.value = 0.15;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    setTimeout(()=> osc.stop(), 220);
  }

  function startBreak(){
    const minutes = Math.max(0, parseFloat(breakMinutesInput.value) || 0);
    const seconds = Math.max(0, Math.min(59, parseFloat(breakSecondsInput.value) || 0));
    const totalSeconds = Math.round(minutes*60 + seconds);
    if(totalSeconds <= 0) return;
    breakEndTimestamp = Date.now() + totalSeconds*1000;
    breakIdle.classList.add("hidden");
    breakActive.classList.remove("hidden");
    tickBreak();
    breakInterval = setInterval(tickBreak, 1000);
  }

  function tickBreak(){
    const remaining = Math.max(0, Math.round((breakEndTimestamp - Date.now())/1000));
    const m = Math.floor(remaining/60);
    const s = remaining%60;
    breakCountdown.textContent = `${pad(m)}:${pad(s)}`;
    if(remaining <= 0){
      clearInterval(breakInterval);
      breakInterval = null;
      ringAlarm();
    }
  }

  function ringAlarm(){
    alarmRinging = true;
    breakCountdown.textContent = "00:00";
    flashOverlay.classList.add("flashing");
    btnBreakCancel.textContent = "Parar alarme";
    playBeep();
    beepInterval = setInterval(playBeep, 700);
  }

  function stopAlarmAndReset(){
    clearInterval(breakInterval);
    clearInterval(beepInterval);
    breakInterval = null;
    beepInterval = null;
    alarmRinging = false;
    flashOverlay.classList.remove("flashing");
    btnBreakCancel.textContent = "Cancelar";
    breakActive.classList.add("hidden");
    breakIdle.classList.remove("hidden");
  }

  btnBreakStart.addEventListener("click", startBreak);
  btnBreakCancel.addEventListener("click", stopAlarmAndReset);

  // quando o app volta do background, recalcula o intervalo na hora
  // (o setInterval pode ter sido pausado pelo navegador economizando bateria)
  document.addEventListener("visibilitychange", () => {
    if(document.visibilityState === "visible"){
      if(startTimestamp !== null) tick();
      if(breakInterval !== null && breakEndTimestamp !== null) tickBreak();
      if(alarmRinging && audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    }
  });

  /* ---------------- HISTÓRICO ---------------- */
  const monthSelect = document.getElementById("month-select");
  const monthSummary = document.getElementById("month-summary");
  const historyList = document.getElementById("history-list");

  function allMonthsAvailable(){
    const set = new Set(records.map(r => monthKeyOf(r.date)));
    set.add(currentMonthKey());
    return [...set].sort().reverse();
  }

  function monthLabel(key){
    const [y,m] = key.split("-").map(Number);
    const d = new Date(y, m-1, 1);
    const label = d.toLocaleDateString("pt-BR", { month:"long", year:"numeric" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  function renderHistory(){
    const months = allMonthsAvailable();
    const prevSelected = monthSelect.value;
    monthSelect.innerHTML = "";
    months.forEach(key => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = monthLabel(key);
      monthSelect.appendChild(opt);
    });
    monthSelect.value = months.includes(prevSelected) ? prevSelected : currentMonthKey();
    renderMonthDetails(monthSelect.value);
  }

  monthSelect.addEventListener("change", () => renderMonthDetails(monthSelect.value));

  function renderMonthDetails(monthKey){
    const monthRecords = records.filter(r => monthKeyOf(r.date) === monthKey);

    // agrupar por dia (total de segundos + lista de turnos com horário)
    const byDay = {};
    const sessionsByDay = {};
    monthRecords.forEach(r => {
      byDay[r.date] = (byDay[r.date] || 0) + r.seconds;
      if(!sessionsByDay[r.date]) sessionsByDay[r.date] = [];
      sessionsByDay[r.date].push(r);
    });
    const days = Object.keys(byDay).sort().reverse();

    const totalSeconds = monthRecords.reduce((s,r)=>s+r.seconds,0);
    const earned = earnedInMonth(monthKey, config);

    monthSummary.innerHTML = `
      <div class="msum-item">
        <span class="msum-value">${formatHoursMinutes(totalSeconds)}</span>
        <span class="msum-label">total no mês</span>
      </div>
      <div class="msum-item">
        <span class="msum-value">${formatMoney(earned)}</span>
        <span class="msum-label">ganho no mês</span>
      </div>
      <div class="msum-item">
        <span class="msum-value">${days.length}</span>
        <span class="msum-label">dias trabalhados</span>
      </div>
    `;

    if(days.length === 0){
      historyList.innerHTML = `<div class="history-empty">Nenhum registro neste mês ainda.</div>`;
      return;
    }

    historyList.innerHTML = days.map(dateISO => {
      const [yy,mm,dd] = dateISO.split("-").map(Number);
      const dObj = new Date(yy, mm-1, dd);
      const weekday = WEEKDAY_NAMES[dObj.getDay()];

      // turnos do dia, do mais antigo pro mais recente, com horário de início/fim
      const sessions = (sessionsByDay[dateISO] || [])
        .slice()
        .sort((a,b) => (a.startTime||0) - (b.startTime||0));

      const rangesHtml = sessions.map(s => {
        if(typeof s.startTime === "number" && typeof s.endTime === "number"){
          return `<span class="ticket-range">${timeFromTimestamp(s.startTime)} – ${timeFromTimestamp(s.endTime)}</span>`;
        }
        // registros antigos, sem horário salvo
        return `<span class="ticket-range">${formatHoursMinutes(s.seconds)}</span>`;
      }).join("");

      return `
        <div class="ticket">
          <div class="ticket-date">
            <span class="ticket-day">${pad(dd)}/${pad(mm)}</span>
            <span class="ticket-weekday">${weekday}</span>
          </div>
          <div class="ticket-info">
            <span class="ticket-hours">${formatHoursMinutes(byDay[dateISO])}</span>
            <div class="ticket-ranges">${rangesHtml}</div>
          </div>
        </div>
      `;
    }).join("");
  }

  /* ---------------- BACKUP ---------------- */
  const btnExport = document.getElementById("btn-export");
  const btnImport = document.getElementById("btn-import");
  const importFileInput = document.getElementById("import-file-input");
  const importConfirm = document.getElementById("import-confirm");

  btnExport.addEventListener("click", () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      config, records, profile,
      theme: currentTheme
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = todayISO();
    a.href = url;
    a.download = `ponto-backup-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  btnImport.addEventListener("click", () => importFileInput.click());

  importFileInput.addEventListener("change", () => {
    const file = importFileInput.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try{
        const data = JSON.parse(reader.result);
        if(typeof data !== "object" || data === null){
          throw new Error("formato inválido");
        }
        if(data.config) { config = sanitizeConfig(data.config); saveConfig(config); }
        if(Array.isArray(data.records)) { records = sanitizeRecords(data.records); saveRecords(records); }
        if(data.profile && typeof data.profile === "object") {
          profile = {
            name: typeof data.profile.name === "string" ? data.profile.name : "",
            photo: typeof data.profile.photo === "string" ? data.profile.photo : ""
          };
          saveProfile(profile);
        }
        if(data.theme === "light" || data.theme === "dark"){
          currentTheme = data.theme;
          localStorage.setItem(THEME_KEY, currentTheme);
          applyTheme(currentTheme);
        }

        renderProfile();
        renderConfigForm();
        updateEarningsPanel();
        updateClockAvailability();
        renderHistory();

        importConfirm.classList.remove("hidden");
        setTimeout(()=>importConfirm.classList.add("hidden"), 2500);
      }catch(e){
        alert("Não foi possível ler esse arquivo de backup. Verifique se é um backup válido do Ponto.");
      }
    };
    reader.readAsText(file);
    importFileInput.value = "";
  });

  /* ---------------- ZONA DE RISCO ---------------- */
  const btnResetAll = document.getElementById("btn-reset-all");

  btnResetAll.addEventListener("click", () => {
    const step1 = confirm("Apagar TODOS os dados (perfil, configuração e histórico)? Essa ação não pode ser desfeita.");
    if(!step1) return;
    const step2 = confirm("Tem certeza mesmo? Não vai dar pra recuperar depois.");
    if(!step2) return;

    localStorage.removeItem(CONFIG_KEY);
    localStorage.removeItem(RECORDS_KEY);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(TIMER_STATE_KEY);
    localStorage.removeItem(THEME_KEY);
    location.reload();
  });

  // sincroniza entre abas/janelas: se outra aba iniciar, finalizar o cronômetro
  // ou mudar config/registros, esta aba reflete o estado em vez de ficar desatualizada
  window.addEventListener("storage", (e) => {
    if(e.key === TIMER_STATE_KEY){
      if(e.newValue === null){
        // outra aba finalizou o turno
        if(startTimestamp !== null){
          startTimestamp = null;
          stopTicking();
        }
      } else {
        try{
          const state = JSON.parse(e.newValue);
          if(state && typeof state.startTimestamp === "number" && state.startTimestamp !== startTimestamp){
            startTimestamp = state.startTimestamp;
            beginTicking();
          }
        }catch(err){}
      }
      records = loadRecords();
      updateEarningsPanel();
    }
    if(e.key === RECORDS_KEY){
      records = loadRecords();
      updateEarningsPanel();
      if(document.getElementById("screen-historico").classList.contains("active")) renderHistory();
    }
    if(e.key === CONFIG_KEY){
      config = loadConfig();
      renderConfigForm();
      updateEarningsPanel();
      updateClockAvailability();
    }
    if(e.key === PROFILE_KEY){
      profile = loadProfile();
      renderProfile();
    }
  });

  /* ---------------- INIT ---------------- */
  renderProfile();
  renderConfigForm();
  updateEarningsPanel();
  updateClockAvailability();
  restoreRunningTimer();

  // mantém o painel de ganhos atualizado mesmo parado (ex: virar o mês)
  setInterval(() => {
    if(startTimestamp === null) updateEarningsPanel();
  }, 30000);

})();



// === ECONOMIX V2 - MODO DEMO + STREAK + FAB ===
const DEMO_LANCAMENTOS = [
  { id: 9001, descricao: 'Salário', valor: 2500, tipo: 'entrada', categoria: 'mesada', data: new Date(Date.now()-5*86400000), confirmado: true },
  { id: 9002, descricao: 'iFood Burguer', valor: 48.9, tipo: 'saida', categoria: 'comida', data: new Date(Date.now()-4*86400000), confirmado: true },
  { id: 9003, descricao: 'Uber Trabalho', valor: 22.5, tipo: 'saida', categoria: 'transporte', data: new Date(Date.now()-3*86400000), confirmado: true },
  { id: 9004, descricao: 'Freela Site', valor: 450, tipo: 'entrada', categoria: 'mesada', data: new Date(Date.now()-2*86400000), confirmado: true },
  { id: 9005, descricao: 'Cinema', valor: 65, tipo: 'saida', categoria: 'lazer', data: new Date(Date.now()-1*86400000), confirmado: true },
  { id: 9006, descricao: 'Curso Udemy', valor: 39.9, tipo: 'saida', categoria: 'estudos', data: new Date(), confirmado: false },
  { id: 9007, descricao: 'Game Pass', valor: 44.9, tipo: 'saida', categoria: 'jogos', data: new Date(), confirmado: true },
];

function aplicarModoDemoSeVazio(){
  if(lancamentos.length===0 && !localStorage.getItem('demo_visto')){
    lancamentos = DEMO_LANCAMENTOS.map(l=>({...l}));
    const demoBanner = document.getElementById('demoBanner');
    if(demoBanner) demoBanner.style.display='flex';
    if(typeof renderizarTudo==='function') renderizarTudo();
  }
}
function limparDemo(){
  lancamentos = [];
  localStorage.setItem('demo_visto','1');
  const demoBanner = document.getElementById('demoBanner');
  if(demoBanner) demoBanner.style.display='none';
  if(typeof salvar==='function') salvar();
  if(typeof renderizarTudo==='function') renderizarTudo();
}

// STREAK
function atualizarStreak(){
  const CHAVE_STREAK = 'saldo_streak';
  const CHAVE_ULTIMO = 'saldo_ultimo_registro';
  const hoje = new Date().toISOString().slice(0,10);
  const ultimo = localStorage.getItem(CHAVE_ULTIMO);
  let streak = parseInt(localStorage.getItem(CHAVE_STREAK)||'0');
  
  // Se registrou hoje, mantém
  if(ultimo===hoje){
    // já contou hoje
  } else {
    // verifica se ontem registrou pra continuar streak
    const ontem = new Date(Date.now()-86400000).toISOString().slice(0,10);
    if(ultimo===ontem){
      streak = streak+1;
    } else if(ultimo){
      // quebrou streak, mas se for primeiro registro mantém 1
      const diff = ultimo ? Math.floor((new Date(hoje)-new Date(ultimo))/86400000) : 999;
      if(diff>1) streak = 1;
    }
  }
  
  // badge
  const badge = document.getElementById('streakBadge');
  if(badge && streak>0){
    badge.style.display='inline-flex';
    badge.textContent = `🔥 ${streak} dia${streak>1?'s':''}`;
  }
  return streak;
}
function registrarStreakAgora(){
  const hoje = new Date().toISOString().slice(0,10);
  const ultimo = localStorage.getItem('saldo_ultimo_registro');
  let streak = parseInt(localStorage.getItem('saldo_streak')||'0');
  if(ultimo!==hoje){
    if(ultimo){
      const ontem = new Date(Date.now()-86400000).toISOString().slice(0,10);
      streak = (ultimo===ontem) ? streak+1 : 1;
    } else {
      streak = 1;
    }
    localStorage.setItem('saldo_streak', String(streak));
    localStorage.setItem('saldo_ultimo_registro', hoje);
    atualizarStreak();
    // confete no streak 3,7,30
    if([3,7,30].includes(streak) && window.confetti){
      confetti({particleCount:120, spread:80, origin:{y:0.7}});
    }
  }
}

// CONFETE AO BATER META
function celebrarMeta(){
  if(window.confetti){
    confetti({particleCount:150, spread:100, origin:{y:0.6}, colors:['#facc15','#f97316','#22c55e']});
  }
}

// Hook no salvar original
document.addEventListener('DOMContentLoaded', ()=>{
  setTimeout(()=>{
    aplicarModoDemoSeVazio();
    atualizarStreak();
    const btnDemo = document.getElementById('btnLimparDemo');
    if(btnDemo) btnDemo.addEventListener('click', limparDemo);
    const fab = document.getElementById('fabAdd');
    if(fab){
      fab.addEventListener('click', ()=>{
        const formEl = document.getElementById('formLancamento');
        if(formEl) formEl.scrollIntoView({behavior:'smooth'});
        const desc = document.getElementById('descricao');
        if(desc) desc.focus();
      });
    }
  }, 600);
});

// Intercepta adicionar lancamento pra registrar streak e celebrar
const _originalSalvar = window.salvar;


// === ECONOMIX V3 - ZAP AUTOMÁTICO ===
const CHAVE_TELEFONE_LOCAL = 'saldo_telefone';
const CHAVE_ZAP_PULADO = 'saldo_zap_pulado';

async function verificarTelefonePendente(){
  try{
    if(typeof tokenSessao !== 'undefined' && tokenSessao && window.fetch){
      const r = await fetch(API_URL + '/dados', { headers: { Authorization: 'Bearer ' + tokenSessao }});
      if(r.ok){
        const d = await r.json();
        if(d.telefone){
          localStorage.setItem(CHAVE_TELEFONE_LOCAL, d.telefone);
          return;
        }
      }
    }
  }catch(e){}
  const temLocal = localStorage.getItem(CHAVE_TELEFONE_LOCAL);
  const pulou = localStorage.getItem(CHAVE_ZAP_PULADO);
  const jaPerguntouHoje = localStorage.getItem('zap_perguntou_hoje') === new Date().toISOString().slice(0,10);
  if(!temLocal && !pulou && !jaPerguntouHoje){
    const temDados = (typeof lancamentos !== 'undefined' && lancamentos.length>0);
    if(temDados || true){
      setTimeout(()=>{
        const m = document.getElementById('modalTelefone');
        if(m) m.classList.remove('escondido');
      }, 1500);
    }
  }
}

async function salvarTelefoneZap(telefone, optin){
  const telLimpo = telefone.replace(/\D/g,'');
  if(telLimpo.length < 10){
    alert('Coloca um número válido com DDD. Ex: 61999999999');
    return false;
  }
  localStorage.setItem(CHAVE_TELEFONE_LOCAL, telLimpo);
  localStorage.setItem('zap_perguntou_hoje', new Date().toISOString().slice(0,10));
  if(typeof tokenSessao !== 'undefined' && tokenSessao){
    try{
      await fetch(API_URL + '/telefone', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', Authorization: 'Bearer ' + tokenSessao },
        body: JSON.stringify({ telefone: telLimpo, zapOptin: optin })
      });
    }catch(e){ console.warn(e); }
  } else {
    localStorage.setItem('telefone_pendente_para_servidor', JSON.stringify({ telefone: telLimpo, zapOptin: optin }));
  }
  try{
    await fetch(API_URL + '/testar-zap', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ telefone: telLimpo })
    });
  }catch(e){}
  return true;
}

document.addEventListener('DOMContentLoaded', ()=>{
  setTimeout(verificarTelefonePendente, 2000);
  const btnSalvarTel = document.getElementById('btnSalvarTelefone');
  const btnPularTel = document.getElementById('btnPularTelefone');
  if(btnSalvarTel){
    btnSalvarTel.addEventListener('click', async ()=>{
      const input = document.getElementById('inputTelefoneZap');
      const check = document.getElementById('checkZapOptin');
      const tel = input ? input.value : '';
      const optin = check ? check.checked : true;
      if(!tel) { alert('Coloca seu número'); return; }
      btnSalvarTel.textContent = 'Salvando...';
      const ok = await salvarTelefoneZap(tel, optin);
      btnSalvarTel.textContent = 'Ativar alertas no Zap';
      if(ok){
        document.getElementById('modalTelefone').classList.add('escondido');
        if(window.confetti) confetti({particleCount:100, spread:70});
      }
    });
  }
  if(btnPularTel){
    btnPularTel.addEventListener('click', ()=>{
      localStorage.setItem(CHAVE_ZAP_PULADO,'1');
      localStorage.setItem('zap_perguntou_hoje', new Date().toISOString().slice(0,10));
      document.getElementById('modalTelefone').classList.add('escondido');
    });
  }
});

async function enviarTelefonePendenteSeExistir(){
  const pend = localStorage.getItem('telefone_pendente_para_servidor');
  if(pend && typeof tokenSessao !== 'undefined' && tokenSessao){
    try{
      const obj = JSON.parse(pend);
      await fetch(API_URL + '/telefone', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', Authorization: 'Bearer ' + tokenSessao },
        body: JSON.stringify(obj)
      });
      localStorage.removeItem('telefone_pendente_para_servidor');
    }catch(e){}
  }
}
