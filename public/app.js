import { questions, patterns, shuffled, evaluate, symptomChoices, prepareQuestion } from './questions.js';
import { herbs, organs, herbQuizzes, herbRound, herbQuestion, evaluateChoice } from './herbs.js';

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
  app.innerHTML = `<section class="start-screen"><div class="eyebrow">MODUŁ · WZORCE</div><h1>Jak chcesz ćwiczyć?</h1><p>Wybierz wzorzec i zaznacz pasujące do niego objawy.</p><div class="start-actions"><button type="button" class="start-action" id="random-pattern"><span class="action-number">01</span><span><strong>Losuj wzorzec</strong><small>Jeden losowy wzorzec z całej bazy</small></span><span aria-hidden="true">→</span></button><button type="button" class="start-action" id="catalog"><span class="action-number">02</span><span><strong>Sprawdź / ćwicz wzorzec</strong><small>Wyszukaj opis i wybierz konkretny wzorzec</small></span><span aria-hidden="true">→</span></button><button type="button" class="start-action" id="organ-groups"><span class="action-number">03</span><span><strong>Ćwicz wzorce dla narządu</strong><small>Wybierz grupę: Śledziona, Wątroba, Nerki…</small></span><span aria-hidden="true">→</span></button></div><p class="start-footnote">${patterns.length} pozycji w bazie · ${questions.length} dostępnych w ćwiczeniach<br>Kompendium + Me & Qi · źródła przy każdym wzorcu</p><div class="module-heading"><div class="eyebrow">MODUŁ · ZIOŁA</div><h2>Zioła TCM</h2><p>${herbs.length} podstawowych surowców roślinnych: nazwa pinyin, polska i łacińska przy każdym zielu.</p></div><div class="start-actions">${Object.entries(herbQuizzes).map(([kind, quiz], i) => `<button type="button" class="start-action herb-quiz" data-kind="${kind}"><span class="action-number">${String(i + 4).padStart(2, '0')}</span><span><strong>${quiz.title}</strong><small>${herbQuizHints[kind]}</small></span><span aria-hidden="true">→</span></button>`).join('')}<button type="button" class="start-action" id="herb-catalog"><span class="action-number">07</span><span><strong>Baza ziół</strong><small>Karty ziół: surowiec, działania, narządy i meridiany</small></span><span aria-hidden="true">→</span></button></div><p class="start-footnote">Opisy: opracowanie na podstawie Me & Qi · meridiany wg „Channels Entered” w monografiach Me & Qi</p></section>`;
  document.querySelector('#random-pattern').onclick = () => start([shuffled(questions)[0]], false);
  document.querySelector('#catalog').onclick = () => catalog();
  document.querySelector('#organ-groups').onclick = organGroups;
  document.querySelectorAll('.herb-quiz').forEach(b => b.onclick = () => startHerbs(b.dataset.kind));
  document.querySelector('#herb-catalog').onclick = herbCatalog;
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

const herbQuizHints = {
  'herb-organ': 'Zobacz zioło i zaznacz narządy, z którymi jest powiązane',
  'organ-herbs': 'Zobacz narząd i wybierz pasujące zioła z listy',
  'herb-meridian': 'Zobacz zioło i zaznacz meridiany, do których wchodzi',
};
const herbPrompts = {
  'herb-organ': 'Z którymi narządami (systemami funkcjonalnymi TCM) wiąże się to zioło? Zaznacz wszystkie właściwe.',
  'organ-herbs': 'Które zioła z listy są w bazie powiązane z tym narządem? Zaznacz wszystkie właściwe.',
  'herb-meridian': 'Do których meridianów wchodzi to zioło? Zaznacz wszystkie właściwe.',
};
const herbById = id => herbs.find(h => h.id === id);
let herbState = null;

function herbName(h, size = '') {
  return `<span class="herb-name ${size}"><span class="herb-pinyin">${h.pinyin}</span><span class="herb-polish">${h.polish}</span><span class="herb-latin">${h.latin}</span></span>`;
}

