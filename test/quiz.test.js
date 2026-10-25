import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { patterns, questions, shuffled, evaluate, symptomChoices, prepareQuestion } from '../public/questions.js';

test('wszystkie wiersze Kompendium mają stronę, objawy i oddzielny identyfikator', async () => {
  const extracted = JSON.parse(await readFile(new URL('../content/kompendium-extracted.json', import.meta.url)));
  assert.equal(patterns.length, 80);
  assert.deepEqual(patterns.map(p => p.number), extracted.map(p => p.number));
  assert.equal(new Set(patterns.map(p => p.id)).size, 80);
  for (const p of patterns) {
    assert.equal(p.page, extracted.find(r => r.number === p.number).page);
    assert.ok(p.symptoms.length >= 3);
    assert.equal(new Set(p.symptoms.map(s => s.text)).size, p.symptoms.length);
    assert.ok(p.symptoms.every(s => s.sources.length && s.sources.every(x => ['kompendium','meandqi'].includes(x))));
  }
});

test('nie utożsamiamy opisów powiązanych z bezpośrednim odpowiednikiem', () => {
  for (const p of patterns.filter(p => p.sourceStatus !== 'matched')) {
    assert.ok(p.symptoms.every(s => !s.sources.includes('meandqi')), p.id);
  }
  assert.equal(patterns.filter(p => p.sourceStatus === 'matched').length, 65);
  assert.equal(patterns.filter(p => p.sourceStatus === 'related-only').length, 9);
  assert.equal(patterns.filter(p => p.sourceStatus === 'unmatched').length, 6);
});

test('niejasne opisy pozostają w katalogu, poza punktowanym quizem', () => {
  assert.deepEqual(patterns.filter(p => !p.quizEnabled).map(p => p.id), ['k19','k35','k44','k59','k79']);
  assert.equal(questions.length, 75);
  assert.ok(questions.every(q => q.quizEnabled));
});

test('wszystkie wzorce generują 12 propozycji bez własnych objawów wśród dystraktorów', () => {
  const before = JSON.stringify(questions);
  for (const base of questions) for (const seed of [0, .25, .5, .99]) {
    const q = prepareQuestion(base, () => seed);
    const choices = symptomChoices(q);
    assert.equal(choices.length, 12, q.id);
    assert.equal(new Set(choices).size, 12, q.id);
    assert.equal(q.symptoms.length, Math.min(base.symptoms.length, 6));
    assert.ok(q.symptoms.every(s => base.symptoms.includes(s)));
    assert.ok(q.distractors.every(s => !base.symptoms.includes(s)), q.id);
    assert.equal(evaluate(q, q.symptoms).points, 100);
    assert.equal(evaluate(q, q.symptoms).correct, true);
    assert.equal(evaluate(q, choices).points, 0);
  }
  assert.equal(JSON.stringify(questions), before);
});

test('wspólny objaw jest poprawny dla obu wzorców, nie jednego właściciela', () => {
  for (const id of ['k03', 'k30', 'k60']) assert.ok(questions.find(q => q.id === id).symptoms.includes('Nocne poty'));
  const spleen = patterns.find(p => p.id === 'k39');
  assert.deepEqual(spleen.symptoms.find(s => s.text === 'Luźne stolce').sources, ['kompendium', 'meandqi']);
  assert.ok(patterns.find(p => p.id === 'k26').symptoms.some(s => s.text === 'Kwaśny smak w ustach'));
  assert.ok(patterns.find(p => p.id === 'k26').symptoms.some(s => s.text === 'Gorzki smak w ustach'));
});

test('punktacja uwzględnia zmienną liczbę trafień i nie nalicza podwójnie', () => {
  const q = prepareQuestion(questions[0]);
  const partial = evaluate(q, [q.symptoms[0], q.symptoms[1], q.distractors[0]]);
  assert.equal(partial.points, Math.round(100 / q.symptoms.length));
  assert.equal(partial.hits.length, 2);
  assert.equal(partial.missed.length, q.symptoms.length - 2);
  assert.equal(partial.wrong.length, 1);
  assert.equal(partial.correct, false);
  assert.equal(evaluate(q, []).points, 0);
  assert.equal(evaluate(q, []).correct, false);
  assert.equal(evaluate(q, [...q.symptoms, q.symptoms[0]]).points, 100);
});

test('losowanie nie zmienia bazy', () => {
  const original = [...questions];
  const result = shuffled(questions, () => 0);
  assert.deepEqual(questions, original);
  assert.deepEqual(new Set(result), new Set(questions));
  assert.notDeepEqual(result, original);
});
