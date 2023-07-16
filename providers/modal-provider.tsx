"use client"

import { useEffect, useState, } from "react"

import { StoreModal } from "@/components/modals/store-modal"


//fix for hydriation error
export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <>
            <StoreModal />
        </>
    )
}