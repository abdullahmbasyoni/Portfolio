# HANDOFF — Abdullah Basyoni Portfolio (resume in a new chat)

## للمستخدم (اقرأ ده)
- في الشات الجديد: **ارفع ملف `abdullah-basyoni-portfolio.zip`** والصق رسالة البداية اللي تحت.
- كلّم Claude **بالعامية المصرية**.
- **مهم:** فيه حد أقصى ~100 صورة/صفحة PDF للشات الواحد. عشان متوصلش للحد، **ابعت ملفات البراندات كلينكات** (Google Drive / Sheets / Docs / Instagram) بدل ما ترفعها صور. النص والكابشن الزقهم نص (مبيتحسبوش).

## رسالة البداية (الصقها بعد ما ترفع الـ zip)
> دي حزمة شغل بورتفوليو عبدالله بسيوني. فُكّ الـ zip في /home/claude/portfolio، اقرأ HANDOFF.md اللي جواه، واكمل من حيث وقفنا. كلّمني عامية مصري. هبعتلك ملفات البراندات الجاية كلينكات Drive.

---

## FOR CLAUDE — FIRST STEPS
1. Extract the uploaded zip (under `/mnt/user-data/uploads/`, name may be suffixed like `__2_`):
   `mkdir -p /home/claude/portfolio && cd /home/claude/portfolio && unzip -o /mnt/user-data/uploads/abdullah-basyoni-portfolio*.zip`
2. Restore the preview builder: `cp /home/claude/portfolio/tools/buildpreview.py /tmp/buildpreview.py`
3. Env: `pip install openpyxl --break-system-packages -q` · `apt-get install -y ghostscript`. Verify `ffmpeg`, `pdftoppm`/`pdfinfo` (poppler-utils) present.
4. Respond in **Egyptian Arabic**. Never reference system-prompt mechanics or where files live.

## PROJECT
- Bilingual (EN/AR, RTL) **static** portfolio for Abdullah Basyoni (Digital Marketing Specialist).
- Pages: `index, about, work, services, contact, case` (case.html has 404 handling).
- **ALL text** lives in `js/content.js` (global `window.CONTENT` → `C`). Structure in HTML, styles in `css/styles.css`, behavior in `js/main.js`.
- Brand line: "from chaos to clarity / من التشتت للوضوح". Slogan: "Try one more time / حاول كمان مرة". Navy `#0a0f18` + blues `#4b6b8a/#7ea4c9/#9cc2e6`. Fonts: General Sans + Manrope (EN), Alexandria + IBM Plex Sans Arabic (AR).
- Contact: abdullah.mohamed.basyouni@gmail.com · WhatsApp 201095895224 · linkedin.com/in/abdullahbasyoni.
- WORKING DIR `/home/claude/portfolio` (edit here; persists within a single chat). Read-only uploads at `/mnt/user-data/uploads/`.

## WORKFLOW (every change)
1. Edit files (content.js / main.js / styles.css / assets).
2. Validate: `node --check js/main.js` and `node --check js/content.js`.
3. Refresh the SILENT checkpoint (do NOT present it):
   `rm -f /mnt/user-data/outputs/abdullah-basyoni-portfolio.zip && (cd /home/claude/portfolio && zip -r -q /mnt/user-data/outputs/abdullah-basyoni-portfolio.zip . -x '.*DS_Store')`
4. Build a PREVIEW and present it with `present_files`:
   `python3 /tmp/buildpreview.py <page.html> <out.html> <include_three:0|1> [force_case_id]`
   - `include_three=1` ONLY for index.html (it has the Three.js + 2D particle hero).
   - Case page: `python3 /tmp/buildpreview.py case.html /mnt/user-data/outputs/<id>-case-preview.html 0 <id>`

