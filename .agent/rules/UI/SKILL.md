---
name: ui
description: When asked to create or modify a UI for a website.
---

# Instructions
1. follow the pattern of the existing files.
2. when creating or modifying a UI, follow the color pattern of the app.
3. Make it responsive, acessible, performant and mobile-first always.
4. use the best practices of UI/UX design.
5. Use the same tipology of the existing files.
6. Use the same components of the existing files.

## Examples

### 1. Hero Section (Mobile-First, Performant, Themed)
```tsx
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          
          {/* Content - Mobile Order 2, Desktop Order 1 */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-slate-900">
                Accounting Made <span className="text-emerald-600">Simple</span>
              </h1>
              <p className="max-w-[600px] text-slate-500 md:text-xl dark:text-slate-400">
                Expert tax handling for freelancers in Portugal. We handle IRS, VAT, and Social Security so you can focus on growing your business.
              </p>
            </div>
            
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-700 disabled:pointer-events-none disabled:opacity-50"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-8 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
              >
                View Pricing
              </Link>
            </div>

            <ul className="grid gap-2 py-4">
              {['Certified Accountants', 'Digital-First Process', 'Audit Protection'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Image/Visual - Mobile Order 1, Desktop Order 2 */}
          {/* Use CSS aspect-ratio to prevent layout shift */}
          <div className="mx-auto w-full max-w-[500px] lg:max-w-none aspect-video bg-slate-100 rounded-xl overflow-hidden shadow-xl border border-slate-200 order-first lg:order-last">
             {/* Use next/image for automatic optimization */}
             {/* <Image src="/hero.webp" alt="Dashboard Preview" width={800} height={450} className="object-cover w-full h-full" priority /> */}
             <div className="w-full h-full flex items-center justify-center text-slate-400">
                Image Placeholder
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
```

### 2. Feature Card (Responsive Grid, Accessible)
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Euro } from 'lucide-react';

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <Card className="hover:shadow-lg transition-shadow border-slate-200 bg-white">
        <CardHeader className="space-y-1">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-2">
            <Euro className="h-6 w-6 text-emerald-600" />
          </div>
          <CardTitle className="text-xl text-slate-900">Tax Optimization</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 leading-relaxed">
            We analyze your expenses to maximize deductions and reduce your overall tax burden legally and safely.
          </p>
        </CardContent>
      </Card>
      {/* Repeat for other cards... */}
    </div>
  );
}
```

### Key Principles Applied:
- **Colors**: `slate-900` for headings, `slate-500/600` for body text, `emerald-600` for primary actions/accents.
- **Mobile-First**: Default classes target mobile (e.g., `flex-col`, `grid-cols-1`), overrides for larger screens (`md:flex-row`, `md:grid-cols-2`).
- **Performance**:
  - `priority` on above-the-fold images (commented out example).
  - Semantic tags (`section`, `h1`, `nav`).
  - Minimized layout shifts with `aspect-ratio` containers.
