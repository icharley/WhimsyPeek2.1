# Whimsy Peek

A full-stack web application for brainstorming and managing lists of ideas with a fun random selection feature. Now fully deployable on Vercel with Google OAuth authentication!

## 🚀 New Features

- **Google Sign-In**: Secure authentication with Google OAuth
- **Session Search**: Search through sessions and ideas instantly
- **Settings Page**: Customize sound effects, peek delay, and animation speed
- **Peek Indicators**: Track how many times you've peeked at each session
- **Admin Dashboard**: Monitor user signups and peek activity
- **Vercel Deployment**: Fully configured for seamless Vercel deployment

## 🛠 Tech Stack

**Frontend:**
- Next.js 14 with App Router
- React 18 with TypeScript
- Tailwind CSS for styling
- NextAuth.js for Google OAuth
- Lucide React for icons

**Backend:**
- Next.js API Routes (Serverless Functions)
- MongoDB with Mongoose
- JWT authentication
- Admin analytics and monitoring

## 🏃‍♂️ Quick Start

### 1. Clone and Install
```bash
git clone <your-repo>
cd whimsy-peek
npm install
```

### 2. Environment Setup

Create `.env.local` with:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/whimsy-peek

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Admin Access
ADMIN_EMAIL=your-admin-email@example.com

# JWT (for additional security)
JWT_SECRET=your-super-secret-jwt-key-change-this
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.vercel.app/api/auth/callback/google` (production)

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and sign in with Google!

## 🚀 Vercel Deployment

### 1. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 2. Set Environment Variables

In your Vercel dashboard, add all environment variables from `.env.local`:

- `MONGODB_URI` - Your MongoDB connection string
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `NEXTAUTH_URL` - Your production URL
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `ADMIN_EMAIL` - Your admin email for dashboard access
- `JWT_SECRET` - JWT secret key

### 3. Update Google OAuth

Add your production domain to Google OAuth authorized redirect URIs:
- `https://your-domain.vercel.app/api/auth/callback/google`

## 📱 Features

### User Features
- **Google Sign-In**: Quick and secure authentication
- **Session Management**: Create, edit, and delete idea sessions
- **Smart Search**: Find sessions by title, description, or idea content
- **Random Peek**: Fun animated idea selection with customizable timing
- **Settings**: Personalize sound effects, delays, and animations
- **Peek Tracking**: See how many times you've used each session

### Admin Features
- **User Analytics**: Track total users and recent signups
- **Peek Monitoring**: Monitor all peek activities across users
- **Activity Feed**: Real-time view of user actions
- **Secure Access**: Admin dashboard protected by email verification

## 🎨 Customization

Users can customize their experience in the Settings page:

- **Sound Effects**: Enable/disable peek sounds
- **Peek Delay**: Adjust animation duration (1-10 seconds)
- **Animation Speed**: Choose between slow, normal, or fast
- **Notifications**: Control app update notifications

## 🔒 Security

- Google OAuth for secure authentication
- Protected API routes with session verification
- Admin access restricted by email verification
- Environment variables for sensitive data
- CORS protection and request validation

## 📊 Admin Dashboard

Access the admin dashboard at `/admin` (requires admin email):

- View total users and peek statistics
- Monitor recent signups and activity
- Track daily peek counts
- See real-time user activity feed

## 🌐 API Endpoints

- `GET /api/sessions` - Get user sessions (with search)
- `POST /api/sessions` - Create new session
- `PATCH /api/sessions/[id]` - Update session
- `DELETE /api/sessions/[id]` - Delete session
- `POST /api/sessions/[id]/peek` - Perform peek and log activity
- `GET /api/admin/stats` - Admin analytics (protected)

## 🎯 Project Structure

```
whimsy-peek/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── settings/         # Settings page
│   └── admin/            # Admin dashboard
├── components/           # React components
├── lib/                 # Database models and utilities
├── pages/api/           # API routes (serverless functions)
├── public/              # Static assets
└── vercel.json          # Vercel configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own ideas!

---

**Whimsy Peek** - Where great ideas meet magical discovery! ✨