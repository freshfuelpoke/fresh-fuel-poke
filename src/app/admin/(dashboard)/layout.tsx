import { AdminSidebarNav } from "./admin-sidebar-nav";
import { LogoutButton } from "./logout-button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-stone-900 text-stone-300 flex flex-col md:fixed md:inset-y-0 md:left-0 z-50">
        <div className="p-6 border-b border-stone-800">
          <h2 className="text-xl font-serif text-white tracking-wide">
            Fresh Fuel
            <br />
            <span className="text-stone-400 text-sm font-sans uppercase tracking-[0.2em]">
              Admin
            </span>
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AdminSidebarNav />
        </div>
        <div className="p-4 border-t border-stone-800">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 md:ml-64">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
