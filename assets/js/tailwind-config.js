tailwind.config = {
  theme: {
    extend: {
      colors: {
        border: 'hsl(34 20% 85%)',
        background: 'hsl(38 33% 96%)',
        foreground: 'hsl(25 30% 12%)',
        primary: { DEFAULT: 'hsl(30 65% 38%)', foreground: 'hsl(38 33% 96%)' },
        secondary: { DEFAULT: 'hsl(38 40% 90%)', foreground: 'hsl(25 30% 12%)' },
        muted: { DEFAULT: 'hsl(36 25% 92%)', foreground: 'hsl(25 10% 45%)' },
        accent: { DEFAULT: 'hsl(142 40% 35%)', foreground: 'hsl(38 33% 96%)' },
        card: { DEFAULT: 'hsl(36 30% 98%)', foreground: 'hsl(25 30% 12%)' },
        'warm-gold': 'hsl(40 75% 55%)',
        'warm-cream': 'hsl(40 50% 95%)',
        'earth-brown': 'hsl(25 45% 25%)',
      },
      fontFamily: {
        serif: ["'DM Serif Display'", 'serif'],
        sans: ["'Fira Sans'", 'sans-serif'],
      },
    }
  }
};
