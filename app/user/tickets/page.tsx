'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { Calendar, MapPin, Ticket, Tag, Download } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/components/header';
import Footer from '@/components/components/footer';

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
      return;
    }

    const fetchRegistrations = async () => {
      try {
        const response = await api.get('/user/registrations');
        setRegistrations(response.data);
      } catch (error) {
        console.error('Error fetching registrations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchRegistrations();
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="space-y-4">
              <div className="h-10 w-64 bg-slate-200 animate-pulse rounded"></div>
              <div className="grid gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Tickets</h1>
            <p className="text-muted-foreground">
              View all your event registrations and tickets
            </p>
          </div>

          {registrations.length === 0 ? (
            <div className="bg-card rounded-lg shadow p-12 text-center">
              <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No tickets yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven’t registered for any events. Browse events to get started!
              </p>
              <Link
                href="/events"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"
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
                    className="bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Tag className="w-4 h-4" />
                            <span>{registration.event.category.name}</span>
                            {isPastEvent && (
                              <span className="ml-2 px-2 py-0.5 bg-muted rounded text-xs">
                                Past Event
                              </span>
                            )}
                          </div>
                          <h2 className="text-2xl font-bold mb-2">
                            {registration.event.title}
                          </h2>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="inline-flex items-center gap-2 px-2 py-1 rounded border text-xs">
                            <Ticket className="w-4 h-4" />
                            <span>{registration.ticketIssued ? 'Ticket Issued' : 'Pending Ticket'}</span>
                          </div>
                          <div className="text-xs">
                            {registration.isVerified ? (
                              <span className="px-2 py-1 rounded bg-green-100 text-green-700">Payment Verified</span>
                            ) : (
                              <span className="px-2 py-1 rounded bg-orange-100 text-orange-700">Payment Pending</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <p className="font-medium">
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
                          <MapPin className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-medium">{registration.event.location}</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                        {registration.event.description}
                      </p>

                      {/* Registration details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="text-sm space-y-1">
                          <p><span className="text-muted-foreground">Name:</span> {registration.fullName}</p>
                          <p><span className="text-muted-foreground">Email:</span> {registration.email}</p>
                          <p><span className="text-muted-foreground">Phone:</span> {registration.phone}</p>
                          <p><span className="text-muted-foreground">Address:</span> {registration.address}</p>
                        </div>
                        {registration.paymentScreenshot && (
                          <div className="text-sm">
                            <p className="font-medium mb-2">Payment Screenshot</p>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={registration.paymentScreenshot} alt="Payment" className="w-full max-h-40 object-contain border rounded" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground">
                          Registered on {new Date(registration.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2">
                          {registration.ticketIssued && (
                            <Link
                              href={`/user/tickets/${registration.id}`}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              View Ticket
                            </Link>
                          )}
                          <Link
                            href={`/events/${registration.event.id}`}
                            className="text-primary hover:underline text-sm font-medium"
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
