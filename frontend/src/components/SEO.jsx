import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  url, 
  image, 
  schema, 
  type = 'website' 
}) => {
  const siteName = "ZettaWeb";
  const defaultImage = "https://www.zetta-web.in/logo.png";
  
  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title ? `${title} | ${siteName}` : `${siteName} | AI Solutions, Web Development & Cloud Services`}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title || siteName} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title || siteName} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />
      
      {/* Bing Webmaster */}
      <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE_HERE" />

      {/* Structured Data / JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
