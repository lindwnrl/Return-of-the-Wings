# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML5 + CSS3 + ES6 modules. No build step, no npm dependencies, no framework. Ships as-is to Netlify/Vercel (static hosting); must also open correctly from `file://` for local review. Chosen by the user; the PRD's optional GSAP/Lottie are not used (authored CSS/JS motion instead, to keep the page dependency-free).

## Users

General public with little or no biology background: students and young adults, families, local community members, and environmentally curious residents of Indonesia. They arrive curious, not studious, on a phone as often as a laptop, and stay minutes rather than hours. Their job: understand why the butterflies around them matter and leave knowing one or two things they can actually do.

## Product Purpose

A single-page environmental education campaign that introduces biodiversity through butterflies — their life cycle, their ecological roles, their habitat requirements, and the pressures on those habitats — and ends with practical, locally appropriate actions. Success means a first-time visitor can state why biodiversity matters and name at least one action, and that every educational claim is traceable to the cited literature.

## Positioning

Most biodiversity campaigns argue with statistics or scold with imagery of destruction. This one teaches through one familiar organism and its ordinary neighborhood: host plant, nectar plant, resting place, life cycle. The mechanism is proximity — biodiversity as something already present in the street, not a distant protected forest — carried by an editorial field-guide treatment rather than a corporate NGO template.

## Operating Context

- Single-page storytelling site; sections 01–07 per PRD §9: Hero, Understanding Biodiversity, Meet the Butterfly, A Butterfly's Home, Threats, Interactive Learning, Take Action.
- Visitors scroll linearly on mobile and jump via nav on desktop.
- Interactive elements are the learning payload: life-cycle stepper, habitat explorer, biodiversity quiz with scoring and feedback, action checklist persisted in LocalStorage.
- Copy ships in Bahasa Indonesia (user decision). Campaign name "The Return of the Wings" stays as the brand lockup; educational body copy is Indonesian.
- Imagery is real Indonesian/Southeast Asian butterfly photography from Wikimedia Commons with per-file attribution and license recorded on the page (user decision; PRD §16 flags usage rights).
- Research base: Academy of Natural Sciences educator's guide; Leksono et al. (2025), Biodiversitas 26(2), 551–563.

## Capabilities and Constraints

- Frontend only. No backend, no accounts, no uploads, no live maps, no leaderboards, no verified impact statistics (PRD §13).
- PRD v0.4 adds three gamified experiences, all required in the MVP: a four-element habitat
  simulation with a completion dialog (FR-08), a gated quiz that unlocks a cursor reward (FR-09),
  and a commitment checklist that triggers a celebratory bloom (FR-10).
- Rewards are cosmetic and optional. The custom cursor must never be required for use, must be
  switchable off, and must have a touch-device equivalent. All progress is per-browser
  LocalStorage; nothing is synced and nothing is verified.
- The quiz's full-score reward is the spider lily: a switch grows a red flower under the rewards
  list, and pressing that flower releases two red butterflies. The flower is a real button, fires
  once per activation, and is skipped entirely under `prefers-reduced-motion` with a sentence
  explaining why. Its red is the only hue outside the binding palette; it is confined to the
  flower and its two butterflies and recorded as an exception in DESIGN.md.
- The spider lily is decoration for a family-friendly campaign, not a planting recommendation: it
  is not a native Indonesian plant and red spider lilies carry farewell/mourning associations in
  Japan and China, so the page never presents it as advice or as a symbol of the campaign.
- The habitat simulation must not imply that all four elements are universally mandatory, and
  it is a teaching model, not a depiction of real restoration.
- Must be responsive (desktop/tablet/mobile), keyboard navigable, reduced-motion aware, and contrast-compliant.
- Plant and species recommendations must stay appropriate to Indonesia; the PRD warns habitat requirements vary by species.
- The observation that butterflies are less noticeable in some neighborhoods is a campaign hypothesis, not a scientific finding; it must not be presented as a measured decline.
- No fabricated statistics, testimonials, or impact numbers. Educational claims cite the listed references.

## Brand Commitments

- Name: The Return of the Wings. Core message: "A world where every wing matters."
- Palette (PRD §8.2, binding): Deep Forest `#183D2B`, Leaf Green `#477A50`, Natural Cream `#F3F0DF`, Soft Sage `#B8D99A`, Butterfly Amber `#E9A94D`. Cream dominant (~60%), Deep Forest ~20%, greens ~15%, Amber ≤5%.
- Typography (PRD §8.4): DM Serif Display for headings and campaign statements; DM Sans for body, navigation, buttons, labels. Self-hosted files, not a hosted stylesheet.
- Voice: warm, accessible, informative; never alarmist, never corporate. No jargon without a plain-language gloss.
- Three-stage journey: Discover → Understand → Appreciate and Protect.

## Evidence on Hand

- PRD v0.3 (this repo's brief).
- Two citations: ansp.org butterflies teacher's guide; DOI 10.13057/biodiv/d260204 (Leksono et al. 2025, East Java altitudinal gradient).
- No project-owned photography, no testimonials, no usage data, no partner organizations. Nothing of that kind may be invented.

## Product Principles

1. One organism, whole system: every butterfly fact opens onto a relationship (plant, predator, season, place).
2. Ordinary places count: biodiversity is taught as present in streets and yards, not only in reserves.
3. Show, then explain: interaction before paragraph; the visitor discovers the mechanism, the copy names it.
4. Action must be doable this month by a renter with a balcony.
5. Uncertainty is stated, not smoothed: hypotheses are labeled as hypotheses; species vary.

## Accessibility & Inclusion

WCAG 2.2 AA target: body text ≥4.5:1, large text ≥3:1; visible keyboard focus; meaningful Indonesian `alt` text; no information conveyed by color alone (quiz feedback carries icon + text, not just green/red); `prefers-reduced-motion` honored; touch targets ≥44px; semantic landmarks and a skip link.
