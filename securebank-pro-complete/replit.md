# SecureBank Pro - Banking Security Educational Game

## Overview

SecureBank Pro is an educational cybersecurity game that simulates a banking environment where players learn about encryption, security protocols, and cyber defense mechanisms. The application is built as a full-stack web application using React with TypeScript frontend, Express.js backend, and PostgreSQL database with Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom banking theme colors and animations
- **State Management**: React hooks with custom game state management
- **Routing**: Wouter for lightweight client-side routing
- **Query Management**: TanStack Query for server state management
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript and ESM modules
- **Framework**: Express.js for HTTP server and API routes
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: PostgreSQL session store with connect-pg-simple
- **Development**: Hot reload with Vite middleware integration

### Data Storage
- **Primary Database**: PostgreSQL (configured for Neon serverless in production)
- **ORM**: Drizzle ORM with automatic type generation from schema
- **Migrations**: Drizzle Kit for database schema migrations
- **Local State**: In-memory storage for development with planned PostgreSQL integration

## Key Components

### 1. Game Engine (`client/src/pages/SecureBankGame.tsx`)
- **Purpose**: Core game orchestration and state management
- **Features**:
  - Level progression with dynamic time limits (5-10 minutes based on level)
  - Score tracking and streak management
  - Quiz triggering every 5 successful transactions
  - Achievement system integration

### 2. Cryptographic System (`client/src/lib/crypto-utils.ts`)
- **Purpose**: Educational cryptography implementations
- **Features**:
  - AES-256 encryption simulation with proper key generation
  - SHA-256 hashing for data integrity
  - OTP generation with 60-second expiry
  - Phishing detection algorithms
- **Rationale**: Provides realistic crypto operations for educational purposes without actual security dependencies

### 3. Component Architecture
- **CryptoPanel**: Handles encryption/decryption workflows
- **OTPPanel**: Manages two-factor authentication simulation
- **QuizPanel**: Presents security knowledge challenges
- **TransactionPanel**: Simulates secure banking transactions
- **SecurityTools**: Provides hash generation and phishing analysis

### 4. Game State Management (`client/src/lib/game-state.ts`)
- **Purpose**: Persistent game progress tracking
- **Features**:
  - Local storage persistence
  - Session tracking with timestamps
  - Achievement and transaction history
  - Score and streak calculations

## Data Flow

### 1. Game Initialization
- Load saved game state from localStorage or create default state
- Initialize timer based on current level (5-10 minutes)
- Set up notification system and particle background effects

### 2. Transaction Workflow
1. Player generates AES encryption key
2. Encrypts transaction data (account, amount, content)
3. Generates and validates OTP within 60-second window
4. Completes transaction and updates score/streak
5. Triggers quiz every 5 successful transactions

### 3. Quiz System
- Dynamic question selection based on player level
- Categories: crypto, security, phishing, banking
- 3-minute time limit per question with explanations
- Score bonus calculation based on difficulty and speed

### 4. Level Progression
- Automatic advancement when timer expires or manual progression
- Increasing time limits: Level 1-3 (5min), 4-6 (7min), 7+ (10min)
- Level bonuses and achievement unlocks

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter)
- **UI Framework**: Radix UI primitives, Tailwind CSS, Lucide icons
- **Backend**: Express.js, Drizzle ORM, PostgreSQL drivers
- **Development**: Vite, TypeScript, ESBuild for production builds
- **Database**: Neon serverless PostgreSQL for production deployment

### Development Tools
- **TypeScript**: Strict type checking with path aliases
- **ESLint/Prettier**: Code formatting and linting (implied)
- **Drizzle Kit**: Database migration and schema management

## Deployment Strategy

### Development
- Vite dev server with HMR for frontend
- Express server with TypeScript compilation via tsx
- In-memory storage for rapid prototyping

### Production Build
- Vite build generates optimized static assets
- ESBuild bundles Node.js server for production
- Static files served from Express with fallback routing

### Deployment Platforms
- **Recommended**: Vercel for automatic deployments with Git integration
- **Alternative**: Railway, DigitalOcean, or traditional cloud providers
- **Database**: Neon PostgreSQL serverless for production
- **Assets**: Bundled with application, no external CDN required

## Changelog

Changelog:
- July 02, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.