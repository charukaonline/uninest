import StudentSidebar from '@/components/student_dashboard/StudentSidebar'
import React, { useEffect, useState } from 'react'
import scheduleStore from '@/store/scheduleStore'
import { useAuthStore } from '@/store/authStore'
import { Spin, Empty, Typography } from 'antd'
import ScheduleCard from '@/components/student_dashboard/ScheduleCard'

const { Title } = Typography;

const StdSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchSchedules = async () => {
            if (user?._id) {
                try {
                    setLoading(true);
                    const data = await scheduleStore.getSchedulesByUserId(user._id);
                    setSchedules(data);
                } catch (error) {
                    console.error("Failed to fetch schedules:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSchedules();

        // Set document title
        document.title = "My Schedules";
    }, [user]);

    const isUpcoming = (dateStr, timeStr) => {
        try {
            const now = new Date();

            // Parse the date
            const scheduleDate = new Date(dateStr);

            const [hours, minutes] = timeStr.split(':').map(Number);

            scheduleDate.setHours(hours, minutes, 0, 0);

            return scheduleDate > now;
        } catch (error) {
            console.error("Error parsing date/time:", error);
            return false;
        }
    };

    // Group schedules by upcoming and past - update to pass both date and time
    const upcomingSchedules = schedules.filter(schedule =>
        isUpcoming(schedule.date, schedule.time)
    );
    const pastSchedules = schedules.filter(schedule =>
        !isUpcoming(schedule.date, schedule.time)
    );

    return (
        <div className="flex bg-white">
            <div><StudentSidebar /></div>

            <div className="flex-1 ml-[220px] p-4">
                <h1 className="text-xl font-bold mb-8">Schedules</h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spin size="large" />
                    </div>
                ) : schedules.length === 0 ? (
                    <Empty
                        description="No scheduled visits found"
                        className="my-12"
                    />
                ) : (
                    <div className="space-y-6">
                        {upcomingSchedules.length > 0 && (
                            <div>
                                <h1 className="mb-4 text-base text-primaryBgColor">Upcoming Visits</h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {upcomingSchedules.map((schedule) => (
                                        <ScheduleCard key={schedule._id} schedule={schedule} isUpcoming={true} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {pastSchedules.length > 0 && (
                            <div>
                                <h1 className="mb-4 text-base text-primaryBgColor">Past Visits</h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {pastSchedules.map((schedule) => (
                                        <ScheduleCard key={schedule._id} schedule={schedule} isUpcoming={false} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default StdSchedule