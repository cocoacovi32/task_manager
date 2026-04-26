# Deploy to Netlify

## Frontend Deployment (React App)

1. **Go to Netlify**: https://app.netlify.com

2. **Connect GitHub**:
   - Click "New site from Git"
   - Select GitHub
   - Authorize Netlify to access your repositories
   - Select `cocoacovi32/task_manager`

3. **Configure Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`

4. **Environment Variables**:
   - Click "Site settings" → "Build & deploy" → "Environment"
   - Add:
     ```
     REACT_APP_API_URL = https://your-backend-url/api
     ```
   - (Replace with your actual backend URL)

5. **Deploy**:
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `https://[random-name].netlify.app`

## Backend Deployment (Django)

Since you were using Railway, you can continue there or use Heroku:

### Option A: Railway (Recommended)
1. Go to https://railway.app
2. Connect your GitHub repo
3. Railway will auto-detect Django
4. Set environment variables:
   - `DEBUG=False`
   - `SECRET_KEY=[generate-one]`
   - `ALLOWED_HOSTS=your-domain.railway.app`
   - `CORS_ALLOWED_ORIGINS=https://your-netlify-site.netlify.app`

### Option B: Heroku
1. Go to https://heroku.com
2. Create new app
3. Connect GitHub
4. Set buildpacks: `heroku/python`
5. Set config vars (same as Railway above)
6. Deploy

## Verify Deployment

After both are deployed:

1. Visit your Netlify frontend URL
2. Login with any username
3. Verify tasks work locally
4. Check browser console (F12) for any errors

## Credentials for Testing

- **Username**: `admin` (any username works for login)
- **Password**: Not required (local auth)
- **Backend Admin**: `https://your-backend-url/admin`
  - Username: `admin`
  - Password: `Password123`
