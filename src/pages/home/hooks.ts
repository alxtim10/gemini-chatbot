import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { GetTextOnly } from "../../hooks/promptHooks";

export interface MessageType {
    id: string,
    text: string,
    isUser: boolean,
    isLoading?: boolean,
    image?: File | null
}

export const useHome = () => {

    const [query, setQuery] = useState<string>('');
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const [image, setImage] = useState<File | null>();

    const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
        setQuery(e.target.value);
        setImage(null);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && query !== '') {
            setIsFirstLoad(false);
            e.preventDefault();
            handleGetPrompt();
        }
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleGetPrompt = async () => {
        const userMessage: MessageType = {
            id: crypto.randomUUID(),
            isUser: true,
            text: query,
            image: image
        };

        const loadingId = crypto.randomUUID();
        const loadingMessage: MessageType = {
            id: loadingId,
            isUser: false,
            text: '...',
            isLoading: true,
        };

        setMessages(prev => [...prev, userMessage, loadingMessage]);
        setQuery('');

        try {
            let res;
            if (!image) {
                res = await fetch(`https://ftmobile.inhealth.co.id/gen-ai/api/TextOnly?prompt=${query}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                });
            } else {
                res = await fetch(`https://ftmobile.inhealth.co.id/gen-ai/api/TextAndImage?prompt=${query}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        file: image
                    }),
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            const data = await res.text(); // or `await res.json()` depending on your API

            setMessages(prev =>
                prev.map(m =>
                    m.id === loadingMessage.id ? { ...m, text: data, isLoading: false } : m
                )
            );
        } catch (err) {
            setMessages(prev =>
                prev.map(m =>
                    m.id === loadingMessage.id
                        ? { ...m, text: 'Something went wrong.', isLoading: false }
                        : m
                )
            );
        }
    };

    return {
        textareaRef,
        query,
        isFirstLoad,
        messages,
        handleInput,
        handleKeyDown,
        handleGetPrompt,
        chatEndRef,
        image,
        setImage
    }
} 