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
    console.log('Получено сообщение:', message);

    if (!message) {
        return res.status(400).json({ error: 'Сообщение не должно быть пустым.' });
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'openai/gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
            // max_tokens: 4000, - для gpt-4.0
        });

        if (response && response.choices && response.choices.length > 0) {
            const reply = response.choices[0].message?.content;
            return res.json({ reply });
        } else {
            return res.status(500).json({
                error: 'Не удалось получить ответ от модели. Ответ от API пуст.',
            });
        }
    } catch (error) {
        console.error('Ошибка API OpenRouter:', error);
        res.status(500).json({
            message: error.message || 'Server error',
        });
    }
});

app.listen(port, () => {
    console.log(`Сервер работает на http://localhost:${port}`);
});
