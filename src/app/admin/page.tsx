"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

interface User {
  id: string;
  email: string;
  accessAllowed: boolean | null;
  createdAt: string;
}

export default function AdminPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Check if user is admin
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    if (!isAdmin) {
      router.push("/dashboard");
      return;
    }

    fetchUsers();
  }, [authLoading, isAuthenticated, isAdmin, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserAccess = async (email: string, accessAllowed: boolean) => {
    try {
      const response = await fetch('/api/users/update-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, accessAllowed }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`Access ${accessAllowed ? 'granted' : 'revoked'} for ${email}`);
        fetchUsers(); // Refresh the list
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error updating access: ${error}`);
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  if (authLoading || isLoading) {
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
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f2f2f2'}}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Image
                src="/tiquo logo.svg"
                alt="Tiquo Logo"
                width={96}
                height={96}
                className="w-20 h-20 md:w-24 md:h-24"
              />
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="text-sm text-gray-600">
              Logged in as {user?.email}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">User Access Management</h2>
            <p className="text-sm text-gray-600 mt-1">Manage Data Room access permissions</p>
          </div>

          {message && (
            <div className="mx-6 mt-4">
              <div className={`rounded-md p-4 ${
                message.includes("Access granted") || message.includes("Access revoked") 
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                <p className="text-sm">{message}</p>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Access Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.accessAllowed === true
                          ? 'bg-green-100 text-green-800'
                          : user.accessAllowed === false
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.accessAllowed === true 
                          ? 'Approved' 
                          : user.accessAllowed === false 
                          ? 'Denied'
                          : 'Pending'
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {user.accessAllowed !== true && (
                        <Button
                          onClick={() => updateUserAccess(user.email, true)}
                          variant="default"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Grant Access
                        </Button>
                      )}
                      {user.accessAllowed !== false && (
                        <Button
                          onClick={() => updateUserAccess(user.email, false)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Revoke Access
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && !isLoading && (
            <div className="px-6 py-8 text-center text-gray-500">
              No users found
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
