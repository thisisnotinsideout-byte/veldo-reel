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

## Audio

The reel layers three synthesized audio cues generated in-repo via a small Node script (no external SFX downloads required):

- `public/audio/drone.wav` — 25s ambient pad under the whole reel.
- `public/audio/whoosh.wav` — bass-thump + noise sweep on each scene entrance.
- `public/audio/tick.wav` — short click fired as each word reveals.

Regenerate anytime with:

```sh
node scripts/generate-audio.mjs
```

## Structure

- `src/Root.tsx` — registers the `Reel` composition at 1080x1920, 30fps, 750 frames.
- `src/Reel.tsx` — scene definitions (timing + chunked copy) and audio wiring.
- `src/Scene.tsx` — chunked text with spring entry, scale-up, blur-to-sharp and key-word emphasis.
- `src/Background.tsx` — dark base with a glow that shifts + pulses between scenes.
- `src/Particles.tsx` — slow-drifting dust particles.
- `src/FlashSweep.tsx` — bright flash + diagonal light sweep at every scene boundary.
