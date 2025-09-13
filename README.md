# Perspective-X

A modern web application that leverages generative AI to analyze and compare global news, offering users a multi-faceted perspective on how different countries report on the same events.

[Live Demo](https://your-live-demo-link.com) &lt;-- *Replace with your actual deployment link*

---

![Perspective-X Dashboard](https://i.imgur.com/your-screenshot.png) &lt;-- *Replace with a screenshot of your app*

## Key Features

- **Multi-Perspective Analysis**: Ask about any global event and receive a summary of viewpoints from five different countries (USA, China, India, Russia, Germany).
- **Conversational AI**: Powered by the Google Gemini API for natural and intelligent responses.
- **Interactive Chat Interface**: A clean and intuitive chat UI for seamless interaction.
- **Secure Authentication**: Easy and secure sign-in using Google or a one-time email link, powered by Firebase.
- **Chat History**: Automatically saves your conversations to local storage to revisit them anytime.
- **Modern & Animated UI**: Built with React, Tailwind CSS, and brought to life with Framer Motion and GSAP for a smooth user experience.

## Tech Stack

- **Frontend**: [React](https://reactjs.org/) (with Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI**: [Google Gemini API](https://ai.google.dev/)
- **Backend & Authentication**: [Firebase](https://firebase.google.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or newer)
- `npm` or `yarn`

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/perspective-x.git
    cd perspective-x
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up Environment Variables:**

    Create a `.env` file in the root of your project and add the following configuration keys. Replace the placeholder values with your actual API keys from Google and Firebase.

    ```env
    VITE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

    VITE_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
    VITE_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
    VITE_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
    VITE_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
    VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_SENDER_ID"
    VITE_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
    ```

4.  **Run the Development Server:**
    ```sh
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.


