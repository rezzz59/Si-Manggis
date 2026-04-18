# Backend Si-Manggis Fase 1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Backend Fase 1 untuk Si-Manggis — staff login via NextAuth.js, CRUD permohonan/pengaduan, dan cek tiket publik tanpa login.

**Architecture:** Prisma + SQLite sebagai database lokal. NextAuth.js dengan Credentials provider untuk auth staff. API Routes di `/api/` untuk semua operasi. Staff area di `/dashboard`. Warga bisa cek tiket di `/cek-tiket` tanpa login.

**Tech Stack:** Next.js 16 (App Router), Prisma, SQLite, NextAuth.js v5 (Auth.js), bcryptjs, TypeScript.

---

## File Structure Overview

```
prisma/
  schema.prisma      — Staff, Permohonan, Pengaduan
  seed.ts            — seed staff default

src/
  lib/
    prisma.ts        — Prisma client singleton
    auth.ts          — NextAuth config
    tiket.ts         — generator nomor tiket SM-2026-XXXXXX

app/
  api/
    auth/[...nextauth]/route.ts
    permohonan/route.ts
    permohonan/[id]/route.ts
    pengaduan/route.ts
    pengaduan/[id]/route.ts
    cek-tiket/[tiket]/route.ts
  dashboard/
    layout.tsx       — sidebar + proteksi
    page.tsx
    permohonan/
      page.tsx
      [id]/page.tsx
    pengaduan/
      page.tsx
      [id]/page.tsx
  cek-tiket/
    page.tsx
    [tiket]/page.tsx
  login/
    page.tsx         — rename dari /masuk

middleware.ts        — proteksi /dashboard
```

---

## Task 1: Setup Prisma + Install Dependencies

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Modify: `.env`
- Modify: `package.json`

- [ ] **Step 1: Install dependencies**

Run: `cd "D:/si manggis" && npm install prisma @prisma/client next-auth@beta bcryptjs && npm install -D @types/bcryptjs tsx`

Expected: Packages installed, no errors.

- [ ] **Step 2: Inisialisasi Prisma**

Run: `cd "D:/si manggis" && npx prisma init --datasource-provider sqlite`

Expected: Folder `prisma/` terbuat dengan `schema.prisma` dan `.env`.

- [ ] **Step 3: Tulis schema Prisma**

Ganti seluruh isi `prisma/schema.prisma` dengan:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Staff {
  id        String   @id @default(cuid())
  email     String   @unique
  nama      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Permohonan {
  id        String   @id @default(cuid())
  tiket     String   @unique
  nama      String
  nik       String?
  alamat    String
  layanan   String
  keperluan String
  telepon   String
  status    String   @default("MENUNGGU")
  catatan  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Pengaduan {
  id        String   @id @default(cuid())
  tiket     String   @unique
  nama      String
  telepon   String?
  email     String?
  topik     String
  pesan     String
  status    String   @default("MENUNGGU")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

- [ ] **Step 4: Setup .env**

Pastikan `.env` berisi:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="bisa-generate-dengan-openssl-rand-base64-32"
```

Run: `openssl rand -base64 32` (atau gunakan nilai dummy dulu, nanti diwarn jika NextAuth minta).

- [ ] **Step 5: Generate Prisma Client**

Run: `npx prisma generate`

Expected: `Generated Prisma Client JS` di terminal.

- [ ] **Step 6: Push schema ke database**

Run: `npx prisma db push`

Expected: `Your database has been created` dan tabel Staff, Permohonan, Pengaduan terbuat.

- [ ] **Step 7: Tulis seed script**

Buat `prisma/seed.ts`:

```ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("staff2026", 12);

  await prisma.staff.upsert({
    where: { email: "admin@desaguntingmanggis.id" },
    update: {},
    create: {
      email: "admin@desaguntingmanggis.id",
      nama: "Administrator",
      password: hashedPassword,
    },
  });

  console.log("Seed done: admin@desaguntingmanggis.id / staff2026");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

- [ ] **Step 8: Tambahkan seed script ke package.json**

Tambahkan ke `scripts` di `package.json`:

```json
"db:seed": "tsx prisma/seed.ts"
```

- [ ] **Step 9: Jalankan seed**

Run: `npm run db:seed`

Expected: `Seed done: admin@desaguntingmanggis.id / staff2026`

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "feat: setup Prisma + SQLite + seed staff default

Install prisma, next-auth@beta, bcryptjs.
Init schema: Staff, Permohonan, Pengaduan.
Seed: admin@desaguntingmanggis.id / staff2026"
```

---

## Task 2: Prisma Client Singleton

**Files:**
- Create: `src/lib/prisma.ts`
- Create: `src/lib/tiket.ts`

- [ ] **Step 1: Buat Prisma singleton**

Create `src/lib/prisma.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 2: Buat generator tiket**

Create `src/lib/tiket.ts`:

```ts
function randomSixDigits(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateTiket(): string {
  const year = new Date().getFullYear();
  return `SM-${year}-${randomSixDigits()}`;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/prisma.ts src/lib/tiket.ts && git commit -m "feat: add Prisma singleton and tiket generator"
```

---

## Task 3: NextAuth.js Configuration

**Files:**
- Create: `src/lib/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Buat NextAuth config**

Create `src/lib/auth.ts` (menggunakan Auth.js v5 pattern):

```ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const staff = await prisma.staff.findUnique({
          where: { email: credentials.email as string },
        });

        if (!staff) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          staff.password
        );

        if (!valid) return null;

        return { id: staff.id, email: staff.email, name: staff.nama };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token) session.user.id = token.id as string;
      return session;
    },
  },
});
```

- [ ] **Step 2: Buat API route handler**

Create `app/api/auth/[...nextauth]/route.ts`:

```ts
import { handlers } from "@/src/lib/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 3: Extend NextAuth types**

