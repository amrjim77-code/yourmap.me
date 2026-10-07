# Master Prompt: yourmap.me

**System Role:**  
You are an expert Principal Frontend Engineer specializing in Next.js (App Router), React, and Tailwind CSS. Build a single-page interactive web application called **"yourmap.me"**.

**Core Concept:**  
`yourmap.me` allows freelancers, agencies, and tech professionals to generate two distinct, shareable visual infographics:
1. **Client Map (World Reach):** An interactive world map highlighting countries they have worked with.
2. **Skill Map (Capability Matrix):** A structured visual infographic map clustering their custom and selected skills by domain (e.g., Engineering, Design, Strategy, Marketing).

Users can toggle between tabs, select/add data using an intuitive pill-tag interface, customize their brand theme, and export high-resolution PNGs tailored for LinkedIn and portfolio sites.

---

### Technical Stack
* **Framework:** Next.js (React) using the App Router.
* **Styling:** Tailwind CSS.
* **Icons:** `lucide-react`.
* **Map Engine:** `react-simple-maps` (using a standard TopoJSON world map).
* **Export Engine:** `html-to-image` and `file-saver`.

---

### UI & Functional Specifications

#### 1. Top Navigation & Global Settings
* **Header:** Logo (`yourmap.me`), user profile photo/logo uploader, user name input, and professional role input.
* **View Mode Switcher (Tab Buttons):**
  * `[ 🌍 Client Map ]`
  * `[ ⚡ Skill Map ]`
  * `[ 🔲 Combined Showcase ]` (Renders both side-by-side in one frame)
* **Color Palette Selector:** 5 preset accent color swatches (e.g., Electric Blue, Emerald Green, Indigo, Amber, Sunset Rose) that dynamically update the active highlight colors across both maps.

#### 2. Left Sidebar (Dynamic Controls based on Active Tab)
* **When "Client Map" is Active:**
  * Dynamic counter: `X/195 Countries Served`.
  * Search input to quickly filter countries.
  * Continents categorized list (Asia, Europe, Americas, Africa, Oceania).
  * Pill buttons for each country: click to toggle, turning from neutral gray to the chosen accent color.
* **When "Skill Map" is Active:**
  * Custom Skill Adder: An input field + "Add" button allowing users to type any skill and assign it to a category (or enter custom ones).
  * Pre-populated categorized skill pills (e.g., Frontend, Backend, UI/UX, Cloud, Marketing) that can be clicked on/off.
  * Dynamic counter: `X Skills Mapped`.

#### 3. Main Stage: The Exportable Canvas (`ref` target)
The Canvas is a framed infographic container with a soft background gradient, rounded border, and subtle shadow:
* **Canvas Header:** Profile image/logo, User's Name, Professional Title, and total metric counters (e.g., "12 Countries Reached" or "18 Core Competencies").
* **Canvas Body:**
  * **In Client Map View:** High-resolution SVG world map powered by `react-simple-maps`. Selected countries are highlighted in the chosen theme color; unselected countries remain a clean, subtle gray.
  * **In Skill Map View:** An infographic grid of categorized skill clusters. Each cluster has an icon, a category header, and styled skill chips arranged in an aesthetic visual layout.
  * **In Combined View:** A split-screen 16:9 infographic displaying the world map on the left and the skill ecosystem on the right.
* **Canvas Footer:** Micro-metrics (e.g., "Active across 3 continents", "Full-Stack Specialist") and a discrete watermark: `Generated with yourmap.me`.

#### 4. Export & Download Bar
* Buttons below the canvas: **"Download PNG"** and **"Download JPG"**.
* Captures the Canvas `div` via `html-to-image` at a 2x pixel ratio for crystal-clear social media quality.

---

### Step-by-Step Implementation Instructions
1. **State Setup:** Define state for `activeTab`, `userName`, `userTitle`, `avatarUrl`, `themeColor`, `selectedCountries` (string array), and `skills` (array of `{ name: string, category: string }`).
2. **Left Panel & Switching Logic:** Build the searchable pill selector that conditionally renders country lists or skill categories based on `activeTab`. Include custom skill entry.
3. **Map & Skill Renderers:**
   * Build the `ClientMapComponent` using `react-simple-maps`, syncing country clicks with sidebar state.
   * Build the `SkillMapComponent` using CSS grid/flexbox to lay out skills like an infographic node map.
4. **Canvas Component:** Assemble the exportable card containing the header, dynamic view, and branding watermark.
5. **Export Trigger:** Hook up `html-to-image` to generate and download the image file on button click.

Generate the complete, copy-pasteable Next.js code (`page.tsx` and accompanying components/data) implementing these requirements.