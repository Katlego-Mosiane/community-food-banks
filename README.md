# Community Food Banks — Website (WEDE5020)

**Module:** Web Development (Introduction) — WEDE5020
**Student:** ST10528288
**Repository contents:** `Home.html`, `About.html`, `Services.html`, `Gallery.html`, `Enquiry.html`, `Contact.html`, `404.html`, `style.css`, `js/`, `data/`, images, video, `robots.txt`, `sitemap.xml` and supporting documentation.

**Live site:** `https://YOUR-USERNAME.github.io/community-food-banks/` *(replace with your deployed link)*
**Repository:** `https://github.com/YOUR-USERNAME/community-food-banks` *(replace with your repository link)*

## 1. Project Overview

This repository contains the multi-page website built for **Community Food Banks**, a South African non-profit
organisation that provides food-parcel distribution and water-purification support to disadvantaged communities in
Gauteng. The site has six pages — Home, About, Services, Gallery, Enquiry and Contact — sharing a common header,
navigation bar and footer.

* **Part 1** delivered the semantic HTML structure and content for every page.
* **Part 2** added the visual design layer: an external stylesheet, a desktop layout and a responsive design.
* **Part 3 (this submission)** adds JavaScript functionality (accordion, tabs, modal, animations, gallery lightbox,
  interactive map, searchable programmes), two validated forms, search engine optimisation (SEO), security and
  performance improvements, and deployment.

## 2. How to View the Site

Visit the live link above, or open `Home.html` in a browser, or use a local server (e.g. the VS Code "Live Server"
extension) and navigate using the top navigation bar. All pages share `style.css`; interactive pages load the scripts in
`js/`. The interactive map and its Leaflet library need an internet connection.

## 3. CSS Styling for Desktop (Part 2, Section 2)

* **External stylesheet:** a single file, `style.css`, is linked from the `<head>` of every page (`<link rel="stylesheet" href="style.css">`).
* **Base style / CSS reset:** a universal box-sizing reset plus default typography, colours and spacing are set once
  on `html`, `body`, headings and paragraphs, and inherited everywhere else.
* **Typography:** a harmonious type scale (`--fs-sm` → `--fs-xxl`) is defined with CSS custom properties and applied
  with `font-family`, `font-size`, `font-weight`, `line-height` and `letter-spacing`.
* **Layout:** Flexbox is used for the header/navigation bar (`.site-nav`) and CSS Grid is used for the main content
  area, the two‑column home page hero (`.hero`) and the photo galleries (`.gallery-grid`), so the desktop layout is
  clear, aligned and easy to navigate.
* **Visual styling:** `background-color`, `border`, `border-radius` and `box-shadow` are used throughout to give
  cards, images and the navigation bar visual depth.
* **Pseudo-classes:** `:hover`, `:focus` and `:active` are used on navigation links and gallery images to provide
  interactive feedback.
* **Cascading / minimal selectors:** shared rules (typography, header, footer, `.section`, `.gallery-grid`, etc.) are
  written once and inherited by every page. Only five one‑line rules (`body.page-home`, `body.page-about`, …) are
  needed to give each page its own accent background colour — demonstrating the cascade rather than repeating full
  style blocks per page.

## 4. Responsive Design (Part 2, Section 3)

* **Breakpoints:** two media queries are used — `max-width: 768px` (tablet) and `max-width: 480px` (mobile) — in
  addition to the default desktop styles.
* **Relative units:** spacing and font sizes are defined with `rem`/`em` custom properties, and widths use `%`/`fr`
  units (CSS Grid) so elements scale rather than break.
* **Layout changes per breakpoint:** the two‑column home page hero collapses to a single column, the multi‑column
  photo grids reduce their minimum tile size and eventually stack to one column, and the navigation links wrap and
  centre themselves for touch screens.
* **Responsive images:** `srcset`/`sizes` attributes are used on every content photograph. Two extra resolutions
  (480w and 900w) were generated for each image and stored in `images-responsive/`, so mobile devices download a
  small file while desktop browsers can request the original, full-resolution image.
