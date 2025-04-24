# Organizo

A personal organization web application built with React and TypeScript for managing tasks and finances.

## Features

- Task Scheduler for creating, editing, and tracking tasks
- Budget Management system for tracking income, expenses, and financial goals
- Authentication via Clerk
- Dark mode support
- MongoDB integration for data storage
- Responsive design with TailwindCSS

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Clerk account for authentication

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/organizo.git
cd organizo
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your environment variables:
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_MONGODB_URI=your_mongodb_connection_string
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── context/         # React context providers
├── hooks/           # Custom React hooks
├── lib/            # Utilities and helpers
├── pages/          # Application pages/routes
├── types/          # TypeScript type definitions
└── utils/          # Helper functions
```

## Main Features

### Task Scheduler
- Create, edit, and delete tasks
- Set due dates and priorities
- Track task completion
- Organize tasks by categories

### Budget Management
- Track income and expenses
- Set budget categories
- Monitor spending
- View financial analytics

### User Profile
- Manage account settings
- Customize preferences
- Toggle dark mode
- View account information

## Technologies Used

- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Clerk for authentication
- MongoDB for data storage
- React Router for navigation
- React Hot Toast for notifications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
