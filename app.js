/* Translations loaded from translations.js */
const LANG = window.LANG || {};

/* ─── MOCK DATA ─── */
let lang = localStorage.getItem('sus_lang') || 'pt';
let darkMode = localStorage.getItem('sus_dark') === 'true' || window.matchMedia('(prefers-color-scheme: dark)').matches;
let fontScale = parseInt(localStorage.getItem('sus_font') || '100', 10);
let currentRole = null;
let currentCitizenNav = 'home';
let currentAdminNav = 'dashboard';
let citizenHistTab = 'apt';
let adminAptTab = 'upcoming';
let curiosityIdx = 0;
let curiosityTimer = null;
let selectedCancelReason = null;
let sessionTimer = null;
let sessionRemaining = 15 * 60;

const ADMIN_PIN = '1234';

let appState = JSON.parse(localStorage.getItem('sus_state') || 'null') || {
  appointment: {
    id:'apt001', type_pt:'Cardiologia — Dra. Souza', type_en:'Cardiology — Dr. Souza', type_es:'Cardiología — Dra. Souza',
    date:'14/06/2025', time:'09:30',
    location_pt:'UBS Vila Mariana, R. Domingos de Moraes, 1521',
    location_en:'UBS Vila Mariana, R. Domingos de Moraes, 1521',
    location_es:'UBS Vila Mariana, R. Domingos de Moraes, 1521',
    professional:'Dra. Souza', assignedBy:'Admin #0042',
    confirmed: false, canceled: false, cancelReason: null
  },
  alerts: [
    {id:'al1', text_pt:'Campanha de vacinação contra gripe. Venha até a UBS até dia 30!',
     text_en:'Flu vaccination campaign. Come to the UBS by the 30th!',
     text_es:'Campaña de vacunación. ¡Venga a la UBS antes del día 30!',
     active:true, until:'30/06/2025', createdAt:'01/06/2025'},
    {id:'al2', text_pt:'UBS fechada na segunda-feira (feriado municipal).',
     text_en:'UBS closed on Monday (municipal holiday).',
     text_es:'UBS cerrada el lunes (feriado municipal).',
     active:false, until:'10/06/2025', createdAt:'05/06/2025'}
  ],
  activities: [
    {id:'ac1',emoji:'🚶',color:'#06d6a0',title_pt:'Grupo de Caminhada',title_en:'Walking Group',title_es:'Grupo de Caminata',
     schedule_pt:'Seg e Qua, 7h',schedule_en:'Mon & Wed, 7am',schedule_es:'Lun y Mié, 7am',
     desc_pt:'Caminhada leve no parque para adultos.',desc_en:'Light walk in the park.',desc_es:'Caminata ligera en el parque.',
     audience_pt:'Adultos 40+',audience_en:'Adults 40+',audience_es:'Adultos 40+',
     where_pt:'Estacionamento UBS',where_en:'UBS Parking',where_es:'Estacionamiento UBS', visible:true},
    {id:'ac2',emoji:'🎨',color:'#ef476f',title_pt:'Arteterapia',title_en:'Art Therapy',title_es:'Arteterapia',
     schedule_pt:'Ter e Qui, 14h',schedule_en:'Tue & Thu, 2pm',schedule_es:'Mar y Jue, 14h',
     desc_pt:'Sessões de pintura para saúde mental.',desc_en:'Painting for mental health.',desc_es:'Sesiones de pintura para salud mental.',
     audience_pt:'Todos',audience_en:'All ages',audience_es:'Todos', where_pt:'Sala 2',where_en:'Room 2',where_es:'Sala 2', visible:true},
    {id:'ac3',emoji:'🧘',color:'#118ab2',title_pt:'Yoga',title_en:'Yoga',title_es:'Yoga',
     schedule_pt:'Sex, 8h',schedule_en:'Fri, 8am',schedule_es:'Vie, 8am',
     desc_pt:'Yoga suave e meditação guiada.',desc_en:'Gentle yoga and meditation.',desc_es:'Yoga suave y meditación.',
     audience_pt:'Adultos',audience_en:'Adults',audience_es:'Adultos',
     where_pt:'Ginástica',where_en:'Gym',where_es:'Gimnasio', visible:true},
    {id:'ac4',emoji:'🎵',color:'#ffd166',title_pt:'Musicoterapia',title_en:'Music Therapy',title_es:'Musicoterapia',
     schedule_pt:'Qua, 15h',schedule_en:'Wed, 3pm',schedule_es:'Mié, 15h',
     desc_pt:'Terapia pela música.',desc_en:'Music-based therapy.',desc_es:'Terapia musical.',
     audience_pt:'Saúde mental',audience_en:'Mental health',audience_es:'Salud mental',
     where_pt:'Auditório',where_en:'Auditorium',where_es:'Auditorio', visible:false},
  ],
  curiosities: [
    {title_pt:'O SUS é o maior sistema de saúde pública do mundo',title_en:'SUS is the largest public health system in the world',title_es:'El SUS es el mayor sistema de salud pública del mundo',
     text_pt:'Atende mais de 210 milhões de brasileiros, oferecendo tudo gratuitamente.',text_en:'Serves over 210 million Brazilians, offering everything free.',text_es:'Atiende a más de 210 millones de brasileños, ofreciendo todo de forma gratuita.'},
    {title_pt:'Mais de 60% dos brasileiros dependem do SUS',title_en:'Over 60% of Brazilians depend on SUS',title_es:'Más del 60% de los brasileños dependen del SUS',
     text_pt:'O SUS garante acesso universal e é referência em vacinação.',text_en:'SUS guarantees universal access and is a vaccination reference.',text_es:'El SUS garantiza acceso universal y es referencia en vacunación.'},
    {title_pt:'O SUS realiza 12 milhões de cirurgias por ano',title_en:'SUS performs 12 million surgeries per year',title_es:'El SUS realiza 12 millones de cirugías por año',
     text_pt:'Incluindo transplantes, tudo custeado pelo Estado.',text_en:'Including transplants, all funded by the State.',text_es:'Incluyendo trasplantes, todo financiado por el Estado.'},
  ],
  susLinks: [
    {id:'sl1',title_pt:'Como o SUS funciona',title_en:'How SUS works',title_es:'Cómo funciona el SUS'},
    {id:'sl2',title_pt:'Seus direitos como paciente',title_en:'Your rights as a patient',title_es:'Tus derechos como paciente'},
    {id:'sl3',title_pt:'O que é a UBS?',title_en:'What is UBS?',title_es:'¿Qué es la UBS?'},
    {id:'sl4',title_pt:'Calendário Nacional de Vacinação',title_en:'National Vaccination Schedule',title_es:'Calendario Nacional de Vacunación'},
  ],
  history: {
    appointments: [
      {id:'h1',type_pt:'Clínica Geral',type_en:'General Practice',type_es:'Clínica General',date:'10/03/2025',time:'10:00',location:'UBS Centro',status:'attended'},
      {id:'h2',type_pt:'Dermatologia',type_en:'Dermatology',type_es:'Dermatología',date:'22/01/2025',time:'14:30',location:'UBS Norte',status:'canceled',cancelReason:'reasonTransport'},
    ],
    exams: [
      {id:'e1',name_pt:'Hemograma Completo',name_en:'Blood Count',name_es:'Hemograma Completo',date:'05/03/2025',location:'Lab UBS',status:'available'},
      {id:'e2',name_pt:'Glicemia em Jejum',name_en:'Fasting Glucose',name_es:'Glucosa en Ayunas',date:'20/04/2025',location:'Lab UBS',status:'pending'},
    ]
  },
  complaints: [
    {id:'c1',category:'complaint',text:'Fila muito longa no atendimento. Esperamos mais de 3 horas.',date:'05/06/2025',patientId:'M.S. #1234',status:'open'},
    {id:'c2',category:'compliment',text:'Dra. Ana foi muito atenciosa e explicou tudo com clareza.',date:'03/06/2025',patientId:'J.P. #5678',status:'resolved'},
  ],
  adminAppointments: [
    {id:'a1',patientId:'M.S. #1234',date:'14/06/2025',time:'09:30',professional:'Dra. Souza',type:'consultation',status:'scheduled'},
    {id:'a2',patientId:'J.P. #5678',date:'14/06/2025',time:'11:00',professional:'Dr. Lima',type:'exam',status:'scheduled'},
    {id:'a3',patientId:'A.C. #9012',date:'15/06/2025',time:'08:00',professional:'Dra. Souza',type:'followup',status:'canceled',cancelReason:'reasonCantAttend'},
  ]
};

function saveState() {
  localStorage.setItem('sus_state', JSON.stringify(appState));
}

function t(key) { try { return (LANG && LANG[lang] && LANG[lang][key]) || key; } catch(e) { return key; } }

/* ─── TOAST ─── */
function showToast(msg, type='success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast ${type} show`;
  setTimeout(() => el.classList.remove('show'), 3000);
}

/* ─── THEME & A11Y ─── */
function applyTheme() {
  document.documentElement.classList.toggle('dark', darkMode);
  const icon = darkMode ? 'fa-sun' : 'fa-moon';
  ['themeToggle','themeToggleLogin'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.innerHTML = `<i class="fa-solid ${icon}"></i>`;
  });
  localStorage.setItem('sus_dark', darkMode);
}
function applyFont() {
  document.documentElement.style.setProperty('--font-scale', fontScale/100);
  ['fontSlider','fontSliderLogin'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.value = fontScale;
  });
  localStorage.setItem('sus_font', fontScale);
}
let highContrast = localStorage.getItem('sus_contrast') === 'true';
function applyContrast() {
  document.documentElement.classList.toggle('high-contrast', highContrast);
  ['contrastToggle','contrastToggleLogin'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.classList.toggle('active', highContrast);
  });
  localStorage.setItem('sus_contrast', highContrast);
}
function applyLang() {
  const dict = (LANG && LANG[lang]) || {};
  document.querySelectorAll('[data-t]').forEach(el => {
    const k = el.dataset.t;
    if(dict[k]) el.textContent = dict[k];
  });
  ['langSelect','langSelectLogin'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.value = lang;
  });
  localStorage.setItem('sus_lang', lang);
  // Update select options text
  const cCat = document.getElementById('cCategory');
  if(cCat) {
    const opts = ['complaint','compliment','doubt','others'];
    opts.forEach((v,i) => { if(cCat.options[i]) cCat.options[i].text = t(v); });
  }
}

