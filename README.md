# 🚀 Portfolio Builder - AI-Powered Portfolio Generator

> **Build stunning professional portfolios in seconds with AI. No coding required.**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

## ✨ Features

### 🎨 AI-Powered Generation

- **Instant Portfolio Creation** - Describe your portfolio and let AI build it in seconds
- **Smart Customization** - Quick setup form with profession, style, and color preferences
- **Real-time Modifications** - Chat with AI to modify any element instantly
- **Multiple Design Styles** - Modern, Minimal, Creative, Professional, and more

### 🛠️ Powerful Editor

- **Visual Editing** - Click any element to edit text, colors, and styles
- **Image Management** - Upload images or generate them with AI
- **Responsive Design** - Mobile-first approach with perfect responsiveness
- **Live Preview** - See changes in real-time across all devices

### 🚀 One-Click Deployment

- **Vercel Integration** - Deploy your portfolio to production instantly
- **Custom Domains** - Connect your own domain name
- **SSL Certificates** - Automatic HTTPS for all deployments
- **Global CDN** - Lightning-fast loading worldwide

### 👤 User Management

- **Secure Authentication** - Powered by Clerk
- **Project Management** - Save and manage multiple portfolio projects
- **Credit System** - Track usage with built-in credit management
- **User Dashboard** - Access all your projects from one place

## 🎯 Perfect For

- 💼 **Job Seekers** - Create impressive portfolios to land your dream job
- 🎨 **Designers** - Showcase your work with beautiful, modern designs
- 💻 **Developers** - Build a professional online presence quickly
- 📸 **Photographers** - Display your portfolio in stunning layouts
- ✍️ **Writers** - Present your work with elegant typography

## 🏗️ Tech Stack

### Frontend

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with Server Components
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[Shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible components

### Backend & Database

- **[Neon Database](https://neon.tech/)** - Serverless Postgres
- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe database toolkit
- **[Clerk](https://clerk.com/)** - Authentication & user management

### AI & Integrations

- **[OpenRouter API](https://openrouter.ai/)** - AI model integration (Gemini 2.0)
- **[ImageKit](https://imagekit.io/)** - Image optimization & CDN
- **[Vercel](https://vercel.com/)** - Deployment platform

### UI/UX Libraries

- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon set
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[React Colorful](https://github.com/omgovich/react-colorful)** - Color picker

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Neon Database** account ([sign up](https://neon.tech/))
- **Clerk** account ([sign up](https://clerk.com/))
- **OpenRouter** API key ([get key](https://openrouter.ai/))
- **ImageKit** account ([sign up](https://imagekit.io/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/modamaan/Ai-Website-Generator.git
   cd Ai-Website-Generator
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Neon Database
   DATABASE_URL=your_neon_database_url

   # OpenRouter AI
   OPENROUTER_API_KEY=your_openrouter_api_key

   # ImageKit
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

   # Vercel (for deployment)
   VERCEL_TOKEN=your_vercel_token
   ```

4. **Set up the database**

   ```bash
   npm run db:push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ai-web_generator/
├── app/
│   ├── api/              # API routes
│   │   ├── ai-model/     # AI generation endpoint
│   │   ├── deploy/       # Vercel deployment
│   │   ├── frames/       # Frame management
│   │   └── projects/     # Project CRUD
│   ├── components/       # Shared components
│   │   ├── Hero.tsx      # Landing page hero
│   │   ├── Navbar.tsx    # Navigation
│   │   └── PortfolioForm.tsx  # Quick setup form
│   ├── playground/       # Editor workspace
│   │   └── [projectId]/  # Project editor
│   ├── workspace/        # User dashboard
│   └── page.tsx          # Home page
├── db/
│   └── schema.ts         # Database schema
├── public/               # Static assets
└── package.json
```

## 🎨 Usage

### Creating Your First Portfolio

1. **Sign Up/Sign In** - Create an account or log in
2. **Quick Setup** - Fill out the portfolio form with your details
3. **Generate** - Click "Generate Portfolio" and watch AI build it
4. **Customize** - Chat with AI to make changes or use visual editor
5. **Deploy** - Click "Deploy" to publish your portfolio live

### Editing Your Portfolio

- **Text Editing** - Click any text element to edit inline
- **Style Changes** - Use the sidebar to modify colors, fonts, spacing
- **Image Updates** - Upload new images or generate with AI
- **Layout Modifications** - Chat with AI: "make the header bigger"

### Managing Projects

- **View All Projects** - Access from the workspace sidebar
- **Switch Projects** - Click any project to continue editing
- **Delete Projects** - Remove unwanted portfolios

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**

   - Go to [Vercel](https://vercel.com/new)
   - Import your repository
   - Add environment variables
   - Click "Deploy"

3. **Set up environment variables** in Vercel dashboard
   - Add all variables from `.env.local`

### Manual Deployment

```bash
npm run build
npm start
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run db:push      # Push database schema changes
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run lint         # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment platform
- [Clerk](https://clerk.com/) - Authentication
- [Neon](https://neon.tech/) - Serverless Postgres
- [OpenRouter](https://openrouter.ai/) - AI API gateway
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

## 📧 Support

For support, email [your-email@example.com](mailto:your-email@example.com) or open an issue in the repository.

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐️!

---

**Built with ❤️ by [Amaan](https://github.com/modamaan)**
