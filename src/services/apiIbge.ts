import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const CONFIG: AxiosRequestConfig = {
    timeout: parseInt(process.env.VUE_APP_API_TIMEOUT || '5000', 10),
    baseURL: `${
        process.env.NODE_ENV === 'production' ? 'https' : 'http'
    }://viacep.com.br/ws`,
    headers: {
        Accept: 'application/json',
    },
};

export default class ApiIbgeAdapter {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create(CONFIG);
    }

    async get(zipCode: string) {
        const res = await this.instance.get(`${zipCode}/json/`);

        return res.data.results || res.data;
    }
}
