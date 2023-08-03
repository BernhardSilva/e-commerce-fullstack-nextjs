/** @type {import('next').NextConfig} */
const nextConfig = {
	i18n: {
		locales: ['en'],
		defaultLocale: 'en'
	},
	reactStrictMode: true,
	// compiler: {
	// 	removeConsole: process.env.NODE_ENV === 'production'
	// },
	async rewrites() {
		return [
			{
				source: '/app/api/:path*',
				destination: `${process.env.FRONTEND_STORE_URL}/:path*`
			}
		];
	},
	images: {
		domains: ['res.cloudinary.com']
	}
};

module.exports = nextConfig;
