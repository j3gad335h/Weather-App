/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/gh-pages-test',
    experimental: {
        appDir: true,
    },
}

// next.config.js
module.exports = {
    ...nextConfig,
    images: {
        domains: ['openweathermap.org'],
    },
};