/* ─── ROLE SELECT ─── */
function selectRole(role) {
  if(currentRole && currentRole !== role) {
    // auto-logout when switching between admin and citizen
    logout();
  }
  if(role === 'admin') {
    document.getElementById('pinModal').classList.remove('hidden');
    document.getElementById('pinInput').value = '';
    setTimeout(() => document.getElementById('pinInput').focus(), 100);
  } else {
    enterApp('citizen');
  }
}
function closePinModal() { document.getElementById('pinModal').classList.add('hidden'); }
function submitPin() {
  const userEl = document.getElementById('adminUser');
  const passEl = document.getElementById('adminPass');
  const pinEl = document.getElementById('pinInput');
  const user = userEl ? userEl.value.trim() : '';
  const pass = passEl ? passEl.value : '';
  const pin = pinEl ? pinEl.value.trim() : '';

  // Check username/password first (stored credential fallback)
  const stored = JSON.parse(localStorage.getItem('sus_admin_creds') || 'null') || {user:'admin', pass:'admin123'};
  if(user && pass) {
    if(user === stored.user && pass === stored.pass) {
      closePinModal();
      enterApp('admin');
      return;
    } else {
      showToast('Usuário ou senha incorretos', 'error');
      if(passEl) passEl.value = '';
      if(userEl) userEl.focus();
      return;
    }
  }

  // fallback to PIN
  if(pin === ADMIN_PIN) {
    closePinModal();
    enterApp('admin');
  } else {
    showToast('PIN incorreto', 'error');
    if(pinEl) { pinEl.value = ''; pinEl.focus(); }
  }
}
document.getElementById('pinInput').addEventListener('keydown', e => { if(e.key==='Enter') submitPin(); });

function enterApp(role) {
  currentRole = role;
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('mainApp').style.display = 'block';
  document.getElementById('currentUserLabel').textContent = role === 'citizen' ? 'Cidadão' : 'Admin';
  document.getElementById('citizenNav').style.display = role === 'citizen' ? 'flex' : 'none';
  document.getElementById('adminNav').style.display = role === 'admin' ? 'flex' : 'none';
  document.getElementById('sessionBar').classList.toggle('hidden', role !== 'admin');
  if(role === 'admin') { startSessionTimer(); }
  if(role === 'citizen') citizenNav('home');
  else adminNav('dashboard');
  applyLang();
}

function logout() {
  currentRole = null;
  clearInterval(sessionTimer);
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('mainApp').style.display = 'none';
  document.getElementById('sessionBar').classList.add('hidden');
}

/* ─── SESSION TIMER ─── */
function startSessionTimer() {
  sessionRemaining = 15 * 60;
  clearInterval(sessionTimer);
  sessionTimer = setInterval(() => {
    sessionRemaining--;
    updateSessionBar();
    if(sessionRemaining <= 0) {
      clearInterval(sessionTimer);
      logout();
      showToast(t('sessionExpired'), 'error');
    }
  }, 1000);
  updateSessionBar();
}
function resetSessionTimer() { startSessionTimer(); }
function updateSessionBar() {
  const bar = document.getElementById('sessionBar');
  const mins = Math.floor(sessionRemaining/60);
  const secs = sessionRemaining % 60;
  document.getElementById('sessionTimerLabel').textContent = `${t('sessionWarning')} ${mins}${t('minutes')} ${String(secs).padStart(2,'0')}${t('seconds')}`;
  bar.classList.toggle('urgent', sessionRemaining <= 120);
}
// Reset on activity
['click','keydown','mousemove','touchstart'].forEach(ev => {
  document.addEventListener(ev, () => { if(currentRole==='admin' && sessionTimer) resetSessionTimer(); }, {passive:true});
});

/* ─── CITIZEN NAVIGATION ─── */
function citizenNav(nav) {
  currentCitizenNav = nav;
  const screenMap = {
    home:'sc-citizen-home', history:'sc-citizen-history',
    community:'sc-citizen-community', about:'sc-citizen-about',
    contact:'sc-citizen-contact', actdetail:'sc-citizen-actdetail',
    article:'sc-citizen-article'
  };
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screenId = screenMap[nav];
  if(screenId) document.getElementById(screenId).classList.add('active');
  document.querySelectorAll('[data-cnav]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cnav === nav);
    btn.style.color = '';
  });
  const colors = {home:'var(--teal)',history:'var(--gold)',community:'var(--emerald)',about:'var(--blue)',contact:'var(--pink)'};
  const activeBtn = document.querySelector(`[data-cnav="${nav}"]`);
  if(activeBtn) {
    activeBtn.style.color = colors[nav] || 'var(--teal)';
    activeBtn.querySelectorAll('i, span').forEach(el => el.style.color = colors[nav] || 'var(--teal)');
  }
  document.getElementById('mainContent').scrollTop = 0;
  renderCitizenScreen(nav);
}

function renderCitizenScreen(nav) {
  if(nav==='home') renderCitizenHome();
  else if(nav==='history') renderCitizenHistory();
  else if(nav==='community') renderCommunity();
  else if(nav==='about') renderAboutSUS();
  else if(nav==='contact') refreshContactSelects();
}

/* ─── RENDER CITIZEN HOME ─── */
function renderCitizenHome() {
  // Alert banner
  renderAlertBanner();

  // Appointment card
  const aptSection = document.getElementById('aptSection');
  if(appState.appointment && !appState.appointment.canceled) {
    const apt = appState.appointment;
    const typeKey = lang==='pt'?'type_pt':lang==='en'?'type_en':'type_es';
    const locKey = lang==='pt'?'location_pt':lang==='en'?'location_en':'location_es';
    const hdrColor = apt.confirmed ? 'var(--emerald)' : 'var(--teal)';
    const hdrText = apt.confirmed ? `<i class="fa-solid fa-circle-check"></i> ${t('confirmed')}` : `<i class="fa-regular fa-calendar-check"></i> ${t('nextAppointment')}`;
    aptSection.innerHTML = `
      <div class="apt-card" onclick="openAppointmentDetail('${apt.id}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter')openAppointmentDetail('${apt.id}')" style="margin-bottom:0">
        <div class="apt-card-hdr" style="background:${hdrColor}">${hdrText}</div>
        <div class="apt-body">
          <div class="apt-row"><div class="apt-icon"><i class="fa-solid fa-stethoscope"></i></div><div><span class="apt-lbl">${t('type')}</span><span class="apt-val">${apt[typeKey]}</span></div></div>
          <div class="apt-row"><div class="apt-icon"><i class="fa-regular fa-clock"></i></div><div><span class="apt-lbl">${t('date')}</span><span class="apt-val">${apt.date} — ${apt.time}</span></div></div>
          <div class="apt-row"><div class="apt-icon"><i class="fa-solid fa-location-dot"></i></div><div><span class="apt-lbl">${t('local')}</span><span class="apt-val">${apt[locKey]}</span></div></div>
          ${apt.assignedBy ? `<div style="font-size:.68rem;color:var(--text2);margin-top:4px"><i class="fa-solid fa-user-check" style="margin-right:4px"></i>${t('assignedBy')}: ${apt.assignedBy}</div>` : ''}
          <div class="apt-actions">
            ${!apt.confirmed ? `<button class="btn btn-emerald btn-sm" onclick="confirmAptAttendance()" aria-label="${t('confirmAttend')}"><i class="fa-solid fa-circle-check"></i> ${t('confirmAttend')}</button>` : `<div class="apt-confirmed-badge"><i class="fa-solid fa-circle-check"></i> ${t('confirmed')}</div>`}
            ${!apt.confirmed ? `<button class="btn btn-pink btn-sm" onclick="openCancelModal()" aria-label="${t('cancelApt')}"><i class="fa-solid fa-circle-xmark"></i> ${t('cancelApt')}</button>` : ''}
          </div>
        </div>
      </div>`;
  } else {
    aptSection.innerHTML = `<div class="no-apt"><i class="fa-regular fa-calendar-xmark"></i>${t('noAppointment')}</div>`;
  }

  // Appointments carousel (all appointments for carousel)
  const carousel = document.getElementById('appointmentsCarousel');
  carousel.innerHTML = appState.appointment && !appState.appointment.canceled ? `
    <div class="apt-card" onclick="citizenNav('history')" role="button" tabindex="0" onkeydown="if(event.key==='Enter')citizenNav('history')">
      <div class="apt-card-hdr" style="background:${appState.appointment.confirmed ? 'var(--emerald)' : 'var(--teal)'}"><i class="fa-regular fa-calendar"></i> ${appState.appointment.date}</div>
      <div class="apt-body">
        <div style="font-size:.78rem;color:var(--text);font-weight:600">${appState.appointment[lang==='pt'?'type_pt':lang==='en'?'type_en':'type_es']}</div>
        <div style="font-size:.68rem;color:var(--text2);margin-top:4px"><i class="fa-solid fa-location-dot"></i> ${appState.appointment[lang==='pt'?'location_pt':lang==='en'?'location_en':'location_es']}</div>
      </div>
    </div>
  ` : '<div style="padding:10px 0;font-size:.78rem;color:var(--text2);text-align:center" data-t="noAppointments"></div>';

  // Activities grid (visible only)
  const grid = document.getElementById('actsGrid');
  const visActs = appState.activities.filter(a => a.visible);
  grid.innerHTML = visActs.slice(0,3).map(a => `
    <button class="act-card" onclick="openActivity('${a.id}')" aria-label="${lang==='pt'?a.title_pt:lang==='en'?a.title_en:a.title_es}">
      <div class="act-emoji" style="background:${a.color}18">${a.emoji}</div>
      <div class="act-name">${lang==='pt'?a.title_pt:lang==='en'?a.title_en:a.title_es}</div>
    </button>`).join('') || '<p style="padding:8px 16px;font-size:.8rem;color:var(--text2)" data-t="noApts"></p>';

  // Curiosity
  renderCuriosity();
  if(!curiosityTimer) { curiosityTimer = setInterval(nextCuriosity, 5000); }
}

