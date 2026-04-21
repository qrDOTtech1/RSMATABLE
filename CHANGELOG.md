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
- **Social Dashboard**: Main interface to see nearby people, matching scores, and real-time pings.
### Fixed
- **Landing Page**: Fixed "Lancer l'expérience" button which was not clickable.
- **Navigation**: Added dedicated `/login` page for Google authentication.
- **Build**: Resolved Prisma schema conflicts with the main API.
