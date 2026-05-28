import { auth, signOut } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  LogOut,
  Home,
  Images,
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
    { href: "/dashboard/homepage", icon: Home, label: "Homepage" },
    { href: "/dashboard/aset", icon: Images, label: "Aset Website" },
    { href: "/dashboard/permohonan", icon: FileText, label: "Permohonan" },
    { href: "/dashboard/pengaduan", icon: MessageSquare, label: "Pengaduan" },
  ];

  return (
    <div className="flex min-h-screen bg-stone-50">
      <aside className="w-64 bg-white border-r border-stone-200 flex flex-col">
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

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-stone-200 flex items-center px-8">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm font-medium text-stone-500">
              {session.user?.name ?? session.user?.email}
            </p>
            <p className="text-xs text-stone-400">Staff Dashboard</p>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
