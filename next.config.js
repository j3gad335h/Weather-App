/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/j3gad335h.github.io',
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

