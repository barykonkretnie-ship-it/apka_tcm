// Herb quizzes: one correct answer out of three. Wrong options come only from patterns of a
// different organ and a different family, so a distractor never fits the question.
export const herbQuizzes = {
  'pattern-herb': { title: 'Dobierz zioło do wzorca', label: 'WZORZEC → ZIOŁO', hint: 'Wzorzec, np. Niedobór Yin Serca → wybierz 1 z 3 ziół' },
  'herb-pattern': { title: 'Dobierz wzorzec do zioła', label: 'ZIOŁO → WZORZEC', hint: 'Zioło → wybierz 1 z 3 wzorców' },
  'symptoms-herb': { title: 'Dobierz zioło do objawów', label: 'OBJAWY → ZIOŁO', hint: 'Objawy wzorca → wybierz 1 z 3 ziół' },
};
export const roundSize = 10;

export function mixHerbs(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const patternById = id => herbPatterns.find(p => p.id === id);
export const herbById = id => herbs.find(h => h.id === id);
export const herbsOf = pattern => herbs.filter(h => h.pattern === pattern.id);

export function safeDistractors(pattern) {
  return herbPatterns.filter(p => p.organ !== pattern.organ && p.family !== pattern.family);
}

export function herbQuestion(kind, subject, random = Math.random) {
  if (kind === 'herb-pattern') {
    const pattern = patternById(subject.pattern);
    const wrong = mixHerbs(safeDistractors(pattern), random).slice(0, 2).map(p => p.id);
    return { kind, herb: subject, pattern, answer: pattern.id, options: mixHerbs([pattern.id, ...wrong], random) };
  }
  const wrongPatterns = mixHerbs(safeDistractors(subject), random).slice(0, 2);
  const pick = list => mixHerbs(list, random)[0].id;
  const answer = pick(herbsOf(subject));
  const question = { kind, pattern: subject, answer, options: mixHerbs([answer, ...wrongPatterns.map(p => pick(herbsOf(p)))], random) };
  if (kind === 'symptoms-herb') {
    // Show symptoms that do not also describe the patterns behind the wrong options.
    const shared = new Set(wrongPatterns.flatMap(p => p.symptoms));
    question.symptoms = mixHerbs(subject.symptoms.filter(s => !shared.has(s)), random).slice(0, 4);
  }
  return question;
}

export function herbRound(kind, random = Math.random) {
  const subjects = kind === 'herb-pattern' ? herbs : herbPatterns;
  return mixHerbs(subjects, random).slice(0, roundSize).map(s => herbQuestion(kind, s, random));
}
