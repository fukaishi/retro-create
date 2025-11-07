# GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages.

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**

### 2. Trigger Deployment

The site will automatically deploy when you:
- Push to the `main` or `master` branch
- Manually trigger the workflow from the **Actions** tab

### 3. Access Your Site

After deployment completes, your site will be available at:
```
https://fukaishi.github.io/retro-create/
```

## Manual Deployment

To manually trigger a deployment:

1. Go to the **Actions** tab in your repository
2. Click on "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

## Build Configuration

- Build command: `npm run build`
- Output directory: `dist/`
- Base path: `/retro-create/` (configured in `vite.config.ts`)

## Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`) performs:

1. **Build Job**
   - Checks out code
   - Sets up Node.js 20
   - Installs dependencies
   - Builds the project
   - Uploads build artifacts

2. **Deploy Job**
   - Deploys artifacts to GitHub Pages
   - Updates the live site

## Local Testing

To test the production build locally:

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## Troubleshooting

### Build Fails
- Check the Actions tab for error logs
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation succeeds

### 404 on Deployed Site
- Verify GitHub Pages is enabled in Settings
- Check that the base path in `vite.config.ts` matches your repository name
- Ensure the workflow completed successfully

### Assets Not Loading
- Verify `base` path in `vite.config.ts` is correct
- Check browser console for asset loading errors
- Ensure all imports use relative paths
