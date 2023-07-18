/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://103.107.183.242:3010/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
