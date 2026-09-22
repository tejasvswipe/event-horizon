# Cosmic Daily
<img width="959" height="505" alt="Screenshot 2026-09-18 181020" src="https://github.com/user-attachments/assets/192c6603-0324-4d5e-9ced-282151851597" />


# Cosmic Daily



A NASA-powered custom new-tab dashboard that surface the Astronomy Picture of the Day every-time you open a tab.


<img width="754" height="269" alt="Screenshot 2026-09-18 165133" src="https://github.com/user-attachments/assets/1d23642e-e368-4990-af63-7f4c4374d2f1" />







[🚀 Try it live →](https://event-horizon-frr.vercel.app)



## Quick start



Open the link above, there is nothing to install.



## Features



- Pulls the daily image(or video) from NASA's Astronomy Picture of the Day(APOD) API



- Replaces your new-tab page with fresh cosmic imagery every day.



- Displays the title, date and explanation for each image.



- Clean, minimalist and fast dashboard UI.



<!-- Add/remove bullets to match what's actually implemented -->



## Running it locally



<!-- Fill in the real values for your stack -->



```bash



git clone https://github.com///.git



cd



npm install



npm run dev



```



You'll need a NASA API key(free at [api.nasa.gov](https://api.nasa.gov)) as an environment variable:



```



NASA_API_KEY=your_key_here



```



## How it works



<!-- Swap this for a real note on an interesting technical decision —



e.g. how you cache the daily image, handle the new-tab override,



or deal with APOD's occasional video-of-the-day responses. -->



## Credits



- [NASA APOD API](https://api.nasa.gov) for the daily imagery and data
Cosmic Daily is a custom new-tab dashboard that replaces a blank browser tab with a daily view of NASA's universe. It uses NASA's Astronomy Picture of the Day API to show an image or video, title, date, explanation, and a link to the original media.

## Purpose

The purpose of this project is to make a useful, personalized new-tab experience while practicing HTML structure, CSS layout, JavaScript interactivity, API requests, error handling, environment variables, and deployment with GitHub Pages.

## Features

- NASA Astronomy Picture of the Day integration
- Image and YouTube/video support
- Date picker for exploring previous APOD entries
- Today button to return to the current entry
- Live local clock in the header
- Loading and friendly error states
- Responsive layout for desktop and mobile
- Custom dark-space visual identity
- Keyboard shortcut: press `T` to return to today's picture
- Full-resolution media link

## Built with

- HTML
- CSS
- JavaScript
- Vite
- NASA APOD API
- GitHub Actions
- GitHub Pages

## Run locally

### 1. Install dependencies

```bash
npm install
```

### 2. Create your local environment file

Create `.env` in the project root, next to `package.json`:

```env
VITE_NASA_API_KEY=your_nasa_api_key_here
```

Never commit `.env` or a real API key to GitHub. The public `.env.example` file is only a template.

### 3. Start the development server

```bash
npm run dev
```

Open the localhost URL printed in the terminal. Use the Vite localhost URL rather than opening `index.html` directly.

### 4. Build for production

```bash
npm run build
```

## GitHub Pages deployment

1. Create a public, empty GitHub repository.
2. Replace `YOUR_REPO_NAME` in `vite.config.js` with the exact repository name.
3. Add a GitHub Actions repository secret:
   - Go to **Settings → Secrets and variables → Actions**.
   - Click **New repository secret**.
   - Name it `VITE_NASA_API_KEY`.
   - Paste the regenerated NASA API key as its value.
4. Push the project to the `main` branch.
5. Go to **Settings → Pages** and choose **GitHub Actions** as the source.
6. Open the URL shown by the successful deployment workflow:

```text
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

## Project structure

```text
.
├── .github/workflows/deploy.yml
├── public/
├── src/
│   ├── main.js
│   └── style.css
├── .env                  # local only; never commit
├── .env.example          # safe public template
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## How it works

When the page loads, `src/main.js` reads the selected date and requests NASA's APOD endpoint. The JSON response includes the title, media URL, explanation, date, and media type. The app checks whether NASA returned an image or a video and renders the appropriate element. If the request fails, the page displays a visible error message rather than remaining blank.

## Challenges and lessons learned

A key challenge was designing for both image and video APOD entries. I also learned how to use Vite environment variables, keep the local key out of the public repository, update the DOM from JavaScript, handle failed API requests, and use a GitHub Actions workflow to deploy a production build.

## Credits

- Astronomy data and media: [NASA Astronomy Picture of the Day API](https://api.nasa.gov/)
- Program: [Hack Club Stardance](https://stardance.hackclub.com/)

## License

This project is available under the MIT License.
