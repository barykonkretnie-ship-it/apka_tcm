import { questions, patterns, shuffled, evaluate, symptomChoices, prepareQuestion } from './questions.js';

const app = document.querySelector('#app');
const storageKey = 'korzenie-tcm-sources-v3';
let saved = { best: 0, sessions: 0 };
try {
  const value = JSON.parse(localStorage.getItem(storageKey));
  if (value && Number.isFinite(value.best) && Number.isInteger(value.sessions) && value.sessions >= 0) saved = { best: Math.max(0, value.best), sessions: value.sessions };
} catch { /* Rozgrywka działa również bez pamięci przeglądarki. */ }
let round = [], index = 0, points = 0, mistakes = [], answered = false, review = false;
let choices = [];

function home() {
  app.innerHTML = `<section class="start-screen"><div class="eyebrow">KORZENIE · NAUKA WZORCÓW TCM</div><h1>Jak chcesz ćwiczyć?</h1><p>Wybierz wzorzec i zaznacz pasujące do niego objawy.</p><div class="start-actions"><button type="button" class="start-action" id="random-pattern"><span class="action-number">01</span><span><strong>Losuj wzorzec</strong><small>Jeden losowy wzorzec z całej bazy</small></span><span aria-hidden="true">→</span></button><button type="button" class="start-action" id="catalog"><span class="action-number">02</span><span><strong>Sprawdź / ćwicz wzorzec</strong><small>Wyszukaj opis i wybierz konkretny wzorzec</small></span><span aria-hidden="true">→</span></button><button type="button" class="start-action" id="organ-groups"><span class="action-number">03</span><span><strong>Ćwicz wzorce dla narządu</strong><small>Wybierz grupę: Śledziona, Wątroba, Nerki…</small></span><span aria-hidden="true">→</span></button></div><p class="start-footnote">${patterns.length} pozycji w bazie · ${questions.length} dostępnych w ćwiczeniach<br>Kompendium + Me & Qi · źródła przy każdym wzorcu</p></section>`;
  document.querySelector('#random-pattern').onclick = () => start([shuffled(questions)[0]], false);
  document.querySelector('#catalog').onclick = () => catalog();
  document.querySelector('#organ-groups').onclick = organGroups;
}

function organGroups() {
  const groups = [...new Set(patterns.map(p => p.group))];
  app.innerHTML = `<section class="catalog organ-screen"><button class="text-button" id="groups-home">← Strona główna</button><div class="eyebrow">ĆWICZENIA WEDŁUG NARZĄDU</div><h1>Wybierz grupę</h1><p>Ćwicz wszystkie dostępne wzorce jednej grupy albo wybierz konkretny z jej listy.</p><div class="organ-grid">${groups.map((g,i) => { const available = questions.filter(q => q.group === g).length; return `<button type="button" class="organ-button" data-group="${i}"><strong>${g}</strong><span>${available} do ćwiczeń · ${patterns.filter(p => p.group === g).length} w bazie</span><span aria-hidden="true">→</span></button>`; }).join('')}</div></section>`;
  document.querySelector('#groups-home').onclick = home;
  document.querySelectorAll('.organ-button').forEach(b => b.onclick = () => catalog(groups[Number(b.dataset.group)]));
}

function start(pool, isReview) {
  round = shuffled(pool).map(q => prepareQuestion(questions.find(base => base.id === q.id) || q)); index = 0; points = 0; mistakes = []; review = isReview;
  showQuestion();
}

function showQuestion() {
  answered = false;
  const q = round[index];
  choices = symptomChoices(q);
  app.innerHTML = `<section class="quiz-shell"><div class="quiz-nav"><button class="text-button" id="back">← Strona główna</button><span>${review ? 'POWTÓRKA POMYŁEK' : 'WZORZEC → OBJAWY'}</span><strong>${points} pkt</strong></div><div class="question-progress"><span>Wzorzec ${index + 1} z ${round.length}</span><span>Zaznacz wszystkie pasujące objawy</span></div><div class="progress-track" role="progressbar" aria-label="Postęp quizu" aria-valuemin="0" aria-valuemax="${round.length}" aria-valuenow="${index}"><div style="width:${index / round.length * 100}%"></div></div><article class="pattern-heading"><span class="small-label">TWÓJ WZORZEC TCM</span><h1 tabindex="-1" id="question-heading">${q.name}</h1><p>Które objawy pasują do typowego obrazu tego wzorca? Zaznacz wszystkie właściwe.</p><span class="case-note">Ćwiczenie z opracowanego zestawu źródłowego. Objaw może należeć do kilku wzorców; to nie jest ocena kliniczna.</span></article><div id="symptom-form"><fieldset><legend>Wybierz objawy z poniższej listy</legend><div class="symptom-options">${choices.map((s, i) => `<button type="button" class="symptom-option" data-index="${i}" aria-pressed="false"><span class="symptom-text">${s}</span><span class="selection-status"></span></button>`).join('')}</div></fieldset><div class="check-bar"><span id="selection-count" aria-live="polite">Zaznaczono: 0</span><span>Do 100 pkt za wzorzec · błędne zaznaczenia obniżają wynik</span><button class="primary" id="check" type="button">Sprawdź odpowiedzi <span>→</span></button></div></div><div id="feedback" aria-live="polite"></div></section>`;
  document.querySelector('#back').onclick = home;
  document.querySelector('#check').onclick = answer;
  document.querySelectorAll('.symptom-option').forEach(button => button.onclick = () => {
    if (answered) return;
    button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
    const count = document.querySelectorAll('.symptom-option[aria-pressed="true"]').length;
    document.querySelector('#selection-count').textContent = `Zaznaczono: ${count}`;
    document.querySelector('#feedback').textContent = '';
  });
  document.querySelector('#question-heading').focus();
}

