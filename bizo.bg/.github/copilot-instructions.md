# Bizo.bg Copilot Instructions

## Project Overview

Bizo.bg is a Bulgarian insurance platform built with **Laravel 12** (PHP 8.2+) and **React 18** via **Inertia.js**. It handles multiple insurance types (MTPL, Home, Travel, Non-Resident, Vehicle Inspection), integrates with external insurance APIs (Axiom, Broqee), and includes payment processing and policy management.

## Architecture

### Domain-Driven Design Structure

The codebase uses a **modified DDD approach** with separate `domain/` and `app/` directories:

-   **`domain/{Context}/`** - Business logic organized by bounded contexts:
    -   `Insurance/` - Core insurance domain (Policies, Events, Jobs, Mail)
    -   `Vehicles/` - Vehicle management with DTOs and Mappers
    -   `Users/` - User, Person, Property, Address management
    -   `Payment/` - Payment processing and installments
    -   `Axiom/` - Axiom API integration (Home/Travel/NonResident/Global)
    -   `Broqee/` - Broqee API integration (MTPL)

Each domain contains: `Actions/`, `Models/`, `Requests/`, `Policies/`, `Services/`, `Jobs/`, `Mail/`, `Events/`, `Listeners/`

-   **`app/`** - Laravel application layer:
    -   `app/Http/Web/{Feature}/Controllers/` - Feature-based controllers (e.g., `Vehicles/`, `Policies/`, `HomeInsurance/`)
    -   `app/Services/External/` - External API client services (Axiom, Broqee, HeadlessServices)
    -   `app/Facades/` - Laravel facades for domain services (e.g., `MTPLInsuranceGateway`, `HomeInsuranceGateway`)
    -   `app/Http/Middleware/` - Custom middleware including Broqee webhook verification

### Frontend Structure (React + Inertia.js)

-   **`resources/js/pages/`** - Inertia page components (mapped to Laravel routes)
-   **`resources/js/Components/`** - Reusable components with BEM-style naming (`bz-*`)
-   **`resources/js/layouts/`** - Layout components with `.wrap()` pattern
-   **`resources/js/data/`** - React Query configuration and HTTP client
-   **`resources/js/hooks/`** - Custom hooks (e.g., `use-local-storage`, `use-scroll-to-error`)
-   **`resources/scss/`** - SCSS styles using `bz-` prefix and CSS custom properties (`--bz-space-*`, `--bz-border-radius-*`)

## Development Workflow

### Starting Development

```bash
composer dev  # Starts all services (server, queue, logs, vite) - PREFERRED METHOD
```

Individual services:

```bash
php artisan serve              # Backend
php artisan queue:listen --tries=1  # Queue worker
php artisan pail --timeout=0   # Real-time logs
npm run dev                    # Vite with HMR
```

### Code Quality & Formatting

```bash
vendor/bin/pint                # PHP formatting (Laravel Pint with custom rules in pint.json)
```

Prettier runs automatically via husky pre-commit hooks (see `.husky/` and `.lintstagedrc.json`)

### Testing

```bash
php artisan test               # PHPUnit tests
php artisan test --filter=TestName
npm run test                   # Playwright tests (tests/playwright/)
```

## Key Patterns

### Routing & Controllers

-   Routes in `routes/web.php` use **single-action controllers** organized by feature
-   Example: `app/Http/Web/HomeInsurance/Controllers/HomeInsuranceCalculatePriceController.php`
-   Controllers delegate to **Actions** in `domain/{Context}/Actions/`

### Authorization

-   **Policy-based authorization** using Laravel Gates
-   Policies registered in `AppServiceProvider::boot()`
-   Located in `domain/{Context}/Policies/` (e.g., `VehiclePolicy`, `PolicyPolicy`)

### External API Integration

-   **Gateway pattern**: `app/Services/External/{Provider}/{Type}/` contain API client services
-   **Facades**: `app/Facades/` provide easy access (e.g., `MTPLInsuranceGateway::calculatePrice()`)
-   **API Configuration**: `.env` with prefixes `AXIOM_API_*`, `BROQEE_API_*`, `PAYMENT_API_*`
-   **Broqee Webhooks**: Use `VerifyBroqeeWebhookIPMiddleware` for IP verification

### Frontend Patterns

1. **Layout Wrapping**: Pages use `.wrap()` method to apply layouts

    ```jsx
    export default AppLayout.wrap(Welcome);
    ```

2. **Form Handling**: React Hook Form + Yup validation

    ```jsx
    const { control, handleSubmit } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { ... }
    });
    ```

3. **State Management**:

    - React Query for server state (`resources/js/data/query-client.js`)
    - Context API for multi-step forms (`useFormDataContext`)
    - Local storage hooks for persistence

4. **Component Styling**:

    - BEM methodology with `bz-` prefix (e.g., `bz-card`, `bz-card__media`)
    - CSS custom properties via props: `padding="400"` → `var(--bz-space-400)`
    - `classnames` utility for conditional classes
    - **Box component**: Generic container with spacing props (see `resources/js/Components/box/box.jsx`)

5. **Navigation**: Ziggy for route generation: `route('home-insurance')` in JSX

### Actions Pattern

-   Business operations encapsulated in Action classes (domain layer)
-   Example: `CreateVehicleAction`, `UpdatePolicyAction`, `NotifyPolicyActivationSuccessAction`
-   Actions handle logic like creating/updating records, checking for duplicates, syncing relationships

### Data Transfer

-   **Spatie Laravel Data** for DTOs (mainly in Vehicles domain)
-   **Mappers**: Transform API responses to internal models (see `domain/Vehicles/Mappers/`)

## Environment & Configuration

-   **Database**: SQLite by default (configurable to PostgreSQL)
-   **Queue/Cache/Sessions**: Database driver
-   **Media Storage**: Spatie Media Library (private disk)
-   **Email**: Mail Tracker package enabled

## Naming Conventions

-   **PHP**: PSR-4 autoloading, `Domain\` and `App\` namespaces
-   **React Components**: PascalCase files and exports, kebab-case directories
-   **CSS Classes**: BEM with `bz-` prefix (e.g., `bz-button`, `bz-button--primary`, `bz-button__icon`)
-   **Routes**: Dot notation (e.g., `home-insurance`, `policies.index`, `vehicles.show`)

## Important Files

-   `routes/web.php` - All web routes
-   `app/Providers/AppServiceProvider.php` - Policy registration, Vite prefetch
-   `resources/js/app.jsx` - React app entry point
-   `resources/js/layouts/app-layout/app-layout.jsx` - Main layout with navigation structure
-   `vite.config.js` - `@assets` alias for `resources/assets`
-   `tailwind.config.js` - TailwindCSS configuration
-   `pint.json` - PHP formatting rules

## Common Pitfalls

-   **Always use Facades** for external API calls (e.g., `MTPLInsuranceGateway::` not direct service instantiation)
-   **Authorization**: Check policies before mutations (already registered in `AppServiceProvider`)
-   **Queue jobs**: Use `--tries=1` to avoid retry loops during development
-   **React imports**: Use `@/` alias for `resources/js/` paths
-   **Inertia responses**: Controllers should return `Inertia::render()` not JSON
-   **Multi-step forms**: Use Context API pattern (see `resources/js/pages/non-resident-insurance/contexts/`)
