// ============================================================
// app.js — 90-Day DSA Calendar Application Logic
// ============================================================

// ---- STATE ----
let state = {
  completed: new Set(),    // problem ids
  weak: new Set(),         // problem ids
  lastSolvedDay: null,
  streak: 0
};

// ---- PERSISTENCE ----
function loadState() {
  try {
    const saved = localStorage.getItem('dsa_90day_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      state.completed = new Set(parsed.completed || []);
      state.weak = new Set(parsed.weak || []);
      state.streak = parsed.streak || 0;
      state.lastSolvedDay = parsed.lastSolvedDay || null;
    }
  } catch(e) { /* ignore */ }
}

function saveState() {
  try {
    localStorage.setItem('dsa_90day_state', JSON.stringify({
      completed: [...state.completed],
      weak: [...state.weak],
      streak: state.streak,
      lastSolvedDay: state.lastSolvedDay
    }));
  } catch(e) { /* ignore */ }
}

// ---- VIEW SWITCHING ----
function switchView(viewName) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('view-' + viewName).classList.add('active');
  document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

  if (viewName === 'patterns') renderPatterns();
  if (viewName === 'progress') renderProgress();
  if (viewName === 'weaklist') renderWeakList();
}

// ---- HEADER STATS ----
function updateHeaderStats() {
  const total = ALL_PROBLEMS.length;
  const done = state.completed.size;
  const pct = total === 0 ? 0 : Math.round(done / total * 100);

  document.getElementById('hstat-done').textContent = done;
  document.getElementById('hstat-streak').textContent = state.streak;
  document.getElementById('hstat-pct').textContent = pct + '%';
  document.getElementById('global-progress-fill').style.width = pct + '%';
}

// ---- CALENDAR RENDERING ----
function renderCalendar() {
  const container = document.getElementById('weeks-container');
  const weekSelect = document.getElementById('week-select');
  weekSelect.innerHTML = '<option value="">— jump to week —</option>';

  // Legend
  const legend = document.createElement('div');
  legend.className = 'legend';
  legend.innerHTML = `
    <span style="font-size:12px;color:var(--text3);font-weight:600;">LEGEND:</span>
    <div class="legend-item"><div class="legend-dot" style="background:var(--easy-color)"></div> Easy</div>
    <div class="legend-item"><div class="legend-dot" style="background:var(--med-color)"></div> Medium</div>
    <div class="legend-item"><div class="legend-dot" style="background:var(--hard-color)"></div> Hard</div>
    <div class="legend-item"><div class="legend-dot" style="background:var(--green)"></div> Completed Day</div>
    <div class="legend-item"><div class="legend-dot" style="background:var(--yellow)"></div> Marked Weak</div>
    <div class="legend-item" style="color:var(--text3)">Click any day card to see problem details</div>
  `;
  container.appendChild(legend);

  let currentPhase = null;

  PLAN.forEach((week, wi) => {
    // Phase divider
    if (week.phase !== currentPhase) {
      currentPhase = week.phase;
      const divider = document.createElement('div');
      divider.className = 'phase-divider';
      divider.innerHTML = `
        <div class="phase-divider-line"></div>
        <div class="phase-divider-label">${currentPhase}</div>
        <div class="phase-divider-line"></div>
      `;
      container.appendChild(divider);
    }

    const weekEl = document.createElement('div');
    weekEl.className = 'week-block';
    weekEl.id = 'week-' + week.week;

    // Week header
    const weekProblems = week.days.flatMap(d => d.problems);
    const weekDone = weekProblems.filter(p => state.completed.has(p.id)).length;
    const weekTotal = weekProblems.length;
    const weekPct = weekTotal === 0 ? 0 : Math.round(weekDone / weekTotal * 100);

    weekEl.innerHTML = `
      <div class="week-header">
        <div class="week-badge">Week ${week.week}</div>
        <div class="week-title">${week.weekTitle}</div>
        <div class="week-pattern-tag">${week.weekPattern}</div>
        <div class="week-progress">
          <div class="week-prog-bar">
            <div class="week-prog-fill" style="width:${weekPct}%"></div>
          </div>
          <div class="week-prog-text">${weekDone}/${weekTotal}</div>
        </div>
      </div>
      <div class="day-grid" id="week-grid-${week.week}"></div>
    `;

    container.appendChild(weekEl);

    // Week select option
    const opt = document.createElement('option');
    opt.value = week.week;
    opt.textContent = `Week ${week.week} — ${week.weekTitle}`;
    weekSelect.appendChild(opt);

    // Day cards
    const grid = weekEl.querySelector('#week-grid-' + week.week);
    week.days.forEach(day => {
      const card = createDayCard(day);
      grid.appendChild(card);
    });
  });
}

