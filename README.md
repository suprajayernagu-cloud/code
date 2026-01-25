# Job Board (Vite + React)

This is a small job board built with Vite + React. It loads job listings from a JSON file hosted on GitHub (raw URL) and shows a list on the home page. Clicking a job opens a details page using route params.

Quick setup

1. Install dependencies

```bash
npm install
```

2. Run the dev server

```bash
npm run dev
```

3. Open http://localhost:5173

Using GitHub for data

1. Create a new GitHub repository (or use an existing one).
2. Copy `data/jobs.json` into the repo (preserve the path `data/jobs.json`) and push.
3. Get the raw file URL. It will look like:

```
https://raw.githubusercontent.com/<your-username>/<your-repo>/main/data/jobs.json
```

4. Update `src/config.js` and replace the `JOBS_URL` placeholder with that raw URL.

Now the app will fetch jobs from the hosted GitHub JSON.

Notes and next steps

- You can add CRUD endpoints later (for example using GitHub Pages + a small server or a static CMS).
- Consider adding search, filters, pagination, or server-side hosting for dynamic updates.
