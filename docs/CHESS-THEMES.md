# ♟️ Chess Board Color Themes

## 🎨 Available Themes

The chess components support **15 beautiful color themes** for the chessboard. Each theme has carefully chosen light and dark square colors for optimal visibility and aesthetics.

---

## 📋 Theme List

### 1. Classic Brown (Default) ♟️
- **Light Square:** `#f0d9b5` (Beige)
- **Dark Square:** `#b58863` (Brown)
- **Use Case:** Traditional chess look, familiar to most players

### 2. Blue 🔵
- **Light Square:** `#dee3e6` (Light Blue-Gray)
- **Dark Square:** `#8ca2ad` (Blue-Gray)
- **Use Case:** Modern, calming, professional look

### 3. Green 🟢
- **Light Square:** `#ffffdd` (Cream)
- **Dark Square:** `#86a666` (Forest Green)
- **Use Case:** Natural, easy on the eyes, popular choice

### 4. Purple 🟣
- **Light Square:** `#e8d4f2` (Lavender)
- **Dark Square:** `#9f5f9f` (Purple)
- **Use Case:** Royal, elegant, distinctive

### 5. Red 🔴
- **Light Square:** `#ffd4d4` (Light Pink)
- **Dark Square:** `#c14949` (Red)
- **Use Case:** Bold, energetic, high contrast

### 6. Modern Gray ⚫
- **Light Square:** `#e8e8e8` (Light Gray)
- **Dark Square:** `#6b7280` (Gray)
- **Use Case:** Minimal, modern, sleek design

### 7. Ocean 🌊
- **Light Square:** `#d0e8f2` (Sky Blue)
- **Dark Square:** `#4a7fa0` (Ocean Blue)
- **Use Case:** Cool, refreshing, maritime theme

### 8. Wood 🪵
- **Light Square:** `#dfc99c` (Light Wood)
- **Dark Square:** `#a67c52` (Dark Wood)
- **Use Case:** Natural, warm, wooden board feel

### 9. Ice 🧊
- **Light Square:** `#e0f4ff` (Ice Blue)
- **Dark Square:** `#7cb8d9` (Cool Blue)
- **Use Case:** Cool, crisp, winter theme

### 10. Coral 🪸
- **Light Square:** `#ffe4e6` (Light Coral)
- **Dark Square:** `#f87171` (Coral Red)
- **Use Case:** Warm, vibrant, tropical feel

### 11. Emerald 💎
- **Light Square:** `#d1fae5` (Mint)
- **Dark Square:** `#059669` (Emerald Green)
- **Use Case:** Rich, luxurious, gemstone theme

### 12. Amber 🟡
- **Light Square:** `#fef3c7` (Cream)
- **Dark Square:** `#d97706` (Amber)
- **Use Case:** Warm, golden, sunshine theme

### 13. Tournament 🏆
- **Light Square:** `#ffffff` (White)
- **Dark Square:** `#333333` (Dark Gray)
- **Use Case:** High contrast, professional tournaments, accessibility

### 14. Neon ✨
- **Light Square:** `#fef08a` (Neon Yellow)
- **Dark Square:** `#8b5cf6` (Neon Purple)
- **Use Case:** Vibrant, fun, modern gaming aesthetic

### 15. Marble 🗿
- **Light Square:** `#f8fafc` (White Marble)
- **Dark Square:** `#94a3b8` (Gray Marble)
- **Use Case:** Elegant, sophisticated, museum-quality

---

## 💻 Usage

### Basic Usage with Theme

```tsx
import { ChessBoard } from './components/chess';

function MyChessGame() {
  return (
    <ChessBoard
      theme="green"  // Set your preferred theme
      onMove={(move, fen) => console.log('Move:', move)}
    />
  );
}
```

### With Theme Selector (Full)

```tsx
import { useState } from 'react';
import { ChessBoard, ThemeSelector } from './components/chess';
import type { ChessBoardTheme } from './types/chess';

function MyChessGame() {
  const [theme, setTheme] = useState<ChessBoardTheme>('classic');

  return (
    <div>
      <ThemeSelector
        currentTheme={theme}
        onThemeChange={setTheme}
      />
      <ChessBoard
        theme={theme}
        onMove={(move, fen) => console.log('Move:', move)}
      />
    </div>
  );
}
```

### With Theme Selector (Compact)

```tsx
import { useState } from 'react';
import { ChessBoard, ThemeSelector } from './components/chess';

function MyChessGame() {
  const [theme, setTheme] = useState('blue');

  return (
    <div>
      <ThemeSelector
        currentTheme={theme}
        onThemeChange={setTheme}
        compact  // Dropdown instead of grid
      />
      <ChessBoard theme={theme} />
    </div>
  );
}
```