let alertCollapsedState = {};
function toggleAlertCollapse(id) {
  alertCollapsedState[id] = !alertCollapsedState[id];
  renderAlertBanner();
}
function dismissAlert(id) {
  const a = appState.alerts.find(x => x.id===id);
  if(a) a.active = false;
  alertCollapsedState[id] = false;
  saveState();
  renderCitizenHome();
}
function renderAlertBanner() {
  const alertWrap = document.getElementById('alertBannerWrap');
  const activeAlert = appState.alerts.find(a => a.active);
  if(activeAlert) {
    const isCollapsed = alertCollapsedState[activeAlert.id];
    const bannerClass = isCollapsed ? 'alert-banner collapsed' : 'alert-banner';
    const displayText = lang==='pt'?activeAlert.text_pt:lang==='en'?activeAlert.text_en:activeAlert.text_es;
    const closeIcon = isCollapsed ? 'fa-solid fa-exclamation' : 'fa-solid fa-xmark';
    const closeLabel = isCollapsed ? t('expandAlert') || 'Expandir alerta' : t('collapseAlert') || 'Retrair alerta';
    alertWrap.innerHTML = `
      <div class="${bannerClass}" role="alert" aria-live="polite">
        <i class="fa-solid fa-bullhorn" style="font-size:.82rem;flex-shrink:0"></i>
        <div class="alert-text">${displayText}</div>
        <button class="alert-close" onclick="toggleAlertCollapse('${activeAlert.id}')" aria-label="${closeLabel}"><i class="${closeIcon}"></i></button>
      </div>`;
  } else { alertWrap.innerHTML = ''; }
}

/* ─── APPOINTMENT ACTIONS ─── */
function confirmAptAttendance() {
  appState.appointment.confirmed = true;
  saveState();
  showToast(t('confirmSuccess'), 'success');
  renderCitizenHome();
}

let cancelModalOpen = false;
function openCancelModal() {
  selectedCancelReason = null;
  const reasons = ['reasonCantAttend','reasonTransport','reasonForgot','reasonOther'];
  document.getElementById('reasonOptions').innerHTML = reasons.map(r => `
    <button class="reason-opt" id="ro_${r}" onclick="selectReason('${r}')" aria-pressed="false">
      <i class="fa-solid ${r==='reasonCantAttend'?'fa-ban':r==='reasonTransport'?'fa-bus':r==='reasonForgot'?'fa-clock-rotate-left':'fa-ellipsis'}" style="color:var(--pink);width:16px"></i>
      ${t(r)}
    </button>`).join('');
  document.getElementById('cancelModal').classList.remove('hidden');
  document.getElementById('cancelModal').querySelector('.reason-opt').focus();
  applyLang();
}
function selectReason(r) {
  selectedCancelReason = r;
  document.querySelectorAll('.reason-opt').forEach(btn => {
    btn.classList.toggle('selected', btn.id === `ro_${r}`);
    btn.setAttribute('aria-pressed', btn.id === `ro_${r}` ? 'true' : 'false');
  });
}
function closeCancelModal() { document.getElementById('cancelModal').classList.add('hidden'); }
function confirmCancel() {
  if(!selectedCancelReason) { showToast('Selecione um motivo', 'error'); return; }
  const apt = appState.appointment;
  appState.history.appointments.unshift({
    id: apt.id,
    type_pt: apt.type_pt, type_en: apt.type_en, type_es: apt.type_es,
    date: apt.date, time: apt.time, location: apt[lang==='pt'?'location_pt':lang==='en'?'location_en':'location_es'],
    status:'canceled', cancelReason: selectedCancelReason
  });
  // Admin notification (state flag)
  if(!appState.adminNotifications) appState.adminNotifications = [];
  appState.adminNotifications.push({type:'cancel', aptId:apt.id, reason:selectedCancelReason, date:new Date().toLocaleDateString()});
  appState.appointment = null;
  saveState();
  closeCancelModal();
  showToast(t('cancelSuccess'), 'info');
  renderCitizenHome();
}

/* ─── CITIZEN HISTORY ─── */
function switchCitizenTab(tab) {
  citizenHistTab = tab;
  ['apt','exam'].forEach(t => document.getElementById(`ctab-${t}`).classList.toggle('active', t===tab));
  renderCitizenHistory();
}
function renderCitizenHistory() {
  const c = document.getElementById('citizenHistoryContent');
  if(citizenHistTab==='apt') {
    const items = appState.history.appointments;
    if(!items.length) { c.innerHTML = `<div class="empty"><i class="fa-regular fa-calendar-xmark"></i><p>${t('noHistory')}</p></div>`; return; }
    c.innerHTML = items.map(h => `
      <div class="hist-item" onclick="openAppointmentDetail('${h.id}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter')openAppointmentDetail('${h.id}')">
        <div class="hist-top">
          <div class="hist-title">${lang==='pt'?h.type_pt:lang==='en'?h.type_en:h.type_es}</div>
          <span class="badge ${h.status==='attended'?'badge-green':'badge-red'}">${h.status==='attended'?t('statusAttended'):t('statusCanceled')}</span>
        </div>
        <div class="hist-meta"><i class="fa-regular fa-calendar"></i>${h.date} ${h.time} <i class="fa-solid fa-location-dot"></i>${h.location}</div>
        ${h.cancelReason ? `<div style="font-size:.7rem;color:var(--text2);margin-top:3px"><i class="fa-solid fa-comment" style="margin-right:4px"></i>${t('canceledReason')} ${t(h.cancelReason)}</div>` : ''}
      </div>`).join('');
  } else {
    const items = appState.history.exams;
    if(!items.length) { c.innerHTML = `<div class="empty"><i class="fa-solid fa-flask"></i><p>${t('noHistory')}</p></div>`; return; }
    c.innerHTML = items.map(e => `
      <div class="hist-item" onclick="openExamDetail('${e.id}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter')openExamDetail('${e.id}')">
        <div class="hist-top">
          <div class="hist-title">${lang==='pt'?e.name_pt:lang==='en'?e.name_en:e.name_es}</div>
          <span class="badge ${e.status==='available'?'badge-blue':'badge-yellow'}">${e.status==='available'?t('statusAvailable'):t('statusPending')}</span>
        </div>
        <div class="hist-meta"><i class="fa-regular fa-calendar"></i>${e.date} <i class="fa-solid fa-location-dot"></i>${e.location}</div>
      </div>`).join('');
  }
}

function openAppointmentDetail(id) {
  const apt = appState.history.appointments.find(a => a.id === id);
  if(!apt) return;
  const typeKey = lang==='pt'?'type_pt':lang==='en'?'type_en':'type_es';
  const locKey = lang==='pt'?'location_pt':lang==='en'?'location_en':'location_es';
  const hdrColor = apt.status==='attended' ? 'var(--emerald)' : 'var(--pink)';
  const hdrText = apt.status==='attended' ? `<i class="fa-solid fa-circle-check"></i> ${t('statusAttended')}` : `<i class="fa-solid fa-circle-xmark"></i> ${t('statusCanceled')}`;
  document.getElementById('aptDetailContent').innerHTML = `
    <div class="colored-top" style="background:${hdrColor}">
      <button class="back-btn" onclick="citizenNav('history')" aria-label="Voltar"><i class="fa-solid fa-arrow-left"></i></button>
      <h1 class="page-title">${t('appointmentDetail')}</h1>
    </div>
    <div style="padding:16px">
      <div class="apt-card">
        <div class="apt-card-hdr" style="background:${hdrColor}">${hdrText}</div>
        <div class="apt-body">
          <div class="apt-row"><div class="apt-icon"><i class="fa-solid fa-stethoscope"></i></div><div><span class="apt-lbl">${t('type')}</span><span class="apt-val">${apt[typeKey]}</span></div></div>
          <div class="apt-row"><div class="apt-icon"><i class="fa-regular fa-clock"></i></div><div><span class="apt-lbl">${t('date')}</span><span class="apt-val">${apt.date} — ${apt.time}</span></div></div>
          <div class="apt-row"><div class="apt-icon"><i class="fa-solid fa-location-dot"></i></div><div><span class="apt-lbl">${t('local')}</span><span class="apt-val">${apt.location}</span></div></div>
          ${apt.cancelReason ? `<div style="background:rgba(239,71,111,0.1);padding:10px;border-radius:var(--radius-xs);margin-top:12px;border-left:3px solid var(--pink)"><span style="font-size:.68rem;color:var(--text2)"><strong>${t('canceledReason')}:</strong> ${t(apt.cancelReason)}</span></div>` : ''}
        </div>
      </div>
    </div>`;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('sc-citizen-aptdetail').classList.add('active');
}

function openExamDetail(id) {
  const exam = appState.history.exams.find(e => e.id === id);
  if(!exam) return;
  const nameKey = lang==='pt'?'name_pt':lang==='en'?'name_en':'name_es';
  const hdrColor = exam.status==='available' ? 'var(--blue)' : 'var(--gold)';
  const hdrText = exam.status==='available' ? `<i class="fa-solid fa-flask"></i> ${t('examAvailable')}` : `<i class="fa-solid fa-clock"></i> ${t('examPending')}`;
  document.getElementById('examDetailContent').innerHTML = `
    <div class="colored-top" style="background:${hdrColor}">
      <button class="back-btn" onclick="citizenNav('history')" aria-label="Voltar"><i class="fa-solid fa-arrow-left"></i></button>
      <h1 class="page-title">${t('examDetail')}</h1>
    </div>
    <div style="padding:16px">
      <div class="apt-card">
        <div class="apt-card-hdr" style="background:${hdrColor}">${hdrText}</div>
        <div class="apt-body">
          <div class="apt-row"><div class="apt-icon"><i class="fa-solid fa-flask"></i></div><div><span class="apt-lbl">${t('exam')}</span><span class="apt-val">${exam[nameKey]}</span></div></div>
          <div class="apt-row"><div class="apt-icon"><i class="fa-regular fa-calendar"></i></div><div><span class="apt-lbl">${t('date')}</span><span class="apt-val">${exam.date}</span></div></div>
          <div class="apt-row"><div class="apt-icon"><i class="fa-solid fa-location-dot"></i></div><div><span class="apt-lbl">${t('local')}</span><span class="apt-val">${exam.location}</span></div></div>
        </div>
      </div>
    </div>`;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('sc-citizen-examdetail').classList.add('active');
}

