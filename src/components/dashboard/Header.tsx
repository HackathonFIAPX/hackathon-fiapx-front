"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Clapperboard, LogOut } from "lucide-react";

export function Header() {
  const router = useRouter();

  const handleLogout = () => {
    // Aqui você pode adicionar a lógica de logout (ex: limpar token)
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95">
      <div className="container flex h-16 max-w-screen-2xl items-center p-4">
        <div className="mr-4 flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block font-headline text-lg">
              Vídeo Uploader
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-foreground hover:bg-muted">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
