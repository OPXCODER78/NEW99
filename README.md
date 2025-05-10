# Modern Blog Platform

A full-stack blog application with user authentication and role-based access control.

## Features

### Admin Features
- Secure admin dashboard with login/authentication
- Create, edit, and delete blog posts
- Upload images for blog posts
- Manage blog categories and tags
- View analytics (page views, user engagement)
- Moderate user comments

### Blog Post Features
- Title and content with rich text formatting
- Featured image
- Categories and tags
- Publication date
- SEO metadata
- Status (draft/published)

### User Features
- Clean, responsive homepage displaying blog posts
- Search functionality for posts
- Filter posts by category/tags
- Share posts on social media
- Comment system with moderation
- User registration and profiles

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Supabase (Authentication, Database, Storage)
- **Editor**: TipTap (Rich Text Editing)
- **State Management**: Zustand, React Context
- **Forms**: React Hook Form
- **Routing**: React Router Dom

## Setup Instructions

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Set up Supabase
   - Create a new Supabase project
   - Run the SQL migrations found in `/supabase/migrations`
   - Copy `.env.example` to `.env` and update with your Supabase credentials

4. Start the development server
   ```
   npm run dev
   ```

## Deployment

1. Build the project
   ```
   npm run build
   ```
2. Deploy to your hosting provider of choice
   ```
   npm run deploy
   ```

## License

MIT