* **Testing:** the site was tested with the browser Developer Tools device toolbar across desktop, tablet
  (≈768px) and mobile (≈375–480px) breakpoints. *(Insert your screenshot evidence for each screen size below before
  submission.)*

  | Device / width | Screenshot |
  |---|---|
  | Desktop (≥1024px) | *(add screenshot)* |
  | Tablet (~768px) | *(add screenshot)* |
  | Mobile (~375–480px) | *(add screenshot)* |

## 5. Part 3 — JavaScript Functionality (Part 3, Section 2)

All scripts are plain JavaScript (no framework is required) in the `js/` folder and loaded with `defer`, so they never block page rendering.
Content is always inserted with `textContent`/DOM methods rather than `innerHTML`, which prevents script injection.

| Feature | Page | Where / how it works |
|---|---|---|
| **Accordion** (FAQ) | About | `.accordion` in `main.js`. Buttons use `aria-expanded`/`aria-controls`; one panel is open at a time; panels animate with a CSS grid-row transition. |
| **Tabs** (Mission / Vision / Values) | About | `.tabs` in `main.js`. Uses the ARIA `tablist` pattern with left/right arrow, Home and End key support. |
| **Modal** ("Get involved") | Home | Native `<dialog>` element opened with `showModal()`; closes with the button, the Escape key or a click on the backdrop. |
| **Interactive map** | Contact | `map.js` uses **Leaflet** with OpenStreetMap tiles: marker with pop-up, 600 m service-area circle, street/terrain layer switch, scale bar, "Reset map", "Show my location" (geolocation) and "Get directions". Scroll-wheel zoom only activates after the map is clicked so it does not trap page scrolling. |
| **Animations and transitions** | All | CSS transitions on buttons, cards and the accordion; scroll-reveal sections (`IntersectionObserver` + CSS); animated impact counters on Home (`requestAnimationFrame`); fade-in tabs, modal and results. All animation is disabled for users with `prefers-reduced-motion`. |
| **Advanced DOM manipulation** | All | Back-to-top button and lightbox are created dynamically; programme cards and the programme dropdown are generated from data; the Enquiry form shows/hides fields depending on the enquiry type, changes labels and filters programmes; live character counters; dynamically built result and email-preview panels. |
| **Gallery with lightbox** | Gallery | `[data-lightbox]` links in `main.js`: click a photo to open it larger, with caption, "x of 9" counter, previous/next buttons, arrow keys, swipe on touch screens, Escape to close, focus trapping and focus returned to the thumbnail on close. |
| **Dynamic content** | Services | Programme cards are rendered by JavaScript from `data/programmes.json` (embedded copy in `js/data.js` so it also works when opened from disk). |
| **Search, filter and sort** | Services | Live search across title, description, category, audience and availability; filter by type (dropdown built from the data); sort by name or cost; result count announced to screen readers; "no results" message and a Clear button. |

## 6. Part 3 — SEO (Part 3, Section 3)

**On-page SEO**

* **Keyword research:** target phrases were chosen around what donors, volunteers and families would search for: *food bank South Africa*, *food parcels Gauteng*, *clean water project*, *volunteer Johannesburg*, *sponsor food parcels*, *water tanker*. These are used naturally in headings, body text, titles and descriptions.
* **Title tags:** every page has a unique, descriptive title of roughly 50–65 characters in the pattern *Page topic | Community Food Banks*.
* **Meta description:** every page has a unique ~150–160 character description with a call to action. **Meta keywords** are also supplied per page (modern search engines ignore them, but the assignment requires them, so they are kept relevant and limited to 6–8 phrases to avoid stuffing).
* **Header tags:** each page has exactly one `<h1>`, followed by logically nested `<h2>`/`<h3>` headings.
* **Image optimisation:** all images were renamed from `Image1.jpg`, `Image2.jpg` … to descriptive, hyphenated names (e.g. `volunteers-packing-food-parcels-warehouse.jpg`), including the responsive copies in `images-responsive/`, and every image has specific alt text. Images carry `width`/`height` attributes and are lazy-loaded below the fold.
* **URL structure:** short, readable, case-consistent page names with no query strings (e.g. `Services.html`).
* **Internal linking:** pages link to each other in context (e.g. About → Services and Enquiry; Gallery → Contact and Enquiry; each programme card → Enquiry with that programme pre-selected), plus a full footer link list.
* **Mobile-friendliness:** responsive viewport, breakpoints at 768px and 480px, large tap targets and a skip-to-content link.

