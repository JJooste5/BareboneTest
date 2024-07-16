import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import React from 'react'

interface HeadingProps {
    title: string;
    description: string;
    icon: LucideIcon;
    iconColor?: string;
    bgColor?: string;
}

function Heading({title, description, icon: Icon, iconColor, bgColor}: HeadingProps) {
  return (
    <div className='px-4 lg:px-8 flex items-center gap-x-3 mb-8'> 
        <div className={cn("p-2 w-fit  rounded-md", bgColor)}>
            <Icon />
        </div>
        <div>
            <h2 className='text-3xl font-bold'>
                {title}
            </h2>
            <p className='text-muted-foreground text-sm'> 
                {description}
            </p>
        </div>
    </div>
  )
}

export default Heading