---
name: The Return of the Wings
description: Kampanye edukasi biodiversitas lewat kupu-kupu, disusun sebagai vitrin spesimen.
colors:
  deep-forest: "#183d2b"
  leaf-green: "#477a50"
  leaf-ink: "#3c6a44"
  natural-cream: "#f3f0df"
  soft-sage: "#b8d99a"
  butterfly-amber: "#e9a94d"
  ink-soft: "#3a5142"
  ink-faint: "#5a6c5d"
  field-cream: "#ede9d3"
  footer-paper: "#ece8d5"
  rule-hairline: "rgb(24 61 43 / 0.2)"
  state-correct-bg: "#eef3e2"
  state-correct-line: "#b3c99b"
  state-wrong-bg: "#f7ebe6"
  state-wrong-line: "#d7a99c"
  state-wrong-ink: "#9c3b2b"
  print-paper: "#ffffff"
  print-ink: "#000000"
typography:
  display:
    fontFamily: "DM Serif Display, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2.5rem, 4.9vw, 4.4rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.015em"
  display-xs:
    fontFamily: "DM Serif Display, Iowan Old Style, Georgia, serif"
    fontSize: "2.125rem"
    fontWeight: 400
    lineHeight: 0.99
    letterSpacing: "-0.015em"
  display-sm:
    fontFamily: "DM Serif Display, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2.25rem, 3.7vw, 3.35rem)"
    fontWeight: 400
    lineHeight: 0.99
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "DM Serif Display, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2rem, 4.2vw, 3.375rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.015em"
  headline-sm:
    fontFamily: "DM Serif Display, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(1.5rem, 2.4vw, 2rem)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.015em"
  title-xl:
    fontFamily: "DM Serif Display, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(1.375rem, 2vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title-lg:
    fontFamily: "DM Serif Display, Iowan Old Style, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.005em"
  title-sm:
    fontFamily: "DM Serif Display, Iowan Old Style, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0em"
  title:
    fontFamily: "DM Serif Display, Iowan Old Style, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.34
    letterSpacing: "-0.005em"
  lead:
    fontFamily: "DM Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.25vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "0em"
  body:
    fontFamily: "DM Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0em"
  label:
    fontFamily: "DM Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.14em"
  body-sm:
    fontFamily: "DM Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0em"
  body-xs:
    fontFamily: "DM Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  meta:
    fontFamily: "DM Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0em"
  caption:
    fontFamily: "DM Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  tag:
    fontFamily: "DM Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.12em"
  micro:
    fontFamily: "DM Sans, Segoe UI, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.04em"
rounded:
  none: "0px"
  hairline: "1px"
  control: "2px"
  scrollbar: "8px"
  pill: "50%"
spacing:
  xs: "0.5rem"
  sm: "0.875rem"
  md: "1.5rem"
  lg: "2.5rem"
  xl: "clamp(2rem, 4vw, 4rem)"
  case: "clamp(4.5rem, 9vw, 8.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.leaf-ink}"
    textColor: "{colors.natural-cream}"
    rounded: "{rounded.control}"
    padding: "0.85rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.deep-forest}"
    textColor: "{colors.natural-cream}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.deep-forest}"
    rounded: "{rounded.control}"
    padding: "0.6rem 1rem"
  chip-selected:
    backgroundColor: "{colors.deep-forest}"
    textColor: "{colors.natural-cream}"
    rounded: "{rounded.control}"
    padding: "0.5rem 0.85rem"
  chip-rest:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.control}"
    padding: "0.5rem 0.85rem"
  switch-off:
    backgroundColor: "transparent"
    textColor: "{colors.deep-forest}"
    rounded: "{rounded.hairline}"
    padding: "0.25rem 0"
  switch-on:
    backgroundColor: "{colors.deep-forest}"
    textColor: "{colors.natural-cream}"
    rounded: "{rounded.hairline}"
    padding: "0.25rem 0"
  case-frame:
    backgroundColor: "{colors.natural-cream}"
    textColor: "{colors.deep-forest}"
    padding: "clamp(1.5rem, 3.4vw, 3.5rem)"
