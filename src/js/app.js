/* PNIGT-FS Prototype (HTML/CSS/JS seulement)
   - Routing client-side via templates existants dans index.html
   - Data mock local
   - Table/filters, fiche agent, affectations, grades, vérification rapide, audit, admin
   - Theme dark mode persist (localStorage)
*/

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = {
    theme: 'light',
    authed: false,
    authedUser: null,
    authedRole: null,
    selectedAgentId: null,
  };

  // --- Users / Auth (mock) -----------------------------------------------
  // Démo : on vérifie un utilisateur admin via 2FA (code mock)
  const mockUsers = [
    {
      id: 'U-ADMIN',
      login: 'admin@pnigt-fs.ci',
      matricule: 'ADMIN-0001',
      role: 'ADMIN',
      // Mot de passe mock (UI uniquement)
      password: 'admin123',
    },
  ];

  // --- Mock data -----------------------------------------------------------
  const mockAgents = [
    {
      id: 'A-103221',
      matricule: 'CI-103221',
      nom: 'Kouassi',
      prenom: 'Amadou',
      grade: 'Lieutenant',
      corps: 'Police',
      statut: 'Actif',
      region: 'Abidjan',
      unite: 'Brigade de Sécurité Urbaine',
      dateEntree: '2016-09-12',
      photoEmoji: '👤',
      sexe: 'Masculin',
      nationalite: 'Ivoirienne',
      naissance: '1990-03-22',
      telephone: '+225 01 23 45 67',
      email: 'amadou.kouassi@exemple.gouv.ci',
      situationFamiliale: 'Marié',
      etatCivil: 'Acte valide',
      conjoint: 'Aïssatou Kouassi',
      enfants: '2',
      formations: ['École Nationale de Police (ENP)', 'Formation Nouvelles Technologies'],
      diplomes: ['Licence en Droit', 'Certificat Cyber-Sécurité'],
      certifications: ['Attestation Tir', 'Certificat Contrôle d’accès'],
      grades: [
        { libelle: 'Elève', date: '2012-07-01', decision: 'DEC/ENP/2012/019' },
        { libelle: 'Sous-officier', date: '2014-08-15', decision: 'DEC/GRD/2014/044' },
        { libelle: 'Lieutenant', date: '2018-01-10', decision: 'DEC/GRD/2018/003' },
      ],
      timeline: [
        { type: 'Recrutement', date: '2012-07-01', detail: 'Intégration école de formation' },
        { type: 'Promotion', date: '2014-08-15', detail: 'Accès grade Sous-officier' },
        { type: 'Affectation', date: '2016-09-12', detail: 'Brigade de Sécurité Urbaine' },
        { type: 'Promotion', date: '2018-01-10', detail: 'Accès grade Lieutenant' },
      ],
    },
    {
      id: 'A-090144',
      matricule: 'CI-090144',
      nom: 'Traoré',
      prenom: 'Koffi',
      grade: 'Capitaine',
      corps: 'Police',
      statut: 'Actif',
      region: 'Centre',
      unite: 'Direction Opérations — Zone Centre',
      dateEntree: '2013-05-04',
      photoEmoji: '👮',
      sexe: 'Masculin',
      nationalite: 'Ivoirienne',
      naissance: '1988-11-10',
      telephone: '+225 07 55 12 34',
      email: 'koffi.traore@exemple.gouv.ci',
      situationFamiliale: 'Célibataire',
      etatCivil: 'Acte valide',
      conjoint: '—',
      enfants: '0',
      formations: ['École Nationale de Police (ENP)', 'Formation Lutte contre Criminalité'],
      diplomes: ['BTS Sécurité', 'Certificat Management'],
      certifications: ['Certificat Procédures', 'Attestation Interventions'],
      grades: [
        { libelle: 'Sous-officier', date: '2015-02-20', decision: 'DEC/GRD/2015/021' },
        { libelle: 'Capitaine', date: '2020-09-01', decision: 'DEC/GRD/2020/012' },
      ],
      timeline: [
        { type: 'Recrutement', date: '2013-05-04', detail: 'Entrée en formation' },
        { type: 'Affectation', date: '2015-02-20', detail: 'Unité de soutien opérations' },
        { type: 'Promotion', date: '2020-09-01', detail: 'Accès grade Capitaine' },
      ],
    },
    {
      id: 'A-011900',
      matricule: 'CI-011900',
      nom: 'Diomandé',
      prenom: 'Yao',
      grade: 'Sous-officier',
      corps: 'Gendarmerie',
      statut: 'Non actif',
      region: 'Ouest',
      unite: 'Gendarmerie Territoriale — Ouest',
      dateEntree: '2009-03-01',
      photoEmoji: '🧑‍✈️',
      sexe: 'Masculin',
      nationalite: 'Ivoirienne',
      naissance: '1980-06-17',
      telephone: '+225 05 22 11 90',
      email: 'yao.diomande@exemple.gouv.ci',
      situationFamiliale: 'Marié',
      etatCivil: 'Acte valide',
      conjoint: 'Marié',
      enfants: '3',
      formations: ['École de Gendarmerie', 'Formation Judiciaire'],
      diplomes: ['Licence en Sécurité', 'Certificat Enquêtes'],
      certifications: ['Certificat Rédaction rapports'],
      grades: [
        { libelle: 'Elève', date: '2009-03-01', decision: 'DEC/GND/2009/010' },
        { libelle: 'Sous-officier', date: '2014-04-05', decision: 'DEC/GND/2014/051' },
      ],
      timeline: [
        { type: 'Recrutement', date: '2009-03-01', detail: 'Entrée en école' },
        { type: 'Affectation', date: '2014-04-05', detail: 'Gendarmerie Territoriale — Ouest' },
        { type: 'Départ à la retraite', date: '2025-01-20', detail: 'Radiation après retraite' },
      ],
    },
  ];

  const mockAffectations = {
    'A-103221': [
      { unite: 'École Nationale de Police', fonction: 'Élève', debut: '2012-07-01', fin: '2016-09-11', sante: 'OK', groupe: 'O+', aptitude: 'A', derniere: '2024-06-12', documents: 'ID, Dossiers' },
      { unite: 'Brigade de Sécurité Urbaine', fonction: 'Enquêteur', debut: '2016-09-12', fin: '', sante: 'OK', groupe: 'O+', aptitude: 'A', derniere: '2024-06-12', documents: 'ID, Dossiers' },
    ],
    'A-090144': [
      { unite: 'Unité de soutien opérations', fonction: 'Officier', debut: '2013-05-04', fin: '2020-08-31', sante: 'OK', groupe: 'A+', aptitude: 'A', derniere: '2024-01-18', documents: 'ID' },
      { unite: 'Direction Opérations — Zone Centre', fonction: 'Chef de section', debut: '2020-09-01', fin: '', sante: 'OK', groupe: 'A+', aptitude: 'A', derniere: '2024-01-18', documents: 'ID' },
    ],
    'A-011900': [
      { unite: 'Gendarmerie Territoriale — Ouest', fonction: 'Officier', debut: '2014-04-05', fin: '2025-01-20', sante: 'OK', groupe: 'B+', aptitude: 'B', derniere: '2023-12-03', documents: 'ID' },
    ],
  };

  const mockAudit = Array.from({ length: 24 }).map((_, i) => {
    const types = ['Consultation', 'Modification', 'Suppression', 'Export'];
    const users = ['Admin', 'RH-Abidjan', 'Auditeur-IT', 'Opérations'];
    const type = types[i % types.length];
    const user = users[i % users.length];
    return {
      id: `AU-${i + 1}`,
      utilisateur: user,
      action: `${type} • PNIGT-FS`,
      date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
      heure: `${String((i * 3) % 24).padStart(2, '0')}:${String((i * 11) % 60).padStart(2, '0')}`,
      ip: `192.168.${10 + (i % 30)}.${20 + (i % 50)}`,
      operationType: type,
    };
  });

  // --- Basic helpers -------------------------------------------------------
  function toast(msg, kind = 'info') {
    const container = $('#toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `toast toast--${kind}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => {
      el.classList.add('toast--out');
      setTimeout(() => el.remove(), 450);
    }, 2400);
  }

  function setTheme(theme) {
    state.theme = theme;
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('pnigtfs_theme', theme);
    } catch (_) {}

    const btn = $('#btn-theme');
    if (btn) btn.textContent = theme === 'dark' ? '☀️ Mode clair' : '🌙 Mode sombre';
  }

  function openModal(modalId) {
    const backdrop = $('#modal-backdrop');
    const modal = $(`#${modalId}`);
    if (!modal) return;
    if (backdrop) backdrop.hidden = false;
    modal.hidden = false;
    modal.setAttribute('data-open', '1');
  }

  function closeModal(modalId) {
    const backdrop = $('#modal-backdrop');
    const modal = $(`#${modalId}`);
    if (!modal) return;
    if (backdrop) backdrop.hidden = true;
    modal.hidden = true;
    modal.removeAttribute('data-open');
  }

  // --- Routing / Rendering -------------------------------------------------
  const routes = {
    dashboard: { template: 'tpl-dashboard' },
    agents: { template: 'tpl-agents' },
    affectations: { template: 'tpl-affectations' },
    grades: { template: 'tpl-grades' },
    formations: { template: 'tpl-dashboard', note: 'Formations (mock) réutilise dashboard pour prototype.' },
    sante: { template: 'tpl-dashboard', note: 'Santé (mock) réutilise dashboard pour prototype.' },
    documents: { template: 'tpl-dashboard', note: 'Documents (mock) réutilise dashboard pour prototype.' },
    stats: { template: 'tpl-stats' },
    audit: { template: 'tpl-audit' },
    admin: { template: 'tpl-admin' },
    verify: { template: 'tpl-quick-verify' },
  };

  function renderScreen(routeKey) {
    const page = $('#page');
    if (!page) return;

    const tplId = routes[routeKey]?.template;
    const tpl = tplId ? document.getElementById(tplId) : null;
    if (!tpl) {
      page.innerHTML = `<div class="panel"><h3>Écran indisponible</h3><p class="muted">Route: ${routeKey}</p></div>`;
      return;
    }

    page.innerHTML = '';
    page.appendChild(tpl.content.cloneNode(true));

    // post-render hooks
    switch (routeKey) {
      case 'dashboard':
        renderDashboard();
        break;
      case 'agents':
        renderAgents();
        break;
      case 'affectations':
        renderAffectations();
        break;
      case 'grades':
        renderGrades();
        break;
      case 'stats':
        renderStats();
        break;
      case 'audit':
        renderAudit();
        break;
      case 'admin':
        renderAdmin();
        break;
      default:
        break;
    }

    // Ensure top active nav
    $$('.nav__item', document).forEach((a) => {
      a.classList.toggle('nav__item--active', a.dataset.nav === routeKey);
    });
  }

  function navFromHash() {
    const h = (location.hash || '').replace('#', '').trim();
    return h || 'dashboard';
  }

  function applyNavigation() {
    const key = navFromHash();
    renderScreen(key);
  }

  // --- Screen: dashboard --------------------------------------------------
  function renderDashboard() {
    // bind stats
    const totals = {
      totalAgents: mockAgents.length,
      activeAgents: mockAgents.filter(a => a.statut === 'Actif').length,
      policiers: mockAgents.filter(a => a.corps === 'Police').length,
      gendarmes: mockAgents.filter(a => a.corps === 'Gendarmerie').length,
      retirement: 3, // mock
      affectationsEnCours: mockAgents.filter(a => {
        const list = mockAffectations[a.id] || [];
        const last = list[list.length - 1];
        return !!last && !last.fin;
      }).length,
    };

    $('[data-bind="totalAgents"]')?.replaceChildren(document.createTextNode(totals.totalAgents));
    $('[data-bind="activeAgents"]')?.replaceChildren(document.createTextNode(totals.activeAgents));
    $('[data-bind="policiers"]')?.replaceChildren(document.createTextNode(totals.policiers));
    $('[data-bind="gendarmes"]')?.replaceChildren(document.createTextNode(totals.gendarmes));
    $('[data-bind="retirement"]')?.replaceChildren(document.createTextNode(totals.retirement));
    $('[data-bind="affectationsEnCours"]')?.replaceChildren(document.createTextNode(totals.affectationsEnCours));

    // recent activity already in template as mock
  }

  // --- Screen: agents -----------------------------------------------------
  function renderAgents() {
    const tbody = $('#agents-tbody');
    if (!tbody) return;

    const region = $('#filter-region');
    const grade = $('#filter-grade');
    const status = $('#filter-status');
    const body = $('#filter-body');

    const btnReset = $('#agents-reset');
    const btnExport = $('#agents-export');
    const btnAdd = $('#agents-add');

    const filters = {
      region: '',
      grade: '',
      status: '',
      body: '',
    };

    function normalizeStatus(s) {
      if (!s) return '';
      if (s === 'Non actif') return 'Non actif';
      return s;
    }

    function applyFilters() {
      const q = getGlobalSearch();
      const list = mockAgents.filter((a) => {
        const matchRegion = filters.region ? a.region === filters.region : true;
        const matchGrade = filters.grade ? a.grade === filters.grade : true;
        const matchStatus = filters.status ? a.statut === normalizeStatus(filters.status) : true;
        const matchBody = filters.body ? a.corps === filters.body : true;

        if (!matchRegion || !matchGrade || !matchStatus || !matchBody) return false;
        if (!q) return true;
        const hay = `${a.matricule} ${a.nom} ${a.prenom} ${a.unite} ${a.grade}`.toLowerCase();
        return hay.includes(q);
      });
      tbody.innerHTML = '';

      if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="11" class="muted">Aucun agent ne correspond.</td></tr>`;
        return;
      }

      list.forEach((a) => {
        const tr = document.createElement('tr');

        const statusBadge = a.statut === 'Actif'
          ? `<span class="badge badge--green">Agent en activité</span>`
          : `<span class="badge badge--red">Agent non actif</span>`;

        tr.innerHTML = `
          <td class="cell-photo">${a.photoEmoji}</td>
          <td><span class="mono">${a.matricule}</span></td>
          <td>${a.nom}</td>
          <td>${a.prenom}</td>
          <td>${a.grade}</td>
          <td>${a.corps}</td>
          <td>${statusBadge}</td>
          <td>${a.unite}</td>
          <td>${a.dateEntree}</td>
          <td>
            <div class="row gap">
              <button class="btn btn--small btn--ghost" data-action="edit" data-agent="${a.id}">Modifier</button>
              <button class="btn btn--small btn--ghost" data-action="archive" data-agent="${a.id}">Archiver</button>
              <button class="btn btn--small btn--primary" data-action="detail" data-agent="${a.id}">Fiche</button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });

      // row actions
      $$('button[data-action]', tbody).forEach((btn) => {
        btn.addEventListener('click', () => {
          const action = btn.dataset.action;
          const agentId = btn.dataset.agent;
          if (action === 'detail') {
            state.selectedAgentId = agentId;
            renderAgentDetailAndRoute(agentId);
          } else if (action === 'edit') {
            toast('Modification (mock) — non persistante.', 'info');
          } else if (action === 'archive') {
            toast('Archivage (mock) — non persistante.', 'warning');
          }
        });
      });
    }

    function wireInputs() {
      if (region) region.addEventListener('change', () => { filters.region = region.value; applyFilters(); });
      if (grade) grade.addEventListener('change', () => { filters.grade = grade.value; applyFilters(); });
      if (status) status.addEventListener('change', () => { filters.status = status.value; applyFilters(); });
      if (body) body.addEventListener('change', () => { filters.body = body.value; applyFilters(); });

      if (btnReset) btnReset.addEventListener('click', (e) => {
        e.preventDefault();
        if (region) region.value = '';
        if (grade) grade.value = '';
        if (status) status.value = '';
        if (body) body.value = '';
        filters.region = filters.grade = filters.status = filters.body = '';
        applyFilters();
      });

      if (btnExport) btnExport.addEventListener('click', (e) => {
        e.preventDefault();
        toast('Export PDF (mock) — simulation prête.', 'success');
      });

      if (btnAdd) btnAdd.addEventListener('click', () => {
        toast('Ajouter agent (mock) — formulaire non implémenté.', 'info');
      });
    }

    wireInputs();
    applyFilters();
  }

  function getGlobalSearch() {
    const el = $('#global-search');
    return el ? el.value.trim().toLowerCase() : '';
  }

  function renderAgentDetailAndRoute(agentId) {
    // Route detail: use template tpl-agent-detail
    const agent = mockAgents.find(a => a.id === agentId);
    const page = $('#page');
    if (!agent || !page) {
      toast('Agent introuvable.', 'warning');
      return;
    }

    const tpl = document.getElementById('tpl-agent-detail');
    if (!tpl) return;
    page.innerHTML = '';
    page.appendChild(tpl.content.cloneNode(true));

    // Bind data
    const photo = $('#agent-photo');
    if (photo) photo.textContent = agent.photoEmoji;
    $('#agent-nom')?.replaceChildren(document.createTextNode(agent.nom));
    $('#agent-prenom')?.replaceChildren(document.createTextNode(agent.prenom));
    $('#agent-matricule')?.replaceChildren(document.createTextNode(agent.matricule));
    $('#agent-entree')?.replaceChildren(document.createTextNode(agent.dateEntree));

    const badge = agent.statut === 'Actif'
      ? `<span class="badge badge--green">Agent en activité</span>`
      : `<span class="badge badge--red">Agent non actif</span>`;
    const badgesWrap = $('#agent-badges');
    if (badgesWrap) badgesWrap.innerHTML = badge;

    $('#agent-dn')?.replaceChildren(document.createTextNode(agent.naissance));
    $('#agent-sexe')?.replaceChildren(document.createTextNode(agent.sexe));
    $('#agent-nationalite')?.replaceChildren(document.createTextNode(agent.nationalite));
    $('#agent-tel')?.replaceChildren(document.createTextNode(agent.telephone));
    $('#agent-email')?.replaceChildren(document.createTextNode(agent.email));
    $('#agent-famille')?.replaceChildren(document.createTextNode(agent.situationFamiliale));
    $('#agent-etatcivil')?.replaceChildren(document.createTextNode(agent.etatCivil));
    $('#agent-conjoint')?.replaceChildren(document.createTextNode(agent.conjoint));
    $('#agent-enfants')?.replaceChildren(document.createTextNode(agent.enfants));

    // lists
    const mkList = (items) => items.map(it => `<div class="list-row"><span class="dot dot--orange"></span><span>${it}</span></div>`).join('');
    $('#agent-formations') && ($('#agent-formations').innerHTML = mkList(agent.formations));
    $('#agent-diplomes') && ($('#agent-diplomes').innerHTML = mkList(agent.diplomes));
    $('#agent-grades') && ($('#agent-grades').innerHTML = agent.grades.map(g => {
      return `<div class="list-row">
        <span class="badge badge--blue">${g.libelle}</span>
        <span class="muted">${g.date}</span>
        <div class="muted">${g.decision}</div>
      </div>`;
    }).join(''));

    const tl = $('#agent-timeline');
    if (tl) {
      tl.innerHTML = agent.timeline.map(item => {
        const cls = item.type.includes('retraite') || item.type.includes('Retraite') ? 'badge--red' : 'badge--green';
        return `
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="row gap align-center">
                <span class="badge ${cls}">${item.type}</span>
                <span class="muted">${item.date}</span>
              </div>
              <div>${item.detail}</div>
            </div>
          </div>
        `;
      }).join('');
    }

    // tabs
    $$('.tab', page).forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        $$('.tab', page).forEach(b => b.classList.toggle('tab--active', b === btn));
        $$('.tab-panel', page).forEach(p => p.classList.toggle('tab-panel--active', p.dataset.panel === tab));
      });
    });

    // Affecter button => route affectations
    $$('button[data-action="route"]', page).forEach((btn) => {
      btn.addEventListener('click', () => {
        location.hash = btn.dataset.route || 'affectations';
        // ensure selected agent persists
        state.selectedAgentId = agentId;
      });
    });
  }

  // --- Screen: affectations ----------------------------------------------
  function renderAffectations() {
    const agentSel = $('#aff-agent');
    const oldInput = $('#aff-old');
    const form = $('#affectation-form');
    const history = $('#aff-history');
    const agentId = state.selectedAgentId;

    if (!agentSel || !history || !form) return;

    agentSel.innerHTML = '<option value="">Choisir…</option>' +
      mockAgents.map(a => `<option value="${a.id}">${a.matricule} — ${a.nom} ${a.prenom}</option>`).join('');

    function getAgentLastUnit(id) {
      const list = mockAffectations[id] || [];
      if (!list.length) return '—';
      const last = list[list.length - 1];
      return last.unite || '—';
    }

    function renderHistory(id) {
      const list = mockAffectations[id] || [];
      history.innerHTML = list.length
        ? list.map(it => {
          const end = it.fin ? it.fin : 'En cours';
          return `
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="row gap align-center">
                  <span class="badge badge--orange">Affectation</span>
                  <span class="muted">${it.debut} → ${end}</span>
                </div>
                <div><b>${it.unite}</b> — ${it.fonction}</div>
                <div class="muted">Santé: ${it.sante} • Groupe: ${it.groupe} • Aptitude: ${it.aptitude} • Dernière visite: ${it.derniere}</div>
                <div class="muted">Documents: ${it.documents}</div>
              </div>
            </div>
          `;
        }).join('')
        : `<div class="muted">Aucune affectation (mock).</div>`;
    }

    agentSel.value = agentId && mockAgents.some(a => a.id === agentId) ? agentId : '';

    function syncFromSelection() {
      const id = agentSel.value;
      const agent = mockAgents.find(a => a.id === id);
      oldInput.value = id ? getAgentLastUnit(id) : '';
      renderHistory(id);
    }

    agentSel.addEventListener('change', syncFromSelection);
    syncFromSelection();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = agentSel.value;
      if (!id) return toast('Sélectionnez un agent.', 'warning');
      const old = oldInput.value;
      const newUnit = $('#aff-new').value.trim();
      const func = $('#aff-func').value.trim();
      const date = $('#aff-date').value;

      if (!newUnit || !func || !date) return toast('Champs obligatoires requis.', 'warning');

      toast(`Validation affectation (mock) : ${old} → ${newUnit}`, 'success');
      // mock only: append to history locally
      const list = mockAffectations[id] || (mockAffectations[id] = []);

      const last = list[list.length - 1];
      if (last && !last.fin) last.fin = date; // close last
      list.push({
        unite: newUnit,
        fonction: func,
        debut: date,
        fin: '',
        sante: 'OK',
        groupe: last?.groupe || 'O+',
        aptitude: last?.aptitude || 'A',
        derniere: new Date().toISOString().slice(0, 10),
        documents: 'ID, Dossiers',
      });
      syncFromSelection();
      form.reset();
      oldInput.value = getAgentLastUnit(id);
    });

    // Keep selected agent when clicking cancel in top bar
    $$('button', form.parentElement).forEach((b) => {
      if (b.textContent.includes('Annuler')) {
        b.addEventListener('click', () => toast('Annulation (mock).', 'info'));
      }
    });
  }

  // --- Screen: grades -----------------------------------------------------
  function renderGrades() {
    const selAgent = $('#grade-agent');
    const selGrade = $('#grade-new');
    const dateEl = $('#grade-date');
    const form = $('#grade-form');
    const hist = $('#grade-history');

    if (!selAgent || !form || !hist) return;

    selAgent.innerHTML = mockAgents.map(a => `<option value="${a.id}">${a.matricule} — ${a.nom} ${a.prenom}</option>`).join('');

    function renderHistoryForAgent(id) {
      const agent = mockAgents.find(a => a.id === id);
      if (!agent) {
        hist.innerHTML = `<div class="muted">Choisissez un agent.</div>`;
        return;
      }
      hist.innerHTML = agent.grades.length
        ? agent.grades.map(g => `
          <div class="list-row">
            <span class="badge badge--blue">${g.libelle}</span>
            <div>
              <div><b class="mono">${g.decision}</b></div>
              <div class="muted">${g.date}</div>
            </div>
          </div>
        `).join('')
        : `<div class="muted">Aucun historique (mock).</div>`;
    }

    const defaultId = state.selectedAgentId && mockAgents.some(a => a.id === state.selectedAgentId)
      ? state.selectedAgentId
      : mockAgents[0]?.id;

    selAgent.value = defaultId || '';
    renderHistoryForAgent(selAgent.value);

    selAgent.addEventListener('change', () => renderHistoryForAgent(selAgent.value));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const agentId = selAgent.value;
      const agent = mockAgents.find(a => a.id === agentId);
      if (!agent) return toast('Sélectionnez un agent.', 'warning');

      const newGrade = selGrade.value;
      const date = dateEl.value || new Date().toISOString().slice(0, 10);
      const decision = `DEC/GRD/${date.replaceAll('-', '')}/${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`;

      agent.grades.push({ libelle: newGrade, date, decision });
      agent.grade = newGrade;

      toast('Validation hiérarchique (mock) — promotion enregistrée localement.', 'success');
      dateEl.value = '';
      renderHistoryForAgent(agentId);
    });
  }

  // --- Screen: stats ------------------------------------------------------
  function renderStats() {
    // Charts are already static in template; we add a tiny hover hint.
    const chips = $$('.chip');
    chips.forEach(c => c.title = 'Données simulées pour prototype');
  }

  // --- Screen: audit ------------------------------------------------------
  function renderAudit() {
    const tbody = $('#audit-tbody');
    const typeEl = $('#audit-type');
    const periodEl = $('#audit-period');
    const btnRefresh = $('#audit-refresh');
    const btnExport = $('#audit-export');
    if (!tbody || !typeEl || !periodEl) return;

    function render() {
      const days = parseInt(periodEl.value, 10) || 30;
      const now = Date.now();
      const start = now - days * 86400000;

      const qType = typeEl.value;
      const filtered = mockAudit.filter(row => {
        const t = new Date(row.date).getTime();
        const okDate = t >= start;
        const okType = qType ? row.operationType === qType : true;
        return okDate && okType;
      });

      tbody.innerHTML = filtered.map(r => `
        <tr>
          <td>${r.utilisateur}</td>
          <td class="muted">${r.action}</td>
          <td>${r.date}</td>
          <td>${r.heure}</td>
          <td class="mono">${r.ip}</td>
          <td><span class="badge badge--blue">${r.operationType}</span></td>
        </tr>
      `).join('');
    }

    typeEl.addEventListener('change', render);
    periodEl.addEventListener('change', render);

    if (btnRefresh) btnRefresh.addEventListener('click', (e) => { e.preventDefault(); toast('Audit rafraîchi (mock).', 'info'); render(); });
    if (btnExport) btnExport.addEventListener('click', (e) => { e.preventDefault(); toast('Export audit (mock).', 'success'); });

    render();
  }

  // --- Screen: admin ------------------------------------------------------
  function renderAdmin() {
    const users = $('#admin-users');
    const roles = $('#admin-roles');
    if (!users || !roles) return;

    users.innerHTML = [
      { u: 'Admin', role: 'Superviseur', status: 'Actif' },
      { u: 'RH-Abidjan', role: 'RH', status: 'Actif' },
      { u: 'Auditeur-IT', role: 'Audit', status: 'Actif' },
    ].map(x => `
      <div class="list-row">
        <span class="badge badge--green">${x.status}</span>
        <div>
          <div><b>${x.u}</b></div>
          <div class="muted">Rôle: ${x.role}</div>
        </div>
      </div>
    `).join('');

    roles.innerHTML = [
      { r: 'Superviseur', p: 'Accès complet' },
      { r: 'RH', p: 'Agents, Affectations, Grades' },
      { r: 'Audit', p: 'Audit, Export journal' },
    ].map(x => `
      <div class="list-row">
        <span class="badge badge--blue">${x.r}</span>
        <div class="muted">${x.p}</div>
      </div>
    `).join('');
  }

  // --- Global search ------------------------------------------------------
  function wireGlobalSearch() {
    const gs = $('#global-search');
    if (!gs) return;
    gs.addEventListener('input', () => {
      // only agents screen uses it in this prototype
      if (navFromHash() === 'agents') renderAgents();
      toast('Recherche (filtre mock) appliquée.', 'info');
      // avoid spamming: in a real app, we'd debounce and not toast.
    });
  }

  // --- Login flow (mock 2FA) ---------------------------------------------
  function wireLogin() {
    const form = $('#login-form');
    const btnDemo = $('#btn-demo');
    const btnLogin = $('#btn-login');

    if (!form) return;

    const modalId = 'modal-2fa';
    const inputs = [];
    const codeWrap = $('#modal-2fa');
    if (codeWrap) {
      $$('.code-input', codeWrap).forEach((i) => inputs.push(i));
      inputs.forEach((inp, idx) => {
        inp.addEventListener('input', () => {
          const v = inp.value.trim();
          if (v && idx < inputs.length - 1) inputs[idx + 1].focus();
        });
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && !inp.value && idx > 0) inputs[idx - 1].focus();
        });
      });
    }

    $$('.modal [data-modal-close], .modal-backdrop').forEach(el => {
      el.addEventListener('click', () => {
        closeModal(modalId);
      });
    });

    const verifyBtn = $('#btn-2fa-verify');
    if (verifyBtn) {
      verifyBtn.addEventListener('click', () => {
        const code = inputs.map(i => (i.value || '').trim()).join('');
        if (code !== '123456') {
          toast('Code 2FA incorrect. Essayez 123456.', 'warning');
          return;
        }

        // --- Création utilisateur admin pour 2FA (mock) ---
        // Ici on considère que l’utilisateur admin existe déjà en démo.
        const adminUser = mockUsers.find(u => u.role === 'ADMIN');
        state.authed = true;
        state.authedUser = adminUser || null;
        state.authedRole = adminUser?.role || 'ADMIN';
        sessionStorage.setItem('pnigtfs_authed', '1');
        sessionStorage.setItem('pnigtfs_role', state.authedRole || 'ADMIN');

        closeModal(modalId);
        // Force navigation (some browsers may not trigger hashchange if hash already set)
        $('#screen-login').hidden = true;
        $('#screen-app').hidden = false;
        location.hash = 'dashboard';
        renderScreen('dashboard');
        toast('Connexion admin réussie (mock 2FA).', 'success');
        // cleanup
        inputs.forEach(i => i.value = '');
      });
    }

    if (btnDemo) {
      btnDemo.addEventListener('click', () => {
        $('#login-id').value = 'CI-103221';
        $('#login-pass').value = 'demo-password';
        toast('Identifiants de démo remplis.', 'info');
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = $('#login-id').value.trim();
      const pass = $('#login-pass').value.trim();
      if (!id || !pass) return toast('Matricule/Email et Mot de passe requis.', 'warning');
      openModal(modalId);
      // focus first digit
      setTimeout(() => inputs[0]?.focus(), 50);
    });
  }

  // --- Theme toggle -------------------------------------------------------
  function wireThemeToggle() {
    const btn = $('#btn-theme');
    if (!btn) return;

    btn.addEventListener('click', () => {
      setTheme(state.theme === 'dark' ? 'light' : 'dark');
      toast('Thème mis à jour.', 'success');
    });
  }

  // --- Tabs navigation within template already in renderAgentDetailAndRoute
  // --- Wire sidebar nav ---------------------------------------------------
  function wireNav() {
    $$('.nav__item', document).forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const key = a.dataset.nav;
        location.hash = key;
      });
    });
  }

  // --- Init ---------------------------------------------------------------
  function init() {
    // Theme
    let saved = null;
    try { saved = localStorage.getItem('pnigtfs_theme'); } catch (_) {}
    if (saved === 'dark' || saved === 'light') setTheme(saved);
    else setTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    // Start app state
    const loginScreen = $('#screen-login');
    const appScreen = $('#screen-app');
    if (!loginScreen || !appScreen) return;

    // default: show login
    appScreen.hidden = true;

    wireLogin();
    wireThemeToggle();
    wireNav();
    wireGlobalSearch();

    window.addEventListener('hashchange', () => {
      if (!state.authed) return;
      applyNavigation();
    });

    // If authed by mock token
    const token = sessionStorage.getItem('pnigtfs_authed');
    if (token === '1') {
      state.authed = true;
      loginScreen.hidden = true;
      appScreen.hidden = false;
      applyNavigation();
    }

    // Persist authed on successful 2FA
    // (We set it when 2FA succeeds)
    // Patch: listen once
    const form = $('#login-form');
    form?.addEventListener('submit', () => {
      // no-op
    });

    // ensure mobile sidebar collapse could be later
  }

  // Patch: when authed true set hash and show app handled in wireLogin
  // But we need session persistence.
  const observer = new MutationObserver(() => {
    // detect toast success message? instead, track by session storage
    if (state.authed) sessionStorage.setItem('pnigtfs_authed', '1');
  });

  observer.observe(document.body, { childList: true, subtree: true });

  init();
})();

