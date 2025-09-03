import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="flex flex-col gap-8 items-center text-center max-w-4xl mx-auto p-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900 tracking-tight">
            DataRoom
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            A secure, modern data room platform for document sharing and collaboration.
            Built with Next.js, Convex, and Convex Auth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-3xl">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🔒 Secure</h3>
            <p className="text-gray-600 text-sm">
              Passwordless authentication with Email OTP via Resend
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">⚡ Fast</h3>
            <p className="text-gray-600 text-sm">
              Built on Convex for real-time updates and lightning-fast performance
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🎨 Modern</h3>
            <p className="text-gray-600 text-sm">
              Beautiful UI with shadcn components and responsive design
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center mt-8">
          <Link
            href="/auth"
            className="rounded-lg bg-indigo-600 text-white px-6 py-3 text-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-300 text-gray-700 px-6 py-3 text-lg font-medium hover:bg-gray-50 transition-colors"
          >
            View Demo
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Tech Stack: Next.js 15 • Convex • Convex Auth + Email OTP • Resend • shadcn/ui • Tailwind CSS</p>
        </div>
      </main>
    </div>
  );
}