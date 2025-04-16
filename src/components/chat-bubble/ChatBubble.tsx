import { Fragment, JSX, useEffect, useState } from "react";
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown'
import { marked } from "marked";
import Loading from "../loading/Loading";

interface ChatBubbleProps {
    text: string;
    delay?: number;
    isUser: boolean;
    isLoading?: boolean;
}

type Word = { word: string; className: string }
type Block = { tag: string; words: Word[] }

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, delay = 150, isUser, isLoading }) => {
    const [blocks, setBlocks] = useState<Block[]>([])

    useEffect(() => {
        const parseMarkdownToBlocks = async () => {
            const rawHtml = await marked.parse(text)
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = rawHtml

            const parsedBlocks: Block[] = []

            const walk = (node: Node, tag = 'p', style = '') => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const el = node as HTMLElement
                    const tagName = el.tagName.toLowerCase()

                    if (['p', 'li', 'h1', 'h2', 'h3'].includes(tagName)) {
                        const words: Word[] = []
                        for (const child of Array.from(el.childNodes)) {
                            collectWords(child, '', words)
                        }
                        parsedBlocks.push({ tag: tagName, words })
                    } else {
                        for (const child of Array.from(el.childNodes)) {
                            walk(child, tag, style)
                        }
                    }
                }
            }

            const collectWords = (node: Node, style = '', acc: Word[]) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const split = (node.textContent || '').split(/(\s+)/)
                    split.forEach(word => {
                        if (word) acc.push({ word, className: style })
                    })
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const el = node as HTMLElement
                    const tag = el.tagName.toLowerCase()
                    let nextStyle = style

                    if (tag === 'strong' || tag === 'b') nextStyle += ' font-bold'
                    if (tag === 'em' || tag === 'i') nextStyle += ' italic'
                    if (tag === 'code') nextStyle += ' font-mono bg-gray-200 px-1 rounded'

                    for (const child of Array.from(el.childNodes)) {
                        collectWords(child, nextStyle, acc)
                    }
                }
            }

            for (const child of Array.from(tempDiv.childNodes)) {
                walk(child)
            }

            setBlocks(parsedBlocks)
        }

        parseMarkdownToBlocks()
    }, [text])

    let globalIndex = 0 // <- global index across all blocks and words

    return (
        <Fragment>
            {!isUser && !isLoading && (
                <div
                    className={`rounded-2xl whitespace-pre-wrap text-sm leading-relaxed h-fit
        ${isUser ? 'bg-[#313131] py-3 px-4 text-white' : 'text-white'
                        }`}
                >
                    {blocks.map((block, i) => {
                        const Tag = block.tag as keyof JSX.IntrinsicElements
                        return (
                            <Tag key={i} className="flex flex-wrap items-start mb-1">
                                {block.words.map((w, j) => {
                                    const wordIndex = globalIndex++
                                    return (
                                        <motion.span
                                            key={j}
                                            className={w.className}
                                            initial={{ opacity: 0, y: 0 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                delay: wordIndex * (delay! / 1000),
                                                duration: 0.25,
                                            }}
                                        >
                                            {w.word}
                                        </motion.span>
                                    )
                                })}
                            </Tag>
                        )
                    })}
                </div>
            )}
            {!isUser && isLoading && (
                <Loading />
            )}
            {isUser && (
                <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`bg-[#313131] py-3 px-4 text-sm max-w-[300px] md:max-w-[420px] text-white rounded-2xl flex flex-wrap gap-x-1`}>
                    {text}
                </motion.p>
            )}
        </Fragment>
    )
};

export default ChatBubble;