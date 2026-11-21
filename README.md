# Campus Saathi

Campus Saathi is a mobile-first progressive web app for VIT Bhopal students. It brings timetable information, squad availability, academic calendar details, faculty reviews, parcel requests, and live notifications into one interface.

## Features

- View the master timetable by day and time slot
- Compare schedules and free slots across squad members
- Open individual course and timetable details
- Browse academic calendar events, exams, holidays, and remote days
- Search faculty and view or submit anonymous teacher reviews
- Create and claim parcel collection requests for squad members
- Receive class, parcel, and schedule notifications
- Install the app as a PWA for a standalone mobile experience
- Use dark mode and persistent user identity selection

## Tech Stack

- HTML, CSS, and vanilla JavaScript
- Tailwind CSS
- Font Awesome
- Firebase Firestore
- Web App Manifest and Service Worker

## Getting Started

The app is a static website and does not require a build step.

Run a local server from the repository root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

Using an HTTP server is recommended instead of opening `index.html` directly, so browser features such as the service worker and PWA installation work correctly.

## Project Structure

```text
.
├── index.html                 # Main application
├── manifest.json              # PWA configuration
├── sw.js                      # Service worker and notification handling
├── icons/                     # App and PWA icons
├── delivery/
│   ├── index.html
│   ├── delivery.js
│   └── README.md
├── teacher_review/
│   ├── index.html
│   ├── teacher_review.js
│   └── README.md
└── scratch/                   # Development and data-processing scripts
```

## Firebase Configuration

The main app initializes Firebase Firestore in `index.html`. Review and parcel features use these collections:

- `/teacher_reviews` for faculty reviews
- `/deliveries` for parcel requests

The parcel module can fall back to the `teacher_reviews` collection when `/deliveries` is not configured. For details and Firestore rules, see:

- [Teacher Reviews Module](teacher_review/README.md)
- [Delivery and Parcel Helper Module](delivery/README.md)

Firebase configuration is also used when deploying the app. Browser clients should use Firebase security rules that grant only the access required by the app.

## PWA and Notifications

The app includes a web app manifest and service worker. Supported browsers can install it from the install prompt or browser menu.

Notifications require browser permission and may require HTTPS when hosted outside `localhost`.
