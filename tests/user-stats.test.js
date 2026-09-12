import test from 'node:test';
import assert from 'node:assert/strict';
import { testbed } from './helpers.js';
import { setStore, getUserStats, incrementLessons } from '../server/services/user-stats.js';

// Regression: getUserStats() used to insert without an explicit `id`, so on
// the embedded Store it fell back to a counter-based id instead of the
// userId that prisma/schema.prisma declares as UserStats' primary key (and
// that SupabaseStore already keys by). Every later get()/update() by userId
// missed the row entirely, so a fresh all-zero row was created on every call
// and streaks/minutes/completions never actually persisted in local/demo mode.
test('user stats: created once and persist across calls, keyed by userId', async () => {
  const tb = await testbed();
  setStore(tb.store);

  const user = await tb.users.createUser({});

  const first = await getUserStats(user.id);
  assert.equal(first.totalLessonsCompleted, 0);

  await incrementLessons(user.id);

  const second = await getUserStats(user.id);
  assert.equal(second.totalLessonsCompleted, 1, 'the increment must land on the same row, not a fresh one');

  // Exactly one row for this user — no duplicate rows piling up per call.
  const rows = tb.store.filter('user_stats', (r) => r.userId === user.id);
  assert.equal(rows.length, 1, 'must not create a new user_stats row on every getUserStats call');
});
