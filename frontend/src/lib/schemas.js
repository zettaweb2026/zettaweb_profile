export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ZettaWeb",
  "url": "https://www.zetta-web.in/",
  "logo": "https://www.zetta-web.in/logo.png",
  "sameAs": [
    "https://www.facebook.com/zettaweb",
    "https://twitter.com/zettaweb",
    "https://www.linkedin.com/company/zettaweb"
  ]
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "ZettaWeb",
  "image": "https://www.zetta-web.in/logo.png",
  "url": "https://www.zetta-web.in/",
  "telephone": "+919674171451",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Tech Park",
    "addressLocality": "Kolkata",
    "addressRegion": "WB",
    "postalCode": "700001",
    "addressCountry": "IN"
  }
};

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Web Development & AI Solutions",
  "provider": {
    "@type": "LocalBusiness",
    "name": "ZettaWeb"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Global"
  }
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What services does ZettaWeb provide?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ZettaWeb provides web development, AI solutions, cloud technologies, and custom software development."
      }
    },
    {
      "@type": "Question",
      "name": "How do I get started with ZettaWeb?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can get started by contacting us through our website's contact form or by using the Book Now feature."
      }
    }
  ]
};

export const breadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});
