# CrossfitWODTracker

A simple web application to log CrossFit workouts and view analytics.
This initial version provides Google/Facebook sign-in via Firebase, OCR for
photos of the whiteboard using Tesseract.js, and a basic analytics chart.

## Getting Started

1. Host the `frontend` folder on any static site host (GitHub Pages, Netlify, etc.).
   This repository includes a GitHub Actions workflow that publishes the contents of the `frontend` directory to GitHub Pages whenever you push to the `main` branch. Enable GitHub Pages in the repository settings and choose "GitHub Actions" as the source.
2. Replace the Firebase configuration in `frontend/script.js` with your project
   credentials.
3. Open `index.html` in a browser. Sign in with Google or Facebook, then paste
   the WOD text or upload a photo to extract text with OCR. Saved workouts are
   stored in Firestore.

## Features

- Google and Facebook authentication using Firebase.
- Paste workout details or upload a photo for OCR capture.
- Stores workouts in Firestore under the signed-in account.
- Simple analytics chart of saved workouts.

This setup uses CDN links for all dependencies so it can be hosted without a
build step or server-side code.

