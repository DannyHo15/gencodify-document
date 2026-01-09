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
          { type: 'header', value: 'High-Level Overview' },
          { type: 'text', value: 'GenCodify Studio (formerly WebStudio) follows a modern monorepo architecture using pnpm workspaces. It strictly separates the "Builder" (editing environment) from the "Runtime" (published sites), ensuring high performance for end-users regardless of editor complexity.' },
          { type: 'mermaid', value: `graph TD
    subgraph "Edge / Public"
      User[End User]
      Edge["Cloudflare/Vercel Edge"]
    end

    subgraph "Builder Environment (apps/builder)"
      Editor[Content Creator]
      BuilderUI["Builder UI (Remix + Vite)"]
      Canvas["Canvas Iframe"]
    end

    subgraph "Core Services"
      API["tRPC API"]
      PostgREST["PostgREST API"]
      Collab["Collaboration Server"]
      DB[(PostgreSQL 15)]
    end

    subgraph "Shared Logic (packages/)"
      SDK["React SDK"]
      CSS["CSS Engine"]
      NanoStores["NanoStores State"]
      DesignSystem["Design System (Radix UI)"]
    end

    User --> Edge
    Edge --> SDK
    Editor --> BuilderUI
    BuilderUI --> Canvas
    BuilderUI --> API
    BuilderUI --> PostgREST
    BuilderUI --> Collab
    API --> NanoStores
    NanoStores --> DB
    PostgREST --> DB
    Canvas --> SDK
    SDK --> DesignSystem` },
          { type: 'header', value: 'Monorepo Structure' },
          { type: 'text', value: 'The codebase is organized as a pnpm workspace to maximize code sharing between the builder and the runtime SDKs.' },
          { type: 'code', language: 'text', value: `gencodify_studio/
├── apps/
│   └── builder/          # Main visual editor (Remix + Vite)
├── packages/
│   ├── css-data/         # CSS data structures
│   ├── css-engine/       # CSS compilation core
│   ├── design-system/    # UI components (Radix UI)
│   ├── html-data/        # HTML processing utilities
│   ├── image/            # Image optimization
│   ├── fonts/            # Font management
│   ├── trpc-interface/   # tRPC API interfaces
│   ├── postgrest/        # PostgREST client wrapper
│   ├── http-client/      # HTTP utilities
│   ├── authorization-token/  # Token-based auth
│   ├── asset-uploader/   # S3/R2 upload handling
│   ├── react-sdk/        # Runtime renderer for sites
│   ├── sdk-components-react/        # Base React components
│   ├── sdk-components-react-radix/  # Radix UI components
│   ├── sdk-components-react-remix/  # Remix components
│   ├── sdk-components-react-router/ # Router components
│   ├── sdk-components-animation/    # Animation components
│   ├── project/          # Project data structures
│   ├── project-build/    # Build pipeline logic
│   ├── domain/           # Domain models
│   └── template/         # Project templates` }
        ]
      },
      {
        id: 'core-patterns',
        title: '1.2 Core Patterns',
        content: [
          { type: 'header', value: 'State Management' },
          { type: 'text', value: 'We utilize a "Split State" architecture. Transient UI state (modals, panels) lives in React context. Persistent Project state (the component tree) lives in NanoStores, which synchronizes with Yjs for real-time collaboration.' },
          { type: 'mermaid', value: `flowchart LR
    UserOp[User Operation] --> Command[Command Handler]
    Command --> NanoStore[NanoStore Atom]
    NanoStore --> ReactComp[React Component]
    NanoStore --> Yjs[Yjs Document]
    Yjs --> WS[WebSocket Provider]
    WS <--> Server[Collab Server]
    
    subgraph "Optimistic UI"
    NanoStore
    ReactComp
    end` }
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
          { type: 'header', value: 'tRPC & PostgREST Flow' },
          { type: 'text', value: 'All complex data mutations go through tRPC procedures. Simple CRUD operations use PostgREST for direct database access.' },
          { type: 'code', language: 'typescript', value: `// Data Query Flow via tRPC
export const projectRouter = router({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Authorization Check
      await ctx.canViewProject(input.id);
      
      // Database Query via Prisma
      return ctx.prisma.project.findUnique({
        where: { id: input.id },
        include: { pages: true }
      });
    })
});

// Direct CRUD via PostgREST
const project = await postgrest
  .from('projects')
  .select('*')
  .eq('id', projectId)
  .single();` }
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