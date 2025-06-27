import { CalendarDays, Book, BarChart2, Users } from "lucide-react";

const TeacherDashboard = () => {
  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-gray-50 min-h-screen">
      {/* Welcome Card */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-2">
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, Teacher!</h1>
            <p className="text-gray-500 mt-1">Here’s a quick overview of your day.</p>
          </div>
          <Users className="w-12 h-12 text-blue-500" />
        </div>
      </div>

      {/* Total Students */}
      <div className="bg-white shadow-md p-5 rounded-lg border border-gray-100 flex flex-col items-center">
        <BarChart2 className="text-blue-600 w-8 h-8 mb-2" />
        <h2 className="text-md font-semibold mb-1">Total Students</h2>
        <p className="text-3xl font-bold text-gray-800">120</p>
        <span className="text-gray-400 text-sm">Enrolled</span>
      </div>

      {/* Total Courses */}
      <div className="bg-white shadow-md p-5 rounded-lg border border-gray-100 flex flex-col items-center">
        <Book className="text-green-600 w-8 h-8 mb-2" />
        <h2 className="text-md font-semibold mb-1">Total Courses</h2>
        <p className="text-3xl font-bold text-gray-800">15</p>
        <span className="text-gray-400 text-sm">Active Courses</span>
      </div>

      {/* Today's Classes */}
      <div className="bg-white shadow-md p-5 rounded-lg border border-gray-100">
        <div className="flex items-center space-x-2 mb-3">
          <CalendarDays className="text-purple-600 w-7 h-7" />
          <h2 className="text-md font-semibold">Today's Classes</h2>
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
      <div className="bg-white shadow-md p-5 rounded-lg border border-gray-100 flex flex-col items-center">
        <BarChart2 className="text-red-600 w-8 h-8 mb-2" />
        <h2 className="text-md font-semibold mb-1">Fee Collection</h2>
        <p className="text-gray-800 font-semibold">Collected: $10,000</p>
        <p className="text-gray-400 text-sm">Pending: $2,000</p>
      </div>

      {/* Teachers */}
      <div className="bg-white shadow-md p-5 rounded-lg border border-gray-100 flex flex-col items-center">
        <Book className="text-indigo-600 w-8 h-8 mb-2" />
        <h2 className="text-md font-semibold mb-1">Teachers</h2>
        <p className="text-3xl font-bold text-gray-800">18</p>
        <span className="text-gray-400 text-sm">Active Teachers</span>
      </div>

      {/* Announcements */}
      <div className="bg-white shadow-md p-5 rounded-lg border border-gray-100 col-span-1 md:col-span-2">
        <div className="flex items-center space-x-2 mb-3">
          <CalendarDays className="text-orange-600 w-7 h-7" />
          <h2 className="text-md font-semibold">Announcements</h2>
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

export default TeacherDashboard;
