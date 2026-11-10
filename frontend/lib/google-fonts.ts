/**
 * Popular Google Fonts for caption styling (100+ families).
 * Loaded on demand via the Google Fonts CSS API.
 */

export const SYSTEM_FONTS = [
  "Impact",
  "Arial Black",
  "Arial",
  "Helvetica",
  "Georgia",
  "Times New Roman",
] as const;

/** Curated Google Fonts — caption / display / South Asian scripts */
export const GOOGLE_FONTS = [
  // Sans — modern / viral captions
  "Montserrat",
  "Poppins",
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Nunito",
  "Nunito Sans",
  "Raleway",
  "Oswald",
  "Ubuntu",
  "Rubik",
  "Work Sans",
  "DM Sans",
  "Manrope",
  "Outfit",
  "Plus Jakarta Sans",
  "Figtree",
  "Sora",
  "Space Grotesk",
  "Albert Sans",
  "Archivo",
  "Barlow",
  "Barlow Condensed",
  "Cabin",
  "Catamaran",
  "Chivo",
  "Commissioner",
  "Exo 2",
  "Fira Sans",
  "Fira Sans Condensed",
  "Hind",
  "IBM Plex Sans",
  "Josefin Sans",
  "Jost",
  "Kanit",
  "Karla",
  "Lexend",
  "Libre Franklin",
  "Mulish",
  "Noto Sans",
  "Overpass",
  "Oxygen",
  "PT Sans",
  "Public Sans",
  "Quicksand",
  "Red Hat Display",
  "Source Sans 3",
  "Spline Sans",
  "Syne",
  "Titillium Web",
  "Urbanist",
  "Varela Round",
  "Yanone Kaffeesatz",

  // Display / bold captions
  "Bebas Neue",
  "Anton",
  "Alfa Slab One",
  "Archivo Black",
  "Bangers",
  "Black Ops One",
  "Bungee",
  "Bungee Shade",
  "Bowlby One SC",
  "Fredoka",
  "Fugaz One",
  "Lilita One",
  "Lobster",
  "Luckiest Guy",
  "Monoton",
  "Pacifico",
  "Passion One",
  "Permanent Marker",
  "Phudu",
  "Press Start 2P",
  "Righteous",
  "Roboto Condensed",
  "Rock Salt",
  "Russo One",
  "Sacramento",
  "Secular One",
  "Sigmar",
  "Squada One",
  "Teko",
  "Titan One",
  "Ultra",

  // Condensed / tall
  "Fjalla One",
  "Saira Condensed",
  "Saira Extra Condensed",
  "Staatliches",

  // Serif
  "Playfair Display",
  "Merriweather",
  "Lora",
  "Libre Baskerville",
  "Cormorant Garamond",
  "EB Garamond",
  "IBM Plex Serif",
  "Noto Serif",
  "PT Serif",
  "Roboto Slab",
  "Source Serif 4",

  // Handwriting / script
  "Caveat",
  "Dancing Script",
  "Great Vibes",
  "Indie Flower",
  "Kalam",
  "Satisfy",

  // South Asian — Hindi / Devanagari
  "Noto Sans Devanagari",
  "Noto Serif Devanagari",
  "Mukta",
  "Tiro Devanagari Hindi",
  "Khand",
  "Karma",
  "Yantramanav",
  "Rajdhani",

  // Urdu / Arabic / Nastaliq
  "Noto Nastaliq Urdu",
  "Noto Naskh Arabic",
  "Noto Sans Arabic",
  "Amiri",
  "Cairo",
  "Lateef",
  "Scheherazade New",
  "IBM Plex Sans Arabic",
  "Reem Kufi",
  "Tajawal",

  // Tamil
  "Noto Sans Tamil",
  "Noto Serif Tamil",
  "Hind Madurai",
  "Mukta Malar",

  // Telugu
  "Noto Sans Telugu",
  "Noto Serif Telugu",
  "Hind Guntur",
  "Ramabhadra",

  // Bengali
  "Noto Sans Bengali",
  "Noto Serif Bengali",
  "Hind Siliguri",
  "Atma",
  "Baloo Da 2",

  // More popular
  "Abel",
  "Acme",
  "Alegreya Sans",
  "Asap",
  "Assistant",
  "Bitter",
  "Bree Serif",
  "Cinzel",
  "Comfortaa",
  "Crimson Text",
  "Domine",
  "Dosis",
  "Encode Sans",
  "Heebo",
  "Inconsolata",
  "JetBrains Mono",
  "Lobster Two",
  "Maven Pro",
  "Orbitron",
  "Prompt",
  "Questrial",
  "Signika",
  "League Spartan",
  "Tinos",
  "Ubuntu Condensed",
  "Vollkorn",
  "Zilla Slab",
] as const;

