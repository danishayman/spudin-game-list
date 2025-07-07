import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://spudin-game-list.vercel.app/'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/settings/',
        '/profile/*/private',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