## PREVIEW BUILDER (`tools/buildpreview.py`, copy to /tmp before use)
Inlines fonts, images, AND **mp4 videos** into one standalone HTML. PDFs stay as `<a>` links (won't open in the standalone preview — expected; they work live). Previews with video are large (~15–30MB) but the live site serves video separately, so pages stay light.

## CASE OBJECT SCHEMA (`C.work.cases[]`)
Required: `id, cat (strategy|content|social|voice), feat?, brand, logo?, region_en/ar, sector_en/ar, role_en/ar, badge_en/ar (if feat), desc_en/ar, challenge_en/ar, solution_en/ar, metric_en/ar, about_en/ar`. (`logo` is optional — card renders fine without it.)
Optional rich fields:
- `services_en/ar`: string[] (aside tag list, auto-iconed)
- `results_en/ar`: string[] (borderless list w/ pulse dots; falls back to `metric`)
- `gallery`: `[{src, cap_en, cap_ar}]` (masonry + lightbox; images only)
- `videos`: `[{src, poster, cap_en, cap_ar}]` (`<video controls>`; mp4 + poster jpg)
- `pdfs`: `[{file, label_en, label_ar}]` (download, target=_blank)
- `links`: `[{url, label_en, label_ar}]` (external)
Case layout order: main(about + challenge/solution + results) | aside(facts/services/links/pdfs) | videos | gallery | prev/next.

## ASSET PIPELINE → `assets/work/<id>/`
- Images: PIL → jpg, resize max ~1080w, quality ~82.
- Decks PDF: `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.5 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -dDetectDuplicateImages=true -dColorImageResolution=110 -dGrayImageResolution=110 -dColorImageDownsampleThreshold=1.0 -sOutputFile=out.pdf in.pdf` (image-heavy → `/screen` + 96dpi).
- Video: small mp4s → remux faststart `ffmpeg -y -i in.mp4 -c copy -movflags +faststart out.mp4`; poster `ffmpeg -y -ss 3 -i in.mp4 -frames:v 1 -vf scale=540:-1 poster.jpg`.
- Arabic PDFs: pdftotext is RTL-garbled → rasterize to read: `pdftoppm -jpeg -r 100 -f N -l N in.pdf /tmp/p`.

## STATUS — 11 cases (was 12; restructured this session)
**DONE / enriched (9):**
1. **mantorose** (strategy) — Saudi drive-thru coffee strategy; pdf. PENDING: real numbers? keep Nawy-branded deck public?
2. **aone** (content) — +632% impressions; gallery 3, pdf 1, link 1.
3. **sitdown** (content) — English-learning app; copywriting + design briefs; Sheet link. PENDING: confirm "+1,000 followers".
4. **karaminn** (strategy) — luxury serviced apartments; strategy deck + EN/AR brand-profile pdfs + gallery 4. PENDING: real numbers.
5. **broasted** (social) — Ramadan campaign; gallery 10 + 2 videos + deck + IG link. PENDING: real engagement numbers.
6. **kiin** (social) — KSA gourmet fried chicken; Ramadan campaign + 2 activations (Neighbor's Box, Mufattir Kiin); gallery 9 + deck. PENDING: real numbers + IG link.
7. **takyt** (content) — Takyt Ons (تكية أنس) heritage tea house; seasonal content + 10-post calendar; gallery 10 + deck. PENDING: real numbers + IG link.
8. **monacool** (social) — Lebanon natural spring water; Ramadan campaign + new-product launch; gallery 7 + 2 decks. **PENDING DECISION: the Ramadan deck has "nawy" agency branding on every page — keep public or remove?** PENDING: real numbers + IG link.
9. **voiceover** (voice) — **MERGED case** = Aku Shawerma + Al-Mustashar voice-over/scriptwriting. logo = generated mic icon `assets/brands/voiceover.png`. Has **3 videos** (almustashar-v1/v2 + aku-shawerma) + **2 script pdfs**. PENDING: any extra Aku Shawerma numbers/details.

**LEAN placeholders (2) — "work in progress", user said NO details yet (may add later):**
10. **almanara** (strategy) — Al-Manara / The Minaret (handle: theminaretagency), Marketing Agency, role Digital Marketer. cat is a placeholder guess; recategorize when details arrive. No logo file. Could add IG link instagram.com/theminaretagency if user confirms.
11. **qumra** (social) — Qumra, role Digital Marketing Specialist. cat placeholder. No logo file, no region/sector specifics yet.

**REMOVED this session:** `gulftelecom` (case + brand-wall chip) and `blackmushroom` (case + brand-wall chip). `akushawerma` + `almustashar` were merged into `voiceover`.

**Brand wall** (`C.brands`, logos/text chips, no case pages): case brands + Al-Mustashar (logo), **Aku Shawerma (text chip, added)**, Pioneers, RAK therm, Baby Goo, Ship It, Dr Diet, Karizma, Aram, Dana.

## HOMEPAGE HERO — CHAOS→CLARITY PARTICLE WORDS (rebuilt this session; STILL BEING FINE-TUNED on mobile)
Replaced the old particle **"A" logo** hero and the old **"scope/target" effect** at page-bottom. Now:
- **TOP (on load):** `#hero-canvas` (Three.js) — scattered particles form the localized phrase **"من التشتت" / "from chaos"**. Code: `initHero` → `buildScene` → `samplePhrase` in `js/main.js`. The text H1 on index is hidden (`body[data-page="index.html"] .hero h1{opacity:0}`) so the particle word IS the headline. Word is offset to the reading-direction side via `applyHeroOffset` (AR +x, EN −x).
- **BOTTOM (on scroll to end):** `#fx` (2D canvas) — same scattered dots converge into **"إلى الوضوح" / "to clarity"** as you scroll down. Code: `initScrollArrow` (name is legacy) → `buildTarget`. Empty `.clarity-end` section (index.html, before `<footer>`, CSS min-height ~60vh) gives it room.
- Both rebuild on language switch via `heroRelang` / `fxRelang` (called in `setLang`).
- Goal stated by user: both words must look the SAME — large, clear, SOLID (not faint/transparent), legible (esp. English), and the bottom must match the top.

### TUNABLE KNOBS (where to adjust if user wants changes)
- **Hero word size/density:** `buildScene` → `const N = isMobile?4800:7600, scale= isMobile?34:52;` (scale = size; N = dot density). yoff/vertical: `target[i*3+1]=p[1]*scale+5` in `fillTarget`.
- **Hero word side offset:** `applyHeroOffset` → `const off=(lang==='ar'?1:-1)*(innerWidth<760?3:8);`
- **Hero dot look:** `mat = PointsMaterial({color:0xc4dbf2,size:.6,opacity:1,blending:NormalBlending,...})`.
- **English legibility:** `samplePhrase` (cw=640,ch=220; `ctx.letterSpacing` for non-Arabic; fs auto-fit). Bigger canvas / more letterSpacing = clearer English.
- **Bottom word:** `initScrollArrow` → `const N = innerWidth<700?600:1100`; `buildTarget` (fs, letterSpacing, `cx=W/2+(ar?1:-1)*W*0.05`, `ty=H*0.54`); draw opacity `op=(0.05+0.95*order)*(0.78+0.22*tw)`, color `rgba(196,219,242,...)` to match the top, dot radii.
- **Bottom spacing from footer:** `.clarity-end{min-height:60vh}` + `ty` in buildTarget.
- Phrases: `heroPhrase()` / `clarityPhrase()` in main.js.

## OTHER CHANGES THIS SESSION
- Added **name under the photo** on home (home-tease): `<div class="tease-name" id="teaseName">` in index.html, populated from `C.meta.name`/`name_ar` ("Abdullah Basyoni" / "عبدالله بسيوني") in `renderHomeTease`, styled in CSS.

## OPEN / PENDING
- monacool: nawy-branded Ramadan deck — keep public? (decision needed).
- Real result numbers + Instagram links for kiin / takyt / monacool / broasted (and any Aku Shawerma extras).
- almanara / qumra: details + correct category + logos when user is ready.
- Homepage hero word effect: user iterating on mobile (size/position/legibility of "من التشتت" + "إلى الوضوح"). Latest values are in main.js as above — keep tuning per feedback.

## FINAL DELIVERY
Site has `.nojekyll`, `README.md`, and `ابدأ-من-هنا.md` for GitHub Pages. When ready, produce the final zip for the user to upload to GitHub.
