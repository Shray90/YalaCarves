import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, Mail, Shield, Crown } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      // Redirect based on user role
      if (result.user?.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/profile");
      }
    } else {
      setError(result.error || "Login failed. Please try again.");
    }
  };

  const handleAdminLogin = async () => {
    setIsLoading(true);
    setError(null);

    const result = await login("admin@yalacarves.com", "admin123");
    setIsLoading(false);

    if (result.success) {
      // Redirect based on user role
      if (result.user?.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/profile");
      }
    } else {
      setError(result.error || "Admin login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden bg-gradient-to-br from-amber-50 via-background to-wood-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-gradient-to-r from-amber-200/20 via-transparent to-amber-200/20"></div>
      </div>

      <div className="relative w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-amber-50 to-background">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-amber-600 to-red-600 rounded-xl opacity-75 blur-sm"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 rounded-xl flex items-center justify-center shadow-lg border border-amber-300/20">
                  <span className="text-yellow-500 font-bold text-2xl">YC</span>
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-serif font-bold text-foreground">
              Welcome Back
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Sign in to your Yala Carves account
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Quick Admin Login */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Quick Access
                </span>
              </div>
            </div>

            <Button
              onClick={handleAdminLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Crown className="w-4 h-4 mr-2" />
              {isLoading ? "Signing in..." : "Admin Login"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
                >
                  Create one
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
