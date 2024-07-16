"user client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { MAX_FREE_COUNTS } from "@/constants";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { useProModal } from "@/hooks/useProModal";

interface FreeCounterProps {
    appLimitCount: number;
    isPro: Boolean;
}

function FreeCounter({appLimitCount = 0, isPro=false}: FreeCounterProps) {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const proModal = useProModal();
    useEffect(() => {
        setIsMounted(true);
    }, [])

    if(!isMounted) {
        return null;
    }
    if (isPro) {
        return null;
    }
    return (
        <div className="px-3 shadow-lg">
            <Card className="bg-white/15 border-0">
                <CardContent className="py-6">
                    <div className="text-center text-sm text-white mb-4 space-y-2">
                        <p> 
                            {appLimitCount} / {MAX_FREE_COUNTS} Free generations
                        </p>
                        <Progress className="h-3" value={(appLimitCount / MAX_FREE_COUNTS) * 100} />
                    </div>
                    <Button onClick={proModal.onOpen} className="w-full  hover:bg-white/100" variant="upgrade">
                        Upgrade
                        <Zap className="w-4 h-4 ml-2 fill-black" />
                    </Button>
                </CardContent>
            </Card>
        </div>
      )
}

export default FreeCounter