/** Deduped list for the dropdown (Montserrat first). */
export const FONT_FAMILIES: string[] = (() => {
  const seen = new Set<string>();
  const google: string[] = [];
  for (const name of GOOGLE_FONTS) {
    if (seen.has(name)) continue;
    seen.add(name);
    google.push(name);
  }
  google.sort((a, b) => a.localeCompare(b));
  const withoutDefault = google.filter((f) => f !== "Montserrat");
  const system = SYSTEM_FONTS.filter((f) => !seen.has(f));
  return ["Montserrat", ...system, ...withoutDefault];
})();

const GOOGLE_SET = new Set<string>(GOOGLE_FONTS);
const loadedFonts = new Set<string>();
let allFontsPreloaded = false;

function familyParam(family: string, weights = "0,400;0,500;0,600;0,700;0,800;0,900"): string {
  const name = encodeURIComponent(family).replace(/%20/g, "+");
  return `family=${name}:ital,wght@${weights};1,400;1,700`;
}

function googleCssUrl(family: string): string {
  return `https://fonts.googleapis.com/css2?${familyParam(family)}&display=swap`;
}

function injectStylesheet(id: string, href: string): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function ensurePreconnect(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById("clipforge-gf-preconnect")) return;
  const a = document.createElement("link");
  a.id = "clipforge-gf-preconnect";
  a.rel = "preconnect";
  a.href = "https://fonts.googleapis.com";
  document.head.appendChild(a);
  const b = document.createElement("link");
  b.rel = "preconnect";
  b.href = "https://fonts.gstatic.com";
  b.crossOrigin = "anonymous";
  document.head.appendChild(b);
}

/** Inject a Google Font stylesheet once (no-op for system fonts). */
export function ensureGoogleFont(family: string | undefined | null): void {
  if (!family || typeof document === "undefined") return;
  if (!GOOGLE_SET.has(family)) return;
  if (loadedFonts.has(family)) return;
  loadedFonts.add(family);
  ensurePreconnect();

  const id = `clipforge-gf-${family.replace(/\s+/g, "-").toLowerCase()}`;
  injectStylesheet(id, googleCssUrl(family));
}

/**
 * Preload the full caption font catalog in batches so dropdown items
 * already render in their typeface.
 */
export function preloadAllGoogleFonts(): void {
  if (typeof document === "undefined" || allFontsPreloaded) return;
  allFontsPreloaded = true;
  ensurePreconnect();

  const families = [...GOOGLE_SET];
  // Lean weights for catalog preload (selected font still gets full weights below)
  const BATCH = 12;
  for (let i = 0; i < families.length; i += BATCH) {
    const chunk = families.slice(i, i + BATCH);
    for (const f of chunk) loadedFonts.add(f);
    const href =
      `https://fonts.googleapis.com/css2?` +
      chunk.map((f) => familyParam(f, "0,400;0,700;0,800")).join("&") +
      `&display=swap`;
    injectStylesheet(`clipforge-gf-batch-${i}`, href);
  }
}

/** Preload catalog + ensure the active font has full weight range. */
export function ensureEditorFonts(
  ...families: (string | undefined | null)[]
): void {
  preloadAllGoogleFonts();
  for (const f of families) {
    if (!f || !GOOGLE_SET.has(f)) continue;
    // Full weight sheet for the active caption font
    const id = `clipforge-gf-full-${f.replace(/\s+/g, "-").toLowerCase()}`;
    injectStylesheet(id, googleCssUrl(f));
  }
}
