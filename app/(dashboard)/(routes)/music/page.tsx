"use client";
import { useState, useEffect, useRef } from "react";
import * as z from "zod";
import { formSchema } from './constants';
import { zodResolver } from '@hookform/resolvers/zod';
import Heading from '@/components/Heading'
import { MessageSquareIcon, Music } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from "axios";
import { useRouter } from 'next/navigation';
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import { useProModal } from "@/hooks/useProModal";
import {toast} from "react-hot-toast";

function Page() {
    const proModal = useProModal();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), 
        defaultValues: {prompt:  ""}
    });
    const [isLoading, setIsLoading] = useState(false);
    const [music, setMusic] = useState<string>();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            setMusic(undefined);
            
            form.reset();
            router.refresh();

            const response = await axios.post("/api/music", values)
            setMusic(response.data.audio)
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
                <Heading title="Music generate" description="Get barebone to generate music" icon={Music} bgColor='bg-emerald-500/10' iconColor='text-emerald-500'/>
            </div>  
            <div className='mb-20 px-4 lg:px-8 overflow-y-auto'>
                <div className='space-y-4 mt-4'>
                    {!music && !isLoading && (
                        <div>
                            <Empty label="Let's produce a tune" />
                        </div>
                    )}
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    {music && (
                        <audio controls className="w-full mt-8">
                            <source src={music} />
                        </audio>
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
                                        <Input className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent' disabled={isLoading} placeholder='Generate some music' {...field}/>
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
