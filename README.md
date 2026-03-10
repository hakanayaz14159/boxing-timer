# Boxing Timer

A boxing timer SPA for interval training. Configure exercise time, rest time, and rounds. Features a 3-2-1-Start countdown, sound notifications, and localStorage persistence.

## Features

- Configure exercise duration (1–60 min)
- Configure rest duration (0–10 min)
- Configure number of rounds (1–99)
- Start / Pause / Reset during workout
- 3-2-1-Start countdown before exercise
- Sound notification when each round ends
- Settings persisted in localStorage
- Responsive (desktop and mobile)

## Setup

```sh
bun install
bun run dev
```

## Build

```sh
bun run build
```

## Deploy to GitHub Pages

1. Push to a GitHub repository
2. Enable GitHub Pages: **Settings → Pages → Source: GitHub Actions**
3. The site will be available at `https://<username>.github.io/<repo-name>/`

## Customization

- **GitHub link**: Edit `src/lib/constants.ts` and set `GITHUB_REPO_URL` to your repo (e.g. `https://github.com/username/box-timer`).

## License

MIT
