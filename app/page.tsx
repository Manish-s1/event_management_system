'use client'

import Link from "next/link";
import { Calendar, Users, MapPin, Clock, ArrowRight } from "lucide-react";
import Header from "@/components/components/header";
import Footer from "@/components/components/footer";
import { useEffect, useState } from "react";
import axios from "axios";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  availableSlots: number;
  category: {
    name: string;
  };
}

export default function Home() {
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentEvents();
  }, []);

  const fetchRecentEvents = async () => {
    try {
      // Fetch all events including past ones for home page
      const response = await axios.get('/api/events?sort=newest&includePast=true');
      setRecentEvents(response.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching events:', error);
      // Set empty array on error so UI shows "no events" instead of loading forever
      setRecentEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header />
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-6">
            Discover Amazing <span className="text-blue-600">Events</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Find and book the best conferences, concerts, workshops, and networking events in your area
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/events"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Browse All Events
            </Link>
            <Link
              href="/categories"
              className="bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold border-2 border-slate-200 hover:border-blue-600 transition-colors"
            >
              View Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Events Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">
                Featured Events
              </h2>
              <p className="text-slate-600">Handpicked events to explore</p>
            </div>
            <Link 
              href="/events"
              className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              See All Events
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-slate-100 animate-pulse rounded-xl h-80"></div>
              ))}
            </div>
          ) : recentEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentEvents.map((event) => (
                <div key={event.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-linear-to-r from-blue-500 to-purple-600 h-32"></div>
                  <div className="p-6">
                    <div className="text-xs font-semibold text-blue-600 mb-2">{event.category.name}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="w-4 h-4" />
                        <span>{event.availableSlots} slots available</span>
                      </div>
                    </div>

                    <Link 
                      href={`/events/${event.id}`}
                      className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No events available at the moment</p>
            </div>
          )}

          {recentEvents.length > 0 && (
            <div className="text-center mt-12">
              <Link 
                href="/events"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
              >
                See More Events
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">
            Why Choose Eventify?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-xl bg-white hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">Easy Booking</h3>
              <p className="text-slate-600">
                Book your tickets in just a few clicks with our streamlined process
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">Community</h3>
              <p className="text-slate-600">
                Connect with like-minded people and expand your network
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">Local Events</h3>
              <p className="text-slate-600">
                Discover events happening right in your neighborhood
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">24/7 Support</h3>
              <p className="text-slate-600">
                Get help anytime with our dedicated support team
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
}
