# Assignment Scoring Report
**Assignment:** Web Dev UI Assignment — Mangalam HDPE Pipes Product Page
**Evaluated against:** `Wed Dev Assignment.pdf`
**Date:** 2026-03-06

---

## Overall Score: 92 / 100

---

## Breakdown by Evaluation Criteria

### 1. Accuracy in Following Figma Design Specifications — 22 / 25

**What was required:** Pixel-perfect implementation matching the Figma design, covering all sections of the product page.

**What was delivered:**
- ✅ Sticky header with logo (red italic "Mangalam" + blue "HDPE PIPES"), desktop nav links, and "Contact Us" CTA button
- ✅ Hero section: product headline, cert badges (BIS/ISO/CE), feature bullet list, price range block (₹4,80,000–7,90,000), CTA buttons, product image carousel with thumbnails
- ✅ "Trusted by" brand logo strip (Euroflex × 5)
- ✅ Dark navy "Technical Specifications at a Glance" table with alternating row colors
- ✅ "Built to Last. Engineered to Perform." four-feature grid
- ✅ FAQ accordion section with orange "Frequently" highlight
- ✅ "Versatile Applications Across Industries" carousel
- ✅ "Advanced HDPE Pipe Manufacturing Process" tab section
- ✅ "Trusted Performance. Proven Results" testimonials
- ✅ "Complete Piping Solutions Portfolio" three-card grid
- ✅ "Resources & Downloads" section with PDF download links
- ✅ "Ready to Transform Your Textile Manufacturing?" CTA banner with contact form
- ✅ Multi-column footer with logo, nav categories, and social icons

**Minor deductions:**
- The hero product images rely on Unsplash URLs rather than supplied assets — colors/compositions are close but not pixel-perfect to Figma imagery (-2 pts)
- Some testimonial copy appears repeated/placeholder rather than matching Figma exactly (-1 pt)

---

### 2. Quality and Organization of HTML, CSS, and JavaScript Code — 19 / 20

