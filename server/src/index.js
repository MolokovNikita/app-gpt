import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
    console.error("API ключ для OpenRouter отсутствует! Пожалуйста, добавьте его в файл .env.");
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
});

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Сообщение не должно быть пустым.' });
    }

    const fetchResponse = async (model) => {
        const response = await openai.chat.completions.create({
            model,
            messages: [{ role: 'user', content: message }],
            max_tokens: 1000,
        });
        return response;
    };

    try {
        const modelPrimary = 'openai/o4-mini';
        const response = await fetchResponse(modelPrimary);

        if (response && response.choices?.length > 0) {
            const reply = response.choices[0].message?.content;
            return res.json({ reply, model: modelPrimary });
        } else {
            throw new Error('Пустой ответ от модели o4-mini.');
        }

    } catch (error) {
        console.warn('Ошибка модели o4-mini. Пробуем fallback на gpt-3.5:', error.message);

        try {
            const modelFallback = 'openai/gpt-3.5-turbo';
            const fallbackResponse = await fetchResponse(modelFallback);

            if (fallbackResponse && fallbackResponse.choices?.length > 0) {
                const fallbackReply = fallbackResponse.choices[0].message?.content;
                return res.json({ reply: fallbackReply, model: modelFallback });
            } else {
                throw new Error('Пустой ответ от модели gpt-3.5-turbo.');
            }

        } catch (fallbackError) {
            console.error('Ошибка модели gpt-3.5-turbo:', fallbackError.message);
            return res.status(500).json({
                error: fallbackError.message || 'Ошибка при использовании резервной модели.',
            });
        }
    }
});

app.listen(port, () => {
    console.log(`Сервер работает на http://localhost:${port}`);
});
