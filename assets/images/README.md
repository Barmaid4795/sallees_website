# Replacing placeholder images

Most images on the site are still plain abstract SVG placeholders living in this folder. To swap one in, just replace the file at the same path with your real image — **keep the same filename** (or update the `src` in `index.html` if you want a different filename or format like `.jpg`/`.png`).

Three are already real: `orca-2026.jpg` ("Orca 2026"), `mural-signals-flow.jpg` (the actual "Where Signals Flow Like Water" mural, pulled from the mural PDF), and `ucalgary-resource-page.jpg` (the "Walking Together on Parallel Paths" launch poster). All are temporary/low-quality exports — swap them for higher-resolution versions whenever you have them, keeping the same filenames.

| File | Used for | Suggested aspect ratio |
|---|---|---|
| `portrait.svg` | About Me photo | ~4:5 portrait |
| `orca-2026.jpg` | "Orca 2026" acrylic painting | square-ish — real image in place |
| `mural-signals-flow.jpg` | "Where Signals Flow Like Water" mural (panoramic, horizontal-scroll) | very wide — real image in place |
| `ucalgary-resource-page.jpg` | UCalgary Indigenous Student Resource Page project | portrait poster — real image in place |
| `academic-turnaround.svg` | Academic Turnaround Program workbook/infographics | 4:3 |
| `handmade-jewelry.svg` | Handmade Creations — jewelry item | 1:1 square |
| `handmade-dreamcatcher.svg` | Handmade Creations — dream catcher | 1:1 square |
| `handmade-other.svg` | Handmade Creations — other item | 1:1 square |
| `bear-trail.png` | The bear illustration at the bottom of the right-edge print trail (referenced from `js/footprints.js`, not `index.html`) — real image in place, transparent background | ~3:2, transparent background |

Note: there's no more homepage featured-artwork image — the hero is text-only now, per Sallee's request to remove it.

You can add more handmade/art pieces by copying an existing `<article class="flip-card">` block in `index.html`, giving it a new image filename, and dropping the matching file in here.

## Links still needed
Search `index.html` for `href="#"` with a `data-todo` attribute — these mark placeholder links waiting on real URLs:
- Mural project page/link
- Academic Turnaround Program project link

Already wired up: the UCalgary interview video link and the Indigenous Academic & Student Resources page link (both on the Art & Design UCalgary card's flip side).
