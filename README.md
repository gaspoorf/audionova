# Audionova Hearing Test

This is a Next.js application for a hearing test simulation.

## Features

- **Home Page**: Introduction and instructions.
- **Test Phases**: Three stages (Restaurant, Street, Music) with progressive volume.
- **Scoring**: Algorithm based on reaction time/volume level.
- **Results**: Final score calculation and breakdown.

## Tech Stack

- Next.js (App Router)
- TypeScript
- SCSS (CSS Modules)
- Mobile First Design

## Getting Started

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run the development server:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Audio Files

Ensure the following files are present in `public/sounds/`:
- `restaurant.mp3`
- `street.mp3`
- `music.mp3`
