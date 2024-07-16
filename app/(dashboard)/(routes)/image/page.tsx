"use client";
import { useState, useEffect, useRef } from "react";
import * as z from "zod";
import { amountOptions, formSchema, resolutionOptions } from './constants';
import { zodResolver } from '@hookform/resolvers/zod';
import Heading from '@/components/Heading'
import { Download, ImageIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from "axios";
import { useRouter } from 'next/navigation';
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { useProModal } from "@/hooks/useProModal";
import toast from "react-hot-toast";

function Page() {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), 
        defaultValues: {
            prompt:  "",
            amount: "1",
            resolution: "256x256"
        }
    });
    const proModal = useProModal();
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            setImages([]);
            
            
            form.reset();
            router.refresh();

            const response = await axios.post("/api/image", values);

            const urls = response.data.map((image: {url: string }) => image.url);
            setImages(urls);
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
                <Heading title="Image Generation" description="Get Barebone to generate you an image" icon={ImageIcon} bgColor='bg-pink-700/10' iconColor='text-pink-700'/>
            </div>  
            <div className='mb-20 px-4 lg:px-8 overflow-y-auto'>
                {images.length === 0 && !isLoading && (
                    <div>
                        <Empty label="Let's produce some images..." />
                    </div>
                )}
                <div className='space-y-4 mt-4'>
                    <div className="grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                        {images.map((image) => (
                            <Card key={image} className="rounded-lg overflow-hidden">
                                <div className="relative aspect-square">
                                    <Image alt="image" fill src={image} />
                                </div>
                                <CardFooter className="p-2">
                                    <Button variant="secondary" className="w-full" onClick={() => window.open(image)}>
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    
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
                                <FormItem className="col-span-12 lg:col-span-6">
                                    <FormControl className="m-0 p-0">
                                        <Input className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent' disabled={isLoading} placeholder='Generate images with barebone' {...field}/>
                                    </FormControl>
                                </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="amount"
                                render={({field}) => (
                                    <FormItem className="col-span-12 lg:col-span-2">
                                        <Select  disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value} >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {amountOptions.map((option) => (
                                                    <SelectItem value={option.value} key={option.value} >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select> 
                                    </FormItem>
                                )}
                            /> 
                            <FormField 
                                control={form.control}
                                name="resolution"
                                render={({field}) => (
                                    <FormItem className="col-span-12 lg:col-span-2">
                                        <Select  disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value} >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {resolutionOptions.map((option) => (
                                                    <SelectItem value={option.value} key={option.value} >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select> 
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
