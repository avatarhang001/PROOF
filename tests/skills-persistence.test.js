import test from 'node:test';
import assert from 'node:assert/strict';
import { testbed, copyOnReadStore } from './helpers.js';
import { SkillService } from '../server/services/skills.js';

/**
 * Regression: applyProofResult() — the core "prove your skill" mechanic —
 * mutated the in-memory user_skills row and relied on store.save() to
 * persist it, which only works on the embedded Store because get() returns
 * the same object reference every time. On SupabaseStore (save() is a
 * documented no-op, get() fetches a fresh row each time), score, tier, xp,
 * and verification status would never actually reach the database.
 */
test('applyProofResult persists score/tier/xp/verified via store.update()', async (t) => {
  const tb = await testbed();
  const user = await tb.users.createUser({});
  const isolatingStore = copyOnReadStore(tb.store, ['user_skills']);
  const skills = new SkillService(isolatingStore, tb.config);

  // First proof creates the row via insert() — a live reference either way,
  // so it doesn't exercise the bug. The second proof fetches the EXISTING
  // row via find(), which is where find()-returns-a-fresh-copy (Supabase)
  // vs find()-returns-the-shared-reference (embedded store) actually diverges.
  await skills.applyProofResult(user.id, 'python', { score: 60, passed: true, challengeKind: 'proof' });
  const { userSkill } = await skills.applyProofResult(user.id, 'python', { score: 88, passed: true, challengeKind: 'final' });
  assert.equal(userSkill.verified, true);

  const stored = tb.store.find('user_skills', (s) => s.userId === user.id && s.skillSlug === 'python');
  assert.equal(stored.score, userSkill.score, 'score must persist through store.update()');
  assert.equal(stored.verified, true, 'verified must persist through store.update()');
  assert.equal(stored.proofs, 2, 'proofs count must persist through store.update()');
  assert.equal(stored.xp, 350, 'xp must persist through store.update()');
});
