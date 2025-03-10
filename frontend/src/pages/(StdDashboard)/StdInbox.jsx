import StudentSidebar from '@/components/student_dashboard/StudentSidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import React, { useEffect } from 'react'

const StdInbox = () => {

    useEffect(() => {
        document.title = '(5) Active Chats'
    })

    return (
        <div className="flex h-screen bg-white">

            <div><StudentSidebar /></div>

            <div className="flex-1 p-4" style={{ marginLeft: '210px' }}>
                <div className="flex justify-between w-full h-full gap-4">

                    {/* Chatting Section */}
                    <div className="w-3/4 bg-white rounded-lg shadow-md" style={{ backgroundImage: 'url(/chat-background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        <div className="flex justify-center items-center h-full">
                            <h1 className='bg-white text-primaryBgColor rounded-lg p-2' style={{ userSelect: 'none' }}>Select a chat to start messaging</h1>
                        </div>
                    </div>

                    {/* All Message Section */}
                    <div className="w-1/4 bg-white rounded-lg shadow-md p-4 overflow-hidden">
                        <h1 className="font-semibold text-lg text-primaryBgColor">All Messages</h1>

                        <ScrollArea className="h-[calc(100vh-100px)]">
                            <div className='mt-8'>
                                <div className='flex items-center space-x-3 mb-4'>
                                    <img src="https://via.placeholder.com/150" alt="Profile" className="w-12 h-12 rounded-full bg-purple-400 flex-shrink-0" />
                                    <div className="min-w-0"> {/* Add min-w-0 to allow truncation */}
                                        <h1 className="font-semibold truncate">John Doe</h1>
                                        <p className="text-gray-600 truncate max-w-[200px]">Hello, how are you? ugygyugygygugygyugygyg</p>
                                    </div>
                                </div>

                                <div className='flex items-center space-x-3 mb-4'>
                                    <img src="https://via.placeholder.com/150" alt="Profile" className="w-12 h-12 rounded-full bg-purple-400 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <h1 className="font-semibold truncate">John Doe</h1>
                                        <p className="text-gray-600 truncate max-w-[200px]">Hello, how are you? ugygyugygygugygyugygyg</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default StdInbox