Create atau modify `src/types/next-auth.d.ts` (buat folder `src/types/`):

```ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    };
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/auth.ts "app/api/auth/[...nextauth]/route.ts" src/types/next-auth.d.ts && git commit -m "feat: add NextAuth.js credentials provider config"
```

---

## Task 4: API Routes — Permohonan

**Files:**
- Create: `app/api/permohonan/route.ts`
- Create: `app/api/permohonan/[id]/route.ts`

- [ ] **Step 1: GET & POST /api/permohonan**

Create `app/api/permohonan/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { generateTiket } from "@/src/lib/tiket";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = status ? { status } : {};

  const [data, total] = await Promise.all([
    prisma.permohonan.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.permohonan.count({ where }),
  ]);

  return NextResponse.json({ data, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { nama, nik, alamat, layanan, keperluan, telepon } = body;

  if (!nama || !alamat || !layanan || !keperluan || !telepon) {
    return NextResponse.json({ error: "Field wajib kosong" }, { status: 400 });
  }

  let tiket: string;
  do {
    tiket = generateTiket();
  } while (await prisma.permohonan.findUnique({ where: { tiket } }));

  const data = await prisma.permohonan.create({
    data: { tiket, nama, nik: nik || null, alamat, layanan, keperluan, telepon },
  });

  return NextResponse.json(data, { status: 201 });
}
```

- [ ] **Step 2: GET & PATCH /api/permohonan/[id]**

Create folder `app/api/permohonan/[id]/` dan file `route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await prisma.permohonan.findUnique({ where: { id: params.id } });
  if (!data) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { status, catatan } = body;

  const validStatuses = ["MENUNGGU", "DIPROSES", "SELESAI", "DITOLAK"];
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
  }

  const data = await prisma.permohonan.update({
    where: { id: params.id },
    data: { ...(status && { status }), ...(catatan !== undefined && { catatan }) },
  });

  return NextResponse.json(data);
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/permohonan/route.ts "app/api/permohonan/[id]/route.ts" && git commit -m "feat: add API routes for permohonan (GET list, POST create, GET/PATCH by id)"
```

---

## Task 5: API Routes — Pengaduan

**Files:**
- Create: `app/api/pengaduan/route.ts`
- Create: `app/api/pengaduan/[id]/route.ts`

- [ ] **Step 1: GET & POST /api/pengaduan**

Create `app/api/pengaduan/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { generateTiket } from "@/src/lib/tiket";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = status ? { status } : {};

  const [data, total] = await Promise.all([
    prisma.pengaduan.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.pengaduan.count({ where }),
  ]);

  return NextResponse.json({ data, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { nama, telepon, email, topik, pesan } = body;

  if (!nama || !topik || !pesan) {
    return NextResponse.json({ error: "Field wajib kosong" }, { status: 400 });
  }

  let tiket: string;
  do {
    tiket = generateTiket();
  } while (await prisma.pengaduan.findUnique({ where: { tiket } }));

  const data = await prisma.pengaduan.create({
    data: { tiket, nama, telepon: telepon || null, email: email || null, topik, pesan },
  });

  return NextResponse.json(data, { status: 201 });
}
```

- [ ] **Step 2: GET & PATCH /api/pengaduan/[id]**

Create folder `app/api/pengaduan/[id]/` dan file `route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await prisma.pengaduan.findUnique({ where: { id: params.id } });
  if (!data) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { status } = body;

  const validStatuses = ["MENUNGGU", "DIPROSES", "SELESAI", "DITOLAK"];
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
  }

  const data = await prisma.pengaduan.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json(data);
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/pengaduan/route.ts "app/api/pengaduan/[id]/route.ts" && git commit -m "feat: add API routes for pengaduan (GET list, POST create, GET/PATCH by id)"
```

---

## Task 6: API Route — Cek Tiket Publik

**Files:**
- Create: `app/api/cek-tiket/[tiket]/route.ts`

- [ ] **Step 1: GET /api/cek-tiket/[tiket]**

Create `app/api/cek-tiket/[tiket]/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { tiket: string } }) {
  const tiket = params.tiket.toUpperCase().trim();

  const [permohonan, pengaduan] = await Promise.all([
    prisma.permohonan.findUnique({ where: { tiket } }),
    prisma.pengaduan.findUnique({ where: { tiket } }),
  ]);

  if (!permohonan && !pengaduan) {
    return NextResponse.json({ error: "Tiket tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({
    tiket,
    permohonan,
    pengaduan,
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/api/cek-tiket/[tiket]/route.ts" && git commit -m "feat: add public API /api/cek-tiket/[tiket] untuk warga"
```

