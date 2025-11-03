# Planna: AI-Powered Diet Plan Generator

Planna is a full-stack web application built with Next.js that generates personalized diet plans for users based on their physical attributes, goals, and InBody analysis scans. It leverages AI to analyze user data and images, creating detailed, structured meal plans. The application also integrates with Stripe for subscription-based access to premium features and Clerk for robust user authentication.


## Quick Start


This guide provides instructions for setting up and running the Planna project locally.


### Prerequisites


-   Node.js (v18.x or later recommended)
-   npm, yarn, or pnpm
-   A PostgreSQL database (or other Prisma-compatible database)
-   API keys for:
    -   Clerk
    -   Stripe
    -   OpenRouter (for AI models)


### Installation


1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd planna-project
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and populate it with the necessary keys. See the [Environment Variables](#environment-variables) section for a complete list.

4.  **Set up the database:**
    Push the Prisma schema to your database.
    ```bash
    npx prisma db push
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.


## Architecture


Planna is a monolithic application built on the Next.js App Router, combining the frontend and backend into a single project. It follows a server-centric architecture, where API routes handle business logic, database interactions, and communication with external services.


### System Architecture Diagram

```mermaid
graph TD
    subgraph Browser
        A[Next.js Frontend - React]
    end

    subgraph "Next.js Server"
        B[API Routes]
        C[Prisma Client]
        D[Database - PostgreSQL]
    end

    subgraph External_Services [External Services]
        E[Clerk Authentication]
        F[Stripe Payments]
        G[OpenRouter - AI Models]
    end

    A -->|HTTP Requests| B
    B -->|User Auth| E
    B -->|Payments| F
    B -->|AI Plan Generation| G
    B <-->|Database Queries| C
    C <-->|CRUD| D

    E -->|Webhook: user.created| B
    F -->|Webhook: checkout.completed| B
```


### Project Structure


The project follows the standard Next.js App Router layout, with key directories organized by feature and function.
```
/
├── public/                 # Static assets
├── src/
│   ├── app/
│   │   ├── (auth)/         # Clerk authentication pages (sign-in, sign-up)
│   │   ├── (main)/         # Protected application routes
│   │   │   ├── dashboard/  # Displays the generated meal plan
│   │   │   ├── plan-form/  # Form to input data and generate a plan
│   │   │   └── subscription/ # Subscription management page
│   │   ├── api/            # API endpoints
│   │   │   ├── check-out/  # Stripe checkout logic
│   │   │   ├── generate-plan/ # AI plan generation logic
│   │   │   ├── get-plan/   # Fetches the user's meal plan
│   │   │   └── webhook/    # Webhooks for Clerk and Stripe
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Landing page
│   ├── components/
│   │   ├── ui/             # Shadcn UI components
│   │   ├── Form.tsx        # Main form for creating a diet plan
│   │   ├── Hero.tsx        # Landing page hero section
│   │   └── NavBar.tsx      # Application navigation bar
│   ├── hooks/              # Reusable React hooks
│   ├── lib/                # Libraries and utility functions
│   │   ├── prisma.ts       # Prisma client instance
│   │   ├── stripe.ts       # Stripe client instance
│   │   └── utils.ts        # General utility functions
│   └── middleware.ts       # Clerk authentication middleware
├── prisma/
│   └── schema.prisma       # Database schema definition
├── next.config.ts          # Next.js configuration
└── package.json            # Project dependencies and scripts
```


## API Reference


The API is built using Next.js API Routes. All endpoints are located under the `/api` path.


### `POST /api/generate-plan`


Generates a new meal plan using AI based on user-submitted data, including an InBody scan image. It saves the generated plan to the user's profile in the database.

**Authentication:** Required (Clerk)

**Request:**
-   **Content-Type:** `multipart/form-data`
-   **Body:**
    -   `fullName` (string): User's full name.
    -   `age` (string): User's age.
    -   `height` (string): User's height in cm.
    -   `gender` (string): "Male", "Female", or "Other".
    -   `activityLevel` (string): "Sedentary", "Lightly active", "Active", "Very active".
    -   `goals` (string): User's health and fitness goals.
    -   `medicalConditions` (string, optional): Any relevant medical conditions.
    -   `images` (File[]): An array of files, typically a single InBody scan image.

**Response (200):**
```json
{
  "message": "Meal plan generated and saved successfully."
}
```

**Possible Errors:**
-   `401 Unauthorized`: User is not authenticated.
-   `400 Bad Request`: Form data is missing or invalid.
-   `500 Internal Server Error`: Failed to generate plan from AI or save to the database.


### `GET /api/get-plan`


Retrieves the currently saved meal plan for the authenticated user.

**Authentication:** Required (Clerk)

**Request:**
-   No body, query, or path parameters.

**Response (200):**
- Returns the JSON object of the meal plan stored in the database.
```json
{
  "calories": 2500,
  "protein": 180,
  "carbs": 250,
  "fat": 80,
  "meals": {
    "breakfast": { "...details" },
    "lunch": { "...details" },
    "dinner": { "...details" },
    "snack": { "...details" }
  }
}
```

**Possible Errors:**
-   `401 Unauthorized`: User is not authenticated.
-   `404 Not Found`: No meal plan exists for the user.
-   `500 Internal Server Error`: Database query failed.


### `POST /api/check-out`


Creates a Stripe Checkout session for a user to purchase a subscription.

**Authentication:** Required (Clerk)

**Request:**
-   **Body:**
    ```json
    {
      "planType": "basic" | "premium",
      "userId": "user_...",
      "email": "user@example.com"
    }
    ```

**Response (200):**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

**Possible Errors:**
-   `400 Bad Request`: Invalid request body or missing Stripe price ID.
-   `500 Internal Server Error`: Failed to create Stripe session.


### `POST /api/webhook/clerk`


Webhook endpoint to handle user events from Clerk. It creates or updates a user profile in the local database when a user signs up or their data changes in Clerk.

**Authentication:** Webhook signature verification (handled by Clerk library).

**Request:**
-   Clerk `user.created` or `user.updated` event payload.

**Response (200):**
```json
{
  "status": "success"
}
```


### `POST /api/webhook/stripe`


Webhook endpoint to handle subscription events from Stripe, such as successful payments or cancellations. It updates the user's subscription status in the database.

**Authentication:** Webhook signature verification.

**Request:**
-   Stripe event payload (e.g., `checkout.session.completed`, `invoice.payment_failed`).

**Response (200):**
-   An empty response with a 200 status code to acknowledge receipt of the event.


## Database & Data Models


The application uses Prisma as its ORM to interact with a PostgreSQL database.


### Data Models


Based on the application's logic, the primary data model is `Profile`.
```prisma
// Inferred from code in prisma/schema.prisma

model Profile {
  id                   String    @id @default(cuid())
  userId               String    @unique // Clerk User ID
  email                String
  mealPlan             Json?
  subscriptionActive   Boolean   @default(false)
  subscriptionTier     String?   // e.g., "basic", "premium"
  stripeSubscriptionId String?   @unique
}
```


### Entity Relationship Diagram

```mermaid
erDiagram
    Profile {
        string id PK
        string userId UK "Clerk User ID"
        string email
        json mealPlan
        boolean subscriptionActive
        string subscriptionTier
        string stripeSubscriptionId UK
    }
```


## Core Components



### `ProfileForm`


**Location:** `src/components/Form.tsx`
**Purpose:** A comprehensive form for users to input their personal data, health goals, and upload their InBody scan. It uses `react-hook-form` for state management and `zod` for validation.

**Usage:**
```tsx
import { ProfileForm } from '@/components/Form';

<ProfileForm />
```

**State & Logic:**
-   Manages form state using `useForm`.
-   Defines a `zod` schema (`formSchema`) for client-side and server-side validation.
-   The `onSubmit` handler constructs a `FormData` object and sends a `POST` request to `/api/generate-plan`.
-   Uses the `sonner` library to display toast notifications for success and error states.


### `Dashboard Page`


**Location:** `src/app/(main)/dashboard/page.tsx`
**Purpose:** Displays the user's generated meal plan in a structured and readable format.

**State & Logic:**
-   Uses `@tanstack/react-query`'s `useQuery` hook to fetch meal plan data from the `/api/get-plan` endpoint.
-   Handles loading, error, and success states from the query.
-   If no plan is found, it prompts the user to create one.
-   Renders the meal plan details, including macronutrient totals and individual meal recipes.


### `Subscription Page`


**Location:** `src/app/(main)/subscription/page.tsx`
**Purpose:** Shows available subscription tiers and allows users to initiate the payment process.

**State & Logic:**
-   Uses `@tanstack/react-query`'s `useMutation` hook to handle the subscription process.
-   When a user clicks a subscription button, the `handleSubscribe` function triggers the mutation.
-   The mutation function sends a `POST` request to `/api/check-out`.
-   On success, it redirects the user to the Stripe Checkout URL returned by the API.


## Advanced Features



### Authentication


User authentication is managed by **Clerk**.
-   **Middleware:** `src/middleware.ts` uses `clerkMiddleware` to protect application routes.
-   **Session Management:** Clerk's Next.js SDK handles user sessions and provides hooks like `useUser` and server-side helpers like `auth()` to access user data.
-   **Database Sync:** The `/api/webhook/clerk` endpoint ensures that a `Profile` record is created in the local database for every new Clerk user, keeping user data synchronized.


### AI Integration


The core AI logic resides in the `POST /api/generate-plan` route.
-   **Service:** It uses OpenAI models via the **OpenRouter** API.
-   **Image Analysis (Vision):** When an InBody scan is uploaded, the image is compressed using `sharp`, converted to base64, and sent to a vision-capable AI model to extract key metrics like body fat percentage and muscle mass.
-   **Plan Generation (Language Model):** The extracted metrics, along with the user's form data, are compiled into a detailed prompt. This prompt is sent to a language model with a request for a JSON-formatted response, which becomes the user's meal plan.


### Payments & Subscriptions


Payments are handled by **Stripe**.
-   **Checkout:** The `/api/check-out` route uses the Stripe Node.js library to create a `checkout.session`.
-   **Webhook Handling:** The `/api/webhook/stripe` endpoint listens for critical events from Stripe. It securely verifies the webhook signature and updates the `Profile` model in the database to reflect the user's current subscription status (e.g., setting `subscriptionActive` to `true` after a successful payment).


## Configuration



### Environment Variables


Create a `.env.local` file in the project root with the following variables:
```bash
# Database URL for Prisma

DATABASE_URL="postgresql://user:password@host:port/database"


# Clerk Authentication

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/plan-form


# Stripe Payments

NEXT_PUBLIC_STRIPE_BASIC=price_...
NEXT_PUBLIC_STRIPE_PREMIUM=price_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_KEY=whsec_...


# AI Service (OpenRouter)

OPENROUTER_API_KEY=sk_...


# Application URL

NEXT_PUBLIC_URL=http://localhost:3000
```


### Configuration Files


-   **`next.config.ts`**: The Next.js configuration file. In this project, it's configured to ignore ESLint and TypeScript errors during the build process, which is useful for rapid prototyping but should be revisited for production.
-   **`tsconfig.json`**: Standard TypeScript configuration for a Next.js project, including path aliases like `@/*` for easier imports.
