# 🕌 MSKTH – Muslim Students at KTH Web Application

A multilingual, component-driven **Next.js 14** application for the **Muslim Students Association at KTH**.  
The app serves as a platform to display events, enable ticket sign-ups, and connect Muslim students in Stockholm.

Built with **Next.js App Router**, **shadcn/ui**, **next-intl**, and **Supabase**.

---

## Layers and Project Architecture

### Layers Overview

- **app/**  
  Contains Next.js routing, API endpoints, and global layout.  
  - `app/[locale]/` → locale-based pages (`/en`, `/sv`) for internationalization.  
  - `app/api/` → REST endpoints (currently `route.ts` placeholder).  
  - `globals.css` → global Tailwind and theme styling.

- **components/**  
  Reusable UI components based on **shadcn/ui** and Tailwind.  
  Each component is accessible across views and presenters.

- **i18n/**  
  Contains configuration and helpers for internationalization.  
  - `routing.ts` → locale-aware navigation setup (`defineRouting`).  
  - `navigation.ts` → wrappers for `Link`, `usePathname`, `useRouter`.  
  - `request.ts` → handles locale-based server requests.

- **lib/**  
  Common utilities and helper functions.  
  Currently includes `utils.ts` for string manipulation, formatting, and shared constants.

- **model/**  
  Encapsulates business logic and data manipulation.  
  Future home for domain entities like `Event`, `User`, and data-fetching logic from Supabase.

- **presenter/**  
  Connects `model` data and business logic with `view` components.  
  Example: `HomePagePresenter.tsx` handles data retrieval and passes it to the `homepageView`.

- **view/**  
  Responsible for rendering user interfaces.  
  Views are “dumb” components — they focus purely on displaying UI and receiving props from presenters.

- **messages/**  
  JSON translation files (`en.json`, `sv.json`) loaded automatically by `next-intl`.

---

### Current Folder Tree
``
├── README.md
├── src
│ ├── app
│ │ ├── api
│ │ │ └── route.ts
│ │ ├── globals.css
│ │ └── [locale]
│ │ ├── layout.tsx
│ │ └── page.tsx
│ ├── components
│ │ └── ui
│ │ ├── button.tsx
│ │ └── card.tsx
│ ├── i18n
│ │ ├── navigation.ts
│ │ ├── request.ts
│ │ └── routing.ts
│ ├── lib
│ │ └── utils.ts
│ ├── model
│ ├── presenter
│ │ └── HomePagePresenter.tsx
│ └── view
│ └── homepageView.tsx
└── tsconfig.json
``
---

## Setup

### 1. Clone the repository and start a new branch

```bash
git pull origin main
git checkout -b feature/<your-feature-name>
```

2. Install dependencies
```bash
npm install
```

3. Create a .env file
```bash 
cp .env.example .env.local
```

Then add your environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://<your-project>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<your-anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<your-service-key>"

DEFAULT_LOCALE="en"
```

4. Run the development server
```bash
npm run dev
```
5. Open the app

Visit http://localhost:3000
