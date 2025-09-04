[English](./README.md) | [Українська](./README.uk.md)

# Tattoo Studio Landing Page 🎨

This repository contains the source code for a modern, responsive landing page for a
tattoo studio. The page features a full-screen hero section, a dynamic image gallery
slider, a booking form, and contact information, all enhanced with smooth animations and
parallax effects.

## Demo

👉 [View the live version on GitHub Pages](https://niarosss.github.io/tatoo/)

## Features

- **Responsive Design:** A fluid layout that adapts seamlessly to desktop, tablet, and
  mobile screens.
- **Full-Screen Hero Section:** Grabs visitors' attention from the very first second.
- Smooth, animated FAQ accordion for concisely displaying information.
- Parallax scrolling effects on the hero background.
- Subtle on-scroll reveal animations for content blocks.
- An optional and festive falling snow animation for visual flair.
- **Dark/Light Mode:** Automatically detects system theme preferences and allows manual
  toggling. The user's choice is saved in local storage for persistence.
- **Dynamic Gallery:** A slider to showcase tattoo artworks.
- **Booking Form:** An interactive form for booking a session.
- **Contact Information:** Provides easy access to phone numbers, email, and social media
  links.
- **Animations and Parallax Effects:** Smooth visual effects that enhance the user
  experience.

## Technologies Used

- **Languages:** HTML, SCSS, JavaScript (ES6)

## Project Structure

The codebase is organized for clarity and ease of maintenance:

```
├── 📁 css/             # Compiled CSS files.
├── 📁 fonts/           # (Oswald fonts).
├── 📁 img/             # Background images, logos, photo and other assets.
├── 📁 js/              # JavaScript files.
│   └── 📄 main.js      # Core application logic, animations, scrolling, mobile menu behavior, and other dynamic elements.
├── 📁 scss/            # Source SCSS files organized by function.
│   ├── 📁 abstracts/   # Contains utility files that do not generate CSS directly, such as variables, mixins, and breakpoints for responsiveness.
│   ├── 📁 base/        # Holds the foundational styles for the entire website, including a browser reset, global rules, animations, and typography styles.
│   ├── 📁 components/  # Stores styles for individual, reusable elements like buttons, forms, and modals.
│   ├── 📁 layout/      # Contains styles that define the structure and layout of different sections of the page, such as the header, footer, gallery, and other content sections.
│   └── 🎨 main.scss    # Main SCSS file importing all partials.
├── 📁 video/           # This folder contains video files that are likely used for background visual effects.
└── 🌐 index.html       # The main HTML file containing all
```