function answer() {
  if (answered) return;
  const q = round[index];
  const selected = [...document.querySelectorAll('.symptom-option[aria-pressed="true"]')].map(input => choices[Number(input.dataset.index)]);
  if (selected.length === 0) {
    document.querySelector('#feedback').innerHTML = '<p class="selection-hint">Najpierw zaznacz co najmniej jeden objaw na liście powyżej, a potem kliknij „Sprawdź odpowiedzi”.</p>';
    document.querySelector('.symptom-option').focus();
    return;
  }
  answered = true;
  const result = evaluate(q, selected);
  points += result.points;
  if (!result.correct) mistakes.push(q);
  document.querySelector('.quiz-nav strong').textContent = `${points} pkt`;
  document.querySelector('#check').disabled = true;
  document.querySelectorAll('.symptom-option').forEach(input => {
    input.disabled = true;
    const text = choices[Number(input.dataset.index)];
    const label = input;
    const checked = input.getAttribute('aria-pressed') === 'true';
    const status = label.querySelector('.selection-status');
    if (q.symptoms.includes(text)) {
      label.classList.add(checked ? 'hit' : 'missed');
      const origins = q.evidence.find(s => s.text === text)?.sources || [];
      status.textContent = (checked ? 'Trafienie' : 'Pominięty — pasuje') + ' · ' + origins.map(s => s === 'kompendium' ? 'Kompendium' : 'Me & Qi').join(' + ');
    } else if (checked) {
      label.classList.add('wrong'); status.textContent = 'Nie pasuje do tego zestawu';
    } else {
      status.textContent = 'Prawidłowo pominięty';
    }
  });
  document.querySelector('#feedback').innerHTML = `<div class="feedback ${result.correct ? '' : 'retry'}"><strong>${result.correct ? 'Wszystkie objawy dobrane poprawnie!' : 'Sprawdź oznaczenia przy objawach.'} +${result.points} pkt</strong><p>Trafienia: ${result.hits.length} · Pominięte pasujące: ${result.missed.length} · Błędnie zaznaczone: ${result.wrong.length}</p><p>${q.explanation}</p><div class="memory-clue"><span>ZAPAMIĘTAJ</span>${q.clue}</div>${sourcesMarkup(q)}</div><button class="primary" id="next">${index + 1 === round.length ? 'Zobacz wynik' : 'Następny wzorzec'} <span>→</span></button>`;
  document.querySelector('#next').onclick = () => { index++; index < round.length ? showQuestion() : finish(); };
  document.querySelector('#feedback').scrollIntoView({block: 'nearest'});
}

function finish() {
  const correct = round.length - mistakes.length;
  let persisted = true;
  if (!review && round.length === 8) {
    saved.sessions++; saved.best = Math.max(saved.best, points);
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch { persisted = false; }
  }
  app.innerHTML = `<section class="result"><div class="result-leaf">❧</div><div class="eyebrow">${review ? 'POWTÓRKA ZAKOŃCZONA' : 'KOLEJNY KROK ZA TOBĄ'}</div><h1>${mistakes.length ? 'Wiedza rośnie z powtórką.' : 'Pięknie łączysz kropki.'}</h1><p>Wzorce bez pomyłek: <strong>${correct} z ${round.length}</strong>. ${mistakes.length ? 'Wróć do trudniejszych wzorców i utrwal połączenia.' : 'Wszystkie wzorce rozpoznane. Wróć za jakiś czas, aby je utrwalić.'}</p><div class="result-score">${points}<span> / ${round.length * 100} pkt</span></div>${mistakes.length ? `<button class="primary" id="review">Powtórz pomyłki (${mistakes.length}) <span>↻</span></button>` : ''}<button class="${mistakes.length ? 'secondary' : 'primary'}" id="again">Losuj kolejny wzorzec <span>→</span></button><button class="text-button" id="home">Wróć na stronę główną</button>${!persisted ? '<p class="local-note">Przeglądarka nie pozwoliła zapisać wyniku. Możesz dalej grać.</p>' : ''}</section>`;
  const retry = document.querySelector('#review');
  if (retry) retry.onclick = () => start(mistakes, true);
  document.querySelector('#again').onclick = () => start([shuffled(questions)[0]], false);
  document.querySelector('#home').onclick = home;
}

