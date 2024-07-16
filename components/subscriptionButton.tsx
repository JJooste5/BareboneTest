"use client";

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Zap } from 'lucide-react'
import axios from 'axios'
import toast from "react-hot-toast";

interface subscriptionButtonProps {
  isPro: Boolean
}

export default function SubscriptionButton({isPro = false}: subscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const onCLick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/stripe")

      window.location.href = response.data.url
    } catch (error) {
      console.log("billing error");
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Button className="px-4 gap-x-2" variant={isPro ? "default" : "upgradeModal"} onClick={onCLick}>
      {isPro ? "Manage subscription" : "Upgrade"}
      {!isPro && <Zap className='w-4 h-4 fill-white' />}
    </Button>
  )
}
