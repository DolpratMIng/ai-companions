# AI Companion — Planning

## Overview
Webcam mirror with spawnable AI anime characters. Characters appear in your physical space via AR overlay, hold conversations via LLM, and multiple can coexist.

---

## Phase 1 — Foundation (Current)

**Goal**: Camera mirror + transparent 3D overlay + character spawn/dismiss loop.

- [x] Scaffold Next.js project with TypeScript, Tailwind, App Router
- [x] Install dependencies (three, r3f, drei, zustand, @pixiv/three-vrm)
- [x] Create project directory structure
- [x] Define shared types (`lib/types.ts`)
- [x] Create Zustand store (`stores/useStore.ts`)
- [x] Camera mirror display (`components/CameraView.tsx`)
- [x] Transparent 3D overlay (`components/ARScene.tsx`)
- [x] Placeholder character figure (`components/Character.tsx`)
- [x] Spawn/dismiss panel (`components/SpawnPanel.tsx`)
- [x] Wire up main page + layout
- [x] Verify: `npm run build` compiles clean, all routes registered

---

## Phase 2 — VRM Character

**Goal**: Real VRM model rendering with idle animations.

- [ ] Download free VRM sample models → `public/models/`
- [ ] Integrate `@pixiv/three-vrm` loader
- [ ] VRM idle animation (breathing, blinking)
- [ ] Emotion expression triggers
- [ ] Character placement logic (beside user in frame)

---

## Phase 3 — AI Chat

**Goal**: Text-based conversation with character via LLM.

- [ ] `POST /api/chat` route — proxies to OpenAI/Anthropic
- [ ] `lib/ai.ts` — LLM client wrapper with character persona system prompt
- [ ] Chat input UI
- [ ] Speech bubble rendering (attached to character)
- [ ] Streaming response (character "thinks" while generating)
- [ ] Per-character chat history in Zustand

---

## Phase 4 — Voice

**Goal**: Character speaks with TTS + lip-sync.

- [ ] `POST /api/tts` route — proxies to ElevenLabs / OpenAI TTS
- [ ] Audio playback in browser
- [ ] Simple amplitude-driven lip-sync
- [ ] Mute/unmute per character

---

## Phase 5 — Multi-Character

**Goal**: Spawn multiple distinct characters simultaneously.

- [ ] Character catalog (preset picker)
- [ ] Independent AI contexts per character
- [ ] Position management (grid / drag to arrange)
- [ ] Select which character to address
- [ ] Dismiss individual or all

---

## Phase 6 — Polish & Advanced

**Goal**: Production-ready experience.

- [ ] Speech-to-text (user speaks, character hears)
- [ ] Face/body tracking (character follows your head movement)
- [ ] Depth estimation (characters sit on furniture, not float)
- [ ] Character-to-character conversation
- [ ] Persistence (saved character configs)
- [ ] Performance optimization
- [ ] Custom character import

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| 3D | Three.js + React Three Fiber + Drei |
| Characters | @pixiv/three-vrm (VRM format) |
| State | Zustand |
| LLM | OpenAI / Anthropic |
| TTS | ElevenLabs / OpenAI TTS |
| Camera | getUserMedia |
| Styling | Tailwind CSS v4 |
