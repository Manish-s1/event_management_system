'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { Calendar, MapPin, Users, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/components/header';
import Footer from '@/components/components/footer';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  totalSlots: number;
  availableSlots: number;
  isPaid?: boolean;
  price?: number | null;
  paymentQR?: string | null;
  category: {
    id: string;
    name: string;
  };
  organizer?: {
    id: string;
    username: string;
  };
  createdAt: string;
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${resolvedParams.id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [resolvedParams.id]);

  useEffect(() => {
    // Prefill email/name from session if available
    if (session?.user) {
      // @ts-expect-error next-auth user shape may vary
      setFullName(session.user.name || '');
      // @ts-expect-error next-auth user shape may vary
      setEmail(session.user.email || '');
    }
  }, [session]);

  const handleBookTicket = async () => {
    if (status === 'unauthenticated') {
      router.push(`/auth/login?callbackUrl=/events/${resolvedParams.id}`);
      return;
    }

    try {
      setBooking(true);
      let paymentScreenshot: string | undefined;
      if (event?.isPaid && screenshot) {
        paymentScreenshot = await fileToBase64(screenshot);
      }
      await api.post(`/events/${resolvedParams.id}/register`, {
        paymentScreenshot,
        fullName,
        email,
        phone,
        address,
      });
      alert('Registration submitted!');
      router.push('/user/tickets');
    } catch (error: unknown) {
      console.error('Error booking ticket:', error);
      // @ts-expect-error dynamic error shape
      alert(error?.response?.data?.error || 'Failed to register');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <div className="h-10 w-3/4 bg-muted animate-pulse rounded"></div>
            <div className="h-6 w-1/2 bg-muted animate-pulse rounded"></div>
            <div className="h-64 bg-muted animate-pulse rounded"></div>
          </div>
        </main>
        </div>
        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Event not found</h1>
            <Link href="/events" className="text-primary hover:underline">
              Back to Events
            </Link>
          </div>
        </main>
        </div>
        <Footer />
      </>
    );
  }

  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();
  const isSoldOut = event.availableSlots === 0;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
            {/* Event Banner Image */}
            {event.imageUrl && (
              <div className="w-full max-w-5xl mx-auto px-4 pt-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-auto max-h-96 object-contain rounded-lg border bg-slate-100"
                />
              </div>
            )}
              <div className="mb-6">
                <Link
                  href="/events"
                  className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Events
                </Link>
              </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Tag className="w-4 h-4" />
                  <span>{event.category.name}</span>
                </div>
                <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">
                      {eventDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {eventDate.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Available Slots</p>
                    <p className="font-semibold">
                      {event.availableSlots} / {event.totalSlots}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
                {event.organizer && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Organized by <span className="font-medium">{event.organizer.username}</span>
                  </p>
                )}
              </div>

              {!isPastEvent && !isSoldOut && (
                <div className="border-t pt-8 space-y-4">
                  <h2 className="text-2xl font-semibold">Book Your Slot</h2>

                  {/* Registration Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="98XXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Address</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="City, Street"
                      />
                    </div>
                  </div>

                  {event.isPaid ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">This is a paid event.</p>
                      {event.paymentQR && (
                        <div>
                          <p className="text-sm font-medium mb-2">Scan QR to pay</p>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={event.paymentQR} alt="Payment QR" className="w-48 h-48 object-contain border rounded" />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium mb-2">Upload payment screenshot</label>
                        <input type="file" accept="image/*" onChange={(e) => setScreenshot(e.target.files?.[0] || null)} />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-green-700">This event is free</p>
                  )}

                  <button
                    onClick={handleBookTicket}
                    disabled={booking || (event.isPaid && !screenshot) || !fullName || !email}
                    className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {booking ? 'Booking...' : status === 'unauthenticated' ? 'Login to Book' : 'Register'}
                  </button>
                  {status === 'unauthenticated' && (
                    <p className="text-sm text-muted-foreground">
                      You need to login to register
                    </p>
                  )}
                </div>
              )}

              {isPastEvent && (
                <div className="border-t pt-8">
                  <p className="text-center text-muted-foreground">
                    This event has already passed
                  </p>
                </div>
              )}

              {isSoldOut && !isPastEvent && (
                <div className="border-t pt-8">
                  <p className="text-center text-destructive font-semibold">
                    This event is sold out
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      </div>
      <Footer />
    </>
  );
}
