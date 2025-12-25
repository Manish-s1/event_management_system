'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/components/header';
import Footer from '@/components/components/footer';

export default function UserProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="h-10 w-48 bg-slate-200 animate-pulse rounded"></div>
              <div className="bg-white rounded-lg shadow p-8 space-y-4 border border-slate-200">
                <div className="h-6 bg-slate-200 animate-pulse rounded"></div>
                <div className="h-6 bg-slate-200 animate-pulse rounded"></div>
                <div className="h-6 bg-slate-200 animate-pulse rounded"></div>
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

  const user = session.user!;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <div className="bg-white rounded-lg shadow-lg p-8 border border-slate-200">
              <div className="space-y-6">
                <div className="flex items-start gap-4 pb-6 border-b">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold">{user.name}</h2>
                    <p className="text-slate-600">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Role</p>
                      <p className="font-medium capitalize">{(user.role || '').toLowerCase()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Account Status</p>
                      <p className="font-medium">
                        {user.isVerified ? (
                          <span className="text-green-600">Verified</span>
                        ) : (
                          <span className="text-amber-600">Pending Verification</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Link
                    href="/user/tickets"
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors"
                  >
                    View My Tickets
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
