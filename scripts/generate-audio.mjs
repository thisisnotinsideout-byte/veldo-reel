import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "audio");
mkdirSync(outDir, { recursive: true });

const SAMPLE_RATE = 44100;

function writeWav(path, samples) {
  const numSamples = samples.length;
  const bytesPerSample = 2;
  const dataSize = numSamples * bytesPerSample;
  const buf = Buffer.alloc(44 + dataSize);

  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write("WAVE", 8);

  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); // chunk size
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(SAMPLE_RATE, 24);
  buf.writeUInt32LE(SAMPLE_RATE * bytesPerSample, 28);
  buf.writeUInt16LE(bytesPerSample, 32);
  buf.writeUInt16LE(16, 34);

  buf.write("data", 36);
  buf.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(clamped * 32767), offset);
    offset += 2;
  }
  writeFileSync(path, buf);
  let peak = 0;
  for (let i = 0; i < numSamples; i++) {
    const v = Math.abs(samples[i]);
    if (v > peak) peak = v;
  }
  return { path, duration: numSamples / SAMPLE_RATE, peak: peak.toFixed(3) };
}

// -----------------------------------------------------------------------------
// Drone: 25s low pad, sum of detuned sine harmonics w/ slow LFO
// -----------------------------------------------------------------------------
function makeDrone(seconds = 25) {
  const n = seconds * SAMPLE_RATE;
  const out = new Float32Array(n);
  const fundamentals = [55, 55 * 1.005, 82.4, 110, 164.8];
  const weights = [0.55, 0.4, 0.25, 0.18, 0.1];
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    let sample = 0;
    for (let k = 0; k < fundamentals.length; k++) {
      const f = fundamentals[k];
      const lfo = 0.85 + 0.15 * Math.sin(2 * Math.PI * (0.07 + k * 0.013) * t);
      sample += Math.sin(2 * Math.PI * f * t) * weights[k] * lfo;
    }
    // gentle noise layer
    sample += (Math.random() * 2 - 1) * 0.015;
    // master envelope: 1s fade in, 2s fade out
    let env = 1;
    if (t < 1) env = t;
    if (t > seconds - 2) env = Math.max(0, (seconds - t) / 2);
    out[i] = sample * 0.22 * env;
  }
  return writeWav(join(outDir, "drone.wav"), out);
}

// -----------------------------------------------------------------------------
// Whoosh: 0.45s noise burst with band-pass sweep + exponential decay
// -----------------------------------------------------------------------------
function makeWhoosh() {
  const seconds = 0.45;
  const n = Math.floor(seconds * SAMPLE_RATE);
  const out = new Float32Array(n);
  let lp = 0;
  let hp = 0;
  let prev = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const p = t / seconds;
    const noise = Math.random() * 2 - 1;
    // simple one-pole low-pass that opens then closes
    const lpAlpha = 0.015 + 0.35 * Math.sin(Math.PI * p);
    lp += lpAlpha * (noise - lp);
    // high-pass (noise - lp)
    hp = lp - 0.35 * prev;
    prev = hp;
    // bass thump: sub sine kick that drops in pitch
    const kickFreq = 140 * Math.exp(-4 * p);
    const kick = Math.sin(2 * Math.PI * kickFreq * t) * Math.exp(-6 * p) * 0.9;
    const env = Math.pow(1 - p, 1.6);
    out[i] = (lp * 0.9 + kick) * env * 0.85;
  }
  return writeWav(join(outDir, "whoosh.wav"), out);
}

// -----------------------------------------------------------------------------
// Tick: ~25ms click, sine + quick decay
// -----------------------------------------------------------------------------
function makeTick() {
  const seconds = 0.035;
  const n = Math.floor(seconds * SAMPLE_RATE);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const p = t / seconds;
    const env = Math.exp(-60 * p);
    const tone =
      Math.sin(2 * Math.PI * 2200 * t) * 0.6 +
      Math.sin(2 * Math.PI * 3600 * t) * 0.25 +
      (Math.random() * 2 - 1) * 0.12;
    out[i] = tone * env * 0.35;
  }
  return writeWav(join(outDir, "tick.wav"), out);
}

console.log(makeDrone());
console.log(makeWhoosh());
console.log(makeTick());
