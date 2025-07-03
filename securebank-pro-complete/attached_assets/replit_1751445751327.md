# SecureBank Pro - Banking Security Game

## Overview

SecureBank Pro is an educational cybersecurity game that simulates a banking environment where players learn about encryption, security protocols, and cyber defense mechanisms. The application is built using Python with PySide6 for the desktop GUI interface and includes both desktop and web components.

## System Architecture

### Frontend Architecture
- **Desktop Application**: Built with PySide6 (Qt for Python) providing a rich, native desktop experience
- **Web Interface**: HTML/CSS/JavaScript interface for browser-based gameplay
- **Animated UI Components**: Custom widgets with gradient backgrounds, particle effects, and smooth animations
- **Responsive Design**: Adaptive layouts that work across different screen sizes

### Backend Architecture
- **Game Engine**: Python-based game logic handling player progression, challenges, and scoring
- **Cryptographic Module**: Dedicated crypto utilities for AES encryption/decryption operations  
- **Upgrade System**: Modular upgrade mechanics with configurable effects and costs
- **State Management**: In-memory game state with progression tracking

### Security Layer
- **AES Encryption**: CBC mode with random IV generation for secure data handling
- **RSA Integration**: Public-key cryptography support for advanced security challenges
- **Base64 Encoding**: URL-safe encoding for data transmission and storage
- **Input Validation**: Robust error handling and input sanitization

## Key Components

### 1. Main Game Engine (`main.py`)
- **Purpose**: Core game logic and UI orchestration
- **Responsibilities**: 
  - Game state management
  - UI rendering and event handling
  - Player progression tracking
  - Challenge generation and validation

### 2. Cryptographic Utilities (`crypto_utils.py`)
- **Purpose**: Secure encryption/decryption operations
- **Key Features**:
  - AES-256 encryption with CBC mode
  - Automatic IV generation and embedding
  - Base64 URL-safe encoding
  - Comprehensive error handling
- **Rationale**: Separated crypto logic for modularity and security auditing

### 3. Web Interface (`index.html`)
- **Purpose**: Browser-based game access point
- **Features**:
  - Modern CSS3 animations and gradients
  - Responsive design principles
  - Cross-browser compatibility
- **Integration**: Serves as alternative frontend to desktop application

### 4. Upgrade System
- **Architecture**: Dictionary-based upgrade definitions with effect modifiers
- **Categories**: 
  - Detection systems (firewalls, scanners)
  - Performance boosters (CPU, backup servers)
  - Educational content (training modules)
- **Economy**: Point-based purchasing system with progressive difficulty

## Data Flow

1. **Game Initialization**: Load upgrade definitions and initialize UI components
2. **Challenge Generation**: Create cryptographic puzzles with randomized parameters
3. **Player Input Processing**: Validate and encrypt/decrypt user responses
4. **Scoring Calculation**: Award points based on accuracy, speed, and difficulty
5. **Progression Tracking**: Update player stats and unlock new challenges
6. **State Persistence**: Maintain game progress during session

## External Dependencies

### Core Libraries
- **PySide6**: Qt-based GUI framework for desktop interface
- **pycryptodome**: Cryptographic operations (AES, RSA)
- **hashlib**: Built-in hashing utilities
- **base64**: Data encoding/decoding
- **random/string**: Challenge generation

### System Requirements
- Python 3.7+ environment
- Qt6 runtime libraries
- Modern web browser (for HTML interface)

## Deployment Strategy

### Development Environment
- **Local Development**: Direct Python execution with dependency management
- **Hot Reload**: File watching for rapid development iteration
- **Cross-Platform**: Supports Windows, macOS, and Linux

### Distribution Options
1. **Standalone Executable**: PyInstaller bundling for end-user distribution
2. **Web Deployment**: Static hosting for HTML/CSS/JS components
3. **Container Deployment**: Docker containerization for consistent environments

### Security Considerations
- No persistent data storage (session-based only)
- Client-side encryption for educational purposes
- No network communication requirements
- Sandboxed execution environment

## Changelog

Changelog:
- July 01, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.