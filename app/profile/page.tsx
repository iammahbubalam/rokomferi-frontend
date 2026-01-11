"use client";

import { useAuth } from "@/context/AuthContext";
import { Container } from "@/components/ui/Container";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <Container className="py-20 flex justify-center">
        <div className="animate-pulse w-32 h-32 bg-gray-200 rounded-full"></div>
      </Container>
    );
  }

  if (!user) return null;

  return (
    <Container className="py-12 md:py-20">
      <h1 className="text-3xl md:text-4xl font-serif mb-8 text-center md:text-left">
        My Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* Sidebar */}
        <div className="col-span-1 border-r border-primary/10 pr-0 md:pr-8">
            <div className="flex flex-col items-center md:items-start gap-4 mb-8">
                {user.avatar ? (
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border border-primary/20">
                        <Image src={user.avatar} alt="Profile" fill className="object-cover" />
                    </div>
                ) : (
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-serif">
                        {user.firstName?.[0]}
                    </div>
                )}
                
                <div className="text-center md:text-left">
                    <p className="text-xl font-bold">{user.firstName} {user.lastName}</p>
                    <p className="text-secondary opacity-70 text-sm">{user.email}</p>
                </div>
            </div>

            <nav className="flex flex-col gap-2">
                <button className="text-left px-4 py-3 bg-primary/5 font-bold border-l-2 border-primary">
                    Dashboard
                </button>
                <button className="text-left px-4 py-3 hover:bg-primary/5 transition-colors text-secondary">
                    My Orders
                </button>
                <button className="text-left px-4 py-3 hover:bg-primary/5 transition-colors text-secondary">
                    Addresses
                </button>
                <button 
                    onClick={logout}
                    className="text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors mt-4"
                >
                    Logout
                </button>
            </nav>
        </div>

        {/* Content */}
        <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold mb-6">Account Details</h2>
            
            <div className="bg-white p-6 md:p-8 border border-primary/10 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs uppercase tracking-widest text-secondary mb-2 block">First Name</label>
                        <div className="p-3 bg-gray-50 border border-gray-100">{user.firstName}</div>
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-widest text-secondary mb-2 block">Last Name</label>
                        <div className="p-3 bg-gray-50 border border-gray-100">{user.lastName}</div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs uppercase tracking-widest text-secondary mb-2 block">Email Address</label>
                        <div className="p-3 bg-gray-50 border border-gray-100 flex items-center gap-2">
                            {user.email} 
                            <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Verified</span>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs uppercase tracking-widest text-secondary mb-2 block">Role</label>
                         <div className="p-3 bg-gray-50 border border-gray-100 uppercase text-xs font-bold tracking-widest">{user.role}</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </Container>
  );
}
