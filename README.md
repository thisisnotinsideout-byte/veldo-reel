# Veldo Reel

25-second vertical reel (1080x1920, 30fps) built with [Remotion](https://www.remotion.dev/).

## Install

```sh
npm install
```

## Develop

```sh
npm start
```

Opens the Remotion Studio for live preview.

## Render

```sh
npm run build
```

Writes the final MP4 to `out/reel.mp4`.

## Structure

- `src/Root.tsx` — registers the `Reel` composition at 1080x1920, 30fps, 750 frames.
- `src/Reel.tsx` — scene definitions (timing + copy) and layout.
- `src/Scene.tsx` — per-scene text animation: spring-staggered word entry, soft exit.
- `src/Background.tsx` — dark base with a drifting radial accent.
