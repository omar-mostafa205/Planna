# API Reference Documentation


## Overview


**Technology Stack:**
* **Web Framework:** Next.js (App Router)
* **Authentication:** Clerk
* **Database ORM:** Prisma
* **Payments:** Stripe
* **AI / LLM Provider:** OpenAI (via OpenRouter)
* **Image Processing:** Sharp
* **Validation (Client-side):** Zod
* **Language:** TypeScript

**Base URL:**
The codebase uses `process.env.NEXT_PUBLIC_URL` to construct success and cancel URLs for Stripe Checkout.

* **Code Reference:** `src/app/api/check-out/route.ts`
    ```typescript
    // ...
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    // ...
    ```

**API Version:**
Unable to determine from codebase. The `package.json` file content was not provided.

**Summary:**
This API provides services for an AI-powered nutrition planning application named "Planna". It handles user profile creation via Clerk webhooks, generates personalized meal plans using OpenAI based on user-submitted data (including InBody scan images), and manages user subscriptions through Stripe Checkout and webhooks. The core functionality revolves around creating, storing, and retrieving user-specific meal plans.

---


## Authentication



### Authentication Method


**Type Detected:** Clerk (JWT-based)

**Implementation Location:**
* Middleware: `omar-mostafa205-Planna-aea2b49/src/middleware.ts`
* API Route Protection: `omar-mostafa205-Planna-aea2b49/src/app/api/generate-plan/route.ts`, `omar-mostafa205-Planna-aea2b49/src/app/api/get-plan/route.ts`

**How Authentication Works:**
The application uses Clerk for user authentication. A middleware (`clerkMiddleware`) is applied to all relevant routes to manage authentication state. Protected API endpoints call the `auth()` function from `@clerk/nextjs/server` to retrieve the authenticated user's ID (`userId`). If no authenticated user is found, the endpoint typically returns an unauthorized response.

**Code Reference:**
* Middleware Configuration (`src/middleware.ts`):
    ```typescript
    import { clerkMiddleware } from "@clerk/nextjs/server";

    export default clerkMiddleware();

    export const config = {
      matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
      ],
    };
    ```
* Protecting an API Route (`src/app/api/get-plan/route.ts`):
    ```typescript
    import { auth } from "@clerk/nextjs/server";

    export async function GET() {
      const { userId } = await auth();

      if (!userId) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      // ... handler logic
    }
    ```


### Authentication Flow

The system relies on Clerk's hosted pages for sign-up and sign-in. When a new user is created in Clerk, a webhook is sent to this application to create a corresponding user profile in the local database.

**User Profile Creation (via Webhook):**
The `POST /api/webhook/clerk` endpoint listens for user creation events from Clerk to synchronize user data.

* **Source:** `omar-mostafa205-Planna-aea2b49/src/app/api/webhook/clerk/route.ts`
* **Handler Code:**
    ```typescript
    // ...
        const { data } = await req.json() as { data: any };

        switch (data?.object) {
            case 'user':
                console.log('User event received:', data);

                const email = data?.email_addresses?.[0]?.email_address;
                const clerkUserId = data?.id;

                if (!clerkUserId || !email) {
                    return new NextResponse(JSON.stringify({ error: 'Missing user ID or email' }), { status: 400 });
                }

                // Use a transaction for upserting the profile
                const profile = await prisma.$transaction(async (tx) => {
                    return tx.profile.upsert({
                        where: { userId: clerkUserId },
                        create: {
                            userId: clerkUserId,
                            email,
                            subscriptionActive: false,
                            subscriptionTier: null,
                            stripeSubscriptionId: null,
                        },
                        update: { email },
                    });
                });
    // ...
    ```

---


## API Endpoints



### Meal Plan



#### `POST /api/generate-plan`


**Source:** `omar-mostafa205-Planna-aea2b49/src/app/api/generate-plan/route.ts:29`

