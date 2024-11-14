"use client"

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const RouterBackButton = () => {
    const { back } = useRouter()

    return (
        <button onClick={() => back()} className='flex items-center px-2 text-black pb-3'>
            <ChevronLeft></ChevronLeft>
        </button>
    )
}

export default RouterBackButton