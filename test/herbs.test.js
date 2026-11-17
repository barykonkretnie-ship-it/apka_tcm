import test from 'node:test';
import assert from 'node:assert/strict';
import { herbs, organs, meridians, herbQuestion, herbRound, evaluateChoice, channelOnlyOrgans } from '../public/herbs.js';

const seeds = [0, .25, .5, .99].map(seed => () => seed);

test('baza ma 20 ziół z nazwą pinyin, polską, łacińską i źródłem', () => {
  assert.equal(herbs.length, 20);
  assert.equal(new Set(herbs.map(h => h.id)).size, 20);
  for (const h of herbs) {
    for (const field of ['pinyin', 'polish', 'latin', 'part', 'actions']) assert.ok(h[field], `${h.id}.${field}`);
    assert.ok(h.sources.length && h.sources.every(url => url.startsWith('https://www.meandqi.com/')), h.id);
    assert.ok(h.organs.length && h.organs.every(o => organs.includes(o.organ) && o.directions.length), h.id);
    assert.ok(h.meridians.length && h.meridians.every(m => meridians.includes(m)), h.id);
  }
});

test('mapa narządów odpowiada przykładowym wierszom bazy', () => {
  const organsOf = id => herbs.find(h => h.id === id).organs.map(o => o.organ).sort();
  assert.deepEqual(organsOf('yin-yang-huo'), ['Nerki']);
  assert.deepEqual(organsOf('bai-shao'), ['Wątroba']);
  assert.deepEqual(organsOf('mai-men-dong'), ['Płuca', 'Serce', 'Żołądek']);
  assert.deepEqual(herbs.find(h => h.id === 'gui-zhi').meridians, ['Serce', 'Płuca', 'Pęcherz moczowy']);
});

test('zioło → narząd i zioło → meridian: poprawne odpowiedzi dają 100 pkt', () => {
  for (const h of herbs) for (const kind of ['herb-organ', 'herb-meridian']) {
    const q = herbQuestion(kind, h);
    assert.ok(q.correct.length && q.correct.every(x => q.options.includes(x)), h.id);
    assert.deepEqual(evaluateChoice(q, q.correct), { correct: true, points: 100, hits: q.correct, missed: [], wrong: [] });
  }
});

test('meridian bez wpisu w mapie narządów nie jest liczony jako błąd', () => {
  const goji = herbs.find(h => h.id === 'gou-qi-zi');
  assert.deepEqual(channelOnlyOrgans(goji), ['Płuca']);
  const q = herbQuestion('herb-organ', goji);
  assert.equal(evaluateChoice(q, [...q.correct, 'Płuca']).points, 100);
  assert.equal(evaluateChoice(q, [...q.correct, 'Serce']).wrong.length, 1);
});

test('narząd → zioła: dystraktory nie są powiązane z narządem ani jego meridianem', () => {
  for (const organ of organs) for (const random of seeds) {
    const q = herbQuestion('organ-herbs', organ, random);
    assert.equal(q.options.length, 10, organ);
    assert.equal(new Set(q.options).size, 10, organ);
    for (const id of q.options) {
      const h = herbs.find(x => x.id === id);
      const linked = h.organs.some(o => o.organ === organ);
      assert.equal(q.correct.includes(id), linked, `${organ}: ${id}`);
      if (!linked) assert.ok(!h.meridians.includes(organ), `${organ}: ${id}`);
    }
    assert.equal(evaluateChoice(q, q.correct).points, 100);
    assert.equal(evaluateChoice(q, q.options.filter(id => !q.correct.includes(id))).points, 0);
  }
});

test('rundy mają 8 ziół lub wszystkie narządy', () => {
  assert.equal(herbRound('herb-organ').length, 8);
  assert.equal(herbRound('herb-meridian').length, 8);
  assert.deepEqual(herbRound('organ-herbs').map(q => q.organ).sort(), [...organs].sort());
});
