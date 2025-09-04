"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Component that handles navigation after authentication
function AuthenticatedRedirect() {
  const user = useQuery(api.users.getCurrentUser);
  const router = useRouter();

  console.log("🔄 AuthenticatedRedirect - user:", user);

  if (user === undefined) {
    console.log("⏳ User data loading...");
    return null; // Still loading user data
  }

  if (user === null) {
    console.log("❌ No user found, should not happen in Authenticated component");
    return null;
  }

  console.log("✅ User data loaded:", {
    email: user.email,
    AccessAllowed: user.AccessAllowed,
    _id: user._id
  });

  // Navigate based on access level
  if (user.AccessAllowed === true) {
    console.log("🚀 REDIRECTING TO DASHBOARD - AccessAllowed is true");
    router.push("/dashboard");
  } else {
    console.log("🚀 REDIRECTING TO REQUEST-ACCESS - AccessAllowed is", user.AccessAllowed);
    router.push("/request-access");
  }

  return null;
}

export default function AuthPage() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "code">("email");
  const [message, setMessage] = useState("");

  const handleSendCode = async () => {
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setMessage("");
    
    try {
      const formData = new FormData();
      formData.append("email", email);
      
      await signIn("resend-otp", formData);
      setMessage("Check your email for the login code!");
      setStep("code");
    } catch (error) {
      console.error("Send code error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMessage(`Error sending code: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      setMessage("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    setMessage("");
    
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("code", code);
      
      await signIn("resend-otp", formData);
      console.log("🎉 SIGN IN SUCCESSFUL!");
      setMessage("Successfully signed in! Redirecting...");
      setIsLoading(false);
      // Navigation will be handled by Authenticated component
    } catch (error) {
      console.error("Verify code error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMessage(`Invalid code: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setCode("");
    setMessage("");
  };

  // Use Convex Auth's built-in components for proper auth state management
  return (
    <>
      <AuthLoading>
        {/* Show loading while authentication state is being determined */}
        <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#f2f2f2'}}>
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </AuthLoading>

      <Authenticated>
        {/* User is authenticated - handle navigation based on access level */}
        <AuthenticatedRedirect />
      </Authenticated>

      <Unauthenticated>
        {/* User is not authenticated - show login form */}
        {renderAuthForm()}
      </Unauthenticated>
    </>
  );

  function renderAuthForm() {

    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#f2f2f2'}}>
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <Image
                src="/tiquo logo.svg"
                alt="tiquo Logo"
                width={96}
                height={96}
                className="w-20 h-20 md:w-24 md:h-24"
              />
            </div>
            <p className="mt-2 text-center text-sm text-gray-600">
              {step === "email" 
                ? "Enter your email to access Tiquo's Data Room"
                : "Enter the 6-digit code sent to your email"
              }
            </p>
          </div>

        {message && (
          <div className={`rounded-md p-4 ${
            message.includes("Error") || message.includes("Invalid")
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}>
            <p className="text-sm text-center">{message}</p>
          </div>
        )}

        <div className="mt-8 space-y-6">
          {step === "email" ? (
            <>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                />
              </div>
              <Button
                onClick={handleSendCode}
                disabled={isLoading}
                variant="default"
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Image
                      src="/Black.gif"
                      alt="Loading..."
                      width={20}
                      height={20}
                    />
                    Sending Code...
                  </div>
                ) : (
                  "Send Login Code"
                )}
              </Button>
            </>
          ) : (
            <>
              <div>
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  maxLength={6}
                  className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center tracking-widest text-2xl"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
                <p className="text-xs text-gray-500 text-center mt-2">
                  Code sent to {email}
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleBackToEmail}
                  disabled={isLoading}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerifyCode}
                  disabled={isLoading}
                  variant="default"
                  size="lg"
                  className="flex-1"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Image
                        src="/Black.gif"
                        alt="Loading..."
                        width={20}
                        height={20}
                      />
                      Verifying...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
              <div className="text-center">
                <Button
                  onClick={handleSendCode}
                  disabled={isLoading}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Image
                        src="/Black.gif"
                        alt="Loading..."
                        width={16}
                        height={16}
                      />
                      Resending...
                    </div>
                  ) : (
                    "Resend code"
                  )}
                </Button>
              </div>
            </>
          )}
          </div>
        </div>
      </div>
    );
  }
}