**Off-page and local SEO**

* **Local SEO:** `en-ZA` language, the full South African address and phone number on the Contact page and in the footer, and **JSON-LD structured data** (`schema.org/NGO`) on Home and Contact so search engines understand the organisation, address and area served (Gauteng).
* **Social media / sharing:** Open Graph and Twitter Card tags give links shared on social media a title, description and image.
* **Backlinks (plan):** list the organisation on the South African NPO directory and local community boards, ask partner NPOs, CBOs, schools and corporate allies to link to the site, and share the Gallery and Services pages on social media. Backlinks come from other websites, so they cannot be added in code.

**Technical SEO**

* `robots.txt` allows all pages, blocks `/data/` and the 404 page, and points to the sitemap.
* `sitemap.xml` lists all six pages with last-modified dates and priorities.
* A `canonical` link on every page prevents duplicate-URL issues. `404.html` is a friendly error page (set to `noindex`).
* **Page speed:** the 77 MB intro video was re-encoded to 1280×720 (about 2 MB) and given a poster image with `preload="none"`; images use `srcset`, lazy loading and explicit sizes; scripts are `defer`red; the map library only loads on the Contact page; `_headers` sets caching on Netlify.
* **Security:** a Content-Security-Policy `<meta>` on every page limits where scripts, styles and images can load from; the Leaflet files use Subresource Integrity (`integrity`) hashes; external links use `rel="noopener noreferrer"`; forms are validated on the client, output is written with `textContent` (no HTML injection), and a hidden honeypot field catches simple spam bots; the `_headers` file adds `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and HSTS on hosts that support it. GitHub Pages and Netlify provide HTTPS automatically. Note: client-side checks improve usability and are not a substitute for server-side validation if a back-end is added later.

## 7. Part 3 — Forms and Validation (Part 3, Section 4)

Both forms use semantic HTML (`label`, `fieldset`/`legend`, `input`, `select`, `textarea`, checkboxes), the HTML5 attributes
`required`, `minlength`, `maxlength`, `min`, `max`, `type="email"|"tel"|"date"|"number"` and an `action`/`method` attribute, **plus** JavaScript validation (`js/forms.js`)
with `novalidate` so the messages are consistent and accessible. Errors appear next to the field (`role="alert"`, `aria-invalid`, `aria-describedby`), fields re-validate live as they are corrected, and the first invalid field receives focus.

**Enquiry form (`Enquiry.html`)** — storyline: volunteering for, or sponsoring, a food-parcel or water programme.

* Controls: name, email, phone, enquiry type, programme (options depend on the type), organisation (sponsors), quantity, sponsorship period, availability checkboxes (volunteers), start date, comments, consent checkbox and a honeypot.
* Validation: names (letters only, 2–60 characters), email format, South African phone numbers (`0xx xxx xxxx` or `+27 xx xxx xxxx`), whole-number quantity 1–500, date not in the past and within two years, at least one availability option for volunteers, 500-character comment limit, required consent.
* Processing and response (via **AJAX** — `fetch()` loads `data/pricing.json` asynchronously, with no page reload): sponsors receive an itemised **cost estimate** (rate × quantity × months, with a 5% discount for 6+ months and 10% for 12 months) and volunteers receive their **orientation session** and availability. The cost and place figures are illustrative values for this assignment.
* Arriving from a programme card on the Services page pre-selects that programme.

**Contact form (`Contact.html`)** — storyline: a general message to the organisation.

* Controls: name, email, optional phone, message type (dropdown), subject, message (10–1000 characters with live counter) and a honeypot.
* Processing: once validated, the details are **compiled into an email** (recipient `info@communityfoodbanks.org`, stated in `forms.js` and in the form `action`). A preview of the To, Subject and Body is shown, and **Send email** opens it in the visitor's own email app through a `mailto:` link. **Copy message** and **Edit message** buttons are also provided.

## 8. Part 3 — Deployment and GitHub

* **Platform:** GitHub Pages (Settings → Pages → Deploy from branch → `main` → `/ (root)`). The site can also be deployed on Netlify by dragging the folder onto the dashboard.
* **After deploying,** replace `https://YOUR-USERNAME.github.io/community-food-banks/` with the real address in the canonical/Open Graph tags of each `.html` file, `sitemap.xml`, `robots.txt` and the JSON-LD block (use Find and Replace across the project).
* **Commits:** work was committed in small steps with descriptive messages (see the changelog for the matching list of changes).

