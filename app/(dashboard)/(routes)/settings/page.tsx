
import Heading from '@/components/Heading'
import SubscriptionButton from '@/components/subscriptionButton';
import { checkSubscription } from '@/lib/subscription'
import { Settings } from 'lucide-react';
import React from 'react'

export default async function page() {
    const isPro = await checkSubscription();
    return (
        <div className='flex flex-col justify-end h-full'>
            <div className='mt-20'>
            <Heading title="Settings" description='Manage your subscription' icon={Settings} iconColor='text-gray-700' bgColor='bg-gray-700/10' />
            </div>
            <div className='px-4 lg:px-8 space-y-4'>
                <div className='text-muted-foreground text-sm'>
                    {isPro ? "You have a pro subscription" : "You do not have a pro subscription"}
                </div>
                <SubscriptionButton isPro={isPro} />
            </div>
        </div>
    )
}
