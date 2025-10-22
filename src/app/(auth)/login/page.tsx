"use client"

import { InputWithLabel } from "@/components/InputWithLabel";
import { Button } from "@/components/ui/button"
import { authService } from "@/services/authService";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function login(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError("");
      
      await authService.login({
        username: email,
        password: password,
      });
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-2">
      <div className="w-full h-[500px] max-w-[900px] flex items-center">
        <div className="bg-grayScale-50 rounded-lg md:rounded-r-none p-6 flex flex-col justify-center gap-7 w-full h-full md:w-[45%]">
          <form onSubmit={login} className="space-y-3">
            <div>
              <p className="text-2xl font-semibold text-foreground">Bem-vindo ao</p>
              <p className="text-3xl font-bold text-foreground">Painel <span className="text-primary">Admin</span></p>
              <p className="mt-2 text-muted-foreground">
                Tenha acesso a todas as ferramentas necessárias para o seu negócio.
              </p>
            </div>

            <div className="space-y-1.5">
              <InputWithLabel
                label="Email"
                id="email"
                type="email"
                placeholder="seuemail@email.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <InputWithLabel
                label="Senha"
                id="password"
                type="password"
                placeholder="********"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button 
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? <LoaderCircle className="animate-spin" /> : 'Entrar'}
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