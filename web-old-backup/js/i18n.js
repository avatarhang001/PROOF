/**
 * i18n — a small, honest translation layer.
 *
 * Scope: this covers static UI chrome (navigation, buttons, headers,
 * onboarding copy, common actions) — the parts of the app that are the
 * same for every user. It deliberately does NOT translate AI-generated
 * or user-submitted content (challenge briefs, lesson text, skill
 * descriptions, notifications, other people's reviews) — faking a
 * translation of content we can't actually translate would be worse
 * than leaving it in English. `t()` falls back to the English string
 * (or the key itself) for anything not yet covered, so an incomplete
 * language never renders a blank or a raw key on screen.
 */

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
];

const DICT = {
  en: {
    nav_home: 'Home', nav_learn: 'Learn', nav_review: 'Review', nav_prove: 'Prove',
    nav_work: 'Work', nav_teach: 'Teach', nav_leaderboard: 'Leaderboard',
    nav_notifications: 'Notifications', nav_profile: 'Profile', nav_glossary: 'Glossary',
    nav_socratic: 'Socratic', nav_settings: 'Settings',

    action_save: 'Save', action_cancel: 'Cancel', action_saved: 'Saved',
    action_loading: 'Loading…', action_viewAll: 'View all', action_start: 'Start',
    action_continue: 'Continue', action_back: 'Back', action_done: 'Done',

    settings_title: 'Settings', settings_appearance: 'Appearance',
    settings_theme: 'Theme', settings_theme_light: 'Light', settings_theme_dark: 'Dark',
    settings_theme_system: 'Match device', settings_language: 'Language',
    settings_language_hint: 'Translates menus, buttons, and screen titles. Lessons and proofs you create stay in the language you write them in.',
    settings_account: 'Account', settings_notifications: 'Notifications',
    settings_notifications_hint: 'Manage what PROOF notifies you about.',
    settings_signout: 'Sign out',

    home_continueLearning: 'Continue learning', home_todaysProof: "Today's proof",
    home_skillsBuilding: "Skills you're building", home_recentAchievements: 'Recent achievements',
    home_recommended: 'Recommended for you',

    onb_kicker: 'LEARN · PRACTICE · PROVE · EARN',
    onb_headline1: 'Learn anything.', onb_headline2: 'Prove it.', onb_headline3: 'Earn with it.',
    onb_sub: 'Practical challenges that turn skill into verified ability and real NIM.',
    onb_whatToLearn: 'What do you want to learn?',
    onb_yourLevel: 'Your level', onb_timePerDay: 'Time / day',
    onb_startPath: 'Start my skill path',
  },
  es: {
    nav_home: 'Inicio', nav_learn: 'Aprender', nav_review: 'Repasar', nav_prove: 'Probar',
    nav_work: 'Trabajo', nav_teach: 'Enseñar', nav_leaderboard: 'Clasificación',
    nav_notifications: 'Notificaciones', nav_profile: 'Perfil', nav_glossary: 'Glosario',
    nav_socratic: 'Tutor', nav_settings: 'Ajustes',

    action_save: 'Guardar', action_cancel: 'Cancelar', action_saved: 'Guardado',
    action_loading: 'Cargando…', action_viewAll: 'Ver todo', action_start: 'Empezar',
    action_continue: 'Continuar', action_back: 'Atrás', action_done: 'Listo',

    settings_title: 'Ajustes', settings_appearance: 'Apariencia',
    settings_theme: 'Tema', settings_theme_light: 'Claro', settings_theme_dark: 'Oscuro',
    settings_theme_system: 'Igual que el dispositivo', settings_language: 'Idioma',
    settings_language_hint: 'Traduce menús, botones y títulos de pantalla. Las lecciones y pruebas que crees permanecen en el idioma en que las escribas.',
    settings_account: 'Cuenta', settings_notifications: 'Notificaciones',
    settings_notifications_hint: 'Gestiona qué te notifica PROOF.',
    settings_signout: 'Cerrar sesión',

    home_continueLearning: 'Continuar aprendiendo', home_todaysProof: 'Prueba de hoy',
    home_skillsBuilding: 'Habilidades en progreso', home_recentAchievements: 'Logros recientes',
    home_recommended: 'Recomendado para ti',

    onb_kicker: 'APRENDE · PRACTICA · PRUEBA · GANA',
    onb_headline1: 'Aprende cualquier cosa.', onb_headline2: 'Pruébalo.', onb_headline3: 'Gana con ello.',
    onb_sub: 'Retos prácticos que convierten la habilidad en capacidad verificada y NIM real.',
    onb_whatToLearn: '¿Qué quieres aprender?',
    onb_yourLevel: 'Tu nivel', onb_timePerDay: 'Tiempo / día',
    onb_startPath: 'Comenzar mi ruta',
  },
  fr: {
    nav_home: 'Accueil', nav_learn: 'Apprendre', nav_review: 'Réviser', nav_prove: 'Prouver',
    nav_work: 'Travail', nav_teach: 'Enseigner', nav_leaderboard: 'Classement',
    nav_notifications: 'Notifications', nav_profile: 'Profil', nav_glossary: 'Glossaire',
    nav_socratic: 'Tuteur', nav_settings: 'Paramètres',

    action_save: 'Enregistrer', action_cancel: 'Annuler', action_saved: 'Enregistré',
    action_loading: 'Chargement…', action_viewAll: 'Tout voir', action_start: 'Commencer',
    action_continue: 'Continuer', action_back: 'Retour', action_done: 'Terminé',

    settings_title: 'Paramètres', settings_appearance: 'Apparence',
    settings_theme: 'Thème', settings_theme_light: 'Clair', settings_theme_dark: 'Sombre',
    settings_theme_system: "Suivre l'appareil", settings_language: 'Langue',
    settings_language_hint: "Traduit les menus, boutons et titres d'écran. Les leçons et preuves que vous créez restent dans la langue dans laquelle vous les écrivez.",
    settings_account: 'Compte', settings_notifications: 'Notifications',
    settings_notifications_hint: 'Gérez ce dont PROOF vous notifie.',
    settings_signout: 'Se déconnecter',

    home_continueLearning: "Continuer l'apprentissage", home_todaysProof: 'Épreuve du jour',
    home_skillsBuilding: 'Compétences en cours', home_recentAchievements: 'Réussites récentes',
    home_recommended: 'Recommandé pour vous',

    onb_kicker: 'APPRENDRE · PRATIQUER · PROUVER · GAGNER',
    onb_headline1: 'Apprenez tout.', onb_headline2: 'Prouvez-le.', onb_headline3: 'Gagnez avec.',
    onb_sub: 'Des défis pratiques qui transforment la compétence en capacité vérifiée et en vrais NIM.',
    onb_whatToLearn: 'Que voulez-vous apprendre ?',
    onb_yourLevel: 'Votre niveau', onb_timePerDay: 'Temps / jour',
    onb_startPath: 'Démarrer mon parcours',
  },
  pt: {
    nav_home: 'Início', nav_learn: 'Aprender', nav_review: 'Revisar', nav_prove: 'Provar',
    nav_work: 'Trabalho', nav_teach: 'Ensinar', nav_leaderboard: 'Classificação',
    nav_notifications: 'Notificações', nav_profile: 'Perfil', nav_glossary: 'Glossário',
    nav_socratic: 'Tutor', nav_settings: 'Configurações',

    action_save: 'Salvar', action_cancel: 'Cancelar', action_saved: 'Salvo',
    action_loading: 'Carregando…', action_viewAll: 'Ver tudo', action_start: 'Começar',
    action_continue: 'Continuar', action_back: 'Voltar', action_done: 'Concluído',

    settings_title: 'Configurações', settings_appearance: 'Aparência',
    settings_theme: 'Tema', settings_theme_light: 'Claro', settings_theme_dark: 'Escuro',
    settings_theme_system: 'Igual ao dispositivo', settings_language: 'Idioma',
    settings_language_hint: 'Traduz menus, botões e títulos de tela. As lições e provas que você criar permanecem no idioma em que forem escritas.',
    settings_account: 'Conta', settings_notifications: 'Notificações',
    settings_notifications_hint: 'Gerencie sobre o que o PROOF te notifica.',
    settings_signout: 'Sair',

    home_continueLearning: 'Continuar aprendendo', home_todaysProof: 'Prova de hoje',
    home_skillsBuilding: 'Habilidades em progresso', home_recentAchievements: 'Conquistas recentes',
    home_recommended: 'Recomendado para você',

    onb_kicker: 'APRENDA · PRATIQUE · PROVE · GANHE',
    onb_headline1: 'Aprenda qualquer coisa.', onb_headline2: 'Prove.', onb_headline3: 'Ganhe com isso.',
    onb_sub: 'Desafios práticos que transformam habilidade em capacidade verificada e NIM real.',
    onb_whatToLearn: 'O que você quer aprender?',
    onb_yourLevel: 'Seu nível', onb_timePerDay: 'Tempo / dia',
    onb_startPath: 'Começar minha trilha',
  },
};

let currentLang = 'en';
const CACHE_KEY = 'proof_lang_pref';

export function setLanguage(code) {
  currentLang = DICT[code] ? code : 'en';
  document.documentElement.lang = currentLang;
  try { localStorage.setItem(CACHE_KEY, currentLang); } catch { /* storage unavailable — language still applies for this load */ }
}

export function getLanguage() { return currentLang; }

export function cachedLanguage() {
  try { return localStorage.getItem(CACHE_KEY); } catch { return null; }
}

/** Browser's own language, mapped to a supported code — used only as a
 * first-time default before any real preference (cached or server) exists. */
export function detectBrowserLanguage() {
  const tag = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return DICT[tag] ? tag : 'en';
}

export function t(key) {
  return DICT[currentLang]?.[key] ?? DICT.en[key] ?? key;
}