/* ─── COMMUNITY ─── */
function renderCommunity() {
  const list = document.getElementById('communityList');
  const visActs = appState.activities.filter(a => a.visible);
  if(!visActs.length) { list.innerHTML = `<div class="empty"><i class="fa-solid fa-people-group"></i><p>${t('noHistory')}</p></div>`; return; }
  list.innerHTML = visActs.map(a => `
    <button class="apt-list-item" onclick="openActivity('${a.id}')" style="width:100%;text-align:left;cursor:pointer;border:none">
      <div style="width:48px;height:48px;border-radius:var(--radius-sm);background:${a.color}20;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0">${a.emoji}</div>
      <div class="apt-info">
        <div class="apt-name">${lang==='pt'?a.title_pt:lang==='en'?a.title_en:a.title_es}</div>
        <div class="apt-details"><i class="fa-regular fa-clock" style="margin-right:4px"></i>${lang==='pt'?a.schedule_pt:lang==='en'?a.schedule_en:a.schedule_es}</div>
      </div>
      <i class="fa-solid fa-chevron-right" style="color:var(--text2);font-size:.75rem"></i>
    </button>`).join('');
}
function openActivity(id) {
  const a = appState.activities.find(x => x.id===id);
  if(!a) return;
  const titleKey = lang==='pt'?'title_pt':lang==='en'?'title_en':'title_es';
  const descKey = lang==='pt'?'desc_pt':lang==='en'?'desc_en':'desc_es';
  const schedKey = lang==='pt'?'schedule_pt':lang==='en'?'schedule_en':'schedule_es';
  const audKey = lang==='pt'?'audience_pt':lang==='en'?'audience_en':'audience_es';
  const whereKey = lang==='pt'?'where_pt':lang==='en'?'where_en':'where_es';
  document.getElementById('actDetailContent').innerHTML = `
    <div style="width:100%;height:160px;background:linear-gradient(135deg,${a.color}30,${a.color}60);display:flex;align-items:center;justify-content:center;font-size:4rem">${a.emoji}</div>
    <div style="padding:14px 16px">
      <button class="back-btn" onclick="citizenNav('community')" style="margin-left:-8px;margin-bottom:8px"><i class="fa-solid fa-arrow-left"></i></button>
      <h1 style="font-size:1.1rem;font-weight:700;margin-bottom:8px">${a[titleKey]}</h1>
      <p style="font-size:.82rem;line-height:1.65;color:var(--text2);margin-bottom:14px">${a[descKey]}</p>
      <div style="display:flex;flex-direction:column;gap:8px;font-size:.82rem">
        <div><i class="fa-regular fa-clock" style="width:16px;color:var(--blue);margin-right:6px"></i><strong>${t('actSchedule')}:</strong> ${a[schedKey]}</div>
        <div><i class="fa-solid fa-users" style="width:16px;color:var(--blue);margin-right:6px"></i><strong>${t('actDesc')}:</strong> ${a[audKey]}</div>
        <div><i class="fa-solid fa-location-dot" style="width:16px;color:var(--blue);margin-right:6px"></i><strong>${t('local')}:</strong> ${a[whereKey]}</div>
      </div>
    </div>`;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('sc-citizen-actdetail').classList.add('active');
}

/* ─── ABOUT SUS ─── */
function renderAboutSUS() {
  const colors = ['var(--teal)','var(--blue)','var(--emerald)','var(--pink)'];
  const icons = ['fa-book-open','fa-shield-halved','fa-house-medical','fa-syringe'];
  document.getElementById('aboutLinks').innerHTML = appState.susLinks.map((l,i) => `
    <button class="apt-list-item" onclick="openArticle('${l.id}')" style="width:100%;text-align:left;border:none;cursor:pointer;margin-bottom:8px">
      <div style="width:40px;height:40px;border-radius:var(--radius-xs);background:${colors[i%colors.length]};display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fa-solid ${icons[i%icons.length]}" style="color:#fff;font-size:.85rem"></i></div>
      <div class="apt-info"><div class="apt-name">${lang==='pt'?l.title_pt:lang==='en'?l.title_en:l.title_es}</div></div>
      <i class="fa-solid fa-chevron-right" style="color:var(--text2);font-size:.75rem"></i>
    </button>`).join('');
}
const articleContent = {
  sl1:{pt:'<p>O SUS, criado em 1988, garante saúde como direito de todos e dever do Estado. Baseia-se em universalidade, integralidade e equidade.</p><p>Com cobertura nacional, é o maior sistema público de saúde do mundo.</p>',en:'<p>SUS, created in 1988, guarantees health as a right of all and a duty of the State. It is based on universality, integrality and equity.</p>',es:'<p>El SUS, creado en 1988, garantiza la salud como derecho de todos y deber del Estado.</p>'},
  sl2:{pt:'<p>Você tem direito a atendimento humanizado, acesso a medicamentos e informações sobre sua saúde.</p>',en:'<p>You have the right to humanized care, access to medicines and information about your health.</p>',es:'<p>Tienes derecho a atención humanizada, acceso a medicamentos e información sobre tu salud.</p>'},
  sl3:{pt:'<p>A UBS é o primeiro ponto de contato com o sistema de saúde. Oferece consultas, vacinas e acompanhamento preventivo.</p>',en:'<p>The UBS is the first point of contact with the health system. It offers consultations, vaccines and preventive follow-up.</p>',es:'<p>La UBS es el primer punto de contacto con el sistema de salud.</p>'},
  sl4:{pt:'<p>O calendário nacional oferece vacinas gratuitas para todas as idades, incluindo BCG, Hepatite, Febre Amarela, HPV e muitas outras.</p>',en:'<p>The national calendar offers free vaccines for all ages, including BCG, Hepatitis, Yellow Fever, HPV and many others.</p>',es:'<p>El calendario nacional ofrece vacunas gratuitas para todas las edades.</p>'},
};
function openArticle(id) {
  const l = appState.susLinks.find(x => x.id===id);
  const art = articleContent[id];
  if(!l||!art) return;
  document.getElementById('articleContent').innerHTML = `
    <h2 style="font-size:1rem;font-weight:700;margin-bottom:6px">${lang==='pt'?l.title_pt:lang==='en'?l.title_en:l.title_es}</h2>
    <p style="font-size:.7rem;color:var(--text2);margin-bottom:12px"><i class="fa-regular fa-calendar" style="margin-right:4px"></i>Ministério da Saúde — 2024</p>
    <div style="font-size:.84rem;line-height:1.72;color:var(--text)">${lang==='pt'?art.pt:lang==='en'?art.en:art.es}</div>`;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('sc-citizen-article').classList.add('active');
}

/* ─── CONTACT / COMPLAINT ─── */
function refreshContactSelects() {
  const sel = document.getElementById('cCategory');
  if(sel) { ['complaint','compliment','doubt','others'].forEach((v,i)=>{ if(sel.options[i]) sel.options[i].text=t(v); }); }
  renderPreviousComplaints();
}
function renderPreviousComplaints() {
  const prev = document.getElementById('previousComplaints');
  if(appState.complaints && appState.complaints.length > 0) {
    prev.innerHTML = `<div style="border-top:1.5px solid var(--border);padding-top:16px;margin-top:8px">
      <h3 style="font-size:.82rem;font-weight:700;margin-bottom:10px;color:var(--text2);text-transform:uppercase;letter-spacing:.5px">${t('previousMessages') || 'Mensagens anteriores'}</h3>
      ${appState.complaints.map(c => `
        <div class="card" style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <span class="badge ${c.category==='complaint'?'badge-red':c.category==='compliment'?'badge-green':'badge-blue'}">${t(c.category)}</span>
            <span style="font-size:.65rem;color:var(--text2)">${c.date}</span>
          </div>
          <p style="font-size:.78rem;line-height:1.4;color:var(--text);margin-bottom:8px">${c.text}</p>
          <div style="background:var(--bg);padding:8px 10px;border-radius:var(--radius-xs);font-size:.7rem;color:var(--text2);font-style:italic">
            <strong>${t('unitResponse') || 'Resposta da unidade'}:</strong> ${c.response || 'Aguardando resposta...'}
          </div>
        </div>
      `).join('')}
    </div>`;
  } else {
    prev.innerHTML = '';
  }
}
function submitComplaint() {
  const msg = document.getElementById('cMsg').value.trim();
  const cat = document.getElementById('cCategory').value;
  if(msg.length < 10) { showToast(t('feedbackErr'),'error'); return; }
  appState.complaints.push({
    id:'c'+Date.now(), category:cat, text:msg,
    date:new Date().toLocaleDateString(), patientId:'J.M. #'+Math.floor(1000+Math.random()*9000),
    status:'open', response: null
  });
  // Show ombudsman notification dot
  document.getElementById('ombudsNotifDot').style.display = 'block';
  saveState();
  document.getElementById('cMsg').value = '';
  renderPreviousComplaints();
  showToast(t('feedbackSent'),'success');
}

/* ─── CURIOSITY ─── */
function renderCuriosity() {
  const c = appState.curiosities[curiosityIdx];
  const titleKey = lang==='pt'?'title_pt':lang==='en'?'title_en':'title_es';
  const textKey = lang==='pt'?'text_pt':lang==='en'?'text_en':'text_es';
  document.getElementById('curTitle').textContent = c[titleKey];
  document.getElementById('curText').textContent = c[textKey];
  document.getElementById('curDots').innerHTML = appState.curiosities.map((_,i) =>
    `<div class="cur-dot${i===curiosityIdx?' active':''}"></div>`).join('');
  // Store current curiosity ID for linking
  document.getElementById('curiosityBox').dataset.curiosityId = c.id;
}
function nextCuriosity() {
  curiosityIdx = (curiosityIdx+1) % appState.curiosities.length;
  renderCuriosity();
}
function openCuriosityArticle() {
  const c = appState.curiosities[curiosityIdx];
  if(c && c.linkedArticleId) {
    openArticle(c.linkedArticleId);
  } else {
    citizenNav('about');
  }
}

