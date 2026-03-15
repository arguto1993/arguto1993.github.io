# Arguto Portfolio Website

My personal portfolio website built with React and TypeScript.

Originally generated from [Google AI Studio](https://ai.google.dev/aistudio) and heavily customized here.

<!-- Original AI Studio App: https://ai.studio/apps/c5762e73-fbaa-468d-8f18-8959c5d59280 (private link) -->

## 🚀 Quick Start

**Prerequisites:** Node.js

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

   _(This step is handled automatically when you run the deploy command below. No need to run it manually unless you want to preview the build output.)_

4. Deploy to GitHub Pages:

   ```bash
   npm run deploy
   ```

## 🛠️ Tech Stack

- **Frontend:** React (with TypeScript), Vite
- **Styling:** CSS, CSS Modules
- **Linting:** ESLint (TypeScript/React), Prettier
- **Deployment:** GitHub Pages

## ✨ Features

- Responsive portfolio website
- Dark/light theme support
- Sections for Home, About, Projects, Skills, Experience, Education, and Contact
- Each sections can be shown or hidden via `sections.json`
- Update contents via `data.json`

## 📁 Project Structure

```bash
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── images/
│       ├── favicon/
│       │   ├── favicon-16x16-black.png
│       │   └── favicon-16x16.png
│       ├── logo/
│       │   ├── black.png
│       │   └── white.png
│       ├── portrait/
│       │   ├── arguto_portrait_600.webp
│       │   └── arguto_portrait_color_600.webp
│       ├── projects/
│       │   ├── depression_risk_assessment_cover.jpg
│       │   ├── jkt48_oshibe_sentiment_analysis.jpg
│       │   ├── recommendation_priority_matrix.jpg
│       │   ├── video_game_sales_analytics.jpg
│       │   └── .gitignore
│       └── skills/  # (currently empty)
├── src/
   ├── App.tsx
   ├── constants.ts
   ├── data.json
   ├── index.css
   ├── main.tsx
   ├── sections.json
   ├── types.ts
   └── components/
      ├── About.tsx
      ├── Contact.tsx
      ├── Dashboards.tsx
      ├── Education.tsx
      ├── Experience.tsx
      ├── Footer.tsx
      ├── Hero.tsx
      ├── Navbar.tsx
      ├── Projects.tsx
      ├── Skills.tsx
      └── ThemeContext.tsx
```
