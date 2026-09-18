# Cosmic Daily

A custom NASA-powered new-tab dashboard that brings a different view of the universe to your browser every day.

## Live Demo

[Open Cosmic Daily](https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/ )

## Preview

![Cosmic Daily preview](./public/preview.png)

## About the Project

Cosmic Daily replaces the ordinary browser new-tab page with an interactive Astronomy Picture of the Day dashboard.

It fetches NASA's daily astronomy image or video and displays:

- The title of the astronomy picture
- The date it was published
- The image or video
- NASA's explanation
- A link to the full-resolution media
- A date picker for exploring previous astronomy pictures
- A loading state while data is being fetched
- An error message if the request fails

The goal of this project is to practice HTML structure, CSS layout, JavaScript interactivity, API requests, error handling, and deployment with GitHub Pages.

## Features

- NASA Astronomy Picture of the Day API integration
- Image and video support
- Previous-date browsing
- Responsive design for mobile and desktop
- Custom dark-space visual theme
- Loading and error states
- Full-resolution media link
- No frontend framework required

## Built With

- HTML
- CSS
- JavaScript
- Vite
- NASA APOD API
- GitHub Pages

## How It Works

1. The user opens the website.
2. JavaScript reads the selected date.
3. The app sends a request to NASA's APOD API.
4. The response is converted from JSON into usable data.
5. The page displays the title, media, date, and explanation.
6. If NASA returns a video instead of an image, the app displays the video correctly.
7. If something goes wrong, the app shows an error message instead of leaving the page blank.

## Run Locally

