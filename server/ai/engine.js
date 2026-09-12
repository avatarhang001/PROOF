/**
 * ProofEngine — the local, deterministic intelligence behind PROOF.
 * Works with zero API keys: generates learning paths, delivers lessons,
 * runs tutor conversations, identifies weaknesses, recommends next skills.
 * When an LLM key is configured, AIService blends this engine with the
 * provider (engine output is always the authoritative structure).
 */
import { KB, SKILLS, suggestDomain, topicBySlug, skillKb } from './kb.js';
import { clamp, seededPick } from '../util.js';

const STUDY_MIN = 25;

const LANGUAGE_OPTIONS = {
  french: { code: 'fr', name: 'French', emoji: '🇫🇷', hello: 'Bonjour', goodbye: 'Au revoir', namePhrase: 'Je m’appelle', request: 'Je voudrais', thanks: 'Merci' },
  spanish: { code: 'es', name: 'Spanish', emoji: '🇪🇸', hello: 'Hola', goodbye: 'Adiós', namePhrase: 'Me llamo', request: 'Quisiera', thanks: 'Gracias' },
  german: { code: 'de', name: 'German', emoji: '🇩🇪', hello: 'Hallo', goodbye: 'Auf Wiedersehen', namePhrase: 'Ich heiße', request: 'Ich hätte gern', thanks: 'Danke' },
  portuguese: { code: 'pt', name: 'Portuguese', emoji: '🇵🇹', hello: 'Olá', goodbye: 'Até logo', namePhrase: 'Eu me chamo', request: 'Eu gostaria de', thanks: 'Obrigado/a' },
  mandarin: { code: 'zh', name: 'Mandarin', emoji: '🇨🇳', hello: '你好 (nǐ hǎo)', goodbye: '再见 (zài jiàn)', namePhrase: '我叫 (wǒ jiào)', request: '我想要 (wǒ xiǎng yào)', thanks: '谢谢 (xièxie)' },
};

function languageForGoal(goal = '') {
  const normalized = String(goal).toLowerCase();
  return Object.entries(LANGUAGE_OPTIONS).find(([key, language]) =>
    normalized.includes(key) || normalized.includes(language.name.toLowerCase())
  )?.[1] || LANGUAGE_OPTIONS.french;
}

