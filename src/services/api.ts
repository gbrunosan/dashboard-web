const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
  formData?: boolean;
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, formData, headers, body, ...restOptions } = options;

  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }

  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  let finalBody = body;
  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  if (formData && body) {
    const data = typeof body === "string" ? JSON.parse(body) : body;
    finalBody = new URLSearchParams(data).toString();
    finalHeaders["Content-Type"] = "application/x-www-form-urlencoded";
  } else if (!formData) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: finalHeaders,
      body: finalBody,
    });

    if (response.status === 401 && endpoint !== "/token/") {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("token");
        window.location.href = "/login";
      }
      throw new Error("Não autorizado");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `Erro ${response.status}`,
      }));
      throw new Error(error.message || error.detail || "Erro na requisição");
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro ao processar requisição");
  }
}

export { fetchApi };
