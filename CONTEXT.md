# Vocabify - AI Context File

This file provides essential context for AI agents working on this codebase. Read this before making changes.

## Project Overview

Vocabify is a personal-first vocabulary learning application built with Laravel 12 and React (via Inertia.js). The application emphasizes active recall, mixed-direction testing, and user-controlled evaluation rather than automated correctness.

## Core Principles

1. **User-Controlled Evaluation**: Reviewer Mode is a core feature. Users manually mark correctness, resolving typos, near-misses, and alternative valid answers.

2. **No Gamification**: No streaks, XP, badges, dopamine mechanics, or social features.

3. **Domain-Driven Design**: Business logic lives in `domain/Vocabulary/`, not in controllers.

4. **Thin Controllers**: Controllers are HTTP adapters that delegate to domain actions.

## Architecture

### Backend Structure

- **`app/Http/Controllers/Auth/`**: Authentication controllers (shared)

- **`app/Http/Web/`**: Feature-based organization
  - Each feature has its own folder: `Web/PageName/`
  - Required subdirectories in each feature folder:
    - `Controllers/` - Feature-specific controllers
    - `Requests/` - Feature-specific form request validation
    - `Queries/` - Feature-specific query classes
    - `Resources/` - Feature-specific API resources/transformers
  - Optional subdirectories (add as needed):
    - `Data/` - Feature-specific data transfer objects
    - Other folders as needed

- **`domain/Vocabulary/`**: All business logic
  - `Actions/`: Business operations (CreateDataset, AddWords, StartSession, SubmitAnswers, ReviewSessionItems)
  - `Models/`: Core models (Dataset, Word, Session, SessionItem)
  - `Services/`: Domain services (SessionGeneration, AnswerChecking)
  - `Policies/`: Authorization policies
  - `Requests/`: Form request validation

### Backend Feature Folder Structure

**Every new feature MUST follow this structure:**

```
app/Http/Web/
└── PageName/              # Feature folder (PascalCase)
    ├── Controllers/       # REQUIRED - Feature-specific controllers (PascalCase classes)
    ├── Requests/          # REQUIRED - Form request validation (PascalCase classes)
    ├── Queries/           # REQUIRED - Query classes (PascalCase classes)
    ├── Resources/         # REQUIRED - API resources/transformers (PascalCase classes)
    └── [others]/          # Optional: Data/, etc. (PascalCase classes)
```

**Example:**
```
app/Http/Web/
└── Datasets/              # PascalCase folder
    ├── Controllers/
    │   ├── DatasetController.php        # PascalCase class
    │   └── DatasetStoreController.php   # PascalCase class
    ├── Requests/
    │   └── StoreDatasetRequest.php      # PascalCase class
    ├── Queries/
    │   └── GetDatasetsQuery.php         # PascalCase class
    └── Resources/
        └── DatasetResource.php          # PascalCase class
```

### Frontend Structure

- **`resources/js/pages/`**: Inertia page components (mapped to routes)
  - Each page has its own folder: `pages/pageName/`
  - Required subdirectories in each page folder:
    - `components/` - Page-specific React components
    - `validations/` - Page-specific validation schemas/rules
    - `data/` - Page-specific data fetching, queries, or data handling
  - Optional subdirectories (add as needed):
    - `contexts/` - React contexts for page state
    - `reducers/` - State reducers
    - `utils/` - Page-specific utility functions
    - `constants/` - Page-specific constants
  - Main page component: `pages/pageName/pageName.jsx` or `pages/pageName/index.jsx`
- **`resources/js/components/`**: Reusable React components (shared across pages)
- **`resources/js/layouts/`**: Layout components
  - Each layout has its own folder: `layouts/layoutName/`
  - Main layout component: `layouts/layoutName/layoutName.jsx` or `layouts/layoutName/index.jsx`
  - Optional: styles, contexts/, or other supporting files
