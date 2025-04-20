import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

export interface MessageType {
  id: string;
  text: string;
  isUser: boolean;
  isLoading?: boolean;
  image?: File | null;
}

export const useHome = () => {
  const [query, setQuery] = useState<string>("");
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [image, setImage] = useState<File | null>();
  const [engine, setEngine] = useState<number>(0);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && query !== "") {
      setIsFirstLoad(false);
      e.preventDefault();
      handleGetPrompt();
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (image) {
      objectUrl = URL.createObjectURL(image);
    }
  
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [image]);

  const handleGetPrompt = async () => {
    const userMessage: MessageType = {
      id: crypto.randomUUID(),
      isUser: true,
      text: query,
      image: image,
    };

    const loadingId = crypto.randomUUID();
    const loadingMessage: MessageType = {
      id: loadingId,
      isUser: false,
      text: "...",
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setQuery("");
    setImage(null);

    try {
      let res;
      if (!image) {
        res = await fetch(
          engine == 0 ? `https://ftmobile.inhealth.co.id/gen-ai/api/FitalisaTextOnly?prompt=${query}` :
          `https://ftmobile.inhealth.co.id/gen-ai/api/TextOnly?prompt=${query}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        const formData = new FormData();
        formData.append("file", image);

        res = await fetch(
          `https://ftmobile.inhealth.co.id/gen-ai/api/TextAndImage?prompt=${query}`,
          {
            method: "POST",
            body: formData,
          }
        );
      }

      const data = await res.text(); // or `await res.json()` depending on your API

      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMessage.id
            ? { ...m, text: data, isLoading: false }
            : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMessage.id
            ? { ...m, text: "Something went wrong.", isLoading: false }
            : m
        )
      );
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          setImage(file);
          e.preventDefault(); // optional, to stop the image blob from going into the textarea
        }
      }
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
    setImage,
    handlePaste,
    engine_index: engine,
    setEngine
  };
};
