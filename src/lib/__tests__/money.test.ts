// Money formatting for the Partner Program (src/lib/money.ts). The server
// speaks whole rupiah and basis points; these pin the strings a partner
// reads off their dashboard.
//
// Run: npm test   (vitest)

import { test } from 'vitest';
import assert from 'node:assert/strict';
import { formatBps, formatDay, formatRupiah } from '../money';

/** Intl may join groups with an ordinary space or an NBSP; compare digits and separators only. */
const plain = (s: string) => s.replace(/[   ]/g, ' ');

test('formatRupiah: whole rupiah, literal Rp, grouping per language', () => {
  assert.equal(plain(formatRupiah(0, 'id')), 'Rp 0');
  assert.equal(plain(formatRupiah(14549, 'id')), 'Rp 14.549');
  assert.equal(plain(formatRupiah(1234567, 'id')), 'Rp 1.234.567');
  assert.equal(plain(formatRupiah(14549, 'en')), 'Rp 14,549');
  assert.equal(plain(formatRupiah(1234567, 'tr')), 'Rp 1.234.567');
  // Western digits for the RTL languages — never Eastern-Arabic numerals.
  assert.equal(plain(formatRupiah(1234567, 'ar')), 'Rp 1,234,567');
  assert.equal(plain(formatRupiah(1234567, 'ur')), 'Rp 1,234,567');
});

test('formatRupiah: a clawback keeps its sign; fractions are dropped', () => {
  assert.equal(plain(formatRupiah(-5000, 'id')), 'Rp −5.000');
  assert.equal(plain(formatRupiah(8775.9, 'id')), 'Rp 8.775');
  assert.equal(plain(formatRupiah(Number.NaN)), 'Rp 0');
});

test('formatBps: a fraction of a percent is never rounded away', () => {
  assert.equal(formatBps(3000, 'id'), '30%');
  assert.equal(formatBps(3000, 'en'), '30%');
  assert.equal(formatBps(2755, 'id'), '27,55%');
  assert.equal(formatBps(2755, 'en'), '27.55%');
  assert.equal(formatBps(2750, 'id'), '27,5%');
  assert.equal(formatBps(1, 'id'), '0,01%');
  assert.equal(formatBps(0, 'id'), '0%');
});

test('formatDay: short month in the reader language, unreadable stamps pass through', () => {
  assert.equal(formatDay('2026-11-27T04:44:24Z', 'en'), 'Nov 27, 2026');
  assert.equal(formatDay('not-a-date', 'id'), 'not-a-date');
  const id = formatDay('2026-11-27T04:44:24Z', 'id');
  assert.match(id, /^27 .* 2026$/);
});
