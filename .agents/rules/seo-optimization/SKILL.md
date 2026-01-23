---
name: seo-optimization
description: When asked to optimize a website for search engines.
---

## Instructions
1. Analyze the website's content and structure.
2. Optimize the website's content for search engines.
3. Optimize the website's structure for search engines.
4. Optimize the website's images for search engines.
5. Optimize the website's videos for search engines.
6. Optimize the website's audio for search engines.
7. Optimize the website's text for search engines.
8. Optimize the website's metadata for search engines.
9. Optimize the website's schema for search engines.
10. Optimize the website's performance for search engines.
11. Optimize the website's security for search engines.
12. Optimize the website's accessibility for search engines.
13. Optimize the website's mobile for search engines.
14. Optimize the website's desktop for search engines.
15. Optimize the website's speed for search engines.
16. Optimize the website's load time for search engines.
17. Optimize the website's user experience for search engines.
18. Optimize the website's user interface for search engines.

## Example

```tsx
import type { Metadata } from 'next'
import Image from 'next/image'

// 1. Optimized Metadata
export const metadata: Metadata = {
  title: 'Contabilipt | Accounting Services in Portugal',
  description: 'Expert accounting services for freelancers and businesses in Portugal. VAT, IRS, and IRC handling with certified accountants.',
  alternates: {
    canonical: 'https://contabilipt.xyz/services/accounting',
    languages: {
      'pt-PT': '/pt/servicos/contabilidade',
      'en-US': '/en/services/accounting',
    },
  },
  openGraph: {
    title: 'Contabilipt | Accounting Services in Portugal',
    description: 'Expert accounting services for freelancers and businesses in Portugal.',
    url: 'https://contabilipt.xyz',
    siteName: 'Contabilipt',
    images: [
      {
        url: 'https://contabilipt.xyz/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contabilipt Office Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function ServicePage() {
  // 9. Structured Data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    name: 'Contabilipt',
    image: 'https://contabilipt.xyz/logo.png',
    description: 'Expert accounting services for freelancers and businesses in Portugal.',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. da Liberdade 100',
      addressLocality: 'Lisboa',
      postalCode: '1250-144',
      addressCountry: 'PT'
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 3. Semantic HTML Structure */}
      <main className="container mx-auto px-4 py-8">
        
        {/* 2. Optimized Content (H1) */}
        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Comprehensive Accounting Services for Expats in Portugal
            </h1>
            <p className="text-xl text-slate-600">
              Navigate the Portuguese tax system with confidence.
            </p>
          </header>

          <section className="mb-12">
            <h2>Why Choose Contabilipt?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="mb-4">
                  We specialize in helping <strong className="font-semibold">freelancers</strong> and <strong className="font-semibold">digital nomads</strong> optimize their taxes.
                </p>
                {/* 18. UI/UX & 4. Image Optimization */}
                <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition">
                  Get a Free Quote
                </button>
              </div>
              <div className="relative h-64 w-full">
                <Image
                  src="/dashboard-preview.jpg"
                  fill
                  alt="Contabilipt Dashboard showing tax optimization graphs"
                  className="object-cover rounded-lg shadow-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </section>
        </article>
      </main>
    </>
  )
}
```
