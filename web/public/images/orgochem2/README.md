# OrgoChem II curriculum images

Figures referenced from `web/app/lib/curriculum.ts` (`orgochem2Topics[].images`) live under this folder and are served from `/images/orgochem2/...`.

## Naming

`[topic-slug]-[section]-[number].extension`

Examples:

- `alkynes-mechanism-1.svg`
- `nmr-spectra-carboxylic-1.svg`

**section** is one of: `summary`, `mechanism`, `spectra`, `practice` (see `TopicImageSection` in `curriculum.ts`).

## Dimensions

- Reaction schemes and mechanism panels: about **800×400** px (2:1 aspect works well in `TopicCurriculumImages`).
- Spectra / IR schematics: about **600×400** px.

SVGs scale cleanly; exported PNGs should follow the above for consistency.

## Accessibility

Every image entry must include:

- **`alt`**: concise description of what the student should see (e.g. “Curved arrows for first HX addition to an internal alkyne”).
- **`caption`**: short teaching caption shown under the figure; may repeat nuance from `alt` but can add context (reagent, conditions).

Do not ship decorative-only images without a meaningful `alt`; prefer empty decorative handling in the app only when the image is truly redundant (we do not do that for curriculum figures).
