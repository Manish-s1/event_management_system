'use client'

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/components/header';
import Footer from '@/components/components/footer';
import { Calendar, Search } from 'lucide-react';
import { api } from '@/lib/axios';
import EventCard from '@/components/user/EventCard';

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
  category: {
    id?: string;
    name: string;
  };
}

interface CategoryOption {
  id: string;
  name: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [isPaidFilter, setIsPaidFilter] = useState<'all'|'paid'|'free'>('all');
  const [sort, setSort] = useState<'upcoming'|'newest'|'oldest'>('upcoming');
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoryId, setCategoryId] = useState<string>('');
  const [includePast, setIncludePast] = useState<boolean>(true);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories', err);
    }
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      if (categoryId) params.categoryId = categoryId;
      if (isPaidFilter === 'paid') params.isPaid = 'true';
      if (isPaidFilter === 'free') params.isPaid = 'false';
      params.sort = sort;
      params.includePast = String(includePast);

      const query = new URLSearchParams(params).toString();
      const res = await api.get(`/events${query ? `?${query}` : ''}`);
      setEvents(res.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryId, isPaidFilter, sort, includePast]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">All Events</h1>
            <p className="text-slate-600 mb-6">Discover and book tickets for amazing events</p>
            
            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-3 border border-slate-300 rounded-lg bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={isPaidFilter}
                onChange={(e) => setIsPaidFilter(e.target.value as 'all'|'paid'|'free')}
                className="w-full px-3 py-3 border border-slate-300 rounded-lg bg-white"
              >
                <option value="all">All Pricing</option>
                <option value="paid">Paid</option>
                <option value="free">Free</option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as 'upcoming'|'newest'|'oldest')}
                className="w-full px-3 py-3 border border-slate-300 rounded-lg bg-white"
              >
                <option value="upcoming">Upcoming</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>

              

              <div className="md:col-span-2 lg:col-span-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="includePast"
                  checked={includePast}
                  onChange={(e) => setIncludePast(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="includePast" className="text-slate-700 font-medium cursor-pointer">
                  Show past events
                </label>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl h-96 animate-pulse"></div>
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
              <p className="text-slate-600">No events found matching your filters</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
