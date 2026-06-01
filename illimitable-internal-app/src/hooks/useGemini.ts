import {GoogleGenAI} from '@google/genai';
import dayjs from 'dayjs';
import {useState} from 'react';
import {trigger} from 'react-native-haptic-feedback';
import Toast from 'react-native-toast-message';

const GEMINI_API_KEY = 'AIzaSyB7Q4AcqtBAU79MfzFGVq9ZrIXr6SJ5aiU';

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export const useGemini = (date: Date, closeDate: Date, type: 'Sick Leave' | 'Casual Leave') => {
    const [isAiMode, setAIMode] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [mailBody, setMailBody] = useState('');
    const [generating, setGenerating] = useState(false);

    const DatePrompt =
        date === closeDate
            ? `today ${dayjs(date).format('DD/MM/YYYY')}`
            : `from ${dayjs(date).format('DD/MM/YYYY')} to ${dayjs(closeDate).format('DD/MM/YYYY')}`;

    const fullPrompt =
        `Write a mail to my hr about ${type} on my behalf for ${prompt}\n\n` +
        `on ${DatePrompt}` +
        '\n\n' +
        'Rules: 1) Do NOT include a subject line. 2) Start directly with the body. ' +
        '3) The Date give you as a DD/MM/YYYY. format' +
        '4) Do NOT add “Hi”, “Hello”, “Best regards”, or a signature.' +
        '5) It should be professional, polite, short, direct and simple enough to be read by a non-technical person.';

    const generateResponse = async () => {
        if (!isAiMode) {
            setAIMode(true);
            return;
        }

        try {
            setGenerating(true);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: {temperature: 0.3},
            });
            console.log(response.text);
            trigger('impactLight');
            setMailBody(response.text || '');
        } catch (err: any) {
            console.log(err);
            Toast.show({
                type: 'error',
                text1: 'Error generating response from AI',
                text2: String(err.message),
                visibilityTime: 4000,
            });
        } finally {
            setGenerating(false);
        }
    };

    return {
        prompt,
        setPrompt,
        generateResponse,
        mailBody,
        setMailBody,
        generating,
        isAiMode,
    };
};
