/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: { unoptimized: true },
    webpack: (config) => {
        config.resolve.alias.canvas = false;

        return config;
    },
    turbopack: {
        resolveAlias: {
            canvas: "./empty-module.js",
        },
    },
};

module.exports = nextConfig;
