'use client'

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Mail, Phone, MapPin, Calendar, Ticket, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  paymentScreenshot: string | null;
  isVerified: boolean;
  ticketIssued: boolean;
  createdAt: string;
  user: {
    username: string;
    email: string;
  };
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  isPaid: boolean;
  price: number | null;
}

import { use } from 'react';

export default function EventRegistrationsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string>('');
  const [showScreenshot, setShowScreenshot] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get(`/organizer/events/${resolvedParams.eventId}`);
      setEvent(res.data);
      setRegistrations(res.data.registrations || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams.eventId]);

  const handleVerify = async (registrationId: string) => {
    try {
      await api.put(`/organizer/events/${resolvedParams.eventId}/registrations/${registrationId}`, {
        isVerified: true,
      });
      toast.success('Payment verified successfully');
      fetchData();
    } catch (error) {
      console.error('Error verifying:', error);
      toast.error('Failed to verify payment');
    }
  };

  const handleIssueTicket = async (registrationId: string) => {
    try {
      await api.put(`/organizer/events/${resolvedParams.eventId}/registrations/${registrationId}`, {
        ticketIssued: true,
      });
      toast.success('Ticket issued successfully');
      fetchData();
    } catch (error) {
      console.error('Error issuing ticket:', error);
      toast.error('Failed to issue ticket');
    }
  };

  const viewScreenshot = (screenshot: string) => {
    setSelectedScreenshot(screenshot);
    setShowScreenshot(true);
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!event) {
    return <div className="p-10">Event not found</div>;
  }

  return (
    <div className="p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
        <div className="flex gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(event.date).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {event.location}
          </span>
          <span className="font-semibold">
            {event.isPaid ? `₹${event.price}` : 'Free Event'}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Registrations ({registrations.length})
        </h2>
      </div>

      {registrations.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-slate-500">No registrations yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <Card key={reg.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{reg.fullName}</CardTitle>
                    <CardDescription>
                      Registered on {new Date(reg.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {reg.isVerified ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-600">
                        <XCircle className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                    {reg.ticketIssued ? (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Ticket className="w-3 h-3 mr-1" />
                        Ticket Issued
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        No Ticket
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span>{reg.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span>{reg.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span>{reg.address}</span>
                    </div>
                  </div>

                  {event.isPaid && reg.paymentScreenshot && (
                    <div className="border rounded-md p-4">
                      <p className="text-sm font-semibold mb-2">Payment Screenshot</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewScreenshot(reg.paymentScreenshot!)}
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Screenshot
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  {!reg.isVerified && event.isPaid && (
                    <Button
                      onClick={() => handleVerify(reg.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Payment
                    </Button>
                  )}
                  {reg.isVerified && !reg.ticketIssued && (
                    <Button
                      onClick={() => handleIssueTicket(reg.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Ticket className="w-4 h-4 mr-2" />
                      Issue Ticket
                    </Button>
                  )}
                  {!event.isPaid && !reg.ticketIssued && (
                    <Button
                      onClick={() => handleIssueTicket(reg.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Ticket className="w-4 h-4 mr-2" />
                      Issue Ticket
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showScreenshot} onOpenChange={setShowScreenshot}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Screenshot</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {selectedScreenshot && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={selectedScreenshot}
                alt="Payment Screenshot"
                className="max-w-full max-h-[70vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
