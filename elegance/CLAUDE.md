# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Elegance is a responsive single-page HTML/CSS website template for a creative agency. It has no build system or JavaScript framework - just pure HTML and CSS with modern responsive design.

## Development

Open `index.html` directly in a browser to view the site. No build or compilation step required.

## Architecture

### File Structure
- `index.html` - Single-page template with all sections (header, about, services, portfolio, pricing, team, contact, footer)
- `style.css` - All custom styles with responsive breakpoints
- `font-awesome/` - Icon library (Font Awesome 4.x)

### Asset Directories
- `slider/` - Hero/slider background images
- `services/` - Service icon images
- `portfolio/` - Portfolio gallery images (1-9.jpg)
- `team/` - Team member photos
- `clients/` - Client logo images
- `social/` - Social media icon images

### CSS Architecture
- Uses CSS Grid for layouts (`display: grid`, `grid-template-columns`)
- Flexbox for component alignment
- Mobile-first approach with media queries at: 1200px, 992px, 768px, 576px, 400px
- CSS custom transitions and animations
- Google Fonts: Poppins (body), Playfair Display (headings)

### Key CSS Patterns
- Section-based organization with `.box1` through `.box17` classes
- Parallax effects via `background-attachment: fixed`
- Gradient backgrounds using `linear-gradient()`
- Hover effects with `transform` and `transition`
- Portfolio overlay effects using positioned elements with opacity transitions
- Mobile hamburger menu using checkbox hack (no JavaScript)

### Responsive Breakpoints
- `1200px` - Large tablets/small desktops
- `992px` - Tablets
- `768px` - Mobile landscape/small tablets (hamburger menu activates)
- `576px` - Mobile portrait (single column layouts)
- `400px` - Extra small devices

### Navigation
Uses anchor links (`#home`, `#about`, `#services`, `#portfolio`, `#team`, `#contact`) with `scroll-behavior: smooth`.

### Footer Structure
4-column responsive footer with:
- About section with logo and social links
- Quick Links navigation
- Services list
- Contact information
