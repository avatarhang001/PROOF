# PROOF React Frontend - Routing Documentation

## Overview

This document maps the old HTML/CSS/JS frontend routes to the new React + TypeScript + React Router v6 implementation.

## Technology

- **React Router v6** - Declarative routing for React
- **NavLink** - Automatic active state management
- **BrowserRouter** - Clean URLs (no hash-based routing)

## Route Mapping

### Old Frontend (Hash-based) → New Frontend (Clean URLs)

| Old Route (Hash) | New Route | Page Component | Description |
|-----------------|-----------|----------------|-------------|
| `#/` | `/` | `HomePage` | Dashboard with stats, learning, achievements |
| `#/learn` | `/learn` | `LearnPage` | Learning hub with paths and courses |
| `#/learn/path/:id` | `/learn/path/:id` | `LearnPage` | Specific learning path details |
| `#/learn/lesson/:pathId/:topic` | `/learn/lesson/:pathId/:topic` | `LearnPage` | Individual lesson view |
| `#/reviews` | `/reviews` | `ReviewsPage` | Spaced repetition review queue |
| `#/reviews/:id` | `/reviews/:id` | `ReviewsPage` | Active review session |
| `#/prove` | `/prove` | `ProvePage` | Proof challenges hub |
| `#/prove/challenge/:id` | `/prove/challenge/:id` | `ProvePage` | Challenge details |
| `#/prove/attempt/:id` | `/prove/attempt/:id` | `ProvePage` | View proof attempt |
| `#/daily` | `/daily` | `ProvePage` | Daily challenge |
| `#/work` | `/work` | `WorkPage` | Find work opportunities |
| `#/work/:tab` | `/work/:tab` | `WorkPage` | Work tabs (e.g., `/work/sponsored`) |
| `#/work/teach` | `/work/teach` | `TeachPage` | Teaching opportunities (separate page) |
| `#/leaderboard` | `/leaderboard` | `LeaderboardPage` | User rankings |
| `#/notifications` | `/notifications` | `NotificationsPage` | Activity notifications |
| `#/profile` | `/profile` | `ProfilePage` | User profile & achievements |
| `#/glossary` | `/glossary` | `GlossaryPage` | Mathematical terms dictionary |
| `#/socratic` | `/socratic` | `SocraticPage` | AI Socratic tutor |
| `#/settings` | `/settings` | `SettingsPage` | User preferences |
| `#/onboarding` | (future) | - | Onboarding flow (not yet implemented) |

## Navigation Structure

### Sidebar Navigation Items

The sidebar (`src/components/Sidebar.tsx`) maps navigation items to routes:

```typescript
export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: HomeIcon, path: "/" },
  { id: "learn", label: "Learn", icon: BookOpenIcon, path: "/learn" },
  { id: "review", label: "Review", icon: ReviewIcon, path: "/reviews" },
  { id: "prove", label: "Prove", icon: ProveIcon, path: "/prove" },
  { id: "work", label: "Work", icon: WorkIcon, path: "/work" },
  { id: "teach", label: "Teach", icon: TeachIcon, path: "/work/teach" },
  { id: "leaderboard", label: "Leaderboard", icon: TrophyIcon, path: "/leaderboard" },
  { id: "notifications", label: "Notifications", icon: BellIcon, badge: 3, path: "/notifications" },
  { id: "profile", label: "Profile", icon: UserIcon, path: "/profile" },
  { id: "glossary", label: "Glossary", icon: GlossaryIcon, path: "/glossary" },
  { id: "socratic", label: "Socratic", icon: ChatIcon, path: "/socratic" },
  { id: "settings", label: "Settings", icon: SettingsIcon, path: "/settings" },
];
```

### Active State Management

React Router's `NavLink` component automatically applies styles based on the current route:

- **Active**: Teal background (`bg-brand-soft`), bold text, vertical indicator bar
- **Inactive**: Gray text, transparent background
- **Hover**: Elevated background, darker text

## Route Implementation

### App.tsx Router Setup

```tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/learn" element={<LearnPage />} />
    <Route path="/learn/path/:id" element={<LearnPage />} />
    <Route path="/learn/lesson/:pathId/:topic" element={<LearnPage />} />
    <Route path="/reviews" element={<ReviewsPage />} />
    <Route path="/reviews/:id" element={<ReviewsPage />} />
    <Route path="/prove" element={<ProvePage />} />
    <Route path="/prove/challenge/:id" element={<ProvePage />} />
    <Route path="/prove/attempt/:id" element={<ProvePage />} />
    <Route path="/daily" element={<ProvePage />} />
    <Route path="/work" element={<WorkPage />} />
    <Route path="/work/:tab" element={<WorkPage />} />
    <Route path="/work/teach" element={<TeachPage />} />
    <Route path="/leaderboard" element={<LeaderboardPage />} />
    <Route path="/notifications" element={<NotificationsPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/glossary" element={<GlossaryPage />} />
    <Route path="/socratic" element={<SocraticPage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</BrowserRouter>
```

## Page Components

### Current Implementation Status

All pages are placeholder components with:
- Page header with title and subtitle
- Reveal animation wrapper
- Card container with icon and description
- Consistent styling matching the design system

### Pages Directory Structure

