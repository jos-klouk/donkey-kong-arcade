# Donkey Kong Arcade — Implementation Plan

Last Updated: 2025-09-03

Repository: https://github.com/jos-klouk/donkey-kong-arcade

## Status Legend

- [ ] Not started
- [/] In progress
- [x] Ready (Done)
- [b] Blocked (explain in notes)

---

## 0) Objectives and Definition of Done

- [ ] Ship a faithful, performant browser Donkey-Kong–style arcade game with 4 looping stages.
- [ ] Deterministic fixed-step logic (60 Hz), seeded RNG, replay system, golden tests.
- [ ] Steady 60 FPS on mid hardware; robust across Chrome/Firefox/Safari/Edge.
- [ ] Complete keyboard controls, settings, basic accessibility, and persistence.
- [ ] CI green (lint/type/tests), deployed to GH Pages/Vercel, optional PWA.

Notes:
- Target frame budget: update ≤ 2.5 ms, render ≤ 3.5 ms typical scene.

---

## Phase 0: Repository & Bootstrap

Deliverables
- [x] Initialize git repository and set default branch to `main`.
- [x] Create Vite + React + TypeScript scaffold and base structure (per PRD).
- [x] Add `.gitignore`, `README.md`, `tsconfig.json`, `vite.config.ts`.
- [x] Create GitHub repository and push `main`.
- [ ] Configure CI (lint, typecheck, unit tests) via GitHub Actions.
- [ ] Add automatic deploy (Vercel or GH Pages) on `main`.

Acceptance Criteria
- [x] Repo accessible publicly; contributors can clone and run `npm run dev`.
- [ ] CI runs on PRs and `main`; build/test/lint all green.

---

## Phase 1: Core Bootstrap

Deliverables
- [x] Fixed-step loop in `src/core/loop.ts` with update/render separation and rAF driver.
- [x] Multi-canvas stack (BG/Entities/HUD) with integer scaling and center letterboxing.
- [x] Keyboard input system in `src/input/keyboard.ts` (preventDefault, edge events).
- [x] Pause on blur via Page Visibility API; resume prompt overlay.

Acceptance Criteria
- [x] Resize recomputes integer scale, disabled smoothing, canvas centered.
- [x] Input edge events correct; scrolling never occurs on game keys.
- [x] Loop ticks at 60 Hz fixed; render interpolates; no time creep.

Tests
- [ ] Vitest: loop advances consistent ticks for simulated time.
- [ ] Vitest: input edge state transitions (pressed/justPressed/justReleased).
- [ ] Playwright: open, resize, blur → paused; focus → resume prompt.

---

## Phase 2: Physics & Collision

Deliverables
- [x] AABB collision primitives in `src/physics/aabb.ts`.
- [x] Spatial hash grid in `src/physics/grid.ts` (cell size 16–32 px).
- [x] Collision resolution in `src/physics/collide.ts` for platforms/ladders/ladder gates.
- [x] Hero FSM (`idle`, `run`, `jump`, `fall`, `climb`, `hammer`, `hit/dead`) in `src/ecs/entities/Hero.ts` (skeleton).
- [ ] Sloped girder emulation: post-vertical nudge based on platform slope factor.

Acceptance Criteria
- [ ] No vertical tunneling; clean landings; stable ladder attach/detach.
- [ ] Slope nudge matches visual slope without breaking collision.

Tests
- [ ] Unit: ladder attach edge cases and detach conditions.
- [ ] Unit: slope nudge bounds; consistent per-tick resolution.

---

## Phase 3: Stage 1 (25m) MVP

Deliverables
- [ ] Level pipeline: Tiled JSON → compiler in `src/level/loader.ts` → compact arrays.
- [ ] Stage data in `src/level/stages/stage25m.json` (compiled form).
- [ ] Entities: `Gorilla`, `Barrel`, `Platform`, `Ladder`, `LadderGate`.
- [ ] Barrel logic: roll, flip at walls, drop at edges; ladder decisions with cooldown.
- [ ] Deaths, respawn, lives management; stage restart.

Acceptance Criteria
- [ ] Player can clear 25m by reaching top; barrels feel authentic.
- [ ] Ladder descent decisions are biased & cooldown-respected; no jittering.

Tests
- [ ] Statistical sanity: ladder descent probability within expected band.
- [ ] E2E: start → jump/climb/die → lives decrement; reset to menu works.

---

## Phase 4: HUD, Scoring, Looping, Hammer

