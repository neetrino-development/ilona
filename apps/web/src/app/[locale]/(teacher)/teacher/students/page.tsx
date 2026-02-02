'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { useGroups } from '@/features/groups';
import { cn } from '@/shared/lib/utils';

interface Student {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
  level?: string;
}

interface Group {
  id: string;
  name: string;
  level?: string;
  students?: Student[];
  _count?: {
    students: number;
  };
}

export default function TeacherStudentsPage() {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch teacher's groups
  const { data: groupsData, isLoading } = useGroups({ take: 50 });
  const groups = (groupsData?.items || []) as Group[];

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);
  const students = selectedGroup?.students || [];

  // Filter students by search
  const filteredStudents = students.filter((student) => {
    if (!searchQuery) return true;
    const fullName = `${student.user.firstName} ${student.user.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || student.user.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <DashboardLayout
      title="My Students"
      subtitle="View students in your groups and provide feedback."
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Groups Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">Your Groups</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : groups.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-slate-500">No groups assigned</p>
                </div>
              ) : (
                groups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroupId(group.id)}
                    className={cn(
                      'w-full p-4 text-left transition-colors',
                      selectedGroupId === group.id
                        ? 'bg-blue-50 border-l-2 border-blue-600'
                        : 'hover:bg-slate-50'
                    )}
                  >
                    <p className="font-medium text-slate-800">{group.name}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">
                        {group.level || 'N/A'}
                      </span>
                      <span>{group._count?.students || 0} students</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="lg:col-span-3">
          {!selectedGroupId ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">Select a Group</h3>
              <p className="text-sm text-slate-500">Choose a group from the sidebar to view students</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-800">{selectedGroup?.name}</h3>
                    <p className="text-sm text-slate-500">
                      {selectedGroup?.level} • {students.length} students
                    </p>
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="search"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Students */}
              <div className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-slate-500">
                      {searchQuery ? 'No students found' : 'No students in this group'}
                    </p>
                  </div>
                ) : (
                  filteredStudents.map((student) => {
                    const initials = `${student.user.firstName[0]}${student.user.lastName[0]}`;

                    return (
                      <div key={student.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                              {initials}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">
                                {student.user.firstName} {student.user.lastName}
                              </p>
                              <p className="text-sm text-slate-500">{student.user.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              View Profile
                            </button>
                            <button className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                              Send Message
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