- **`resources/js/hooks/`**: Custom React hooks
- **`resources/js/utils/`**: Utility functions

### Page Folder Structure

**Every new page MUST follow this structure:**

```
resources/js/pages/
└── page-name/             # Page folder (kebab-case)
    ├── components/        # REQUIRED - Page-specific components
    ├── validations/       # REQUIRED - Validation schemas
    ├── data/             # REQUIRED - Data fetching/handling
    ├── page-name.jsx      # Main page component (kebab-case)
    ├── page-name.scss     # REQUIRED - Page-specific SCSS (kebab-case, classNames logic only)
    └── [others]/         # Optional: contexts/, reducers/, utils/, constants/
```

**Example:**
```
resources/js/pages/
└── datasets/              # kebab-case folder
    ├── components/
    │   ├── dataset-form.jsx      # kebab-case file, component: DatasetForm
    │   └── dataset-list.jsx      # kebab-case file, component: DatasetList
    ├── validations/
    │   └── dataset-schema.js     # kebab-case file
    ├── data/
    │   └── use-datasets.js       # kebab-case file
    └── datasets.jsx              # kebab-case file, component: Datasets
```

### Layout Folder Structure

**Every new layout MUST follow this structure:**

```
resources/js/layouts/
└── layout-name/           # Layout folder (kebab-case)
    ├── layout-name.jsx    # Main layout component (kebab-case)
    └── [others]/          # Optional: styles (kebab-case), contexts/, etc.
```

**Example:**
```
resources/js/layouts/
└── authenticated-layout/              # kebab-case folder
    ├── authenticated-layout.jsx        # kebab-case file, component: AuthenticatedLayout
    ├── authenticated-layout.scss       # kebab-case file
    └── contexts/
        └── navigation-context.js      # kebab-case file
```

## Tech Stack

- **Backend**: Laravel 12, PHP 8.2+, Inertia.js
- **Frontend**: React 18, Vite, TailwindCSS 4
- **Database**: MySQL/PostgreSQL (SQLite for development)

## Path Aliases

- `@/` → `resources/js/` (use for JS/JSX imports)
- `@assets/` → `resources/assets/` (use for static assets)

**IMPORTANT**: Always use `@/` alias for imports. Never use relative paths like `../` or `./` when importing from `resources/js/`.

Examples:
- ✅ `import Layout from '@/layouts/Layout'`
- ✅ `import { useHelper } from '@/hooks/useHelper'`
- ❌ `import Layout from '../layouts/Layout'`
- ❌ `import { useHelper } from '../../hooks/useHelper'`

## Routing

- All routes in `routes/web.php`
- Use `Inertia::render('PageName')` for page responses
- Term "API" reserved for external integrations only
- Internal JSON endpoints are application routes

## Key Features

1. **Dataset Management**: Manage decks of vocabulary words with language pairs
2. **Study Sessions**: Random word selection, mixed recall directions (base→target or target→base)
3. **Reviewer Mode**: User manually reviews and marks each item as correct/incorrect
4. **Flexible Input**: Supports typed input and external recall (paper-based)

## Development Guidelines

### When Adding Features

1. **Business Logic**: Add to `domain/Vocabulary/Actions/` or `domain/Vocabulary/Services/`
2. **Backend Feature Structure**:
   - Create a new folder in `app/Http/Web/PageName/`
   - Include required subdirectories: `Controllers/`, `Requests/`, `Queries/`, `Resources/`
   - Keep controllers thin - delegate to domain actions
3. **Frontend Pages**: 
   - Create a new folder in `resources/js/pages/page-name/` (kebab-case)
   - Include required subdirectories: `components/`, `validations/`, `data/`
   - Add main page component: `page-name.jsx` or `index.jsx` (kebab-case)
   - Create page SCSS file: `page-name.scss` (kebab-case, containing only classNames logic for that page)
   - Import the SCSS file in `resources/css/app.scss` (or `resources/scss/app.scss`): `@use "@/pages/page-name/page-name";` (kebab-case)
   - Render with `Inertia::render('page-name/page-name')` or `Inertia::render('page-name')` (kebab-case)
