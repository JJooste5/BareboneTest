"use client";
import { useState, useEffect, useRef } from "react";
import * as z from "zod";
import { formSchema } from './constants';
import { zodResolver } from '@hookform/resolvers/zod';
import Heading from '@/components/Heading'
import { MessageSquareIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from "axios";
import { useRouter } from 'next/navigation';
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import BotAvatar from "@/components/BotAvatar";
import ReactMarkdown from "react-markdown";
import { useProModal } from "@/hooks/useProModal";

function Page() {
    const router = useRouter();
    const proModal = useProModal();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), 
        defaultValues: {prompt:  ""}
    });
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            const userMessage = {
                role: "user",
                content: values.prompt,
            };
            const newMessages = [...messages, userMessage];

            setMessages((current) => [...current, userMessage]);
            
            form.reset();
            router.refresh();

            const response = await axios.post("/api/code", {messages: newMessages})

            setMessages((current) => [...current, response.data]);
            setIsLoading(false);
        } catch (error: any) {
            if (error?.response?.status === 403) {
                proModal.onOpen();
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            router.refresh();
        }
    };

    return (
        <div className="flex flex-col justify-end h-full">
            <div className="mt-20">
                <Heading title="Code Generation" description="let's generate some code" icon={MessageSquareIcon} bgColor='bg-green-700/10' iconColor='text-violet-700'/>
            </div>  
            <div className='mb-20 px-4 lg:px-8 overflow-y-auto'>
                {messages.length === 0 && !isLoading && (
                    <div>
                        <Empty label="Let's build something together..." />
                    </div>
                )}
                <div className='space-y-4 mt-4'>
                    {messages.map((message) => (
                        <div key={message.content} className={cn("p-8 w-full flex items-center gap-x-8 rounded-lg", message.role === "assistant" ? "bg-muted" : "bg-white")}>
                            {message.role === "assistant" ? <BotAvatar /> : <UserAvatar />}
                            <ReactMarkdown components={{
                                pre: ({node, ...props}) => (
                                    <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                        <pre {...props} />
                                    </div>
                                ),
                                code: ({node, ...props}) => (
                                    <div className="bg-black/10 rounded-lg p-1"> 
                                        <code {...props} />
                                    </div>
                                )
                            }}
                            className="text-sm overflow-hidden leading-7"
                            >
                                {message.content || ""}
                            </ReactMarkdown>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="mt-12 md:mt-1 px-4 lg:px-8">
                <div className="w-full max-w-4xl mx-auto px-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='fixed bottom-8 left-8 right-8 md:left-80 bg-white p-4 px-3 md:px-6 shadow-sm grid grid-cols-12 gap-2'>
                            <FormField 
                                name="prompt"
                                render={({field}) => (
                                <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl className="m-0 p-0">
                                        <Input className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent' disabled={isLoading} placeholder='Generate some code with barebone' {...field}/>
                                    </FormControl>
                                </FormItem>
                                )}
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Page;
