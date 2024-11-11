import { Button } from '@/components/ui/button'
import React from 'react'

const Home = () => {
    return (
        <div>
            <h1 className=' text-3xl text-green-700'>Home</h1>
            <Button className=" bg-green-700 hover:bg-green-400">Click me</Button>
        </div>
    )
}

export default Home