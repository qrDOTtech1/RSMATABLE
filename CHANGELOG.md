# Changelog — Ma Table (Social)
All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Initial Scaffold**: Next.js 15 app with Tailwind CSS and Framer Motion.
- **Branding**: Renamed to "Ma Table" (matable.app).
- **Social Schema**: Database models for `SocialProfile`, `SocialPing`, and `SocialMode` (BUSINESS, FUN, DATE).
- **Authentication**: Integrated NextAuth with Google Provider and Prisma Adapter.
- **Landing Page**: Modern, dark-themed UI highlighting the three social modes.
- **Onboarding**: Multi-step profiling questionnaire (interests, bio, occupation).
- **Spotify-Style Dashboard**: Implemented a "Culinary Flow" interface to browse partner restaurants, see live activity streams, and access Nova matching features.
- **Email Authentication**: Added support for passwordless email login (Magic Link).
- **Authentication Improvements**: Dedicated `/login` page with Email and Google options.
- **Environment Configuration**: Added `.env.example` with all required social module variables.
- **Real-time Integration**: Connected to API Socket.io for instant social notifications.
### Fixed
- **Landing Page**: Fixed "Lancer l'expérience" button which was not clickable.
- **Navigation**: Added dedicated `/login` page for Google authentication.
- **Build**: Resolved Prisma schema conflicts with the main API.
