class ApiConfig {
    public getBaseUrl(): string {
        // prioridade env
        if(import.meta.env.VITE_API_URL) {
            return import.meta.env.VITE_API_URL
        }

        const {hostname,protocol} = window.location
        const isLocal = hostname === 'localhost' || hostname === '127.0.0.1'

        if(isLocal){
            return `http://localhost:8000`
        }

        return `${protocol}//api.${hostname}`
    }

    public getUrl(endpoint: string) {
        const baseUrl = this.getBaseUrl()
        // remover barras duplicadas
        return `${baseUrl.replace(/\/$/, '')}/api/${endpoint.replace(/^\//, '')}`
    }

    public getWebsocketUrl(): string {
        const baseUrl = this.getBaseUrl()
        return baseUrl.replace(/^http/, 'ws')
    }
}

export const apiConfig = new ApiConfig()
export const API_URL = apiConfig.getBaseUrl()

// conveniencia para urls da api
export const apiUrl = (endpoint: string): string => apiConfig.getUrl(endpoint)