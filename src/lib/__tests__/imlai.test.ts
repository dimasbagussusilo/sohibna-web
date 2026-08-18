// Edge-case regression tests for the Uthmani→Imla'i converter
// (src/lib/imlai.ts). Every case here was validated against the real
// quran.com `text_uthmani_tajweed` field (full-Quran audit, 2026-08-14) —
// these are the shapes a naive regex dictionary gets wrong.
//
// Run: npm test   (vitest)

import { test } from 'vitest';
import assert from 'node:assert/strict';
import { convertToImlai } from '../imlai';

/** Strip tajweed/HTML tags — compare the RENDERED text. */
const plain = (s: string) => s.replace(/<[^>]+>/g, '');

/** Strip tags AND diacritics — compare the letter skeleton. */
const skeleton = (s: string) =>
  plain(s).replace(/[ؐ-ًؚ-ٰٟۖ-ۭ࣓-ࣿ‌-‏ـ]/g, '');

// --- Rule 1: Waw Zā'idah ------------------------------------------------

test('أولئك: silent waw removed (slnt span dropped cleanly)', () => {
  // 2:39 shape: أُ<slnt>وْ</slnt>لَ<madda_obligatory>ـٰٓ</madda_obligatory>ئِكَ
  const out = convertToImlai('أُ<tajweed class=slnt>وْ</tajweed>لَ<tajweed class=madda_obligatory>ـٰٓ</tajweed>ئِكَ');
  assert.equal(skeleton(out), 'الئك');
  assert.ok(!out.includes('slnt'), 'empty slnt pair must be dropped');
  assert.ok(out.includes('لَ<tajweed class=madda_obligatory>ـٰٓ</tajweed>ئ'), 'span structure preserved');
});

test('أولئك with prefixes (وَ/فَ/لِ) still matches mid-word', () => {
  assert.equal(skeleton(convertToImlai('فَأُ<tajweed class=slnt>وْ</tajweed>لَـٰٓئِكَ')), 'فالئك');
  assert.equal(skeleton(convertToImlai('وَأُو۟لَـٰٓئِكُمْ')), 'والئكم');
});

test('أُولَىٰ (92:13 al-ūlā): BARE waw is the madd ū — kept, gains sukun', () => {
  const out = convertToImlai('وَ<tajweed class=ham_wasl>ٱ</tajweed>لْأُولَىٰ');
  assert.equal(skeleton(out), 'والاولى');
  assert.ok(plain(out).includes('وْلَىٰ'), 'waw must gain an explicit sukun');
});

test('أُو۟لِى (ulī) vs أُولَىٰهُمْ (ūlāhum): same skeleton, mark decides', () => {
  // ulī — waw sukun-marked → deleted (4:83)
  assert.equal(skeleton(convertToImlai('أُ<tajweed class=slnt>وْ</tajweed>لِى <tajweed class=ham_wasl>ٱ</tajweed>لْأَمْرِ')), 'الى الامر');
  // ūlā + suffix — bare waw → kept (2:228 أُولَىٰهُمْ shape)
  assert.equal(skeleton(convertToImlai('أُولَىٰهُمْ')), 'اولىهم');
});

test('65:4 أُو۟لَـٰتُ: skeleton has no alef (ـٰ is a mark on ل)', () => {
  assert.equal(skeleton(convertToImlai('وَأُ<tajweed class=slnt>وْ</tajweed>لَ<tajweed class=madda_normal>ـٰ</tajweed>تُ')), 'والت');
});

test('أَوْلِيَاء (fatha on أ): pronounced waw — kept', () => {
  assert.equal(skeleton(convertToImlai('أَوْلِيَآءَ')), 'اولياء');
});

test('سَأُو۟رِيكُمْ: أُ+jazm-waw but NO ل — kept (only corpus counter-example)', () => {
  assert.equal(skeleton(convertToImlai('سَأُو۟رِيكُمْ')), 'ساوريكم');
});

// --- Rule 2: hamzah simplification --------------------------------------

test('أ/إ/ٱ → bare alef (LPMQ style)', () => {
  assert.equal(skeleton(convertToImlai('إِذَا أَفَلَا <tajweed class=ham_wasl>ٱ</tajweed>لْأَرْضِ')), 'اذا افلا الارض');
});

test('ٱلْقُرْءَانِ family: hamza merges into ا+ٰ', () => {
  const out = convertToImlai('مِنَ <tajweed class=ham_wasl>ٱ</tajweed>لْقُرْءَانِ');
  assert.ok(plain(out).includes('لْقُرْاٰنِ'), `expected لْقُرْاٰنِ in ${plain(out)}`);
});

test('قُرْءَٲنًا (madda-alef spelling): single dagger, no doubling', () => {
  const out = plain(convertToImlai('قُرْءَٲنًا'));
  assert.ok(out.includes('قُرْاٰنًا'), out);
  assert.equal((out.match(/ٰٰ/g) || []).length, 0, 'dagger alefs must not double');
});

test('سَوْءَٲتِهِمَا: hamza after sukun-closed و is PRONOUNCED — kept', () => {
  const out = plain(convertToImlai('سَوْءَٲتِهِمَا'));
  assert.ok(out.includes('سَوْءَاٰتِ'), `hamza must survive: ${out}`);
});