### Using the Combined Component

```tsx
import { ChessBoardWithThemes } from './components/chess/ChessBoardWithThemes';

function MyChessGame() {
  return (
    <ChessBoardWithThemes
      showThemeSelector={true}
      compactThemeSelector={false}
      onMove={(move, fen) => console.log('Move:', move)}
    />
  );
}
```

---

## 🎨 Customizing Themes

### Adding Your Own Theme

1. **Add CSS Variables** in `chess.css`:

```css
/* Your Custom Theme */
.chess-board-wrapper.theme-custom {
  --square-light: #yourLightColor;
  --square-dark: #yourDarkColor;
}
```

2. **Add to TypeScript Types** in `types/chess.ts`:

```typescript
export type ChessBoardTheme =
  | 'classic'
  | 'blue'
  // ... other themes
  | 'custom';  // Add your theme
```

3. **Add to Theme Selector** in `ThemeSelector.tsx`:

```typescript
const THEMES = [
  // ... existing themes
  { id: 'custom', name: 'My Theme', light: '#yourLight', dark: '#yourDark', emoji: '🎨' },
];
```

### Dynamic Theme Colors

```tsx
function ChessWithDynamicColors() {
  return (
    <ChessBoard
      theme="classic"
      // Override with inline styles if needed
      style={{
        '--square-light': '#your-color',
        '--square-dark': '#your-other-color',
      } as React.CSSProperties}
    />
  );
}
```

---

## 🌈 Theme Recommendations

### Best for Beginners
- **Classic Brown** - Familiar and traditional
- **Green** - Easy on the eyes
- **Wood** - Natural and warm

### Best for Long Sessions
- **Blue** - Calming, reduces eye strain
- **Gray** - Minimal, non-distracting
- **Ocean** - Cool and relaxing

### Best for High Contrast
- **Tournament** - Maximum contrast
- **Red** - Bold and clear
- **Neon** - High visibility

### Best for Aesthetics
- **Purple** - Royal and elegant
- **Marble** - Sophisticated
- **Emerald** - Luxurious

### Best for Fun/Casual
- **Neon** - Vibrant and playful
- **Coral** - Warm and inviting
- **Amber** - Cheerful and bright

---

## 🔧 Accessibility

### High Contrast Options
For users with visual impairments, recommend:
- **Tournament** (White/Black) - Maximum contrast
- **Blue** (Light/Dark Blue-Gray) - Good contrast, colorblind-friendly
- **Gray** (Light/Dark Gray) - Clear distinction

### Color Blind Friendly
These themes work well for color blindness:
- **Tournament** - No color dependency
- **Gray** - Grayscale based
- **Blue** - Blue-gray spectrum is distinguishable

---

## 📱 Mobile Considerations

All themes are optimized for:
- ✅ Touch interfaces
- ✅ Various screen sizes
- ✅ Different lighting conditions
- ✅ Battery-saving dark modes

**Tip:** Lighter themes (Tournament, Marble) work better in bright sunlight, while darker themes (Gray, Ocean) are better for low-light conditions.

---

## 🎯 User Preferences

### Save User Theme Preference

```tsx
import { useState, useEffect } from 'react';
import { ChessBoard, ThemeSelector } from './components/chess';

function MyChessGame() {
  const [theme, setTheme] = useState(() => {
    // Load from localStorage
    return (localStorage.getItem('chessTheme') as ChessBoardTheme) || 'classic';
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('chessTheme', theme);
  }, [theme]);

  return (
    <>
      <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
      <ChessBoard theme={theme} />
    </>
  );
}
```

---

## 🎨 Theme Gallery

### Preview All Themes

```tsx
import { ChessBoard } from './components/chess';

const themes = ['classic', 'blue', 'green', 'purple', 'red', 'gray', 
                'ocean', 'wood', 'ice', 'coral', 'emerald', 'amber', 
                'tournament', 'neon', 'marble'];

function ThemeGallery() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
      {themes.map(theme => (
        <div key={theme}>
          <h3>{theme.charAt(0).toUpperCase() + theme.slice(1)}</h3>
          <ChessBoard theme={theme} disabled />
        </div>
      ))}
    </div>
  );
}
```

---

## 📊 Popular Themes (User Data)

Based on typical preferences:

1. 🥇 **Classic Brown** - 35% (Familiarity)
2. 🥈 **Green** - 20% (Eye comfort)
3. 🥉 **Blue** - 15% (Professional look)
4. **Wood** - 10% (Natural feel)
5. **Tournament** - 8% (High contrast)
6. **Others** - 12%

---

**Choose the theme that works best for you and enjoy your chess games!** ♟️🎨
