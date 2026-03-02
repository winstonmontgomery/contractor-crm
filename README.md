# Contractor Verified ATX

A modern CRM and contractor verification platform for Austin, TX. Connect homeowners with licensed, insured, and verified contractors.

![Contractor Verified ATX](https://via.placeholder.com/1200x630?text=Contractor+Verified+ATX)

## Features

### For Homeowners
- **5-Step Project Wizard** - Describe your project and get matched with contractors
- **Verified Contractors** - Every contractor is license and insurance verified
- **Standardized Bids** - Compare detailed, itemized bids side-by-side
- **Trust Badges** - See Verified, Pro, and Elite badges at a glance
- **Secure Messaging** - Communicate directly with contractors
- **Reviews & Ratings** - Read and leave verified project reviews

### For Contractors
- **Verification Badges** - Earn trust with ✓ Verified, ⭐ Pro, and 🏆 Elite badges
- **Quality Leads** - Get matched with homeowners actively seeking your services
- **Membership Tiers** - Network ($35/mo) and Performance-Qualified ($99/mo) plans
- **Performance Dashboard** - Track bids, win rates, and business metrics
- **Profile Showcase** - Display your portfolio, reviews, and credentials

### For Admins
- **Verification Queue** - Review and approve contractor applications
- **Document Viewer** - Verify licenses, insurance, and credentials
- **User Management** - Manage all users and their roles
- **Project Oversight** - View and manage all platform projects
- **Analytics Dashboard** - Track platform metrics and growth

## Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) with App Router
- **Backend**: [Supabase](https://supabase.com/) (Auth, Database, Storage)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Payments**: [Stripe](https://stripe.com/) (Subscriptions)
- **Language**: TypeScript
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, pnpm, or bun
- Supabase account (free tier works)
- Stripe account (for payments, optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/contractor-crm.git
   cd contractor-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase and Stripe credentials.

4. **Set up Supabase**
   
   Option A: Using Supabase CLI (recommended)
   ```bash
   npx supabase login
   npx supabase link --project-ref your-project-ref
   npx supabase db push
   ```

   Option B: Manual setup
   - Go to your Supabase project SQL Editor
   - Run each migration file in `supabase/migrations/` in order

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

### Database Migrations

The database schema is defined in `supabase/migrations/`:

1. `20240226000001_initial_schema.sql` - Core tables (profiles, projects, assignments)
2. `20240226000002_verification_system.sql` - Verification tables and policies
3. `20240226000003_full_platform.sql` - Extended tables (bids, reviews, messages, memberships)

### Project Structure

```
contractor-crm/
├── src/
│   ├── app/
│   │   ├── (auth)/           # Auth pages (login, signup)
│   │   ├── (dashboard)/      # Protected dashboard pages
│   │   ├── (public)/         # Public marketing pages
│   │   ├── globals.css       # Global styles
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── layout/           # Dashboard layout components
│   │   ├── providers/        # Context providers
│   │   ├── public/           # Public site components
│   │   ├── ui/               # shadcn/ui components
│   │   └── verification-badge.tsx
│   ├── lib/
│   │   ├── supabase/         # Supabase client utilities
│   │   └── utils.ts          # Utility functions
│   └── types/
│       └── database.ts       # TypeScript types
├── supabase/
│   ├── migrations/           # Database migrations
│   └── config.toml           # Supabase config
├── .env.example
└── README.md
```

## Configuration

### Supabase Setup

1. Create a new Supabase project
2. Enable Email Auth in Authentication settings
3. Create a storage bucket named `documents` for file uploads
4. Set up Row Level Security policies (included in migrations)

### Stripe Setup

1. Create products in Stripe Dashboard:
   - **Network Member** - $35/month
   - **Performance-Qualified** - $99/month
2. Copy the price IDs to your environment variables
3. Set up webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`

### Email Notifications (Optional)

The platform supports email notifications via Resend or similar providers. Configure `RESEND_API_KEY` for:
- Verification status updates
- New bid notifications
- Message alerts
- Expiring verification reminders

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/contractor-crm)

1. Connect your GitHub repository
2. Add environment variables
3. Deploy!

### Manual Deployment

```bash
npm run build
npm start
```

## Membership Tiers

| Feature | Free | Network ($35/mo) | Performance ($99/mo) |
|---------|------|------------------|----------------------|
| Verified Badge | ✓ | ✓ | ✓ |
| Directory Listing | — | ✓ | ✓ |
| Bid Invitations | — | Up to 10/mo | Unlimited |
| Priority Matching | — | — | ✓ |
| Analytics Dashboard | Basic | Standard | Advanced |
| Support | Email | Email + Chat | Priority |

## Verification Levels

- **✓ Verified** - License and insurance confirmed
- **⭐ Verified Pro** - 10+ projects, 4.5+ rating
- **🏆 Verified Elite** - 25+ projects, 4.8+ rating, featured status

Badges are automatically upgraded based on performance metrics.

## API Routes

The platform uses Next.js API routes for server-side operations:

- `/api/auth/*` - Authentication (handled by Supabase)
- `/api/webhooks/stripe` - Stripe webhook handler
- `/api/projects/*` - Project management
- `/api/bids/*` - Bid operations
- `/api/verification/*` - Verification workflows

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [docs.contractorverified.com](https://docs.contractorverified.com)
- **Email**: support@contractorverified.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/contractor-crm/issues)

---

Built with ❤️ in Austin, TX
