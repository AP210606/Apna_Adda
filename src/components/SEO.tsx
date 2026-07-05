import React, { useEffect } from 'react';
import { Product } from '../types';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'product' | 'article';
  ogImage?: string;
  product?: Product;
  collectionName?: string;
  faqList?: Array<{ question: string; answer: string }>;
  isHome?: boolean;
}

export default function SEO({
  title,
  description = 'Discover Apna Adda, a premium lifestyle and design dropshipping store curated with modern workspace products, accessories, and home objects.',
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200',
  product,
  collectionName,
  faqList,
  isHome = false,
}: SEOProps) {
  const finalTitle = title ? `${title} | Apna Adda` : 'Apna Adda | Premium Minimalist Design & Workspace Essentials';
  const siteUrl = 'https://adda.co';
  const finalCanonical = canonicalUrl || `${siteUrl}${window.location.search || ''}`;

  useEffect(() => {
    // 1. Update basic page metadata
    document.title = finalTitle;

    const metaTags = {
      description: description,
      'og:title': finalTitle,
      'og:description': description,
      'og:type': ogType,
      'og:url': finalCanonical,
      'og:image': ogImage,
      'og:site_name': 'Apna Adda',
      'twitter:card': 'summary_large_image',
      'twitter:title': finalTitle,
      'twitter:description': description,
      'twitter:image': ogImage,
    };

    // Helper to get or create a meta tag
    const setMetaTag = (nameOrProperty: string, value: string) => {
      const isOG = nameOrProperty.startsWith('og:') || nameOrProperty.startsWith('twitter:');
      const attrName = isOG ? 'property' : 'name';
      let element = document.querySelector(`meta[${attrName}="${nameOrProperty}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, nameOrProperty);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    Object.entries(metaTags).forEach(([key, val]) => {
      setMetaTag(key, val);
    });

    // 2. Set canonical URL link tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', finalCanonical);

    // 3. Inject JSON-LD Schema
    const schemas: any[] = [];

    // A. Always add Organization schema on Home or fallback
    if (isHome) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        'name': 'Apna Adda',
        'url': siteUrl,
        'logo': ogImage,
        'description': 'Premium modern design objects and workspace accessories across India.',
        'sameAs': [
          'https://instagram.com/apnaadda_official',
          'https://twitter.com/apnaadda',
          'https://pinterest.com/apnaadda'
        ],
        'contactPoint': {
          '@type': 'ContactPoint',
          'telephone': '+91-99999-88888',
          'contactType': 'customer service',
          'areaServed': 'IN',
          'availableLanguage': ['en', 'hi']
        }
      });

      // B. Add SearchAction Schema (WebSite)
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        'url': siteUrl,
        'name': 'Apna Adda',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': `${siteUrl}/?view=shop&q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      });
    }

    // C. Breadcrumb Schema
    const breadcrumbList: any[] = [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': siteUrl
      }
    ];

    if (collectionName) {
      breadcrumbList.push({
        '@type': 'ListItem',
        'position': 2,
        'name': collectionName,
        'item': `${siteUrl}/?view=shop&collection=${collectionName.toLowerCase()}`
      });
    } else if (product) {
      breadcrumbList.push({
        '@type': 'ListItem',
        'position': 2,
        'name': 'Shop',
        'item': `${siteUrl}/?view=shop`
      });
      breadcrumbList.push({
        '@type': 'ListItem',
        'position': 3,
        'name': product.title,
        'item': `${siteUrl}/?view=product&handle=${product.handle}`
      });
    } else if (title) {
      breadcrumbList.push({
        '@type': 'ListItem',
        'position': 2,
        'name': title,
        'item': finalCanonical
      });
    }

    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbList
    });

    // D. Product Schema (Dynamically constructed)
    if (product) {
      const minPrice = parseFloat(product.priceRange.minVariantPrice) || 999;
      const maxPrice = parseFloat(product.priceRange.maxVariantPrice) || 29999;

      const productSchema: any = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': product.title,
        'image': product.images.map(img => img.url),
        'description': product.description,
        'sku': product.id,
        'brand': {
          '@type': 'Brand',
          'name': 'Apna Adda Design Labs'
        },
        'offers': {
          '@type': 'AggregateOffer',
          'url': finalCanonical,
          'priceCurrency': 'INR',
          'lowPrice': minPrice,
          'highPrice': maxPrice,
          'offerCount': product.variants.length || 1,
          'priceSpecification': {
            '@type': 'UnitPriceSpecification',
            'price': minPrice,
            'priceCurrency': 'INR',
            'valueAddedTaxIncluded': 'true'
          },
          'availability': product.availableForSale 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/OutOfStock'
        }
      };

      if (product.rating) {
        productSchema.aggregateRating = {
          '@type': 'AggregateRating',
          'ratingValue': product.rating,
          'reviewCount': product.reviewsCount || 5,
          'bestRating': '5',
          'worstRating': '1'
        };
      }

      if (product.reviews && product.reviews.length > 0) {
        productSchema.review = product.reviews.map(rev => ({
          '@type': 'Review',
          'author': {
            '@type': 'Person',
            'name': rev.author
          },
          'datePublished': rev.date || '2026-01-01',
          'reviewBody': rev.comment,
          'name': rev.title || 'Exquisite product quality',
          'reviewRating': {
            '@type': 'Rating',
            'ratingValue': rev.rating,
            'bestRating': '5',
            'worstRating': '1'
          }
        }));
      }

      schemas.push(productSchema);
    }

    // E. FAQ Schema
    if (faqList && faqList.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqList.map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        }))
      });
    }

    // Append JSON-LD script elements
    const scriptElements: HTMLScriptElement[] = [];
    schemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = `jsonld-schema-${index}`;
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
      scriptElements.push(script);
    });

    return () => {
      // Cleanup meta tags and scripts on unmount to keep DOM clean
      scriptElements.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, [finalTitle, description, ogType, ogImage, finalCanonical, product, collectionName, faqList, isHome]);

  return null;
}