function sourcesMarkup(pattern) {
  const status = pattern.sourceStatus === 'matched' ? 'Porównano odpowiadające sobie opisy.' : pattern.sourceStatus === 'related-only' ? 'Me & Qi: opis powiązany, bez automatycznego scalania.' : 'Brak dokładnego odpowiednika Me & Qi — opis z Kompendium.';
  return `<details class="sources"><summary>Źródła i uwagi do opracowania</summary><p>Kompendium TCM (1).pdf · strona ${pattern.page} PDF · pozycja ${pattern.number}.</p>${pattern.meandqi ? `<p><a href="${pattern.meandqi.url}" target="_blank" rel="noopener noreferrer">Me & Qi — ${pattern.meandqi.title.split(':')[0]} ↗</a> · odczyt: 25.10.2026</p>` : ''}<p>${status}</p>${pattern.note ? `<p class="source-note">${pattern.note}</p>` : ''}<p>Robocze opracowanie edukacyjne; nie zastępuje przeglądu przez nauczyciela TCM.</p></details>`;
}

function catalog(initialGroup = '') {
  app.innerHTML = `<section class="catalog"><button class="text-button" id="catalog-home">← Strona główna</button><div class="eyebrow">KOMPENDIUM + ME & QI</div><h1>${initialGroup || 'Baza wzorców'}</h1><p>Wszystkie 80 pozycji tabel z Kompendium (okładka podaje 79). Powtórzeń i wariantów nie usunięto. ${questions.length} pozycji jest dostępnych w ćwiczeniach; ${patterns.length - questions.length} czeka na wyjaśnienie rozbieżności.</p>${initialGroup ? `<div class="group-actions"><button class="primary" id="practice-group">Ćwicz wszystkie z grupy: ${initialGroup} <span>→</span></button><button class="secondary" id="random-group">Losuj z tej grupy <span>→</span></button><button class="text-button" id="change-group">← Wybierz inną grupę</button></div>` : ''}<div class="catalog-filters"><label>Szukaj wzorca lub objawu<input type="search" id="pattern-search" placeholder="np. Nerki, nocne poty, kaszel"></label><label>Dział<select id="pattern-group"><option value="">Wszystkie działy</option>${[...new Set(patterns.map(p => p.group))].map(g => `<option>${g}</option>`).join('')}</select></label></div><p id="catalog-count" aria-live="polite"></p><div id="pattern-list"></div></section>`;
  document.querySelector('#catalog-home').onclick = home;
  if (initialGroup) {
    const groupPool = questions.filter(q => q.group === initialGroup);
    document.querySelector('#pattern-group').value = initialGroup;
    document.querySelector('#practice-group').onclick = () => start(groupPool, false);
    document.querySelector('#random-group').onclick = () => start([shuffled(groupPool)[0]], false);
    document.querySelector('#change-group').onclick = organGroups;
  }
  const refresh = () => {
    const query = document.querySelector('#pattern-search').value.trim().toLocaleLowerCase('pl');
    const group = document.querySelector('#pattern-group').value;
    const found = patterns.filter(p => (!group || p.group === group) && `${p.name} ${p.symptoms.map(s => s.text).join(' ')}`.toLocaleLowerCase('pl').includes(query));
    document.querySelector('#catalog-count').textContent = `Wyniki: ${found.length} z ${patterns.length}`;
    document.querySelector('#pattern-list').innerHTML = found.length ? found.map(p => `<article class="pattern-entry"><div class="pattern-entry-top"><span>${String(p.number).padStart(2, '0')} · ${p.group}</span><span class="source-badge">${!p.quizEnabled ? 'Do wyjaśnienia' : p.sourceStatus === 'matched' ? 'Porównano 2 źródła' : 'Kompendium'}</span></div><h2>${p.name}</h2><ul>${p.symptoms.map(s => `<li>${s.text}<small>${s.sources.map(source => source === 'kompendium' ? 'Kompendium' : 'Me & Qi').join(' + ')}</small></li>`).join('')}</ul>${p.observations?.length ? `<div class="observations"><strong>Język i puls — opis z Kompendium</strong>${p.observations.map(o => `<p>${o.text}</p>`).join('')}</div>` : ''}${sourcesMarkup(p)}${p.quizEnabled ? `<button class="secondary practice-pattern" data-id="${p.id}">Ćwicz ten wzorzec <span>→</span></button>` : '<p class="source-note">Do czytania. Pozycja nie wchodzi do punktowanego quizu do czasu wyjaśnienia opisu.</p>'}</article>`).join('') : '<p>Brak wzorców dla wybranych filtrów.</p>';
    document.querySelectorAll('.practice-pattern').forEach(b => b.onclick = () => start([questions.find(q => q.id === b.dataset.id)], true));
  };
  document.querySelector('#pattern-search').oninput = refresh;
  document.querySelector('#pattern-group').onchange = () => {
    if (initialGroup) catalog(document.querySelector('#pattern-group').value);
    else refresh();
  };
  refresh();
}

home();