```
src/pages/
├── HomePage.tsx          ✅ Full dashboard implementation
├── LearnPage.tsx         ⏳ Placeholder (needs lesson content)
├── ReviewsPage.tsx       ⏳ Placeholder (needs review logic)
├── ProvePage.tsx         ✅ Partial (has DailyChallenge + TrendingProofs)
├── WorkPage.tsx          ⏳ Placeholder (needs job listings)
├── TeachPage.tsx         ⏳ Placeholder (needs teaching content)
├── LeaderboardPage.tsx   ⏳ Placeholder (needs ranking data)
├── NotificationsPage.tsx ⏳ Placeholder (needs notification feed)
├── ProfilePage.tsx       ✅ Partial (has Achievements component)
├── GlossaryPage.tsx      ⏳ Placeholder (needs term definitions)
├── SocraticPage.tsx      ⏳ Placeholder (needs chat interface)
└── SettingsPage.tsx      ⏳ Placeholder (needs settings forms)
```

## Route Parameters

### Dynamic Segments

Several routes accept dynamic parameters that will be used for data fetching:

- `/learn/path/:id` - Learning path ID (e.g., `/learn/path/web-dev-101`)
- `/learn/lesson/:pathId/:topic` - Path ID + topic slug (e.g., `/learn/lesson/web-dev/html-basics`)
- `/reviews/:id` - Review session ID (e.g., `/reviews/session-123`)
- `/prove/challenge/:id` - Challenge ID (e.g., `/prove/challenge/recursion-proof`)
- `/prove/attempt/:id` - Attempt ID (e.g., `/prove/attempt/attempt-456`)
- `/work/:tab` - Work tab name (e.g., `/work/sponsored`, `/work/freelance`)

### Accessing Route Parameters

Use React Router's `useParams` hook:

```tsx
import { useParams } from 'react-router-dom';

export function LearnPage() {
  const { id, pathId, topic } = useParams();
  
  // Fetch data based on params
  // ...
}
```

## Navigation Between Routes

### Programmatic Navigation

Use React Router's `useNavigate` hook:

```tsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  const goToLearn = () => navigate('/learn');
  const goToChallenge = (id: string) => navigate(`/prove/challenge/${id}`);
  
  return (
    <button onClick={goToLearn}>Go to Learn</button>
  );
}
```

### Link Components

Use React Router's `Link` or `NavLink`:

```tsx
import { Link, NavLink } from 'react-router-dom';

// Basic link
<Link to="/learn">Learn</Link>

// Nav link with active state
<NavLink
  to="/learn"
  className={({ isActive }) => isActive ? 'active' : ''}
>
  Learn
</NavLink>
```

## 404 Handling

All unmatched routes redirect to the home page:

```tsx
<Route path="*" element={<Navigate to="/" replace />} />
```

This ensures users always land on a valid page if they enter an invalid URL.

## Future Enhancements

### Authentication Guards

Add protected routes that require authentication:

```tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
}

// Usage
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>
```

### Nested Layouts

Create layout components for shared UI:

```tsx
function DashboardLayout() {
  return (
    <div>
      <Sidebar />
      <TopBar />
      <main>
        <Outlet /> {/* Renders child routes */}
      </main>
    </div>
  );
}

// Usage
<Route element={<DashboardLayout />}>
  <Route path="/" element={<HomePage />} />
  <Route path="/learn" element={<LearnPage />} />
  {/* ... */}
</Route>
```

### Lazy Loading

Code-split routes for better performance:

```tsx
const LearnPage = lazy(() => import('./pages/LearnPage'));

<Route
  path="/learn"
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <LearnPage />
    </Suspense>
  }
/>
```

## Testing Navigation

### Manual Testing Checklist

- [ ] All sidebar links navigate correctly
- [ ] Active states update on navigation
- [ ] Back/forward buttons work
- [ ] Direct URL access works for all routes
- [ ] 404 redirect works for invalid URLs
- [ ] Mobile drawer closes after navigation
- [ ] Badge counts persist across navigation
- [ ] Theme setting persists across navigation
- [ ] Scroll position resets on navigation

### Testing URLs

```
http://localhost:3000/
http://localhost:3000/learn
http://localhost:3000/learn/path/test-123
http://localhost:3000/reviews
http://localhost:3000/prove
http://localhost:3000/daily
http://localhost:3000/work
http://localhost:3000/work/teach
http://localhost:3000/leaderboard
http://localhost:3000/notifications
http://localhost:3000/profile
http://localhost:3000/glossary
http://localhost:3000/socratic
http://localhost:3000/settings
http://localhost:3000/invalid-route (should redirect to /)
```

## Migration Notes

### Breaking Changes from Old Frontend

1. **Hash URLs removed** - Old bookmarks with `#/` prefix won't work automatically
2. **Navigation state management** - React Router handles active states instead of manual JS
3. **Tab parameter handling** - `/work/teach` is now a separate route instead of tab param

### Backward Compatibility

To support old hash URLs, add a redirect component:

```tsx
function HashRedirect() {
  const hash = window.location.hash;
  if (hash.startsWith('#/')) {
    return <Navigate to={hash.slice(1)} replace />;
  }
  return null;
}

// Add to routes
<Route path="*" element={<HashRedirect />} />
```

## Resources

- [React Router v6 Docs](https://reactrouter.com/)
- [NavLink API](https://reactrouter.com/en/main/components/nav-link)
- [useParams Hook](https://reactrouter.com/en/main/hooks/use-params)
- [useNavigate Hook](https://reactrouter.com/en/main/hooks/use-navigate)
