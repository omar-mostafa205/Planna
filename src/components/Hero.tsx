'use client';
import React from 'react';
import Image from 'next/image';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { Bot, ArrowRight, Heart, Link } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background ">
      <div className="grid lg:grid-cols-2 md:grid-cols-2 min-h-screen">
        <div className="flex flex-col justify-center px-8 lg:px-16 py-12 lg:py-0 mt-[-100px]">
          <div className="max-w-lg">
            <div className="mb-8">
              <Logo />
              <div className="flex items-center gap-1 mt-4">
                <span className="text-sm font-medium text-cyan-500">
                  AI Powered Nutrition Planning
                </span>
              </div>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Personal{' '}
              <span className="text-transparent bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text">
                Health
              </span>{' '}
              Coach
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Transform your body composition with AI-driven nutrition plans tailored to your InBody analysis results.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
      
              <Button
              onClick={() => router.push('/plan-form')}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-teal-400 text-white border-0 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Bot className="h-5 w-5 mr-2" />
                Start Your Journey
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              <Button size="lg" variant="outline" className="border-2" onClick={()=> router.push('dashboard')}>
                <Heart className="h-5 w-5 mr-2" />
                View Dashboard
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  AI Powered
                </div>
                <div className="text-sm text-muted-foreground">Nutrition Plans</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  Real-Time
                </div>
                <div className="text-sm text-muted-foreground">Body Tracking</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block h-screen  lg:max-w-[100%">
  
  <Image
    src="/tt.png"
    alt="Hero Image"
    priority
    fill
    className='object-cover'
  />
  
</div>
      </div>
    </div>
  );
};

export default Hero;
