export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-serif text-stone-900 mb-2">Welcome to Admin</h1>
      <p className="text-stone-600 mb-8">Manage your website content directly from here. Changes will automatically update the live site.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h3 className="text-lg font-medium text-stone-900 mb-2">Menu</h3>
          <p className="text-sm text-stone-500 mb-4">Add, edit, or remove categories and dishes.</p>
          <a href="/admin/menu" className="text-sm font-medium text-blue-600 hover:underline">Manage Menu &rarr;</a>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h3 className="text-lg font-medium text-stone-900 mb-2">Hero Slides</h3>
          <p className="text-sm text-stone-500 mb-4">Update the homepage carousel images and text.</p>
          <a href="/admin/slides" className="text-sm font-medium text-blue-600 hover:underline">Manage Slides &rarr;</a>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h3 className="text-lg font-medium text-stone-900 mb-2">Restaurant Pages</h3>
          <p className="text-sm text-stone-500 mb-4">Update story, location, hours, and contact details.</p>
          <a href="/admin/restaurant-pages" className="text-sm font-medium text-blue-600 hover:underline">Manage Pages &rarr;</a>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h3 className="text-lg font-medium text-stone-900 mb-2">Manage Users</h3>
          <p className="text-sm text-stone-500 mb-4">Add, remove, or update administrator accounts.</p>
          <a href="/admin/users" className="text-sm font-medium text-blue-600 hover:underline">Manage Admins &rarr;</a>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
          <h3 className="text-lg font-medium text-stone-900 mb-2">Live Site</h3>
          <p className="text-sm text-stone-500 mb-4">View the public version of your website.</p>
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline">View Live Site &rarr;</a>
        </div>
      </div>
    </div>
  );
}
