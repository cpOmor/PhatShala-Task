const Admin = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Total Students</h2>
          <p className="text-2xl font-bold text-green-600">1200</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Total Teachers</h2>
          <p className="text-2xl font-bold text-purple-600">80</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Active Courses</h2>
          <p className="text-2xl font-bold text-blue-600">35</p>
        </div>
      </div>
      <div className="mt-10 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
        <ul className="space-y-2">
          <li>✔️ New student registered</li>
          <li>✔️ Course "Mathematics" updated</li>
          <li>✔️ Teacher "Mr. Rahman" added</li>
        </ul>
      </div>
    </div>
  );
};

export default Admin;