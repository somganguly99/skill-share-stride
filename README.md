# EduLearn - Learning Management System

A complete LMS platform with separate portals for Students, Instructors, and Admins.

## Features

### Student Portal
- Browse and enroll in courses
- Mock payment system (test success/failure scenarios)
- Watch course videos broken into modules with timestamps
- Complete quizzes for each module
- Track progress with checkboxes
- Generate certificates upon 100% completion

### Instructor Portal
- Request to add new courses with YouTube videos
- Set quizzes for course modules after admin approval
- Manage approved courses

### Admin Portal
- Approve/reject student enrollment requests
- Approve/reject instructor course addition requests
- View all courses with enrolled students/instructors
- Remove students/instructors from courses

## Backend Integration

This frontend connects to a MySQL backend (XAMPP). See `BACKEND_API_REFERENCE.md` for the required API endpoints.

**Important**: Update the API URL in `src/lib/api.ts` to match your backend server.

## Database Schema

Uses the following MySQL tables:
- `Admin`, `Instructor`, `Student` - User management
- `Course` - Course data with pricing (₹500-2000 based on duration)
- `Enrolls_In` - Student-Course enrollment
- `Quiz` - Module quizzes
- `Certificate` - Completion certificates

## Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/4545afdc-9d62-48e1-b05b-9c4f0df6469d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/4545afdc-9d62-48e1-b05b-9c4f0df6469d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/4545afdc-9d62-48e1-b05b-9c4f0df6469d) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
