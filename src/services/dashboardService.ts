import chartData from '../../chartData.json';

export const dashboardService = {
    getDashboardData: async (): Promise<any> => {
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return chartData;
    } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        throw error;
    }
    },

    // getDashboardData: async (endpoint = '/dashboard/'): Promise<any> => {
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