function organNotes(h, only) {
  return organs.flatMap(o => h.organs.filter(x => x.organ === o && (!only || o === only))).map(x => `<li><strong>${x.organ}</strong> — ${x.directions.join('; ')}</li>`).join('');
}

function herbSources(h) {
  return `<details class="sources"><summary>Źródła</summary>${h.sources.map(url => `<p><a href="${url}" target="_blank" rel="noopener noreferrer">${url.replace('https://www.', '')} ↗</a></p>`).join('')}<p>Meridiany, natura i smak: <a href="${h.meandqi.url}" target="_blank" rel="noopener noreferrer">Me & Qi — ${h.pinyin.split(' / ')[0]} ↗</a> · odczyt: 17.11.2026</p>${h.meandqi.note ? `<p class="source-note">${h.meandqi.note}</p>` : ''}<p>Tradycyjne działania w TCM, opis edukacyjny. Nie jest poradą ani gotową recepturą.</p></details>`;
}

function startHerbs(kind, pool = null) {
  const round = pool ? shuffled(pool).map(q => herbQuestion(kind, q.herb || q.organ)) : herbRound(kind);
  herbState = { kind, round, index: 0, points: 0, mistakes: [], answered: false, review: Boolean(pool) };
  showHerbQuestion();
}

function showHerbQuestion() {
  const { kind, round, index, points, review } = herbState;
  const q = round[index];
  const quiz = herbQuizzes[kind];
  herbState.answered = false;
  const subject = q.herb
    ? `<span class="small-label">ZIOŁO · ${q.herb.part.toLocaleUpperCase('pl')}</span><h1 tabindex="-1" id="question-heading">${herbName(q.herb, 'large')}</h1>`
    : `<span class="small-label">NARZĄD (SYSTEM FUNKCJONALNY TCM)</span><h1 tabindex="-1" id="question-heading">${q.organ}</h1>`;
  const option = id => kind === 'organ-herbs' ? herbName(herbById(id)) : `<span class="symptom-text">${id}</span>`;
  app.innerHTML = `<section class="quiz-shell herb-shell"><div class="quiz-nav"><button class="text-button" id="back">← Strona główna</button><span>${review ? 'POWTÓRKA POMYŁEK' : quiz.label}</span><strong>${points} pkt</strong></div><div class="question-progress"><span>${quiz.unit} ${index + 1} z ${round.length}</span><span>${quiz.title}</span></div><div class="progress-track" role="progressbar" aria-label="Postęp quizu" aria-valuemin="0" aria-valuemax="${round.length}" aria-valuenow="${index}"><div style="width:${index / round.length * 100}%"></div></div><article class="pattern-heading">${subject}<p>${herbPrompts[kind]}</p><span class="case-note">${kind === 'herb-meridian' ? 'Meridiany według „Channels Entered” w monografii Me & Qi.' : 'Narządy według mapy narząd–niedobór i kart ziół z bazy. Opis tradycyjnych działań TCM, nie porada.'}</span></article><div id="symptom-form"><fieldset><legend>${kind === 'organ-herbs' ? 'Zioła' : kind === 'herb-meridian' ? 'Meridiany' : 'Narządy'}</legend><div class="symptom-options ${kind === 'organ-herbs' ? '' : 'compact-options'}">${q.options.map((id, i) => `<button type="button" class="symptom-option" data-index="${i}" aria-pressed="false">${option(id)}<span class="selection-status"></span></button>`).join('')}</div></fieldset><div class="check-bar"><span id="selection-count" aria-live="polite">Zaznaczono: 0</span><span>Do 100 pkt za pytanie · błędne zaznaczenia obniżają wynik</span><button class="primary" id="check" type="button">Sprawdź odpowiedzi <span>→</span></button></div></div><div id="feedback" aria-live="polite"></div></section>`;
  document.querySelector('#back').onclick = home;
  document.querySelector('#check').onclick = answerHerb;
  document.querySelectorAll('.symptom-option').forEach(button => button.onclick = () => {
    if (herbState.answered) return;
    button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
    document.querySelector('#selection-count').textContent = `Zaznaczono: ${document.querySelectorAll('.symptom-option[aria-pressed="true"]').length}`;
    document.querySelector('#feedback').textContent = '';
  });
  document.querySelector('#question-heading').focus();
}

