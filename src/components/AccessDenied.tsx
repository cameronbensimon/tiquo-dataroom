"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface AccessDeniedProps {
  onRequestAccess?: () => void;
}

type RequestState = 'idle' | 'requesting' | 'success' | 'error';

export default function AccessDenied({ onRequestAccess }: AccessDeniedProps) {
  const { user } = useAuth();
  const [requestState, setRequestState] = useState<RequestState>('idle');
  const [message, setMessage] = useState('');

  const handleRequestAccess = async () => {
    if (onRequestAccess) {
      onRequestAccess();
      return;
    }

    setRequestState('requesting');
    setMessage('');
    
    try {
      const response = await fetch('/api/auth/request-access', {
        method: 'POST',
        credentials: 'include',
      });

      const result = await response.json();

      if (response.ok) {
        setRequestState('success');
        setMessage(result.message || 'Access request submitted successfully!');
      } else {
        setRequestState('error');
        setMessage(result.error || 'Failed to submit access request');
      }
    } catch (error) {
      console.error('Request access error:', error);
      setRequestState('error');
      setMessage('An error occurred. Please try again.');
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
            width={96}
            height={96}
            className="w-20 h-20 md:w-24 md:h-24"
          />
        </div>
        
        {/* Access Denied/Requested Message */}
        <div className="space-y-6">
          {requestState === 'success' ? (
            // Success state
            <>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Access Request Submitted
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Your request for access to the Tiquo Data Room has been submitted successfully.
              </p>


              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Requested for:</strong> {user?.email}
                </p>
              </div>
            </>
          ) : (
            // Initial/Error state
            <>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Access Restricted
              </h1>
              

              {message && (
                <div className={`rounded-md p-4 ${
                  requestState === 'error'
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}>
                  <p className="text-sm text-center">{message}</p>
                </div>
              )}
              
              {/* Request Access Button */}
              <div className="pt-4">
                <Button
                  onClick={handleRequestAccess}
                  disabled={requestState === 'requesting'}
                  size="lg"
                >
                  {requestState === 'requesting' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Requesting Access...
                    </div>
                  ) : (
                    'Request Access'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
        
        {/* Additional Info */}
        {requestState !== 'success' && (
          <div className="pt-8">
            <p className="text-sm text-gray-400">
              If you believe you should have access, please request access using the button and we&apos;ll review your request.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
