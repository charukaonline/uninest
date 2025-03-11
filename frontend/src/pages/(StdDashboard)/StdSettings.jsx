import StudentSidebar from '@/components/student_dashboard/StudentSidebar';
import React, { useEffect } from 'react';
import StudentSettings01 from '@/components/student_dashboard/StudentSettings01';
import StudentSettings02 from '@/components/student_dashboard/StudentSettings02';

const StdSettings = () => {
    useEffect(() => {
        document.title = 'Change Details';
    }, []);

    return (
        <div className="flex h-full w-full bg-white">
            <StudentSidebar />

            <div className="flex-1 ml-[220px] p-4">
                <h1 className="text-xl font-bold mb-4">Profile Settings</h1>

                <StudentSettings01 />
                <StudentSettings02 />

                <div className="mt-10 items-center justify-center w-full">
                    <h1 className="text-gray-600 font-semibold text-center">UniNest © {new Date().getFullYear()}</h1>
                </div>
            </div>
        </div>
    );
};

export default StdSettings;