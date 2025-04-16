
const Loading = () => {
    return (
        <div className="flex flex-row gap-2">
            <div className="w-[5px] h-[5px] rounded-full bg-white animate-bounce"></div>
            <div className="w-[5px] h-[5px] rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-[5px] h-[5px] rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
        </div>
    )
}

export default Loading