function languageCurriculum(language) {
  const prefix = language.code;
  const conversationChallenge = (title, brief, minTurns, rewardNim, xp) => ({
    type: 'conversation', kind: 'checkpoint', title, timeMin: 25, brief,
    requirements: [`at least ${minTurns} dialogue turns`, 'greeting and goodbye', 'an introduction or request', 'English glosses included'],
    passScore: 70, rewardNim, xp,
    evaluator: { type: 'conversation', config: { lang: prefix, minTurns, minWords: minTurns * 10, lexicon: [language.hello.toLowerCase().split(' ')[0], language.thanks.toLowerCase().split(' ')[0], language.goodbye.toLowerCase().split(' ')[0]] } },
  });
  return {
    topics: [
      {
        slug: `${prefix}-greetings`, title: `${language.name} Greetings & Introductions`, estMin: 25, difficulty: 1,
        lesson: {
          tldr: `Start a real ${language.name} conversation with a greeting, your name, and a friendly goodbye.`,
          sections: [
            { h: 'Start warmly', body: `${language.hello} means hello. Open with it before asking for anything.` },
            { h: 'Say your name', body: `${language.namePhrase} … means “my name is …”. Say it slowly, then invite the other person to respond.` },
            { h: 'Close the exchange', body: `${language.thanks} and ${language.goodbye} make a short exchange feel complete and polite.` },
          ],
          example: { lang: 'text', code: `— ${language.hello}! ${language.namePhrase} Ada.\n— ${language.hello}, Ada!\n— ${language.thanks}. ${language.goodbye}!` },
          ask: `How would you greet someone and introduce yourself in ${language.name}?`,
          keyPoints: [language.hello, `${language.namePhrase} … = my name is …`, language.thanks, language.goodbye],
          misconception: 'You do not need perfect grammar before speaking. A short, clear exchange is a real win.',
        },
        practice: [
          { q: `Which phrase means “hello” in ${language.name}?`, choices: [language.hello, language.goodbye, language.thanks, language.request], answerIdx: 0, why: `${language.hello} is the standard greeting.` },
          { q: `Which phrase introduces your name?`, choices: [language.thanks, language.namePhrase, language.goodbye, language.hello], answerIdx: 1, why: `${language.namePhrase} is used before your name.` },
        ],
        challenge: conversationChallenge(`Have your first ${language.name} conversation`, `Write a ${minTurnsLabel(6)} dialogue in ${language.name}: greet, introduce yourself, ask one simple question, say thanks, and say goodbye. Add an English gloss after each line.`, 6, 2, 100),
      },
      {
        slug: `${prefix}-daily`, title: `${language.name} Daily Requests`, estMin: 30, difficulty: 2,
        lesson: {
          tldr: `Use one polite request to order, ask, and respond in everyday ${language.name}.`,
          sections: [
            { h: 'Make a polite request', body: `${language.request} … is a useful starting phrase when you want something.` },
            { h: 'Keep the exchange human', body: `Open with ${language.hello}, use ${language.thanks}, and close with ${language.goodbye}. These small signals matter.` },
            { h: 'Practice aloud', body: 'Choose one everyday item—a drink, ticket, or meal—and replace the blank in the request with it.' },
          ],
          example: { lang: 'text', code: `— ${language.hello}! ${language.request} a coffee, please.\n— Of course.\n— ${language.thanks}! ${language.goodbye}!` },
          ask: `What would you politely request in a café in ${language.name}?`,
          keyPoints: [`${language.request} … for a polite request`, 'Start with a greeting', 'Thank the other person', 'Practice phrases aloud'],
          misconception: 'Memorizing one useful phrase is not “too basic.” It is how practical conversations start.',
        },
        practice: [
          { q: `Which phrase starts a polite request in ${language.name}?`, choices: [language.request, language.goodbye, language.thanks, language.namePhrase], answerIdx: 0, why: `${language.request} is the useful request starter.` },
          { q: 'What makes a short request more polite?', choices: ['A greeting and thanks', 'Speaking faster', 'Using English only', 'Skipping a goodbye'], answerIdx: 0, why: 'A greeting and thanks make an exchange respectful.' },
        ],
        challenge: conversationChallenge(`Handle a simple ${language.name} café request`, `Write an 8-turn café dialogue in ${language.name}: greet, order two items, respond to the price, thank the server, and say goodbye. Add English glosses.`, 8, 2, 110),
      },
    ],
    finalAssessment: {
      type: 'conversation', kind: 'final', title: `Final Skill Assessment: ${language.name} Conversation`, timeMin: 40,
      brief: `Write a 12-turn ${language.name} conversation about a real situation (travel, work, or food). Include greetings, an introduction, a request, a question, thanks, and a goodbye. Add English glosses.`,
      requirements: ['at least 12 dialogue turns', 'a greeting and goodbye', 'an introduction', 'a request and question', 'English glosses included'],
      passScore: 75, rewardNim: 5, xp: 250,
      evaluator: { type: 'conversation', config: { lang: prefix, minTurns: 12, minWords: 120, lexicon: [language.hello.toLowerCase().split(' ')[0], language.thanks.toLowerCase().split(' ')[0], language.goodbye.toLowerCase().split(' ')[0]] } },
    },
  };
}

const minTurnsLabel = (count) => `${count}+ turn`;

/* ────────────────────────── learning paths ────────────────────────── */
/**
 * @param {{goal:string, domain?:string, level?:string, minutesPerDay?:number, style?:string}} input
 */