## 9. Changelog

All changes are listed newest first.

### Part 3 — Functionality, SEO, Forms and Deployment (2026-10-31)

**Changes made in response to Part 2 feedback and review**

<!-- Lecturer comments: add a row below for each individual comment received on Part 2, using the same Date | Change | Reason format. -->

| Date | Change | Reason |
|---|---|---|
| 2026-10-31 | Added a skip-to-content link, visible `:focus-visible` outlines, `aria-label` on the navigation, `lang="en-ZA"` and `main` landmarks (`id="main-content"`) on every page. | Improve keyboard and screen-reader accessibility, which was not fully covered in Part 2. |
| 2026-10-31 | Replaced the Google Maps `<iframe>` on the Contact page with an interactive Leaflet map. | The brief requires an interactive, location-based feature; an embedded iframe could not be customised and gave no interactivity. |
| 2026-10-31 | Renamed all images from `Image1.jpg`–`Image11.jpg`/`Logo.jpg` to descriptive names (original and `images-responsive/` copies) and updated every `src`/`srcset`. Rewrote alt text to describe each photo. | Descriptive file names and alt text help SEO and accessibility; generic names gave search engines no context. |
| 2026-10-31 | Added `width` and `height` attributes to all images, `loading="lazy"` below the fold and `fetchpriority="high"` on the hero image. | Prevent layout shift while images load and reduce initial page weight. |
| 2026-10-31 | Gave every page a unique, descriptive `<title>` (previously "Home page \| …", "About page \| …"), meta description, meta keywords and canonical link. | Part 2 titles were generic labels; unique, keyword-rich titles are better for SEO. |
| 2026-10-31 | Corrected the contact details to use real links (`mailto:` and `tel:`) and moved the footer to include navigation and contact links on every page. | Make contact details usable and add internal links. |
| 2026-10-31 | Re-encoded `CFB.mp4` (77 MB, 1080p) to `cfb-community-food-banks-video.mp4` (about 2 MB, 720p), added a poster frame and `preload="none"`. | The original file was too large for fast loading and close to GitHub's file-size limits. |
| 2026-10-31 | Completed the README: screenshot table kept for the testing evidence, references updated, changelog extended. | Keep documentation in step with the project. |

**New Part 3 work**