/* ─── ADMIN NAVIGATION ─── */
function adminNav(nav) {
  currentAdminNav = nav;
  const screenMap = {
    dashboard:'sc-admin-dashboard', appointments:'sc-admin-appointments',
    ombudsman:'sc-admin-ombudsman', reports:'sc-admin-reports',
    community:'sc-admin-community', alerts:'sc-admin-alerts'
  };
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  if(screenMap[nav]) document.getElementById(screenMap[nav]).classList.add('active');
  document.querySelectorAll('[data-anav]').forEach(btn => {
    const isActive = btn.dataset.anav === nav;
    btn.classList.toggle('active', isActive);
    btn.style.color = isActive ? 'var(--blue)' : '';
    btn.querySelectorAll('i, span').forEach(el => el.style.color = isActive ? 'var(--blue)' : '');
  });
  document.getElementById('mainContent').scrollTop = 0;
  renderAdminScreen(nav);
}

function renderAdminScreen(nav) {
  if(nav==='dashboard') renderAdminDashboard();
  else if(nav==='appointments') renderAdminApts();
  else if(nav==='ombudsman') renderOmbudsman();
  else if(nav==='reports') renderReports();
  else if(nav==='community') renderAdminCommunity();
  else if(nav==='alerts') renderAdminAlerts();
}

/* ─── ADMIN DASHBOARD ─── */
function renderAdminDashboard() {
  const totalApts = appState.adminAppointments.filter(a=>a.status==='scheduled').length;
  const canceled = appState.adminAppointments.filter(a=>a.status==='canceled').length;
  const noShows = appState.adminAppointments.filter(a=>a.status==='noshow').length;
  const completed = appState.adminAppointments.filter(a=>a.status==='completed').length;
  const complaints = appState.complaints.filter(c=>c.status==='open').length;
  const activeAlerts = appState.alerts.filter(a=>a.active).length;
  document.getElementById('adminStats').innerHTML = `
    <div class="stat-card">
      <div class="stat-num" style="color:var(--emerald)">${totalApts}</div>
      <div class="stat-lbl">${t('totalApts')}</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--pink)">${canceled}</div>
      <div class="stat-lbl">${t('totalCanceled')}</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--gold)">${noShows}</div>
      <div class="stat-lbl">${t('totalNoShow')}</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--blue)">${completed}</div>
      <div class="stat-lbl">${t('totalCompleted')}</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--pink)">${complaints}</div>
      <div class="stat-lbl">${t('totalComplaints')}</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--teal)">${activeAlerts}</div>
      <div class="stat-lbl">${t('activeAlerts')}</div>
    </div>` + `<div style="grid-column:1/-1;padding:0 0 8px"><button class="btn btn-gold btn-sm" style="width:100%;max-width:100%;margin:0" onclick="generateAptReport()"><i class="fa-solid fa-file-pdf"></i> ${t('generateReport')}</button></div>`;
  // Recent alerts
  const dashAlerts = document.getElementById('dashAlerts');
  const alerts = appState.alerts.slice(0,2);
  dashAlerts.innerHTML = alerts.length ? alerts.map(a => `
    <div class="alert-admin-item" onclick="editAlert('${a.id}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter')editAlert('${a.id}')">
      <div class="alert-admin-hdr"><span class="badge ${a.active?'badge-green':'badge-gray'}">${a.active?'Ativo':'Inativo'}</span><span style="font-size:.68rem;color:var(--text2)">${a.createdAt}</span></div>
      <div class="alert-admin-text">${lang==='pt'?a.text_pt:lang==='en'?a.text_en:a.text_es}</div>
    </div>`).join('') : `<div class="empty"><p>${t('noAlerts')}</p></div>`;
  // Today's apts
  const dashApts = document.getElementById('dashApts');
  const todayApts = appState.adminAppointments.filter(a=>a.status==='scheduled').slice(0,3);
  dashApts.innerHTML = todayApts.length ? todayApts.map(a => `
    <div class="apt-list-item" onclick="viewAptDetail('${a.id}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter')viewAptDetail('${a.id}')">
      <div style="width:36px;height:36px;border-radius:var(--radius-xs);background:rgba(17,138,178,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fa-regular fa-calendar" style="color:var(--blue);font-size:.85rem"></i></div>
      <div class="apt-info">
        <div class="apt-name">${a.patientId}</div>
        <div class="apt-details">${a.time} — ${a.professional}</div>
      </div>
      <span class="badge badge-green">${t(a.type)}</span>
    </div>`).join('') : `<div class="empty"><p>${t('noApts')}</p></div>`;
}

/* ─── ADMIN APPOINTMENTS ─── */
function switchAdminAptTab(tab) {
  adminAptTab = tab;
  ['upcoming','canceled','new'].forEach(t => {
    const el = document.getElementById(`atab-${t}`);
    if(el) el.classList.toggle('active', t===tab);
  });
  renderAdminApts();
}
function renderAdminApts() {
  const c = document.getElementById('adminAptContent');
  if(adminAptTab==='new') {
    c.innerHTML = `
      <div class="card" style="margin-top:8px">
        <div style="font-weight:700;font-size:.9rem;margin-bottom:14px" data-t="newApt"></div>
        <div class="form-group"><label class="form-label">${t('patient')}</label>
          <select class="form-select" id="newAptPatient">
            <option>M.S. #1234</option><option>J.P. #5678</option><option>A.C. #9012</option><option>L.R. #3456</option>
          </select></div>
        <div class="form-group"><label class="form-label">${t('date')}</label><input type="date" class="form-input" id="newAptDate"/></div>
        <div class="form-group"><label class="form-label">${t('time')}</label><input type="time" class="form-input" id="newAptTime"/></div>
        <div class="form-group"><label class="form-label">${t('professional')}</label>
          <select class="form-select" id="newAptProf">
            <option>Dra. Souza</option><option>Dr. Lima</option><option>Dra. Santos</option>
          </select></div>
        <div class="form-group"><label class="form-label">${t('aptType')}</label>
          <select class="form-select" id="newAptType">
            <option value="consultation">${t('consultation')}</option>
            <option value="exam">${t('exam')}</option>
            <option value="followup">${t('followup')}</option>
          </select></div>
        <button class="btn btn-teal" onclick="saveNewApt()"><i class="fa-solid fa-check"></i> ${t('saveApt')}</button>
      </div>`;
  } else if(adminAptTab==='upcoming') {
    const items = appState.adminAppointments.filter(a=>a.status==='scheduled').sort((a,b)=>new Date(a.date+' '+a.time)-new Date(b.date+' '+b.time));
    c.innerHTML = items.length ? items.map(a=>`
      <div class="apt-list-item" onclick="openAdminAppointmentEdit('${a.id}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter')openAdminAppointmentEdit('${a.id}')">
        <div style="width:36px;height:36px;border-radius:var(--radius-xs);background:rgba(6,214,160,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fa-regular fa-calendar-check" style="color:var(--emerald);font-size:.85rem"></i></div>
        <div class="apt-info">
          <div class="apt-name">${a.patientId}</div>
          <div class="apt-details">${a.date} ${a.time} — ${a.professional}</div>
        </div>
        <span class="badge badge-green">${t(a.type)}</span>
      </div>`).join('') : `<div class="empty"><i class="fa-regular fa-calendar"></i><p>${t('noApts')}</p></div>`;
  } else {
    const items = appState.adminAppointments.filter(a=>a.status==='canceled').sort((a,b)=>new Date(a.date+' '+a.time)-new Date(b.date+' '+b.time));
    c.innerHTML = items.length ? items.map(a=>`
      <div class="apt-list-item" onclick="openAdminAppointmentEdit('${a.id}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter')openAdminAppointmentEdit('${a.id}')">
        <div style="width:36px;height:36px;border-radius:var(--radius-xs);background:rgba(239,71,111,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fa-solid fa-calendar-xmark" style="color:var(--pink);font-size:.85rem"></i></div>
        <div class="apt-info">
          <div class="apt-name">${a.patientId}</div>
          <div class="apt-details">${a.date} — ${a.professional}</div>
          ${a.cancelReason?`<div style="font-size:.68rem;color:var(--text2)">${t('canceledReason')} ${t(a.cancelReason)}</div>`:''}
        </div>
        <span class="badge badge-red">${t('statusCanceled')}</span>
      </div>`).join('') : `<div class="empty"><i class="fa-regular fa-calendar-xmark"></i><p>${t('noApts')}</p></div>`;
  }
}
function saveNewApt() {
  const patient = document.getElementById('newAptPatient').value;
  const date = document.getElementById('newAptDate').value;
  const time = document.getElementById('newAptTime').value;
  const prof = document.getElementById('newAptProf').value;
  const type = document.getElementById('newAptType').value;
  if(!date||!time) { showToast('Preencha data e horário','error'); return; }
  const [y,m,d] = date.split('-');
  const formattedDate = `${d}/${m}/${y}`;
  appState.adminAppointments.push({
    id:'a'+Date.now(), patientId:patient, date:formattedDate, time,
    professional:prof, type, status:'scheduled'
  });
  // Simulate citizen notification
  if(patient==='M.S. #1234') {
    appState.appointment = {
      id:'apt'+Date.now(), type_pt:`${t(type)} — ${prof}`, type_en:`${t(type)} — ${prof}`, type_es:`${t(type)} — ${prof}`,
      date:formattedDate, time, location_pt:'UBS Vila Mariana', location_en:'UBS Vila Mariana', location_es:'UBS Vila Mariana',
      professional:prof, assignedBy:'Admin #0042', confirmed:false, canceled:false
    };
  }
  saveState();
  showToast(t('notifNewApt'),'success');
  switchAdminAptTab('upcoming');
}