**HTML (`index.html`)**
- ✅ Semantic elements throughout: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<figure>`
- ✅ Accessibility: skip-to-main link, ARIA labels (`aria-label`, `aria-haspopup`, `aria-expanded`, `aria-hidden`, `aria-selected`), `role` attributes on dialogs
- ✅ SEO meta description
- ✅ `<meta name="viewport">` for responsiveness
- ✅ Font preconnect for performance

**CSS (`styles.css`)**
- ✅ Fully organized into 21 labeled sections with a table-of-contents comment block at the top
- ✅ CSS custom properties (design tokens) for all colors, font sizes, spacing, radii, shadows, and transitions
- ✅ Modern practices: `clamp()`, Flexbox, CSS Grid, `margin-inline`, logical properties
- ✅ No magic numbers — all values reference tokens

**JavaScript (`script.js`)**
- ✅ Wrapped in a strict-mode IIFE to avoid global scope pollution
- ✅ Utility functions (`throttle`, `clamp`) defined once and reused
- ✅ 10 clearly labeled, numbered feature modules
- ✅ Passive event listeners for scroll/touch performance
- ✅ `requestAnimationFrame` used correctly for CSS transitions

**Minor deduction:**
- Section 10 in the JS comment header is labeled "Form Handling" but is coded as section 11 — small numbering inconsistency (-1 pt)

---

### 3. Smooth Implementation of the Sticky Header Functionality — 13 / 15

**What was required:** Sticky header, appears when scrolling beyond first fold, positioned above nav, disappears when scrolling back up, smooth transitions.

**What was delivered:**
- ✅ `position: sticky; top: 0` keeps the header locked to the viewport
- ✅ Hide on scroll-down / show on scroll-up via `translateY(-100%)` on `.is-hidden`
- ✅ Smooth CSS transition: `transform 0.35s ease`
- ✅ Scroll shadow added/removed via `.is-scrolled` class
- ✅ Hide logic only activates after 80px scroll (prevents flicker at the top)
- ✅ Throttled at 80ms for performance

**Minor deductions:**
- The spec states the header should "appear when scrolling beyond the first fold," which reads as the header being hidden initially and only becoming visible once the user passes the hero. The current implementation shows the header from page load (always sticky from top). It does disappear on scroll-down, but the initial reveal-after-fold behavior is not matched (-2 pts)

---

### 4. Proper Execution of the Image Carousel with Zoom Feature — 19 / 20

**What was required:** Interactive image carousel, zoomed preview on hover, matching Figma specs, smooth hover effects.

**What was delivered:**
- ✅ Sliding gallery track with `translateX` transitions
- ✅ Previous/next arrow buttons with disabled states at boundaries
- ✅ Clickable thumbnail strip with active state highlight
- ✅ Keyboard navigation (`ArrowLeft` / `ArrowRight`)
- ✅ Touch/swipe support (50px threshold)
- ✅ Resize handler re-calculates slide offsets
- ✅ **Zoom lens:** `120×100px` rectangular indicator box tracks cursor position on the image
- ✅ **Zoom result panel:** appears to the right of the gallery, shows 2.5× magnified region
- ✅ Zoom only activates on `pointer: fine` devices (mouse), correctly disabled on touch
- ✅ `mousemove` throttled to 16ms (≈60fps)
- ✅ Smooth fade-in/out via CSS opacity transition

**Minor deduction:**
- The zoom result panel appears to the side; if the Figma specifies an overlay-on-top style zoom, this is a deviation. From the provided screenshots, the side-panel style looks correct (-1 pt)

---

### 5. Responsive Design Implementation — 14 / 15

**What was required:** Fully responsive across desktop, tablet, and mobile.

**What was delivered:**
- ✅ 6 breakpoints defined and documented: 1440px, 1280px, 1024px, 768px, 480px, 375px
- ✅ Desktop hamburger hidden, mobile hamburger shown at ≤768px
- ✅ Mobile full-screen overlay navigation with scroll lock
- ✅ Hero switches from two-column to stacked layout on mobile
- ✅ Specs table scrolls horizontally on small screens
- ✅ Applications carousel shows 4 / 3 / 2 / 1 items based on viewport
- ✅ Grid layouts collapse gracefully to single columns
- ✅ `clamp()` used for fluid padding and font scaling

**Minor deduction:**
- The zoom feature has no tablet-specific fallback — between desktop (fine pointer) and touch, there is a gap for stylus/hybrid devices (-1 pt)

---

### 6. Code Readability and Best Practices — 5 / 5

- ✅ Every CSS section has a descriptive block comment
- ✅ Every JS module has a multi-line comment explaining purpose
- ✅ Variable names are descriptive (`touchStartX`, `appsMaxIndex`, `headerVisible`)
- ✅ Focus trap implemented in all modal dialogs
- ✅ Escape key closes modals
- ✅ Form validation with inline error messages and loading states
- ✅ Focus is returned to the triggering element when modals close
- ✅ `aria-expanded` kept in sync with open/close state across accordion, nav, and modals

---

## Notable Extras (Beyond Requirements)

The following were implemented above and beyond the stated requirements, demonstrating initiative:

| Extra Feature | Details |
|---|---|
| Modal dialogs | Quote modal + Download modal, both with focus trap |
| Form validation | Required fields, email format check, inline error messages, loading spinner, success state |
| Manufacturing process tabs | Tabbed UI with 7 process steps |
| Applications carousel auto-play | Advances every 4s, pauses on hover |
| Testimonials section | Horizontal scroll/card layout |
| Skip-to-main link | Accessibility best practice |
| Smooth scroll with header offset | Anchor links scroll with sticky header compensation |

---

## Summary

| Criterion | Score | Max |
|---|---|---|
| Design accuracy (Figma fidelity) | 22 | 25 |
| Code quality & organization | 19 | 20 |
| Sticky header | 13 | 15 |
| Image carousel with zoom | 19 | 20 |
| Responsive design | 14 | 15 |
| Code readability & best practices | 5 | 5 |
| **Total** | **92** | **100** |

**Grade: A (Excellent)**

The submission demonstrates a strong command of vanilla HTML, CSS, and JavaScript. The code is professional in organization, accessible, and performant. The main areas for improvement are the sticky header's initial-reveal behavior (should only appear after the fold) and ensuring hero images more precisely match the Figma source assets.
