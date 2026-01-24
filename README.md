# Vocabulary Learning App (Personal-First)

## Overview

This project is a personal-first vocabulary learning application built around active recall, mixed-direction testing, and user-controlled evaluation.

It is designed primarily to support how the author actually studies vocabulary, rather than forcing the learner into rigid, gamified, or overly automated learning systems.
The app is intentionally extensible so others can use it if the approach fits their learning style.

This is a learning instrument, not a teaching platform.

## Core Philosophy

Most vocabulary apps optimize for:

- engagement loops
- gamification
- automated correctness
- lowest-effort interactions

This project optimizes for:

- cognitive difficulty
- active recall
- mixed recall directions
- human judgment over automation
- compatibility with paper-based study

The system assists learning — it does not dictate it.

## What the App Does

- Manages datasets (decks) of vocabulary words defined by explicit language pairs
- Runs study sessions using a random subset of words
- Hides one side of each word pair (base or target language)
- Forces the user to recall, not recognize
- Supports both typed input and external recall (e.g. paper)
- Uses automatic checking only as a first pass
- Final correctness is always decided by the user in Reviewer Mode

## How Learning Sessions Work

The user selects:

- a dataset
- the number of words (N)
- the checking mode (automatic or manual-first)

A session starts:

- N words are randomly selected
- For each word, one language is shown and the other is hidden
- Recall direction is mixed randomly within the session

The user recalls the hidden word:

- by typing it into the app or
- by writing/thinking externally

Answers may be auto-checked if enabled.

After the session, the user enters Reviewer Mode.

In Reviewer Mode, the user sees for every word:

- the prompt
- the correct answer
- their entered answer (if any)

The user manually marks each item as correct or incorrect, resolving:

- typos
- near-misses
- alternative valid answers

Final correctness is always user-authoritative.

## Reviewer Mode Philosophy

Reviewer Mode is a core feature, not a fallback.

The app assumes:

- humans understand intent better than algorithms
- typos and handwriting are inevitable
- learning is harmed when correctness is overly rigid

Automation assists, but judgment belongs to the learner.

## What This App Is Not

By design, this project is:

❌ Not gamified

❌ No streaks, XP, badges, or dopamine mechanics

❌ No social features or leaderboards

❌ No AI tutor or chat interface

❌ No hand-holding explanations

❌ Not a full language course

It tests recall.
It does not motivate, entertain, or teach rules.

## Target Users

**Primary:**

- Self-directed learners who already know how they study best
- Learners who prefer typed or written recall
- Users frustrated with rigid flashcard systems
- People who want control over evaluation instead of automation

**Secondary:**

- Learners who outgrow Duolingo-style tools
- Users seeking a minimal, distraction-free recall environment

## Tech Stack

### Backend

- **Laravel**
  - Authentication
  - Domain logic
  - Session handling
  - Data persistence
- Relational database (MySQL / PostgreSQL)

### Frontend

- **React (SPA)**
  - Session runner
  - Reviewer Mode UI
  - Dataset management
- Vite for asset bundling

## Architecture

- Single application
- Laravel serves:
  - the React SPA
  - JSON endpoints consumed by the SPA
- No separate API project
- External APIs (if added later) are kept conceptually separate

## Project Structure (High-Level)

```
vocabify/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   └── App/
│   │   │       └── Vocabulary/
│   │   ├── Middleware/
│   │   └── Requests/
├── domain/
│   └── Vocabulary/
│       ├── Actions/
│       ├── Models/
│       ├── Requests/
│       ├── Services/
│       └── Policies/
├── database/
│   ├── migrations/
│   ├── factories/
│   └── seeders/
├── resources/
│   ├── js/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   └── utils/
│   └── views/
├── routes/
│   └── web.php
└── tests/
```

## Routing Strategy

- All routes are defined in `routes/web.php`
- Routes serve:
  - authentication pages
  - the React SPA entry point
  - JSON endpoints consumed by the SPA
- The term "API" is reserved for external integrations only
- Internal JSON endpoints are treated as application routes, not public APIs

## Domain-Driven Design

The `domain/Vocabulary` module contains all business logic:

**Core Models**

- Dataset
- Word
- Session
- SessionItem

**Actions**

- Create dataset
- Add words
- Start session
- Submit answers
- Review session items

**Services**

- Session generation
- Answer checking
- Future statistics / analysis

Controllers act as thin HTTP adapters and delegate logic to domain actions.

## Extensibility (Without Promises)

The system is intentionally extensible to support:

- phrases
- grammar patterns
- alternative recall mechanics

However, extensibility never overrides the core principles:

- explicit learning methods
- inspectable logic
- user-controlled evaluation

## Status

This project is built first for personal use,
and shared because others may benefit from the same approach.

No market assumptions.
No growth hacks.
No fake roadmap.
