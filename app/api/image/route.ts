import { checkApiLimit, increaseAPILimit } from '@/lib/apilimit';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { checkSubscription } from '@/lib/subscription';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = "1", resolution = "256x256" } = body;

    if (!userId) {
      return new NextResponse("Unauthorised", {status: 401});
    }
    
    if (!openai.apiKey) {
      return new NextResponse("OpenAI API key not configured", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400});
    }
    if (!amount) {
      return new NextResponse("Prompt is required", { status: 400});
    }
    if (!resolution) {
      return new NextResponse("Prompt is required", { status: 400});
    }
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired", {status: 403});
    }
    
    

    const response = await openai.images.generate({
      prompt: prompt,
      n: parseInt(amount, 10), 
      size: resolution, 
      response_format: 'url', 
    })
    if (!isPro) {
      await increaseAPILimit();
    }
    
    return NextResponse.json(response.data);
  }
  catch (error) {
    console.log("iamage error", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
