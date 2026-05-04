/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  
  images: {
    unoptimized: true,
  },
  
  trailingSlash: true,
  
  // ✅ ADD THIS: Proxy API requests to avoid CORS and mixed content
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://206.189.133.225/api/:path*',
      },
    ];
  },
}

export default nextConfig