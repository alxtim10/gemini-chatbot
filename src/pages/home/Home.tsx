import ChatBox from "../../components/chat-box/ChatBox";
import { ArrowUp, X } from "lucide-react";
import { useHome } from "./hooks";
import AttachButton from "../../components/attach-button/AttachButton";
import { Fragment } from "react/jsx-runtime";
import Dropdown from "../../components/dropdown/Dropdown";

const Home = () => {
  const {
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
    engine_index,
    setEngine
  } = useHome();

  return (
    <Fragment>
      <h1 className="fixed border-b border-b-[#313131] w-full font-semibold h-[60px] flex items-center justify-center text-xl bg-[#212121]">
        <Dropdown engine_index={engine_index} setEngine={setEngine}/>
      </h1>
      <section
        className={`${
          isFirstLoad ? "justify-center" : "justify-start"
        } w-full flex flex-col items-center min-h-screen`}
      >
        {isFirstLoad && (
          <section className="w-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-6 w-full px-8">
              <h1 className="font-semibold text-lg sm:text-2xl">
                How can I help you?
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
            {image && (
              <div className="mb-2">
                <div className="relative inline-block">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    className="max-h-16 rounded-xl border object-cover border-gray-300"
                  />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute -top-1 -right-1 border border-[#aeaeae] bg-white text-[#212121] rounded-full p-1"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            )}
            <textarea
              ref={textareaRef}
              onInput={handleInput}
              value={query}
              onKeyDown={handleKeyDown}
              rows={1}
              onPaste={handlePaste}
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
            <div className="absolute left-3 bottom-2">
              <AttachButton onFileChange={setImage} />
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Home;
