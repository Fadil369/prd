# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains two PRD (Product Requirements Document) related applications:

1. **PRD to Prototype Tool** (`remixed-34806888.html`) - A standalone HTML application that converts Product Requirements Documents into working prototypes using Claude AI
2. **PRD Creator Component** (`remixed-3d81ba29.tsx`) - A React component for creating structured one-page PRDs through guided questions

## Architecture

### PRD to Prototype Tool (HTML)
- **Technology**: Vanilla HTML, CSS, JavaScript with internationalization support
- **Languages**: English (en-US), Spanish (es-ES), Arabic (ar-SA) with RTL support
- **File Processing**: Supports PDF, Markdown (.md), and TXT file uploads
- **AI Integration**: Uses Claude Sonnet 4 model for prototype generation
- **Features**: 
  - Drag-and-drop file upload
  - Real-time prototype generation with progress tracking
  - Iframe-based prototype rendering
  - Download functionality for generated HTML prototypes

### PRD Creator Component (React/TSX)
- **Technology**: React with hooks, TypeScript JSX
- **UI Framework**: Tailwind CSS with glassmorphism design
- **Languages**: English (en-US), Arabic (ar-SA) with RTL support
- **Features**:
  - Three-question guided PRD creation
  - Sample examples for different product types (Team Dashboard, Shopping App, Fitness Tracker)
  - AI-powered PRD generation using Claude Sonnet 4
  - Multiple export formats (Markdown, PDF, Print)
  - Streaming text effect during generation

## Key Development Patterns

### Internationalization (i18n)
Both applications implement comprehensive internationalization:
- Translation objects with locale-specific content
- RTL (Right-to-Left) support for Arabic language
- Dynamic direction attributes and styling
- Locale-aware date formatting and number handling

### AI Integration
- Uses Claude Sonnet 4 model (`claude-sonnet-4-20250514`)
- Optimized prompts for consistent HTML/PRD generation
- Retry logic with exponential backoff for API calls
- Error handling and user feedback for API failures

### File Processing
- Base64 encoding for PDF files
- Text file reading for Markdown and TXT files
- Comprehensive file type validation
- Progress tracking during file processing

## Common Tasks

### Running the Applications
- **HTML Tool**: Open `remixed-34806888.html` directly in a web browser
- **React Component**: Requires integration into a React application with Tailwind CSS

### Modifying Translations
- Update `TRANSLATIONS` object in either file
- Ensure all new keys are added to all language variants
- Test RTL layout for Arabic translations

### Updating AI Prompts
- Modify prompt templates in `buildOptimizedPrompt()` and `buildOptimizedPDFPrompt()` functions
- Maintain structured format requirements for consistent output
- Test prompt changes across different file types

### Adding New Languages
1. Add new locale entry to `TRANSLATIONS` object
2. Update locale detection logic
3. Add RTL support if needed
4. Update language toggle functionality

## Code Style Guidelines

### HTML Application
- Inline styles with modern CSS features
- ES6+ JavaScript with async/await patterns
- Modular function organization
- Comprehensive error handling

### React Component
- Functional components with hooks
- TypeScript for type safety
- Tailwind CSS for styling
- Component-level state management

## Security Considerations

- File type validation for uploads
- Sanitization of user inputs before API calls
- Base64 encoding for binary file handling
- No direct file system access in browser environment

## Performance Optimization

- Lazy loading of AI responses with streaming effects
- Efficient markdown rendering with custom parser
- Image and animation optimization for smooth UX
- Memory management for file processing