/* ─── AI SUGGESTION MAP ─── */
const aiSuggestions = {
  pt:{
    complaint:{delay:'Estamos revisando nosso protocolo de filas. Pedimos desculpas pelo inconveniente.',rude:'Tomamos feedback sobre atendimento muito a sério. Investigaremos o ocorrido.',default:'Agradecemos o seu feedback. Estamos trabalhando para melhorar continuamente.'},
    compliment:{default:'Obrigado pelo elogio! Compartilharemos com a equipe.'},
    doubt:{default:'Entraremos em contato para esclarecer sua dúvida em breve.'},
    others:{default:'Recebemos sua mensagem. Analisaremos e responderemos em breve.'}
  },
  en:{
    complaint:{delay:"We're reviewing our queue protocol. We apologize for the inconvenience.",rude:'We take feedback about service very seriously. We will investigate.',default:'We appreciate your feedback. We are working to continuously improve.'},
    compliment:{default:'Thank you for the compliment! We will share it with the team.'},
    doubt:{default:"We'll get in touch to clarify your question soon."},
    others:{default:"We received your message. We'll analyze and respond soon."}
  },
  es:{
    complaint:{delay:'Estamos revisando nuestro protocolo de colas. Disculpe las molestias.',rude:'Tomamos muy en serio los comentarios sobre el servicio.',default:'Agradecemos su opinión. Trabajamos para mejorar continuamente.'},
    compliment:{default:'¡Gracias por el elogio! Lo compartiremos con el equipo.'},
    doubt:{default:'Nos pondremos en contacto pronto para aclarar su duda.'},
    others:{default:'Recibimos su mensaje. Lo analizaremos y responderemos pronto.'}
  }
};
function getAiSuggestion(complaint) {
  const langSug = aiSuggestions[lang] || aiSuggestions.pt;
  const catSug = langSug[complaint.category] || langSug.others;
  const text = complaint.text.toLowerCase();
  if(text.includes('fila')||text.includes('espera')||text.includes('wait')||text.includes('queue')||text.includes('cola')) return catSug.delay || catSug.default;
  if(text.includes('rude')||text.includes('grosseiro')||text.includes('maleducado')) return catSug.rude || catSug.default;
  return catSug.default;
}

/* ─── OMBUDSMAN ─── */
function renderOmbudsman() {
  document.getElementById('ombudsNotifDot').style.display = 'none';
  const c = document.getElementById('complaintsList');
  if(!appState.complaints.length) { c.innerHTML = `<div class="empty"><i class="fa-solid fa-comments"></i><p>${t('noHistory')}</p></div>`; return; }
  c.innerHTML = appState.complaints.map(comp => `
    <div class="complaint-item">
      <div class="complaint-hdr">
        <span class="complaint-id">${comp.patientId} — ${comp.date}</span>
        <span class="badge ${comp.status==='open'?'badge-yellow':'badge-green'}">${comp.status==='open'?'Aberto':'Resolvido'}</span>
      </div>
      <span class="badge ${comp.category==='complaint'?'badge-red':comp.category==='compliment'?'badge-green':'badge-blue'}" style="margin-bottom:6px">${t(comp.category)}</span>
      <div class="complaint-text">${comp.text}</div>
      ${comp.response ? `<div class="ai-suggestion" style="background:rgba(6,214,160,0.12);border-left-color:var(--emerald);margin-top:8px"><i class="fa-solid fa-reply" style="margin-right:5px"></i><strong>Resposta:</strong> ${comp.response}</div>` : ''}
      <div class="ai-suggestion"><i class="fa-solid fa-robot" style="margin-right:5px"></i><strong>${t('aiSuggestion')}</strong> ${getAiSuggestion(comp)}</div>
      <div style="display:flex;gap:6px">
        ${comp.status==='open'?`<button class="btn btn-blue btn-sm" style="flex:1" onclick="showResponseForm('${comp.id}')"><i class="fa-solid fa-reply"></i> Responder</button>`:''}
        ${comp.status==='open'?`<button class="btn btn-emerald btn-sm" style="flex:1" onclick="resolveComplaint('${comp.id}')"><i class="fa-solid fa-check"></i> Resolver</button>`:''}
      </div>
      ${comp.status==='open'&&comp.showResponseForm?`
        <div id="responseForm-${comp.id}" style="margin-top:12px;padding:12px;background:var(--bg);border-radius:8px;border:1px solid var(--border)">
          <div class="form-group" style="margin-bottom:8px">
            <label class="form-label">Resposta</label>
            <textarea class="form-textarea" id="responseText-${comp.id}" rows="3" placeholder="Digite sua resposta..."></textarea>
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-outline btn-sm" onclick="hideResponseForm('${comp.id}')" style="flex:1">Cancelar</button>
            <button class="btn btn-blue btn-sm" onclick="sendResponse('${comp.id}')" style="flex:1"><i class="fa-solid fa-paper-plane"></i> Enviar Resposta</button>
          </div>
        </div>`:''}
    </div>`).join('');
}
function resolveComplaint(id) {
  const c = appState.complaints.find(x=>x.id===id);
  if(c) c.status='resolved';
  saveState();
  renderOmbudsman();
  showToast('Reclamação marcada como resolvida','success');
}
function showResponseForm(id) {
  const c = appState.complaints.find(x=>x.id===id);
  if(c) {
    c.showResponseForm = true;
    renderOmbudsman();
    setTimeout(() => document.getElementById(`responseText-${id}`).focus(), 100);
  }
}
function hideResponseForm(id) {
  const c = appState.complaints.find(x=>x.id===id);
  if(c) {
    c.showResponseForm = false;
    renderOmbudsman();
  }
}
function sendResponse(id) {
  const c = appState.complaints.find(x=>x.id===id);
  const responseText = document.getElementById(`responseText-${id}`).value.trim();
  if(c && responseText) {
    c.response = responseText;
    c.responseDate = new Date().toLocaleDateString();
    c.showResponseForm = false;
    saveState();
    renderOmbudsman();
    showToast('Resposta enviada com sucesso','success');
  } else {
    showToast('Digite uma resposta','error');
  }
}
function printComplaintsReport() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Relatório — Ouvidoria My SUS', 20, 20);
  doc.setFontSize(12);
  doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 20, 30);
  const counts = {};
  appState.complaints.forEach(c => { counts[c.category] = (counts[c.category]||0)+1; });
  let y = 50;
  Object.entries(counts).forEach(([k,v]) => {
    doc.text(`${t(k)}: ${v}`, 20, y);
    y += 10;
  });
  doc.save('relatorio_ouvidoria.pdf');
}

function generateAppointmentReport() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Relatório de Consultas', 20, 20);
  doc.setFontSize(12);
  doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 20, 30);
  let y = 50;
  const scheduled = appState.adminAppointments.filter(a => a.status === 'scheduled').length;
  const performed = appState.adminAppointments.filter(a => a.status === 'attended').length;
  const canceled = appState.adminAppointments.filter(a => a.status === 'canceled').length;
  const absences = appState.adminAppointments.filter(a => a.status === 'no-show').length;
  doc.text(`Agendadas: ${scheduled}`, 20, y); y += 10;
  doc.text(`Realizadas: ${performed}`, 20, y); y += 10;
  doc.text(`Canceladas: ${canceled}`, 20, y); y += 10;
  doc.text(`Faltas: ${absences}`, 20, y);
  doc.save('relatorio_consultas.pdf');
}

function generateActivityReport() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Relatório da Comunidade', 20, 20);
  doc.setFontSize(12);
  doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 20, 30);
  let y = 50;
  const active = appState.activities.filter(a => a.visible).length;
  const inactive = appState.activities.filter(a => !a.visible).length;
  doc.text(`Grupos Ativos: ${active}`, 20, y); y += 10;
  doc.text(`Grupos Inativos: ${inactive}`, 20, y);
  doc.save('relatorio_comunidade.pdf');
}

function generateAlertReport() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Relatório de Alertas', 20, 20);
  doc.setFontSize(12);
  doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 20, 30);
  let y = 50;
  appState.alerts.forEach(a => {
    const omitted = a.active ? 'Ativo' : 'Omitido';
    const dates = a.active ? 'Ativo' : 'N/A';
    doc.text(`${a.id}: ${omitted} - Datas: ${dates}`, 20, y);
    y += 10;
  });
  doc.save('relatorio_alertas.pdf');
}

function showAddPatientPage() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('sc-admin-addpatient').classList.add('active');
}

function openAdminAppointmentEdit(id) {
  const apt = appState.adminAppointments.find(a => a.id === id);
  if(!apt) return;
  
  // Para agendamentos cancelados, apenas visualizar
  const isCanceled = apt.status === 'canceled';
  const titleContent = `Agendamento ${apt.patientId}`;
  
  // Update page title
  document.querySelector('#sc-admin-apt-edit .page-title').textContent = titleContent;
  
  const buttonText = isCanceled ? 'Cancelado' : 'Salvar Alterações';
  const buttonClass = isCanceled ? 'btn btn-pink' : 'btn btn-teal';
  const onclickHandler = isCanceled ? 'onclick="adminNav(\'appointments\')"' : `onclick="saveEditedApt('${id}')"`;
  
  document.getElementById('adminAptEditContent').innerHTML = `
    <div class="card" style="margin-top:8px">
      <div style="font-weight:700;font-size:.9rem;margin-bottom:14px">${titleContent}</div>
      <div class="form-group"><label class="form-label">${t('patient')}</label>
        <input type="text" class="form-input" id="editAptPatient" value="${apt.patientId}" ${isCanceled?'disabled':''}/>
      </div>
      <div class="form-group"><label class="form-label">${t('date')}</label><input type="date" class="form-input" id="editAptDate" value="${apt.date}" ${isCanceled?'disabled':''}"/></div>
      <div class="form-group"><label class="form-label">${t('time')}</label><input type="time" class="form-input" id="editAptTime" value="${apt.time}" ${isCanceled?'disabled':''}"/></div>
      <div class="form-group"><label class="form-label">${t('professional')}</label>
        <input type="text" class="form-input" id="editAptProf" value="${apt.professional}" ${isCanceled?'disabled':''}/>
      </div>
      <div class="form-group"><label class="form-label">${t('aptType')}</label>
        <input type="text" class="form-input" id="editAptType" value="${t(apt.type)}" ${isCanceled?'disabled':''}/>
      </div>
      <div class="form-group"><label class="form-label">${t('status')}</label>
        <input type="text" class="form-input" id="editAptStatus" value="${t(apt.status)}" disabled/>
      </div>
      <button class="${buttonClass}" ${onclickHandler} style="width:100%"><i class="fa-solid fa-check"></i> ${buttonText}</button>
    </div>`;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('sc-admin-apt-edit').classList.add('active');
}

