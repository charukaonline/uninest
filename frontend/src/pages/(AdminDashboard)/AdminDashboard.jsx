import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "@/components/include/LoadingSpinner";
import Sidebar from "@/components/admin_dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, MessageSquare, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { adminId, email } = useParams();
  const { admin, isAdminAuthenticated, adminLogout, isCheckingAdminAuth } =
    useAdminAuthStore();

  const handleLogout = async () => {
    try {
      await adminLogout();
      navigate("/auth/uninest-admin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    if (!isAdminAuthenticated && !isCheckingAdminAuth) {
      checkAdminAuth();
    }
  }, [isAdminAuthenticated, isCheckingAdminAuth, isCheckingAdminAuth]);

  useEffect(() => {
    if (admin?.username) {
      document.title = `${admin.username}'s Dashboard`;
    }
  }, [admin?.username]);

  if (isCheckingAdminAuth) {
    return <LoadingSpinner />;
  }

  if (!isAdminAuthenticated || !admin) {
    navigate("/auth/uninest-admin");
    return null;
  }

  const statsCards = [
    {
      title: "Total Users",
      value: "1,234",
      icon: Users,
      description: "Active users this month",
    },
    {
      title: "Total Listings",
      value: "56",
      icon: Building2,
      description: "Active property listings",
    },
    {
      title: "New Feedbacks",
      value: "28",
      icon: MessageSquare,
      description: "Pending reviews",
    },
    {
      title: "Reports",
      value: "5",
      icon: AlertTriangle,
      description: "Unresolved issues",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <h1 className="text-2xl font-bold">
              Welcome Back, {admin.username}
            </h1>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </header>

        <main className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((card, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <card.icon className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-gray-500">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
