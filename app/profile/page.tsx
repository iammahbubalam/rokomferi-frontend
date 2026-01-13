"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, MapPin, User, LogOut, LayoutDashboard } from "lucide-react";

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: any[];
}

interface Address {
    id: string;
    type: string;
    address: string;
    city: string;
    zip: string;
}

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "addresses" | "profile">("dashboard");

  // Data States
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  // Auth Guard
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, isLoading, router]);

  // Fetch Data
  useEffect(() => {
    if (user) {
        fetchOrders();
        fetchAddresses();
    }
  }, [user]);

  const fetchOrders = async () => {
      try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
              const data = await res.json();
              setOrders(data || []);
          }
      } catch (e) {
          console.error("Orders fetch failed", e);
      }
  };

  const fetchAddresses = async () => {
      try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/addresses`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
              const data = await res.json();
              setAddresses(data || []);
          }
      } catch (e) {
          console.error("Addresses fetch failed", e);
      }
  };

  if (isLoading || !user) {
      return (
        <div className="min-h-screen pt-40 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-bg-primary text-primary">
      <Container>
        <h1 className="text-3xl md:text-4xl font-serif mb-8 text-center md:text-left hidden md:block">
            My Account
        </h1>

        <div className="flex flex-col md:flex-row gap-12">
           
           {/* Sidebar */}
           <aside className="w-full md:w-64 flex-shrink-0">
               <div className="bg-white p-6 border border-primary/5 shadow-sm sticky top-24">
                   <div className="mb-8 text-center">
                       {user.avatar ? (
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border border-primary/20 mx-auto mb-3">
                                <Image src={user.avatar} alt="Profile" fill className="object-cover" />
                            </div>
                        ) : (
                           <div className="w-16 h-16 bg-bg-secondary rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-serif">
                               {user.firstName?.[0]}
                           </div>
                        )}
                       <h2 className="font-serif text-lg">{user.firstName} {user.lastName}</h2>
                       <p className="text-secondary text-xs">{user.email}</p>
                   </div>
                   
                   <nav className="space-y-1">
                       <button 
                         onClick={() => setActiveTab("dashboard")}
                         className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${activeTab === "dashboard" ? "bg-bg-secondary font-medium border-l-2 border-primary" : "hover:bg-bg-secondary/50 border-l-2 border-transparent"}`}
                       >
                           <LayoutDashboard className="w-4 h-4" /> Dashboard
                       </button>
                       <button 
                         onClick={() => setActiveTab("orders")}
                         className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${activeTab === "orders" ? "bg-bg-secondary font-medium border-l-2 border-primary" : "hover:bg-bg-secondary/50 border-l-2 border-transparent"}`}
                       >
                           <Package className="w-4 h-4" /> My Orders
                       </button>
                       <button 
                         onClick={() => setActiveTab("addresses")}
                         className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${activeTab === "addresses" ? "bg-bg-secondary font-medium border-l-2 border-primary" : "hover:bg-bg-secondary/50 border-l-2 border-transparent"}`}
                       >
                           <MapPin className="w-4 h-4" /> Addresses
                       </button>
                       <button 
                         onClick={() => setActiveTab("profile")}
                         className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${activeTab === "profile" ? "bg-bg-secondary font-medium border-l-2 border-primary" : "hover:bg-bg-secondary/50 border-l-2 border-transparent"}`}
                       >
                           <User className="w-4 h-4" /> Profile Details
                       </button>
                       <button 
                         onClick={() => { logout(); router.push("/"); }}
                         className="w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors text-red-500 hover:bg-red-50 mt-4 border-t border-primary/5"
                       >
                           <LogOut className="w-4 h-4" /> Logout
                       </button>
                   </nav>
               </div>
           </aside>

           {/* Main Content */}
           <main className="flex-grow">
               <h2 className="font-serif text-2xl mb-6 capitalize border-b border-primary/10 pb-4 md:hidden">{activeTab}</h2>
               
               {/* DASHBOARD OVERVIEW */}
               {activeTab === "dashboard" && (
                   <div className="space-y-8">
                       <div className="bg-white p-8 border border-primary/10 shadow-sm">
                           <p className="text-lg mb-4">
                               Hello, <span className="font-bold">{user.firstName}</span> (not {user.firstName}? <button onClick={logout} className="text-accent-gold hover:underline">Log out</button>)
                           </p>
                           <p className="text-secondary max-w-xl">
                               From your account dashboard you can view your <button onClick={() => setActiveTab("orders")} className="text-primary hover:underline">recent orders</button>, manage your <button onClick={() => setActiveTab("addresses")} className="text-primary hover:underline">shipping and billing addresses</button>, and edit your <button onClick={() => setActiveTab("profile")} className="text-primary hover:underline">password and account details</button>.
                           </p>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div className="bg-bg-secondary p-6 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("orders")}>
                               <Package className="w-8 h-8 mx-auto mb-3 text-primary/60" />
                               <h3 className="font-serif text-lg mb-1">{orders.length} Orders</h3>
                               <p className="text-xs text-secondary uppercase tracking-wider">View History</p>
                           </div>
                           <div className="bg-bg-secondary p-6 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("addresses")}>
                               <MapPin className="w-8 h-8 mx-auto mb-3 text-primary/60" />
                               <h3 className="font-serif text-lg mb-1">{addresses.length} Saved</h3>
                               <p className="text-xs text-secondary uppercase tracking-wider">Manage Addresses</p>
                           </div>
                           <div className="bg-bg-secondary p-6 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("profile")}>
                               <User className="w-8 h-8 mx-auto mb-3 text-primary/60" />
                               <h3 className="font-serif text-lg mb-1">Profile</h3>
                               <p className="text-xs text-secondary uppercase tracking-wider">Edit Details</p>
                           </div>
                       </div>
                   </div>
               )}

               {/* ORDERS TAB */}
               {activeTab === "orders" && (
                   <div className="space-y-6">
                       {orders.length === 0 ? (
                           <div className="text-center py-12 bg-white border border-primary/5">
                               <p className="text-secondary mb-4">You haven't placed any orders yet.</p>
                               <Link href="/shop"><Button variant="secondary">Start Shopping</Button></Link>
                           </div>
                       ) : (
                           orders.map((order: any) => (
                               <div key={order.id} className="bg-white border border-primary/10 p-6 shadow-sm hover:shadow-md transition-shadow">
                                   <div className="flex justify-between items-start mb-4">
                                       <div>
                                           <p className="text-xs text-secondary uppercase tracking-widest">Order #{order.id.slice(0,8)}</p>
                                           <p className="text-sm mt-1">{new Date(order.createdAt || order.date).toLocaleDateString()}</p>
                                       </div>
                                       <span className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-full ${
                                           order.status === "delivered" ? "bg-green-100 text-green-800" : 
                                           order.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                                       }`}>
                                           {order.status}
                                       </span>
                                   </div>
                                   <div className="border-t border-primary/5 pt-4 flex justify-between items-center bg-gray-50/50 p-4 -mx-6 -mb-6 mt-4">
                                       <span className="text-sm font-medium">{order.items?.length || 0} items</span>
                                       <span className="font-serif text-lg">৳{order.totalAmount?.toLocaleString() || order.total?.toLocaleString()}</span>
                                   </div>
                               </div>
                           ))
                       )}
                   </div>
               )}

               {/* ADDRESSES TAB */}
               {activeTab === "addresses" && (
                   <div className="space-y-6">
                        {addresses.length === 0 && (
                            <div className="text-center py-8 border border-dashed border-primary/20">
                                <p className="text-secondary mb-4">No addresses saved yet.</p>
                                <p className="text-xs text-secondary/60">Addresses are automatically saved when you checkout.</p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addresses.map((addr: any, idx) => (
                                <div key={idx} className="bg-white border border-primary/10 p-6 relative group">
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-xs text-red-500 hover:underline">Delete</button>
                                    </div>
                                    <p className="font-medium text-sm mb-2">{addr.type || "Shipping Address"}</p>
                                    <p className="text-sm text-secondary leading-relaxed">
                                        {addr.address}<br />
                                        {addr.city} {addr.zip && `- ${addr.zip}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                   </div>
               )}

               {/* PROFILE TAB */}
               {activeTab === "profile" && (
                   <div className="bg-white border border-primary/10 p-8 max-w-lg">
                       <div className="grid grid-cols-1 gap-6">
                           <div>
                               <label className="text-xs text-secondary uppercase tracking-wider block mb-2">First Name</label>
                               <div className="p-3 bg-gray-50 border border-gray-100">{user.firstName}</div>
                           </div>
                           <div>
                               <label className="text-xs text-secondary uppercase tracking-wider block mb-2">Last Name</label>
                               <div className="p-3 bg-gray-50 border border-gray-100">{user.lastName}</div>
                           </div>
                           <div>
                               <label className="text-xs text-secondary uppercase tracking-wider block mb-2">Email</label>
                               <div className="p-3 bg-gray-50 border border-gray-100 flex items-center gap-2">
                                   {user.email} 
                               </div>
                           </div>
                           <div>
                                <label className="text-xs text-secondary uppercase tracking-wider block mb-2">Role</label>
                                <div className="p-3 bg-gray-50 border border-gray-100 uppercase text-xs font-bold tracking-widest">{user.role}</div>
                           </div>
                       </div>
                   </div>
               )}

           </main>
        </div>
      </Container>
    </div>
  );
}
