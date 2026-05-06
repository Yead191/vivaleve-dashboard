import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#429CA8]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#429CA8]/5 rounded-full blur-3xl" />

      <div className="w-full max-w-[440px] relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100/50 p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-4">

            <img src="/logo.png" alt="Logo" className="w-fit h-24 object-contain" />

          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-gray-500 mt-2 text-sm">{subtitle}</p>}
          </div>

          {/* Form Content */}
          {children}
        </div>

        {/* Footer text */}
        <p className="text-center text-gray-400 text-xs mt-8">
          &copy; 2026 VivaLeve Admin Console. All rights reserved.
        </p>
      </div>
    </div>
  );
}
