import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import ChatBox from "../../components/chat-box/ChatBox";
import { ArrowUp, Plus } from "lucide-react";
import { useHome } from "./hooks";
import ReactMarkdown from "react-markdown";
import ChatBubble from "../../components/chat-bubble/ChatBubble";

const Home = () => {
  const {
    textareaRef,
    query,
    isFirstLoad,
    messages,
    handleInput,
    handleKeyDown,
    handleGetPrompt,
    response,
    setResponse,
    chatEndRef,
  } = useHome();

  return (
    <section
      className={`${
        isFirstLoad ? "justify-center" : "justify-start"
      } w-full flex flex-col items-center min-h-screen`}
    >
      {isFirstLoad && (
        <section className="w-full flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-6 w-full px-8">
            <h1 className="font-semibold text-lg sm:text-2xl">
              How can I help you today?
            </h1>
          </div>
        </section>
      )}
      {!isFirstLoad && (
        <section className="w-full flex items-center justify-center max-w-[800px] px-8 ">
          <ChatBox messages={messages} />
        </section>
      )}
      <div ref={chatEndRef} />
      <div
        className={`${
          isFirstLoad ? "mt-10" : "fixed bottom-0 left-0 pb-10"
        } bg-[#212121] flex flex-col items-center justify-center gap-6 w-full px-8`}
      >
        <div
          className="relative pb-14 p-5 bg-[#343434] -mt-5
                     w-full max-w-[740px] rounded-3xl min-h-[90px] focus:outline-0 text-sm placeholder:text-sm"
        >
          <textarea
            ref={textareaRef}
            onInput={handleInput}
            value={query}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask anything"
            className="resize-none overflow-hidden transition-all duration-200  w-full focus:outline-0 bg-transparent placeholder:text-[#a3a3a3]"
          />
          <ArrowUp
            onClick={() => {
              handleGetPrompt();
            }}
            size={32}
            className="cursor-pointer hover:bg-[#a9a9a9] transition-all duration-50 absolute right-3 bottom-3 text-black bg-white rounded-full p-2  shadow-md"
          />
          <Plus
            size={32}
            className="cursor-pointer hover:bg-[#5a5a5a] transition-all duration-50 absolute left-3 bottom-3  text-[white] rounded-full p-2 border border-[#666666]"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
