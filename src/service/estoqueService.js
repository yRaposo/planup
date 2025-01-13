'use server'
import { blingApi } from "@/libs/blingApi";

export async function getEstoque(id, token) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }

    const params = {
        'idsProdutos[]': [id],
    }

    try {
        const response = await blingApi.get('/estoques/saldos', { headers, params })
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function postEstoque(props, token) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }

    const data = props;

    console.log('Enviando dados:', data);
    console.log('data', props);
    console.log('Token:', token); 

    try {
        const response = await blingApi.post('/estoques', data, { headers })
        return response.data;
    } catch (error) {
        console.error(error.data);
        throw error;
    }
}