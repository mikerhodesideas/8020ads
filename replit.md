# 8020ads

## Overview
A Next.js demo application from the private GitHub repo `mikerhodesideas/8020ads`. Shows how AI can solve real business problems - users choose between "I run an agency" or "I run a business" paths and see live problem-solving demos.

## Architecture
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS v4 with PostCSS
- **Runtime**: Node.js 20
- **Port**: 5000

## Project Structure
```
app/                    - Next.js App Router pages
  page.tsx              - Landing page (path chooser)
  course/page.tsx       - Course/demo page
  layout.tsx            - Root layout
  globals.css           - Global styles
components/             - React components
  data-preview.tsx      - Data file preview component
  drag-file.tsx         - Drag and drop file component
  path-chooser.tsx      - Agency vs Business path selector
  problem-detail.tsx    - Problem detail view
  problem-grid.tsx      - Problem grid layout
  sst-slide.tsx         - SST slide component
lib/                    - Utilities
  problems.ts           - Problem definitions
  utils.ts              - Utility functions
public/
  data/                 - CSV and text data files
  demo-assets/          - Demo content (website, transcripts, research, sample CSVs)
```

## Deployment
- **Target**: Autoscale
- **Build**: `npm run build` (next build)
- **Run**: `npm run start` (next start -p 5000)

## GitHub Integration
Connected to private GitHub repo via Replit GitHub connector for code syncing.
