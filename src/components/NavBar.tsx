/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import React from 'react';
import Link from 'next/link';
import { ChefHat, Sparkles, Crown, Menu } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: ChefHat, path: '/dashboard' },
  { id: 'create', label: 'Create Plan', icon: Sparkles, path: '/plan-form' },
  { id: 'subscription', label: 'Subscription', icon: Crown, path: '/subscription' },
];

const NavBar = () => {
  return (
    <div className="sticky top-0 z-50 bg-white backdrop-blur supports-[backdrop-filter]:bg-background-white rounded-3xl border-b-1 border-gray-300 w-[90%] mx-auto mt-1">
      <nav className="flex justify-between items-center px-5 md:px-[70px] py-2  ">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          <Image
            src="/ll.png"
            alt="Company Logo"
            width={150}
            height={40}
            className="h-auto w-[150px]"
            priority
          />
        </Link>

        <ul className="hidden md:flex space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button key={item.id} className="bg-white text-black hover:bg-gray-100">
                <Link href={item.path} className="flex items-center space-x-2 text-gray-700">
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </ul>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[260px]">
              <div className="pt-8 space-y-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className="w-full justify-start gap-3 text-gray-700"
                      asChild
                    >
                      <Link href={item.path}>
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
