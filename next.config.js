/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        domains: [
            "oaidalleapiprodscus.blob.core.windows.net",
        ]
    }
}

module.exports = nextConfig
