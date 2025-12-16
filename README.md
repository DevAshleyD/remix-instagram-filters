# Photo Enhancer

40+ Instagram-style filters for photo enhancement. 100% browser-based processing with complete privacy.

**Live Demo:** https://photoenhancer.vercel.app

## Features

- **40+ Instagram-style filters** - Vintage, B&W, Warm, Cool, Vivid, Soft, Artistic, Google Style
- **Google Photos style transformation** - Replicate Google Photos "style photo" effects
- **Filter strength control** - Adjustable intensity from 0-100%
- **Real-time preview thumbnails** - See filter effects before applying
- **100% browser-based** - No server uploads, complete privacy
- **Responsive design** - Works on desktop and mobile

## Privacy

All image processing happens entirely in your browser:
- No images are uploaded to any server
- No data is collected or stored
- No database is used
- Complete privacy guaranteed

## Tech Stack

- **Framework:** Remix + Vite
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Image Processing:** Canvas API with custom pixel manipulation
- **Deployment:** Vercel

## Filter Categories

| Category | Filters |
|----------|---------|
| Google Style | Google Style, Google Pop, Google Vivid, Google Natural, Google HDR |
| Vintage | Clarendon, Gingham, Moon, Lark, Reyes, Juno, Slumber, Crema, Ludwig, Aden, Perpetua |
| B&W | Inkwell, Willow, Toaster |
| Warm | Nashville, Valencia, Sierra, Rise, Mayfair, Lo-Fi |
| Cool | Brooklyn, Hudson, Brannan, Amaro |
| Vivid | X-Pro II, Earlybird, Sutro, Hefe, Kelvin |
| Soft | 1977, Walden, Stinson, Vesper |
| Artistic | Dogpatch, Ginza, Maven, Skyline |

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

## License

MIT
