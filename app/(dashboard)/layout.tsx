import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getAppLimitCount } from "@/lib/apilimit";
import { checkSubscription } from "@/lib/subscription";

const Dashboard = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    const appLimitCount = await getAppLimitCount();
    const isPro = await checkSubscription();
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 mf:flex-col md:fixed md:inset-y-0 z-40 bg-gray-900">
                <Sidebar isPro={isPro} appLimitCount={appLimitCount}/>
            </div>
            <main className="md:pl-72">
                <div className="fixed backdrop-blur w-full right-4 mt-0">
                    <Navbar />
                </div>
                {children}
            </main>
        </div>
    )
}
export default Dashboard