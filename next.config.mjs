/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
          ignoreBuildErrors: true,
    },
    eslint: {
          ignoreDuringBuilds: true,
    },
    experimental: {
          serverActions: { allowedOrigins: ['*'] },
    },
    images: {
          remotePatterns: [
            { protocol: 'https', hostname: '*.supabase.co' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
                ],
    },
    i18n: undefined,
}

export default nextConfig
