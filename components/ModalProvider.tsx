"use client";
import { useState, useEffect } from "react";
import ProModal from "./ProModal";

function ModalProvider() {
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;
    }

    return(
        <>
            <ProModal />
        </>
    )
}

export default ModalProvider