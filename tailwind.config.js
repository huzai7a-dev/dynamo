/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],

	content: [
		"./components/**/*.{vue,js}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./app.vue",
		"./plugins/**/*.{js,ts}",
	],

	prefix: "",

	safelist: [
		"bg-primary",
		"text-primary",
		"bg-secondary",
		"text-secondary",
		"text-white",
		"bg-white",
		"text-black",
		"bg-black",
		"hidden",
		"block",
		"flex",
		"grid",
		"container",
		"mx-auto",
		"px-4",
		"py-16",
		"text-center",
		"font-bold",
		"text-4xl",
		"text-2xl",
		"text-xl",
		"text-lg",
		"text-base",
		"text-sm",
		"text-xs",
	],

	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				sm: "640px",
				md: "768px",
				lg: "1024px",
				xl: "1280px",
				"2xl": "1400px",
			},
		},

		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",

				primary: {
					DEFAULT: "#0D6C73",
					foreground: "hsl(var(--primary-foreground))",
				},

				secondary: {
					DEFAULT: "#003438",
					foreground: "hsl(var(--secondary-foreground))",
				},

				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},

				muted: {
					DEFAULT: "#669699",
					foreground: "hsl(var(--muted-foreground))",
				},

				accent: {
					DEFAULT: "#299BA3",
					foreground: "hsl(var(--accent-foreground))",
				},

				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},

				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},

				charcoal: "#374151",
				"light-gray": "#FAFAFA",
				"primary-light": "#299BA3",
				"primary-dark": "#003438",
				"solid-light": "#F1F3F4",
				"brand-green": "#16A249",
				"brand-yellow": "#FACC14",
				"brand-orange": "#FB923C",

				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
			},

			borderRadius: {
				lg: "8px",
				md: "6px",
				sm: "4px",
				icon: "16px",
				badge: "21px",
			},

			fontFamily: {
				sans: ["Manrope", "Inter", "sans-serif"],
				serif: ["Playfair Display", "serif"],
				display: ["Poppins", "sans-serif"],
			},

			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in": {
					"0%": {
						opacity: "0",
						transform: "translateY(20px)",
					},
					"100%": {
						opacity: "1",
						transform: "translateY(0)",
					},
				},
				float: {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-10px)" },
				},
			},

			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.8s ease-out forwards",
				float: "float 6s ease-in-out infinite",
			},

			backgroundImage: {
				"contact-banner": "url('/images/contact-banner.jpeg')",
				"teal-gradient":
					"linear-gradient(to right, #003438, #0D6C73, #299BA3)",
				"teal-white": "linear-gradient(to right, #0D6C73, #ffffff)",
				"gradient-card-dark":
					"linear-gradient(to bottom right, #003438, #0D6C73)",
				"gradient-card-teal":
					"linear-gradient(to bottom right, #0D6C73, #299BA3)",
				"gradient-card-green":
					"linear-gradient(to bottom right, #299BA3, #16A249)",
				"gradient-card-orange":
					"linear-gradient(to bottom right, #FACC14, #FB923C)",
			},
		},
	},

	plugins: [require("tailwindcss-animate")],
};