4. **Components**: 
   - Page-specific components go in `pages/pageName/components/`
   - Reusable/shared components go in `resources/js/components/`

### Code Style

- PHP: Follow Laravel conventions, use Laravel Pint
- React: PascalCase for components, camelCase for functions
- No React imports needed (automatic JSX runtime)
- Use path aliases (`@/` and `@assets/`)

### File Naming Conventions

**Backend (PHP):**
- **Classes**: PascalCase (e.g., `DatasetController`, `StoreDatasetRequest`, `GetDatasetsQuery`)
- **Methods**: camelCase (e.g., `storeDataset()`, `getUserData()`)
- **Files**: Match class name (e.g., `DatasetController.php`)

**Frontend (JavaScript/React):**
- **Files and Folders**: kebab-case (e.g., `home.jsx`, `dataset-form.jsx`, `user-profile/`, `authenticated-layout/`)
- **Component Names**: PascalCase (e.g., `DatasetForm`, `UserProfile`, `AuthenticatedLayout`)
- **Functions/Hooks**: camelCase (e.g., `useDatasets()`, `handleSubmit()`)
- **Note**: Component files use kebab-case, but the component itself is PascalCase
  - File: `dataset-form.jsx` → Component: `DatasetForm`
  - File: `user-profile.jsx` → Component: `UserProfile`

### Styling Pattern

**Each page MUST have its own SCSS file:**
- Location: `resources/js/pages/pageName/pageName.scss`
- Content: Strictly logic with classNames related to that page only
- No shared styles, global overrides, or utility classes in page SCSS files

**All page SCSS files MUST be imported in `app.scss`:**
- Main file: `resources/css/app.scss` (or `resources/scss/app.scss` if using SCSS structure)
- Import pattern: `@use "@/pages/page-name/page-name";` (kebab-case)
- All page SCSS imports should be grouped together in the file

**Example:**
```scss
// resources/css/app.scss (or resources/scss/app.scss)

// ... other imports (tokens, mixins, components, etc.) ...

// ==========================================================================
// Pages
// ==========================================================================

@use "@/pages/home/home";
@use "@/pages/datasets/datasets";
@use "@/pages/study-sessions/study-sessions";
```

### React Component Props Pattern

**NEVER destructure props in function parameters:**
```jsx
// ❌ WRONG - Do not use this pattern
function Component({ propName, otherProp }) {
    return <div>{propName}</div>;
}

const Component = ({ propName, otherProp }) => {
    return <div>{propName}</div>;
};
```

**ALWAYS destructure props inside the function body:**
```jsx
// ✅ CORRECT - Use this pattern
const Component = (props) => {
    const { propName, otherProp } = props;
    return <div>{propName}</div>;
};

```

### Important Patterns

- **Domain Actions**: Encapsulate business operations
- **Services**: Reusable business logic
- **Policies**: Authorization logic
- **Inertia Pages**: One page component per route

## File Locations Reference

- Routes: `routes/web.php`
- Backend Features: `app/Http/Web/PageName/` (with Controllers/, Requests/, Queries/, Resources/)
- Auth Controllers: `app/Http/Controllers/Auth/`
- Domain Logic: `domain/Vocabulary/`
- React Pages: `resources/js/pages/pageName/` (with components/, validations/, data/)
- React Components: `resources/js/components/`
- React Layouts: `resources/js/layouts/layoutName/` (each layout in its own folder)
- Vite Config: `vite.config.js`
- JS Config: `jsconfig.json`

## Before Making Changes

1. Check if logic belongs in domain module
2. Verify controller is thin (delegates to domain)
3. Use Inertia for frontend routing
4. Follow existing patterns in domain/Vocabulary
5. Maintain user-controlled evaluation philosophy
