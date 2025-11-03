/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs' 

export async function POST(req: Request) {
  try {
    if (!prisma) {
      throw new Error('Prisma client not initialized')
    }

    const { data } = await req.json()

    if (!data) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      )
    }

    const primaryEmail =
      data?.email_addresses?.find(
        (email: any) => email.id === data.primary_email_address_id
      )?.email_address || data?.email_addresses?.[0]?.email_address

    const clerkUserId = data?.id

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "User ID not found" },
        { status: 400 }
      )
    }

    if (!primaryEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      )
    }

    const user = await prisma.user.upsert({
      where: { email: primaryEmail },
      create: {
        id: clerkUserId,
        name: data?.full_name || '',
        email: primaryEmail,
      },
      update: {
        name: data?.full_name || '',
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      },
      { status: 500 }
    )
  }
}
