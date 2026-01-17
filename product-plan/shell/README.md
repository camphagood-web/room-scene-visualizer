# Application Shell

## Overview

A minimal header shell for Design Room Generator. The header provides simple tab navigation between the two main sections while maximizing vertical space for content.

## Navigation Structure

- **Logo/App Name:** Design Room Generator (top-left)
- **Generator** - Main generation interface
- **Gallery** - Image history and results

## Layout Pattern

- Minimal header with logo left and tab navigation to the right
- No user menu (simple localhost tool)
- Full-width content area below the header

## Responsive Behavior

- Desktop: Single-row header with logo left, tabs center-left, content below
- Tablet: Same as desktop, tabs may shrink slightly
- Mobile: Logo and tabs remain visible with compact spacing

## Components Provided

- `AppShell.tsx` - Layout wrapper with header and content container
- `MainNav.tsx` - Tab navigation component

## Notes

- Active tab uses amber underline/highlight
- Hover states use cyan accents
- Stone neutrals for background and text
- DM Sans typography throughout