| Date | Change | Reason |
|---|---|---|
| 2026-10-31 | Created `js/main.js` with accordion, tabs, modal, scroll-reveal and counter animations, back-to-top button, lightbox and programme search. | Part 3 §2.1 interactive elements, animations and advanced DOM manipulation. |
| 2026-10-31 | Added the About-page FAQ accordion and Mission/Vision/Values tabs (the old separate Mission and Vision sections now sit inside the tabs). | Part 3 §2.1 accordions and tabs. |
| 2026-10-31 | Added the "Get involved" modal and "Our Impact in Numbers" animated counters on the Home page. | Part 3 §2.1 modals and animation. |
| 2026-10-31 | Expanded the Gallery to nine photos with captions and a keyboard-, touch- and screen-reader-friendly lightbox. | Part 3 §2.1 gallery with lightbox. |
| 2026-10-31 | Created `js/map.js` and the Leaflet map (marker, pop-up, layers, scale, locate, reset, directions) on the Contact page. | Part 3 §2.1 interactive maps. |
| 2026-10-31 | Added `data/programmes.json` (mirrored in `js/data.js`) and a "Programmes and Ways to Help" section on the Services page with live search, type filter and sorting. | Part 3 §2.2 dynamic content and search. |
| 2026-10-31 | Created the new `Enquiry.html` page (and added it to the navigation, sitemap and footer) with a conditional form for volunteers and sponsors. | Part 3 §4.1: `enquiry.html` form was missing from the site. |
| 2026-10-31 | Created `js/forms.js` with client-side validation, inline error messages, live character counters and a honeypot field for both forms. | Part 3 §4 form validation and error handling. |
| 2026-10-31 | Enquiry form processing: asynchronous `fetch()` of `data/pricing.json`, then an itemised cost estimate (sponsors) or orientation session (volunteers). | Part 3 §4.1 enquiry response and AJAX submission. |
| 2026-10-31 | Contact form processing: validated details are compiled into an email preview with a `mailto:` Send button to `info@communityfoodbanks.org`, plus copy and edit buttons. | Part 3 §4.1 contact form must produce an email to the stated recipient. |
| 2026-10-31 | Added `robots.txt`, `sitemap.xml`, `404.html`, favicon, Open Graph/Twitter tags and JSON-LD (`NGO`) structured data. | Part 3 §3 SEO: robots.txt, sitemap, local SEO and social media. |
| 2026-10-31 | Added a Content-Security-Policy on every page, Subresource Integrity on Leaflet, `rel="noopener noreferrer"` on external links and a `_headers` file with security and caching headers. | Part 3 §3.3 security and page speed. |
| 2026-10-31 | Appended Part 3 styles to `style.css` (buttons, cards, accordion, tabs, modal, lightbox, forms, map, reduced-motion support) with extra responsive rules. | Style the new components consistently across breakpoints. |
| 2026-10-31 | Updated the README with Part 3 documentation, changelog and references. | Part 3 §5 README requirement. |

### Part 2 — CSS Styling & Responsive Design (2026-09-18)

| Date | Change | Reason |
|---|---|---|
| 2026-09-18 | Created `style.css` and linked it from every page. | Fulfil Part 2 requirement for an external stylesheet shared across the site. |
| 2026-09-18 | Added a CSS reset and root colour/typography/spacing variables. | Ensure consistent rendering across browsers and give the whole site one source of truth for its design tokens. |
| 2026-09-18 | Replaced all inline `style="..."` attributes on `<body>`, `<img>` and `<video>` with CSS classes (`page-home`, `.hero`, `.gallery-grid`, etc.). | Separate content (HTML) from presentation (CSS), as required by the brief, and make the styling reusable and maintainable. |
| 2026-09-18 | Restructured the navigation bar into `.site-header` / `.site-nav` using Flexbox, and added the organisation logo and an `aria-current="page"` indicator for the active page. | Create a clear, reusable desktop layout and improve usability/accessibility. |
| 2026-09-18 | Rebuilt the page content areas using CSS Grid (`main`, `.hero`, `.gallery-grid`) instead of relying on the browser's default block flow. | Produce an organised, easy-to-navigate desktop layout as required by the learning outcomes. |
| 2026-09-18 | Added `:hover`, `:focus` and `:active` pseudo-class styling to navigation links and gallery images. | Create interactive elements and give users visual feedback. |
| 2026-09-18 | Added two media queries (768px and 480px breakpoints) that adjust the navigation, hero layout, grid column counts, image heights and font sizes. | Implement responsive styling for tablet and mobile devices. |
| 2026-09-18 | Converted font sizes and spacing to `rem`/`em` custom properties and grid tracks to `fr`/`%`/`minmax()` units. | Use relative units so the design scales smoothly instead of breaking at fixed pixel widths. |
| 2026-09-18 | Generated 480w/900w versions of every content photograph (`images-responsive/`) and added `srcset`/`sizes` attributes to each `<img>`. | Apply responsive image techniques so smaller screens are not forced to download full-size desktop images. |
| 2026-09-18 | Fixed broken internal navigation links (lowercase `home.html`, `about.html`, etc. were pointing to files actually saved as `Home.html`, `About.html`, …). | Case-sensitive hosting (e.g. GitHub Pages on Linux) would 404 on these links; corrected them to match the real, capitalised filenames on every page. |
| 2026-09-18 | Added `<meta charset="UTF-8">` and `<meta name="viewport" content="width=device-width, initial-scale=1.0">` to the `<head>` of every page. | Required for correct character rendering and for responsive/media-query behaviour on mobile browsers. |
| 2026-09-18 | Added an `iframe` `title` attribute on the Contact page map and descriptive `alt` text on every image. | Basic accessibility improvements identified while reworking the markup. |

