# PROOF Web - React Frontend

Modern React-based frontend for PROOF, built with TypeScript, Vite, and Tailwind CSS.

## Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first CSS with custom design tokens
- **React Router v6** - Client-side routing
- **Custom Design System** - PROOF brand colors (Cream, Navy, Teal, Gold)

## Design System

### Brand Colors

**Light Mode:**
- Background: Cream (#FBF8ED)
- Surface: White (#FFFFFF)
- Primary (Brand): Teal (#23AD99)
- Secondary (Economy): Gold (#E9AA19)

**Dark Mode:**
- Background: Navy (#151853)
- Surface: Lighter Navy (#1F2763)
- Primary: Teal (#23AD99 - consistent)
- Secondary: Gold (#E9AA19 - consistent)

### Typography
- **Sans**: Manrope
- **Display/Headings**: Space Grotesk

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server will start at `http://localhost:3000`

## Project Structure

```
web-react/
├── src/
│   ├── components/       # React components
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── ContinueLearning.tsx
│   │   ├── DailyChallenge.tsx
│   │   ├── Achievements.tsx
│   │   └── Icons.tsx
│   ├── pages/           # Route pages
│   │   ├── HomePage.tsx
│   │   ├── LearnPage.tsx
│   │   ├── ReviewsPage.tsx
│   │   ├── ProvePage.tsx
│   │   ├── WorkPage.tsx
│   │   ├── TeachPage.tsx
│   │   ├── LeaderboardPage.tsx
│   │   ├── NotificationsPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── GlossaryPage.tsx
│   │   ├── SocraticPage.tsx
│   │   └── SettingsPage.tsx
│   ├── lib/             # Utilities
│   │   └── utils.ts
│   ├── App.tsx          # Main app component with routing
│   ├── main.tsx         # Entry point
│   ├── index.css        # Global styles & design tokens
│   └── data.ts          # Mock data & types
├── public/              # Static assets
│   ├── course-webdev.jpg
│   ├── trending-git.jpg
│   └── trending-ui.jpg
├── index.html           # HTML entry
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies
```

## Routing

All routes from the old frontend have been connected to the new navigation system using React Router v6:

### Main Routes
- **`/`** - Home dashboard with stats, learning progress, achievements
- **`/learn`** - Learning hub with paths and courses
- **`/learn/path/:id`** - Specific learning path details
- **`/learn/lesson/:pathId/:topic`** - Individual lesson view
- **`/reviews`** - Spaced repetition review queue
- **`/reviews/:id`** - Active review session
- **`/prove`** - Proof challenges hub
- **`/prove/challenge/:id`** - Challenge details
- **`/prove/attempt/:id`** - View proof attempt
- **`/daily`** - Daily challenge (special route)
- **`/work`** - Find work opportunities
- **`/work/:tab`** - Work tabs (e.g., `/work/sponsored`)
- **`/work/teach`** - Teaching opportunities (separate page)
- **`/leaderboard`** - User rankings and competition
- **`/notifications`** - Activity notifications (badge: 3)
- **`/profile`** - User profile and achievements
- **`/glossary`** - Mathematical terms dictionary
- **`/socratic`** - AI Socratic tutor chat
- **`/settings`** - User preferences and app settings

### Navigation
The Sidebar uses React Router's `NavLink` component for automatic active state management:
- Active route highlighted with teal background
- Vertical indicator bar on hover/active
- Badge support for notifications
- Mobile drawer navigation
- Keyboard accessible

### 404 Handling
All unmatched routes redirect to the home page (`/`)

## Features

### Implemented
- ✅ **React Router v6 integration** - Full client-side routing
- ✅ **12 route pages** - All old frontend routes connected
- ✅ **Active navigation states** - Automatic route highlighting
- ✅ Responsive sidebar navigation (desktop + mobile)
- ✅ Global search with keyboard shortcuts (Cmd/Ctrl + K)
- ✅ Dark mode toggle with localStorage persistence
- ✅ Hero banner with animated stats counter
- ✅ Continue learning panel with progress tracking
- ✅ Daily challenge card
- ✅ Recent achievements list
- ✅ Skills building with tech logos
- ✅ Trending proofs section
- ✅ Recommended courses panel
- ✅ Sponsored content
- ✅ Animated entrance effects
- ✅ PROOF brand design system
- ✅ Fully accessible (keyboard navigation, ARIA labels, skip links)
- ✅ **50+ icons** with gradient styling

### To Implement
- ⏳ API integration for dynamic data
- ⏳ Authentication flow
- ⏳ Wallet connection
- ⏳ Dynamic route params handling (lesson content, challenges, etc.)
- ⏳ Review session logic
- ⏳ Socratic AI chat interface
- ⏳ Work/teach opportunity listings

## Design Improvements Over Original

1. **Better Button Styles**
   - More prominent CTAs with hover effects
   - Consistent sizing and spacing
   - Brand-aligned colors

2. **Enhanced Typography**
   - Clearer hierarchy with Space Grotesk for headings
   - Better line heights and letter spacing
   - Improved readability

3. **Refined Color Palette**
   - Maintains PROOF's brand identity (Teal + Gold)
   - Better contrast ratios for accessibility
   - Consistent dark mode implementation

4. **Modern Component Architecture**
   - Reusable, type-safe components
   - Clean separation of concerns
   - Easy to extend and maintain

5. **Performance Optimizations**
   - Code splitting ready
   - Optimized animations
   - Efficient re-renders

## Customization

### Adjusting Colors
Edit `src/index.css` to modify design tokens:

```css
:root {
  --brand: #23AD99;     /* Primary teal */
  --gold: #E9AA19;      /* NIM economy gold */
  /* ... other tokens */
}
```

### Adding Components
1. Create component in `src/components/`
2. Export from component file
3. Import and use in `App.tsx`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

- Semantic HTML throughout
- ARIA labels and roles
- Keyboard navigation support
- Skip-to-content link
- Focus visible states
- Respects prefers-reduced-motion

## Contributing

When adding new features:
1. Follow existing code patterns
2. Use TypeScript types
3. Maintain accessibility standards
4. Test in both light and dark modes
5. Ensure responsive behavior

## License

Proprietary - PROOF Platform
