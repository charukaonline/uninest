import DashboardLayout from "@/components/include/DashboardLayout";


export default function AdminDashboard() {
  return (
    <DashboardLayout
      userType="admin"
      userName="Admin Name"
      currentPath="/admin"
      onNavigate={(path) => {
        window.location.href = path;
      }}
    >
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Welcome Back Admin</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Add your stat cards here */}
        </div>

        {/* Other dashboard content */}
      </div>
    </DashboardLayout>
  );
}
