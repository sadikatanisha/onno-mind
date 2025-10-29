import { LandingNavbar } from "@/app/(public)/_components/landing-navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <LandingNavbar />
      {children}
    </div>
  );
}
