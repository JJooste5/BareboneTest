"use client";
import { useState, useEffect, useRef } from "react";
import * as z from "zod";
import { formSchema } from './constants';
import { zodResolver } from '@hookform/resolvers/zod';
import Heading from '@/components/Heading'
import { MessageSquareIcon, Music, Video, VideoIcon } from 'lucide-react'
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

function Page() {
    const proModal = useProModal();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), 
        defaultValues: {prompt:  ""}
    });
    const [isLoading, setIsLoading] = useState(false);
    const [video, setVideo] = useState<string>();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            setVideo(undefined);
            
            form.reset();
            router.refresh();

            const response = await axios.post("/api/video", values)
            setVideo(response.data[0])
            setIsLoading(false);
        } catch (error: any) {
            if (error?.response?.status === 403) {
                proModal.onOpen();
            }
        } finally {
            router.refresh();
        }
    };

    return (
        <div className="flex flex-col justify-end h-full">
            <div className="mt-20">
                <Heading title="Video generation" description="Get barebone to generate a video" icon={VideoIcon} bgColor='bg-orange-700/10' iconColor='text-orange-700'/>
            </div>  
            <div className='mb-20 px-4 lg:px-8 overflow-y-auto'>
                <div className='space-y-4 mt-4'>
                    {!video && !isLoading && (
                        <div>
                            <Empty label="Let's produce a cinematic masterpiece" />
                        </div>
                    )}
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    {video && (
                        <video className="rounded-lg w-full aspect-video mt-8 border bg-black" controls>
                            <source src={video} />
                        </video>
                    )}
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
                                        <Input className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent' disabled={isLoading} placeholder='What video would you like?' {...field}/>
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