Deliverables
- [ ] HUD digits via bitmap font; score, top score, lives, level, bonus bar.
- [ ] Scoring rules (jump over barrel, hammer hits, items) and +1 life at 7,000.
- [ ] Stage clear bonus; stage looping with difficulty ramp per loop.
- [ ] Hammer state: auto-swing cadence, hitbox active on alternating frames, particles.
- [ ] Audio subsystem: Howler groups (music/SFX), audio unlock on first gesture.

Acceptance Criteria
- [ ] Bonus ticks via fixed cadence; loop increases difficulty parameters.
- [ ] Music/SFX volumes and mute work; cues feel tight.

Tests
- [ ] Unit: timer tick rates and scoring math.
- [ ] Unit: hammer active frame window, hit detection.
- [ ] E2E: clear stage, loop progression; audio toggles responsive.

---

## Phase 5: Stages 2–4

Deliverables
- [ ] 50m: conveyors with belt velocity; direction flips by timer.
- [ ] 75m: elevators parametric motion; springs spawn cadence; short active hit window.
- [ ] 100m: rivets removable; gorilla drop cutscene when all removed.

Acceptance Criteria
- [ ] Each stage behaves authentically; timings match tuned constants.
- [ ] Stable transitions between stages; deaths and loops handled.

Tests
- [ ] Unit: conveyor direction flips; belt speed applied only when grounded.
- [ ] Unit: elevator position function; spring active window correctness.
- [ ] E2E: smoke run across 4 stages sequentially.

---

## Phase 6: RNG, Replays, Settings, Persistence, Debug

Deliverables
- [ ] Seeded PRNG in `src/core/rng.ts` (mulberry32/xoroshiro).
- [ ] Replay record/playback in `src/persistence/replay.ts` (seed + frame-indexed inputs).
- [ ] Settings UI: volume sliders, key remap, CRT toggle, authentic quirks, coyote time, jump buffer.
- [ ] Persistence via localForage: settings, highscores, replays, last seed; versioned keys.
- [ ] Debug overlays: F1 colliders/cells, F2 perf HUD, F3 sprite bounds/state labels.

Acceptance Criteria
- [ ] Same seed + inputs → identical score/positions at checkpoints.
- [ ] Settings persist across reload; CRT overlay toggles and renders correctly.

Tests
- [ ] Golden replay tests in CI (fail on nondeterminism).
- [ ] Unit: key remap conflict detection; storage migrations.

---

## Phase 7: Performance, PWA, Deploy, CI Hardening

Deliverables
- [ ] Object pools for barrels, fireballs, particles; minimal GC churn.
- [ ] Render optimizations: integer positions; minimal save/restore; layer batching.
- [ ] PWA manifest + Workbox precache (atlas/audio/stages/core JS); versioned cache.
- [ ] CI workflows (lint/test/build); deploy to GH Pages/Vercel on `main`.

Acceptance Criteria
- [ ] Update ≤ 2.5 ms, render ≤ 3.5 ms typical scene on mid hardware.
- [ ] Offline play for cached resources (if PWA enabled).

Tests
- [ ] Performance sampling harness thresholds enforced in CI.
- [ ] E2E regression suite green; PWA installable check passes.

---

## Detailed System Tasks

Engine Core
- [ ] `loop.ts`: fixed step, catch-up while(acc ≥ STEP), render(alpha).
- [ ] `time.ts`: tick counters and schedule helpers.
- [ ] `math.ts`: vec2, clamp, lerp.

Input
- [ ] `keyboard.ts`: code-based capture, preventDefault, edge events, endFrame.
- [ ] `gamepad.ts` (optional): map to same action layer.

Physics & Grid
- [ ] `aabb.ts`: overlaps; optional swept tests.
- [ ] `grid.ts`: insert/query; cell categorization.
- [ ] `collide.ts`: resolve hero/platform/ladder/hazard; ladder gate attach.

ECS-lite
- [ ] `ecs/types.ts`, `ecs/entity.ts` foundations.
- [ ] Entities: `Hero`, `Gorilla`, `Barrel`, `Fireball`, `Item`, `Platform`, `Ladder`, `Rivet`.
- [ ] Systems: movement, AI, hammer, particles.

Rendering
- [ ] `render/canvases.ts`: init multi-canvas stack.
- [ ] `render/atlas.ts`: load atlas & frame lookups.
- [ ] `render/draw.ts`: sprite draw routines; integer positions.
- [ ] `render/bitmapFont.ts`: HUD text drawing.
- [ ] `render/effects.ts`: optional CRT overlay.

