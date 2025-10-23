"use client";

import { InputIcon } from "@/components/InputIcon";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/useToast";
import { LoaderCircle, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function login(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      await authService.login({
        username: email,
        password: password,
      });

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo",
        duration: 3000,
      });

      router.push("/dashboard");
    } catch (err) {
      toast({
        title: "Erro ao fazer login",
        description: err instanceof Error ? err.message : "Credenciais inválidas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-2">
      <div className="w-full h-[600px] max-w-[1100px] flex items-center drop-shadow-md ">
        <div className="relative bg-background rounded-lg md:rounded-r-none p-6 flex flex-col justify-center gap-7 w-full h-full md:w-[45%]">
          <div className="absolute top-2 right-2">
            <ThemeToggle />
          </div>
          <form onSubmit={login} className="space-y-4">
            <div>
              <p className="text-2xl font-semibold text-foreground">Bem-vindo ao</p>
              <p className="text-3xl font-bold text-foreground">
                Painel <span className="text-primary">Admin</span>
              </p>
              <p className="mt-2 text-muted-foreground">Opere e acompanhe seu próprio negócio.</p>
            </div>

            <div className="space-y-1.5">
              <InputIcon
                label="Email"
                id="email"
                type="email"
                placeholder="seuemail@email.com"
                autoComplete="email"
                icon={Mail}
                iconPosition="left"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              <InputIcon
                label="Senha"
                id="password"
                type={visiblePassword ? "text" : "password"}
                placeholder="********"
                autoComplete="current-password"
                icon={Lock}
                iconPosition="left"
                actionIcon={visiblePassword ? Eye : EyeOff}
                onActionClick={() => setVisiblePassword(!visiblePassword)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Entrar"}
            </Button>
          </form>
        </div>

        <div className="hidden md:flex h-full w-[55%] items-center justify-center p-6 bg-primary rounded-r-lg">
          <img src="/login.webp" alt="Login" className="w-full h-auto max-w-[400px]" />
        </div>
      </div>
    </div>
  );
}
