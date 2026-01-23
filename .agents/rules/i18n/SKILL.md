---
name: i18n
description: How to handle i18n to translate the website.
---

# Instructions
1. Analyze the website's content and structure.
2. Translate the website's content into the target language.
3. When translate to any language, verify if the translation is correct and make sure it makes sense.
4. When translate to any language, make sure to translate to all languages available, in translation files.
5. When translate to any language, make sure to translate to all languages available, in metadata files.

# Example
```tsx
// pt.json
{
  "title": "Contabilipt | Contabilidade para Freelancers e Empresas em Portugal",
  "description": "Serviços de contabilidade para freelancers e empresas em Portugal. Trabalho com VAT, IRS e IRC para freelancers e empresas em Portugal.",
}

// en.json
{
  "title": "Contabilipt | Accounting Services for Freelancers and Businesses in Portugal",
  "description": "Accounting services for freelancers and businesses in Portugal. VAT, IRS and IRC handling with certified accountants.",
}

// es.json
{
  "title": "Contabilipt | Servicios de Contabilidad para Freelancers y Empresas en Portugal",
  "description": "Servicios de contabilidad para freelancers y empresas en Portugal. Trabajo con VAT, IRS y IRC para freelancers y empresas en Portugal.",
}

// fr.json
{
  "title": "Contabilipt | Services de Comptabilité pour Freelances et Entreprises en Portugal",
  "description": "Services de comptabilité pour freelances et entreprises en Portugal. Travaillons avec VAT, IRS et IRC pour freelances et entreprises en Portugal.",
}
```