Audio
- [ ] `audio/audio.ts`: Howler setup, unlock on gesture, group volumes.
- [ ] `audio/sfx.ts`: triggers (jump, hammer, etc.).

Levels
- [ ] `level/loader.ts`: load/compile Tiled JSON → compact structures.
- [ ] `level/spawners.ts`: per-stage entity spawns.
- [ ] `level/stages/*.json`: 25m/50m/75m/100m compiled data.

RNG & Replays
- [ ] `core/rng.ts`: seeded PRNG; centralize stochastic decisions.
- [ ] `persistence/replay.ts`: record/playback with seed + input stream.

UI/UX (React)
- [ ] `app/routes/Menu.tsx`: title, start, controls card.
- [ ] `app/ui/HUD.tsx`: score, lives, level, bonus bar.
- [ ] `app/routes/Settings.tsx`: audio/visual/accessibility.
- [ ] `app/routes/GameOver.tsx`: initials entry; highscores.

Persistence
- [ ] `persistence/storage.ts`: localForage wrappers; migrations; keys v1.

Debug
- [ ] Overlays F1/F2/F3; perf HUD; RNG counter.

Testing
- [ ] Vitest units for physics, timing, RNG, ladder logic, scoring.
- [ ] Playwright smoke: launch, start, pause on blur, fullscreen toggle, settings persistence.

---

## Acceptance Tests by Milestone (Checklist)

Movement & Jump
- [ ] Cannot climb without gate; coyote/jump buffer adhere to settings.

Barrel AI
- [ ] Ladder descent prob. within [base ± tolerance] across N trials; cooldown respected.

Conveyors
- [ ] Belt speed applied only when grounded; direction flips per timer.

Elevators & Springs
- [ ] Parametric positions match functions; spring active window hits only in window.

Rivets
- [ ] All rivets removed → gorilla drop sequence triggers; stage end transitions.

Determinism
- [ ] Seed + inputs produce identical score and entity positions at checkpoints.

---

## CI, Quality Gates, and Deploy

- [ ] ESLint + TS strict; pre-push checks.
- [ ] Unit + E2E suites; golden replays; perf sampling.
- [ ] Protected `main`; PRs via feature branches; squash & merge; conventional commits.
- [ ] GH Actions: build/test/lint; deploy to GH Pages/Vercel.

---

## Risks & Mitigations

- [ ] Autoplay restrictions → unlock audio on first gesture; delay music start.
- [ ] Performance dips → pools + grid + integer draws; cap particles; tune draw order.
- [ ] Nondeterminism → single PRNG source; avoid `Math.random()`; fixed-step only.
- [ ] Browser variance → multi-browser testing; key codes; fullscreen behavior checks.

---

## Milestones & Target Timeline (Indicative)

- [ ] Week 1: Engine/input/canvases/scaling/pause-on-blur; HUD shell.
- [ ] Week 2: Physics/grid/Hero FSM; ladders/gates; unit tests.
- [ ] Week 3: 25m stage; barrels; deaths/lives; first E2E.
- [ ] Week 4: Scoring/bonus/loop; Hammer; audio wiring; particles.
- [ ] Week 5: 50m/75m/100m mechanics; gorilla drop; stage transitions.
- [ ] Week 6: RNG/replays; settings/persistence; debug overlays.
- [ ] Week 7: Performance; CI; PWA; deploy; QA pass.
- [ ] Week 8: Buffer for tuning/assets/accessibility.

---

## Issue Backlog (Initial)

- [ ] Engine: finalize fixed-step helpers; PRNG.
- [ ] Physics: AABB, grid, resolve; slope nudge.
- [ ] Entities: Hero, Barrel AI, Fireball, Item.
- [ ] Levels: compiler and 25m–100m JSON + loader/spawners.
- [ ] UI: HUD, menus, settings; key remap.
- [ ] Audio: groups, unlock, sprite; event wiring.
- [ ] Persistence: settings/highscores/replays; migrations.
- [ ] Debug: overlays; perf HUD; RNG counter.
- [ ] Tests: unit + E2E; golden replays; perf sampling.
- [ ] Perf: pools, batching, GC hygiene.
- [ ] PWA/Deploy: manifest, Workbox, hosting.

---

## Status Updates Log

- 2025-09-03: Document created. Repo scaffolded and pushed to GitHub. Initial app shell and placeholders in place.


