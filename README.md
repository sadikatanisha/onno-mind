# youCards - AI-Powered Flashcard Learning with Real-Time Citations

> **Track 2: RAG & Knowledge Mastery** - You.com API Hackathon  
> Eliminate AI hallucinations in education through real-time source verification

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Powered by You.com](https://img.shields.io/badge/Powered%20by-You.com-purple)](https://you.com/)

## 🎯 Problem Statement

**Traditional AI learning tools suffer from two critical flaws:**
1. **Hallucinations** - AI generates incorrect or made-up facts
2. **Outdated Knowledge** - Training data stuck in 2023, missing React 19, TypeScript 5.5, etc.

**Students learn incorrect information and don't even know it.**

---

## 💡 Solution: youCards

youCards uses **You.com's real-time search API** to create a RAG-powered learning platform where:

✅ **Every fact is cited** with fresh web sources  
✅ **Knowledge is verified** against the latest documentation  
✅ **Outdated flashcards are detected** and can be updated  
✅ **AI can't hallucinate** - answers are grounded in real sources  

---

## 🏗️ Architecture

### **RAG (Retrieval Augmented Generation) Approach:**

```
User asks question
    ↓
You.com Search API → Fetch fresh sources (docs, articles, tutorials)
    ↓
AI processes sources → Generate answer with citations
    ↓
Display: Answer + Source cards (with freshness indicators)
    ↓
User: "Save as flashcards"
    ↓
Flashcards created with embedded source links
```

### **Key Innovation: Knowledge Freshness Detection**

When users start a quiz on old flashcards (>30 days):
1. You.com searches for latest sources
2. Compares source publish dates with flashcard creation dates
3. Warns: "⚠️ Newer information available!"
4. Offers to update flashcards with fresh sources

---

## 🚀 Features

### **Mode 1: Learning (Chat)**
- Ask AI to teach you any topic
- You.com searches the latest sources in real-time
- AI explains concepts with cited sources
- Generate flashcards from conversation
- Each flashcard includes source citations

### **Mode 2: Practice (Quiz)**
- AI quizzes you on your flashcard decks
- Detects if flashcards are outdated (>30 days)
- Fetches fresh You.com sources for verification
- Shows citations when explaining answers
- Tracks your score and progress

### **Mode 3: Review**
- Traditional flashcard review (Anki-style)
- Spaced repetition algorithm
- Track mastery levels

### **Two You.com API Modes:**

**🔍 Search Mode** - Raw search results with snippets and citations  
**✨ Smart Learning Assistant** - AI-powered answers (uses Smart API)

Switch modes anytime using the dropdown selector!

---

## 🛠️ Tech Stack

### **Frontend**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui (Radix UI components)

### **Backend**
- Next.js API Routes
- Prisma ORM
- PostgreSQL/SQLite

### **Authentication**
- Clerk (App Router integration)

### **AI & Search**
- You.com Search API (real-time web results with citations)
- You.com Smart API (AI-powered learning assistant)

### **Deployment**
- Vercel (recommended)
- Any Node.js hosting platform

---

## 📦 Installation

### **Prerequisites**
- Node.js 18+ and npm
- PostgreSQL database (or SQLite for local development)
- You.com API account (free $100 credits)
- Clerk account (free tier available)

### **1. Clone the Repository**

```bash
git clone https://github.com/sadikatanisha/onno-mind.git
cd you-cards
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Set Up Environment Variables**

Create a `.env.local` file in the root directory:

```bash
# Clerk Authentication
# Get from: https://dashboard.clerk.com/last-active?path=api-keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database
# For local development, you can use SQLite:
DATABASE_URL="file:./dev.db"
# For production, use PostgreSQL:
# DATABASE_URL="postgresql://user:password@host:5432/dbname"

# You.com API
# Get from: https://you.com/platform
YOU_API_KEY=ydc-sk-...

# Optional: Custom Agent ID
# Create at: https://you.com/platform -> Custom Agents
YOU_CUSTOM_AGENT_ID=
```

### **4. Set Up Database**

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# (Optional) Open Prisma Studio to view data
npm run db:studio
```

### **5. Run Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Getting API Keys

### **Clerk (Authentication)**

1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Go to **API Keys** page
4. Copy **Publishable Key** and **Secret Key**
5. Add to `.env.local`

### **You.com (AI & Search)**

1. Go to [you.com/platform](https://you.com/platform)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click "Create new API key"
4. Name it (e.g., "youCards")
6. Copy the API key
7. Add to `.env.local` as `YOU_API_KEY`



---

## 📖 Usage

### **Create Flashcards from AI Chat**

1. Navigate to **Learn** (chat interface)
2. Select You.com mode: **Smart Learning Assistant**
3. Ask: "Teach me about React hooks"
4. AI searches You.com and explains with citations
5. Click **"Generate Flashcards with Citations"**
6. Flashcards are created with embedded source links

### **Take an AI Quiz**

1. Go to **Decks** and select a deck
2. Click **"Start AI Quiz"**
3. AI detects if flashcards are outdated (>30 days)
4. If outdated: Fetches fresh You.com sources
5. AI quizzes you with cited answers
6. See your score at the end

### **Switch You.com Modes**

Use the dropdown selector to switch between:
- **Search Mode**: Raw You.com search results
- **Smart Learning Assistant**: AI-powered explanations (recommended)

---

## 🏃 Available Commands

```bash
# Development
npm run dev          # Start dev server (localhost:3000)

# Build & Production
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Prisma Studio (database GUI)

# Code Quality
npm run lint         # Run ESLint

# Testing
npm run test         # Run Vitest unit tests
npm run test:e2e     # Run Playwright E2E tests
```

---

## 🎨 Project Structure

```
you-cards/
├── app/                          # Next.js App Router
│   ├── (app)/                    # Main app layout group
│   │   ├── dashboard/            # User dashboard
│   │   ├── learn/                # AI chat learning mode
│   │   ├── decks/                # Deck management
│   │   ├── quiz/[deckId]/        # AI quiz mode
│   │   └── review/[deckId]/      # Flashcard review mode
│   ├── api/                      # API routes
│   │   ├── chat/                 # You.com AI chat endpoint
│   │   ├── you-search/           # You.com Search API
│   │   ├── you-agent/            # You.com Agent API
│   │   ├── conversations/        # Conversation CRUD
│   │   ├── decks/                # Deck CRUD
│   │   └── cards/                # Flashcard CRUD
│   ├── sign-in/                  # Clerk sign-in page
│   └── sign-up/                  # Clerk sign-up page
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── citations/                # Citation card components
│   │   ├── citation-card.tsx     # Single source citation
│   │   └── source-list.tsx       # List of sources
│   ├── dashboard/                # Dashboard components
│   └── you-mode-selector.tsx     # You.com mode dropdown
├── lib/                          # Utilities & helpers
│   ├── you-api.ts                # You.com API wrapper
│   ├── you-mock-data.ts          # Mock data for demo
│   ├── prisma.ts                 # Prisma client
│   └── utils.ts                  # Utility functions
├── prisma/                       # Database schema
│   └── schema.prisma             # Prisma schema
├── public/                       # Static assets


---

## 🗄️ Database Schema

### **Key Models:**

**Deck** - Collection of flashcards
```prisma
model Deck {
  id          String   @id @default(uuid())
  title       String
  description String?
  userId      String
  cards       Card[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Card** - Individual flashcard
```prisma
model Card {
  id        String   @id @default(uuid())
  front     String   // Question
  back      String   // Answer
  deckId    String
  deck      Deck     @relation(...)
  createdAt DateTime @default(now())
  // Spaced repetition fields
  nextReview DateTime?
  interval   Int      @default(1)
  easeFactor Float    @default(2.5)
  repetitions Int     @default(0)
}
```

**Conversation** - Chat/Quiz sessions
```prisma
model Conversation {
  id            String   @id @default(uuid())
  userId        String
  topic         String?
  mode          String   @default("chat") // "chat" or "quiz"
  deckId        String?  // For quiz mode
  quizCompleted Boolean  @default(false)
  quizScore     Int?
  quizTotal     Int?
  messages      Message[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

---

## 🌐 You.com API Integration

### **Search API** (`GET /v1/search`)

**Purpose:** Fetch real-time web results with citations

**Used for:**
- Finding fresh sources when learning new topics
- Verifying flashcard accuracy
- Showing citation cards with source metadata

**Example:**
```typescript
const results = await searchYou("React 19 hooks", {
  count: 5,
  freshness: "month",
});

// Returns: URLs, titles, snippets, page_age, thumbnails
```

### **Smart API** (`POST /smart`)

**Purpose:** AI-powered answers with automatic source citations

**Used for:**
- Learning mode chat conversations
- Quiz question generation
- Educational explanations

**Example:**
```typescript
const response = await smartSearch(
  "Explain React hooks",
  "Provide clear educational explanation with examples"
);

// Returns: { answer: "...", search_results: [...] }
```

### **API Mode Selector**

Users can choose between:
1. **Search Mode** - Shows raw You.com search results
2. **Smart Assistant** - AI processes sources for intelligent responses

---

## 🎯 Key Features Showcase

### **1. Real-Time Knowledge Freshness**

```typescript
// Detects outdated flashcards
if (flashcardAge > 30 days) {
  const sources = await searchYou(deckTitle);
  
  if (sources[0].page_age > flashcard.createdAt) {
    // Show warning: "Newer information available!"
    // Button: "Update with latest sources"
  }
}
```

### **2. Citation Cards**

Every source shows:
- 📄 Title and description
- 🔗 Direct link to source
- 📅 Publication date
- ✨ Freshness badge (Fresh/Recent/Archived)
- 🖼️ Thumbnail and favicon
- 📝 Relevant snippets

### **3. Dual Learning Modes**

**Chat Mode:**
- AI learns alongside you
- Real-time web search
- Citations for every fact
- Generate flashcards from conversation

**Quiz Mode:**
- AI quizzes you interactively
- Verifies answers with sources
- Detects knowledge gaps
- Tracks progress over time

---

## 🧪 Testing

### **Unit Tests (Vitest)**
```bash
npm run test
```

### **E2E Tests (Playwright)**
```bash
npm run test:e2e
```

### **Test You.com API**
```bash
node test-you-api.js
```

This tests both Search and Smart APIs with your API key.

---

## 🚀 Deployment

### **Deploy to Vercel (Recommended)**

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

**Environment Variables to Add:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL`
- `YOU_API_KEY`

### **Database Setup for Production**

1. Create PostgreSQL database (Vercel Postgres, Supabase, etc.)
2. Update `DATABASE_URL` in environment variables
3. Run migrations:
```bash
npx prisma db push
```

---

## 🎮 How It Works (User Flow)

### **Learning Flow**

```
1. User → "I want to learn about TypeScript generics"
2. You.com Search API → Fetches latest TypeScript docs
3. AI → Explains with citations: "Generics allow... [Source 1]"
4. Display → Answer + Source cards (TypeScript docs, updated 5 days ago)
5. User → "Save as flashcards"
6. System → Creates deck with 5 flashcards, each citing sources
```

### **Quiz Flow**

```
1. User → Has deck "React 19 Hooks" (created 45 days ago)
2. Clicks → "Start AI Quiz"
3. System → Detects flashcards are >30 days old
4. You.com → Searches "React 19 hooks" for latest info
5. Compares → Sources from Dec 2024 vs flashcards from Oct 2024
6. Shows Warning → "⚠️ Newer information available!"
7. User → Proceeds with quiz (optionally updates flashcards)
8. AI → Quizzes with cited, verified answers
```

---

## 🏆 Hackathon Submission Details

### **Track 2: RAG & Knowledge Mastery**

**How youCards Addresses Track 2 Criteria:**

| Criterion | Implementation |
|-----------|----------------|
| **Reduce Hallucinations** | Every answer backed by You.com sources with URLs |
| **Improve Retrieval** | Real-time search with freshness filtering |
| **Knowledge Mastery** | Detects outdated flashcards, offers updates |
| **Personal Assistant** | Learns user's topics, adapts difficulty |
| **RAG Architecture** | You.com (retrieval) + AI (generation) |

### **Innovation:**
- First flashcard app with **real-time knowledge verification**
- Prevents students from learning outdated concepts
- Citations build trust and enable fact-checking

### **Technical Implementation:**
- Clean RAG architecture
- Two-mode You.com integration
- Graceful error handling
- Responsive, polished UI

### **Impact:**
- Education market: millions of students
- Prevents misinformation in learning
- Shows You.com's value for knowledge applications

---

## 🐛 Troubleshooting

### **You.com API Returns 0 Results**

This may indicate:
1. API key tier doesn't include Search API access
2. Contact `api@you.com` for assistance
3. Try Smart API mode instead

**Workaround:**
- Switch to "Smart Learning Assistant" mode in dropdown
- Contact You.com support for API access

### **Smart API Returns 403/404**

The Smart API (Legacy) may require:
1. Registration via `api@you.com`
2. Specific API tier access
3. Different authentication method

**Fallback:**
- App gracefully shows error message
- Suggests switching to Search mode
- Provides clear troubleshooting steps

### **Build Errors**

```bash
# Clear Next.js cache
rm -rf .next

# Regenerate Prisma client
npx prisma generate

# Rebuild
npm run build
```

---

## 🤝 Contributing

This project was created for the You.com API Hackathon. Contributions welcome!

1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Author

**Sadika Tanisha**
- GitHub: [@sadikatanisha](https://github.com/sadikatanisha)
- Project: [onno-mind](https://github.com/sadikatanisha/onno-mind)

---

## 🙏 Acknowledgments

- **You.com** - For providing real-time search APIs and hackathon opportunity
- **Clerk** - For seamless authentication
- **Vercel** - For Next.js and hosting platform
- **shadcn/ui** - For beautiful UI components

---

## 📞 Support

**You.com API Issues:**
- Email: api@you.com
- Discord: [You.com Community](https://discord.com/invite/youdotcom)
- Docs: [documentation.you.com](https://documentation.you.com)

**Project Issues:**
- Open an issue on GitHub
- Check documentation files in the repo

---

## 🎬 Demo

[Add link to demo video or live deployment]

**Demo Script:**
1. Ask AI: "Teach me React 19 Server Components"
2. Watch You.com search in action
3. See source cards with freshness dates
4. Generate flashcards with citations
5. Take quiz - see outdated warning
6. Update flashcards with latest sources

---

**Built with ❤️ for the You.com API Hackathon**

*Making education more reliable, one cited flashcard at a time.*
