# 07 – Landing Pages

> **Parent Doc:** [README.md](./README.md)
> **Source files:**
> - [`src/pages/Landing/LandingPage.tsx`](../src/pages/Landing/LandingPage.tsx)
> - [`src/pages/Landing/PortalLanding.tsx`](../src/pages/Landing/PortalLanding.tsx)
> - [`src/components/landing/`](../src/components/landing/)

---

## Two Landing Experiences

| Page | Route | Shown when |
|------|-------|-----------|
| `LandingPage` | `/` | Main portal (`?portal` not set, no subdomain) |
| `PortalLanding` | `/` | Any sub-portal (`?portal=student/university/recruiter`) |

---

## Main Landing Page — `LandingPage.tsx`

**File:** [`src/pages/Landing/LandingPage.tsx`](../src/pages/Landing/LandingPage.tsx)

A full marketing page composed by assembling all landing section components in order:

```tsx
export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <HowItWorks />
      <About />
      <Statistics />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
```

All section components live in `src/components/landing/`. Each section is a self-contained TSX file with its own internal styles, animations, and data.

---

## Landing Section Components

### `Navbar.tsx`

Top navigation bar for the main landing page.
- **Logo** (left) linking to `#home`
- **Nav links** from `NAVIGATION` constant: Home, Problem, Solution, How It Works
- **CTA buttons**: "Login" → `/login`, "Get Started" → `/signup`
- Mobile responsive with a hamburger menu

### `Hero.tsx`

The above-the-fold hero section.
- Headline, sub-headline, and two CTA buttons
- Background: animated gradient / mesh
- Animated entrance using Framer Motion or GSAP

### `Problem.tsx`

Explains the pain points of traditional internship management:
- Paper-heavy logbooks
- Lack of visibility for universities
- No structured matching between students and companies

Uses icon + text cards laid out in a grid.

### `Solution.tsx`

Positions SBridge as the solution to the problems described above.
- Side-by-side layout (before/after or problem → solution columns)
- Uses `useScrollAnimation` hook for scroll-triggered fade-in

### `Features.tsx`

Feature grid showcasing the platform's capabilities:
- Feature cards with icon, title, and description
- Likely uses `Card` and `SectionTitle` common components
- Data array defined locally within the component

### `HowItWorks.tsx`

Step-by-step explainer of the platform workflow.
- Numbered steps or timeline layout
- Three role paths: Student → University → Company

### `About.tsx`

Mission statement and team/company background section.
- Text + decorative imagery or illustration

### `Statistics.tsx`

Impact metrics / social proof numbers:
- Animated counting numbers
- E.g. "500+ Students", "100+ Companies", "50+ Universities"

### `Testimonials.tsx`

Quotes or reviews from users.
- Card-based testimonial layout
- Avatar + name + role + quote
- Largest component by file size (~8KB)

### `FAQ.tsx`

Accordion-style frequently asked questions.
- Expandable question/answer pairs
- Smooth height animation on toggle

### `CTA.tsx`

Final call-to-action section before the footer.
- Bold headline + two buttons (Sign Up + Learn More)
- High-contrast background to draw attention

### `Footer.tsx`

Site footer with:
- Logo + tagline
- Link columns (Product, Company, Legal)
- Social media icons
- Copyright line

---

## Navigation Anchor Links

Defined in `src/constants/navigation.ts`:

```ts
export const NAVIGATION = [
  { name: "Home",        href: "#home" },
  { name: "Problem",     href: "#problem" },
  { name: "Solution",    href: "#solution" },
  { name: "How It Works", href: "#how-it-works" },
];
```

Smooth-scroll between sections is handled by **Lenis** (configured in `main.tsx`) rather than native CSS `scroll-behavior`.

---

## Portal Landing Page — `PortalLanding.tsx`

**File:** [`src/pages/Landing/PortalLanding.tsx`](../src/pages/Landing/PortalLanding.tsx)

Shown at `/` when a sub-portal is active. A focused, conversion-optimised page for a specific user type.

### Props

```ts
interface PortalLandingProps {
  portal?: "student" | "university" | "recruiter";
}
```

### Layout Structure

```
┌──────────────────────────────────────────────┐
│  Logo                               [Sign In] │
├──────────────────────────────────────────────┤
│                                              │
│   Role badge (e.g. "Student Portal")         │
│   Icon (GraduationCap / Building2 / Briefcase)│
│                                              │
│   Headline                                   │
│   Sub-heading                                │
│                                              │
│   ✓ Perk 1                                  │
│   ✓ Perk 2                                  │
│   ✓ Perk 3                                  │
│   ✓ Perk 4                                  │
│                                              │
│   [Sign In ▸]    [Create Account ▸]         │
│                                              │
└──────────────────────────────────────────────┘
```

### Per-Portal Config

| Attribute | Student | University | Recruiter |
|-----------|---------|------------|-----------|
| Icon | `GraduationCap` | `Building2` | `Briefcase` |
| Gradient | `from-blue-600 to-indigo-600` | `from-purple-600 to-violet-600` | `from-emerald-600 to-teal-600` |
| Headline | "Your internship journey starts here." | "Full visibility. Zero admin chaos." | *(recruiter-specific)* |

### Animation

GSAP is used for the entrance animation. On mount:
- Icon card fades and slides up from `y: 40` → `y: 0`
- Content block fades in with a slight delay
- Triggered via `useEffect` with a `gsap.context()` for cleanup
