"use client";
import React from 'react';
import { ProfileForm } from '@/components/Form';
import { Sparkles } from 'lucide-react';


const PlanFromPage = () => {
  return (
    <div className="flex flex-col mx-auto items-center w-full  ">
      <div className="flex flex-col items-center justify-center mt-12 max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-6">
          Create Your{' '}
          <span className="text-transparent bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text">
            AI Diet Plan 
            <Sparkles className="w-6 h-6 text-transparent bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text" />
            </span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Please fill out the form below to create your personalized nutrition plan.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 max-w-4xl w-full items-start ">
        <div className="flex-1 ">
          <ProfileForm />
        </div>

      </div>
    </div>
  );
};

export default PlanFromPage;