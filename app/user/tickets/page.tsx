'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Download, MapPin, Tag, Ticket } from 'lucide-react';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { api } from '@/lib/axios';

interface Registration {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  isVerified: boolean;
  ticketIssued: boolean;
  paymentScreenshot?: string | null;
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category: {
      name: string;
    };
  };
}

export default function UserTicketsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      try {
        const res = await api.get('/user/registrations');
        setRegistrations(res.data);
      } catch (error) {
        console.error('Error fetching registrations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchRegistrations();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="space-y-4">
              <div className="h-10 w-64 bg-slate-200 animate-pulse rounded" />
              <div className="grid gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!session) return null;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">My Tickets</h1>
              <p className="text-slate-600">View and manage your event tickets</p>
            </div>

            {registrations.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                <Ticket className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-900 mb-2">No tickets yet</h2>
                <p className="text-slate-600 mb-6">You haven’t registered for any events.</p>
                <Link
                  href="/events"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {registrations.map((registration) => {
                  const eventDate = new Date(registration.event.date);
                  const isPastEvent = eventDate < new Date();

                  return (
                    <div
                      key={registration.id}
                      className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4 gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                              <Tag className="w-4 h-4" />
                              <span>{registration.event.category.name}</span>
                              {isPastEvent && (
                                <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-700">
                                  Past Event
                                </span>
                              )}
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">{registration.event.title}</h2>
                          </div>

                          <div className="text-right space-y-2">
                            <div className="inline-flex items-center gap-2 px-2 py-1 rounded border border-slate-200 text-xs text-slate-700 bg-slate-50">
                              <Ticket className="w-4 h-4" />
                              <span>{registration.ticketIssued ? 'Ticket Issued' : 'Pending Ticket'}</span>
                            </div>
                            <div className="text-xs">
                              {registration.isVerified ? (
                                <span className="px-2 py-1 rounded bg-blue-50 text-blue-700">Payment Verified</span>
                              ) : (
                                <span className="px-2 py-1 rounded bg-slate-100 text-slate-800">Payment Pending</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-slate-400" />
                            <div>
                              <p className="text-sm text-slate-500">Date</p>
                              <p className="font-medium text-slate-900">
                                {eventDate.toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-slate-400" />
                            <div>
                              <p className="text-sm text-slate-500">Location</p>
                              <p className="font-medium text-slate-900">{registration.event.location}</p>
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-600 text-sm line-clamp-2 mb-4">{registration.event.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="text-sm space-y-1 text-slate-700">
                            <p><span className="text-slate-500">Name:</span> {registration.fullName}</p>
                            <p><span className="text-slate-500">Email:</span> {registration.email}</p>
                            <p><span className="text-slate-500">Phone:</span> {registration.phone}</p>
                            <p><span className="text-slate-500">Address:</span> {registration.address}</p>
                          </div>

                          {registration.paymentScreenshot && (
                            <div className="text-sm">
                              <p className="font-medium text-slate-900 mb-2">Payment Screenshot</p>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={registration.paymentScreenshot}
                                alt="Payment"
                                className="w-full max-h-40 object-contain border border-slate-200 rounded-md bg-white"
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
                          <p className="text-xs text-slate-500">
                            Registered on {new Date(registration.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex gap-3">
                            {registration.ticketIssued && (
                              <Link
                                href={`/user/tickets/${registration.id}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                              >
                                <Download className="w-4 h-4" />
                                View Ticket
                              </Link>
                            )}
                            <Link
                              href={`/events/${registration.event.id}`}
                              className="text-blue-600 hover:underline text-sm font-medium"
                            >
                              View Event Details →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
