import { useUser } from "@clerk/nextjs"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";


export default function UserAvatar() {
    const { user } = useUser();
  return (
    <div>
        <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user?.imageUrl} className="h-8 w-8 rounded-lg"/>
            <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
            </AvatarFallback>
        </Avatar>
    </div>
  )
}
