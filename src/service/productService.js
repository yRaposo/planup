'use server';
import { blingApi } from "@/libs/blingApi";

export async function getProducts(pagina, limite, token) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }
    const params = {
        'pagina': pagina,
        'limite': limite,
    }

    try {
        const response = await blingApi.get('/produtos', { headers, params })
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getProductById(id, token) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }

    try {
        const response = await blingApi.get(`/produtos/${id}`, { headers })
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}