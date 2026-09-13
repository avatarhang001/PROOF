import { createClient } from '@supabase/supabase-js';

if (process.env.RESET_SUPABASE_USERS !== 'CONFIRM') {
  throw new Error('Refusing to reset users. Set RESET_SUPABASE_USERS=CONFIRM to continue.');
}

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function readUserIds() {
  const { data, error } = await supabase.from('User').select('id');
  if (error) throw new Error(`Could not read users: ${error.message}`);
  return data.map(({ id }) => id);
}

async function deleteForUsers(table, column, userIds) {
  if (!userIds.length) return;
  const { error } = await supabase.from(table).delete().in(column, userIds);
  if (error) throw new Error(`Could not clear ${table}: ${error.message}`);
  console.log(`Cleared ${table}`);
}

async function deleteAll(table) {
  const { error } = await supabase.from(table).delete().not('id', 'is', null);
  if (error) throw new Error(`Could not clear ${table}: ${error.message}`);
  console.log(`Cleared ${table}`);
}

async function readAttemptIds(userIds) {
  if (!userIds.length) return [];
  const { data, error } = await supabase
    .from('ChallengeAttempt')
    .select('id')
    .in('userId', userIds);
  if (error) throw new Error(`Could not read attempts: ${error.message}`);
  return data.map(({ id }) => id);
}

async function deleteByIds(table, ids) {
  if (!ids.length) return;
  const { error } = await supabase.from(table).delete().in('id', ids);
  if (error) throw new Error(`Could not clear ${table}: ${error.message}`);
  console.log(`Cleared ${table}`);
}

const userIds = await readUserIds();
const attemptIds = await readAttemptIds(userIds);
console.log(`Preparing to clear ${userIds.length} users and their user-owned data.`);

// These tables are cleared first so foreign-key references do not block the user reset.
await deleteAll('sessions');
await deleteAll('nonces');
await deleteByIds('Submission', attemptIds);
await deleteForUsers('ChallengeAttempt', 'userId', userIds);
await deleteForUsers('Evaluation', 'userId', userIds);
await deleteForUsers('SkillProof', 'userId', userIds);
await deleteForUsers('Review', 'userId', userIds);
await deleteForUsers('Review', 'revieweeId', userIds);
await deleteForUsers('Booking', 'userId', userIds);
await deleteForUsers('TeachingSession', 'teacherId', userIds);
await deleteForUsers('TaskApplication', 'userId', userIds);
await deleteForUsers('MarketplaceTask', 'clientId', userIds);
await deleteForUsers('SponsoredParticipant', 'userId', userIds);
await deleteForUsers('UserSkill', 'userId', userIds);
await deleteForUsers('UserAchievement', 'userId', userIds);
await deleteForUsers('Reward', 'userId', userIds);
await deleteForUsers('WalletTransaction', 'userId', userIds);
await deleteForUsers('Notification', 'userId', userIds);
await deleteForUsers('socratic_sessions', 'userId', userIds);
await deleteForUsers('user_glossary', 'userId', userIds);
await deleteForUsers('ReviewSchedule', 'userId', userIds);
await deleteForUsers('LearningSession', 'userId', userIds);
await deleteForUsers('UserStats', 'userId', userIds);
await deleteForUsers('LearningGoal', 'userId', userIds);
await deleteForUsers('MasteryBadge', 'userId', userIds);
await deleteForUsers('ExerciseAttempt', 'userId', userIds);
await deleteForUsers('QuizResult', 'userId', userIds);
await deleteForUsers('UserMastery', 'userId', userIds);
await deleteForUsers('LearningPath', 'userId', userIds);
await deleteAll('User');

console.log('Supabase user reset complete. Skills, challenges, and catalog data were preserved.');
