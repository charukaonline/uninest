import StudentSidebar from '@/components/student_dashboard/StudentSidebar'
import React, { useEffect, useState } from 'react'
import { useScheduleStore } from '@/store/scheduleStore'
import { useAuthStore } from '@/store/authStore'
import { Spin, Empty, Typography, Tabs } from 'antd'
import ScheduleCard from '@/components/student_dashboard/ScheduleCard'

const { Title } = Typography;
const { TabPane } = Tabs;

const StdSchedule = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const { schedules, loading, getSchedulesByUserId } = useScheduleStore();
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchSchedules = async () => {
            if (user?._id) {
                try {
                    await getSchedulesByUserId(user._id);
                } catch (error) {
                    console.error("Failed to fetch schedules:", error);
                }
            }
        };

        fetchSchedules();
        document.title = "My Schedules";
    }, [user, getSchedulesByUserId]);

    const isUpcoming = (dateStr, timeStr) => {
        try {
            const now = new Date();
            const scheduleDate = new Date(dateStr);
            const [hours, minutes] = timeStr.split(':').map(Number);
            scheduleDate.setHours(hours, minutes, 0, 0);
            return scheduleDate > now;
        } catch (error) {
            console.error("Error parsing date/time:", error);
            return false;
        }
    };

    // Group schedules by upcoming, rejected, and past
    const upcomingSchedules = schedules.filter(schedule =>
        isUpcoming(schedule.date, schedule.time) &&
        schedule.status !== 'rejected'
    );

    const rejectedSchedules = schedules.filter(schedule =>
        schedule.status === 'rejected'
    );

    const pastSchedules = schedules.filter(schedule =>
        !isUpcoming(schedule.date, schedule.time) &&
        schedule.status !== 'rejected'
    );

    return (
        <div className="flex bg-white min-h-screen">
            <div><StudentSidebar /></div>

            <div className="flex-1 ml-[220px] p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">My Schedules</h1>
                    <p className="text-gray-600">View and manage your property visit schedules</p>
                </div>

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
                    <Tabs activeKey={activeTab} onChange={setActiveTab} className="custom-tabs">
                        <TabPane tab={`Upcoming (${upcomingSchedules.length})`} key="upcoming">
                            {upcomingSchedules.length === 0 ? (
                                <Empty
                                    description="No upcoming scheduled visits"
                                    className="my-12"
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {upcomingSchedules.map((schedule) => (
                                        <ScheduleCard
                                            key={schedule._id}
                                            schedule={schedule}
                                            isUpcoming={true}
                                            statusLabel={
                                                schedule.status === 'confirmed' ? 'Confirmed' :
                                                    schedule.status === 'pending' ? 'Pending' :
                                                        'Unknown'
                                            }
                                            statusClassName={
                                                schedule.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    schedule.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </TabPane>

                        <TabPane tab={`Rejected (${rejectedSchedules.length})`} key="rejected">
                            {rejectedSchedules.length === 0 ? (
                                <Empty
                                    description="No rejected scheduled visits"
                                    className="my-12"
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {rejectedSchedules.map((schedule) => (
                                        <ScheduleCard
                                            key={schedule._id}
                                            schedule={schedule}
                                            isUpcoming={false}
                                            statusLabel="Rejected"
                                            statusClassName="bg-orange-100 text-orange-800"
                                        />
                                    ))}
                                </div>
                            )}
                        </TabPane>

                        <TabPane tab={`Past (${pastSchedules.length})`} key="past">
                            {pastSchedules.length === 0 ? (
                                <Empty
                                    description="No past scheduled visits"
                                    className="my-12"
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {pastSchedules.map((schedule) => (
                                        <ScheduleCard
                                            key={schedule._id}
                                            schedule={schedule}
                                            isUpcoming={false}
                                            statusLabel={
                                                schedule.status === 'confirmed' ? 'Past' :
                                                    schedule.status === 'pending' ? 'Expired' :
                                                        'Unknown'
                                            }
                                            statusClassName={
                                                schedule.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                    schedule.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </TabPane>
                    </Tabs>
                )}

                <style jsx global>{`
                    .custom-tabs .ant-tabs-tab.ant-tabs-tab-active {
                        background-color: #006845;
                        border-radius: 4px 4px 0 0;
                    }
                    .custom-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
                        color: white !important;
                    }
                    .custom-tabs .ant-tabs-tab {
                        padding: 8px 16px;
                        margin-right: 4px;
                        transition: all 0.3s;
                    }
                    .custom-tabs .ant-tabs-tab:hover {
                        color: #006845;
                    }
                    .custom-tabs .ant-tabs-ink-bar {
                        background-color: #006845;
                    }
                    .custom-tabs .ant-tabs-nav::before {
                        border-bottom: 1px solid #e8e8e8;
                    }
                `}</style>
            </div>
        </div>
    );
}

export default StdSchedule