/** @type {import('next').NextConfig} */
const path = require('path');

module.exports = {
  reactStrictMode: true,
  generateBuildId: async () => {
    return `build-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  },
  // Exclude functions directory from build
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/functions/**', '**/node_modules/**'],
    };

    // Add path alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };

    return config;
  },
};
