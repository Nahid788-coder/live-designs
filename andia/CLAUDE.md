# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a responsive portfolio website template for a design agency. It uses a custom 12-column flexbox grid system with CSS3 animations and smooth transitions.

## Development

**No build system** - This is pure HTML/CSS/JS. To develop:
- Open `index.html` directly in a browser
- Use a local server (e.g., `python -m http.server` or VS Code Live Server) for best results

## Architecture

### Grid System (grid.css)

Responsive 12-column flexbox grid:
- Full-width container with max-width: 1400px
- Column classes: `.col-1` through `.col-12`
- Responsive breakpoints:
  - Desktop: > 1024px (default)
  - Tablet: 768px - 1024px (`.col-md-*`)
  - Mobile: < 768px (`.col-sm-*`, stacks to full width)
  - Extra small: < 480px

Usage pattern:
```html
<div class="container">
    <div class="row">
        <div class="col-6">...</div>
        <div class="col-6">...</div>
    </div>
</div>
```

### File Structure

- `index.html` - Single-page layout with section IDs for navigation
- `grid.css` - Responsive grid system + utility classes
- `style.css` - Component styling with animations and hover effects
- `font-awesome/` - Icon library (v4.0.3)
- `img/` - Assets (slider/, portfolio/, team/, testimonials/, social-icons/)

### CSS Conventions

- Primary accent: Purple gradient (`#8b5cf6` to `#a855f7`)
- Dark footer: Navy gradient (`#1a1a2e` to `#16213e`)
- Card hover: `translateY(-10px)` with enhanced shadow
- Buttons: Rounded with gradient background
- Smooth transitions: `0.3s ease` default
- Section IDs: `#home`, `#services`, `#portfolio`, `#testimonials`, `#contact`

### JavaScript Features

- Mobile menu toggle (hamburger menu)
- Smooth scroll navigation
- Header shadow on scroll