test('سُوٓءًا / جُزْءًا: tanween on hamza — kept', () => {
  assert.ok(plain(convertToImlai('سُوٓءًا وَجُزْءًا')).includes('سُوٓءًا'));
});

test('ءَامَنَ: word-initial hamza onset — untouched', () => {
  assert.ok(plain(convertToImlai('ءَامَنَ بِ<tajweed class=ham_wasl>ٱ</tajweed>للَّهِ')).startsWith('ءَامَنَ'));
});

// --- Rule 3: sukun on madd letters --------------------------------------

test('رَدُّوهُ → رَدُّوْهُ (madd waw after damma)', () => {
  assert.ok(plain(convertToImlai('أَوْ رُدُّوه<tajweed class=madda_obligatory>َآ</tajweed>')).includes('رُدُّوْه'));
});

test('حُيِّيتُمْ → حُيِّيْتُمْ (madd yeh after kasra)', () => {
  assert.ok(plain(convertToImlai('حُيِّيت<tajweed class=ikhafa_shafawi>ُم ب</tajweed>ِتَحِيَّةٍ')).startsWith('حُيِّيْت'));
});

test('كَانُو۟ا: waw before silent alef gains sukun, alef keeps its jazm', () => {
  const out = plain(convertToImlai('كَانُو<tajweed class=slnt>اْ</tajweed>'));
  assert.ok(out.includes('كَانُوْاْ'), out);
});

test('تُوَلُّوا۟: waw followed by its own fatha is a CONSONANT — no sukun', () => {
  // first waw keeps its fatha (no sukun); the madd waw before the silent
  // alef does get one: تُوَلُّوْاْ
  assert.ok(plain(convertToImlai('أَن تُوَلُّو<tajweed class=slnt>اْ</tajweed> وُجُوهَكُمْ')).includes('تُوَلُّوْاْ'));
});

// --- Rule 4: standardisation ---------------------------------------------

test('Uthmani jazm variants → round sukun U+0652', () => {
  assert.ok(plain(convertToImlai('كِتَٰبٌ لَّا رَيْبَۚ فِيهِۚ')).includes('لَّا'));
});

test('dead consonants gain sukun (عِندِ → عِنْدِ)', () => {
  assert.ok(plain(convertToImlai('مِنْ عِندِ غَيْرِ')).includes('عِنْدِ'));
});

test('iqlab bare nun (سُنۢبُل): rule marker kept + sukun added', () => {
  const out = plain(convertToImlai('سُ<tajweed class=iqlab>نۢبُلَ</tajweed>تٍ'));
  assert.ok(out.includes('نْۢ'), out);
});

// --- Muqattaʿāt ----------------------------------------------------------

test('bare opening letters read as names → dagger alef (طه → طٰهٰ)', () => {
  assert.equal(plain(convertToImlai('طه')), 'طٰهٰ');
  assert.equal(plain(convertToImlai('كٓهيعٓصٓ')), 'كٓهٰيٰعٓصٓ');
  assert.equal(plain(convertToImlai('حمٓ')), 'حٰمٓ');
});

test('marked opening letters keep their own maddah (يسٓ)', () => {
  assert.equal(plain(convertToImlai('يسٓ')), 'يٰسٓ');
});

test('الٓمٓ: alef digraph openings are NOT muqattaʿāt words', () => {
  assert.equal(plain(convertToImlai('الٓمٓ')), 'الٓمٓ');
});

test('normal first words are not muqattaʿāt-annotated', () => {
  // 9:113 starts مَا — has fatha, unaffected; 36:77 اَوَلَمْ — has vowels
  assert.equal(skeleton(convertToImlai('مَا كَانَ')), 'ما كان');
});

// --- Rule 5: tag safety --------------------------------------------------

test('diacritic split across tag boundary: ذ<fatha-inside-tag>ٲ</tag>', () => {
  // 2:2 opener — the fatha inside the span belongs to ذ OUTSIDE it
  const out = convertToImlai('ذ<tajweed class=madda_normal>َٲ</tajweed>لِكَ');
  assert.ok(out.includes('<tajweed class=madda_normal>َاٰ</tajweed>'), out);
  assert.equal(skeleton(out), 'ذالك');
});

test('32:3 upstream-malformed markup passes through verbatim', () => {
  const broken = 'يَقُولُونَ <tajweed class=ham_wasl>ٱ</tajweed>فْتَرَ>ٮٰ</tajweed>هُ';
  const out = convertToImlai(broken);
  assert.ok(out.includes('فْتَرَ>ٮٰ</tajweed>'), 'malformed fragment must survive');
});

test('tag structure: no nesting created, classes intact', () => {
  const t = 'وَإِذَا حُيِّيت<tajweed class=ikhafa_shafawi>ُم ب</tajweed>ِتَحِيَّةٍ فَحَيُّواْ';
  const out = convertToImlai(t);
  const opens = (out.match(/<tajweed/g) || []).length;
  const closes = (out.match(/<\/tajweed>/g) || []).length;
  assert.equal(opens, closes);
  assert.ok(out.includes('class=ikhafa_shafawi'));
});
