/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			container: {
				center: true
			},
			colors: {
				"highlight": "#DFFCF6",
				"background": "#B7EBF3",
				"action": "#008CAF",
				"text": "#445953",
			},
			fontFamily: {
				"montserrat": ["Montserrat", "san-serif"]
			}
		},
	},
	plugins: [],
}
