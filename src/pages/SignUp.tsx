import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

export default function SignUp() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="card max-w-md w-full space-y-8 animate-slide-in">
        <div>
          <h1 className="gradient-text text-center text-3xl font-bold">Create Account</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Join Organizo to start managing your tasks and finances
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md dark:shadow-none">
          <ClerkSignUp 
            routing="path" 
            path="/sign-up" 
            afterSignUpUrl="/dashboard"
            signInUrl="/sign-in"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none p-0 bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "hover-lift",
                dividerRow: "my-6",
                formFieldInput: 
                  "w-full rounded-md border transition-colors border-gray-300 " +
                  "focus:border-primary focus:ring-primary dark:border-gray-600 " +
                  "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                formButtonPrimary: 
                  "w-full btn-primary hover-lift",
                footerAction: "mt-4 text-center",
                footerActionLink: 
                  "text-primary hover:text-primary/80 transition-colors",
              },
              layout: {
                socialButtonsPlacement: "bottom",
                privacyPageUrl: "https://clerk.dev/privacy",
                termsPageUrl: "https://clerk.dev/terms",
              },
            }}
          />
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Protected by{' '}
            <a 
              href="https://clerk.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Clerk
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            By creating an account, you agree to our{' '}
            <a 
              href="#"
              className="underline hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
            {' '}and{' '}
            <a 
              href="#"
              className="underline hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}