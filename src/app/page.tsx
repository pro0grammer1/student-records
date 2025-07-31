'use client'

import { useAuth } from '@/components/AuthContext';
import Card from '@/components/Card';

export default function Home() {
  const { signedIn, students, loading, studentsError, loadStudents } = useAuth();

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className={`flex-shrink-0 p-4 text-center`}>
        <h2 className={`text-4xl font-nunito`}>
          Student Directory
        </h2>
      </div>

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg text-white">Loading students...</p>
          </div>
        </div>
      )}

      {studentsError && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{studentsError}</p>
            <button
              onClick={loadStudents}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

        <div className="flex-1 w-full overflow-y-auto px-4 pb-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-white">
                All Students ({students.length})
              </h3>
              <button
                onClick={loadStudents}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            {students.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <p className="text-xl text-gray-400 mb-2">No students found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {students.map((student) => (
                  <Card
                    admin={signedIn}
                    student={student}
                    key={student._id?.toString() || student.roll_no.toString()}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
    </div>
  );
}