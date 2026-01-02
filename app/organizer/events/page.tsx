'use client'

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  isPaid: boolean;
  price: number | null;
  totalSlots: number;
  availableSlots: number;
  category: {
    name: string;
  };
}

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/organizer/events');
      setEvents(res.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await api.delete(`/organizer/events/${eventId}`);
      toast.success('Event deleted successfully');
      setEvents(events.filter(e => e.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  if (loading) {
    return (
      <div className="p-10">
        <div className="text-center">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Events</h1>
        <Link href="/organizer/events/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-slate-500 mb-4">You haven&apos;t created any events yet</p>
            <Link href="/organizer/events/create">
              <Button>Create Your First Event</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                    <CardDescription className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block">
                      {event.category.name}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/organizer/events/${event.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{event.availableSlots} / {event.totalSlots} slots available</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-semibold text-lg">
                    {event.isPaid ? `₹${event.price}` : 'Free'}
                  </span>
                  <Link href={`/organizer/events/${event.id}`}>
                    <Button variant="outline" size="sm">
                      View Registrations
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
