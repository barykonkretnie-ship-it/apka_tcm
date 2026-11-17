import test from 'node:test';
import assert from 'node:assert/strict';
import { herbs, herbPatterns, herbQuestion, herbRound, herbsOf, patternById, herbById, safeDistractors } from '../public/herbs.js';
import { patterns } from '../public/questions.js';

const seeds = [0, .25, .5, .99].map(seed => () => seed);

test('21 wzorców po dwa zioła, każde z nazwą pinyin, polską i łacińską', () => {
  assert.equal(herbPatterns.length, 21);
  assert.equal(herbs.length, 42);
  assert.equal(new Set(herbs.map(h => h.id)).size, 42);
  for (const p of herbPatterns) assert.equal(herbsOf(p).length, 2, p.name);
  for (const h of herbs) for (const field of ['pinyin', 'polish', 'latin']) assert.ok(h[field], `${h.id}.${field}`);
  assert.deepEqual(herbsOf(herbPatterns.find(p => p.name === 'Niedobór Yin Serca')).map(h => h.pinyin), ['Sheng Di Huang', 'Mai Men Dong']);
  assert.equal(herbs.filter(h => h.leading).length, 10);
});

test('objawy pochodzą z odpowiadającego wzorca w bazie', () => {
  for (const p of herbPatterns) {
    const base = patterns.find(x => x.id === p.patternRef);
    assert.ok(base.quizEnabled, p.name);
    assert.deepEqual(p.symptoms, base.symptoms.map(s => s.text));
  }
});

test('błędne odpowiedzi są z innego narządu i innej rodziny wzorców', () => {
  for (const p of herbPatterns) {
    assert.ok(safeDistractors(p).length >= 4, p.name);
    for (const kind of ['pattern-herb', 'symptoms-herb']) for (const random of seeds) {
      const q = herbQuestion(kind, p, random);
      assert.equal(q.options.length, 3);
      assert.equal(new Set(q.options).size, 3);
      assert.equal(herbById(q.answer).pattern, p.id);
      for (const id of q.options.filter(id => id !== q.answer)) {
        const other = patternById(herbById(id).pattern);
        assert.notEqual(other.organ, p.organ);
        assert.notEqual(other.family, p.family);
      }
      if (kind === 'symptoms-herb') {
        assert.ok(q.symptoms.length >= 3, p.name);
        const wrong = q.options.filter(id => id !== q.answer).flatMap(id => patternById(herbById(id).pattern).symptoms);
        assert.ok(q.symptoms.every(s => p.symptoms.includes(s) && !wrong.includes(s)), p.name);
      }
    }
  }
});

test('Sheng Di Huang i Shu Di Huang nigdy nie są błędną odpowiedzią dla siebie nawzajem', () => {
  const yinSerca = herbPatterns.find(p => p.name === 'Niedobór Yin Serca');
  for (const random of seeds) assert.ok(!herbQuestion('pattern-herb', yinSerca, random).options.includes('shu-di-huang'));
});

test('zioło → wzorzec: jeden poprawny wzorzec z trzech', () => {
  for (const h of herbs) for (const random of seeds) {
    const q = herbQuestion('herb-pattern', h, random);
    assert.equal(new Set(q.options).size, 3);
    assert.equal(q.answer, h.pattern);
    assert.equal(q.options.filter(id => herbsOf(patternById(id)).some(x => x.id === h.id)).length, 1);
  }
});

test('runda ma 10 pytań', () => {
  for (const kind of ['pattern-herb', 'herb-pattern', 'symptoms-herb']) assert.equal(herbRound(kind).length, 10);
});
