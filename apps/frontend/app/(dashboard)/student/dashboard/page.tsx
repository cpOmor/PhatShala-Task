
import { CalendarDays, Book, BarChart2 } from "lucide-react";
const StudentDashboard = () => {
  return (
    <>
      <div className="p-6 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* Number of Courses */}
      <div className="shadow-lg p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <Book className="text-blue-600 w-6 h-6" />
          <h2 className="text-lg font-semibold">Number of Courses</h2>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-800">5</p>
          <p className="text-gray-500">Active Courses</p>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="shadow-lg p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart2 className="text-green-600 w-6 h-6" />
          <h2 className="text-lg font-semibold">Progress</h2>
        </div>
        <div>
          <p className="text-gray-500">Overall Course Completion</p>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-green-200">
              <div
                style={{ width: "70%" }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
              ></div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">70% Completed</p>
        </div>
      </div>

      {/* Schedule */}
      <div className="shadow-lg p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <CalendarDays className="text-purple-600 w-6 h-6" />
          <h2 className="text-lg font-semibold">Today's Schedule</h2>
        </div>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span className="font-medium text-gray-800">Math Class</span>
            <span className="text-sm text-gray-500">10:00 AM</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium text-gray-800">Science Lab</span>
            <span className="text-sm text-gray-500">1:00 PM</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium text-gray-800">History Lecture</span>
            <span className="text-sm text-gray-500">3:30 PM</span>
          </li>
        </ul>
      </div>

      {/* Study Materials */}
      <div className="shadow-lg p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <Book className="text-indigo-600 w-6 h-6" />
          <h2 className="text-lg font-semibold">Study Materials</h2>
        </div>
        <div className="flex flex-col space-y-2">
          <button className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300">
            View All Materials
          </button>
        </div>
      </div>

      {/* Fee Status */}
      <div className="shadow-lg p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart2 className="text-red-600 w-6 h-6" />
          <h2 className="text-lg font-semibold">Fee Status</h2>
        </div>
        <div>
          <p className="text-gray-800 font-semibold">Paid: $500</p>
          <p className="text-gray-500">Pending: $100</p>
        </div>
      </div>

      {/* Announcements */}
      <div className="shadow-lg p-4 rounded-lg border border-gray-200 col-span-1 md:col-span-2">
        <div className="flex items-center space-x-3 mb-4">
          <CalendarDays className="text-orange-600 w-6 h-6" />
          <h2 className="text-lg font-semibold">Announcements</h2>
        </div>
        <ul className="space-y-2">
          <li className="text-gray-800">Exam results will be published next week.</li>
          <li className="text-gray-800">Join the Science Fair on June 25th.</li>
          <li className="text-gray-800">Fee submission deadline extended to July 1st.</li>
        </ul>
      </div>
    </div>
    </>
  );
};
export default StudentDashboard