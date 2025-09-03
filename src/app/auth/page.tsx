"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "code">("email");
  const [message, setMessage] = useState("");
  const router = useRouter();

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
      setMessage("Successfully signed in!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Verify code error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMessage(`Invalid code: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setCode("");
    setMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to DataRoom
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === "email" 
              ? "Enter your email to receive a login code"
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
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                onClick={handleSendCode}
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? "Sending Code..." : "Send Login Code"}
              </button>
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
                <button
                  onClick={handleBackToEmail}
                  disabled={isLoading}
                  className="group relative flex-1 flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyCode}
                  disabled={isLoading}
                  className="group relative flex-1 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? "Verifying..." : "Sign In"}
                </button>
              </div>
              <div className="text-center">
                <button
                  onClick={handleSendCode}
                  disabled={isLoading}
                  className="text-sm text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
                >
                  Resend code
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}