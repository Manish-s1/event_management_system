'use client'

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, DollarSign, Ticket, Plus } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalEvents: number;
  totalRegistrations: number;
  upcomingEvents: number;
  revenue: number;
}

export default function OrganizerDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    totalRegistrations: 0,
    upcomingEvents: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const eventsRes = await api.get('/organizer/events');
        const events = eventsRes.data;
        
        const now = new Date();
        const upcoming = events.filter((e: { date: string }) => new Date(e.date) > now).length;
        const totalRegs = events.reduce((sum: number, e: { registrations: unknown[] }) => 
          sum + (e.registrations?.length || 0), 0
        );
        const revenue = events.reduce((sum: number, e: { isPaid: boolean; price: number; registrations: unknown[] }) => 
          sum + (e.isPaid && e.price ? e.price * (e.registrations?.length || 0) : 0), 0
        );

        setStats({
          totalEvents: events.length,
          totalRegistrations: totalRegs,
          upcomingEvents: upcoming,
          revenue,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
          <p className="text-slate-600">Manage your events and registrations</p>
        </div>
        <Link href="/organizer/events/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Events
            </CardTitle>
            <Calendar className="w-4 h-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Upcoming Events
            </CardTitle>
            <Ticket className="w-4 h-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.upcomingEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Registrations
            </CardTitle>
            <Users className="w-4 h-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalRegistrations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Revenue
            </CardTitle>
            <DollarSign className="w-4 h-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{stats.revenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/organizer/events/create">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create New Event
              </Button>
            </Link>
            <Link href="/organizer/events">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                View All Events
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 space-y-2">
            <p>• Create events with paid or free tickets</p>
            <p>• Upload QR code for payment collection</p>
            <p>• Verify payment screenshots from users</p>
            <p>• Issue tickets after verification</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
