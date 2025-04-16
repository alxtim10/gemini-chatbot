import ChatBubble from "../chat-bubble/ChatBubble";

interface ChatBoxProps {
    messages: { text: string, isUser: boolean }[]
}

const ChatBox = ({ messages }: ChatBoxProps) => {

    return (
        <section className="mb-44 mt-16 w-full">
            {messages.map((message, index) => (
                <div key={index} className={`${message.isUser ? 'justify-end' : 'justify-start'} flex items-center w-full mt-5`}>
                    <ChatBubble text={message.text} delay={50} isUser={message.isUser} />
                </div>
            ))}

        </section>
    )
}

export default ChatBox