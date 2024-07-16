"use client";
import { useState, useEffect, useRef } from "react";
import * as z from "zod";
import { formSchema } from './constants';
import { zodResolver } from '@hookform/resolvers/zod';
import Heading from '@/components/Heading'
import { MessageSquareIcon, Zap } from 'lucide-react'
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
import { useProModal } from "@/hooks/useProModal";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

function Page() {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), 
        defaultValues: {prompt:  ""}
    });
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const proModal = useProModal();

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

            const response = await axios.post("/api/conversation", {messages: newMessages})

            setMessages((current) => [...current, response.data]);
            setIsLoading(false);
        } catch (error: any) {
            if (error?.response?.status === 403) {
                proModal.onOpen();
                setIsLoading(false);
                const errorMessage = {
                    role: "assistant",
                    content: "Upgrade to BAREBONE"
                }
                setMessages((current) => [...current, errorMessage]);
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
                <Heading title="Conversation" description="Chat with barebone" icon={MessageSquareIcon} bgColor='bg-violet-500/10' iconColor='text-violet-500'/>
            </div>  
            <div className='mb-20 px-4 lg:px-8 overflow-y-auto'>
                {messages.length === 0 && !isLoading && (
                    <div>
                        <Empty label="Let's engage in some intellectual chat..." />
                    </div>
                )}
                <div className='space-y-4 mt-4'>
                    {messages.map((message) => (
                        <div key={message.content} className={cn("w-full p-8 items-center rounded-lg", message.role === "assistant" ? "bg-muted" : "bg-white", message.content === "Upgrade to BAREBONE" ? "bg-black/70" : "")}>
                            <div className="flex gap-x-8 items-center w-full">
                                {message.role === "assistant" && message.content !== "Upgrade to BAREBONE" ? <BotAvatar /> : <></>}
                                {message.role === "user" ? <UserAvatar /> : <></>}
                                <div className={cn("", message.content === "Upgrade to BAREBONE" ? "text-center flex items-center justify-center w-full gap-x-2 font-bold" : "")}>
                                    <p className={cn("text-sm", message.content === "Upgrade to BAREBONE" ? "text-white text-md" : "")}>
                                        {message.content}
                                    </p>
                                    {message.content === "Upgrade to BAREBONE" && (<Badge className="uppercase text-sm py-1" variant="upgrade">pro</Badge>)}
                                </div> 
                            </div>
                            {message.content === "Upgrade to BAREBONE" && (
                                <Button size="lg" variant="upgradeModal" className="w-full p-4 mt-4" >
                                    Upgrade
                                    <Zap className="w-4 h-4 ml-2 border-0 fill-white"/>
                                </Button>
                            )}
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
                                        <Input className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent' disabled={isLoading} placeholder='Chat with barebone' {...field}/>
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
