// app/layout.tsx (Server Component)
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import NavBar from '../../components/NavBar';
import Providers from '../provider';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-up');
  }

  return (
    <Providers>
      <div className=''>
        <NavBar />
        {children}
      </div>
    </Providers>
  );
}