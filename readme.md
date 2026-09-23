# Cosmic Daily

Cosmic Daily is a NASA-powered field journal for curious humans. Each day, the app brings one Astronomy Picture of the Day into a calm editorial workspace designed for looking closely rather than endlessly scrolling.

## What changed in this revision

The interface was rebuilt from scratch as an authored observatory / field-notes system instead of a generic dashboard or browser-window mockup. It uses a warm paper palette, ink-blue typography, coral action accents, a lime orbital calendar, Fraunces display type, and a responsive two-column reading layout.

Two original features make the experience more playful and useful:

- **Orbit Log:** pin a discovery to save it in `localStorage`, then reopen it from the slide-out collection drawer on a later visit.
- **Cosmic Shuffle:** jump to a random APOD date from NASA’s archive. The `S` keyboard shortcut does the same thing; `T` returns to today.

The app still supports image and video APOD entries, date browsing, a live local clock, loading and error states, a full-resolution source link, and mobile layouts.

## Run locally

1. Install dependencies: `npm install`
2. Optional: create `.env` in the project root with `VITE_NASA_API_KEY=your_nasa_api_key_here`.
3. Start Vite with `npm run dev`.
4. Build for production with `npm run build`.

## Credits

Astronomy data and media are provided by the [NASA Astronomy Picture of the Day API](https://api.nasa.gov/). The project was made for curious humans and Hack Club Stardance.