export function generateLearningPath(input) {
  const goal = String(input.goal || '').slice(0, 240);
  const suggestion = input.domain && skillKb(input.domain)
    ? { domain: input.domain, confident: true }
    : suggestDomain(goal);
  const selectedLanguage = suggestion.domain === 'languages' ? languageForGoal(goal) : null;
  const kb = selectedLanguage ? languageCurriculum(selectedLanguage) : skillKb(suggestion.domain);
  const skill = selectedLanguage
    ? { name: selectedLanguage.name, emoji: selectedLanguage.emoji }
    : SKILLS.find((s) => s.slug === suggestion.domain);
  const minutesPerDay = clamp(parseInt(input.minutesPerDay, 10) || 30, 15, 120);
  const level = ['novice', 'beginner', 'intermediate', 'advanced'].includes(String(input.level)) ? input.level : null;

  let topics = [...kb.topics].sort((a, b) => a.difficulty - b.difficulty);
  if (level === 'intermediate' && topics.length > 4) topics = topics.slice(1);
  if (level === 'advanced' && topics.length > 4) topics = topics.slice(2);

  const unitsPerDay = clamp(Math.round(minutesPerDay / 20), 1, 3);

  // Build the item sequence: study → proof checkpoints → final assessment.
  const seq = [];
  topics.forEach((t, i) => {
    seq.push({ kind: 'study', topic: t.slug, title: t.title, estMin: t.estMin, xp: 20, rewardNim: 0 });
    const ch = t.challenge;
    const isProject = ch?.kind === 'project';
    if (ch && (isProject || (i + 1) % 2 === 0 || i === topics.length - 1)) {
      seq.push({
        kind: isProject ? 'project' : 'proof',
        topic: t.slug,
        title: ch.title,
        estMin: ch.timeMin,
        xp: ch.xp,
        rewardNim: ch.rewardNim,
        challengeTemplate: ch,
      });
    }
  });
  const fin = kb.finalAssessment;
  if (fin) {
    seq.push({ kind: 'final', topic: topics[topics.length - 1]?.slug, title: fin.title, estMin: fin.timeMin, xp: fin.xp, rewardNim: fin.rewardNim, challengeTemplate: fin });
  }

  // Chunk into days (max 3 units/day), keeping proofs on their own day when day is full.
  const days = [];
  let cur = null;
  for (const item of seq) {
    const heavy = item.kind !== 'study';
    if (!cur || cur.items.length >= unitsPerDay || (heavy && cur.items.length > 0)) {
      cur = { items: [] };
      days.push(cur);
    }
    cur.items.push(item);
  }

  const rewardPool = seq.reduce((a, d) => a + (d.rewardNim || 0), 0);
  const levelLabel = level ? level[0].toUpperCase() + level.slice(1) : 'Beginner';
  return {
    goal,
    domain: suggestion.domain,
    skillSlug: suggestion.domain,
    skillName: skill?.name || suggestion.domain,
    skillEmoji: skill?.emoji || '📚',
    confidentMatch: suggestion.confident,
    title: `${skill?.name || 'Skill'} — ${levelLabel} Path`,
    description: `A ${days.length}-day practical path built from your goal: “${goal}”. Study, practice, and prove with real challenges worth up to ${rewardPool} NIM.`,
    minutesPerDay,
    level: levelLabel,
    style: input.style || 'practical',
    days: days.map((d, i) => {
      const mainItem = d.items.find((x) => x.kind !== 'study') || d.items[0];
      const proofItem = d.items.find((x) => x.kind === 'proof' || x.kind === 'project' || x.kind === 'final');
      return {
        index: i + 1,
        title: proofItem ? `Prove: ${shortTitle(proofItem.title)}` : shortTitle(d.items[0].title),
        kind: proofItem ? (proofItem.kind === 'final' ? 'final' : 'proof') : 'study',
        estMin: d.items.reduce((a, x) => a + x.estMin, 0),
        xp: d.items.reduce((a, x) => a + x.xp, 0),
        rewardNim: d.items.reduce((a, x) => a + (x.rewardNim || 0), 0),
        items: d.items,
      };
    }),
    totalXp: seq.reduce((a, x) => a + x.xp, 0),
    rewardNim: rewardPool,
    meta: { engine: 'proof-engine', generatedAt: Date.now() },
  };
}

const shortTitle = (t) => (t.length > 34 ? t.slice(0, 31).trimEnd() + '…' : t);

/* ────────────────────────── lessons & practice ────────────────────── */
export function lessonFor(domain, topicSlug) {
  const selectedLanguage = domain === 'languages'
    ? Object.values(LANGUAGE_OPTIONS).find((language) => topicSlug.startsWith(`${language.code}-`))
    : null;
  const topic = selectedLanguage
    ? languageCurriculum(selectedLanguage).topics.find((item) => item.slug === topicSlug)
    : topicBySlug(domain, topicSlug);
  if (!topic) return null;
  return {
    skillSlug: domain,
    topicSlug: topic.slug,
    title: topic.title,
    estMin: topic.estMin,
    lesson: topic.lesson,
    practice: topic.practice || [],
    // ── enriched "school-like" lesson fields (curriculum upgrade) ──
    objectives: topic.objectives || [],
    story: topic.story || '',
    memoryHook: topic.memoryHook || '',
    quiz: topic.quiz || [],
    recall: topic.recall || [],
    challenge: topic.challenge ? { title: topic.challenge.title, kind: topic.challenge.kind, rewardNim: topic.challenge.rewardNim, xp: topic.challenge.xp, timeMin: topic.challenge.timeMin } : null,
  };
}

