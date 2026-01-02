'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { Calendar, MapPin, User, Mail, Phone, MapPin as AddressIcon, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
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

export default function TicketDetailPage({ params }: { params: Promise<{ registrationId: string }> }) {
  const resolvedParams = use(params);
  const { status } = useSession();
  const router = useRouter();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    const fetchRegistration = async () => {
      try {
        const response = await api.get(`/user/registrations/${resolvedParams.registrationId}`);
        setRegistration(response.data);
      } catch (error) {
        console.error('Error fetching registration:', error);
        router.push('/user/tickets');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchRegistration();
    }
  }, [status, router, resolvedParams.registrationId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="h-10 w-48 bg-slate-200 animate-pulse rounded mx-auto mb-4"></div>
            <div className="h-32 w-full bg-slate-200 animate-pulse rounded"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!registration) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Ticket not found</h1>
            <Link href="/user/tickets" className="text-blue-600 hover:underline">
              Back to Tickets
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const eventDate = new Date(registration.event.date);
  const ticketNumber = `TKT-${registration.id.substring(0, 8).toUpperCase()}`;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="max-w-2xl mx-auto px-4">
          {/* Non-print controls */}
          <div className="print:hidden mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <Link
              href="/user/tickets"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tickets
            </Link>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Print/Download
            </button>
          </div>

          {/* Ticket Card - Printable */}
          <div
            id="ticket-print-area"
            className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden print:shadow-none"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Event Ticket</h1>
                  <p className="text-blue-100 text-sm">{ticketNumber}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  Admit One
                </span>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-8 space-y-6">
              {/* Event Info */}
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-slate-900">{registration.event.title}</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {registration.event.category.name}
                  </span>
                </div>
              </div>

              {/* Event Details Grid */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 border-y border-dashed border-slate-200 py-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Date & Time</p>
                      <p className="text-lg font-semibold">
                        {eventDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-slate-600">
                        {eventDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Location</p>
                      <p className="text-lg font-semibold">{registration.event.location}</p>
                    </div>
                  </div>
                </div>

                {/* Attendee Info */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Attendee Name</p>
                      <p className="text-lg font-semibold">{registration.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
                      <p className="text-sm">{registration.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-slate-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="font-medium">{registration.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AddressIcon className="w-5 h-5 text-slate-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">Address</p>
                    <p className="font-medium">{registration.address}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 line-clamp-3">{registration.event.description}</p>
              </div>

              {/* Footer Info */}
              <div className="border-t border-slate-200 pt-4 text-center text-sm text-slate-600">
                <p className="mb-2">Registered on {new Date(registration.createdAt).toLocaleDateString()}</p>
                <p className="text-xs">Please show this ticket at the event entrance</p>
              </div>
            </div>

            {/* QR Code Placeholder
            <div className="bg-slate-50 p-8 text-center border-t">
              <div className="inline-block w-32 h-32 bg-white border-2 border-slate-300 rounded p-2">
                <div className="w-full h-full bg-slate-200 rounded flex items-center justify-center">
                  <p className="text-xs text-slate-500 text-center">Ticket ID:<br />{registration.id.substring(0, 12)}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2">Scan this for quick entry</p>
            </div> */}
          </div>
        </div>
      </div>
      <Footer />

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 12mm;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Print ONLY the ticket card */
          body * {
            visibility: hidden;
          }
          #ticket-print-area,
          #ticket-print-area * {
            visibility: visible;
          }
          #ticket-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
