import { SitemapStream } from 'sitemap'; 
import fs from 'fs';
import { createWriteStream } from 'fs';

// Define a list of URLs to include in the sitemap
const urls = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.8 },
  { url: '/gallery', changefreq: 'weekly', priority: 0.9 },
  { url: '/dogs', changefreq: 'weekly', priority: 0.9 },
  { url: '/litters', changefreq: 'weekly', priority: 0.9 },


];

// Create a stream to generate the sitemap
const stream = new SitemapStream({ hostname: 'https://shirkus.no' });
const writeStream = createWriteStream('./public/sitemap.xml');


stream.pipe(writeStream);

// Add URLs to the stream
urls.forEach(url => {
  stream.write({
    url: url.url, 
    changefreq: url.changefreq, 
    priority: url.priority
  });
});

// End the stream after adding all URLs
stream.end();

// Handle stream events
writeStream.on('finish', () => {
  console.log('Sitemap generated and saved!');
});

writeStream.on('error', (error) => {
  console.error('Error generating sitemap:', error);
});