---

# Design System: The Return of the Wings

## Overview

**Creative North Star: "The Lit Vitrine"**

The page is a specimen cabinet, not a campaign brochure. Every section is a case: a hairline
frame with corner ticks, a plate number engraved into the frame line, one specimen — a real
photograph — and a label whose metadata rides dotted leaders. Illumination is the
system's only ornament: a case lights as it enters the viewport, its ticks draw out, and its
specimen settles from a slight over-scale.

The material is paper and ink, not glass and gloss. Ground is Natural Cream; type is Deep
Forest; colour comes from the specimen itself. The cabinet darkens exactly once, for the
Threats case, and that single ground change is what marks the turn in the story — the system
has no other section-level colour switch.

Density varies like a printed field guide: a wide hero with one large plate, a diagram and a
relationship table in the next case, a three-up drawer of species, a full-width plan, then a
dark case of five threats and one honesty note.

**Key Characteristics:**
- Hairline frames (1px, `rgb(24 61 43 / 0.2)`) with 0.9rem corner ticks, never rounded panels.
- Plate numbers engraved into the frame edge, with an amber ring, never a kicker above a heading.
- One specimen per case at real photographic fidelity; no illustration stands in for a photograph.
- Museum labels where a specimen needs metadata; binomials in italic serif.
- Colour as signal, not decoration: amber marks a focused or selected state only.
- One ground change for the whole page: cream → deep forest at Vitrin 05.

## Colors

A forest palette held in check by paper: two greens, one cream, and a single warm accent that
appears on perhaps five percent of any screen.

