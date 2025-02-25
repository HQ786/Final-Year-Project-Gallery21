// next.config.js
module.exports = {
    images: {
      domains: ['images.pexels.com'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'nextui.org',
          pathname: '/images/**',
        },
      ],
    },
    
  };
  