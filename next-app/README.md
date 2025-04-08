# Endaoment Integration Demo

This is a Next.js application that demonstrates the integration with Endaoment's API. The application allows users to:

- Search for organizations
- View their DAFs (Donor Advised Funds)
- Create new DAFs
- Manage their account

## Features

- Modern UI with DaisyUI components
- Dark/Light theme support
- Responsive design
- Type-safe API routes
- Client-side state management with React Query

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

The application includes the following API routes:

- `/api/check-login` - Check if the user is logged in
- `/api/init-login` - Initialize the login process
- `/api/logout` - Log out the user
- `/api/search` - Search for organizations
- `/api/get-dafs` - Get the user's DAFs
- `/api/create-daf` - Create a new DAF

## Development

- Built with Next.js 14
- TypeScript for type safety
- Tailwind CSS for styling
- DaisyUI for UI components
- React Query for data fetching

## License

MIT