---

### Part 1 — Baseline (for reference)

| Date | Change |
|---|---|
| 2026-08-14 | Initial commit: Home, About, Services, Gallery and Contact pages created with semantic HTML, inline styling, images and embedded video/map. |

## 10. References

Harvard-style reference list:

Agafonkin, V. 2026. *Leaflet — an open-source JavaScript library for interactive maps*. [Online]. Available at: https://leafletjs.com/ [Accessed 31 October 2026].

Google. 2026. *Search Central: SEO Starter Guide*. [Online]. Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide [Accessed 31 October 2026].

Google. 2026. *Search Central: Build and submit a sitemap*. [Online]. Available at: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap [Accessed 31 October 2026].

Google. 2026. *Search Central: Introduction to robots.txt*. [Online]. Available at: https://developers.google.com/search/docs/crawling-indexing/robots/intro [Accessed 31 October 2026].

Google. 2026. *Search Central: Intro to structured data markup*. [Online]. Available at: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data [Accessed 31 October 2026].

Mozilla Developer Network. 2026. *The dialog element*. [Online]. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog [Accessed 31 October 2026].

Mozilla Developer Network. 2026. *Using the Fetch API*. [Online]. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch [Accessed 31 October 2026].

Mozilla Developer Network. 2026. *Client-side form validation*. [Online]. Available at: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation [Accessed 31 October 2026].

Mozilla Developer Network. 2026. *Intersection Observer API*. [Online]. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API [Accessed 31 October 2026].

Mozilla Developer Network. 2026. *Content Security Policy (CSP)*. [Online]. Available at: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP [Accessed 31 October 2026].

Mozilla Developer Network. 2026. *Subresource Integrity*. [Online]. Available at: https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity [Accessed 31 October 2026].

OpenStreetMap Foundation. 2026. *OpenStreetMap*. [Online]. Available at: https://www.openstreetmap.org/ [Accessed 31 October 2026].

W3C Web Accessibility Initiative. 2026. *ARIA Authoring Practices Guide: Accordion and Tabs patterns*. [Online]. Available at: https://www.w3.org/WAI/ARIA/apg/patterns/ [Accessed 31 October 2026].

GitHub. 2026. *GitHub Pages documentation*. [Online]. Available at: https://docs.github.com/en/pages [Accessed 31 October 2026].

Schema.org. 2026. *NGO*. [Online]. Available at: https://schema.org/NGO [Accessed 31 October 2026].

Mozilla Developer Network. 2026. *CSS: Cascading Style Sheets*. [Online]. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS [Accessed 18 September 2026].

Mozilla Developer Network. 2026. *Responsive images*. [Online]. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images [Accessed 18 September 2026].

Mozilla Developer Network. 2026. *CSS Grid Layout*. [Online]. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout [Accessed 18 September 2026].

Mozilla Developer Network. 2026. *CSS Flexible Box Layout*. [Online]. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout [Accessed 18 September 2026].

W3Schools. 2026. *CSS Media Queries*. [Online]. Available at: https://www.w3schools.com/css/css_rwd_mediaqueries.asp [Accessed 18 September 2026].

Google Developers. 2026. *Responsive Web Design Basics*. [Online]. Available at: https://web.dev/learn/design/ [Accessed 18 September 2026].
