# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server on port 8080 (configured in vite.config.ts)
- `npm run build` - Build for production (outputs to dist/)
- `npm run preview` - Preview production build locally
- ⚠️ Don't run the dev script - ask me to start the dev server. Besides, I'm also using bun and not npm

### Code Quality
- `npm run lint` - Run ESLint (TypeScript not in strict mode, unused vars warnings disabled)

### Deployment
- Push to main branch triggers automatic GitHub Pages deployment via GitHub Actions
- Uses Bun in CI/CD pipeline, but npm works locally

## Architecture

### Core Physics System
The Galton board simulation uses Matter.js physics engine with custom hooks:
- `useGaltonPhysics` (src/hooks/useGaltonPhysics.tsx) - Main physics controller that manages:
  - Matter.js engine setup and rendering
  - Peg wiggling animation based on temperature (higher temp = more peg rows wiggle)
  - Ball drop position slider interaction
  - Collision detection for bin counting
  - Dynamic ball colors based on drop position

### State Management
- React hooks for local state (no global state management)
- Custom hooks pattern for physics, responsive canvas, and mobile detection
- Temperature parameter controls peg wiggling intensity (0.0-1.0 range, affects bottom rows first)

### Component Structure
- `GaltonBoard` - Main container component
- `GaltonControls` - Temperature slider and control interface
- `GaltonActions` - Ball drop actions (single, burst, continuous)
- Extensive shadcn/ui component library (50+ components) with Neubrutalism design theme

### Styling System
- Tailwind CSS with custom Neubrutalism color palette (brutal-* colors)
- CSS variables for theming
- JetBrains Mono as default font
- Component-specific styles use cn() utility for class merging

### Key Technical Details
- Vite path aliasing: `@/` resolves to `./src/`
- TypeScript configured without strict mode
- No test framework implemented
- Matter.js bodies created in `src/utils/matterBodies.ts`
- Responsive canvas sizing handled by `useResponsiveCanvas` hook
- Ball colors determined by horizontal drop position using color interpolation

## Important Notes
- Project uses both npm and Bun (bun.lockb present)
- GitHub Pages deployment requires base path configuration in vite.config.ts
- Development port is 8080 (not default 5173)
- Educational focus on visualizing LLM temperature concept through physics simulation
- No testing infrastructure - consider adding tests for critical physics calculations
- **Performance Rule**: Use only CSS animations and transitions, NO JavaScript animations (to avoid breaking Matter.js physics performance)

## Maintenance

### Keeping CLAUDE.md Updated
This file should be kept in sync with project changes. Update this document when:
- Adding new commands or scripts to package.json
- Changing build configuration or development setup
- Modifying the architecture or adding major features
- Introducing new dependencies or tools
- Changing coding conventions or patterns
- Adding or modifying deployment processes

Regular updates ensure Claude Code has accurate context for future development sessions.

## Git Commit Conventions

Use conventional commits with emoji prefixes. Format: `<emoji> <type>: <description>`

### Commit Types with Emojis
- `✨ feat:` New feature
- `🐛 fix:` Bug fix
- `📝 docs:` Documentation changes
- `🎨 style:` Code style/formatting (no functional changes)
- `♻️ refactor:` Code refactoring
- `⚡ perf:` Performance improvements
- `✅ test:` Adding or updating tests
- `🔧 chore:` Build process, dependencies, or tooling changes
- `🚀 deploy:` Deployment related changes
- `🔥 remove:` Removing code or files
- `💄 ui:` UI/UX improvements
- `🎯 focus:` Improving code focus/readability
- `🔒 security:` Security improvements
- `⬆️ upgrade:` Dependency upgrades
- `⬇️ downgrade:` Dependency downgrades
- `📦 build:` Build system or external dependencies
- `👷 ci:` CI/CD pipeline changes
- `🔀 merge:` Merge branches
- `⏪ revert:` Revert previous commit

### Examples
- `✨ feat: Add particle trail effects to falling balls`
- `🐛 fix: Correct bin counting logic for edge cases`
- `📝 docs: Update README with LLM temperature explanation`
- `♻️ refactor: Extract peg wiggling logic to separate function`
- `💄 ui: Enhance temperature slider with gradient background`
- `⚡ perf: Optimize Matter.js collision detection for 1000+ balls`