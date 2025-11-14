"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BackgroundGradient } from "@/components/BackgroundGradient";

interface EmptyStateProps {
  isError?: boolean;
  isNotFound?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

export function EmptyState({ isError, isNotFound, errorMessage, onRetry }: EmptyStateProps) {
  if (isError) {
    return (
      <div className="w-full px-4 py-8 max-w-7xl mx-auto">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              {isNotFound ? 'No Meal Plan Found' : 'Error Loading Meal Plan'}
            </h2>
            <p className="text-red-700 mb-4">
              {isNotFound 
                ? "You haven't generated a meal plan yet."
                : errorMessage
              }
            </p>
            <BackgroundGradient 
              containerClassName="rounded-[22px] max-w-full p-4 sm:p-10 bg-white dark:bg-zinc-900"
            >
              <div className="space-x-2">
                {isNotFound ? (
                  <Link 
                    href="/plan-form"
                    className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Generate Meal Plan
                  </Link>
                ) : (
                  <Button 
                    onClick={onRetry}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Try Again
                  </Button>
                )}
              </div>
            </BackgroundGradient>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 max-w-7xl mx-auto">
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold mb-4">No meal plan available</h2>
        <Link 
          href="/generate-plan"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Generate Your First Meal Plan
        </Link>
      </div>
    </div>
  );
}

