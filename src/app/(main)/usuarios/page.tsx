"use client"

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { userService, type Usuario } from "@/services/userService";

export default function Usuarios() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetAtivos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsuariosAtivos();
      setResponse(data);
      console.log("Usuários ativos:", data);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar usuários ativos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetInativos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsuariosInativos();
      setResponse(data);
      console.log("Usuários inativos:", data);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar usuários inativos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Testar POST criar usuário
  const handleCreateUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const novoUsuario = {
        nome: "Teste Usuário",
        email: "teste@email.com",
        senha: "senha123",
        cpf: "12345678900",
      };
      const data = await userService.createUsuario(novoUsuario);
      setResponse(data);
      console.log("Usuário criado:", data);
    } catch (err: any) {
      setError(err.message || "Erro ao criar usuário");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAtivarUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = 1; // Altere para um ID real
      const data = await userService.ativarUsuario(userId);
      setResponse(data);
      console.log("Usuário ativado:", data);
    } catch (err: any) {
      setError(err.message || "Erro ao ativar usuário");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDesativarUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = 1; // Altere para um ID real
      const data = await userService.desativarUsuario(userId);
      setResponse(data);
      console.log("Usuário desativado:", data);
    } catch (err: any) {
      setError(err.message || "Erro ao desativar usuário");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
        <p className="text-muted-foreground mt-2">
          Teste das APIs de usuários
        </p>
      </div>

      {/* Botões de Teste */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Button 
          onClick={handleGetAtivos}
          disabled={loading}
          variant="default"
        >
          GET Usuários Ativos
        </Button>

        <Button 
          onClick={handleGetInativos}
          disabled={loading}
          variant="default"
        >
          GET Usuários Inativos
        </Button>

        <Button 
          onClick={handleCreateUser}
          disabled={loading}
          variant="default"
        >
          POST Criar Usuário
        </Button>

        <Button 
          onClick={handleAtivarUser}
          disabled={loading}
          variant="default"
        >
          PUT Ativar Usuário (ID: 1)
        </Button>

        <Button 
          onClick={handleDesativarUser}
          disabled={loading}
          variant="destructive"
        >
          PUT Desativar Usuário (ID: 1)
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-center">Carregando...</p>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-destructive font-semibold">Erro:</p>
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Resposta */}
      {response && !loading && (
        <div className="p-4 bg-card border rounded-lg">
          <p className="font-semibold mb-2">Resposta da API:</p>
          <pre className="bg-muted p-4 rounded overflow-auto text-sm">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}