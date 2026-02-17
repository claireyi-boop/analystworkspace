# Analyst Workspace

React + TypeScript + Vite frontend for an Analyst workspace: dashboard with clickable widgets, workspace pages to edit widgets and drill down to raw customer-interaction data (survey responses, call transcripts, social media posts, Google reviews).

## Setup

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run preview` – preview production build

## Deployment

Static build (`dist/`) is deployed automatically:

- **GitLab Pages** – push to the default branch; CI builds and publishes to `https://<namespace>.gitlab.io/<project-path>/`.
- **GitHub Pages** – push to `main`; the Actions workflow builds and deploys to `https://<user>.github.io/<repo>/`. Enable **Settings → Pages → Source: GitHub Actions** once.

## Routes

- `/` – Home
- `/dashboard` – Dashboard with widgets (rating, sentiment, issues, strengths, feedback)
- `/workspace/:widgetId` – Workspace for a widget (edit + raw data / workbench)

Click **Explore** on a widget or a row in “Top 5 Issues” to open its workspace and view or filter raw customer interactions.
