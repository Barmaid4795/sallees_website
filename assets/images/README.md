# Replacing placeholder images

Most images on the site are still plain abstract SVG placeholders living in this folder. To swap one in, just replace the file at the same path with your real image — **keep the same filename** (or update the `src` in `index.html` if you want a different filename or format like `.jpg`/`.png`).

Two are already real: `mural-signals-flow.jpg` (the actual "Where Signals Flow Like Water" mural, pulled from the mural PDF) and `ucalgary-resource-page.jpg` (the "Walking Together on Parallel Paths" launch poster). Both are temporary/low-quality exports — swap them for higher-resolution versions whenever you have them, keeping the same filenames.

| File | Used for | Suggested aspect ratio |
|---|---|---|
| `hero-featured.svg` | Homepage featured artwork | ~10:7 landscape |
| `portrait.svg` | About Me photo | ~4:5 portrait |
| `orca-2026.svg` | "Orca 2026" acrylic painting | ~7:8.5 portrait |
| `mural-signals-flow.jpg` | "Where Signals Flow Like Water" mural (panoramic, horizontal-scroll) | very wide — real image in place |
| `ucalgary-resource-page.jpg` | UCalgary Indigenous Student Resource Page project | portrait poster — real image in place |
| `academic-turnaround.svg` | Academic Turnaround Program workbook/infographics | 4:3 |
| `handmade-jewelry.svg` | Handmade Creations — jewelry item | 1:1 square |
| `handmade-clothing.svg` | Handmade Creations — clothing item | 1:1 square |
| `handmade-other.svg` | Handmade Creations — other item | 1:1 square |
| `bear-trail.svg` | The bear illustration at the bottom of the right-edge print trail (referenced from `js/footprints.js`, not `index.html`) | roughly square, transparent background works best |

You can add more handmade/art pieces by copying an existing `<article class="flip-card">` block in `index.html`, giving it a new image filename, and dropping the matching file in here.

## Links still needed
Search `index.html` for `href="#"` with a `data-todo` attribute — these mark placeholder links waiting on real URLs:
- Mural project page/link
- Academic Turnaround Program project link

Already wired up: the UCalgary interview video link and the Indigenous Academic & Student Resources page link (both on the Art & Design UCalgary card's flip side).
