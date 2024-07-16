"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";


export default function CrispChat() {
    useEffect(() => {
        Crisp.configure("5db94e2f-121f-4d08-abad-b66bef5257a6");
    }, [])

    return null;
}