---

## Task 7: Middleware Proteksi Route

**Files:**
- Create: `middleware.ts` (root)

- [ ] **Step 1: Buat middleware**

Create `middleware.ts` di root project (`D:/si manggis/middleware.ts`):

```ts
import { auth } from "@/src/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isApi = req.nextUrl.pathname.startsWith("/api/permohonan") ||
                req.nextUrl.pathname.startsWith("/api/pengaduan");

  if ((isDashboard || isApi) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/permohonan/:path*", "/api/pengaduan/:path*"],
};
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts && git commit -m "feat: add NextAuth middleware protecting /dashboard and API routes"
```

---

## Task 8: Login Page (Rename dari /masuk)

**Files:**
- Rename: `app/masuk/page.tsx` → `app/login/page.tsx`

- [ ] **Step 1: Ubah action untuk NextAuth**

Edit `app/login/page.tsx`:
1. Ganti `import Link from "next/link"` tambahkan `import { signIn } from "next-auth/react"` (note: page ini tetap client component)
2. Ganti `handleSubmit` supaya pakai `signIn("credentials", {...})` bukan alert:

```ts
import { signIn } from "next-auth/react";
// ...existing imports

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  const result = await signIn("credentials", {
    email: form.nik, // gunakan field email untuk email staff
    password: form.password,
    redirect: false,
  });

  if (result?.error) {
    setError("Email atau kata sandi salah.");
    setLoading(false);
    return;
  }

  window.location.href = "/dashboard";
};
```

3. Update label form: ganti "NIK" jadi "Email", hapus `maxLength={16}`, ganti `inputMode="numeric"` jadi `inputMode="email"`, dan placeholder jadi "admin@desaguntingmanggis.id".
4. Hapus link "Belum punya akun? Daftar di kantor desa" (staff nggak perlu daftar dari UI).

- [ ] **Step 2: Redirect /masuk ke /login**

Edit `app/masuk/page.tsx`, ganti isinya jadi redirect sederhana:

```tsx
import { redirect } from "next/navigation";

export default function MasukPage() {
  redirect("/login");
}
```

Tambahkan `"use client"` tidak perlu — server component redirect saja.

- [ ] **Step 3: Commit**

```bash
git add "app/login/page.tsx" "app/masuk/page.tsx" && git commit -m "feat: rename /masuk to /login, integrate NextAuth signIn"
```

---

## Task 9: Dashboard Staff Layout

**Files:**
- Create: `app/dashboard/layout.tsx`
- Modify: `src/components/Navbar.tsx` (opsional: highlight active nav)

- [ ] **Step 1: Buat Dashboard Layout**

Create `app/dashboard/layout.tsx`:

```tsx
import { auth, signOut } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  LogOut,
  Home,
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Beranda" },
    { href: "/dashboard/permohonan", icon: FileText, label: "Permohonan" },
    { href: "/dashboard/pengaduan", icon: MessageSquare, label: "Pengaduan" },
  ];

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 flex flex-col">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-stone-200">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-[#1e40af] flex items-center justify-center">
              <span className="text-sm font-bold text-white">SM</span>
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900">Si-Manggis</p>
              <p className="text-[10px] text-stone-400">Dashboard Staff</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-500 hover:text-[#1e40af] hover:bg-[#eff6ff] transition-colors"
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-stone-200 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-colors"
          >
            <Home size={17} />
            Lihat Situs
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut size={17} />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header bar */}
        <header className="h-16 bg-white border-b border-stone-200 flex items-center px-8">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm font-medium text-stone-500">
              {session.user?.name ?? session.user?.email}
            </p>
            <p className="text-xs text-stone-400">Staff Dashboard</p>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/layout.tsx && git commit -m "feat: add dashboard staff layout with sidebar navigation"
```

---

## Task 10: Dashboard Staff — Beranda

**Files:**
- Create: `app/dashboard/page.tsx`

- [ ] **Step 1: Dashboard beranda**

Create `app/dashboard/page.tsx`:

