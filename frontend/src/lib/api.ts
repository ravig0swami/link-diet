const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

interface HealthResponse {
  success: boolean;
  message: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      const data = await response.json();
      return data as ApiResponse<T>;
    } catch {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: "Unable to connect to the server. Please try again.",
        },
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async checkHealth(): Promise<HealthResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/health`);
      const data = await response.json();
      return data as HealthResponse;
    } catch {
      return null;
    }
  }
}

export const api = new ApiClient(API_BASE_URL);

export type { ApiSuccessResponse, ApiErrorResponse, ApiResponse, HealthResponse };