/* ────────────────────────── tutor ─────────────────────────────────── */
/**
 * Intent-based tutoring grounded in the lesson content.
 * @returns {{reply:string, exercise?:object, intent:string}}
 */
export function tutorReply({ domain, topicSlug, question, history = [] }) {
  const topic = topicBySlug(domain, topicSlug);
  if (!topic) {
    return { intent: 'generic', reply: 'Let’s anchor on the current lesson. Ask me about a specific concept from it — or say “exercise” and I’ll give you something to try.' };
  }
  const q = String(question || '').toLowerCase().trim();
  const L = topic.lesson;
  const name = topic.title.replace(/\b\w/g, (m) => m.toLowerCase());

  const wants = (arr) => arr.some((w) => q.includes(w));

  if (!q || wants(['exercise', 'practice', 'quiz me', 'test me', 'try me'])) {
    const ex = topic.practice[Math.floor(Math.random() * Math.max(topic.practice.length, 1))] || synthExercise(topic);
    return {
      intent: 'exercise',
      reply: `Try this one — take your time, and tell me your answer with why:\n\n${ex.q}` +
        (ex.choices ? `\n\n${ex.choices.map((c, i) => `${'ABCD'[i]}. ${c}`).join('\n')}` : ''),
      exercise: { q: ex.q, choices: ex.choices || null, hint: ex.hint },
    };
  }
  if (wants(['hint', 'stuck', 'help me', 'clue']) && history.length) {
    const ex = history.filter((m) => m.role === 'assistant' && m.exerciseHint).at(-1)?.exerciseHint;
    return { intent: 'hint', reply: ex ? `Hint: ${ex}\n\nYou can do it — I won’t give the answer away. Commit to a guess and tell me why.` : 'Break the problem into the smallest piece you can check. Which part feels unsure?' };
  }
  if (wants(['simpler', 'don’t understand', 'dont understand', 'confus', 'eli5', 'explain differently', 'easier'])) {
    const kp = L.keyPoints[0] || L.tldr;
    return { intent: 'simplify', reply: `No jargon this time. ${L.misconception ? `First — forget this myth: ${L.misconception}\n\n` : ''}The one-sentence version: ${kp}\n\nNow in plain words: ${plainVersion(topic)}\n\nDoes that land? Say “example” and I’ll show it in action.` };
  }
  if (wants(['example', 'show me', 'demo', 'sample'])) {
    return { intent: 'example', reply: `Here’s a working example:\n\n${codeBlock(L.example)}\n\nNotice how it uses: ${L.keyPoints.slice(0, 2).join('; ').replace(/\.$/, '')}.\n\nWant to try one yourself? Say “exercise”.` };
  }
  if (wants(['why', 'mistake', 'wrong', 'error', 'bug', 'not working', 'fail'])) {
    return { intent: 'debug', reply: `Let’s debug it together — I won’t fix it for you.\n\nThree most likely culprits in ${name}:\n1. ${L.keyPoints[1] || L.keyPoints[0]}\n2. ${L.misconception || 'A small mismatch between what you wrote and what you meant'}\n3. A detail from the example being skipped\n\nWhich line or step feels suspicious? Describe what you expected vs. what happened.` };
  }
  if (wants(['what is', 'what’s', 'explain', 'how does', 'how do', 'what are'])) {
    const section = L.sections.find((s) => q.split(/\s+/).some((w) => w.length > 3 && s.h.toLowerCase().includes(w) || s.body.toLowerCase().includes(w)));
    return {
      intent: 'explain',
      reply: `${L.tldr}\n\n${section ? `${section.h}: ${section.body}` : L.sections[0].h + ': ' + L.sections[0].body}\n\nKey points:\n${L.keyPoints.map((k) => '• ' + k).join('\n')}\n\nQuick check: ${L.ask}`,
    };
  }
  // default: coach around the goal
  return {
    intent: 'coach',
    reply: `Good question. In ${name}, the thing to hold onto is: ${L.keyPoints[0]}\n\n${L.sections.map((s) => s.h).join(' → ')} is the mental map.\n\nTo make this concrete, tell me: ${L.ask}`,
  };
}

