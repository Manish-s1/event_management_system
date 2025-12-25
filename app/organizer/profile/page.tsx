'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User, Mail, Lock, Save } from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
}

export default function OrganizerProfilePage() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile edit state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (session) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/user/profile');
      console.log('Profile response:', res.data);
      setProfile(res.data);
      setUsername(res.data.username);
      setEmail(res.data.email);
    } catch (error: unknown) {
      console.error('Error fetching profile:', error);
      const err = error as { response?: { data?: { error?: string } } };
      const message = err.response?.data?.error || 'Failed to load profile';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put('/user/profile', {
        username,
        email,
      });
      
      toast.success('Profile updated successfully');
      await update();
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSaving(true);

    try {
      await api.post('/user/profile', {
        oldPassword,
        newPassword,
      });

      toast.success('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password. Check your old password.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-10">Profile not found</div>;
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Role: </span>
                  <span className="font-semibold text-blue-600">{profile.role}</span>
                </div>
                <div>
                  <span className="text-slate-600">Status: </span>
                  <span className={`font-semibold ${profile.isVerified ? 'text-green-600' : 'text-orange-600'}`}>
                    {profile.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              </div>

              <Button type="submit" disabled={saving} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <Label htmlFor="oldPassword">Current Password</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <Button type="submit" disabled={saving} className="w-full">
                <Lock className="w-4 h-4 mr-2" />
                {saving ? 'Changing...' : 'Change Password'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-slate-600">Account ID:</span>
                <span className="font-mono text-xs">{profile.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-slate-600">Account Type:</span>
                <span className="font-semibold">{profile.role}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Verification Status:</span>
                <span className={profile.isVerified ? 'text-green-600' : 'text-orange-600'}>
                  {profile.isVerified ? '✓ Verified' : '⏳ Pending'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
