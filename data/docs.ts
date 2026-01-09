import { DocSection } from '../types';

export const DOCS_DATA: DocSection[] = [
  {
    id: 'architecture',
    title: '1. Architecture Overview',
    pages: [
      {
        id: 'system-architecture',
        title: '1.1 System Architecture',
        content: [
          { type: 'header', value: 'Architectural Overview' },
          { type: 'text', value: 'GenCodify Studio is an open-source visual development platform built on a modern microservices architecture. The system follows a strict separation of concerns between the **Builder Environment** (authoring experience) and the **Runtime Environment** (published sites), enabling optimal performance and developer experience.' },
          { type: 'header', value: 'Core Architectural Principles' },
          { type: 'list', value: [
            '**Separation of Concerns**: Complete isolation between builder and runtime ensures published sites are lightweight and fast',
            '**Monorepo Organization**: pnpm workspaces enable code sharing, type safety, and unified dependency management',
            '**Server-Side Rendering**: Remix framework provides SSR, SSG, and API routes in a unified architecture',
            '**Type-Safe Communication**: tRPC ensures end-to-end type safety between client and server',
            '**Dual API Strategy**: tRPC for complex business logic, PostgREST for direct CRUD operations',
            '**Atomic State Management**: NanoStores provide predictable state with minimal bundle size',
            '**Real-Time Collaboration**: Yjs CRDTs enable multi-user editing with conflict resolution'
          ] },
          { type: 'header', value: 'System Architecture Diagram' },
          { type: 'mermaid', value: `graph TB
    subgraph "Client Layer"
      BuilderUI["Builder UI<br/>(Remix + React)"]
      Canvas["Canvas Iframe<br/>(Sandboxed Runtime)"]
    end

    subgraph "API Gateway Layer"
      RemixRouter["Remix Router<br/>(SSR + API Routes)"]
      TPRCProxy["tRPC Proxy<br/>(Type-Safe RPC)"]
      PostgREST["PostgREST<br/>(Auto-Generated REST)"]
    end

    subgraph "Business Logic Layer"
      AuthService["Auth Service<br/>(OAuth + JWT)"]
      ProjectService["Project Service<br/>(CRUD + Validation)"]
      BuildService["Build Service<br/>(Compilation + Deploy)"]
      CollabService["Collaboration Service<br/>(Yjs CRDT)"]
      AssetService["Asset Service<br/>(S3/R2 Upload)"]
    end

    subgraph "Data Layer"
      PostgreSQL[(PostgreSQL 15<br/>Primary DB)]
      Prisma["Prisma ORM<br/>(Complex Queries)"]
      PostgRESTDB["PostgREST<br/>(Direct SQL)"]
    end

    subgraph "External Services"
      OAuth["GitHub/Google OAuth"]
      Storage["S3/Cloudflare R2"]
      Publisher["Publisher Service<br/>(Deployment)"]
      CDN["Edge CDN<br/>(Vercel/Cloudflare)"]
    end

    BuilderUI --> RemixRouter
    BuilderUI --> TPRCProxy
    BuilderUI --> PostgREST
    Canvas --> RemixRouter

    RemixRouter --> AuthService
    RemixRouter --> ProjectService
    RemixRouter --> BuildService
    RemixRouter --> CollabService
    RemixRouter --> AssetService

    TPRCProxy --> AuthService
    TPRCProxy --> ProjectService
    TPRCProxy --> BuildService

    PostgREST --> PostgRESTDB

    AuthService --> OAuth
    AuthService --> Prisma
    ProjectService --> Prisma
    BuildService --> Prisma
    CollabService --> Prisma
    AssetService --> Storage

    Prisma --> PostgreSQL
    PostgRESTDB --> PostgreSQL

    BuildService --> Publisher
    Publisher --> CDN` },
          { type: 'header', value: 'Technology Stack' },
          { type: 'text', value: 'GenCodify Studio leverages modern, production-ready technologies across all layers of the stack:' },
          { type: 'code', language: 'text', value: `┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                      │
├─────────────────────────────────────────────────────────────┤
│ Frontend Framework: React 18.3.0 (canary build)             │
│ Meta-Framework:     Remix 2.16.5 (SSR + Routing)            │
│ Build Tool:         Vite 6.3.4 (Dev Server + Bundler)      │
│ Language:           TypeScript 5.8.2 (Strict Mode)          │
│ Styling:            UnoCSS (Wind3 Preset)                   │
│ UI Components:      Radix UI (Headless primitives)          │
│ Icons:              Custom SVG icon system                  │
│ Code Editor:        CodeMirror 6                            │
│ Rich Text:          Lexical                                 │
├─────────────────────────────────────────────────────────────┤
│                    STATE MANAGEMENT                         │
├─────────────────────────────────────────────────────────────┤
│ Client State:       NanoStores (Atomic stores)              │
│ Server State:       Remix Loaders/Actions                   │
│ Forms:              Remix Form + Validations                │
│ Real-Time:          Yjs (CRDT) + WebSocket Provider         │
├─────────────────────────────────────────────────────────────┤
│                    API LAYER                                │
├─────────────────────────────────────────────────────────────┤
│ Type-Safe RPC:      tRPC (End-to-end types)                 │
│ REST API:           PostgREST (Auto-generated from schema)  │
│ HTTP Client:        Custom wrapper (Auth + Retry)           │
│ Authentication:     Remix Auth (OAuth strategies)           │
├─────────────────────────────────────────────────────────────┤
│                    DATA LAYER                               │
├─────────────────────────────────────────────────────────────┤
│ Database:           PostgreSQL 15 (JSONB support)           │
│ ORM:                Prisma (Complex operations)             │
│ Direct Access:      PostgREST (Simple CRUD)                 │
│ Migrations:         Prisma Migrate                          │
├─────────────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE                            │
├─────────────────────────────────────────────────────────────┤
│ Runtime:            Node.js 20 (required)                   │
│ Package Manager:    pnpm 9.14.4 (Workspaces)                │
│ Containerization:   Docker + Docker Compose                 │
│ Deployment:         Vercel/Netlify/SaaS/Docker               │
│ Storage:            S3/Cloudflare R2 (Assets)                │
│ CDN:                Vercel Edge/Cloudflare                   │
└─────────────────────────────────────────────────────────────┘` },
          { type: 'header', value: 'Monorepo Structure' },
          { type: 'text', value: 'The codebase is organized as a pnpm workspace to maximize code sharing, enable unified dependency management, and ensure type safety across package boundaries.' },
          { type: 'code', language: 'text', value: `gencodify_studio/
├── apps/                          # Application layer
│   └── builder/                    # Main visual builder (Remix app)
│       ├── app/
│       │   ├── auth/              # OAuth authentication
│       │   ├── builder/           # Builder UI components
│       │   ├── canvas/            # Canvas iframe logic
│       │   ├── dashboard/         # Dashboard and projects
│       │   ├── routes/            # Remix routes (API + Pages)
│       │   ├── services/          # Business logic services
│       │   └── shared/            # Shared utilities
│       ├── public/                # Static assets
│       └── package.json
│
├── packages/                      # Shared libraries
│   │
│   # Core Infrastructure
│   ├── css-data/                  # CSS property definitions
│   ├── css-engine/                # CSS compilation and runtime
│   ├── html-data/                 # HTML element metadata
│   ├── design-system/             # UI component library
│   │
│   # Authentication & API
│   ├── authorization-token/       # JWT token management
│   ├── trpc-interface/            # tRPC routers and types
│   ├── postgrest/                 # PostgREST client wrapper
│   ├── http-client/               # HTTP utilities
│   │
│   # Runtime & Components
│   ├── react-sdk/                 # Site runtime renderer
│   ├── sdk-components-react/      # Base HTML components
│   ├── sdk-components-react-radix/  # Radix UI wrappers
│   ├── sdk-components-react-remix/  # Remix-specific components
│   ├── sdk-components-react-router/ # Router components
│   ├── sdk-components-animation/    # Animation (EULA required)
│   │
│   # Project Management
│   ├── project/                   # Project domain models
│   ├── project-build/             # Build pipeline
│   ├── domain/                    # Domain validation
│   ├── template/                  # Project templates
│   │
│   # Assets & Media
│   ├── asset-uploader/            # S3/R2 upload handler
│   ├── image/                     # Image optimization
│   ├── fonts/                     # Font management
│   │
│   # Development Tools
│   ├── icons/                     # SVG icon system
│   ├── feature-flags/             # Feature flag system
│   └── sdk/                       # Shared types and schemas
│
├── fixtures/                      # Test fixtures
├── docker-compose.yml             # Local development stack
├── Dockerfile                     # Production container
├── pnpm-workspace.yaml            # Workspace configuration
└── package.json                   # Root package configuration` },
          { type: 'header', value: 'Request Flow Architecture' },
          { type: 'mermaid', value: `sequenceDiagram
    participant Client as Client Browser
    participant CDN as Edge CDN
    participant Remix as Remix Server
    participant Auth as Auth Service
    participant DB as PostgreSQL
    participant S3 as S3/R2 Storage

    Client->>CDN: HTTP Request
    CDN->>Remix: Forward Request

    alt Protected Route
      Remix->>Auth: Validate Session
      Auth->>DB: Query User/Token
      DB-->>Auth: User Data
      Auth-->>Remix: Auth Context
    end

    alt Data Loading
      Remix->>DB: Load Data (Prisma)
      DB-->>Remix: Query Results
      Remix->>S3: Fetch Assets
      S3-->>Remix: Asset URLs
    end

    Remix->>Remix: Render HTML (SSR)
    Remix-->>CDN: HTML Response
    CDN-->>Client: HTML + Data

    Client->>Client: Hydrate React
    Client->>Remix: tRPC WebSocket
    Remix->>Client: Real-Time Updates` },
          { type: 'header', value: 'Deployment Architecture' },
          { type: 'text', value: 'GenCodify Studio supports multiple deployment strategies optimized for different use cases:' },
          { type: 'list', value: [
            '**SaaS Hosting**: Managed hosting with automatic SSL, CDN, and scaling',
            '**Static Export**: Generate static files for Vercel, Netlify, or generic hosting',
            '**Self-Hosted**: Docker deployment with full control over infrastructure',
            '**Edge Deployment**: CDN-first architecture for global performance'
          ] },
          { type: 'header', value: 'Docker Deployment Architecture' },
          { type: 'code', language: 'text', value: `┌─────────────────────────────────────────────────────────────┐
│                   DOCKER COMPOSE STACK                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  app (gencodify-studio:latest)                      │    │
│  │  - Builder Application (Remix + Vite)               │    │
│  │  - Port: 3001 (external) / 3000 (internal)          │    │
│  │  - Depends: db (healthy), rest (started)           │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  rest (postgrest/postgrest:v12.2.0)                 │    │
│  │  - Auto-generated REST API                          │    │
│  │  - Port: 3000 (internal)                            │    │
│  │  - Depends: db (healthy)                            │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  db (ghcr.io/supabase/postgres:15.1.1.55)           │    │
│  │  - PostgreSQL 15 with pgbouncer                     │    │
│  │  - Port: 5432                                       │    │
│  │  - Volume: postgres-data                            │    │
│  │  - Health Check: pg_isready every 10s               │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  Network: gencodify-network (bridge)                          │
│  Volumes: postgres-data (persistent)                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘` },
          { type: 'header', value: 'Security Architecture' },
          { type: 'text', value: 'Multiple layers of security protect the platform and user data:' },
          { type: 'list', value: [
            '**Authentication**: OAuth 2.0 (GitHub, Google) with JWT tokens',
            '**Authorization**: Role-based access control (Owner, Admin, Editor, Viewer)',
            '**API Security**: tRPC provides type-safe, authenticated procedures',
            '**CSRF Protection**: Built-in Remix CSRF token validation',
            '**XSS Prevention**: React escaping and Content Security Policy',
            '**SQL Injection**: Prisma parameterized queries and PostgREST prepared statements',
            '**Asset Security**: S3/R2 signed URLs and access controls',
            '**Canvas Isolation**: Iframe sandboxing prevents untrusted code execution**'
          ] },
          { type: 'header', value: 'Performance Optimization' },
          { type: 'text', value: 'The architecture is designed for optimal performance across all dimensions:' },
          { type: 'code', language: 'text', value: `┌─────────────────────────────────────────────────────────────┐
│                   PERFORMANCE STRATEGIES                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Builder Performance                                         │
│  ├─ Code Splitting: Route-based chunks                      │
│  ├─ Lazy Loading: Components loaded on demand               │
│  ├─ Virtual Scrolling: Large lists efficiently rendered    │
│  └─ Memoization: Expensive computations cached              │
│                                                               │
│  Runtime Performance                                         │
│  ├─ Atomic CSS: Minimal CSS footprint                       │
│  ├─ Tree Shaking: Unused code eliminated                    │
│  ├─ Asset Optimization: Images compressed and formatted     │
│  └─ CDN Distribution: Global edge caching                   │
│                                                               │
│  Database Performance                                        │
│  ├─ Connection Pooling: pgbouncer for efficient connections │
│  ├─ Query Optimization: Indexed columns and EXPLAIN analysis │
│  ├─ Caching: Redis for frequently accessed data             │
│  └─ JSONB Storage: Efficient nested data storage           │
│                                                               │
│  Network Performance                                         │
│  ├─ HTTP/2: Multiplexed requests                           │
│  ├─ Compression: Brotli/Gzip encoding                      │
│  ├─ Edge Caching: Static assets cached at edge              │
│  └─ CDN: Global distribution network                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘` },
          { type: 'header', value: 'Scalability Architecture' },
          { type: 'mermaid', value: `graph LR
    Users["Users"] --> LB["Load Balancer"]
    LB --> App1["App Instance 1"]
    LB --> App2["App Instance 2"]
    LB --> AppN["App Instance N"]

    App1 --> PG["PgBouncer"]
    App2 --> PG
    AppN --> PG

    PG --> Primary[(Primary DB)]
    PG --> Replica1[(Read Replica 1)]
    PG --> Replica2[(Read Replica 2)]

    App1 --> Redis[(Redis Cache)]
    App2 --> Redis
    AppN --> Redis

    App1 --> S3["Shared S3/R2"]
    App2 --> S3
    AppN --> S3` },
          { type: 'header', value: 'Development vs Production' },
          { type: 'text', value: 'The architecture adapts to different environments:' },
          { type: 'code', language: 'text', value: `┌─────────────────────────────────────────────────────────────┐
│              DEVELOPMENT              │        PRODUCTION       │
├──────────────────────────────────────┼─────────────────────────┤
│ Vite Dev Server (HMR)                │ Vite Build (Optimized)   │
│ Self-signed SSL (wstd.dev)           │ Valid SSL (Let's Encrypt)│
│ Hot Module Replacement               │ Static Asset Bundling    │
│ Source Maps Enabled                  │ Source Maps Disabled     │
│ Debug Logging                        │ Structured Logging       │
│ Local PostgreSQL (Docker)            │ Managed PostgreSQL       │
│ Local S3 (MinIO)                     │ Cloud S3/R2              │
│ Loose CORS Policy                    │ Strict CORS Policy       │
│ No Bundle Size Limits                │ Bundle Size Enforcement  │
│ Development Mode Alerts              │ Production Optimizations │
└─────────────────────────────────────────────────────────────┘` }
        ]
      },
      {
        id: 'core-patterns',
        title: '1.2 Core Patterns',
        content: [
          { type: 'header', value: 'Architectural Patterns Overview' },
          { type: 'text', value: 'GenCodify Studio implements a comprehensive set of architectural patterns that enable real-time collaboration, type-safe communication, and optimal performance. These patterns form the foundation of the platform\'s scalability and maintainability.' },
          { type: 'header', value: '1. Split State Management Pattern' },
          { type: 'text', value: 'The application employs a sophisticated "Split State" architecture that separates concerns between transient UI state and persistent project state.' },
          { type: 'mermaid', value: `graph TB
    subgraph "UI State Layer"
      Modal["Modal State<br/>(React State)"]
      Panel["Panel State<br/>(React State)"]
      Dialog["Dialog State<br/>(React State)"]
    end

    subgraph "Project State Layer"
      ProjectStore["$project Atom"]
      PagesStore["$pages Atom"]
      InstancesStore["$instances Atom"]
      PropsStore["$props Atom"]
      StylesStore["$styles Atom"]
      AssetsStore["$assets Atom"]
      BreakpointsStore["$breakpoints Atom"]
    end

    subgraph "Collaboration Layer"
      Awareness["$awareness Atom"]
      SyncClient["Sync Client<br/>(immerhin)"]
      YjsDoc["Yjs Document"]
    end

    subgraph "Data Sources"
      RemixLoader["Remix Loaders"]
      TRPC["tRPC Procedures"]
      PostgREST["PostgREST Queries"]
    end

    Modal --> ProjectStore
    Panel --> ProjectStore
    Dialog --> ProjectStore

    ProjectStore --> Awareness
    Awareness --> SyncClient
    SyncClient --> YjsDoc

    ProjectStore --> RemixLoader
    ProjectStore --> TRPC
    ProjectStore --> PostgREST

    RemixLoader --> ProjectStore
    TRPC --> ProjectStore
    PostgREST --> ProjectStore` },
          { type: 'header', value: 'State Store Architecture' },
          { type: 'text', value: 'NanoStores atoms provide the foundation for reactive state management with minimal bundle size:' },
          { type: 'code', language: 'typescript', value: `// Core project state stores
export const $project = atom<Project | undefined>();
export const $pages = atom<Pages | undefined>();
export const $assets = atom<Assets>(new Map());
export const $instances = atom<Instances>(new Map());
export const $props = atom<Props>(new Map());
export const $dataSources = atom<DataSources>(new Map());
export const $resources = atom(new Map<Resource["id"], Resource>());
export const $breakpoints = atom<Breakpoints>(new Map());
export const $styleSources = atom<StyleSources>(new Map());
export const $styleSourceSelections = atom<StyleSourceSelections>(new Map());
export const $styles = atom<Styles>(new Map());

// Computed stores for derived state
export const $selectedPage = computed(
  [$pages, $awareness],
  (pages, awareness) => {
    if (pages === undefined || awareness === undefined) return;
    return findPageByIdOrPath(awareness.pageId, pages);
  }
);

// Prop values with instance context resolution
export const $propValuesByInstanceSelector = computed(
  [$instances, $props, $selectedPage, $unscopedVariableValues],
  (instances, props, page, unscopedVariableValues) => {
    // Normalize props, resolve expressions, handle actions
    return normalizeProps({ props, assetBaseUrl, assets, pages });
  }
);` },
          { type: 'header', value: 'Real-Time Collaboration Pattern' },
          { type: 'text', value: 'The collaboration system uses a sophisticated sync architecture with leader-follower pattern for conflict resolution:' },
          { type: 'code', language: 'typescript', value: `export class SyncClient {
  clientId = nanoid();
  role: "leader" | "follower";
  object: SyncObject;
  storages: SyncStorage[];

  // Leadership management
  lead() {
    this.role = "leader";
    this.emitter.emit("message", {
      clientId: this.clientId,
      type: "state",
      state: this.object.getState(),
    });
  }

  follow() {
    this.role = "follower";
  }

  // Transactional updates with revert capability
  transact<T>(updater: (state: State) => void) {
    const previousState = this.object.getState();
    try {
      updater(this.object.getState());
      this.emitChanges();
    } catch (error) {
      this.object.setState(previousState);
      throw error;
    }
  }

  // Change tracking and synchronization
  private emitChanges() {
    const changes = this.object.changes;
    this.emitter.emit("message", {
      clientId: this.clientId,
      type: "changes",
      changes,
    });
  }
}` },
          { type: 'header', value: '2. Canvas/Bridge Communication Pattern' },
          { type: 'text', value: 'The builder-canvas relationship uses a secure iframe communication pattern with token-based authentication and API proxying.' },
          { type: 'mermaid', value: `sequenceDiagram
    participant Builder as Builder Window
    participant CanvasAPI as Canvas API Proxy
    participant Iframe as Canvas Iframe
    participant Canvas as Canvas Context

    Builder->>CanvasAPI: canvasApi.methods.update(...)
    CanvasAPI->>Iframe: postMessage({action, token})
    Iframe->>Iframe: Validate Token
    Iframe->>Canvas: Execute Update
    Canvas-->>Iframe: Result
    Iframe-->>Builder: postMessage({result, token})

    Note over Builder,Canvas: Bidirectional Communication<br/>with CSRF-like Token Protection` },
          { type: 'header', value: 'Secure PostMessage API' },
          { type: 'code', language: 'typescript', value: `// Secure pubsub system with token authentication
export const createPubsub = <PublishMap>() => {
  const apiTokenKey = "__webstudio__$__api_token";
  let token = window.self === window.top
    ? getRandomToken()
    : window.top?.[apiTokenKey];

  // Wrap actions with authentication token
  const wrapAction = (action: unknown) => {
    return { action, token };
  };

  // Validate token before processing
  const unwrapAction = (payload: unknown) => {
    if (payload.token !== token) {
      throw new Error("Invalid token");
    }
    return payload.action as Action<keyof PublishMap>;
  };

  // Bidirectional communication
  return {
    publish: <Type extends keyof PublishMap>(
      type: Type,
      data: PublishMap[Type]
    ) => {
      window.parent.postMessage(wrapAction({ type, data }), "*");
    },
    subscribe: <Type extends keyof PublishMap>(
      type: Type,
      handler: (data: PublishMap[Type]) => void
    ) => {
      window.addEventListener("message", (event) => {
        try {
          const action = unwrapAction(event.data);
          if (action.type === type) {
            handler(action.data);
          }
        } catch (error) {
          // Ignore invalid messages
        }
      });
    }
  };
};

// Dynamic API proxy for canvas methods
export const canvasApi = createRecursiveProxy((options) => {
  const api = getIframeApi();
  let currentMethod = api as unknown;

  // Navigate the object path
  for (const key of options.path) {
    currentMethod = currentMethod[key];
  }

  // Call the method with arguments
  return currentMethod.call(null, ...options.args);
});` },
          { type: 'header', value: '3. Authentication & Authorization Pattern' },
          { type: 'text', value: 'Multi-strategy authentication with role-based access control (RBAC) and granular permissions.' },
          { type: 'code', language: 'typescript', value: `// Multi-strategy authenticator
export const authenticator = new Authenticator<SessionData>(
  sessionStorage,
  { throwOnError: true }
);

// GitHub OAuth Strategy
if (env.GH_CLIENT_ID && env.GH_CLIENT_SECRET) {
  const github = new GitHubStrategy({
    clientID: env.GH_CLIENT_ID,
    clientSecret: env.GH_CLIENT_SECRET,
    callbackURL: \`\${callbackOrigin}\${authCallbackPath({ provider: "github" })}\`,
  }, verifyCallback);
  authenticator.use(github, "github");
}

// Google OAuth Strategy
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  const google = new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: \`\${callbackOrigin}\${authCallbackPath({ provider: "google" })}\`,
  }, verifyCallback);
  authenticator.use(google, "google");
}

// Development form strategy (local only)
if (env.DEV_LOGIN === "true") {
  authenticator.use(new FormStrategy({ /* ... */ }), "dev");
}` },
          { type: 'header', value: 'Authorization Token System' },
          { type: 'text', value: 'Project-based authorization with granular permissions for different user roles:' },
          { type: 'code', language: 'typescript', value: `// Default token permissions
export const tokenDefaultPermissions = {
  canClone: true,
  canCopy: true,
  canPublish: true,
};

// Apply permissions based on relation
export const applyTokenPermissions = (
  token: AuthorizationToken
): AuthorizationToken => {
  switch (token.relation) {
    case "viewers":
      return { ...token, canPublish: false };
    case "builders":
      return { ...token, canPublish: false };
    case "administrators":
      return { ...token, canPublish: true };
    case "owners":
      return { ...token, canPublish: true, canDelete: true };
    default:
      return token;
  }
};

// Authorization check in procedures
export const authorizeProject = {
  getProjectPermit: async ({ projectId, permits }, context) => {
    const project = await loadProjectById(projectId, context);
    const token = await getAuthorizationToken(project, context);

    for (const permit of permits) {
      if (token.permit === permit) {
        return { authPermit: permit, authTokenPermissions: token };
      }
    }

    throw new AuthorizationError("Insufficient permissions");
  }
};` },
          { type: 'header', value: 'Permission Hierarchy' },
          { type: 'mermaid', value: `graph TD
    Owner[Owner] --> Admin[Administrator]
    Admin --> Builder[Builder]
    Builder --> Viewer[Viewer]

    Owner -->|canDelete, canPublish, canEdit| P1[Full Access]
    Admin -->|canPublish, canEdit, canClone| P2[Admin Access]
    Builder -->|canEdit, canClone| P3[Edit Access]
    Viewer -->|canView, canCopy| P4[View Access]

    style Owner fill:#90EE90
    style Admin fill:#87CEEB
    style Builder fill:#FFD700
    style Viewer fill:#FFA07A` },
          { type: 'header', value: '4. Data Flow Patterns' },
          { type: 'text', value: 'Tri-layer data flow architecture using Remix loaders, tRPC procedures, and PostgREST for optimal performance and type safety.' },
          { type: 'mermaid', value: `graph LR
    Client[Client Browser]

    subgraph "Remix Layer"
      Loader[Server Loaders]
      Action[Server Actions]
    end

    subgraph "API Layer"
      TRPC[tRPC Router]
      PostgREST[PostgREST Client]
    end

    subgraph "Data Layer"
      Prisma[Prisma ORM]
      DirectSQL[Direct SQL]
      Postgres[(PostgreSQL)]
    end

    Client -->|"Initial Load"| Loader
    Client -->|"Forms"| Action
    Client -->|"Real-Time"| TRPC
    Client -->|"CRUD"| PostgREST

    Loader --> Prisma
    Action --> Prisma
    TRPC --> Prisma
    PostgREST --> DirectSQL

    Prisma --> Postgres
    DirectSQL --> Postgres` },
          { type: 'header', value: 'Remix Data Loading' },
          { type: 'code', language: 'typescript', value: `// Server-side data loading with authorization
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const context = await createContext(request);
  const { projectId } = parseBuilderUrl(request.url);

  // Load project with authorization check
  const project = await projectApi.loadById(projectId, context);

  // Check project permissions
  const authPermit = await authorizeProject.getProjectPermit({
    projectId: project.id,
    permits: ["own", "admin", "build", "edit"] as const,
  }, context);

  // Get token permissions
  const authTokenPermissions = await getAuthTokenPermissions(
    { projectId, authToken: context.authorization.authToken },
    context
  );

  return json({
    projectId: project.id,
    authPermit,
    authTokenPermissions,
    userPlanFeatures,
  });
};

// Client-side hydration
export const clientLoader = async ({
  serverLoader
}: ClientLoaderFunctionArgs) => {
  const serverData = await serverLoader<typeof loader>();
  // Hydrate client state with server data
  $project.set(serverData.project);
  return serverData;
};` },
          { type: 'header', value: 'tRPC Procedures' },
          { type: 'code', language: 'typescript', value: `// Type-safe router with middleware
export const {
  router,
  procedure,
  middleware,
  mergeRouters,
} = initTRPC.context<AppContext>().create();

// Caching middleware
export const createCacheMiddleware = (seconds: number) =>
  middleware(async ({ path, ctx, next }) => {
    ctx.trpcCache.setMaxAge(path, seconds);
    return next({ ctx });
  });

// Protected procedure with authentication
export const protectedProcedure = procedure.use(
  middleware(async ({ ctx, next }) => {
    if (!ctx.authorization?.userId) {
      throw new AuthorizationError("Authentication required");
    }
    return next({ ctx });
  })
);

// Example router with caching and auth
export const projectRouter = router({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .use(createCacheMiddleware(60)) // Cache for 60 seconds
    .query(async ({ ctx, input }) => {
      return ctx.prisma.project.findUnique({
        where: { id: input.id },
        include: { pages: true }
      });
    })
});` },
          { type: 'header', value: '5. Component Architecture Pattern' },
          { type: 'text', value: 'SDK components use a flexible architecture supporting dynamic props, style sources, and variant systems.' },
          { type: 'code', language: 'typescript', value: `// Base component pattern with tag flexibility
export const Box = forwardRef<
  ElementRef<typeof defaultTag>,
  Props
>(({ tag: legacyTag, ...props }, ref) => {
  // Priority: prop > default > legacy
  const tag = getTagFromProps(props) ?? legacyTag ?? defaultTag;
  return createElement(tag, { ...props, ref });
});

// Component metadata for builder integration
export const meta: ComponentMeta = {
  type: "container",
  label: "Box",
  icon: "BoxIcon",
  presetStyles: {
    display: "block",
  },
  props: {
    tag: {
      type: "string",
      options: ["div", "span", "section", "article"],
      default: "div",
      control: "select",
    },
  },
};

// Prop normalization with expressions and actions
export const normalizeProps = ({
  props,
  assetBaseUrl,
  assets,
  pages,
  source,
}: NormalizePropsOptions) => {
  const normalizedProps = new Map<Prop["id"], Prop>();

  for (const prop of props) {
    // Handle prop expressions
    if (prop.type === "expression") {
      const value = evaluateExpression(prop.value, {
        variables,
        dataSources,
        resources,
      });
      normalizedProps.set(prop.id, { ...prop, value });
    }
    // Handle prop actions
    else if (prop.type === "action") {
      const value = createActionHandler(prop.value, {
        actions,
        params,
      });
      normalizedProps.set(prop.id, { ...prop, value });
    }
    // Handle asset references
    else if (prop.type === "asset") {
      const asset = assets.get(prop.value);
      const url = asset ? \`\${assetBaseUrl}\${asset.name}\` : "";
      normalizedProps.set(prop.id, { ...prop, value: url });
    }
    // Handle simple values
    else {
      normalizedProps.set(prop.id, prop);
    }
  }

  return normalizedProps;
};` },
          { type: 'header', value: 'Style Sources System' },
          { type: 'text', value: 'Multi-layer styling system supporting local styles, tokens, and inheritance:' },
          { type: 'code', language: 'typescript', value: `// Style source types
type StyleSource =
  | { type: "token"; id: string; name: string }      // Design tokens
  | { type: "local"; id: string; name: string }      // Local styles
  | { type: "generated"; id: string };               // Generated styles

// Style source selection connects instances to sources
type StyleSourceSelection = {
  instanceId: Instance["id"];
  values: Map<StyleSource["id"], true>;             // Active sources
};

// Style declaration with breakpoint support
type StyleDecl = {
  breakpointId: Breakpoint["id"];
  state: string;                                     // ":hover", ":active", etc.
  property: CssProperty;
  value: StyleValue;
  styleSourceId: StyleSource["id"];
};

// Style resolution algorithm
export const resolveStyles = (
  instance: Instance,
  styleSourceSelections: StyleSourceSelections[],
  styles: StyleDecl[],
  breakpoints: Breakpoint[]
) => {
  const selection = styleSourceSelections.find(
    (s) => s.instanceId === instance.id
  );

  if (!selection) return new Map();

  const resolvedStyles = new Map<CssProperty, StyleValue>();

  // Iterate through style sources in priority order
  for (const [sourceId] of selection.values) {
    const sourceStyles = styles.filter((s) =>
      s.styleSourceId === sourceId &&
      s.breakpointId === getCurrentBreakpoint()
    );

    for (const style of sourceStyles) {
      resolvedStyles.set(style.property, style.value);
    }
  }

  return resolvedStyles;
};` },
          { type: 'header', value: '6. Asset Management Pattern' },
          { type: 'text', value: 'Direct-to-cloud upload system with streaming and optimization.' },
          { type: 'code', language: 'typescript', value: `// S3/R2 client with signature v4
export const createS3Client = (options: S3ClientOptions): AssetClient => {
  const signer = new SignatureV4({
    credentials: {
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.secretAccessKey,
    },
    region: options.region,
    service: "s3",
  });

  const uploadFile: AssetClient["uploadFile"] = async (
    name,
    type,
    data
  ) => {
    // Validate file size
    const maxSize = options.maxUploadSize ?? 10 * 1024 * 1024;
    if (data.size > maxSize) {
      throw new Error("File too large");
    }

    // Generate presigned URL
    const url = await getPresignedUrl({
      bucket: options.bucket,
      key: name,
      expiresIn: 3600,
      method: "PUT",
    });

    // Stream upload directly to S3/R2
    const response = await fetch(url, {
      method: "PUT",
      body: data,
      headers: {
        "Content-Type": type,
        "Content-Length": data.size.toString(),
      },
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return {
      location: options.publicUrl
        ? \`\${options.publicUrl}/\${name}\`
        : \`\${options.endpoint}/\${options.bucket}/\${name}\`,
      status: "uploaded",
      name,
      type,
      size: data.size,
    };
  };

  return { uploadFile };
};` },
          { type: 'header', value: '7. Error Handling Pattern' },
          { type: 'text', value: 'Multi-layer error handling with graceful degradation and user-friendly messages.' },
          { type: 'code', language: 'typescript', value: `// Comprehensive error parser
export const parseError = (error: unknown) => {
  // Handle standard errors
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
    };
  }

  // Handle Remix route errors
  if (isRouteErrorResponse(error)) {
    const parsed = PageError.safeParse(error.data);
    if (parsed.success) {
      return {
        message: parsed.data.message,
        description: parsed.data.description,
        status: error.status,
      };
    }
    return {
      message: error.data || "Route error",
      status: error.status,
    };
  }

  // Handle authorization errors
  if (error instanceof AuthorizationError) {
    return {
      message: "You don't have permission to perform this action",
      status: 403,
    };
  }

  // Handle unknown errors
  return {
    message: JSON.stringify(error ?? "unknown error"),
    status: 1001,
  };
};

// tRPC error handling
export const createErrorResponse = (error: unknown) => ({
  success: false as const,
  error: typeof error === "string"
    ? error
    : String(error?.message || "Unknown error"),
});

// Error boundary component
export const ErrorBoundary = ({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) => {
  const parsedError = parseError(error);

  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <p>{parsedError.message}</p>
      {parsedError.description && (
        <p>{parsedError.description}</p>
      )}
      <button onClick={reset}>Try again</button>
    </div>
  );
};` },
          { type: 'header', value: '8. Routing Pattern' },
          { type: 'text', value: 'File-based routing with nested routes, data loaders, and automatic code splitting.' },
          { type: 'code', language: 'text', value: `Route Structure:
├── _ui.tsx                    # Root layout with auth
├── _ui.(builder).tsx          # Builder main route
├── _ui.dashboard.tsx          # Dashboard route
├── auth.github.tsx            # GitHub OAuth entry
├── auth.github_.callback.tsx  # GitHub OAuth callback
├── rest.assets.tsx            # REST API: /rest/assets/*
├── rest.build.$buildId.tsx    # REST API: /rest/build/:buildId
└── canvas.tsx                 # Canvas iframe route` },
          { type: 'header', value: 'Route Configuration Example' },
          { type: 'code', language: 'typescript', value: `// Builder route with data loading
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const [csrfToken, setCookieValue] = await getCsrfTokenAndCookie(request);
  return json({ csrfToken }, { headers });
};

export const clientLoader = async ({
  serverLoader
}: ClientLoaderFunctionArgs) => {
  const serverData = await serverLoader<typeof loader>();
  updateCsrfToken(serverData.csrfToken);
  return serverData;
};

export default function Builder() {
  const { csrfToken } = useLoaderData<typeof loader>();
  return (
    <Outlet />
  );
}

// REST API route for assets
export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const context = await createContext(request);
  const { projectId } = parseBuilderUrl(request.url);

  const assets = await loadAssetsByProject(projectId, context);
  return json(assets);
}

// Named export for action handling
export const action = async ({ request }: ActionFunctionArgs) => {
  const context = await createContext(request);
  const formData = await request.formData();

  const asset = await uploadAsset(formData, context);
  return json(asset);
};` },
          { type: 'header', value: 'Pattern Summary' },
          { type: 'text', value: 'These architectural patterns provide a robust foundation for building scalable, collaborative applications:' },
          { type: 'list', value: [
            '**Split State**: Clear separation between UI and project state enables optimal performance',
            '**NanoStores**: Minimal bundle size with reactive state management',
            '**Sync Client**: Real-time collaboration with conflict resolution',
            '**Canvas Bridge**: Secure iframe communication with token authentication',
            '**Multi-Strategy Auth**: Flexible authentication with role-based authorization',
            '**Tri-Layer Data Flow**: Remix loaders, tRPC, and PostgREST for optimal data fetching',
            '**Component System**: Flexible SDK with dynamic props and style sources',
            '**Asset Streaming**: Direct-to-cloud uploads with optimization',
            '**Error Boundaries**: Comprehensive error handling at all layers',
            '**File-Based Routing**: Simple routing with automatic code splitting'
          ] }
        ]
      },
      {
        id: 'deployment-arch',
        title: '1.3 Deployment Architecture',
        content: [
          { type: 'text', value: 'GenCodify Studio supports multi-target deployment. The build system abstracts the output format and supports Docker-based deployments with self-signed SSL certificates for development.' },
          { type: 'mermaid', value: `sequenceDiagram
    participant User
    participant Builder
    participant BuildService
    participant Adapter
    participant Vercel
    participant Netlify

    User->>Builder: Publish Project
    Builder->>BuildService: POST /build
    BuildService->>BuildService: Fetch Project JSON
    BuildService->>Adapter: Generate Build Assets
    alt Target: Vercel
        Adapter->>Vercel: Deploy via Vercel API
    else Target: Netlify
        Adapter->>Netlify: Deploy via Netlify API
    else Target: Docker
        Adapter->>Adapter: Build Docker Image
    end
    BuildService-->>Builder: Deployment URL` }
        ]
      }
    ]
  },
  {
    id: 'execution-flows',
    title: '2. Execution Flows',
    pages: [
      {
        id: 'visual-editing',
        title: '2.1 Visual Editing Flow',
        content: [
          { type: 'header', value: 'The Editing Loop' },
          { type: 'text', value: 'When a user drags a component or changes a style, the following flow executes:' },
          { type: 'mermaid', value: `sequenceDiagram
    participant User
    participant CanvasIframe
    participant BuilderHost
    participant Store
    participant CSSEngine

    User->>CanvasIframe: Drag Component
    CanvasIframe->>BuilderHost: postMessage(UPDATE_COORDS)
    BuilderHost->>Store: Update Instance Position
    Store->>BuilderHost: Trigger Re-render
    BuilderHost->>CanvasIframe: postMessage(SYNC_TREE)
    
    User->>BuilderHost: Change Color (Panel)
    BuilderHost->>Store: Update Style Prop
    Store->>CSSEngine: Generate Atomic Class
    CSSEngine->>Store: Return Class Name
    Store->>CanvasIframe: Inject "<style>"` }
        ]
      },
      {
        id: 'publishing-flow',
        title: '2.2 Publishing Flow',
        content: [
          { type: 'header', value: 'Publishing Architecture' },
          { type: 'text', value: 'GenCodify Studio supports multiple deployment destinations: SaaS hosting (Webstudio Cloud), static export, and self-hosted deployments via Docker. The publishing process transforms dynamic projects into production-ready builds.' },
          { type: 'header', value: 'Build System Overview' },
          { type: 'mermaid', value: `graph TD
    Project[Project Data] --> DevBuild[Dev Build]
    DevBuild --> Publish[Publish Trigger]
    Publish --> ProdBuild[Production Build]
    
    subgraph "Build Process"
      ProdBuild --> BuildDB[(Build Database)]
      BuildDB --> Serialize[Serialize Data]
      Serialize --> Styles[Style Processing]
      Serialize --> Components[Component Tree]
      Serialize --> Pages[Pages & Routes]
      Serialize --> Assets[Assets & Resources]
    end

    subgraph "Deployment Destinations"
      Styles --> SaaS[SaaS Hosting]
      Styles --> Static[Static Export]
      Styles --> Docker[Docker Deployment]
    end

    SaaS --> Domains[Custom Domains]
    SaaS --> Wstd[Webstudio Domain]
    Static --> Download[Download ZIP]
    Static --> Vercel[Vercel]
    Static --> Netlify[Netlify]
    Docker --> SelfHost[Self-Hosted]` },
          { type: 'header', value: 'Build Data Structure' },
          { type: 'text', value: 'Each build contains a complete snapshot of the project:' },
          { type: 'code', language: 'typescript', value: `type Build = {
  id: string;
  projectId: string;
  version: number;
  createdAt: string;
  updatedAt: string;

  // Complete project data
  pages: Pages;                    // Pages, folders, routing
  breakpoints: Breakpoint[];       // Responsive breakpoints
  styles: StyleDecl[];             // Style declarations
  styleSources: StyleSource[];     // Style sources (tokens, local)
  styleSourceSelections: StyleSourceSelection[];
  props: Prop[];                   // Component props
  instances: Instance[];           // Component tree
  dataSources: DataSource[];       // Data sources
  resources: Resource[];           // API resources

  // Deployment configuration
  deployment?: Deployment;         // Target destination
  marketplaceProduct: MarketplaceProduct;
};` },
          { type: 'header', value: 'Dev vs Production Builds' },
          { type: 'text', value: 'GenCodify Studio maintains two types of builds:' },
          { type: 'list', value: [
            '**Dev Build**: Created automatically for new projects or when cloning. Has `deployment: null`.',
            '**Production Build**: Created when publishing. Contains deployment configuration and domain settings.'
          ] },
          { type: 'header', value: 'Publishing Process Flow' },
          { type: 'mermaid', value: `sequenceDiagram
    participant User
    participant Builder
    participant API
    participant DB[(Database)]
    participant Publisher

    User->>Builder: Click "Publish"
    Builder->>Builder: Validate Project
    Builder->>Builder: Check Permissions
    Builder->>API: Publish Request
    API->>DB: Load Dev Build
    API->>API: Create Production Build
    API->>Publisher: Trigger Deployment

    alt SaaS Destination
      Publisher->>Publisher: Generate Routes
      Publisher->>Publisher: Optimize Assets
      Publisher->>Domains: Deploy to Domain(s)
      Domains-->>API: Deployment Status
    end

    alt Static Destination
      Publisher->>Publisher: Generate Static Site
      Publisher->>Publisher: Create ZIP Archive
      Publisher-->>Builder: Download URL
      Builder->>User: Trigger Download
    end

    API-->>Builder: Build Status
    Builder-->>User: Publish Confirmation` },
          { type: 'header', value: 'Deployment Destinations' },
          { type: 'text', value: 'GenCodify Studio supports multiple deployment targets:' },
          { type: 'code', language: 'typescript', value: `type Deployment =
  // Static export with downloadable files
  | {
      destination: "static";
      name: string;
      assetsDomain: string;
      templates: ("docker" | "vercel" | "netlify" | "ssg" | "ssg-vercel" | "ssg-netlify")[];
    }
  // SaaS hosting with custom domains
  | {
      destination?: "saas";
      domains: string[];
      assetsDomain?: string;
      excludeWstdDomainFromSearch?: boolean;
    };` },
          { type: 'header', value: 'SaaS Publishing' },
          { type: 'text', value: 'Publish to Webstudio Cloud with automatic SSL and CDN:' },
          { type: 'list', value: [
            '**Free Plan**: 3 publications per day, single Webstudio domain',
            '**Pro Plan**: Unlimited publications, unlimited custom domains',
            '**Domain Management**: Add, verify, and manage custom domains',
            '**SSL Certificates**: Automatically provisioned via Let\'s Encrypt',
            '**CDN**: Global edge network for fast content delivery'
          ] },
          { type: 'header', value: 'Static Export' },
          { type: 'text', value: 'Generate static HTML/CSS/JS files for self-hosting:' },
          { type: 'list', value: [
            '**Docker**: Containerized deployment with Docker Compose',
            '**Vercel**: Optimized for Vercel deployment with specific configuration',
            '**Netlify**: Optimized for Netlify deployment with specific configuration',
            '**Generic SSG**: Platform-agnostic static site generation'
          ] },
          { type: 'header', value: 'Publishing Status Flow' },
          { type: 'code', language: 'typescript', value: `type PublishStatus = "PENDING" | "PUBLISHED" | "FAILED";

// Status tracking with timeout
const PENDING_TIMEOUT = 180000; // 3 minutes

const getPublishStatus = (build: Build) => {
  // If pending for too long, mark as failed
  if (build.publishStatus === "PENDING") {
    const delta = Date.now() - new Date(build.updatedAt).getTime();
    if (delta > PENDING_TIMEOUT) {
      return "FAILED";
    }
  }
  return build.publishStatus;
};` },
          { type: 'header', value: 'Build Optimization' },
          { type: 'text', value: 'The build process includes several optimizations:' },
          { type: 'list', value: [
            '**Cycle Breaking**: Removes circular references in component tree for Slot components',
            '**Style Serialization**: Optimized JSON format for styles and style source selections',
            '**Asset Processing**: Image optimization and CDN upload',
            '**Route Generation**: Efficient Remix route structure',
            '**Code Splitting**: Separate bundles for optimal loading'
          ] },
          { type: 'header', value: 'CLI Publishing' },
          { type: 'text', value: 'For advanced deployments, use the Webstudio CLI:' },
          { type: 'code', language: 'bash', value: `# Install CLI
npx webstudio@latest

# Sync project from builder
npx webstudio sync --project-id <id> --token <token>

# Build and deploy
npx webstudio build
npx webstudio deploy --target docker` },
          { type: 'header', value: 'Domain Configuration' },
          { type: 'text', value: 'Custom domain support with DNS verification:' },
          { type: 'code', language: 'typescript', value: `// Domain validation
const validateProjectDomain = (domain: string) => {
  // Must be a valid domain name
  // Cannot include protocol or path
  // Supports internationalized domain names (IDN)
};` },
          { type: 'header', value: 'Publishing API' },
          { type: 'code', language: 'typescript', value: `// tRPC interface for publishing
export const deploymentRouter = router({
  publish: procedure
    .input(z.object({
      buildId: z.string(),
      builderOrigin: z.string(),
      destination: z.enum(["saas", "static"]),
      branchName: z.string(),
      logProjectName: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Trigger deployment
      // Return success/error
    })
});` }
        ]
      },
      {
        id: 'data-flows',
        title: '2.3 Data Flows',
        content: [
          { type: 'header', value: 'Overview' },
          { type: 'text', value: 'GenCodify Studio implements multiple data flow patterns optimized for different use cases. The architecture separates complex mutations (tRPC) from simple queries (PostgREST/Remix loaders) while maintaining type safety and authorization throughout.' },
          { type: 'mermaid', value: `graph TB
    subgraph "Client Data Layer"
      UI[React Components]
      NanoStores[NanoStores State]
      ReactSDK[React SDK]
    end

    subgraph "Communication Layer"
      TRPC[tRPC Procedures]
      RemixLoaders[Remix Loaders]
      PostgREST[PostgREST Client]
      CanvasBridge[Canvas postMessage Bridge]
    end

    subgraph "Server Data Layer"
      RemixServer[Remix Server]
      TRPCRouter[tRPC Router]
      Procedures[Protected Procedures]
      Prisma[Prisma ORM]
      Postgres[(PostgreSQL)]
    end

    subgraph "External Services"
      S3[S3/R2 Storage]
      OAuth[OAuth Providers]
      YjsSync[Yjs Sync Server]
    end

    UI --> NanoStores
    UI --> TRPC
    UI --> RemixLoaders
    UI --> CanvasBridge
    NanoStores --> ReactSDK
    TRPC --> RemixServer
    RemixLoaders --> RemixServer
    PostgREST --> Postgres
    RemixServer --> TRPCRouter
    TRPCRouter --> Procedures
    Procedures --> Prisma
    Prisma --> Postgres
    CanvasBridge --> CanvasFrame

    style UI fill:#e1f5fe
    style Postgres fill:#fff3e0
    style S3 fill:#f3e5f5` },
          { type: 'header', value: '1. Client-to-Server Data Flows' },
          { type: 'text', value: 'The application uses three primary mechanisms for client-to-server communication, each optimized for specific use cases.' },
          { type: 'header', value: 'tRPC Mutation Flow' },
          { type: 'text', value: 'Used for complex business operations that require authorization checks, validation, and multi-step transactions. All mutations flow through protected procedures with RBAC enforcement.' },
          { type: 'code', language: 'typescript', value: `// Client-side tRPC mutation
import { trpc } from "~/shared/trpc/client";

const publishProject = async (projectId: string) => {
  const result = await trpc.projects.publish.mutate({
    projectId,
    destination: "saas",
    builderOrigin: window.location.origin
  });

  if (result.success) {
    toast.success("Published successfully!");
  }
};

// Server-side protected procedure
export const projectRouter = router({
  publish: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      destination: z.enum(["saas", "static"]),
      builderOrigin: z.string()
    }))
    .use(async ({ ctx, input, next }) => {
      // Authorization Check
      const canPublish = await ctx.authorization.can(
        { projectId: input.projectId },
        "publish"
      );

      if (!canPublish) {
        throw new Error("Unauthorized");
      }

      return next();
    })
    .mutation(async ({ ctx, input }) => {
      // 1. Generate build
      const build = await generateBuild(input.projectId);

      // 2. Deploy to destination
      const deployment = await deployBuild(build, input.destination);

      // 3. Update project status
      return ctx.prisma.project.update({
        where: { id: input.projectId },
        data: {
          latestDeploymentId: deployment.id,
          publishedAt: new Date()
        }
      });
    })
});` },
          { type: 'header', value: 'Remix Loader/Action Flow' },
          { type: 'text', value: 'Used for form submissions and page-level data fetching. Remix loaders provide SSR hydration and progressive enhancement.' },
          { type: 'code', language: 'typescript', value: `// apps/builder/app/routes/_index.tsx
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async (args: LoaderFunctionArgs) => {
  const { request } = args;
  const userId = await getUserId(request);

  // Query projects via Prisma
  const projects = await prisma.project.findMany({
    where: {
      userId,
      deletedAt: null
    },
    orderBy: { updatedAt: "desc" },
    take: 50
  });

  return json({ projects });
};

export default function ProjectsPage() {
  const { projects } = useLoaderData<typeof loader>();

  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}` },
          { type: 'header', value: 'PostgREST Direct Query Flow' },
          { type: 'text', value: 'Used for simple CRUD operations that don\'t require complex authorization. PostgREST provides direct SQL-to-HTTP mapping with built-in filters.' },
          { type: 'code', language: 'typescript', value: `// packages/postgrest/src/client.ts
import { createClient } from "@webstudio-is/postgrest";

const postgrest = createClient({
  baseUrl: process.env.POSTGREST_URL!,
  headers: {
    Authorization: \`Bearer \${token}\`
  }
});

// Direct query with filters
const projects = await postgrest
  .from('projects')
  .select('*')
  .eq('userId', userId)
  .is('deletedAt', null)
  .order('updatedAt', { ascending: false })
  .range(0, 49);` },
          { type: 'header', value: '2. Server-to-Client Data Flows' },
          { type: 'text', value: 'Data flowing from server to client uses three primary patterns: SSR hydration via Remix loaders, real-time updates via polling/WebSocket, and optimistic updates.' },
          { type: 'mermaid', value: `graph LR
    Server[Server] -->|Remix Loader| HTML[HTML + JSON]
    HTML -->|Hydration| React[React App]
    Server -->|Real-time Updates| React
    ClientActions[Client Actions] -->|Optimistic Update| React
    ClientActions -->|Sync with Server| Server` },
          { type: 'header', value: '3. Canvas-to-Builder Data Flow' },
          { type: 'text', value: 'The canvas iframe communicates with the builder window via postMessage API. This is the critical data flow for the visual editing experience.' },
          { type: 'code', language: 'typescript', value: `// apps/builder/app/canvas/use-canvas-bridge.ts
const useCanvasBridge = (canvasRef: React.RefObject<HTMLIFrameElement>) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMessage = (event: MessageEvent) => {
      // Validate origin
      if (event.origin !== canvasOrigin) return;

      const { type, payload } = event.data;

      switch (type) {
        case 'COMPONENT_SELECTED':
          // User clicked component in canvas
          setSelectedInstance(payload.instanceId);
          break;

        case 'STYLES_CHANGED':
          // Styles updated in canvas
          publishStyleChanges(payload);
          break;

        case 'ERROR_OCCURRED':
          // Runtime error in canvas
          showErrorToast(payload.error);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [canvasRef]);

  // Send commands to canvas
  const sendToCanvas = (type: string, payload: unknown) => {
    canvasRef.current?.contentWindow?.postMessage(
      { type, payload },
      canvasOrigin
    );
  };

  return { sendToCanvas };
};` },
          { type: 'header', value: '4. Database Query Flows' },
          { type: 'text', value: 'Database access uses three layers: Prisma ORM for complex queries, PostgREST for simple CRUD, and direct connection pooling for performance.' },
          { type: 'mermaid', value: `graph TD
    App[Application] -->|Complex Queries| Prisma[Prisma ORM]
    App -->|Simple CRUD| PostgREST[PostgREST]
    Prisma -->|Query Builder| Pool[Connection Pool]
    PostgREST -->|Direct SQL| Pool
    Pool -->|PgBouncer| Postgres[(PostgreSQL)]

    Pool -->|Health Check| HealthCheck{OK?}
    HealthCheck -->|No| Retry[Retry Logic]
    Retry --> Pool` },
          { type: 'header', value: 'Prisma Query Flow' },
          { type: 'code', language: 'typescript', value: `// packages/database/src/prisma.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development"
    ? ["query", "error", "warn"]
    : ["error"]
});

// Optimized queries with includes
const getProjectWithDependencies = async (projectId: string) => {
  return prisma.project.findUnique({
    where: { id: projectId },
    include: {
      pages: {
        include: {
          children: true
        }
      },
      props: true,
      styles: true,
      assets: true,
      breakpoints: true
    }
  });
};` },
          { type: 'header', value: '5. Asset Upload Flow' },
          { type: 'text', value: 'Assets are uploaded to S3/R2 storage with optimization and metadata extraction. The flow supports direct browser uploads to avoid server bottlenecks.' },
          { type: 'mermaid', value: `graph TD
    Client[Client] -->|Request Upload| Server[Server]
    Server -->|Generate Presigned URL| S3[S3/R2]
    Server -->|Return URL| Client
    Client -->|Direct Upload| S3
    S3 -->|Confirm Upload| Server
    Server -->|Create Asset Record| DB[(Database)]
    Server -->|Return Asset| Client` },
          { type: 'code', language: 'typescript', value: `// packages/asset-uploader/src/uploader.ts
const uploadAsset = async (file: File) => {
  // 1. Request upload authorization
  const { uploadId, url, fields } = await trpc.assets.requestUpload.mutate({
    filename: file.name,
    contentType: file.type,
    size: file.size
  });

  // 2. Upload directly to S3/R2
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append('file', file);

  await fetch(url, {
    method: 'POST',
    body: formData
  });

  // 3. Confirm upload and get asset record
  const asset = await trpc.assets.confirmUpload.mutate({
    uploadId
  });

  return asset;
};` },
          { type: 'header', value: '6. Authentication Data Flow' },
          { type: 'text', value: 'Authentication uses Remix Auth with OAuth strategies. The flow supports multiple providers with session management via cookies.' },
          { type: 'mermaid', value: `graph TD
    User[User] -->|Click Login| App[Builder App]
    App -->|Redirect| Provider[OAuth Provider]
    Provider -->|Authorization Code| App
    App -->|Exchange Code| Provider
    Provider -->|Access Token| App
    App -->|Create Session| Session[Session Store]
    App -->|Set Cookie| Browser[Browser]
    Browser -->|Subsequent Requests| App
    App -->|Validate Session| Session` },
          { type: 'code', language: 'typescript', value: `// apps/builder/app/services/auth.server.ts
import { authenticator } from "./authenticator";
import { commitSession, getSession } from "./session";

export const login = async (request: Request) => {
  // Redirect to OAuth provider
  return authenticator.authenticate("github", request);
};

export const callback = async (request: Request) => {
  // Handle OAuth callback
  const user = await authenticator.authenticate("github", request);

  // Create session
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", user.id);

  // Set cookie and redirect
  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
};` },
          { type: 'header', value: '7. Real-time Collaboration Flow' },
          { type: 'text', value: 'Collaboration uses Yjs CRDT for conflict-free replicated data types. Multiple users can edit simultaneously without conflicts.' },
          { type: 'mermaid', value: `graph TD
    User1[User 1] -->|Edit| LocalDoc1[Local Yjs Doc]
    User2[User 2] -->|Edit| LocalDoc2[Local Yjs Doc]
    LocalDoc1 -->|Broadcast| SyncServer[Yjs Sync Server]
    LocalDoc2 -->|Broadcast| SyncServer
    SyncServer -->|Merge & Broadcast| LocalDoc1
    SyncServer -->|Merge & Broadcast| LocalDoc2` },
          { type: 'code', language: 'typescript', value: `// packages/collaboration/src/yjs-client.ts
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const ydoc = new Y.Doc();
const provider = new WebsocketProvider(
  "wss://sync.gencodify.dev",
  "project-" + projectId,
  ydoc
);

// Shared document type
const doc = ydoc.getXmlFragment("doc");

// Observe changes
doc.observe((events) => {
  events.forEach((event) => {
    if (event.origin === provider.awareness) {
      // Remote change
      handleRemoteChange(event.changes);
    }
  });
});

// Local change
const insertText = (text: string) => {
  const textNode = new Y.Text(text);
  doc.insert(textNode);
};` },
          { type: 'header', value: '8. Build & Deployment Flow' },
          { type: 'text', value: 'The build and deployment flow generates static assets from the project data and deploys to the configured destination.' },
          { type: 'mermaid', value: `graph TD
    Trigger[Trigger Build] -->|Fetch Project| DB[(Database)]
    DB -->|Project Data| Generator[Static Site Generator]
    Generator -->|Render Pages| Renderer[React Renderer]
    Renderer -->|Generate HTML| HTML[Static HTML]
    Renderer -->|Generate CSS| CSS[Atomic CSS]
    Renderer -->|Collect Assets| Assets[Asset Bundler]

    HTML -->|Package| Build[Build Output]
    CSS -->|Package| Build
    Assets -->|Optimize| Build

    Build -->|Upload| S3[(S3/R2)]
    Build -->|Invalidate| CDN[CDN Cache]
    Build -->|Notify| Webhook[Webhooks]` },
          { type: 'code', language: 'typescript', value: `// packages/build/src/generate.ts
export const generateBuild = async (projectId: string) => {
  // 1. Fetch project data
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      pages: true,
      props: true,
      styles: true,
      assets: true
    }
  });

  // 2. Generate static pages
  const pages = await Promise.all(
    project.pages.map(async (page) => {
      const html = await renderPage(page, project);
      const css = await generateCSS(project.styles);
      return { page, html, css };
    })
  );

  // 3. Generate atomic CSS
  const atomicCSS = generateAtomicCSS(project.styles);

  // 4. Collect and optimize assets
  const assets = await collectAssets(project.assets);

  return {
    pages,
    atomicCSS,
    assets,
    meta: {
      version: generateVersion(),
      timestamp: Date.now()
    }
  };
};` }
        ]
      }
    ]
  },
  {
    id: 'modules',
    title: '3. Module Deep Dives',
    pages: [
      {
        id: 'builder-app',
        title: '3.1 Builder Application',
        content: [
          { type: 'header', value: 'apps/builder' },
          { type: 'text', value: 'The builder application orchestrates the entire editing experience. Built with Remix 2.16.5 and Vite 6.3.4, it manages the two-pane layout (Editor vs Canvas).' },
          { type: 'header', value: 'Canvas Bridge' },
          { type: 'text', value: 'The critical piece is the communication bridge between the editor UI and the user\'s site running in an iframe.' },
          { type: 'code', language: 'typescript', value: `// apps/builder/app/canvas/use-canvas-bridge.ts
useEffect(() => {
  const handleMessage = (event) => {
    if (event.data.type === 'COMPONENT_SELECTED') {
      setSelectedInstance(event.data.instanceId);
    }
  };
  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);` },
          { type: 'header', value: 'Code Editor Integration' },
          { type: 'text', value: 'The builder uses CodeMirror 6 for code editing and Lexical for rich text editing, providing a professional editing experience.' }
        ]
      },
      {
        id: 'css-engine',
        title: '3.2 CSS Engine',
        content: [
          { type: 'header', value: 'packages/css-engine & packages/css-data' },
          { type: 'text', value: 'The CSS Engine is a sophisticated, production-ready system that handles the complexities of modern CSS while providing advanced features like atomic CSS generation, advanced color spaces, and comprehensive media query support.' },
          { type: 'header', value: 'Package Architecture' },
          { type: 'text', value: 'The CSS system is split into two packages:' },
          { type: 'list', value: [
            '**@webstudio-is/css-data**: CSS data structures, property definitions, parsing utilities, and metadata from MDN',
            '**@webstudio-is/css-engine**: Main CSS compilation engine, style sheet management, and atomic CSS generation'
          ] },
          { type: 'header', value: 'Compilation Flow' },
          { type: 'mermaid', value: `graph TD
    Input[Style Object] --> Parser[CSS Parser]
    Parser --> AST[css-tree AST]
    AST --> Shorthand[Shorthand Expander]
    Shorthand --> Prefixer[Vendor Prefixer]
    Prefixer --> Merger[Style Merger]
    Merger --> Atomic[Atomic Generator]
    Atomic --> Output[CSS String]
    
    subgraph "Optional Processing"
    Atomic
    end` },
          { type: 'header', value: 'Core Components' },
          { type: 'text', value: 'The StyleSheet class is the central orchestrator for all CSS rules:' },
          { type: 'code', language: 'typescript', value: `class StyleSheet {
  // Different rule types with optimized storage
  #mediaRules: Map<string, MediaRule>
  #plainRules: Map<string, PlaintextRule>
  #mixinRules: Map<string, MixinRule>
  nestingRules: Map<string, NestingRule>
  #fontFaceRules: Array<FontFaceRule>
  #element: StyleElement
}` },
          { type: 'header', value: 'Rule Types' },
          { type: 'text', value: 'The engine supports multiple rule types:' },
          { type: 'list', value: [
            '**NestingRule**: Handles complex CSS nesting with selectors and media queries',
            '**MediaRule**: Manages media queries with breakpoint logic',
            '**MixinRule**: Reusable style patterns with cached declarations',
            '**PlaintextRule**: Raw CSS injection for custom styles',
            '**FontFaceRule**: Font face declarations for web fonts'
          ] },
          { type: 'header', value: 'Style Value Types' },
          { type: 'text', value: 'The engine uses a comprehensive type system for CSS values:' },
          { type: 'code', language: 'typescript', value: `type StyleValue =
  | ImageValue      // Image URLs and asset references
  | LayersValue     // Comma-separated values (background layers)
  | UnitValue       // Numeric values with units (px, em, rem, etc.)
  | KeywordValue    // CSS keywords (auto, inherit, etc.)
  | FontFamilyValue // Font stacks with fallbacks
  | ColorValue      // Advanced color spaces (sRGB, P3, LAB, OKLCH)
  | RgbValue        // RGB colors
  | UnparsedValue   // Raw CSS strings for custom properties
  | TupleValue      // Space-separated values
  | FunctionValue   // CSS functions (clamp, min, max, etc.)
  | ShadowValue     // Box shadows
  | VarValue        // CSS variables with fallbacks` },
          { type: 'header', value: 'Shorthand Expansion' },
          { type: 'text', value: 'The engine automatically expands shorthand properties:' },
          { type: 'code', language: 'typescript', value: `// Input
{ border: '1px solid red' }

// Automatically expanded to
{
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'red'
}

// Supported shorthands include:
// - border, margin, padding
// - font, background
// - flex, grid
// - animation, transition
// - outline, list-style` },
          { type: 'header', value: 'Atomic CSS Generation' },
          { type: 'text', value: 'The engine can convert traditional CSS to atomic CSS using hash-based class names:' },
          { type: 'code', language: 'typescript', value: `// Atomic CSS generation
const generateAtomic = (sheet: StyleSheet, options: Options) => {
  // Generates deterministic class names
  const atomicHash = hash(
    descendantSuffix + breakpoint + selector + property + value
  );
  const className = \`c\${atomicHash}\`;

  // Returns: .c1a2b3c { color: red; }
};

// Features:
// - Deterministic class generation
// - Selective atomic conversion (per-rule or global)
// - Performance optimized with caching` },
          { type: 'header', value: 'Vendor Prefixing' },
          { type: 'text', value: 'Automatic vendor prefixing for cross-browser compatibility:' },
          { type: 'code', language: 'css', value: `/* Input */
.user-select {
  user-select: none;
}

/* Output with prefixes */
.user-select {
  -webkit-user-select: none;
  user-select: none;
}

/* Supported prefixes: */
/* -webkit-background-clip */
/* -webkit-backdrop-filter */
/* And many more */` },
          { type: 'header', value: 'Media Query System' },
          { type: 'text', value: 'Advanced media query handling for responsive design:' },
          { type: 'code', language: 'typescript', value: `// Media query parsing and comparison
const media = parseMediaQuery('min-width: 768px');

// Features:
// - Breakpoint parsing (min-width, max-width)
// - Media query comparison and sorting
// - Cross-browser support
// - Proper cascade and specificity` },
          { type: 'header', value: 'Style Merging' },
          { type: 'text', value: 'Intelligent property merging for optimized CSS output:' },
          { type: 'code', language: 'typescript', value: `// Input
{
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'red'
}

// Merged output
{
  border: '1px solid red'
}

// Optimizations include:
// - Border consolidation
// - Box model optimization
// - White space normalization` },
          { type: 'header', value: 'Advanced Features' },
          { type: 'list', value: [
            '**CSS Custom Properties**: Full support with fallbacks and runtime resolution',
            '**Advanced Color Spaces**: sRGB, P3, LAB, OKLCH with proper conversion',
            '**Image Handling**: Asset-based values with URL sanitization',
            '**Typography System**: Font stack optimization and system font integration',
            '**Performance Optimizations**: Multi-level caching, dirty tracking, smart invalidation'
          ] },
          { type: 'header', value: 'API Surface' },
          { type: 'code', language: 'typescript', value: `// Core functionality
export { StyleSheet, createStyleSheet }
export { mergeStyles, prefixStyles }
export { generateAtomic }

// Utilities
export { hyphenateProperty, toValue }
export { matchMedia, equalMedia, compareMedia }

// Types
export type { StyleValue, CssProperty, StyleMap }
export type { MediaRuleOptions, NestingRule }` }
        ]
      },
      {
        id: 'react-sdk',
        title: '3.3 React SDK',
        content: [
          { type: 'header', value: 'packages/react-sdk' },
          { type: 'text', value: 'The runtime engine built on React 18.3.0. It takes the project JSON and renders React components. It handles hydration and event binding.' },
          { type: 'code', language: 'typescript', value: `// packages/react-sdk/src/components/component-renderer.tsx
export const ComponentRenderer = ({ instance }) => {
  const Component = getComponent(instance.component);
  const props = resolveProps(instance.props);
  const styles = resolveStyles(instance.id);
  
  return <Component {...props} className={styles} />;
}` }
        ]
      },
      {
        id: 'sdk-components',
        title: '3.4 SDK Components',
        content: [
          { type: 'header', value: 'packages/sdk-components-*' },
          { type: 'text', value: 'We maintain multiple component libraries:' },
          { type: 'list', value: [
            'sdk-components-react: Basic HTML primitives (Box, Text, Link).',
            'sdk-components-react-radix: Interactive components (Dialog, Tabs, Tooltip) built with Radix UI.',
            'sdk-components-react-remix: Framework specific (Link, Form).',
            'sdk-components-react-router: Router components.',
            'sdk-components-animation: Animation components (proprietary, requires EULA).'
          ] },
          { type: 'header', value: 'Component Metadata' },
          { type: 'text', value: 'Every component exports a metadata definition used by the builder to generate the properties panel.' },
          { type: 'code', language: 'typescript', value: `export const meta: ComponentMeta = {
  props: {
    target: {
      type: 'string',
      options: ['_self', '_blank']
    }
  }
}` }
        ]
      },
      {
        id: 'build-system',
        title: '3.5 Build System',
        content: [
          { type: 'header', value: 'packages/project-build' },
          { type: 'text', value: 'Handles the logic of converting a project tree into a buildable Remix app. Uses Vite 6.3.4 for the build process.' },
          { type: 'mermaid', value: `graph TD
    Input[Project Tree] --> RouteGen[Route Generator]
    RouteGen --> FileSys[Virtual File System]
    FileSys --> Vite["Vite Build"]
    Vite --> Output[Dist Folder]` }
        ]
      },
      {
        id: 'database',
        title: '3.6 Database Architecture',
        content: [
          { type: 'header', value: 'packages/prisma-client' },
          { type: 'text', value: 'We use PostgreSQL 15 with dual access methods: Prisma ORM for complex operations and PostgREST for direct REST API access. The schema relies heavily on JSONB columns to store the flexible component tree structure.' },
          { type: 'code', language: 'prisma', value: `model Project {
  id        String   @id @default(cuid())
  ownerId   String
  assets    Asset[]
  // The entire page structure is versioned
  tree      Json
  styles    Json
}` }
        ]
      },
      {
        id: 'api-layer',
        title: '3.7 API Layer',
        content: [
          { type: 'header', value: 'API Architecture' },
          { type: 'text', value: 'The API layer provides dual access patterns: type-safe tRPC for complex operations and PostgREST for direct CRUD.' },
          { type: 'header', value: 'tRPC Interface' },
          { type: 'text', value: 'Defines the router, procedures, and types shared between the backend and frontend.' },
          { type: 'mermaid', value: `graph LR
    Client[Client] --> Proxy[tRPC Proxy]
    Proxy --> Router["App Router"]
    Router --> Middleware["Auth Middleware"]
    Middleware --> Procedure["Procedure"]
    Procedure --> Prisma["Prisma Client"]

    Client -.->|"Simple CRUD"| PostgREST
    PostgREST --> DB[(PostgreSQL)]` }
        ]
      },
      {
        id: 'authentication',
        title: '3.8 Authentication',
        content: [
          { type: 'header', value: 'packages/authorization-token' },
          { type: 'text', value: 'Manages API token generation, hashing, and validation for authenticated access to the API.' },
          { type: 'header', value: 'OAuth Integration' },
          { type: 'text', value: 'Built on Remix Auth with multiple strategies:' },
          { type: 'list', value: [
            'GitHub OAuth',
            'Google OAuth',
            'Generic OAuth2',
            'Form-based login (development only)'
          ] },
          { type: 'header', value: 'Team Collaboration' },
          { type: 'text', value: 'Supports team-based collaboration with project-level permissions and JWT-based authentication.' }
        ]
      },
      {
        id: 'asset-management',
        title: '3.9 Asset Management',
        content: [
          { type: 'header', value: 'packages/asset-uploader' },
          { type: 'text', value: 'Manages file uploads to object storage (S3/Cloudflare R2). Handles drag-and-drop uploads, file validation, and image optimization.' },
          { type: 'code', language: 'typescript', value: `// Upload Flow
export const uploadAsset = async (file: File) => {
  const optimized = await optimizeImage(file);
  await s3Client.putObject({ Key: key, Body: optimized });
  return getPublicUrl(key);
};` },
          { type: 'header', value: 'packages/image & packages/fonts' },
          { type: 'text', value: 'Image processing utilities and Google Fonts integration. Parses font metadata to generate CSS @font-face rules.' }
        ]
      },
      {
        id: 'design-system',
        title: '3.10 Design System',
        content: [
          { type: 'header', value: 'packages/design-system' },
          { type: 'text', value: 'A shared UI component library based on Radix UI and UnoCSS with Wind3 preset. Ensures consistency across the Builder and internal tools.' },
          { type: 'header', value: 'Styling Architecture' },
          { type: 'text', value: 'Uses UnoCSS with Wind3 preset for utility-first CSS, providing a highly performant and flexible styling system.' }
        ]
      }
    ]
  },
  {
    id: 'dependency-analysis',
    title: '4. Dependency Analysis',
    pages: [
      {
        id: 'dep-graph',
        title: '4.1 Dependency Graph',
        content: [
          { type: 'mermaid', value: `graph BT
    builder["apps/builder"] --> sdk["@webstudio-is/react-sdk"]
    builder --> css["@webstudio-is/css-engine"]
    builder --> trpc["@webstudio-is/trpc-interface"]
    builder --> design["@webstudio-is/design-system"]
    
    sdk --> css
    sdk --> design
    
    build["@webstudio-is/project-build"] --> sdk
    build --> css` }
        ]
      },
      {
        id: 'external-deps',
        title: '4.2 External Dependencies',
        content: [
          { type: 'header', value: 'Core Dependencies' },
          { type: 'list', value: [
            'Remix 2.16.5: The metaframework for the builder',
            'React 18.3.0: UI framework (canary build)',
            'Vite 6.3.4: Build tool and dev server',
            'TypeScript 5.8.2: Type safety',
            'NanoStores: Tiny state manager',
            'Immer: Immutable state updates',
            'Yjs: CRDT for collaboration',
            'Radix UI: Headless UI components',
            'Prisma: Database ORM',
            'PostgreSQL 15: Primary database',
            'PostgREST: Auto-generated REST API',
            'CodeMirror 6: Code editing',
            'Lexical: Rich text editing',
            'UnoCSS: Utility-first CSS with Wind3 preset'
          ]},
          { type: 'header', value: 'Development Tools' },
          { type: 'list', value: [
            'pnpm 9.14.4: Package manager with workspace support',
            'ESLint: Code linting with zero-warnings policy',
            'Prettier: Code formatting',
            'Vitest: Unit testing',
            'Playwright: E2E testing',
            'Storybook: Component documentation'
          ]}
        ]
      }
    ]
  },
  {
    id: 'visual-diagrams',
    title: '5. Visual Diagrams',
    pages: [
      {
        id: 'sequence-diagrams',
        title: '5.1 Sequence Diagrams',
        content: [
          { type: 'header', value: 'Project Creation' },
          { type: 'mermaid', value: `sequenceDiagram
    participant User
    participant Dashboard
    participant API
    participant DB

    User->>Dashboard: Click "New Project"
    Dashboard->>API: POST /project/create
    API->>DB: Insert Project (Default Template)
    DB-->>API: Project ID
    API-->>Dashboard: Redirect URL
    Dashboard->>User: Redirect to Builder` },
          { type: 'header', value: 'Authentication Flow' },
          { type: 'mermaid', value: `sequenceDiagram
    participant User
    participant Builder
    participant OAuth
    participant API
    
    User->>Builder: Click "Login with GitHub"
    Builder->>OAuth: Redirect to GitHub
    OAuth-->>Builder: Authorization Code
    Builder->>API: POST /auth/callback
    API->>API: Validate Code & Exchange Token
    API-->>Builder: JWT Token
    Builder->>User: Set Session` }
        ]
      },
      {
        id: 'class-diagrams',
        title: '5.2 Class Structure',
        content: [
          { type: 'mermaid', value: `classDiagram
    class Instance {
        +id: string
        +component: string
        +children: Instance[]
        +props: Map
        +styleId: string
    }
    class Style {
        +id: string
        +rules: Map
        +breakpoint: string
    }
    class Project {
        +id: string
        +root: Instance
        +assets: Asset[]
        +domain: string
    }
    Project *-- Instance
    Project *-- Style` }
        ]
      }
    ]
  },
  {
    id: 'development',
    title: '6. Development Guidelines',
    pages: [
      {
        id: 'local-dev',
        title: '6.1 Local Development',
        content: [
          { type: 'header', value: 'Prerequisites' },
          { type: 'text', value: 'Ensure you have the following installed:' },
          { type: 'list', value: [
            'Node.js 20 (required engine version)',
            'pnpm 9.14.4 or later',
            'Docker (for PostgreSQL and PostgREST)'
          ] },
          { type: 'header', value: 'Setup' },
          { type: 'code', language: 'bash', value: `# Clone the repository
git clone https://github.com/webstudio-is/webstudio.git gencodify_studio
cd gencodify_studio

# Install dependencies
pnpm install

# Start infrastructure (PostgreSQL + PostgREST)
docker-compose up -d

# Run database migrations
pnpm prisma migrate dev

# Start development server
pnpm dev` },
          { type: 'header', value: 'Development Server' },
          { type: 'text', value: 'The builder app runs on port 3000 (development) or 3001 (production). It uses self-signed SSL certificates in development and binds to wstd.dev domain.' },
          { type: 'header', value: 'Build Commands' },
          { type: 'code', language: 'bash', value: `# Build all packages
pnpm build

# Generate TypeScript declarations
pnpm dts

# Run full checks (tests + typecheck + lint)
pnpm checks

# Run dev server
pnpm dev` }
        ]
      },
      {
        id: 'contributing',
        title: '6.2 Contributing',
        content: [
          { type: 'header', value: 'Development Workflow' },
          { type: 'text', value: 'We follow trunk-based development with short-lived feature branches.' },
          { type: 'header', value: 'Code Quality' },
          { type: 'text', value: 'The project enforces a zero-warnings policy for ESLint. All code must pass linting before merging.' },
          { type: 'header', value: 'Testing' },
          { type: 'list', value: [
            'Vitest for unit tests',
            'Playwright for E2E tests',
            'Storybook for component documentation'
          ] },
          { type: 'header', value: 'License' },
          { type: 'text', value: 'Core functionality is licensed under AGPL-3.0-or-later. Animation components are proprietary and require EULA acceptance.' }
        ]
      }
    ]
  }
];