import { Container } from "@/components/ui/Container";

export default function AdminDashboard() {
  return (
    <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-8">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <h3 className="text-sm uppercase tracking-wide text-secondary mb-2">Total Orders</h3>
                <p className="text-3xl font-bold">0</p>
                <span className="text-xs text-green-600 font-medium">+0% from last month</span>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <h3 className="text-sm uppercase tracking-wide text-secondary mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold">BDT 0</p>
                <span className="text-xs text-green-600 font-medium">+0% from last month</span>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                 <h3 className="text-sm uppercase tracking-wide text-secondary mb-2">Active Products</h3>
                <p className="text-3xl font-bold">0</p>
                <span className="text-xs text-secondary">In stock</span>
            </div>
        </div>

        <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center min-h-[300px]">
            <p className="text-secondary mb-4">You are ready to start managing your store.</p>
            <div className="flex gap-4">
                 <a href="/admin/products" className="px-6 py-2 bg-primary text-white text-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors rounded-sm">
                    Manage Products
                 </a>
            </div>
        </div>
    </div>
  );
}
