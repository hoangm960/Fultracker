/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			container: {
				center: true
			},
			colors: {
				"dark-primary": "#00186E",
				"light-primary": "#1639B6",
				"dark-secondary": "#FFAD1D",
				"light-secondary": "#FFBD59",
				"dark-brown": "#B98F5E"
			},
			fontFamily: {
				"garamond-premier-pro": ["GaramondPremrPro", "san-serif"]
			}
		},
	},
	plugins: [],
}
