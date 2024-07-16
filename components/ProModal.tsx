"use client";

import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { useProModal } from "@/hooks/useProModal";
import { Badge } from "./ui/badge";
import { ArrowRight, Check, Code, ImageIcon, MessageSquare, Music, VideoIcon, Zap } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const tools = [
    {label: "conversation", icon: MessageSquare, color: "text-violet-500", bgColor:"bg-violet-500/10", href: "/conversation"},
    {label: "Music Generation", icon: Music, color: "text-emerald-500", bgColor:"bg-emerald-500/10", href: "/music"},
    {label: "Image Generation", icon: ImageIcon, color: "text-pink-500", bgColor:"bg-pink-500/10", href: "/image"},
    {label: "Video Generation", icon: VideoIcon, color: "text-orange-500", bgColor:"bg-orange-500/10", href: "/video"},
    {label: "Code Generation", icon: Code, color: "text-green-500", bgColor:"bg-green-500/10", href: "/conversation"},
  ]

function ProModal() {
    const proModal = useProModal();

    const [isLoading, setIsLoading] = useState(false);

    const onSubscribe = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/api/stripe");
            window.location.href = response.data.url;
        } catch (error: any){
            toast.error("Something went wrong")
        }
    }

  return (
    <div className="z-50">
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
                        <div className="flex items-center gap-x-2">
                            Upgrade to BAREBONE
                            <Badge className="uppercase text-sm py-1" variant="upgrade">
                                pro
                            </Badge>
                        </div>
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 fontsmedium">
                    {tools.map((tool) => (
                        <Card key={tool.href} className="p-3 border-black/5 flex items-center justify-between">
                            <div className="flex items-center gap-x-4">
                                <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                                    <tool.icon className={cn("w-8 h-8", tool.color)} />
                                </div>
                                <div className="font-semibold text-sm">
                                    {tool.label}
                                </div>
                            </div>
                            <Check className="text-primary w-5 h-5" />
                        </Card>
                    ))}
                </DialogDescription>
                <DialogFooter>
                    <Button size="lg" variant="upgradeModal" className="w-full" onClick={onSubscribe} disabled={isLoading}>
                        Upgrade
                        <Zap className="w-4 h-4 ml-2 border-0 fill-white"/>
                    </Button>
                </DialogFooter>
            </DialogContent>
            
        </Dialog>
    </div>
    
  )
}

export default ProModal