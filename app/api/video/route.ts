import { checkApiLimit, increaseAPILimit } from '@/lib/apilimit';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Replicate from "replicate";
import { checkSubscription } from '@/lib/subscription';

const replicate = new Replicate({auth: process.env.REPLICATE_API_TOKEN});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorised", {status: 401});
    }

    if (!prompt) {
      return new NextResponse("Prompt are required", { status: 400});
    }
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired", {status: 403});
    }

    const input = {
      fps: 24,
      model: "xl",
      prompt: prompt,
      batch_size: 1,
      num_frames: 24,
      negative_prompt: "very blue, dust, noisy, washed out, ugly, distorted, broken",
      remove_watermark: false,
      num_inference_steps: 50
    }

    const response = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: input
      }
    );

    
    if (!isPro) {
      await increaseAPILimit();
    }
    

    return NextResponse.json(response);
  }
  catch (error) {
    console.log("video error", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
