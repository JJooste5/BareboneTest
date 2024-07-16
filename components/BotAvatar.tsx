import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'

export default function BotAvatar() {
  return (
    <div>
        <Avatar className='h-8 w-8 rounded-lg'>
            <AvatarImage src="/logo.png" className="h-8 w-8 rounded-lg" />
        </Avatar>
    </div>
  )
}
