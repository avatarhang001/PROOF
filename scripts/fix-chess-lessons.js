/**
 * Automated Chess Lessons Fixer
 * 
 * This script:
 * 1. Replaces ASCII board examples with FEN positions
 * 2. Adds recall questions to all chess lessons
 * 
 * Usage: node scripts/fix-chess-lessons.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KB_FILE = path.resolve(__dirname, '../server/ai/kb.js');

// Recall questions for each chess topic (using actual slugs from kb.js)
const RECALL_QUESTIONS = {
  'board-basics': [
    'What square is the bottom-left corner for White?',
    'How many squares can a king move from the center of an empty board?',
    'Can a bishop on c1 ever reach h8? Why or why not?',
    'Which piece can jump over other pieces?',
  ],
  'special-moves': [
    'What two conditions must be met to castle kingside?',
    'When can you capture en passant?',
    'What pieces can a pawn promote to?',
    'Can you castle if your king has moved and moved back?',
  ],
  'chess-notation': [
    'How do you write a pawn capture from e4 to d5 in algebraic notation?',
    'What does O-O mean in chess notation?',
    'How do you indicate checkmate in notation?',
    'What does Nbd7 mean (why include the "b")?',
  ],
  'fundamental-tactics': [
    'What is a fork in chess?',
    'Describe what a pin is and why it\'s powerful',
    'How is a skewer different from a pin?',
    'What is a discovered attack?',
  ],
  'opening-principles': [
    'Name the three main opening principles',
    'Which four squares make up the center of the board?',
    'Why should you develop knights before bishops?',
    'What does it mean to "control the center"?',
  ],
  'basic-endgames': [
    'Which pieces can deliver checkmate with just the king helping?',
    'What is the maximum number of moves for KQ vs K checkmate?',
    'Why can\'t a king and single bishop checkmate a lone king?',
    'What is the key principle for king and queen vs king checkmate?',
  ],
  'chess-thinking': [
    'What are the main steps in the chess thinking process?',
    'Why should you look at checks first?',
    'What is a candidate move?',
    'How do you decide between two good moves?',
  ],
  'tactical-motifs': [
    'What is a discovered attack?',
    'Explain deflection in chess tactics',
    'What is a decoy sacrifice?',
    'Describe the "removing the defender" tactic',
  ],
  'opening-systems-e4': [
    'Name two common black responses to 1.e4',
    'What is the main idea behind the Italian Game?',
    'Why is 1.e4 considered more aggressive than 1.d4?',
    'What is the Sicilian Defense main concept?',
  ],
  'opening-systems-d4': [
    'Name two main 1.d4 opening systems',
    'What is the key idea of the London System?',
    'How does 1.d4 strategy differ from 1.e4?',
    'Why is the Queen\'s Gambit not a true gambit?',
  ],
  'pawn-structure': [
    'What makes a pawn "passed"?',
    'Why are doubled pawns considered weak?',
    'What is a pawn chain and how do you attack it?',
    'Explain what an isolated pawn is',
  ],
  'king-safety': [
    'Why should you castle early in the opening?',
    'Name three signs of an unsafe king position',
    'What is a back rank weakness?',
    'When is it okay to delay castling?',
  ],
  'piece-coordination': [
    'What does piece coordination mean?',
    'Why is a rook on the 7th rank powerful?',
    'What makes two pieces work well together?',
    'When should pieces support each other vs act independently?',
  ],
  'elementary-endgames': [
    'What is the "rule of the square" in pawn endgames?',
    'Explain what opposition means',
    'When is king and pawn versus king a draw?',
    'What is triangulation in endgames?',
  ],
  'blunder-prevention': [
    'What is the definition of a blunder?',
    'Name two blunder prevention techniques',
    'What question should you ask yourself before every move?',
    'Why is time pressure a common cause of blunders?',
  ],
  'advanced-tactics': [
    'What is a Greek Gift sacrifice?',
    'Describe the windmill tactic',
    'What does "clearance" mean in tactics?',
    'Explain an X-ray attack',
  ],
  'middlegame-strategy': [
    'What are the three main elements of chess strategy?',
    'When should you consider trading pieces?',
    'What makes a square "good" for a knight?',
    'What is the principle of two weaknesses?',
  ],
  'attack-and-defense': [
    'Name three principles of successful attacks',
    'What is prophylaxis in chess?',
    'When should you counterattack instead of defending?',
    'What is meant by "attack on two wings"?',
  ],
  'positional-play': [
    'What is a space advantage?',
    'Explain the concept of a "good" vs "bad" bishop',
    'What are weak squares and how do you exploit them?',
    'Why is controlling open files important?',
  ],
  'complex-endgames': [
    'Can rook and bishop beat a lone rook?',
    'What is the Lucena position?',
    'Name two key principles of rook endgames',
    'Why are rook endgames so common?',
  ],
  'game-analysis': [
    'What should you focus on when analyzing your games?',
    'How do you identify the critical moment in a game?',
    'Why should you analyze losses more than wins?',
    'What role does an engine play in analysis?',
  ],
  'tournament-skills': [
    'Name three key aspects of tournament preparation',
    'What is an opening repertoire?',
    'How do you prepare against a specific opponent?',
    'Why is physical fitness important for chess?',
  ],
};

// FEN positions for examples (using actual slugs from kb.js)
const FEN_EXAMPLES = {
  'board-basics': {
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    description: 'Standard starting position. Each piece has its unique movement pattern. White\'s king on e1 can move to d1, d2, e2, f2, or f1.'
  },
  'special-moves': {
    fen: 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1',
    description: 'Position demonstrating castling rights. Both sides can castle kingside (O-O) or queenside (O-O-O).'
  },
  'chess-notation': {
    fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
    description: 'After 1.e4 - the move is written as the piece letter (omitted for pawns) followed by the destination square.'
  },
  'fundamental-tactics': {
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    description: 'Italian Game position. Multiple tactical themes: center control, piece development, and tactical opportunities.'
  },
  'opening-principles': {
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    description: 'Starting position. Opening principles: 1) Control center 2) Develop pieces 3) Castle king 4) Don\'t move same piece twice.'
  },
  'basic-endgames': {
    fen: '7k/8/5K2/8/8/8/8/7Q w - - 0 1',
    description: 'King and queen vs king. White can checkmate in a few moves by limiting the black king\'s escape squares.'
  },
  'chess-thinking': {
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    description: 'Think systematically: 1) Checks 2) Captures 3) Threats. Always calculate before moving.'
  },
  'tactical-motifs': {
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1',
    description: 'Complex position with multiple tactical themes: discovered attacks, pins, and forks waiting to be found.'
  },
  'opening-systems-e4': {
    fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
    description: 'After 1.e4 - the most popular first move. Controls center, opens lines for bishop and queen.'
  },
  'opening-systems-d4': {
    fen: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1',
    description: 'After 1.d4 - solid positional opening. Leads to strategic, less tactical games than 1.e4.'
  },
  'pawn-structure': {
    fen: 'rnbqkb1r/pp3ppp/4pn2/2pp4/3PP3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 6',
    description: 'Pawn chains in the center. Pawn structure determines piece placement and long-term plans.'
  },
  'king-safety': {
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5',
    description: 'Both sides should castle soon. King safety is crucial in the middlegame.'
  },
  'piece-coordination': {
    fen: 'r2qkb1r/ppp2ppp/2np1n2/4p1B1/2B1P3/2NP1N2/PPP2PPP/R2QK2R w KQkq - 0 8',
    description: 'Pieces work together: bishop and knight coordinate to control key squares.'
  },
  'elementary-endgames': {
    fen: '8/8/4k3/4p3/4P3/4K3/8/8 w - - 0 1',
    description: 'Basic pawn endgame. Opposition and the rule of the square determine the outcome.'
  },
  'blunder-prevention': {
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    description: 'Before every move: check for hanging pieces, enemy tactics, and verify your move is safe.'
  },
  'advanced-tactics': {
    fen: 'r1b1kb1r/pppp1ppp/2n2q2/4n3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 6',
    description: 'Position rich with advanced tactics: sacrifices, combinations, and pattern recognition.'
  },
  'middlegame-strategy': {
    fen: 'r2qkb1r/ppp2ppp/2np1n2/4p1B1/2B1P3/2NP1N2/PPP2PPP/R2QK2R w KQkq - 0 8',
    description: 'Typical middlegame position. Strategy focuses on pawn structure, piece activity, and king safety.'
  },
  'attack-and-defense': {
    fen: 'r2qk2r/ppp2ppp/2np1n2/2b1p1B1/2B1P3/2NP1N2/PPP2PPP/R2Q1RK1 b kq - 0 8',
    description: 'White is attacking, Black must defend. Balance attack and defense based on position.'
  },
  'positional-play': {
    fen: 'r3kb1r/1p3ppp/pqn1pn2/2pp4/3P1B2/2PBPN2/PP1N1PPP/R2Q1RK1 w kq - 0 11',
    description: 'Positional concepts: space, weak squares, pawn structure, and long-term planning.'
  },
  'complex-endgames': {
    fen: '6k1/8/6K1/8/8/8/8/3R4 w - - 0 1',
    description: 'Rook endgame. Rooks belong behind passed pawns. Activity is more important than material.'
  },
  'game-analysis': {
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    description: 'Analyzing this position: evaluate pawn structure, piece activity, king safety, and tactics.'
  },
  'tournament-skills': {
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    description: 'Prepare your opening repertoire, study opponent games, get rest, and arrive early.'
  },
};

async function fixChessLessons() {
  console.log('🔧 Starting Chess Lessons Fix...\n');
  
  // Read the file
  let content = fs.readFileSync(KB_FILE, 'utf8');
  let modified = false;
  
  // Fix each chess topic
  Object.keys(RECALL_QUESTIONS).forEach(slug => {
    console.log(`📝 Processing: ${slug}`);
    
    // Find the topic in the file
    const topicRegex = new RegExp(`slug: '${slug}',[\\s\\S]*?(?=slug:|finalAssessment:|\\},\\s*\\]\\s*,\\s*finalAssessment)`, 'g');
    const topicMatch = content.match(topicRegex);
    
    if (!topicMatch || topicMatch.length === 0) {
      console.log(`   ⚠️  Topic not found: ${slug}`);
      return;
    }
    
    let topicContent = topicMatch[0];
    const originalContent = topicContent;
    
    // 1. Replace text board example with FEN
    if (topicContent.includes("lang: 'text'") && topicContent.includes('Board Setup:')) {
      const fenData = FEN_EXAMPLES[slug] || FEN_EXAMPLES['board-basics'];
      
      // Replace the example block
      topicContent = topicContent.replace(
        /example:\s*\{[^}]*lang:\s*'text'[^}]*code:\s*'[^']*'[^}]*\}/,
        `example: {\n            lang: 'fen',\n            fen: '${fenData.fen}',\n            description: '${fenData.description}'\n          }`
      );
      
      console.log(`   ✅ Updated example to FEN format`);
      modified = true;
    }
    
    // 2. Add recall questions if missing
    if (!topicContent.includes('recall:')) {
      const recallQuestions = RECALL_QUESTIONS[slug];
      const recallStr = `recall: [\n            '${recallQuestions.join("',\n            '")}'\n          ],`;
      
      // Insert recall before challenge
      if (topicContent.includes('challenge:')) {
        topicContent = topicContent.replace(
          /(\s*)(challenge:)/,
          `$1${recallStr}\n$1$2`
        );
        console.log(`   ✅ Added ${recallQuestions.length} recall questions`);
        modified = true;
      }
    }
    
    // Replace in original content
    if (topicContent !== originalContent) {
      content = content.replace(originalContent, topicContent);
    }
    
    console.log(`   ✓ Done\n`);
  });
  
  if (modified) {
    // Backup original file
    const backupFile = KB_FILE + '.backup';
    fs.writeFileSync(backupFile, fs.readFileSync(KB_FILE));
    console.log(`📦 Backup created: ${path.basename(backupFile)}`);
    
    // Write modified content
    fs.writeFileSync(KB_FILE, content, 'utf8');
    console.log(`\n✅ Chess lessons updated successfully!`);
    console.log(`\n📊 Summary:`);
    console.log(`   - 22 chess topics processed`);
    console.log(`   - ASCII boards replaced with FEN`);
    console.log(`   - Recall questions added`);
    console.log(`\n🚀 Restart your server to see changes`);
  } else {
    console.log(`\n✓ No changes needed - lessons already fixed!`);
  }
}

// Run the script
fixChessLessons().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
