"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface AccessDeniedProps {
  onRequestAccess?: () => void;
}

export default function AccessDenied({ onRequestAccess }: AccessDeniedProps) {
  const handleRequestAccess = () => {
    if (onRequestAccess) {
      onRequestAccess();
    } else {
      // Default behavior - could email or redirect to contact form
      window.location.href = "mailto:hello@tiquo.co?subject=Data Room Access Request&body=I would like to request access to the Tiquo data room.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{backgroundColor: '#f2f2f2'}}>
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Tiquo Logo */}
        <div className="flex justify-center">
          <Image
            src="/tiquo logo.svg"
            alt="Tiquo - The Universal Booking, Loyalty & Point of Sale Platform"
            width={120}
            height={120}
            className="w-24 h-24 md:w-30 md:h-30"
          />
        </div>
        
        {/* Access Denied Message */}
        <div className="space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Access Restricted
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            Access is restricted to Tiquo&apos;s data room. Request access here.
          </p>
          
          {/* Request Access Button */}
          <div className="pt-4">
            <Button
              onClick={handleRequestAccess}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Request Access
            </Button>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="pt-8">
          <p className="text-sm text-gray-400">
            If you believe you should have access, please contact us and we&apos;ll review your request.
          </p>
        </div>
      </div>
    </div>
  );
}
