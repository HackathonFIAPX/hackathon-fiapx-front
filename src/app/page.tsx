import { LoginForm } from "@/components/auth/LoginForm";
import { Clapperboard } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
       <div className="absolute top-8 left-8 flex items-center space-x-2 text-lg font-bold text-primary font-headline">
        <span>Vídeo Uploader</span>
      </div>
      <LoginForm />
    </main>
  );
}
