# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bizo.bg is an insurance platform built with Laravel 12 and React (via Inertia.js). The application handles multiple insurance types (MTPL, Home, Travel, Non-Resident, Vehicle Inspection), integrates with external insurance APIs (Axiom, Broqee), and includes payment processing and policy management.

## Development Commands

### Starting Development Environment
```bash
# Start all services (server, queue, logs, vite) - preferred method
composer dev

# Or start services individually:
php artisan serve              # Backend server
php artisan queue:listen --tries=1  # Queue worker
php artisan pail --timeout=0   # Real-time logs
npm run dev                    # Vite dev server with HMR
```

### Building
```bash
npm run build                  # Build frontend assets
```

### Testing
```bash
php artisan test               # Run all tests
php artisan test --filter=TestName  # Run specific test
vendor/bin/phpunit tests/Feature/ExampleTest.php  # Run single test file
npm run test                   # Run Playwright tests (if configured)
```

### Code Quality
```bash
vendor/bin/pint                # Format PHP code (Laravel Pint)
npx prettier --write "**/*.{js,jsx,css,scss}"  # Format frontend code
```

### Database
```bash
php artisan migrate            # Run migrations
php artisan migrate:fresh --seed  # Fresh migration with seeders
php artisan db:seed            # Run seeders only
```

### Storybook
```bash
npm run storybook              # Start Storybook dev server
npm run build-storybook        # Build Storybook to public/storybook
```

## Architecture

### Domain-Driven Design Structure

The codebase uses a modified DDD approach with a separate `domain/` directory alongside the standard Laravel `app/` directory:

- **`app/`** - Laravel application layer (HTTP, Controllers, Middleware, Console, Jobs, Facades, Services)
  - `app/Http/Web/` - Web controllers organized by feature (e.g., Vehicles, Policies, Addresses)
  - `app/Http/Controllers/` - General controllers (Admin, Auth)
  - `app/Http/Middleware/` - Request middleware including Broqee webhook verification
  - `app/Services/` - Application-level services
  - `app/Facades/` - Laravel facades for domain services

- **`domain/`** - Business logic layer organized by bounded contexts:
  - `domain/Insurance/` - Core insurance domain (Policies, Events, Jobs, Mail, Services)
  - `domain/Vehicles/` - Vehicle management (Actions, Models, DTOs, Mappers, Services)
  - `domain/Users/` - User management (Actions, Models, Policies, Requests)
  - `domain/Payment/` - Payment processing and installments
  - `domain/Axiom/` - Axiom API integration (HomeInsurance, TravelInsurance, NonResidentInsurance, Global)
  - `domain/Broqee/` - Broqee API integration (MTPLInsurance)

Each domain typically contains:
- **Actions/** - Business operations and use cases
- **Models/** - Eloquent models
- **Requests/** - Form request validation
- **Policies/** - Authorization policies
- **Services/** - Domain services
- **Jobs/** - Background jobs
- **Mail/** - Email notifications
- **Events/** & **Listeners/** - Event handling
- **DataTransferObjects/** (DTOs) - Data transfer objects (mainly in Vehicles domain)
- **Mappers/** - Object mapping logic (mainly in Vehicles domain)

### Frontend Structure

React + Inertia.js SPA with the following organization:

- `resources/js/pages/` - Inertia page components mapped to routes
- `resources/js/Components/` - Reusable React components
- `resources/js/layouts/` - Layout components
- `resources/js/hooks/` - Custom React hooks
- `resources/js/data/` - Data fetching logic (React Query)
- `resources/js/utils/` - Utility functions
- `resources/js/tokens/` - Design tokens
- `resources/scss/` - SCSS styles
- `resources/assets/` - Static assets (images, icons)

### Key Technologies

- **Backend**: Laravel 12, PHP 8.2+, Inertia.js
- **Frontend**: React 18, Vite, TailwindCSS 4, React Hook Form, Yup validation
- **State Management**: React Query (@tanstack/react-query), Immer
- **UI Components**: Headless UI, React Select, React Datepicker, Sonner (toasts)
- **Data Handling**: Spatie Laravel Data, Spatie Media Library, Spatie Permissions
- **APIs**: Axiom (multiple insurance types), Broqee (MTPL), Payment gateway
- **Other**: Laravel Sanctum, DomPDF, Ziggy (route helpers), Laravel Backup, Activity Log

## Important Patterns

### Routing
Routes are defined in `routes/web.php` with controllers organized by feature in `app/Http/Web/{Feature}/Controllers/`. Each feature has dedicated controller actions (e.g., `VehiclesController`, `VehiclesCreateVehicleController`, `VehiclesUpdateVehicleController`).

### External API Integration
- **Axiom API** (`domain/Axiom/`): Handles Home, Travel, and Non-Resident insurance through dedicated subdomains with shared global utilities
- **Broqee API** (`domain/Broqee/`): Handles MTPL insurance with webhook support and IP verification middleware
- API credentials configured via `.env` with prefixes: `AXIOM_API_*`, `BROQEE_API_*`, `PAYMENT_API_*`

### Authorization
Policy-based authorization using Laravel Gates. Policies are registered in `AppServiceProvider` and located in `domain/{Context}/Policies/`. Policies exist for: Vehicles, Properties, Persons, Addresses, Policies, Installments, and insurance offers.

### Code Formatting
- **PHP**: Laravel Pint with custom rules in `pint.json` (Laravel preset, aligned multiline comments, concat spacing)
- **JS/CSS**: Prettier via lint-staged on git commits (`.lintstagedrc.json`)
- **Husky**: Git hooks configured in `.husky/`

### Environment Configuration
- Default database: SQLite (can be configured to PostgreSQL)
- Queue connection: Database
- Cache: Database
- Sessions: Database
- Media disk: Private (configurable)
- Email tracking: mail-tracker package

## Testing Notes
- PHPUnit configuration in `phpunit.xml`
- Test suites: Unit and Feature
- Playwright tests available in `tests/playwright/`
- Testing environment uses array mail driver and sync queue
