import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'video.other' | 'article';
  videoUrl?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  canonical, 
  ogImage, 
  ogType = 'website',
  videoUrl
}) => {
  const siteName = "TubeSEO";
  const fullTitle = `${title} | ${siteName}`;
  const url = window.location.href;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical || url} />

      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": ogType === 'article' ? 'BlogPosting' : ogType === 'video.other' ? 'VideoObject' : 'WebSite',
          "name": fullTitle,
          "description": description,
          "url": url,
          ...(ogType === 'video.other' && videoUrl && {
            "embedUrl": videoUrl,
            "thumbnailUrl": ogImage
          })
        })}
      </script>
    </Helmet>
  );
};
