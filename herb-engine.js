// Herb quizzes. Organ answers come from the organ map and herb cards of the source file;
// meridian answers come from "Channels Entered" in the Me & Qi monographs.
export const organs = ['Nerki', 'Śledziona', 'Żołądek', 'Płuca', 'Serce', 'Wątroba'];
export const meridians = ['Płuca', 'Jelito grube', 'Żołądek', 'Śledziona', 'Serce', 'Jelito cienkie', 'Pęcherz moczowy', 'Nerki', 'Osierdzie', 'Potrójny Ogrzewacz', 'Pęcherzyk żółciowy', 'Wątroba'];

export const herbQuizzes = {
  'herb-organ': { title: 'Dopasuj zioło do narządu', label: 'ZIOŁO → NARZĄD', unit: 'Zioło' },
  'organ-herbs': { title: 'Wybierz zioła do narządu', label: 'NARZĄD → ZIOŁA', unit: 'Narząd' },
  'herb-meridian': { title: 'Połącz zioło z meridianem', label: 'ZIOŁO → MERIDIAN', unit: 'Zioło' },
};

export function mixHerbs(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function herbOrgans(herb) {
  return organs.filter(o => herb.organs.some(x => x.organ === o));
}

export function herbsForOrgan(organ) {
  return herbs.filter(h => herbHas(h, organ));
}

function herbHas(herb, organ) {
  return herb.organs.some(x => x.organ === organ);
}

// Organs the herb's channel enters (Me & Qi) without a link in the organ map: never scored as wrong.
export function channelOnlyOrgans(herb) {
  return organs.filter(o => herb.meridians.includes(o) && !herbHas(herb, o));
}

// A question holds `correct` and `options` as ids: organ/meridian names or herb ids.
export function herbQuestion(kind, subject, random = Math.random) {
  if (kind === 'herb-organ') return { kind, herb: subject, correct: herbOrgans(subject), neutral: channelOnlyOrgans(subject), options: organs };
  if (kind === 'herb-meridian') return { kind, herb: subject, correct: meridians.filter(m => subject.meridians.includes(m)), neutral: [], options: meridians };
  const matching = herbsForOrgan(subject).map(h => h.id);
  const shown = mixHerbs(matching, random).slice(0, Math.min(6, matching.length));
  const distractors = mixHerbs(herbs.filter(h => !herbHas(h, subject) && !h.meridians.includes(subject)).map(h => h.id), random).slice(0, 10 - shown.length);
  return { kind, organ: subject, correct: shown, neutral: [], options: mixHerbs([...shown, ...distractors], random) };
}

export function herbRound(kind, random = Math.random) {
  const subjects = kind === 'organ-herbs' ? organs : herbs;
  return mixHerbs(subjects, random).slice(0, kind === 'organ-herbs' ? organs.length : 8).map(s => herbQuestion(kind, s, random));
}

export function evaluateChoice(question, selected) {
  const unique = new Set(selected);
  const hits = question.correct.filter(x => unique.has(x));
  const missed = question.correct.filter(x => !unique.has(x));
  const wrong = [...unique].filter(x => !question.correct.includes(x) && !question.neutral?.includes(x));
  return { correct: missed.length === 0 && wrong.length === 0,
    points: Math.max(0, Math.round((hits.length - wrong.length) / question.correct.length * 100)), hits, missed, wrong };
}
