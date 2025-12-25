"use client"
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'
import LoginPageWithCredentials from './LoginPageWithCredentials'
import Header from '@/components/components/header'
import Footer from '@/components/components/footer'

const Page = () => {
    const { data: session, status } = useSession()

    return (
        <>
        <Header />
        <div className='flex flex-col min-h-screen'>
            <LoginPageWithCredentials />
        </div>
        <Footer />
        </>
    )
}

export default Page
