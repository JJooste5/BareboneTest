import { Button } from './ui/button'
import { Menu } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import MobileSidebar from './MobileSidebar'
import { getAppLimitCount } from '@/lib/apilimit'
import { checkSubscription } from '@/lib/subscription'

async function Navbar() {
  const appLimitCount = await getAppLimitCount();
  const isPro = await checkSubscription();
  return (
    <div className='flex items-center p-4'>
      <MobileSidebar isPro={isPro} appLimitCount={appLimitCount} />
      <div className='flex w-full justify-end'>
        <UserButton afterSignOutUrl='/'/>
      </div>
    </div>
  )
}

export default Navbar