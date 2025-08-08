# Galton Board: Visualizing Normal Distribution and LLM Temperature

An interactive Galton board (also known as a bean machine or quincunx) that demonstrates the emergence of normal distribution and provides intuitive understanding of concepts like temperature in Large Language Models.

## Live Demo

Experience the app on GitHub Pages: [https://norfeldt.github.io/galton-board/](https://norfeldt.github.io/galton-board/)

## What is a Galton Board?

A Galton board is a device invented by Sir Francis Galton that demonstrates the central limit theorem. It consists of a vertical board with pegs arranged in rows, where balls drop through and bounce randomly left or right at each peg, eventually collecting in bins at the bottom.

## Educational Purpose

### Understanding Normal Distribution

This interactive simulation helps build mental models around:

- **Central Limit Theorem**: How random processes naturally tend toward normal distribution
- **Bell Curve Formation**: Visual demonstration of how individual random events aggregate into predictable patterns
- **Statistical Variance**: How the spread of outcomes relates to the underlying randomness

### LLM Mental Model Visualization

The Galton board serves as an effective mental model for understanding Large Language Model behavior:

#### Temperature Parameter
- **Low Temperature (0.1-0.3)**: Like a narrow Galton board where balls have less room to spread - outputs are more deterministic and focused
- **Medium Temperature (0.7-1.0)**: Standard board width where balls distribute normally - balanced creativity and coherence
- **High Temperature (1.5+)**: Wide board where balls spread dramatically - highly creative but potentially incoherent outputs

#### Token Selection Process
Each peg represents a decision point where the model chooses the next token based on probability distributions, similar to how balls bounce left or right at each peg.

## Features

- Temperature control that increases peg "wiggle" for more randomness
- Drop position slider with color-coded indicator
- Toggle randomness on/off
- Toggle ball collisions on/off
- Histogram/bar chart showing bin counts with animated highlights
- Batch drop actions: 1, 10, 100, 500
- Responsive layout with mobile-friendly controls

## Getting Started

### Prerequisites

- Node.js (v18 or higher) or Bun
- Package manager: Bun (recommended) or npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd galton-board
```

Using Bun (recommended):

```bash
bun install
bun run dev
```

Using npm:

```bash
npm install
npm run dev
```

Using yarn:

```bash
yarn
yarn dev
```

Using pnpm:

```bash
pnpm install
pnpm dev
```

### Usage

1. Open your browser to `http://localhost:5173`
2. Adjust temperature; optionally toggle randomness and ball collisions
3. Choose a drop position with the slider and drop balls
4. Use batch buttons (10/100/500) to quickly build the distribution

## Technology Stack

 - **React** - UI library
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library

## Educational Applications

### For Statistics Students
- Visualize the central limit theorem in action
- Understand how individual random events create predictable patterns
- Explore concepts of variance, standard deviation, and confidence intervals

### For AI/ML Students
- Gain intuitive understanding of temperature in language models
- Visualize how randomness affects output quality
- Understand the trade-off between creativity and coherence

### For General Audiences
- Develop statistical intuition through interactive play
- See how order emerges from chaos
- Understand the mathematics behind everyday randomness

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for:
- Additional visualization features
- Educational content improvements
- Performance optimizations
- Accessibility enhancements

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Sir Francis Galton for the original Galton board concept
- The broader statistics and machine learning communities for inspiration
- Open source contributors who made this project possible