function createDayCard(day) {
  const card = document.createElement('div');

  if (day.isRest) {
    card.className = 'day-card rest';
    card.innerHTML = `
      <div class="day-number">Day ${day.day}</div>
      <div class="rest-label">🌙 Rest & Review</div>
    `;
    return card;
  }

  const allDone = day.problems.every(p => state.completed.has(p.id));
  const anyWeak = day.problems.some(p => state.weak.has(p.id));

  let statusClass = '';
  if (allDone) statusClass = ' done';
  else if (anyWeak) statusClass = ' weak';

  card.className = 'day-card' + statusClass;
  card.setAttribute('data-day', day.day);

  const probsHTML = day.problems.map(p => `
    <div class="prob-pill diff-${p.difficulty}" onclick="openModal(event, '${p.id}')">
      <div class="prob-diff"></div>
      <span class="prob-name">${p.name}</span>
      ${state.completed.has(p.id) ? '<span class="prob-done-check">✓</span>' : ''}
    </div>
  `).join('');

  card.innerHTML = `
    <div class="day-number">
      Day ${day.day}
      <div class="day-status-dot"></div>
    </div>
    <div class="day-title" style="font-size:11px;color:var(--text3);margin-bottom:8px;font-weight:500;">${day.title}</div>
    <div class="day-problems">${probsHTML}</div>
  `;

  return card;
}

function refreshDayCard(dayNum) {
  const plan_day = PLAN.flatMap(w => w.days).find(d => d.day === dayNum);
  if (!plan_day || plan_day.isRest) return;

  const oldCard = document.querySelector(`.day-card[data-day="${dayNum}"]`);
  if (!oldCard) return;

  const newCard = createDayCard(plan_day);
  oldCard.replaceWith(newCard);

  // Refresh week progress bar
  const week = PLAN.find(w => w.days.some(d => d.day === dayNum));
  if (week) {
    const weekProblems = week.days.flatMap(d => d.problems);
    const weekDone = weekProblems.filter(p => state.completed.has(p.id)).length;
    const weekTotal = weekProblems.length;
    const weekPct = weekTotal === 0 ? 0 : Math.round(weekDone / weekTotal * 100);
    const fill = document.querySelector(`#week-${week.week} .week-prog-fill`);
    const text = document.querySelector(`#week-${week.week} .week-prog-text`);
    if (fill) fill.style.width = weekPct + '%';
    if (text) text.textContent = `${weekDone}/${weekTotal}`;
  }
}

