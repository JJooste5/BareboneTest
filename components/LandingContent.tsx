"use client";

import { Description } from "@radix-ui/react-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const Testimonials = [
    {
        name: "James",
        avatar: "J",
        title: "Software engineer",
        description: "Best AI generation tool I have ever used"
    },
    {
        name: "Thomas",
        avatar: "T",
        title: "Sleepy",
        description: "Best AI generation tool I have ever used"
    },
    {
        name: "David",
        avatar: "D",
        title: "Software engineer",
        description: "Best AI generation tool I have ever used"
    },
    {
        name: "Jacob",
        avatar: "J",
        title: "Software engineer",
        description: "Best AI generation tool I have ever used"
    },
]

export default function LandingContent() {
  return (
    <div className="px-10 pb-20">
        <h2 className="text-center text-4xl text-white font-extrabold mb-10">
            Testimonials
        </h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Testimonials.map((item) => (
                <Card key={item.description} className="bg-[#192339] border-none text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-x-2">
                            <div>
                                <p className="text-lg">
                                    {item.name}
                                </p>
                                <p className="text-zinc-400 text-sm">
                                    {item.title}
                                </p>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 px-4">
                        {item.description}
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  )
}
