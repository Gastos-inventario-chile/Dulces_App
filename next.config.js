const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  outputFileTracingRoot: path.resolve(__dirname),
};

module.exports = nextConfig;
