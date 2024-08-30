import axios from 'axios';

const GEMINI_API_URL = 'https://ai.google.dev/gemini-api/v1vision';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface GeminiResponse {
    value: number;
    imageUrl: string;
}

export const processImageWithGemini = async (base64Image: string):
Promise<GeminiResponse> => {
    try {
        const response = await
        axios.post(GEMINI_API_URL, {
            image: base64Image,
        }, {
            headers: {
                'Authorization': `Bearer $ {GEMINI_API_KEY}`,
                'content-Type': 'application/json',
            }
        });
        return {
            value: response.data.value,
            imageUrl: response.data.imageUrl,
        };
    } catch (error) {
        console.error('Erro ao processar a imagem com o Gemini:', error);
        throw new Error('Falha ao processar a imagem');
    };
}