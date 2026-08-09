# Replacing placeholder images

Most images on the site are still plain abstract SVG placeholders living in this folder. To swap one in, just replace the file at the same path with your real image — **keep the same filename** (or update the `src` in `index.html` if you want a different filename or format like `.jpg`/`.png`).

Real photos/art in place: `orca-2026.jpg` ("Orca 2026"), `mural-signals-flow.jpg` (the actual "Where Signals Flow Like Water" mural, pulled from the mural PDF), `ucalgary-resource-page.jpg` (the "Walking Together on Parallel Paths" launch poster), `portrait.jpg` (Sallee's own portrait photo), and `academic-turnaround.jpg` (the real Academic Turnaround Program cover art). Swap any of these for higher-resolution versions whenever you have them, keeping the same filenames.

| File | Used for | Suggested aspect ratio |
|---|---|---|
| `portrait.jpg` | Homepage portrait photo | real image in place |
| `orca-2026.jpg` | "Orca 2026" acrylic painting | square-ish — real image in place |
| `mural-signals-flow.jpg` | "Where Signals Flow Like Water" mural (panoramic, horizontal-scroll) | very wide — real image in place |
| `ucalgary-resource-page.jpg` | UCalgary Indigenous Student Resource Page project | portrait poster — real image in place |
| `academic-turnaround.jpg` | Academic Turnaround Program workbook/infographics | portrait poster — real image in place |
| `handmade-jewelry.svg` | Handmade Creations — jewelry item | 1:1 square |
| `handmade-dreamcatcher.svg` | Handmade Creations — dream catcher | 1:1 square |
| `handmade-other.svg` | Handmade Creations — other item | 1:1 square |
| `bear-trail.png` | The bear illustration in the footer, bottom-left, followed by its footprints — real image in place, transparent background | ~3:2, transparent background |
| `el-dragonfly.png` | Decorative accent perched on the homepage portrait frame | real image, transparent background |
| `el-dotted-box.png` | Decorative frame peeking out behind the homepage portrait | real image, transparent background |
| `el-berries.png` | Small strawberry decoration in the top-right corner of the Handmade Creations heading, original coral color (a single strawberry cropped from this same sheet is also used as `assets/icons/berry-toggle.png`, the theme-toggle button icon) | real image, transparent background |
| `el-fish.png` | Extracted from Sallee's design-elements sheet but not placed anywhere yet — she didn't mention it in her notes, so it's sitting here pending confirmation on whether/where to use it | real image, transparent background |
| `char-bird.png` / `char-crocodile.png` / `char-frog.png` | Ask Me Anything comic characters, alongside the existing hand-coded fox/bear SVGs — each Q&A pairs two of the five at random | real images, transparent background |

You can add more handmade/art pieces by copying an existing `<article class="flip-card">` block in `index.html`, giving it a new image filename, and dropping the matching file in here.

## Links still needed
Search `index.html` for `href="#"` with a `data-todo` attribute — these mark placeholder links waiting on real URLs:
- Mural project page/link
- Academic Turnaround Program project link

Already wired up: the UCalgary interview video link and the Indigenous Academic & Student Resources page link (both on the Art & Design UCalgary card's flip side).