function scrollToWeek(weekNum) {
  if (!weekNum) return;
  const el = document.getElementById('week-' + weekNum);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---- MODAL ----
let currentProblemId = null;

function openModal(event, problemId) {
  event.stopPropagation();
  const prob = ALL_PROBLEMS.find(p => p.id === problemId);
  if (!prob) return;
  currentProblemId = problemId;

  const pattern = PATTERNS[prob.pattern];
  const isDone = state.completed.has(problemId);
  const isWeak = state.weak.has(problemId);

  const approachHTML = prob.approach.map((step, i) => `
    <div class="approach-step">
      <div class="step-num">${i + 1}</div>
      <div>${step}</div>
    </div>
  `).join('');

  document.getElementById('modal-content').innerHTML = `
    <div class="modal-problem-title">${prob.name}</div>
    <div class="modal-meta">
      <span class="modal-day-badge">Day ${prob.day} · Week ${prob.week}</span>
      <span class="modal-day-badge">${prob.topic}</span>
      <span class="diff-badge ${prob.difficulty}">${prob.difficulty}</span>
      <span class="modal-day-badge" style="background:rgba(108,99,255,0.12);color:var(--accent2)">${prob.pdfRef}</span>
    </div>

    <div class="modal-section">
      <div class="modal-section-label">Pattern</div>
      <div class="modal-pattern-box">
        <div class="modal-pattern-name">${pattern ? pattern.name : prob.pattern}</div>
        <div class="modal-pattern-desc">${pattern ? pattern.description : ''}</div>
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-label">Complexity</div>
      <div class="complexity-row">
        <div class="comp-item">
          <div class="comp-label">Time</div>
          <div class="comp-val comp-time">${prob.timeComplexity}</div>
        </div>
        <div class="comp-item">
          <div class="comp-label">Space</div>
          <div class="comp-val comp-space">${prob.spaceComplexity}</div>
        </div>
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-label">Optimal Approach</div>
      <div class="approach-box">${approachHTML}</div>
    </div>

    ${pattern ? `
    <div class="modal-section">
      <div class="modal-section-label">Pattern Template</div>
      <div class="pattern-template">${pattern.template}</div>
    </div>
    ` : ''}

    <div class="modal-actions">
      <button class="btn-success ${isDone ? 'active' : ''}" id="modal-done-btn" onclick="toggleDone('${problemId}')">
        ${isDone ? '✓ Completed' : '◯ Mark Complete'}
      </button>
      <button class="btn-warn ${isWeak ? 'active' : ''}" id="modal-weak-btn" onclick="toggleWeak('${problemId}')">
        ${isWeak ? '⚑ Flagged Weak' : '⚐ Flag as Weak'}
      </button>
      <a href="https://leetcode.com/problems/${prob.lcSlug}/" target="_blank" rel="noopener noreferrer" class="btn-link">
        Open on LeetCode &#8599;
      </a>
    </div>
  `;

  document.getElementById('problem-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(event) {
  if (event.target === document.getElementById('problem-modal')) {
    closeModalBtn();
  }
}

function closeModalBtn() {
  document.getElementById('problem-modal').classList.remove('open');
  document.body.style.overflow = '';
  currentProblemId = null;
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModalBtn();
});

// ---- PROBLEM ACTIONS ----
function toggleDone(id) {
  if (state.completed.has(id)) {
    state.completed.delete(id);
  } else {
    state.completed.add(id);
    updateStreak();
  }
  saveState();

  // Update modal buttons
  const btn = document.getElementById('modal-done-btn');
  if (btn) {
    const isDone = state.completed.has(id);
    btn.textContent = isDone ? '✓ Completed' : '◯ Mark Complete';
    btn.classList.toggle('active', isDone);
  }

  // Update UI
  const prob = ALL_PROBLEMS.find(p => p.id === id);
  if (prob) refreshDayCard(prob.day);
  updateHeaderStats();
}

function toggleWeak(id) {
  if (state.weak.has(id)) {
    state.weak.delete(id);
  } else {
    state.weak.add(id);
  }
  saveState();

  const btn = document.getElementById('modal-weak-btn');
  if (btn) {
    const isWeak = state.weak.has(id);
    btn.textContent = isWeak ? '⚑ Flagged Weak' : '⚐ Flag as Weak';
    btn.classList.toggle('active', isWeak);
  }

  const prob = ALL_PROBLEMS.find(p => p.id === id);
  if (prob) refreshDayCard(prob.day);
}

function updateStreak() {
  const today = new Date().toDateString();
  if (state.lastSolvedDay === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (state.lastSolvedDay === yesterday) {
    state.streak++;
  } else if (state.lastSolvedDay !== today) {
    state.streak = 1;
  }
  state.lastSolvedDay = today;
}

function resetAll() {
  if (!confirm('Reset ALL progress? This cannot be undone.')) return;
  state.completed = new Set();
  state.weak = new Set();
  state.streak = 0;
  state.lastSolvedDay = null;
  saveState();
  location.reload();
}

// ---- PATTERNS VIEW ----
function renderPatterns() {
  const container = document.getElementById('patterns-container');
  container.innerHTML = '';

  // Count problems per pattern from our plan
  const patternCounts = {};
  ALL_PROBLEMS.forEach(p => {
    patternCounts[p.pattern] = (patternCounts[p.pattern] || 0) + 1;
  });

  Object.entries(PATTERNS).forEach(([key, pat]) => {
    const count = patternCounts[key] || 0;
    const probs = ALL_PROBLEMS.filter(p => p.pattern === key);
    const doneCount = probs.filter(p => state.completed.has(p.id)).length;

    const card = document.createElement('div');
    card.className = 'pattern-card';
    card.style.borderLeftColor = pat.color;
    card.style.borderLeftWidth = '3px';

    const probTags = probs.slice(0, 5).map(p =>
      `<span class="pprob-tag">${p.name}</span>`
    ).join('');

    card.innerHTML = `
      <div class="pattern-card-header">
        <div class="pattern-icon" style="background:${pat.bgColor};color:${pat.color}">${pat.icon}</div>
        <div class="pattern-meta">
          <div class="pattern-name">${pat.name}</div>
          <div class="pattern-count">${count} problems · ${doneCount} solved</div>
        </div>
      </div>
      <div class="pattern-desc">${pat.description}</div>
      <div class="pattern-complexity">
        <span class="complexity-badge complexity-time">⏱ ${pat.timeComplexity}</span>
        <span class="complexity-badge complexity-space">🗃 ${pat.spaceComplexity}</span>
      </div>
      <div class="pattern-template">${pat.template}</div>
      ${count > 0 ? `<div class="pattern-problems">${probTags}${count > 5 ? `<span class="pprob-tag">+${count - 5} more</span>` : ''}</div>` : ''}
    `;

    container.appendChild(card);
  });
}

// ---- PROGRESS VIEW ----
function renderProgress() {
  const container = document.getElementById('progress-container');
  container.innerHTML = '';

  const total = ALL_PROBLEMS.length;
  const done = state.completed.size;
  const weak = state.weak.size;
  const pct = total === 0 ? 0 : Math.round(done / total * 100);

  // Overview cards
  const overview = document.createElement('div');
  overview.className = 'progress-overview';
  overview.innerHTML = `
    <div class="prog-stat-card" style="border-color:rgba(108,99,255,0.3)">
      <div class="prog-stat-label">Problems Completed</div>
      <div class="prog-stat-val" style="color:var(--accent)">${done}</div>
      <div class="prog-stat-sub">of ${total} total problems</div>
    </div>
    <div class="prog-stat-card" style="border-color:rgba(34,197,94,0.3)">
      <div class="prog-stat-label">Completion Rate</div>
      <div class="prog-stat-val" style="color:var(--green)">${pct}%</div>
      <div class="prog-stat-sub">Keep going!</div>
    </div>
    <div class="prog-stat-card" style="border-color:rgba(245,158,11,0.3)">
      <div class="prog-stat-label">Current Streak</div>
      <div class="prog-stat-val" style="color:var(--yellow)">${state.streak} 🔥</div>
      <div class="prog-stat-sub">consecutive days</div>
    </div>
    <div class="prog-stat-card" style="border-color:rgba(239,68,68,0.3)">
      <div class="prog-stat-label">Flagged Weak</div>
      <div class="prog-stat-val" style="color:var(--red)">${weak}</div>
      <div class="prog-stat-sub">problems to revisit</div>
    </div>
  `;
  container.appendChild(overview);

  // Difficulty breakdown
  const diffSection = document.createElement('div');
  diffSection.innerHTML = `<div class="section-title">📊 By Difficulty</div>`;

  const diffBreak = document.createElement('div');
  diffBreak.className = 'diff-breakdown';

  ['easy', 'medium', 'hard'].forEach(diff => {
    const all = ALL_PROBLEMS.filter(p => p.difficulty === diff);
    const doneD = all.filter(p => state.completed.has(p.id)).length;
    diffBreak.innerHTML += `
      <div class="diff-card diff-${diff}">
        <div class="diff-label">${diff}</div>
        <div class="diff-val">${doneD}</div>
        <div class="diff-of">of ${all.length}</div>
      </div>
    `;
  });

  diffSection.appendChild(diffBreak);
  container.appendChild(diffSection);

  // Topic progress
  const topicSection = document.createElement('div');
  topicSection.innerHTML = `<div class="section-title">📚 By Topic</div>`;

  const topics = {};
  ALL_PROBLEMS.forEach(p => {
    if (!topics[p.topic]) topics[p.topic] = { total: 0, done: 0 };
    topics[p.topic].total++;
    if (state.completed.has(p.id)) topics[p.topic].done++;
  });

  const topicGrid = document.createElement('div');
  topicGrid.className = 'topic-progress-grid';

  const colors = ['#6c63ff', '#22c55e', '#f59e0b', '#06b6d4', '#ec4899', '#f97316', '#a78bfa', '#8b5cf6', '#0ea5e9', '#ef4444'];
  Object.entries(topics).sort((a, b) => b[1].total - a[1].total).forEach(([topic, data], i) => {
    const pct = Math.round(data.done / data.total * 100);
    const color = colors[i % colors.length];
    topicGrid.innerHTML += `
      <div class="topic-prog-row">
        <div class="topic-prog-name">${topic}</div>
        <div class="topic-prog-bar">
          <div class="topic-prog-fill" style="width:${pct}%;background:${color}"></div>
        </div>
        <div class="topic-prog-nums">${data.done} / ${data.total}</div>
      </div>
    `;
  });

  topicSection.appendChild(topicGrid);
  container.appendChild(topicSection);

  // Week progress
  const weekSection = document.createElement('div');
  weekSection.innerHTML = `<div class="section-title">📅 By Week</div>`;

  const weekGrid = document.createElement('div');
  weekGrid.className = 'topic-progress-grid';

  PLAN.forEach(week => {
    const weekProblems = week.days.flatMap(d => d.problems);
    if (weekProblems.length === 0) return;
    const weekDone = weekProblems.filter(p => state.completed.has(p.id)).length;
    const weekPct = Math.round(weekDone / weekProblems.length * 100);
    weekGrid.innerHTML += `
      <div class="topic-prog-row">
        <div class="topic-prog-name" style="width:220px">Week ${week.week}: ${week.weekTitle}</div>
        <div class="topic-prog-bar">
          <div class="topic-prog-fill" style="width:${weekPct}%;background:linear-gradient(90deg,var(--accent),var(--cyan))"></div>
        </div>
        <div class="topic-prog-nums">${weekDone} / ${weekProblems.length}</div>
      </div>
    `;
  });

  weekSection.appendChild(weekGrid);
  container.appendChild(weekSection);
}

// ---- WEAK LIST VIEW ----
function renderWeakList() {
  const container = document.getElementById('weaklist-container');
  container.innerHTML = '';

  const weakProblems = ALL_PROBLEMS.filter(p => state.weak.has(p.id));

  if (weakProblems.length === 0) {
    container.innerHTML = `
      <div class="weak-empty">
        <div class="icon">🎯</div>
        <h3>No weak problems flagged yet!</h3>
        <p>When solving problems in the calendar, click "Flag as Weak" to add them here for focused practice.</p>
      </div>
    `;
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'weak-grid';

  weakProblems.forEach(prob => {
    const pattern = PATTERNS[prob.pattern];
    const isDone = state.completed.has(prob.id);

    const card = document.createElement('div');
    card.className = 'weak-card';
    card.innerHTML = `
      <div class="weak-card-header">
        <div class="weak-card-name">${prob.name}</div>
        <span class="diff-badge ${prob.difficulty}">${prob.difficulty}</span>
      </div>
      <div class="weak-card-pattern">🧩 ${pattern ? pattern.name : prob.pattern} · ${prob.topic}</div>
      <div style="font-size:11px;color:var(--text4);margin-bottom:8px">${prob.pdfRef}</div>
      <div style="font-size:12px;color:var(--text3);margin-bottom:8px">
        ⏱ ${prob.timeComplexity} &nbsp;|&nbsp; 🗃 ${prob.spaceComplexity}
      </div>
      <div class="weak-card-actions">
        <button class="btn-primary" onclick="openModal(event, '${prob.id}')">Review</button>
        <button class="btn-success ${isDone ? 'active' : ''}" onclick="toggleDone('${prob.id}');renderWeakList()">
          ${isDone ? '✓ Done' : 'Mark Done'}
        </button>
        <button class="btn-ghost" onclick="toggleWeak('${prob.id}');renderWeakList()">Remove</button>
      </div>
    `;

    grid.appendChild(card);
  });

  const summary = document.createElement('div');
  summary.style.cssText = 'margin-bottom:24px;padding:16px 20px;background:var(--bg1);border:1px solid var(--border);border-radius:12px;display:flex;gap:24px;flex-wrap:wrap;';
  summary.innerHTML = `
    <div style="font-size:13px;color:var(--text2)">
      <strong style="color:var(--yellow)">${weakProblems.length}</strong> problems flagged for review
    </div>
    <div style="font-size:13px;color:var(--text2)">
      <strong style="color:var(--green)">${weakProblems.filter(p => state.completed.has(p.id)).length}</strong> solved after flagging
    </div>
  `;
  container.appendChild(summary);
  container.appendChild(grid);
}

// ---- INIT ----
function init() {
  loadState();
  renderCalendar();
  updateHeaderStats();
}

init();
