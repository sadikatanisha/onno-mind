"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

interface AppNavbarProps {
  userName?: string;
}

export function AppNavbar({ userName }: AppNavbarProps) {
  const pathname = usePathname();
  
  const navItems = [
    { href: "/agent", label: "Chat" },
    { href: "/dashboard", label: "Flashcards" },
    { href: "/decks", label: "Dashboard" },
    { href: "/docs", label: "Docs" },
  ];

  return (
    <nav className="bg-slate-900 text-white">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500">
            <Sparkles className="h-6 w-6 text-slate-900" />
          </div>
          <span className="text-xl font-semibold">youCards</span>
        </Link>
        
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "text-cyan-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {userName && <span className="text-sm font-medium">{userName}</span>}
          <UserButton />
        </div>
      </div>
    </nav>
  );
}
