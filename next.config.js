/** @type {import('next').NextConfig} */
const nextConfig = {
	i18n: {
		locales: ['en'],
		defaultLocale: 'en'
	},
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production'
	},
	images: {
		domains: ['res.cloudinary.com']
	}
};

module.exports = nextConfig;