function answerHerb() {
  if (herbState.answered) return;
  const { kind, round, index } = herbState;
  const q = round[index];
  const pressed = [...document.querySelectorAll('.symptom-option[aria-pressed="true"]')];
  if (pressed.length === 0) {
    document.querySelector('#feedback').innerHTML = '<p class="selection-hint">Najpierw zaznacz co najmniej jedną odpowiedź, a potem kliknij „Sprawdź odpowiedzi”.</p>';
    document.querySelector('.symptom-option').focus();
    return;
  }
  herbState.answered = true;
  const result = evaluateChoice(q, pressed.map(b => q.options[Number(b.dataset.index)]));
  herbState.points += result.points;
  if (!result.correct) herbState.mistakes.push(q);
  document.querySelector('.quiz-nav strong').textContent = `${herbState.points} pkt`;
  document.querySelector('#check').disabled = true;
  document.querySelectorAll('.symptom-option').forEach(button => {
    button.disabled = true;
    const id = q.options[Number(button.dataset.index)];
    const checked = button.getAttribute('aria-pressed') === 'true';
    const status = button.querySelector('.selection-status');
    const why = kind === 'organ-herbs' && q.correct.includes(id) ? ' · ' + herbById(id).organs.find(x => x.organ === q.organ).directions.join('; ') : '';
    if (q.correct.includes(id)) { button.classList.add(checked ? 'hit' : 'missed'); status.textContent = (checked ? 'Trafienie' : 'Pominięte — pasuje') + why; }
    else if (q.neutral.includes(id)) status.textContent = 'Meridian tak (Me & Qi), mapa narządów nie — bez punktów';
    else if (checked) { button.classList.add('wrong'); status.textContent = 'Nie pasuje'; }
    else status.textContent = 'Prawidłowo pominięte';
  });
  let details;
  if (kind === 'herb-organ') details = `<ul class="herb-facts">${organNotes(q.herb)}</ul><p>${q.herb.actions}.</p>${q.herb.distinction ? `<div class="memory-clue"><span>ROZRÓŻNIENIE</span>${q.herb.distinction}</div>` : ''}${herbSources(q.herb)}`;
  else if (kind === 'herb-meridian') details = `<p>Meridiany: <strong>${q.correct.join(', ')}</strong>. Natura: ${q.herb.temperature} · smak: ${q.herb.taste.join(', ')}.</p><div class="memory-clue"><span>GŁÓWNE SKOJARZENIA</span>${q.herb.associations}</div>${herbSources(q.herb)}`;
  else {
    const others = herbs.filter(h => h.organs.some(x => x.organ === q.organ) && !q.correct.includes(h.id));
    details = `<ul class="herb-facts">${q.correct.map(id => herbById(id)).map(h => `<li><strong>${h.pinyin}</strong> — ${h.organs.find(x => x.organ === q.organ).directions.join('; ')}</li>`).join('')}</ul>${others.length ? `<div class="memory-clue"><span>INNE ZIOŁA Z BAZY DLA: ${q.organ.toLocaleUpperCase('pl')}</span>${others.map(h => h.pinyin).join(' · ')}</div>` : ''}`;
  }
  const last = index + 1 === round.length;
  document.querySelector('#feedback').innerHTML = `<div class="feedback ${result.correct ? '' : 'retry'}"><strong>${result.correct ? 'Wszystko dobrane poprawnie!' : 'Sprawdź oznaczenia przy odpowiedziach.'} +${result.points} pkt</strong><p>Trafienia: ${result.hits.length} · Pominięte pasujące: ${result.missed.length} · Błędnie zaznaczone: ${result.wrong.length}</p>${details}</div><button class="primary" id="next">${last ? 'Zobacz wynik' : 'Następne pytanie'} <span>→</span></button>`;
  document.querySelector('#next').onclick = () => { herbState.index++; herbState.index < round.length ? showHerbQuestion() : finishHerbs(); };
  document.querySelector('#feedback').scrollIntoView({ block: 'nearest' });
}

