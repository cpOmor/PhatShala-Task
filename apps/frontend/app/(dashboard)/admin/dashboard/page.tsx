import { CalendarDays, Book, BarChart2 } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="p-6 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* Total Students */}
      <div className="shadow-lg p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart2 className="text-blue-600 w-6 h-6" />
          <h2 className="text-lg font-semibold">Total Students</h2>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-800">120</p>
          <p className="text-gray-500">Enrolled</p>
        </div>
      </div>

      {/* Total Courses */}
      <div className="shadow-lg p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <Book className="text-green-600 w-6 h-6" />
          <h2 className="text-lg font-semibold">Total Courses</h2>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-800">15</p>
          <p className="text-gray-500">Active Courses</p>
        </div>
      </div>

      {/* Today's Classes */}
      <div className="shadow-lg p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <CalendarDays className="text-purple-600 w-6 h-6" />
          <h2 className="text-lg font-semibold">Today's Classes</h2>
        </div>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span className="font-medium text-gray-800">Math (Grade 10)</span>
            <span className="text-sm text-gray-500">10:00 AM</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium text-gray-800">Physics (Grade 12)</span>
            <span className="text-sm text-gray-500">12:00 PM</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium text-gray-800">English (Grade 8)</span>
            <span className="text-sm text-gray-500">2:00 PM</span>
          </li>
        </ul>
      </div>

      {/* Fee Collection */}
      <div className="shadow-lg p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart2 className="text-red-600 w-6 h-6" />
          <h2 className="text-lg font-semibold">Fee Collection</h2>
        </div>
        <div>
          <p className="text-gray-800 font-semibold">Collected: $10,000</p>
          <p className="text-gray-500">Pending: $2,000</p>
        </div>
      </div>

      {/* Teachers */}
      <div className="shadow-lg p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <Book className="text-indigo-600 w-6 h-6" />
          <h2 className="text-lg font-semibold">Teachers</h2>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-800">18</p>
          <p className="text-gray-500">Active Teachers</p>
        </div>
      </div>

      {/* Announcements */}
      <div className="shadow-lg p-4 rounded-lg border border-gray-200 col-span-1 md:col-span-2">
        <div className="flex items-center space-x-3 mb-4">
          <CalendarDays className="text-orange-600 w-6 h-6" />
          <h2 className="text-lg font-semibold">Announcements</h2>
        </div>
        <ul className="space-y-2">
          <li className="text-gray-800">Staff meeting scheduled for June 20th.</li>
          <li className="text-gray-800">New admission process starts July 1st.</li>
          <li className="text-gray-800">Annual function on August 15th.</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
