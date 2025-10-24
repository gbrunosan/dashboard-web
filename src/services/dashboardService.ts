import chartData from "../../chartData.json";

import { DashboardData } from "@/types/DashboardData";

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    try {
      // só para simular o loading da requisição
      await new Promise((resolve) => setTimeout(resolve, 100));

      return chartData;
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      throw error;
    }
  },

  // getDashboardData: async (endpoint = '/dashboard/'): Promise<DashboardData> => {
  //   try {
  //     const response = await fetchApi(endpoint, {
  //       method: 'GET',
  //     });
  //     return response;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
};
