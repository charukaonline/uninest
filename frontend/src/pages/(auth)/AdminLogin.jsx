import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/include/LoadingSpinner";

const AdminLogin = () => {
  const { isCheckingAdminAuth, checkAdminAuth, isAdminAuthenticated, admin, adminLogin, isLoading, error } = useAdminAuthStore();

  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  useEffect(() => {
    document.title = `UniNest | Admin Login`;
  }, []);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { email, password } = formData;
    const adminResponse = await adminLogin(email, password);

    if (adminResponse?.success === false) {
      notification.error({
        message: "Login Failed",
        description: adminResponse.message || "Invalid credentials",
        duration: 3,
      });
      return;
    }

    const adminId = adminResponse?.admin?._id;

    if (!adminId) {
      notification.error({
        message: "Login Error",
        description: "User ID not found",
        duration: 3,
      });
      return;
    }

    navigate(`/ad/${adminId}/${email}`);
  };

  if (isCheckingAdminAuth) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 p-8 rounded-2xl shadow-xl">
          <div className="flex justify-center mb-6">
            <img src="/uninestLogo.png" alt="UniNest Logo" className="h-12" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">Welcome Back, Admin</h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">Sign in to manage boarding listings and users</p>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input type="email" placeholder="Email address" className="pr-10" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>

            <div className="relative">
              <Input type={showPassword ? "text" : "password"} placeholder="Password" className="pr-10" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="rememberMe" checked={formData.rememberMe} onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked })} />
                <label htmlFor="rememberMe" className="text-sm text-gray-600 dark:text-gray-300">Remember me</label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || isLoading}>
              {loading || isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};


export default AdminLogin;