function saveEditedApt(id) {
  const apt = appState.adminAppointments.find(a => a.id === id);
  if(!apt) return;
  apt.patientId = document.getElementById('editAptPatient').value;
  apt.date = document.getElementById('editAptDate').value;
  apt.time = document.getElementById('editAptTime').value;
  apt.professional = document.getElementById('editAptProf').value;
  apt.type = document.getElementById('editAptType').value;
  apt.status = document.getElementById('editAptStatus').value;
  saveState();
  showToast(t('saved') || 'Salvo com sucesso', 'success');
  switchAdminAptTab(adminAptTab);
  adminNav('appointments');
}

/* ─── REPORTS ─── */
function renderReports() {
  const c = document.getElementById('reportsContent');
  // Productivity: apts per professional
  const byProf = {};
  appState.adminAppointments.forEach(a => { byProf[a.professional] = (byProf[a.professional]||0)+1; });
  const profRows = Object.entries(byProf).map(([k,v])=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:.82rem"><span>${k}</span><strong>${v}</strong></div>`).join('');
  // Cancel reasons
  const byReason = {};
  appState.adminAppointments.filter(a=>a.status==='canceled').forEach(a => { const r = a.cancelReason||'reasonOther'; byReason[r]=(byReason[r]||0)+1; });
  const reasonRows = Object.entries(byReason).map(([k,v])=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:.82rem"><span>${t(k)}</span><strong>${v}</strong></div>`).join('');
  c.innerHTML = `
    <div class="card" style="margin-top:8px;margin-bottom:12px">
      <div style="font-weight:700;font-size:.88rem;margin-bottom:10px;display:flex;align-items:center;gap:6px"><i class="fa-solid fa-user-doctor" style="color:var(--blue)"></i> ${t('productivityReport')}</div>
      ${profRows || '<p style="color:var(--text2);font-size:.8rem">—</p>'}
      <button class="btn btn-outline btn-sm" style="margin-top:12px;width:auto;padding:8px 14px" onclick="downloadCSV('prof')"><i class="fa-solid fa-download"></i> ${t('downloadCSV')}</button>
    </div>
    <div class="card" style="margin-bottom:12px">
      <div style="font-weight:700;font-size:.88rem;margin-bottom:10px;display:flex;align-items:center;gap:6px"><i class="fa-solid fa-chart-pie" style="color:var(--pink)"></i> ${t('cancelReport')}</div>
      ${reasonRows || '<p style="color:var(--text2);font-size:.8rem">—</p>'}
      <button class="btn btn-outline btn-sm" style="margin-top:12px;width:auto;padding:8px 14px" onclick="downloadCSV('reasons')"><i class="fa-solid fa-download"></i> ${t('downloadCSV')}</button>
    </div>`;
}
function downloadCSV(type) {
  let csv = '';
  if(type==='prof') {
    csv = 'Profissional,Total\n';
    const byProf = {};
    appState.adminAppointments.forEach(a => { byProf[a.professional]=(byProf[a.professional]||0)+1; });
    Object.entries(byProf).forEach(([k,v]) => { csv += `"${k}",${v}\n`; });
  } else {
    csv = 'Motivo,Total\n';
    const byR = {};
    appState.adminAppointments.filter(a=>a.status==='canceled').forEach(a => { const r=a.cancelReason||'reasonOther'; byR[r]=(byR[r]||0)+1; });
    Object.entries(byR).forEach(([k,v]) => { csv += `"${t(k)}",${v}\n`; });
  }
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url; a.download=`mysus_${type}_${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
}

/* ─── ADMIN COMMUNITY ─── */
function renderAdminCommunity() {
  const list = document.getElementById('adminActList');
  list.innerHTML = appState.activities.map(a => `
    <div class="activity-admin-item" onclick="editActivity('${a.id}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter')editActivity('${a.id}')">
      <div class="act-admin-emoji" style="background:${a.color}20">
        ${a.photo ? `<img src="${a.photo}" alt="${lang==='pt'?a.title_pt:lang==='en'?a.title_en:a.title_es}" style="width:100%;height:100%;object-fit:cover;border-radius:12px"/>` : a.emoji}
      </div>
      <div class="act-admin-info">
        <div class="act-admin-name">${lang==='pt'?a.title_pt:lang==='en'?a.title_en:a.title_es}</div>
        <div class="act-admin-meta">${lang==='pt'?a.schedule_pt:lang==='en'?a.schedule_en:a.schedule_es}</div>
        <div style="font-size:.68rem;color:var(--text2);margin-top:2px">${t('visibleCitizens')}</div>
      </div>
      <label class="toggle-switch" aria-label="Visibilidade ${lang==='pt'?a.title_pt:a.title_en}">
        <input type="checkbox" ${a.visible?'checked':''} onchange="event.stopPropagation(); toggleActivityVisibility('${a.id}',this.checked)"/>
        <span class="toggle-slider"></span>
      </label>
    </div>`).join('');
}
function editActivity(id) {
  const act = appState.activities.find(a => a.id === id);
  if(!act) return;
  
  const titleKey = lang==='pt'?'title_pt':lang==='en'?'title_en':'title_es';
  const schedKey = lang==='pt'?'schedule_pt':lang==='en'?'schedule_en':'schedule_es';
  const descKey = lang==='pt'?'desc_pt':lang==='en'?'desc_en':'desc_es';
  const audKey = lang==='pt'?'audience_pt':lang==='en'?'audience_en':'audience_es';
  const whereKey = lang==='pt'?'where_pt':lang==='en'?'where_en':'where_es';
  
  document.getElementById('adminActivityEditContent').innerHTML = `
    <div class="card" style="margin-top:8px">
      <div style="font-weight:700;font-size:.9rem;margin-bottom:14px">${act[titleKey]}</div>
      <div class="form-group"><label class="form-label">${t('actName')}</label><input type="text" class="form-input" id="editActTitle" value="${act[titleKey]}"/></div>
      <div class="form-group"><label class="form-label">${t('actSchedule')}</label><input type="text" class="form-input" id="editActSched" value="${act[schedKey]}"/></div>
      <div class="form-group"><label class="form-label">${t('actDesc')}</label><textarea class="form-textarea" id="editActDesc" rows="3">${act[descKey]}</textarea></div>
      <div class="form-group"><label class="form-label">Foto</label><input type="file" class="form-input" id="editActPhoto" accept="image/*"/></div>
      <div class="form-group"><label class="form-label">${t('actEmoji')}</label><input type="text" class="form-input" id="editActEmoji" value="${act.emoji}" style="max-width:80px"/></div>
      <div class="form-group"><label class="form-label">${t('audience')}</label><input type="text" class="form-input" id="editActAud" value="${act[audKey]}"/></div>
      <div class="form-group"><label class="form-label">${t('where')}</label><input type="text" class="form-input" id="editActWhere" value="${act[whereKey]}"/></div>
      <div class="form-group">
        <label class="toggle-switch" aria-label="Visibilidade da atividade">
          <input type="checkbox" id="editActVisible" ${act.visible?'checked':''}/>
          <span class="toggle-slider"></span>
        </label>
        <span style="font-size:.8rem;margin-left:8px">${t('visibleCitizens')}</span>
      </div>
      <button class="btn btn-emerald" onclick="saveEditedActivity('${id}')"><i class="fa-solid fa-check"></i> Salvar Alterações</button>
    </div>`;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('sc-admin-activity-edit').classList.add('active');
}

function saveEditedActivity(id) {
  const act = appState.activities.find(a => a.id === id);
  if(!act) return;
  
  const titleKey = lang==='pt'?'title_pt':lang==='en'?'title_en':'title_es';
  const schedKey = lang==='pt'?'schedule_pt':lang==='en'?'schedule_en':'schedule_es';
  const descKey = lang==='pt'?'desc_pt':lang==='en'?'desc_en':'desc_es';
  const audKey = lang==='pt'?'audience_pt':lang==='en'?'audience_en':'audience_es';
  const whereKey = lang==='pt'?'where_pt':lang==='en'?'where_en':'where_es';
  
  act[titleKey] = document.getElementById('editActTitle').value;
  act[schedKey] = document.getElementById('editActSched').value;
  act[descKey] = document.getElementById('editActDesc').value;
  act.emoji = document.getElementById('editActEmoji').value;
  act[audKey] = document.getElementById('editActAud').value;
  act[whereKey] = document.getElementById('editActWhere').value;
  act.visible = document.getElementById('editActVisible').checked;
  const photoFile = document.getElementById('editActPhoto').files[0];
  
  if(photoFile) {
    const reader = new FileReader();
    reader.onload = (e) => {
      act.photo = e.target.result;
      saveState();
      showToast(t('saved') || 'Salvo com sucesso', 'success');
      adminNav('community');
    };
    reader.readAsDataURL(photoFile);
  } else {
    saveState();
    showToast(t('saved') || 'Salvo com sucesso', 'success');
    adminNav('community');
  }
}
function toggleActivityVisibility(id, val) {
  const a = appState.activities.find(x=>x.id===id);
  if(a) { a.visible=val; saveState(); showToast(val?'Atividade ativada':'Atividade ocultada', val?'success':'info'); }
}
function showNewActivityForm() { document.getElementById('adminActForm').classList.remove('hidden'); document.getElementById('newActName').focus(); }
function hideNewActivityForm() { document.getElementById('adminActForm').classList.add('hidden'); }
function saveNewActivity() {
  const name = document.getElementById('newActName').value.trim();
  const sched = document.getElementById('newActSched').value.trim();
  const desc = document.getElementById('newActDesc').value.trim();
  const photoFile = document.getElementById('newActPhoto').files[0];
  const emoji = document.getElementById('newActEmoji').value.trim() || '⭐';
  if(!name||!sched) { showToast('Preencha nome e horário','error'); return; }
  const colors = ['#06d6a0','#ef476f','#118ab2','#ffd166','#073b4c'];
  const color = colors[appState.activities.length % colors.length];
  
  const newActivity = {
    id:'ac'+Date.now(), emoji, color,
    title_pt:name, title_en:name, title_es:name,
    schedule_pt:sched, schedule_en:sched, schedule_es:sched,
    desc_pt:desc, desc_en:desc, desc_es:desc,
    audience_pt:'Todos', audience_en:'All', audience_es:'Todos',
    where_pt:'UBS', where_en:'UBS', where_es:'UBS', visible:true,
    photo: null
  };
  
  if(photoFile) {
    const reader = new FileReader();
    reader.onload = (e) => {
      newActivity.photo = e.target.result;
      appState.activities.push(newActivity);
      saveState();
      hideNewActivityForm();
      showToast(t('save'),'success');
      renderAdminCommunity();
    };
    reader.readAsDataURL(photoFile);
  } else {
    appState.activities.push(newActivity);
    saveState();
    hideNewActivityForm();
    showToast(t('save'),'success');
    renderAdminCommunity();
  }
}

/* ─── ADMIN ALERTS ─── */
function renderAdminAlerts() {
  const list = document.getElementById('adminAlertList');
  list.innerHTML = appState.alerts.map(a => `
    <div class="alert-admin-item" onclick="editAlert('${a.id}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter')editAlert('${a.id}')">
      <div class="alert-admin-hdr">
        <span class="badge ${a.active?'badge-green':'badge-gray'}">${a.active?'Ativo':'Inativo'}</span>
        <label class="toggle-switch" aria-label="Ativar/Desativar alerta">
          <input type="checkbox" ${a.active?'checked':''} onchange="toggleAlert('${a.id}')">
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="alert-admin-text">${lang==='pt'?a.text_pt:lang==='en'?a.text_en:a.text_es}</div>
      <div class="alert-admin-meta"><i class="fa-regular fa-clock" style="margin-right:4px"></i>${t('activeUntil')} ${a.until} · Criado: ${a.createdAt}</div>
    </div>`).join('') || `<div class="empty"><p>${t('noAlerts')}</p></div>`;
}
function toggleAlert(id) {
  const a = appState.alerts.find(x=>x.id===id);
  if(a) { a.active=!a.active; saveState(); renderAdminAlerts(); }
}
function showNewAlertForm() { document.getElementById('adminAlertForm').classList.remove('hidden'); document.getElementById('newAlertMsg').focus(); }
function hideNewAlertForm() { document.getElementById('adminAlertForm').classList.add('hidden'); }
function saveNewAlert() {
  const msg = document.getElementById('newAlertMsg').value.trim();
  const days = parseInt(document.getElementById('newAlertDuration').value);
  if(!msg) { showToast('Digite uma mensagem','error'); return; }
  const until = new Date(); until.setDate(until.getDate()+days);
  const fmt = d => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  appState.alerts.push({
    id:'al'+Date.now(), text_pt:msg, text_en:msg, text_es:msg,
    active:true, until:fmt(until), createdAt:fmt(new Date())
  });
  saveState();
  hideNewAlertForm();
  showToast(t('save'),'success');
  renderAdminAlerts();
}

/* ─── APPLY EVERYTHING ─── */
function applyAll() {
  applyTheme();
  applyFont();
  applyLang();
  applyContrast();
}

/* ─── EVENT LISTENERS ─── */
['themeToggle','themeToggleLogin'].forEach(id => {
  const el = document.getElementById(id);
  if(el) el.addEventListener('click', () => { darkMode=!darkMode; applyAll(); });
});
['contrastToggle','contrastToggleLogin'].forEach(id => {
  const el = document.getElementById(id);
  if(el) el.addEventListener('click', () => { highContrast = !highContrast; applyAll(); });
});
['fontSlider','fontSliderLogin'].forEach(id => {
  const el = document.getElementById(id);
  if(el) el.addEventListener('input', e => { fontScale=parseInt(e.target.value); applyAll(); });
});
['langSelect','langSelectLogin'].forEach(id => {
  const el = document.getElementById(id);
  if(el) el.addEventListener('change', e => { lang=e.target.value; applyAll(); if(currentRole==='citizen') renderCitizenScreen(currentCitizenNav); else if(currentRole==='admin') renderAdminScreen(currentAdminNav); });
});

// Keyboard close for cancel modal
document.addEventListener('keydown', e => {
  if(e.key==='Escape') {
    if(!document.getElementById('cancelModal').classList.contains('hidden')) closeCancelModal();
    if(!document.getElementById('pinModal').classList.contains('hidden')) closePinModal();
  }
});

// Stub functions for new admin features
function editAlert(id) {
  const a = appState.alerts.find(x => x.id === id);
  if(!a) return;
  const content = document.getElementById('adminAlertEditContent');
  content.innerHTML = `
    <div class="card" style="margin-bottom:10px">
      <div style="font-weight:700;font-size:.9rem;margin-bottom:12px">${t('editAlert')}</div>
      <div class="form-group"><label class="form-label" data-t="alertMessage"></label><textarea class="form-textarea" id="editAlertMsg" rows="3">${lang==='pt'?a.text_pt:lang==='en'?a.text_en:a.text_es}</textarea></div>
      <div class="form-group"><label class="form-label" data-t="status"></label><select class="form-select" id="editAlertStatus">
        <option value="active" ${a.active ? 'selected' : ''}>${t('active')}</option>
        <option value="inactive" ${!a.active ? 'selected' : ''}>${t('inactive')}</option>
      </select></div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-outline btn-sm" onclick="adminNav('alerts')" style="flex:1" data-t="cancel"></button>
        <button class="btn btn-pink btn-sm" onclick="saveEditedAlert('${id}')" style="flex:1"><i class="fa-solid fa-check"></i> <span data-t="save"></span></button>
      </div>
    </div>`;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('sc-admin-alert-edit').classList.add('active');
}
function saveEditedAlert(id) {
  const a = appState.alerts.find(x => x.id === id);
  if(!a) return;
  const msg = document.getElementById('editAlertMsg').value.trim();
  const status = document.getElementById('editAlertStatus').value;
  if(!msg) { showToast('Digite uma mensagem', 'error'); return; }
  a.text_pt = msg; a.text_en = msg; a.text_es = msg;
  a.active = status === 'active';
  saveState();
  showToast(t('save'), 'success');
  adminNav('alerts');
}

function viewAptDetail(id) {
  const apt = appState.adminAppointments.find(a => a.id === id);
  if(!apt || (apt.status === 'canceled' && apt.canceledByPatient)) return;
  editAdminAppointment(id);
}
function editAdminAppointment(id) {
  const apt = appState.adminAppointments.find(a => a.id === id);
  if(!apt) return;
  const isEditable = apt.status !== 'canceled' && new Date(apt.date) > new Date();
  const content = document.getElementById('adminAptEditContent');
  content.innerHTML = `
    <div class="card" style="margin-bottom:10px">
      <div style="font-weight:700;font-size:.9rem;margin-bottom:12px">${t('editAppointment')}</div>
      <div class="form-group"><label class="form-label" data-t="patient"></label><input type="text" class="form-input" id="editAptPatient" value="${apt.patientId}" ${!isEditable ? 'disabled' : ''} /></div>
      <div class="form-group"><label class="form-label" data-t="type"></label><input type="text" class="form-input" id="editAptType" value="${apt.type_pt}" ${!isEditable ? 'disabled' : ''} /></div>
      <div class="form-group"><label class="form-label" data-t="date"></label><input type="text" class="form-input" id="editAptDate" value="${apt.date}" ${!isEditable ? 'disabled' : ''} /></div>
      <div class="form-group"><label class="form-label" data-t="time"></label><input type="text" class="form-input" id="editAptTime" value="${apt.time}" ${!isEditable ? 'disabled' : ''} /></div>
      <div class="form-group"><label class="form-label" data-t="professional"></label><input type="text" class="form-input" id="editAptProf" value="${apt.professional}" ${!isEditable ? 'disabled' : ''} /></div>
      ${!isEditable ? `<div class="empty"><p>${apt.status === 'canceled' ? t('appointmentCanceled') : t('appointmentInPast')}</p></div>` : ''}
      <div style="display:flex;gap:8px">
        <button class="btn btn-outline btn-sm" onclick="adminNav('appointments')" style="flex:1" data-t="cancel"></button>
        ${isEditable ? `<button class="btn btn-emerald btn-sm" onclick="saveEditedApt('${id}')" style="flex:1"><i class="fa-solid fa-check"></i> <span data-t="save"></span></button>` : ''}
      </div>
    </div>`;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('sc-admin-apt-edit').classList.add('active');
}
function saveEditedApt(id) {
  const apt = appState.adminAppointments.find(a => a.id === id);
  if(!apt) return;
  apt.patientId = document.getElementById('editAptPatient').value.trim();
  apt.type_pt = document.getElementById('editAptType').value.trim();
  apt.date = document.getElementById('editAptDate').value.trim();
  apt.time = document.getElementById('editAptTime').value.trim();
  apt.professional = document.getElementById('editAptProf').value.trim();
  saveState();
  showToast(t('save'), 'success');
  adminNav('appointments');
}

function generateAptReport() {
  showToast('Relatório de consultas gerado - em desenvolvimento', 'info');
}
function generateActivityReport() {
  showToast('Relatório de atividades gerado - em desenvolvimento', 'info');
}
function generateAlertReport() {
  showToast('Relatório de alertas gerado - em desenvolvimento', 'info');
}
