import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default <Partial<Config>>{
  content: ['./content/**/*.md'],
  plugins: [typography],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
