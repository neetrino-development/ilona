'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { StatCard, DataTable, Badge, Button } from '@/shared/components/ui';

interface Student {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  group?: {
    id: string;
    name: string;
    level?: string;
  };
  monthlyFee: number;
  attendanceRate: number;
  paymentStatus: 'paid' | 'pending' | 'overdue';
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Mock data
    setStudents([
      {
        id: '1',
        user: { id: 'u1', firstName: 'Anna', lastName: 'Kowalski', email: 'anna.k@student.edu' },
        group: { id: 'g1', name: 'ENGLISH B2', level: 'B2' },
        monthlyFee: 150,
        attendanceRate: 95,
        paymentStatus: 'paid',
      },
      {
        id: '2',
        user: { id: 'u2', firstName: 'Michael', lastName: 'Brown', email: 'm.brown@student.edu' },
        group: { id: 'g1', name: 'ENGLISH B2', level: 'B2' },
        monthlyFee: 150,
        attendanceRate: 88,
        paymentStatus: 'pending',
      },
      {
        id: '3',
        user: { id: 'u3', firstName: 'Sofia', lastName: 'Garcia', email: 'sofia.g@student.edu' },
        group: { id: 'g2', name: 'IELTS ADV', level: 'C1' },
        monthlyFee: 200,
        attendanceRate: 100,
        paymentStatus: 'paid',
      },
      {
        id: '4',
        user: { id: 'u4', firstName: 'James', lastName: 'Wilson', email: 'j.wilson@student.edu' },
        group: { id: 'g3', name: 'BUSINESS FR', level: 'B1' },
        monthlyFee: 175,
        attendanceRate: 72,
        paymentStatus: 'overdue',
      },
      {
        id: '5',
        user: { id: 'u5', firstName: 'Emma', lastName: 'Davis', email: 'emma.d@student.edu' },
        group: { id: 'g1', name: 'ENGLISH B2', level: 'B2' },
        monthlyFee: 150,
        attendanceRate: 91,
        paymentStatus: 'paid',
      },
    ]);
    setIsLoading(false);
  }, []);

  const stats = {
    totalStudents: 2450,
    activeStudents: 2280,
    atRisk: 45,
    pendingPayments: 156,
  };

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.user.firstName} ${student.user.lastName}`.toLowerCase();
    const email = student.user.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  const studentColumns = [
    {
      key: 'checkbox',
      header: <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />,
      render: () => <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />,
    },
    {
      key: 'student',
      header: 'Student ↕',
      render: (student: Student) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
            {student.user.firstName[0]}{student.user.lastName[0]}
          </div>
          <div>
            <p className="font-semibold text-slate-800">
              {student.user.firstName} {student.user.lastName}
            </p>
            <p className="text-sm text-slate-500">{student.user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'group',
      header: 'Group',
      render: (student: Student) => (
        student.group ? (
          <Badge variant="info">{student.group.name}</Badge>
        ) : (
          <span className="text-slate-400">Not assigned</span>
        )
      ),
    },
    {
      key: 'attendance',
      header: 'Attendance',
      className: 'text-center',
      render: (student: Student) => {
        const rate = student.attendanceRate;
        let color = 'text-emerald-600';
        if (rate < 80) color = 'text-red-500';
        else if (rate < 90) color = 'text-amber-500';
        return <span className={`font-semibold ${color}`}>{rate}%</span>;
      },
    },
    {
      key: 'payment',
      header: 'Payment Status',
      render: (student: Student) => {
        switch (student.paymentStatus) {
          case 'paid':
            return <Badge variant="success">Paid</Badge>;
          case 'pending':
            return <Badge variant="warning">Pending</Badge>;
          case 'overdue':
            return (
              <div className="flex items-center gap-2">
                <span className="text-red-500">!</span>
                <Badge variant="error">Overdue</Badge>
              </div>
            );
          default:
            return null;
        }
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-medium">
          View Profile
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout 
      title="Student Management" 
      subtitle="Track enrollment, attendance and payment status across all groups."
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={stats.totalStudents.toLocaleString()}
            change={{ value: '+5.2%', type: 'positive' }}
          />
          <StatCard
            title="Active Students"
            value={stats.activeStudents.toLocaleString()}
            change={{ value: '+3.1%', type: 'positive' }}
          />
          <StatCard
            title="At Risk"
            value={stats.atRisk}
            change={{ value: 'Low attendance', type: 'warning' }}
          />
          <StatCard
            title="Pending Payments"
            value={stats.pendingPayments}
            change={{ value: '$23,400', type: 'neutral' }}
          />
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Search students by name, email or group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium">
            + Add student
          </Button>
          <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>

        {/* Students Table */}
        <DataTable
          columns={studentColumns}
          data={filteredStudents}
          keyExtractor={(student) => student.id}
          isLoading={isLoading}
          emptyMessage="No students found"
        />

        {/* Pagination */}
        <div className="flex items-center justify-end gap-2 text-sm text-slate-500">
          <button className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50" disabled>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span>1-{filteredStudents.length} of {stats.totalStudents}</span>
          <button className="p-2 rounded-lg hover:bg-slate-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 rounded-xl">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-2">At-Risk Students</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  45 students have attendance below 80%. Early intervention can help prevent dropouts and improve retention.
                </p>
                <button className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                  View At-Risk List
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-50 rounded-xl">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-2">Payment Collection</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  156 students have pending or overdue payments totaling $23,400. Send automated reminders to improve collection.
                </p>
                <button className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                  Send Reminders
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