const codeBlock = (ex) => (ex?.code ? ex.code.split('\n').map((l) => '  ' + l).join('\n') : ex?.text || '—');

function plainVersion(topic) {
  const t = topic.title.toLowerCase();
  const map = {
    'html fundamentals': 'HTML is like labeling boxes before moving: every tag tells the browser what the thing IS — a title, a list, a picture — and the browser does the carrying.',
    'css fundamentals': 'If HTML is the skeleton, CSS is the outfit: one rulebook that says how each labeled box should look.',
    'responsive layout': 'Build for the smallest screen first, then let the layout expand like a fold-out map as the screen grows.',
    'javascript basics': 'JavaScript is a recipe book: variables are ingredients, functions are recipes you wrote once and reuse, events are the doorbell that starts a recipe.',
    'the dom & events': 'The page is a live model you can reach into and rearrange — and events are the “user did something” doorbell.',
    'working with apis': 'Your page texts another computer “send me data”, waits politely, and paints the reply. Sometimes the message fails — plan for that.',
  };
  return map[t] || `${topic.lesson.tldr} In practice: ${topic.lesson.keyPoints.join(' · ')}`;
}

function synthExercise(topic) {
  return { q: `In one or two sentences: why does “${topic.lesson.keyPoints[0].toLowerCase()}” matter when working with ${topic.title.toLowerCase()}?`, hint: topic.lesson.ask };
}

/* ────────────────────────── weaknesses & next ─────────────────────── */
export function identifyWeaknesses(evaluation) {
  const weak = (evaluation.criteria || []).filter((c) => c.max > 0 && c.earned / c.max < 0.7);
  return weak.map((c) => ({ area: c.label, advice: c.nextStep || c.improveNote || 'Review this criterion in the lesson.' }));
}

export function recommendNextSkill(userSkillSlugs = [], allSkillSlugs = []) {
  const remaining = SKILLS.filter((s) => !userSkillSlugs.includes(s.slug) && allSkillSlugs.includes(s.slug));
  const demandRank = ['web-development', 'python', 'cybersecurity', 'chess', 'ai', 'nimiq-blockchain', 'ui-design', 'marketing', 'data-analysis', 'writing', 'social-media', 'business', 'languages', 'music-production', 'practical-skills'];
  remaining.sort((a, b) => demandRank.indexOf(a.slug) - demandRank.indexOf(b.slug));
  return remaining.slice(0, 3).map((s) => ({ slug: s.slug, name: s.name, emoji: s.emoji, reason: `High marketplace demand — verified ${s.name} pros are earning on tasks right now.` }));
}

/* ────────────────────────── daily challenge ───────────────────────── */
const DAILY_POOL = [
  { topicKey: 'explain-yesterday', type: 'explain', title: 'Explain one thing you learned yesterday', brief: 'In 60–150 of your own words, explain one concept you learned recently as if teaching a friend. No copying the lesson — teaching proves understanding.', minWords: 50, targetWords: 110, passScore: 70, rewardNim: 1, xp: 50, timeMin: 15, keyConcepts: [] },
  { topicKey: 'teach-back', type: 'explain', title: 'Teach-back: your best takeaway', brief: 'Pick your strongest recent takeaway and explain it in plain words (60–150 words) with one concrete example from your own work.', minWords: 50, targetWords: 110, passScore: 70, rewardNim: 1, xp: 50, timeMin: 15, keyConcepts: [] },
  { topicKey: 'mistake-postmortem', type: 'explain', title: 'Post-mortem a mistake', brief: 'Describe one mistake you made while learning this week, what caused it, and the rule you now follow because of it (60–150 words).', minWords: 50, targetWords: 110, passScore: 70, rewardNim: 1, xp: 50, timeMin: 15, keyConcepts: [] },
];

export function dailyChallengeFor(dateKey) {
  const base = seededPick(dateKey, DAILY_POOL);
  return {
    id: `daily_${dateKey}`,
    dateKey,
    type: base.type,
    title: base.title,
    brief: base.brief,
    passScore: base.passScore,
    rewardNim: base.rewardNim,
    xp: base.xp,
    timeMin: base.timeMin,
    evaluator: { type: base.type, config: { minWords: base.minWords, targetWords: base.targetWords, keyConcepts: base.keyConcepts, headings: 0, keyConceptRatio: 0 } },
  };
}
