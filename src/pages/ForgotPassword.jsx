// Forgot Password page
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Shield, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import apiService from "../services/api";
import "./Auth.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: security question, 3: new password
  const [formData, setFormData] = useState({
    email: "",
    securityAnswer: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiService.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: formData.email }),
        auth: false
      });

      setSecurityQuestion(response.securityQuestion);
      setStep(2);
      setSuccess("Please answer your security question to continue");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecurityAnswerSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiService.request('/auth/verify-security-answer', {
        method: 'POST',
        body: JSON.stringify({ 
          email: formData.email, 
          securityAnswer: formData.securityAnswer 
        }),
        auth: false
      });

      setResetToken(response.resetToken);
      setStep(3);
      setSuccess("Security answer verified! Please enter your new password");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      await apiService.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ 
          resetToken: resetToken,
          newPassword: formData.newPassword 
        }),
        auth: false
      });

      setSuccess("Password reset successfully! You can now login with your new password");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleEmailSubmit} className="auth-form">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Reset Your Password</h2>
              <p className="text-sm text-gray-600 mt-2">
                Enter your email address to get started
              </p>
            </div>

            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <div className="auth-form-group">
              <label htmlFor="email" className="auth-label">
                <Mail className="auth-label-icon" />
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="auth-input"
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="auth-submit-btn">
              {isLoading ? "Checking..." : "Continue"}
            </Button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleSecurityAnswerSubmit} className="auth-form">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Security Question</h2>
              <p className="text-sm text-gray-600 mt-2">
                Please answer your security question
              </p>
            </div>

            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <div className="auth-form-group">
              <label className="auth-label">
                <Shield className="auth-label-icon" />
                Security Question
              </label>
              <div className="p-3 bg-gray-100 rounded-lg text-sm text-gray-700">
                {securityQuestion}
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="securityAnswer" className="auth-label">
                <Shield className="auth-label-icon" />
                Your Answer
              </label>
              <Input
                id="securityAnswer"
                name="securityAnswer"
                type="text"
                value={formData.securityAnswer}
                onChange={handleInputChange}
                placeholder="Enter your answer"
                className="auth-input"
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="auth-submit-btn">
              {isLoading ? "Verifying..." : "Verify Answer"}
            </Button>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handlePasswordResetSubmit} className="auth-form">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Set New Password</h2>
              <p className="text-sm text-gray-600 mt-2">
                Enter your new password
              </p>
            </div>

            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <div className="auth-form-group">
              <label htmlFor="newPassword" className="auth-label">
                <Lock className="auth-label-icon" />
                New Password
              </label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className="auth-input"
                required
              />
            </div>

            <div className="auth-form-group">
              <label htmlFor="confirmPassword" className="auth-label">
                <Lock className="auth-label-icon" />
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                className="auth-input"
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="auth-submit-btn">
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-decorative-pattern"></div>
      
      <div className="auth-container">
        <Link to="/login" className="auth-back-btn">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </Link>

        <Card className="auth-card">
          <CardHeader className="auth-header">
            <div className="auth-logo">
              <h1 className="auth-logo-text">YALA CARVES</h1>
              <p className="auth-tagline">Password Recovery</p>
            </div>
          </CardHeader>

          <CardContent className="auth-content">
            {renderStep()}

            <div className="auth-divider">
              <span>Remember your password?</span>
            </div>

            <Link to="/login" className="auth-switch-link">
              Sign In
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