### Primary
- **Deep Forest** (#183d2b): body ink, headings, the dark case ground, filled chips, the
  text-stroke of diagrams. It carries 10.5:1 on cream and is the only colour that may sit at
  large scale.
- **Leaf Green** (#477a50): the palette's vegetation tone. Used for rules, diagram strokes,
  icon strokes, and focus-adjacent marks — never for body-size text.
- **Leaf Ink** (#3c6a44): a derived tone, same hue, introduced for anything that carries
  words or cream-on-colour. It holds 5.5:1 both ways, which the palette's Leaf Green does
  not (4.4:1). Filled buttons, checked boxes, the progress bar, and every italic display
  emphasis use this, not Leaf Green.

### Secondary
- **Soft Sage** (#b8d99a): card interiors, the host-bed fill in the plan, the mid ring of the
  biodiversity diagram. Always a fill or a tint, never a text colour.
- **Butterfly Amber** (#e9a94d): the accent. Marks the active cycle tab's underline, the
  annotation pins on the anatomy plate, the plate-number ring, and the selected-rail tick.
  It is the only colour that may signal "this one, now".

### Neutral
- **Natural Cream** (#f3f0df): the page ground and the ground of every light case.
- **Field Cream** (#ede9d3): the plan's drawing surface, one step off the page so the drawing
  reads as a sheet laid on paper.
- **Footer Paper** (#ece8d5): the footer band, closing the page slightly darker than it opened.
- **Ink Soft** (#3a5142): secondary paragraphs and lede text, 8.0:1 on cream.
- **Ink Faint** (#5a6c5d): labels, captions, metadata, 5.2:1 on cream.
- **Rule Hairline** (`rgb(24 61 43 / 0.2)`): every frame and divider; `0.12` for interior
  rows, `0.34` for interactive outlines.

### State
- **Correct** (#eef3e2 fill, #b3c99b line): quiz feedback for a right answer.
- **Wrong** (#f7ebe6 fill, #d7a99c line, #9c3b2b ink): quiz feedback for a wrong answer. The
  word "Belum tepat" and an icon always accompany it, so the tint is reinforcement, not signal.
- **Print** (#ffffff ground, #000000 ink): the print stylesheet only. It never appears on screen.

### Named Rules

**The Amber Scarcity Rule.** Amber is a state, never a surface. It may colour an underline, a
pin, a ring, or a 1px rule; it may never fill a block larger than an icon or set body text.

**The Two-Greens Rule.** Leaf Green draws; Leaf Ink speaks. Any element that carries words or
cream text uses Leaf Ink. Reaching for Leaf Green there is the one contrast failure this
palette invites.

**The Single Darkness Rule.** The page changes ground exactly once, at Vitrin 05. No other
section may invert, and no card may sit on a dark panel inside a light case.

**The Authored-Diagram Rule.** Diagrams (the nesting rings, the garden plan, the fragmentation
pair) are drawn from primitives because they explain a mechanism no photograph can show. A
diagram never stands in for a specimen: every butterfly on the page is a photograph.

## Typography

**Display Font:** DM Serif Display (with Iowan Old Style, Georgia)
**Body Font:** DM Sans (with Segoe UI, system-ui)

**Character:** Editorial serif for statements, humanist sans for everything that must be read
quickly. The pairing is a field guide's: a plate caption set in serif, its data in sans. Both
are self-hosted (`assets/fonts/*.woff2`), never fetched from a hosted stylesheet.

### Hierarchy
- **Display** (400, `clamp(2.5rem, 4.9vw, 4.4rem)`, 0.98): the hero statement only, broken at
  authored line ends with the final word in italic Leaf Ink. It steps down to
  `clamp(2.25rem, 3.7vw, 3.35rem)` on short laptops and to a flat 2.125rem on short phones.
- **Headline** (400, `clamp(2rem, 4.2vw, 3.375rem)`, 1.02): every case heading; the closing
  phrase italicises into Leaf Ink (Soft Sage on the dark case).
- **Title XL** (400, `clamp(1.375rem, 2vw, 1.75rem)`, 1.15): the life-cycle stage names.
- **Title** (400, 1.25rem, 1.34): quiz questions, threat names, result headings, label titles.
- **Body** (400, 1.0625rem, 1.65): paragraphs, capped at 68ch; ledes at 46ch in Ink Soft.
- **Label** (500, 0.75rem, 0.14em, uppercase): nav, chips, plate numbers, metadata keys.
- **Body Sm** (400, 0.9375rem, 1.55): option rows, plan notes, threat text, table cells.
- **Meta** (400, 0.8125rem, 1.55): card descriptions, captions, feedback text, footer body.
- **Caption** (400, 0.75rem, 1.5): photo credits, figure captions, credits list, host-plant tags.
- **Tag** (500, 0.6875rem, 0.12em, uppercase): checklist tags, section micro-labels, plate numbers.
- **Micro** (400, 0.625rem, 0.04em): the only step allowed below the floor, used once for the
  favicon-scale brand subtitle at ≤26em. Nothing functional sits here.

### Named Rules

**The Italic Is The Turn Rule.** Emphasis in a display or headline is always the italic of the
same face in Leaf Ink. No colour highlight, no underline, no bold weight change.

**The No-Eyebrow Rule.** Headings carry their own weight. A case is identified by its engraved
plate number in the frame line, never by a small label sitting above the heading.

**The Eleven-Pixel Floor Rule.** Nothing functional is set below 0.6875rem (11px), and body
copy never below 0.75rem (12px). The micro step exists only for the brand subtitle on the
narrowest phones, where it is decorative and duplicated in the page title.

**The Five-Step Micro Scale Rule.** Between 11px and 15px the system has exactly five steps —
0.6875, 0.75, 0.8125, 0.875, 0.9375rem — and each carries a named role above. A sixth
near-duplicate in that band is drift, not nuance.

## Layout

A single centred column, `max-width: 92rem`, with a page gutter of `clamp(1.125rem, 4vw, 4.5rem)`.
Above 75em a 4.5rem fixed rail occupies the left edge as the cabinet index; the content gutter
grows by the same amount so nothing shifts.

Cases stack with `clamp(4.5rem, 9vw, 8.5rem)` between them, and each case's frame carries
`clamp(1.5rem, 3.4vw, 3.5rem)` of interior padding. Inside a case, two column structures exist
and no others: `--wide` (1.35fr / 0.65fr, text beside a diagram or read-out), which collapses
to one column below 56em. Cases whose body is a single statement (04, 07) use one column at
every width, with the plan or banner below the copy.

Spacing rhythm is one scale: 0.5 / 0.875 / 1.5 / 2.5rem, plus the two clamps above. Space above
a heading always exceeds the space below it.

## Elevation & Depth

The system is flat and drawn, not lifted. There are no shadows except two functional ones: the
label-card and frame never cast, while the amber annotation pins carry
`0 0 0 1px rgb(243 240 223 / 0.85), 0 2px 6px rgb(24 61 43 / 0.35)` so they stay legible over
a photograph, and the herbarium-style sheet in the plan carries none at all.

Depth is conveyed by three means instead: tonal layering (cream → field cream → footer paper),
hairline frames that separate a case from the page, and the illumination state, where an
unlit frame's ticks sit at `scale(0.4)` and an lit one's reach `scale(1)`.

### Named Rules

**The Drawn-Not-Lifted Rule.** A surface is never raised with a shadow to signal hierarchy.
If a region needs to separate, it gets a hairline frame or a tonal step.

## Shapes

Corners are square. Controls take a 2px radius; hairline separators take 1px; nothing else is
rounded except the amber annotation pins and the plate-number ring, which are circles because
they are markers, not surfaces.

Corner ticks (0.9rem, 1px, Deep Forest, opacity 0.55 unlit / 1 lit) sit at each corner of a case
frame, overlapping the frame line by one pixel. They are the system's signature mark and the
only ornament the frames carry.

Borders are always 1px. There is no 2px rule anywhere except the active cycle tab's underline,
which is 2px of Amber because it must read as a state at a glance.

## Components

### Buttons
- **Shape:** square with a 2px radius, 3rem minimum height.
- **Primary:** Leaf Ink fill, cream text, 0.85rem × 1.5rem padding; hover deepens to Deep Forest.
- **Ghost:** transparent with a `0.34` hairline outline, Deep Forest text; hover darkens the outline only.
- **Small:** 2.5rem height, 0.8125rem text — used inside the quiz footer and the checklist bar.
- **Focus:** a 2px Deep Forest outline at 3px offset on every control, no exceptions.

### Chips
- **Style:** 2.625rem minimum height, hairline outline, Ink Soft text, 2px radius, inline icon at 0.9rem.
- **State:** selected fills Deep Forest with cream text. Unselected is transparent. The plan's
  four chips toggle independently and their pressed state is what dims a diagram layer.

### Cards / Containers
- **Case frame:** the only container. Hairline border, corner ticks, engraved plate number,
  interior padding per Layout. Cases never nest inside one another.
- **Species cell:** the one true card — a 1px grid gap over a hairline ground, so the cells read
  as a drawer's compartments rather than four floating panels. Image at 4:3, number, binomial
  in italic serif, two lines of description, dotted rule, then the host-plant tag.
- **Label:** used under the hero plate and the annotated anatomy plate. No box: a serif title
  in italic, an uppercase subtitle, then dotted-leader metadata rows where a specimen has data.

### Inputs / Fields
- **Radio (quiz):** the whole option is the target — a 1px outlined row with 0.7rem padding,
  a 1rem radio at `accent-color: Leaf Ink`. Hover tints the row toward `#f8f6ea`.
- **Checkbox (checklist):** the native input is visually hidden; a 1.35rem drawn box replaces
  it, and the checkmark is an SVG path that draws in via `stroke-dashoffset`. The row is the
  label, so the whole line is clickable and 44px tall at minimum.
- **Feedback:** a bordered block with an icon and a bold "Benar" / "Belum tepat" label. Correct
  is sage-tinted, wrong is clay-tinted; both carry the word, so colour is never the only signal.

### Navigation
- **Top bar:** sticky, cream at 92% with a 6px blur, 4.25rem tall, hairline bottom. Serif
  wordmark with an italic Leaf Ink last word, uppercase sans nav at 0.8125rem with 0.1em tracking.
- **State:** the active link gains a 1px Leaf underline; hover gains a `0.34` underline.
- **Mobile:** below 62em the nav collapses to a Menu button that expands a drawer of serif
  links with engraved numbers; `Escape` closes it and returns focus to the button.
- **Rail:** the desktop cabinet index — numbers only, right-aligned against the rail's edge,
  with a 1px tick that widens and turns Deep Forest for the active case.

### Switches (habitat simulation)
- **Shape:** square track 2.25rem × 1.15rem, 1px hairline, 1px radius; a round 0.6rem knob.
  Off is an empty outline with the knob left; on fills the track Deep Forest and moves the knob
  right in Amber.
- **State word:** every switch carries its own word beside it — "Aktif" / "Nonaktif" — in the
  Tag style. The knob position, the fill, and the word all say the same thing; none of the
  three is the only signal.
- **Target:** the whole row is the button, 2.75rem tall, `role="switch"` with `aria-checked`.
  Space and Enter both toggle it.
- **Note:** each switch owns a sentence beneath it that rewrites on toggle — the consequence
  when off, the provision when on. The note, not the switch, carries the teaching.

### Rewards list
- Three cells in the same 1px-gap drawer grid as the species cards. Locked: hairline mark ring
  in Ink Faint, state reads "Terkunci". Unlocked: Deep Forest ring on a Soft Sage fill, state
  reads "✓ Terbuka".
- The cursor reward's compact switch and the touch-device button sit inside their own cell and
  appear only when unlocked and the input type matches.

### Completion dialog
- A native `<dialog>` opened with `showModal()`: cream panel, 1px Deep Forest border, square
  corners, backdrop `rgb(24 61 43 / 0.58)`. It is the only overlay in the system.
- Focus is trapped by the browser; closing returns focus to the Koridor switch. Escape closes.

### Signature Components

**The illuminated case.** Each case observes itself; on entry it gains `is-lit`, which
simultaneously draws the corner ticks, settles the specimen from `scale(1.045)` to `1`, fades
the reveal children in at 70ms stagger, and darkens the frame border from `0.12` to `0.2`
alpha. Under `prefers-reduced-motion` every case is lit immediately and no transition runs.

**The reward flight.** Butterflies are inline SVG built from six paths, appended to a
`position: fixed; pointer-events: none` layer above the page and animated with the Web Animations
API — three crossing the viewport on habitat completion, eighteen rising and fading on
commitment (the bloom). Each element removes itself on `animation.finish`. Under
`prefers-reduced-motion` the layer is `display: none` and nothing is created; the confirmation
text and dialog still appear, so no information depends on the motion.

**The annotated plate.** A real photograph with absolutely positioned amber pins at percentage
coordinates, and a numbered definition list beside it. Pins are `pointer-events: none` and the
list carries the meaning, so the plate is fully readable with no pointer.

## Do's and Don'ts

### Do:
- **Do** set every word-bearing element in Leaf Ink or darker; check cream-on-fill and fill-on-cream both clear 4.5:1.
- **Do** keep one specimen per case, at photographic fidelity, with its credit printed on the image.
- **Do** engrave the case number into the frame line with the amber ring, at `clamp(2.25rem, 3.4vw, 3.5rem)` from the left.
- **Do** cap prose at 68ch and ledes at 46ch.
- **Do** give every interactive control a 2px Deep Forest focus outline at 3px offset.
- **Do** pair every state colour with a word or an icon.

- **Do** give every switch a state word as well as a knob position, and let the note under it
  explain the consequence of that state.
- **Do** keep reward animations in a pointer-events-none layer that cleans up after itself.

### Don't:
- **Don't** introduce a second dark section; Vitrin 05 is the page's only inversion.
- **Don't** use Leaf Green for text — that is what Leaf Ink exists for.
- **Don't** round a surface beyond 2px, and never give a case a shadow.
- **Don't** place a kicker or eyebrow above a heading.
- **Don't** let amber fill any area larger than an icon.
- **Don't** swap a photograph for a drawn vector butterfly; the cabinet shows specimens, not mascots.
- **Don't** add a card inside a card, or a panel inside a case.
- **Don't** let a reward animation block the page or run when `prefers-reduced-motion` is set.
- **Don't** disable a control without also saying why it is unavailable.
