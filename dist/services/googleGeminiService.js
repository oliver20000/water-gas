"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImageWithGemini = void 0;
const axios_1 = __importDefault(require("axios"));
const GEMINI_API_URL = 'https://ai.google.dev/gemini-api/v1vision';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const processImageWithGemini = async (base64Image) => {
    try {
        const response = await axios_1.default.post(GEMINI_API_URL, {
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
    }
    catch (error) {
        console.error('Erro ao processar a imagem com o Gemini:', error);
        throw new Error('Falha ao processar a imagem');
    }
    ;
};
exports.processImageWithGemini = processImageWithGemini;
