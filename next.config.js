/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['storage.googleapis.com', 'firebasestorage.googleapis.com', 'upload.wikimedia.org', 'las-bolsitas-de-mariaje.appspot.com'],
    },
};

module.exports = nextConfig;
