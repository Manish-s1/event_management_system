'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Header from '@/components/components/header';
import Footer from '@/components/components/footer';
import EventCard from '@/components/user/EventCard';
import { api } from '@/lib/axios';
import { useParams } from 'next/navigation';
import { Calendar } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  isPaid: boolean;
  price: number | null;
  availableSlots: number;
  imageUrl?: string | null;
  category: { id: string; name: string };
}

export default function CategoryDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    const run = async () => {
      try {
        const [catRes, eventsRes] = await Promise.all([
          api.get(`/admin/category/${id}`),
          api.get(`/events?categoryId=${id}&includePast=true`),
        ]);
        setCategoryName(catRes.data.data.name || 'Category');
        setEvents(eventsRes.data);
      } catch (err) {
        console.error('Error loading category', err);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{categoryName}</h1>
            <p className="text-slate-600">Events in this category</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  isPaid={event.isPaid}
                  price={event.price}
                  availableSlots={event.availableSlots}
                  categoryName={event.category?.name}
                  imageUrl={event.imageUrl ?? undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No events found for this category</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
