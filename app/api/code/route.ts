import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { checkSubscription } from '@/lib/subscription';

import { increaseAPILimit, checkApiLimit } from '@/lib/apilimit';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemMessage = {
  role: "system",
  content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanation.",
};

export async function POST(req: Request) {
  try {
    console.log("Posting...")
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorised", {status: 401});
    }
    
    if (!openai.apiKey) {
      return new NextResponse("OpenAI API key not configured", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400});
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired", {status: 403});
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...messages],
    })
    
    if (!isPro) {
      await increaseAPILimit();
    }
    
    console.log(response.choices[0].message)
    return NextResponse.json(response.choices[0].message);
  }
  catch (error) {
    console.log("code error", error);
    return new NextResponse("internal error", { status: 500 });
  }
}