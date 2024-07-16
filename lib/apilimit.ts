import { auth } from '@clerk/nextjs/server';
import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

export const increaseAPILimit = async () => {
    const { userId } = auth();

    if (!userId) {
        return;
    }

    const userAppLimit = await prismadb?.userAppLimit.findUnique({
        where: {
            userId
        }
    });

    if (userAppLimit) {
        await prismadb?.userAppLimit.update({
            where: {
                userId: userId
            },
            data: { count: userAppLimit.count + 1 }
        });
    } else {
        await prismadb?.userAppLimit.create({
            data: { userId: userId, count: 1 }
        });
    }




}

export const checkApiLimit = async () => {
    const {userId } = auth();
    
    if (!userId) {return false}

    const userAppLimit = await prismadb?.userAppLimit.findUnique({
        where: {
            userId
        }
    });

    if (!userAppLimit || userAppLimit.count < MAX_FREE_COUNTS) {
        return true;
    } else {
        return false
    }
}

export const getAppLimitCount = async () => {
    const {userId } = auth();
    
    if (!userId) {return 0};

    const userAppLimit = await prismadb?.userAppLimit.findUnique({
        where: {
            userId
        }
    });

    if (!userAppLimit) {
        return 0;
    }

    return userAppLimit.count;
}