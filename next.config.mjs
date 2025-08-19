// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'res.cloudinary.com',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'www.optimumnutrition.com',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'images.unsplash.com',
//         pathname: '/**',
//       },
//     ],
//   },
// };

// export default nextConfig;


/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    // This allows any hostname for image loading.
    // Use with caution, as it is a security risk.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;