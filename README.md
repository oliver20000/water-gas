Water-Gas Consumption
Este é um serviço de back-end para gerenciar a leitura de consumo de água e gás usando imagens processadas por IA, através da integração com a API do Google Gemini.

Instalação
Clone este repositório:

git clone https://github.com/oliver20000/water-gas-consumption.git
cd water-gas-consumption

Crie um arquivo .env na raiz do projeto e adicione sua chave API do Google Gemini:

GEMINI_API_KEY=your_google_gemini_api_key_here

Construa e inicie o projeto com Docker:

docker-compose up --build

Endpoints:
POST /api/upload: Envia uma imagem base64 para processamento e retorna a medição lida.
PATCH /api/confirm: Confirma ou corrige uma medição existente.
GET /api/
/list: Lista todas as medições de um cliente, com filtro opcional por tipo de medição.

Tecnologias:

Node.js
Express
TypeScript
Docker
Google Gemini API

Licença:
Este projeto é licenciado sob a MIT License.
