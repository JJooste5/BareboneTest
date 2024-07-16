"use client";

import React from 'react'
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from './ui/sheet';
import Sidebar from './Sidebar';
import { useEffect, useState } from 'react';

interface props {
  appLimitCount: number;
  isPro: boolean;
}

export default function MobileSidebar(props: props) {
  const appLimitCount = props.appLimitCount
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant='ghost' size='icon' className='md:hidden'>
            <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className='p-0'>
        <Sidebar isPro={props.isPro} appLimitCount={appLimitCount} />
      </SheetContent>
    </Sheet>
  )
}
