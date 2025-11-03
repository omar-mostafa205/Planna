`    ### 2. Database Models/Schemas
    **Look for:**
    - Prisma: \`schema.prisma\` model definitions - Mongoose: \`mongoose.Schema\` definitions - TypeORM: Entity classes with decorators - Drizzle: Table definitions - Raw SQL: CREATE TABLE statements

    **Required evidence:** Model name, field definitions with types
    **Extract:** Field names, types, constraints, indexes, relationships (foreign keys, relations)

    ### 3. Request/Response Types
    **Look for:**
    - TypeScript interfaces and types
    - Zod schemas (\`z.object()\`)
    - Joi schemas
    - Class-validator decorators
    - JSDoc type annotations

    **Required evidence:** Type name and property definitions
    **Extract:** Exact type definitions, validation rules, optional vs required fields

    ### 4. Authentication & Authorization
    **Look for:**
    - Auth middleware functions
    - JWT sign/verify code
    - Session handling
    - Passport.js strategies
    - Auth route handlers (\`/login\`, \`/register\`)
    - Role/permission checks

    **Required evidence:** Actual implementation code
    **Extract:** Auth method, token handling, protected route patterns

    ### 5. Business Logic & Services
    **Look for:**
    - Service layer functions
    - Utility functions
    - Database query builders
    - Transaction handling
    - Background job definitions

    **Required evidence:** Function definitions with clear purpose
    **Extract:** Function signatures, parameters, return types, dependencies

    ---

    ## Documentation Structure:

    Generate documentation in the following format. **Include a section ONLY if you find relevant code in the AST.**

    ---

    # API Reference Documentation

    ## Overview

    **Technology Stack:**
    [List ONLY technologies actually detected in AST: Express, Prisma, TypeScript, etc.]

    **Base URL:** [Extract from config files or environment variables if present, otherwise omit]

    **API Version:** [From package.json if present, otherwise omit]

    **Summary:**
    [2-3 sentences describing what this API does based on the actual routes, models, and services found. Be specific and factual.]

    ---

    ## Authentication

    [⚠️ ONLY INCLUDE THIS SECTION IF AUTH CODE EXISTS IN AST]

    ### Authentication Method

    **Type Detected:** [JWT / Session / OAuth / API Key / Basic Auth - based on actual code]

    **Implementation Location:** \`[actual file path]\`

    **How Authentication Works:**
    [Describe based on actual implementation found in code]

    **Code Reference:**
    \`\`\`typescript
    // [Actual auth middleware or function from AST]
    \`\`\`

    ### Authentication Flow

    [Describe ONLY the actual auth endpoints/flow found in code]

    **Login Endpoint:** [If exists, document the actual endpoint]

    \`\`\`typescript
    // Actual route handler code
    \`\`\`

    **Token Usage:**
    [Show how tokens are actually validated in the codebase]

    \`\`\`typescript
    // Actual middleware code
    \`\`\`

    ### Authorization

    [ONLY if role/permission checks exist in code]

    **Roles Found in Code:**
    [List actual roles extracted from code: enums, constants, or string literals]

    **Permission Checks:**
    \`\`\`typescript
    // Actual permission checking code
    \`\`\`

    [If NO auth found: "⚠️ No authentication system found in the provided codebase."]

    ---

    ## API Endpoints

    [⚠️ Document EVERY endpoint found in AST. If none found, state: "No API endpoints found in codebase."]

    ### [Group endpoints by resource/domain if clear from code]

    #### \`[METHOD] /actual/path/:param\`

    **Source:** \`[actual file path:line number]\`

    **Description:** [Infer from handler name, comments, or logic - be factual]

    **Authentication Required:** [Yes/No - based on middleware]

    **Authorization:** [Required roles if checks exist in code]

    **Route Handler:**
    \`\`\`typescript
    // Actual handler code from AST (or relevant snippet)
    \`\`\`

    **Path Parameters:**
    [Extract from route definition: \`:userId\`, \`:id\`, etc.]

    | Parameter | Type | Description |
    |-----------|------|-------------|
    | [param] | [infer type] | [purpose based on usage in code] |

    **Query Parameters:**
    [Extract from code: \`req.query.page\`, validation schemas, etc.]

    | Parameter | Type | Required | Default | Description |
    |-----------|------|----------|---------|-------------|
    | [param] | [type] | [Yes/No] | [from code] | [from validation or usage] |

    **Request Body Schema:**

    [If Zod schema exists:]
    \`\`\`typescript
    // Actual Zod schema from code
    \`\`\`

    [If TypeScript interface exists:]
    \`\`\`typescript
    // Actual interface from code
    \`\`\`

    [If no schema found: "No request schema defined in code."]

    **Request Example:**
    [ONLY if you can construct this from actual schema/types - otherwise omit]

    \`\`\`bash
    curl -X [METHOD] [BASE_URL]/actual/path \\
      -H "Content-Type: application/json" \\
      [if auth exists: -H "Authorization: Bearer TOKEN"] \\
      -d '[actual JSON based on schema]'
    \`\`\`

    **Response Schema:**

    [Extract from return type, response object construction, or type annotations]

    \`\`\`typescript
    // Actual response type or interface from code
    \`\`\`

    **Success Response Example:**
    [ONLY if you can derive from code - otherwise omit]

    \`\`\`json
    {
      // Structure based on actual response object in handler
    }
    \`\`\`

    **Error Responses:**

    [Extract from actual error handling code in the handler]

    | Status Code | Condition | Response |
    |-------------|-----------|----------|
    | [code] | [from actual error handling] | [actual error format] |

    **Error Handling Code:**
    \`\`\`typescript
    // Actual error handling from route handler
    \`\`\`

    **Database Operations:**
    [List actual DB queries in this handler:]
    - Reads from: [actual tables/collections]
    - Writes to: [actual tables/collections]
    - Uses transaction: [Yes/No - if evident from code]

    **Side Effects:**
    [ONLY document if clear from code:]
    - [e.g., "Sends email via sendEmail() function"]
    - [e.g., "Triggers webhook to external service"]
    - [e.g., "Enqueues job in queue"]

    **Related Endpoints:**
    [Link to other endpoints found that operate on same resource]
    - \`[METHOD] /path\` - [purpose]

    ---

    [Repeat for each endpoint found]

    ---

    ## Data Models

    [⚠️ Document EVERY model/schema found. If none: "No database models found in codebase."]

    ### [ModelName]

    **Source:** \`[actual file path]\`

    **Database Table/Collection:** \`[actual table name from code]\`

    **Schema Definition:**

    [For Prisma:]
    \`\`\`prisma
    // Exact schema from schema.prisma
    \`\`\`

    [For Mongoose:]
    \`\`\`typescript
    // Actual Mongoose schema definition
    \`\`\`

    [For TypeORM:]
    \`\`\`typescript
    // Actual Entity class with decorators
    \`\`\`

    [For SQL:]
    \`\`\`sql
    -- Actual CREATE TABLE statement if found
    \`\`\`

    **TypeScript Interface:**
    \`\`\`typescript
    // Actual generated or defined type from codebase
    \`\`\`

    **Field Details:**

    | Field | Type | Required | Default | Constraints |
    |-------|------|----------|---------|-------------|
    | [field] | [actual type] | [Yes/No] | [from schema] | [validations from code] |

    **Relationships:**

    [ONLY document relationships explicitly defined in schema]

    | Field | Relationship | Target Model | Description |
    |-------|--------------|--------------|-------------|
    | [field] | [One-to-Many/Many-to-One/etc.] | [Model] | [from schema definition] |

    **Indexes:**
    [Extract from actual schema:]
    - [List actual indexes defined]

    **Validation Rules:**
    [Extract from Zod schemas, class-validator, or schema constraints]
    - \`field\`: [actual validation rules from code]

    **Hooks/Middleware:**
    [If model hooks exist (Mongoose pre/post, Prisma middleware)]
    \`\`\`typescript
    // Actual hook code
    \`\`\`

    ---

    [Repeat for each model]

    ---

    ## Type Definitions

    [⚠️ Document significant shared types. If none: "No shared type definitions found."]

    ### [TypeName]

    **Source:** \`[file path]\`

    **Definition:**
    \`\`\`typescript
    // Exact type/interface definition from code
    \`\`\`

    **Used By:**
    [List files/functions that import this type - if easily determinable]

    **Related Types:**
    [List types referenced within this type]

    ---

    ## Business Logic & Services

    [⚠️ Document service layer functions. If none: "No service layer found in codebase."]

    ### [ServiceName / FileName]

    **Location:** \`[actual file path]\`

    **Purpose:** [Infer from filename, exports, and function names]

    #### \`functionName()\`

    **Signature:**
    \`\`\`typescript
    // Actual function signature from code
    \`\`\`

    **Implementation:**
    \`\`\`typescript
    // Relevant portions of actual implementation
    \`\`\`

    **Parameters:**

    | Parameter | Type | Required | Description |
    |-----------|------|----------|-------------|
    | [param] | [actual type] | [Yes/No] | [from JSDoc or infer from usage] |

    **Returns:** \`[actual return type]\` - [describe based on code]

    **Error Handling:**
    [Document actual error throwing/handling in function]
    \`\`\`typescript
    // Actual error handling code
    \`\`\`

    **Dependencies:**
    [List external services, database models, other functions called]

    **Database Queries:**
    [List actual database operations performed]

    ---

    ## Middleware

    [⚠️ ONLY if middleware functions exist]

    ### [Middleware Name]

    **Source:** \`[file path]\`

    **Purpose:** [Describe based on code]

    **Implementation:**
    \`\`\`typescript
    // Actual middleware function
    \`\`\`

    **Applied To:**
    [List routes that use this middleware - if determinable]

    **Execution Order:** [If multiple middleware in chain]

    ---

    ## Error Handling

    [⚠️ ONLY if custom error handling exists]

    **Error Classes Defined:**

    \`\`\`typescript
    // Actual error class definitions from code
    \`\`\`

    **Error Handler Middleware:**

    \`\`\`typescript
    // Actual error handling middleware
    \`\`\`

    **Error Response Format:**
    [Show actual error response structure from error handler]

    \`\`\`typescript
    // Actual error response format
    \`\`\`

    [If none found: "No custom error handling found. Using default framework error handling."]

    ---

    ## Validation

    [⚠️ ONLY if validation schemas exist]

    **Validation Library:** [Zod / Joi / class-validator / etc. - from actual imports]

    **Validation Schemas:**

    [For each significant validation schema:]

    ### [Schema Name]

    **Source:** \`[file path]\`

    \`\`\`typescript
    // Actual validation schema definition
    \`\`\`

    **Used In:** [Endpoints/functions that use this schema]

    ---

    ## Rate Limiting

    [⚠️ ONLY if rate limiting code exists]

    **Implementation:**
    \`\`\`typescript
    // Actual rate limiting middleware/config
    \`\`\`

    **Limits Configured:**
    [Extract from actual configuration]

    ---

    ## Background Jobs / Queues

    [⚠️ ONLY if job/queue code exists]

    **Queue Library:** [Bull / BullMQ / Agenda / etc.]

    ### [Job Name]

    **Source:** \`[file path]\`

    **Job Definition:**
    \`\`\`typescript
    // Actual job processor code
    \`\`\`

    **Triggered By:** [Where job is enqueued in codebase]

    **Payload:**
    \`\`\`typescript
    // Actual job data type from code
    \`\`\`

    ---

    ## Webhooks

    [⚠️ ONLY if webhook sending code exists]

    ### [Event Name]

    **Triggered When:** [Describe based on code where webhook is called]

    **Webhook Code:**
    \`\`\`typescript
    // Actual webhook sending implementation
    \`\`\`

    **Payload:**
    \`\`\`typescript
    // Actual payload structure from code
    \`\`\`

    ---

    ## Configuration & Environment

    **Environment Variables Used:**

    [Extract ALL process.env.* references]

    | Variable | Used In | Purpose |
    |----------|---------|---------|
    | [VAR_NAME] | [file:line] | [infer from usage] |

    **Configuration Files Found:**

    [List config files and their purpose]

    ---

    ## Dependencies

    **Key Dependencies:**

    [Extract from package.json - focus on core API dependencies]

    | Package | Version | Purpose |
    |---------|---------|---------|
    | [package] | [version] | [category: web framework / database / validation / etc.] |

    ---

    ## Code Quality Notes

    **TypeScript Usage:** [Strict / Loose / Mixed - based on tsconfig and code]

    **Error Handling Coverage:** [Observation based on code review]

    **Validation Coverage:** [Which endpoints have validation]

    **Test Files Found:** [List test files if present in AST]

    ---

    ## Limitations of This Documentation

    - Generated from static code analysis of AST
    - Runtime behavior may differ from static analysis
    - Dynamic routes or programmatically generated endpoints may not be captured
    - Environment-specific configurations may not be visible
    - Third-party service integrations may not be fully documented
    - **This documentation only includes what exists in the provided code**

    ---

    ## Recommendations for Improvement

    [Optional section - ONLY if you notice clear gaps or issues in the code:]

    - [e.g., "Many endpoints lack input validation"]
    - [e.g., "No authentication found but endpoints appear to need protection"]
    - [e.g., "Inconsistent error response formats across endpoints"]

`
