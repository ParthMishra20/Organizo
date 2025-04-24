import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import LoadingSpinner from './components/LoadingSpinner';
import LoadingOverlay from './components/LoadingOverlay';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import TaskScheduler from './pages/TaskScheduler';
import BudgetBuddy from './pages/BudgetBuddy';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const { isLoaded, userId } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();

  if (!isLoaded) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className={`min-h-screen bg-background text-foreground antialiased dark-transition`}>
      <NavBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <>
        <LoadingOverlay />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <Routes>
          <Route path="/sign-in/*" element={userId ? <Navigate to="/dashboard" replace /> : <SignIn />} />
          <Route path="/sign-up/*" element={userId ? <Navigate to="/dashboard" replace /> : <SignUp />} />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={!userId ? <Navigate to="/sign-in" replace /> : <Dashboard />}
          />
          <Route
            path="/tasks"
            element={!userId ? <Navigate to="/sign-in" replace /> : <TaskScheduler />}
          />
          <Route
            path="/budget"
            element={!userId ? <Navigate to="/sign-in" replace /> : <BudgetBuddy />}
          />
          <Route
            path="/profile"
            element={!userId ? <Navigate to="/sign-in" replace /> : <Profile />}
          />
        </Routes>
        </main>
      </>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 3000,
          success: {
            icon: '✅',
            className: 'dark:bg-green-800',
            duration: 2000,
          },
          error: {
            icon: '❌',
            className: 'dark:bg-red-800',
            duration: 4000,
          },
        }}
      />
    </div>
  );
}

export default App;
