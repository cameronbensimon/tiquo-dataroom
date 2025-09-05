"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

// Simple redirect component
function AuthenticatedRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log("[AUTH] User authenticated, redirecting to home");
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#f2f2f2'}}>
        <div className="text-center">
          <Image
            src="/Black.gif"
            alt="Loading..."
            width={32}
            height={32}
            className="mx-auto mb-4"
          />
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  return null;
}

export default function AuthPage() {
  const { isAuthenticated, isLoading: authLoading, refreshSession } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "code">("email");
  const [message, setMessage] = useState("");
  const router = useRouter();


  // If user is already authenticated, show redirect component
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#f2f2f2'}}>
        <div className="text-center">
          <Image
            src="/Black.gif"
            alt="Loading..."
            width={32}
            height={32}
            className="mx-auto mb-4"
          />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <AuthenticatedRedirect />;
  }

  const handleSendCode = async () => {
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setMessage("");
    
    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${result.error}`);
      } else {
        setMessage("Security code sent! Check your email and enter the 6-digit code below.");
        setStep("code");
      }
    } catch (error) {
      console.error("Send code error:", error);
      setMessage("Error sending code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      setMessage("Please enter the 6-digit security code");
      return;
    }

    if (code.length !== 6) {
      setMessage("Security code must be exactly 6 digits");
      return;
    }

    setIsLoading(true);
    setMessage("");
    
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email.toLowerCase(),
          code: code,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${result.error}`);
        setIsLoading(false);
      } else {
        // Refresh session and redirect
        await refreshSession();
        router.push("/");
      }
    } catch (error) {
      console.error("Verify code error:", error);
      setMessage("Error verifying code. Please try again.");
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setCode("");
    setMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{backgroundColor: '#f2f2f2'}}>
      {/* Preload critical images for dashboard */}
      <div className="hidden">
        <Image
          src="/Brand-Strategy.webp"
          alt="Brand Strategy"
          width={1}
          height={1}
          priority
        />
        <Image
          src="/deck.webp"
          alt="Deck"
          width={1}
          height={1}
          priority
        />
        <Image
          src="/Product-Technology.webp"
          alt="Product Technology"
          width={1}
          height={1}
          priority
        />
        <Image
          src="/Company-documents.webp"
          alt="Company Documents"
          width={1}
          height={1}
          priority
        />
      </div>
      
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Image
              src="/tiquo logo.svg"
              alt="tiquo Logo"
              width={96}
              height={96}
              priority
              className="w-20 h-20 md:w-24 md:h-24"
            />
          </div>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === "email" 
              ? "Enter your email to access Tiquo's Data Room"
              : "Enter the 6-digit security code from your email"
            }
          </p>
        </div>

        {message && (
          <div className={`rounded-md p-4 ${
            message.includes("Error") || message.includes("Invalid")
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-blue-50 text-blue-700 border border-blue-200"
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
                  "Send Security Code"
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
                  className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm text-center tracking-widest text-2xl font-mono"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  autoComplete="one-time-code"
                />
                <p className="text-xs text-gray-500 text-center mt-2">
                  Security code sent to <strong>{email}</strong>
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
                    "Verify Code"
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
                    "Resend Security Code"
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