```tsx
import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import { FileText, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";

export default async function DashboardPage() {
  const [totalPermohonan, totalPengaduan, menungguPermohonan, menungguPengaduan, selesaiPermohonan, selesaiPengaduan] =
    await Promise.all([
      prisma.permohonan.count(),
      prisma.pengaduan.count(),
      prisma.permohonan.count({ where: { status: "MENUNGGU" } }),
      prisma.pengaduan.count({ where: { status: "MENUNGGU" } }),
      prisma.permohonan.count({ where: { status: "SELESAI" } }),
      prisma.pengaduan.count({ where: { status: "SELESAI" } }),
    ]);

  const recentPermohonan = await prisma.permohonan.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentPengaduan = await prisma.pengaduan.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const statCards = [
    {
      label: "Total Permohonan",
      value: totalPermohonan,
      icon: FileText,
      color: "bg-[#eff6ff] text-[#1e40af]",
      href: "/dashboard/permohonan",
    },
    {
      label: "Total Pengaduan",
      value: totalPengaduan,
      icon: MessageSquare,
      color: "bg-[#f0fdf4] text-[#16a34a]",
      href: "/dashboard/pengaduan",
    },
    {
      label: "Menunggu",
      value: menungguPermohonan + menungguPengaduan,
      icon: Clock,
      color: "bg-[#fff7ed] text-[#f97316]",
      href: "/dashboard/permohonan?status=MENUNGGU",
    },
    {
      label: "Selesai",
      value: selesaiPermohonan + selesaiPengaduan,
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600",
      href: "/dashboard/permohonan?status=SELESAI",
    },
  ];

  const statusColors: Record<string, string> = {
    MENUNGGU: "bg-yellow-100 text-yellow-700",
    DIPROSES: "bg-blue-100 text-blue-700",
    SELESAI: "bg-green-100 text-green-700",
    DITOLAK: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
        <p className="text-sm text-stone-500 mt-1">Ringkasan permohonan dan pengaduan warga.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-xl border border-stone-200 p-5 hover-lift flex items-center gap-4 cursor-pointer"
          >
            <div className={`h-11 w-11 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">{value}</p>
              <p className="text-xs text-stone-500">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent permohonan */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900">Permohonan Terbaru</h2>
            <Link href="/dashboard/permohonan" className="text-xs text-[#1e40af] font-medium hover:underline">
              Lihat Semua
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {recentPermohonan.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-8">Belum ada permohonan.</p>
            ) : (
              recentPermohonan.map((p) => (
                <Link
                  key={p.id}
                  href={`/dashboard/permohonan/${p.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold text-stone-800">{p.nama}</p>
                    <p className="text-xs text-stone-400">{p.layanan}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColors[p.status]}`}>
                    {p.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent pengaduan */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900">Pengaduan Terbaru</h2>
            <Link href="/dashboard/pengaduan" className="text-xs text-[#1e40af] font-medium hover:underline">
              Lihat Semua
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {recentPengaduan.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-8">Belum ada pengaduan.</p>
            ) : (
              recentPengaduan.map((p) => (
                <Link
                  key={p.id}
                  href={`/dashboard/pengaduan/${p.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold text-stone-800">{p.nama}</p>
                    <p className="text-xs text-stone-400">{p.topik}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColors[p.status]}`}>
                    {p.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/page.tsx && git commit -m "feat: add dashboard staff beranda with stats and recent lists"
```

---

## Task 11: Dashboard Staff — Permohonan List

**Files:**
- Create: `app/dashboard/permohonan/page.tsx`

- [ ] **Step 1: List permohonan dengan filter**

Create `app/dashboard/permohonan/page.tsx`:

```tsx
import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import { FileText, Search } from "lucide-react";

export default async function PermohonanPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string };
}) {
  const status = searchParams.status ?? "";
  const page = parseInt(searchParams.page ?? "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = status ? { status } : {};

  const [data, total] = await Promise.all([
    prisma.permohonan.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.permohonan.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  const statusColors: Record<string, string> = {
    MENUNGGU: "bg-yellow-100 text-yellow-700",
    DIPROSES: "bg-blue-100 text-blue-700",
    SELESAI: "bg-green-100 text-green-700",
    DITOLAK: "bg-red-100 text-red-700",
  };

  const filters = [
    { label: "Semua", value: "" },
    { label: "Menunggu", value: "MENUNGGU" },
    { label: "Diproses", value: "DIPROSES" },
    { label: "Selesai", value: "SELESAI" },
    { label: "Ditolak", value: "DITOLAK" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Permohonan Layanan</h1>
          <p className="text-sm text-stone-500 mt-1">{total} permohonan ditemukan.</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/dashboard/permohonan?status=${f.value}` : "/dashboard/permohonan"}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              status === f.value
                ? "bg-[#1e40af] text-white"
                : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                {["Tiket", "Nama", "Layanan", "Telepon", "Status", "Tanggal", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-stone-400">
                    <FileText size={32} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm">Belum ada permohonan.</p>
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono font-semibold text-[#1e40af]">{row.tiket}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-stone-800">{row.nama}</p>
                      {row.nik && <p className="text-xs text-stone-400">{row.nik}</p>}
                    </td>
                    <td className="px-5 py-4 text-sm text-stone-600">{row.layanan}</td>
                    <td className="px-5 py-4 text-sm text-stone-600">{row.telepon}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColors[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-stone-400">
                      {new Date(row.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/dashboard/permohonan/${row.id}`}
                        className="text-xs font-semibold text-[#1e40af] hover:underline"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-stone-100 flex items-center justify-between">
            <p className="text-xs text-stone-400">
              Halaman {page} dari {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/dashboard/permohonan?status=${status}&page=${page - 1}`}
                  className="px-3 py-1.5 text-xs font-medium bg-white border border-stone-200 rounded-lg hover:bg-stone-50"
                >
                  ← Sebelumnya
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/dashboard/permohonan?status=${status}&page=${page + 1}`}
                  className="px-3 py-1.5 text-xs font-medium bg-white border border-stone-200 rounded-lg hover:bg-stone-50"
                >
                  Selanjutnya →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/permohonan/page.tsx && git commit -m "feat: add dashboard permohonan list page with filter and pagination"
```

---

## Task 12: Dashboard Staff — Permohonan Detail

**Files:**
- Create: `app/dashboard/permohonan/[id]/page.tsx`

- [ ] **Step 1: Detail + update status permohonan**

Create `app/dashboard/permohonan/[id]/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle } from "lucide-react";

export default function PermohonanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/permohonan/${id}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, [id]);

  const handleUpdate = async (status: string) => {
    setSaving(true);
    const res = await fetch(`/api/permohonan/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setData((prev) => ({ ...prev, ...updated }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const handleCatatan = async (catatan: string) => {
    setSaving(true);
    const res = await fetch(`/api/permohonan/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ catatan }),
    });
    if (res.ok) {
      const updated = await res.json();
      setData((prev) => ({ ...prev, ...updated }));
    }
    setSaving(false);
  };

  if (loading) return <div className="text-stone-400">Memuat...</div>;

  const statusColors: Record<string, string> = {
    MENUNGGU: "bg-yellow-100 text-yellow-700",
    DIPROSES: "bg-blue-100 text-blue-700",
    SELESAI: "bg-green-100 text-green-700",
    DITOLAK: "bg-red-100 text-red-700",
  };

  const statuses = ["MENUNGGU", "DIPROSES", "SELESAI", "DITOLAK"];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back + header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/permohonan"
          className="flex items-center gap-2 text-sm text-stone-500 hover:text-[#1e40af] transition-colors"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-stone-900">Detail Permohonan</h1>
          {saved && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <CheckCircle size={12} /> Tersimpan
            </span>
          )}
        </div>
      </div>

      {/* Tiket badge */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <p className="text-xs text-stone-400 font-semibold uppercase tracking-wide mb-1">Nomor Tiket</p>
        <p className="text-2xl font-mono font-bold text-[#1e40af]">{data.tiket}</p>
        <p className="text-xs text-stone-400 mt-1">
          Diajukan: {new Date(data.createdAt ?? Date.now()).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      {/* Info warga */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-sm font-bold text-stone-900 mb-4">Informasi Pemohon</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Nama", value: data.nama },
            { label: "NIK", value: data.nik || "-" },
            { label: "Alamat", value: data.alamat },
            { label: "Telepon", value: data.telepon },
            { label: "Layanan", value: data.layanan },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">{label}</p>
              <p className="text-sm font-semibold text-stone-800">{value}</p>
            </div>
          ))}
          <div className="col-span-2">
            <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Keperluan</p>
            <p className="text-sm text-stone-700 bg-stone-50 rounded-lg px-4 py-3">{data.keperluan}</p>
          </div>
          {data.catatan && (
            <div className="col-span-2">
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Catatan Staff</p>
              <p className="text-sm text-stone-700 bg-stone-50 rounded-lg px-4 py-3">{data.catatan}</p>
            </div>
          )}
        </div>
      </div>

      {/* Update status */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-sm font-bold text-stone-900 mb-4">Update Status</h2>
        <div className="flex flex-wrap gap-2 mb-5">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => handleUpdate(s)}
              disabled={saving}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                data.status === s
                  ? `${statusColors[s]} ring-2 ring-offset-1 ring-stone-300`
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              } ${saving ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Catatan */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1.5">Catatan Staff</label>
          <div className="flex gap-3">
            <textarea
              id="catatan"
              rows={2}
              defaultValue={data.catatan ?? ""}
              className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 resize-none"
              placeholder="Tambahkan catatan..."
            />
            <button
              onClick={() => {
                const val = (document.getElementById("catatan") as HTMLTextAreaElement).value;
                handleCatatan(val);
              }}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1e40af] text-white text-sm font-semibold rounded-lg hover:bg-[#1e3a8a] disabled:opacity-60 cursor-pointer"
            >
              <Save size={15} />
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/dashboard/permohonan/[id]/page.tsx" && git commit -m "feat: add permohonan detail page with status update"
```

---

## Task 13: Dashboard Staff — Pengaduan List & Detail

**Files:**
- Create: `app/dashboard/pengaduan/page.tsx`
- Create: `app/dashboard/pengaduan/[id]/page.tsx`

- [ ] **Step 1: Pengaduan list page**

Create `app/dashboard/pengaduan/page.tsx` — sama pattern-nya dengan permohonan list, tapi untuk model `Pengaduan`. Gunakan `topik` bukan `layanan`, `pesan` bukan `keperluan`.

```tsx
import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default async function PengaduanPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string };
}) {
  const status = searchParams.status ?? "";
  const page = parseInt(searchParams.page ?? "1");
  const limit = 20;
  const skip = (page - 1) * limit;
  const where = status ? { status } : {};

  const [data, total] = await Promise.all([
    prisma.pengaduan.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.pengaduan.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const statusColors: Record<string, string> = {
    MENUNGGU: "bg-yellow-100 text-yellow-700",
    DIPROSES: "bg-blue-100 text-blue-700",
    SELESAI: "bg-green-100 text-green-700",
    DITOLAK: "bg-red-100 text-red-700",
  };
  const filters = [
    { label: "Semua", value: "" },
    { label: "Menunggu", value: "MENUNGGU" },
    { label: "Diproses", value: "DIPROSES" },
    { label: "Selesai", value: "SELESAI" },
    { label: "Ditolak", value: "DITOLAK" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Pengaduan Warga</h1>
          <p className="text-sm text-stone-500 mt-1">{total} pengaduan ditemukan.</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/dashboard/pengaduan?status=${f.value}` : "/dashboard/pengaduan"}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              status === f.value
                ? "bg-[#1e40af] text-white"
                : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                {["Tiket", "Nama", "Topik", "Kontak", "Status", "Tanggal", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-stone-400">
                    <MessageSquare size={32} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm">Belum ada pengaduan.</p>
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono font-semibold text-[#1e40af]">{row.tiket}</span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-stone-800">{row.nama}</td>
                    <td className="px-5 py-4 text-sm text-stone-600">{row.topik}</td>
                    <td className="px-5 py-4 text-xs text-stone-400">{row.telepon ?? row.email ?? "-"}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColors[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-stone-400">
                      {new Date(row.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/dashboard/pengaduan/${row.id}`} className="text-xs font-semibold text-[#1e40af] hover:underline">
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-stone-100 flex items-center justify-between">
            <p className="text-xs text-stone-400">Halaman {page} dari {totalPages}</p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/dashboard/pengaduan?status=${status}&page=${page - 1}`} className="px-3 py-1.5 text-xs font-medium bg-white border border-stone-200 rounded-lg hover:bg-stone-50">
                  ← Sebelumnya
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/dashboard/pengaduan?status=${status}&page=${page + 1}`} className="px-3 py-1.5 text-xs font-medium bg-white border border-stone-200 rounded-lg hover:bg-stone-50">
                  Selanjutnya →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Pengaduan detail page**

Create `app/dashboard/pengaduan/[id]/page.tsx` — sama pattern-nya dengan permohonan detail, tapi untuk `Pengaduan` (tanpa field `catatan`, cukup update status).

```tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function PengaduanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/pengaduan/${id}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, [id]);

  const handleUpdate = async (status: string) => {
    setSaving(true);
    const res = await fetch(`/api/pengaduan/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setData((prev) => ({ ...prev, ...updated }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  if (loading) return <div className="text-stone-400">Memuat...</div>;

  const statusColors: Record<string, string> = {
    MENUNGGU: "bg-yellow-100 text-yellow-700",
    DIPROSES: "bg-blue-100 text-blue-700",
    SELESAI: "bg-green-100 text-green-700",
    DITOLAK: "bg-red-100 text-red-700",
  };
  const statuses = ["MENUNGGU", "DIPROSES", "SELESAI", "DITOLAK"];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/pengaduan" className="flex items-center gap-2 text-sm text-stone-500 hover:text-[#1e40af] transition-colors">
          <ArrowLeft size={16} /> Kembali
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-stone-900">Detail Pengaduan</h1>
          {saved && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <CheckCircle size={12} /> Tersimpan
            </span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <p className="text-xs text-stone-400 font-semibold uppercase tracking-wide mb-1">Nomor Tiket</p>
        <p className="text-2xl font-mono font-bold text-[#1e40af]">{data.tiket}</p>
        <p className="text-xs text-stone-400 mt-1">
          Diajukan: {new Date(data.createdAt ?? Date.now()).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-sm font-bold text-stone-900 mb-4">Informasi Pengadu</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Nama", value: data.nama },
            { label: "Telepon", value: data.telepon ?? "-" },
            { label: "Email", value: data.email ?? "-" },
            { label: "Topik", value: data.topik },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-stone-400 font-semibold uppercase mb-1">{label}</p>
              <p className="text-sm font-semibold text-stone-800">{value}</p>
            </div>
          ))}
          <div className="col-span-2">
            <p className="text-xs text-stone-400 font-semibold uppercase mb-1">Isi Pengaduan</p>
            <p className="text-sm text-stone-700 bg-stone-50 rounded-lg px-4 py-3">{data.pesan}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="text-sm font-bold text-stone-900 mb-4">Update Status</h2>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => handleUpdate(s)}
              disabled={saving}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                data.status === s
                  ? `${statusColors[s]} ring-2 ring-offset-1 ring-stone-300`
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              } ${saving ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/pengaduan/page.tsx "app/dashboard/pengaduan/[id]/page.tsx" && git commit -m "feat: add dashboard pengaduan list and detail pages"
```

---

## Task 14: Halaman Cek Tiket Publik

**Files:**
- Create: `app/cek-tiket/page.tsx`
- Create: `app/cek-tiket/[tiket]/page.tsx`

- [ ] **Step 1: Form input nomor tiket**

Create `app/cek-tiket/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Ticket } from "lucide-react";

export default function CekTiketPage() {
  const [tiket, setTiket] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCek = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tiket.trim()) return;
    setLoading(true);
    setError("");
    const res = await fetch(`/api/cek-tiket/${encodeURIComponent(tiket.trim().toUpperCase())}`);
    if (res.status === 404) {
      setError("Tiket tidak ditemukan. Periksa kembali nomor tiket Anda.");
      setLoading(false);
      return;
    }
    if (!res.ok) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
      return;
    }
    router.push(`/cek-tiket/${encodeURIComponent(tiket.trim().toUpperCase())}`);
  };

  return (
    <main className="flex flex-col min-h-full">
      {/* Hero mini */}
      <section className="bg-[#1e3a5f] pt-28 pb-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">
            Lacak Permohonan
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Cek Status Tiket
          </h1>
          <p className="text-white/50 text-sm mt-2 max-w-md">
            Masukkan nomor tiket permohonan atau pengaduan Anda untuk melihat status penanganannya.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="flex-1 bg-stone-50 py-14">
        <div className="mx-auto max-w-lg px-6 lg:px-8">
          <form onSubmit={handleCek} className="bg-white rounded-2xl border border-stone-200 p-7 shadow-sm">
            <div className="text-center mb-6">
              <div className="h-14 w-14 rounded-xl bg-[#eff6ff] flex items-center justify-center mx-auto mb-3">
                <Ticket size={24} className="text-[#1e40af]" />
              </div>
              <h2 className="text-lg font-bold text-stone-900">Lacak Tiket</h2>
              <p className="text-xs text-stone-500 mt-1">
                Format: <span className="font-mono font-semibold text-[#1e40af]">SM-2026-XXXXXX</span>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5 text-xs text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <input
                type="text"
                value={tiket}
                onChange={(e) => setTiket(e.target.value.toUpperCase())}
                placeholder="SM-2026-123456"
                className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm font-mono text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                maxLength={20}
              />
              <button
                type="submit"
                disabled={loading || !tiket.trim()}
                className="flex items-center gap-2 bg-[#1e40af] text-white font-semibold text-sm px-5 py-3 rounded-lg hover:bg-[#1e3a8a] disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {loading ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <Search size={16} />
                )}
                Cek
              </button>
            </div>

            <p className="text-center text-xs text-stone-400 mt-4">
              Nomor tiket diperoleh saat permohonan atau pengaduan Anda terdaftar.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Hasil pencarian tiket**

