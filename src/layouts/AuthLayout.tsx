import { Outlet } from 'react-router-dom';
import { School } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <div className="relative flex flex-col items-center justify-center w-full p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-8">
            <School className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Green Valley International School
          </h1>
          <p className="text-primary-100 text-lg max-w-md">
            Enterprise School Management System for modern education institutions
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-primary-200 text-sm mt-1">Students</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">50+</p>
              <p className="text-primary-200 text-sm mt-1">Teachers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">8</p>
              <p className="text-primary-200 text-sm mt-1">Classes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Green Valley</h1>
              <p className="text-xs text-gray-500">School ERP</p>
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
