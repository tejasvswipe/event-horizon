# Cosmic Daily

<img width="959" height="505" alt="Cosmic Daily screenshot" src="https://github.com/user-attachments/assets/192c6603-0324-4d5e-9ced-282151851597" />

Cosmic Daily is a NASA-powered custom new-tab dashboard and field journal. Each day, it brings one Astronomy Picture of the Day into a calm editorial workspace designed for looking closely rather than endlessly scrolling.

[Try it live](https://event-horizon-frr.vercel.app)

## Features

- NASA Astronomy Picture of the Day integration with image and video support
- Date picker for exploring previous APOD entries
- Orbit Log for saving discoveries in `localStorage`
- Cosmic Shuffle for jumping to a random APOD date
- Live local clock, loading states, and friendly error handling
- Full-resolution media links and responsive layouts
- Keyboard shortcuts: `T` returns to today and `S` shuffles the archive

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` in the project root:

   ```env
   VITE_NASA_API_KEY=your_nasa_api_key_here
   ```

   Get a free key from [api.nasa.gov](https://api.nasa.gov). Never commit a real API key.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

## How it works

When the page loads, `src/main.js` requests the selected date from NASA's APOD endpoint. The response supplies the title, date, explanation, media URL, and media type. The app renders images and videos appropriately and shows a visible error state when a request fails.

## Credits

Astronomy data and media are provided by the [NASA Astronomy Picture of the Day API](https://api.nasa.gov/). The project was made for curious humans and Hack Club Stardance.