**Description:** Generates a personalized meal plan for the authenticated user using OpenAI. It processes user-provided information and an optional InBody scan image to create the plan, then saves it to the user's profile in the database.

**Authentication Required:** Yes

**Route Handler:**
```typescript
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
// ...

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const formData = await req.formData();
    const data = {
      fullName: formData.get("fullName") as string,
      age: formData.get("age") as string,
      height: formData.get("height") as string,
      gender: formData.get("gender") as string,
      activityLevel: formData.get("activityLevel") as string,
      goals: formData.get("goals") as string,
      medicalConditions: formData.get("medicalConditions") as string || "",
      images: formData.getAll("images") as File[],
    };

    // ... OpenAI and image processing logic ...

    const mealPlanJson = JSON.parse(mealPlan.choices[0].message.content!);

    // Save the plan to the database
    await prisma.profile.update({
      where: { userId },
      data: { mealPlan: mealPlanJson },
    });

    return new NextResponse(JSON.stringify(mealPlanJson), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating meal plan:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to generate meal plan" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

**Request Body Schema:**
The request body is expected to be `multipart/form-data`. The following fields are extracted from the form data in the handler: | Field | Type | Description |
|---|---|---|
| `fullName` | `string` | The user's full name. |
| `age` | `string` | The user's age. |
| `height` | `string` | The user's height in centimeters. |
| `gender` | `string` | The user's gender (e.g., "Male", "Female"). |
| `activityLevel` | `string` | The user's activity level (e.g., "Sedentary"). |
| `goals` | `string` | The user's health and fitness goals. |
| `medicalConditions` | `string` | Any relevant medical conditions. Optional. |
| `images` | `File[]` | An array of files. The handler processes the first image as an InBody scan. | **Response Schema:**
The endpoint returns the JSON object of the generated meal plan received from OpenAI. The structure is defined by the prompt in the handler. A client-side interface matches this structure.

* **Source:** `omar-mostafa205-Planna-aea2b49/src/app/(main)/dashboard/page.tsx`
    ```typescript
    interface Meal {
      title: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      ingredients: string[];
      instructions: string[];
    }

    interface MealPlanData {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      currentWeight: number;
      bodyFat: number;
      muscleMass: number;
      goal: string;
      meals: {
        breakfast: Meal;
        lunch: Meal;
        dinner: Meal;
        snack: Meal;
      };
    }
    ```

**Error Responses:** | Status Code | Condition | Response |
|---|---|---|
| `401` | User is not authenticated. | `{"error": "Unauthorized"}` |
| `500` | An error occurs during image processing, OpenAI API call, or database update. | `{"error": "Failed to generate meal plan"}` | **Database Operations:**
* Writes to: `Profile` (updates the `mealPlan` field).

---


#### `GET /api/get-plan`


**Source:** `omar-mostafa205-Planna-aea2b49/src/app/api/get-plan/route.ts:6`

**Description:** Retrieves the meal plan for the currently authenticated user from the database.

**Authentication Required:** Yes

**Route Handler:**
```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    // ... 401 response
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { mealPlan: true }
    });

    if (!profile || !profile.mealPlan) {
      return new NextResponse(JSON.stringify({ error: "No meal plan found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return NextResponse.json(profile.mealPlan);
  } catch (error) {
    // ... 500 response
  }
}
```

**Response Schema:**
Returns the `mealPlan` JSON object stored in the user's profile. See the schema for `POST /api/generate-plan`.

**Error Responses:** | Status Code | Condition | Response |
|---|---|---|
| `401` | User is not authenticated. | `{"error": "Unauthorized"}` |
| `404` | No profile exists for the user or the `mealPlan` field is null. | `{"error": "No meal plan found"}` |
| `500` | A database error occurred. | `{"error": "Failed to fetch meal plan"}` | **Database Operations:**
* Reads from: `Profile` (selects the `mealPlan` field).

---


### Payments & Subscriptions



#### `POST /api/check-out`


**Source:** `omar-mostafa205-Planna-aea2b49/src/app/api/check-out/route.ts:6`

**Description:** Creates a Stripe Checkout session to allow a user to subscribe to a paid plan.

**Authentication Required:** No (The handler does not call `auth()`. It relies on `userId` and `email` being passed in the request body).

**Route Handler:**
```typescript
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { planType, userId, email } = await request.json();

    if (!planType || !userId || !email) {
      // ... 400 response
    }

    const priceId = planType.toLowerCase() === 'premium'
        ? process.env.NEXT_PUBLIC_STRIPE_PREMIUM
        : process.env.NEXT_PUBLIC_STRIPE_BASIC;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
      customer_email: email,
      metadata: { userId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    // ... 500 response
  }
}
```

**Request Body Schema:**
No request schema defined in code. The handler expects a JSON body with the following properties: | Field | Type | Required | Description |
|---|---|---|---|
| `planType` | `string` | Yes | The type of plan to subscribe to (e.g., "premium", "basic"). |
| `userId` | `string` | Yes | The Clerk user ID of the user subscribing. |
| `email` | `string` | Yes | The user's email address. | **Response Schema:**
* **Source:** `omar-mostafa205-Planna-aea2b49/src/app/(main)/subscription/page.tsx`
    ```typescript
    type SubscriptionResponse = {
      url: string;
    };
    ```

**Error Responses:** | Status Code | Condition | Response |
|---|---|---|
| `400` | `planType`, `userId`, or `email` are missing from the request body. | `{"error": "Plan type, user ID, and email are required"}` |
| `500` | An error occurred while creating the Stripe Checkout session. | `{"error": "Failed to create checkout session"}` | ---


### Webhooks



#### `POST /api/webhook/clerk`


**Source:** `omar-mostafa205-Planna-aea2b49/src/app/api/webhook/clerk/route.ts:6`

**Description:** Inbound webhook to handle events from Clerk, primarily for creating a user profile in the local database when a user signs up.

**Authentication Required:** No. The endpoint is public and does not perform signature verification.

**Route Handler:**
```typescript
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { data } = await req.json() as { data: any };
    // ... switch statement on data.object ...
    const email = data?.email_addresses?.[0]?.email_address;
    const clerkUserId = data?.id;

    const profile = await prisma.$transaction(async (tx) => {
      return tx.profile.upsert({
        where: { userId: clerkUserId },
        create: {
          userId: clerkUserId,
          email,
          subscriptionActive: false,
          subscriptionTier: null,
          stripeSubscriptionId: null,
        },
        update: { email },
      });
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    // ... 500 response
  }
}
```

**Database Operations:**
* Writes to: `Profile` (creates or updates a user profile).

**Side Effects:**
* Creates a new user profile record in the database.

---


#### `POST /api/webhook/stripe`


**Source:** `omar-mostafa205-Planna-aea2b49/src/app/api/webhook/stripe/route.ts:11`

**Description:** Inbound webhook to handle subscription-related events from Stripe. It manages the user's subscription status in the local database.

**Authentication Required:** Yes (Stripe webhook signature verification is attempted).

**Route Handler:**
```typescript
import Stripe from "stripe";
// ...

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_KEY as string;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err: any) {
    // ... 400 response
  }

  switch (event.type) {
    case "checkout.session.completed":
      // ... handle session completed
      break;
    case "invoice.payment_failed":
      // ... handle payment failed
      break;
    case "customer.subscription.deleted":
      // ... handle subscription deleted
      break;
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
```

**Logic:**
* **`checkout.session.completed`**: When a user successfully subscribes, this event is triggered. The handler finds the user's profile via the `userId` in the session metadata and updates it with the new `stripeSubscriptionId`, `subscriptionTier`, and sets `subscriptionActive` to `true`.
* **`invoice.payment_failed`**: If a recurring payment fails, this handler finds the user's profile via the `stripeSubscriptionId` and sets `subscriptionActive` to `false`.
* **`customer.subscription.deleted`**: When a subscription is canceled or ends, this handler finds the user's profile and sets `subscriptionActive` to `false` and `stripeSubscriptionId` to `null`.

**Database Operations:**
* Reads from: `Profile`
* Writes to: `Profile`

---


## Data Models


⚠️ No `schema.prisma` file was found in the provided codebase. The following model schema is inferred from Prisma client usage in the API routes.


### Profile


**Source:** Inferred from `omar-mostafa205-Planna-aea2b49/src/app/api/**/*.ts`

**Database Table/Collection:** `profile`

**Inferred Schema Definition:**
Based on queries, the `Profile` model likely contains the following fields.

**Field Details:** | Field | Type | Required | Inferred From |
|---|---|---|---|
| `userId` | `String` | Yes | `where: { userId }` clause in multiple files. Serves as the primary/unique key linking to Clerk's user ID. (`webhook/clerk/route.ts`) |
| `email` | `String` | Yes | `create: { email }` in `webhook/clerk/route.ts` |
| `mealPlan` | `Json?` | No | `data: { mealPlan: mealPlanJson }` in `generate-plan/route.ts`. The `?` denotes it's optional as it's not set on creation. |
| `subscriptionActive`| `Boolean` | Yes | `create: { subscriptionActive: false }` in `webhook/clerk/route.ts` and updates in `webhook/stripe/route.ts`. |
| `subscriptionTier`| `String?` | No | `create: { subscriptionTier: null }` in `webhook/clerk/route.ts` and updates in `webhook/stripe/route.ts`. |
| `stripeSubscriptionId`| `String?` | No | `create: { stripeSubscriptionId: null }` in `webhook/clerk/route.ts`. Used as a unique key for lookups in `webhook/stripe/route.ts`. | **Relationships:**
No relationships to other models were found in the codebase.

---


## Type Definitions



### MealPlanData


**Source:** `omar-mostafa205-Planna-aea2b49/src/app/(main)/dashboard/page.tsx`

**Definition:**
This client-side interface defines the expected structure of a meal plan object, which corresponds to the data returned by `GET /api/get-plan` and `POST /api/generate-plan`.
```typescript
interface MealPlanData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  currentWeight: number;
  bodyFat: number;
  muscleMass: number;
  goal: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snack: Meal;
  };
}
```

**Related Types:**
* `Meal`


### Meal


**Source:** `omar-mostafa205-Planna-aea2b49/src/app/(main)/dashboard/page.tsx`

**Definition:**
Defines the structure for an individual meal within the `MealPlanData` type.
```typescript
interface Meal {
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string[];
}
```

---


## Business Logic & Services



### Image Service


**Location:** `omar-mostafa205-Planna-aea2b49/src/lib/image.ts`

**Purpose:** Provides utility functions for handling and processing images, primarily for the InBody scan upload feature.


#### `compressImageServer()`


**Signature:**
```typescript
export async function compressImageServer(buffer: ArrayBuffer): Promise<Buffer>
```

**Implementation:**
```typescript
export async function compressImageServer(buffer: ArrayBuffer): Promise<Buffer> {
  const compressedBuffer = await sharp(buffer)
    .webp({ quality: 80 })
    .resize({ height: 800, withoutEnlargement: true })
    .toBuffer();

  return compressedBuffer;
}
```

**Parameters:** | Parameter | Type | Required | Description |
|---|---|---|---|
| `buffer` | `ArrayBuffer` | Yes | The raw image data as an `ArrayBuffer`. | **Returns:** `Promise<Buffer>` - A `Promise` that resolves to a `Buffer` containing the compressed image data in WebP format.

**Dependencies:**
* `sharp`

---


## Middleware



### Clerk Authentication Middleware


**Source:** `omar-mostafa205-Planna-aea2b49/src/middleware.ts`

**Purpose:** This middleware from Clerk handles session management and authentication for the entire application. It ensures that user authentication state is available across both pages and API routes.

**Implementation:**
```typescript
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
```

**Applied To:**
The middleware is applied to all routes matching the `matcher` config, which includes all API routes (`/api/*`) and application pages, while excluding static assets and Next.js internal paths.

---


## Validation


**Validation Library:** Zod


### Client Profile Form Schema


This schema is used on the **client-side** to validate user input before submitting the form to the `POST /api/generate-plan` endpoint. The backend API endpoint does not currently re-validate this data.

**Source:** `omar-mostafa205-Planna-aea2b49/src/components/Form.tsx`
```typescript
const formSchema = z.object({
  // Client Information
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters long" }),
  age: z.string().refine((val) => /^\d+$/.test(val) && parseInt(val) > 0 && parseInt(val) < 150, {
    message: "Age must be a valid number between 1 and 149"
  }),
  height: z.string().refine((val) => /^\d+$/.test(val) && parseInt(val) > 0 && parseInt(val) < 300, {
    message: "Height must be a valid number in cm"
  }),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Gender is required" }),
  activityLevel: z.enum(["Sedentary", "Lightly active", "Active", "Very active"], {
    required_error: "Activity level is required",
  }),
  goals: z.string().min(5, { message: "Please enter the client's goals." }),
  medicalConditions: z.string().optional(),
  images: z.array(z.instanceof(File)).min(1, {
    message: 'Design image is required',
  }),
});
```

**Used In:**
* The form component in `omar-mostafa205-Planna-aea2b49/src/components/Form.tsx`.

---


## Configuration & Environment


**Environment Variables Used:** | Variable | Used In | Purpose |
|---|---|---|
| `OPENROUTER_API_KEY` | `src/app/api/generate-plan/route.ts` | API key for OpenRouter to access OpenAI models. |
| `STRIPE_SECRET_KEY` | `src/lib/stripe.ts`, `src/app/api/webhook/stripe/route.ts` | Secret key for authenticating with the Stripe API. |
| `STRIPE_WEBHOOK_KEY` | `src/app/api/webhook/stripe/route.ts` | Secret key for verifying incoming Stripe webhooks. |
| `NEXT_PUBLIC_STRIPE_PREMIUM` | `src/app/api/check-out/route.ts`, `src/lib/constants.ts` | Stripe Price ID for the "Premium" subscription plan. |
| `NEXT_PUBLIC_STRIPE_BASIC` | `src/app/api/check-out/route.ts`, `src/lib/constants.ts` | Stripe Price ID for the "Basic" subscription plan. |
| `NEXT_PUBLIC_URL` | `src/app/api/check-out/route.ts` | The base URL of the application, used for Stripe success/cancel URLs. | ---


## Limitations of This Documentation


-   Generated from static code analysis of AST.
-   Runtime behavior may differ from static analysis.
-   The `schema.prisma` file was not included in the AST, so the Data Models section is based on inference from database queries. The actual schema may contain additional fields, constraints, or relations.
-   Dynamic routes or programmatically generated endpoints may not be captured.
-   Environment-specific configurations may not be visible.
-   **This documentation only includes what exists in the provided code.**

---


## Recommendations for Improvement


-   **Missing Database Schema:** The Prisma schema file (`schema.prisma`) should be included in the analysis for accurate data modeling.
-   **Backend Validation:** The `POST /api/generate-plan` endpoint implicitly trusts the `FormData` from the client. It should implement its own server-side validation (e.g., using Zod) to ensure data integrity and security.
-   **Webhook Security:** The `POST /api/webhook/clerk` endpoint does not appear to verify webhook signatures, which is a critical security practice to prevent unauthorized requests.
-   **Authentication on Checkout:** The `POST /api/check-out` endpoint accepts `userId` from the request body without verifying the user's session. This could allow one user to initiate a checkout session for another. This endpoint should be protected with `auth()`.
