import { cookies } from "next/headers";
import { getApiUrl } from "@/lib/utils";
import Image from "next/image";
import { User as UserIcon, Mail, Calendar, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: string;
  createdAt: string;
}

export default async function CustomersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let customers: Customer[] = [];
  let error = null;

  try {
    const res = await fetch(getApiUrl("/admin/users"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      customers = data.users || data || [];
    } else {
      error = "Failed to fetch customers";
    }
  } catch (e) {
    error = "Failed to load customers";
    console.error(e);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">
            Customers
          </h1>
          <p className="text-secondary mt-1">Manage your customer accounts</p>
        </div>
        <div className="text-sm text-secondary">
          Total:{" "}
          <span className="font-semibold text-primary">{customers.length}</span>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-secondary"
                    >
                      No customers found
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => {
                    const fullName = [customer.firstName, customer.lastName]
                      .filter(Boolean)
                      .join(" ") || customer.email.split("@")[0];

                    return (
                      <tr
                        key={customer.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {customer.avatar ? (
                              <div className="w-10 h-10 rounded-full overflow-hidden relative">
                                <Image
                                  src={customer.avatar}
                                  alt={fullName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-primary" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-primary">
                                {fullName}
                              </p>
                              <p className="text-xs text-secondary">
                                ID: {customer.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-secondary">
                            <Mail className="w-4 h-4" />
                            {customer.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-secondary" />
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${customer.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                                }`}
                            >
                              {customer.role}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-secondary text-sm">
                            <Calendar className="w-4 h-4" />
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

