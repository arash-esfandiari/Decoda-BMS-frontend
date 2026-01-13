# Decoda Beauty Med Spa - Patient Dashboard

A modern, responsive patient management and analytics dashboard for Decoda Beauty Med Spa. This application helps staff manage appointments, patient records, and view business analytics through a unified, glassmorphism-styled interface.

## Features

-   **Dashboard Overview**: Real-time view of daily appointments, revenue forecasts, and pending actions.
-   **Patient Management**: comprehensive patient list with search, sorting, and pagination.
-   **Appointment Scheduling**: Calendar and list views for managing patient visits.
-   **Analytics**: Visual insights into business performance, busiest days, and service popularity.
-   **Glassy UI**: A premium "MacOS 26" inspired design with glassmorphism effects, responsive layouts, and smooth animations.
-   **Mobile Optimized**: Fully responsive design with a collapsible burger menu for mobile devices.
-   **Data Import**: Tools for importing patient and appointment data safely.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS, Vanilla CSS (for custom glass effects)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Charts**: Recharts
-   **State/Data Fetching**: React Server Components & Hooks

## Getting Started

### Prerequisites

-   Node.js (v18+ recommended)
-   npm, yarn, pnpm, or bun

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd decoda-beauty-med-spa/frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  Configure Environment Variables:
    Create a `.env` file in the root directory. You can reference `.env.example` if available.
    ```env
    # Example variables (adjust as needed)
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

-   `/app`: Next.js App Router pages and layouts.
-   `/components`: Reusable UI components (buttons, cards, navbar, widgets).
-   `/lib`: Utility functions and helpers.
-   `/hooks`: Custom React hooks for data fetching and state.
-   `/public`: Static assets.

## Recent Updates

-   **Mobile Navigation**: Improved mobile experience with a smooth, collapsible burger menu.
-   **Dashboard Refinements**: Streamlined the dashboard header by removing the legacy calendar button.
-   **Visual Polish**: Enhanced transparency and animations for a cleaner UI.
