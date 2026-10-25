// Each distractor represents a different source-based picture. The authoring layer
// excludes whole symptom families that also occur anywhere in the target sources.
const alternatives = [
  ['Gorzki smak w ustach', /gorz|bitter/i],
  ['Kwaśny refluks z częstym odbijaniem', /kwaś|refluks|odbij|acid|belch|reflux/i],
  ['Nawracające koszmary i niespokojne sny', /sny|sen|koszmar|dream|sleep|insomnia|bezsen/i],
  ['Obfite, białe upławy', /upław|pochw|wydzielina|genital|vagin|discharge/i],
  ['Kaszel z gęstą, żółtozieloną plwociną', /kaszel|plwocin|flegm|cough|sputum|phlegm/i],
  ['Wodnisty, przezroczysty katar', /katar|nos|nasal|nose|runny|cold|przezięb/i],
  ['Pieczenie i ból przy oddawaniu moczu', /mocz|mikcj|urin|bladder/i],
  ['Obfite, jasne oddawanie moczu', /mocz|mikcj|urin|bladder/i],
  ['Silna, cuchnąca biegunka z krwią lub śluzem', /stol|stole|bieg|jelit|bowel|stool|diarrh|dysenter|constipat/i],
  ['Suche, twarde stolce z zaparciem', /stol|stole|bieg|zapar|jelit|bowel|stool|diarrh|constipat/i],
  ['Przedmiesiączkowe obrzmienie piersi', /miesi|piersi|menstr|breast|premenstrual/i],
  ['Obfite miesiączki ze skrzepami', /miesi|krwaw|menstr|uter|bleed|clot/i],
  ['Wypadanie narządów z uczuciem opadania', /wypadan|opadan|prolaps|bearing.down|sinking/i],
  ['Bolesny obrzęk i krwawienie dziąseł', /dziąs|krwaw|zęb|teeth|tooth|gum|bleed/i],
  ['Nadmierny głód mimo częstego jedzenia', /głód|głod|głodu|apetyt|hunger|hungry|appetite|eat/i],
  ['Żółtaczka: zażółcenie skóry i białek oczu', /żółta twarz|zażół|żółtac|jaundice|yellowing|yellow.*skin/i],
  ['Afty i bolesne owrzodzenia języka', /aft|owrz|język|mouth ulcer|tongue|sore.*mouth|mouth.*sore/i],
  ['Zaczerwienione, bolesne oczy', /ocz|wzrok|widzen|eye|vision/i],
  ['Drgawki i nagłe odchylenie ust', /drgaw|niedowład|poraż|usta|convuls|paraly|seizure|tremor|deviation/i],
  ['Nocne poty z gorącem dłoni i stóp', /pot|gorąc|ciepł|sweat|heat|hot|flushing/i],
  ['Lodowate kończyny i zimne ciało', /zimn|cold|chill|cool|limb|kończyn/i],
  ['Bolesny obrzęk i świąd narządów płciowych', /płciow|upław|pochw|wydzielina|genital|vagin|discharge|itch/i],
  ['Stały, kłujący ból klatki z purpurowymi ustami', /kłuj|przeszyw|klat|serc|purpur|fiolet|stabbing|pricking|purple|chest|palpitat/i],
  ['Nagły obrzęk powiek i twarzy', /obrzęk|spuch|swelling|oedema|edema|puff/i],
  ['Silny skroniowy ból głowy z czerwonymi oczami', /głow|ocz|headache|dizz|eye|vertigo/i],
  ['Zimne wymioty przejrzystymi płynami', /wymiot|żołąd|nudno|vomit|nausea|stomach/i],
  ['Brak potu przy wodnistym katarze', /pot|katar|sweat|nose|nasal|runny/i],
  ['Trudność we wdechu z osłabieniem lędźwi', /wdech|duszno|oddech|lędźw|plec|breath|inhal|back|asthma/i],
];

export const questions = patterns.filter(p => p.quizEnabled).map(p => ({
  ...p,
  evidence: p.symptoms,
  symptoms: p.symptoms.map(s => s.text),
  explanation: `W tym opracowaniu zwróć uwagę na: ${p.symptoms.slice(0, 4).map(s => s.text.toLocaleLowerCase('pl')).join('; ')}. Objawy rozpatruj jako zestaw; pojedyncza cecha nie rozstrzyga wzorca.`,
  clue: p.symptoms.slice(0, 3).map(s => s.text).join(' · '),
}));

export function shuffled(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function prepareQuestion(question, random = Math.random) {
  const sourceText = question.exclusionText || question.symptoms.join(' ');
  const excluded = new Set(question.symptoms);
  const distractors = shuffled(alternatives.filter(([label, pattern]) => !excluded.has(label) && !pattern.test(sourceText)).map(([label]) => label), random);
  const positiveCount = Math.min(6, question.symptoms.length);
  // Do not silently fill missing distractors with potentially valid symptoms.
  if (distractors.length < 12 - positiveCount) throw new Error(`Brak bezpiecznej puli propozycji dla ${question.id}`);
  return { ...question, symptoms: shuffled(question.symptoms, random).slice(0, positiveCount), distractors: distractors.slice(0, 12 - positiveCount) };
}

export function symptomChoices(question, random = Math.random) {
  return shuffled([...question.symptoms, ...question.distractors], random);
}

export function evaluate(question, selected) {
  const unique = new Set(selected);
  const hits = question.symptoms.filter(s => unique.has(s));
  const missed = question.symptoms.filter(s => !unique.has(s));
  const wrong = [...unique].filter(s => !question.symptoms.includes(s));
  return { correct: missed.length === 0 && wrong.length === 0,
    points: Math.max(0, Math.round((hits.length - wrong.length) / question.symptoms.length * 100)), hits, missed, wrong };
}