Create `app/cek-tiket/[tiket]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Ticket, FileText, MessageSquare } from "lucide-react";

async function getTiketData(tiket: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/cek-tiket/${encodeURIComponent(tiket)}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default async function CekTiketResultPage({
  params,
}: {
  params: { tiket: string };
}) {
  const tiket = decodeURIComponent(params.tiket);

  let result;
  try {
    result = await getTiketData(tiket);
  } catch {
    notFound();
  }

  if (!result) notFound();

  const { permohonan, pengaduan } = result;

  const statusColors: Record<string, string> = {
    MENUNGGU: "bg-yellow-100 text-yellow-700",
    DIPROSES: "bg-blue-100 text-blue-700",
    SELESAI: "bg-green-100 text-green-700",
    DITOLAK: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    MENUNGGU: "Menunggu",
    DIPROSES: "Sedang Diproses",
    SELESAI: "Selesai",
    DITOLAK: "Ditolak",
  };

  return (
    <main className="flex flex-col min-h-full">
      <section className="bg-[#1e3a5f] pt-28 pb-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link
            href="/cek-tiket"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Kembali
          </Link>
          <div className="flex items-center gap-3">
            <Ticket size={24} className="text-white/60" />
            <div>
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-0.5">
                Hasil Pencarian
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono">
                {tiket}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-stone-50">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 space-y-6">
          {/* Permohonan */}
          {permohonan && (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <div className="bg-[#eff6ff] px-6 py-4 flex items-center gap-3">
                <FileText size={18} className="text-[#1e40af]" />
                <div>
                  <p className="text-xs font-bold text-[#1e40af] uppercase tracking-wide">Permohonan Layanan</p>
                  <p className="text-sm font-semibold text-stone-700">{permohonan.layanan}</p>
                </div>
                <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${statusColors[permohonan.status]}`}>
                  {statusLabels[permohonan.status]}
                </span>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { label: "Nama Pemohon", value: permohonan.nama },
                  { label: "NIK", value: permohonan.nik ?? "-" },
                  { label: "Alamat", value: permohonan.alamat },
                  { label: "Telepon", value: permohonan.telepon },
                  { label: "Keperluan", value: permohonan.keperluan },
                  {
                    label: "Diajukan",
                    value: new Date(permohonan.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                    }),
                  },
                  {
                    label: "Terakhir Diperbarui",
                    value: new Date(permohonan.updatedAt).toLocaleDateString("id-ID", {
                      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                    }),
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide w-36 flex-shrink-0">{label}</p>
                    <p className="text-sm text-stone-800">{value}</p>
                  </div>
                ))}
                {permohonan.catatan && (
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 pt-2 border-t border-stone-100">
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide w-36 flex-shrink-0">Catatan</p>
                    <p className="text-sm text-stone-700 bg-yellow-50 rounded-lg px-3 py-2">{permohonan.catatan}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pengaduan */}
          {pengaduan && (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <div className="bg-[#f0fdf4] px-6 py-4 flex items-center gap-3">
                <MessageSquare size={18} className="text-[#16a34a]" />
                <div>
                  <p className="text-xs font-bold text-[#16a34a] uppercase tracking-wide">Pengaduan</p>
                  <p className="text-sm font-semibold text-stone-700">{pengaduan.topik}</p>
                </div>
                <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${statusColors[pengaduan.status]}`}>
                  {statusLabels[pengaduan.status]}
                </span>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { label: "Nama Pengadu", value: pengaduan.nama },
                  { label: "Telepon", value: pengaduan.telepon ?? "-" },
                  { label: "Email", value: pengaduan.email ?? "-" },
                  { label: "Isi Pengaduan", value: pengaduan.pesan },
                  {
                    label: "Diajukan",
                    value: new Date(pengaduan.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                    }),
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide w-36 flex-shrink-0">{label}</p>
                    <p className="text-sm text-stone-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          <div className="bg-[#FEFCE8] rounded-xl border border-stone-200 px-5 py-4">
            <p className="text-sm text-stone-600">
              Hubungi kantor desa jika status tidak berubah dalam waktu lama atau ada pertanyaan lainnya.
            </p>
          </div>

          {/* Back link */}
          <div className="text-center">
            <Link href="/cek-tiket" className="text-sm text-[#1e40af] font-semibold hover:underline">
              Cek tiket lain →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/cek-tiket/page.tsx "app/cek-tiket/[tiket]/page.tsx" && git commit -m "feat: add public cek-tiket pages for warga to track status"
```

---

## Task 15: Navbar — Update dan Sinkronisasi

**Files:**
- Modify: `src/components/Navbar.tsx`
- Modify: `app/layout.tsx` (update metadata)

- [ ] **Step 1: Update Navbar links**

Navbar saat ini punya link `/masuk` (Dashboard). Ubah:
- `/masuk` → `/login` (staff login)
- Tambahkan `/cek-tiket` ke navLinks untuk warga cek tiket

Ubah array `navLinks` di `Navbar.tsx`:

```ts
const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "Layanan", href: "/layanan" },
  { label: "Darurat", href: "/darurat" },
  { label: "Kabar", href: "/artikel" },
  { label: "Kontak", href: "/kontak" },
  { label: "Cek Tiket", href: "/cek-tiket" },
];
```

Dan tombol "Dashboard" di navbar tetap `/login` (karena itu sekarang staff login page).

- [ ] **Step 2: Commit**

```bash
git add src/components/Navbar.tsx && git commit -m "feat: update navbar links — add Cek Tiket, redirect /masuk to /login"
```

---

## Task 16: Verifikasi End-to-End

- [ ] **Step 1: Build project**

Run: `npm run build`

Expected: Build successful, no TypeScript errors.

- [ ] **Step 2: Start dev server dan test**

Run: `npm run dev`

1. Buka `http://localhost:3000/cek-tiket` — form cek tiket harus muncul.
2. Submit tiket random (misal `SM-2026-000001`) → harus muncul "Tiket tidak ditemukan".
3. Buka `http://localhost:3000/login` — form login staff harus muncul.
4. Login dengan `admin@desaguntingmanggis.id` / `staff2026` → harus redirect ke `/dashboard`.
5. Di dashboard, klik "Permohonan" → harus muncul tabel kosong.
6. Buat permohonan via POST (via fetch/curl): `curl -X POST http://localhost:3000/api/permohonan -H "Content-Type: application/json" -H "Cookie: ..." -d '{"nama":"Test","alamat":"Alamat Test","layanan":"Surat Keterangan","keperluan":"Test","telepon":"0812"}'` — harus return tiket SM-2026-XXXXXX.
8. Buka `http://localhost:3000/cek-tiket/[TIKET_HASIL]` → harus tampil detail permohonan.
9. Di dashboard, ubah status → harus berubah.
10. Logout → harus redirect ke `/login`.

- [ ] **Step 3: Push branch `alamat` ke remote**

```bash
git checkout -b alamat
git push -u origin alamat
```

---

## Spec Coverage Checklist

| Spec Section | Task |
|---|---|
| Database schema (Staff, Permohonan, Pengaduan) | Task 1 |
| Tiket format SM-2026-XXXXXX | Task 2 |
| NextAuth.js credentials auth | Task 3 |
| GET/POST /api/permohonan | Task 4 |
| GET/PATCH /api/permohonan/[id] | Task 5 |
| GET/POST /api/pengaduan | Task 5 |
| GET/PATCH /api/pengaduan/[id] | Task 5 |
| GET /api/cek-tiket/[tiket] | Task 6 |
| Middleware proteksi /dashboard | Task 7 |
| /login page (NextAuth) | Task 8 |
| Dashboard layout + sidebar | Task 9 |
| Dashboard beranda (stats + recent) | Task 10 |
| /dashboard/permohonan list | Task 11 |
| /dashboard/permohonan/[id] detail | Task 12 |
| /dashboard/pengaduan list | Task 13 |
| /dashboard/pengaduan/[id] detail | Task 13 |
| /cek-tiket form | Task 14 |
| /cek-tiket/[tiket] result | Task 14 |
| Seed data | Task 1 |