function finishHerbs() {
  const { kind, round, points, mistakes, review } = herbState;
  app.innerHTML = `<section class="result"><div class="result-leaf">✿</div><div class="eyebrow">${review ? 'POWTÓRKA ZAKOŃCZONA' : herbQuizzes[kind].label}</div><h1>${mistakes.length ? 'Wiedza rośnie z powtórką.' : 'Pięknie łączysz kropki.'}</h1><p>Pytania bez pomyłek: <strong>${round.length - mistakes.length} z ${round.length}</strong>.</p><div class="result-score">${points}<span> / ${round.length * 100} pkt</span></div>${mistakes.length ? `<button class="primary" id="review">Powtórz pomyłki (${mistakes.length}) <span>↻</span></button>` : ''}<button class="${mistakes.length ? 'secondary' : 'primary'}" id="again">Nowa runda: ${herbQuizzes[kind].title} <span>→</span></button><button class="text-button" id="home">Wróć na stronę główną</button></section>`;
  const retry = document.querySelector('#review');
  if (retry) retry.onclick = () => startHerbs(kind, mistakes);
  document.querySelector('#again').onclick = () => startHerbs(kind);
  document.querySelector('#home').onclick = home;
}

function herbCatalog() {
  app.innerHTML = `<section class="catalog"><button class="text-button" id="catalog-home">← Strona główna</button><div class="eyebrow">MODUŁ · ZIOŁA</div><h1>Baza ziół</h1><p>${herbs.length} podstawowych surowców roślinnych. Opisy tradycyjnych działań w TCM; materiał edukacyjny, nie porada ani receptura. Nazwy narządów oznaczają systemy funkcjonalne TCM.</p><div class="catalog-filters"><label>Szukaj zioła<input type="search" id="herb-search" placeholder="np. Shan Yao, żeń-szeń, Panax, Yin Nerek"></label><label>Narząd<select id="herb-organ"><option value="">Wszystkie narządy</option>${organs.map(o => `<option>${o}</option>`).join('')}</select></label></div><p id="catalog-count" aria-live="polite"></p><div id="pattern-list"></div></section>`;
  document.querySelector('#catalog-home').onclick = home;
  const refresh = () => {
    const query = document.querySelector('#herb-search').value.trim().toLocaleLowerCase('pl');
    const organ = document.querySelector('#herb-organ').value;
    const found = herbs.filter(h => (!organ || h.organs.some(x => x.organ === organ)) && `${h.pinyin} ${h.polish} ${h.latinNote} ${h.associations} ${h.actions}`.toLocaleLowerCase('pl').includes(query));
    document.querySelector('#catalog-count').textContent = `Wyniki: ${found.length} z ${herbs.length}`;
    document.querySelector('#pattern-list').innerHTML = found.length ? found.map(h => `<article class="pattern-entry herb-entry"><div class="pattern-entry-top"><span>${String(h.number).padStart(2, '0')} · ${h.part}</span><span class="source-badge">${h.temperature} · ${h.taste.join(', ')}</span></div><h2>${herbName(h, 'large')}</h2>${h.latinNote !== h.latin ? `<p class="source-note">${h.latinNote}.</p>` : ''}<p><strong>Główne skojarzenia:</strong> ${h.associations}.</p><p><strong>Działania:</strong> ${h.actions}.</p>${h.distinction ? `<p><strong>Rozróżnienie:</strong> ${h.distinction}.</p>` : ''}<div class="observations"><strong>Narządy</strong><ul class="herb-facts">${organNotes(h)}</ul><strong>Meridiany (Me & Qi)</strong><p>${h.meridians.join(', ')}</p></div>${herbSources(h)}</article>`).join('') : '<p>Brak ziół dla wybranych filtrów.</p>';
  };
  document.querySelector('#herb-search').oninput = refresh;
  document.querySelector('#herb-organ').onchange = refresh;
  refresh();
}

home();
