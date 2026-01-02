'use client'

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(3, 'Location is required'),
  categoryId: z.string().min(1, 'Category is required'),
  totalSlots: z.string().min(1, 'Total slots is required'),
  isPaid: z.boolean(),
  price: z.string().optional(),
  paymentQR: z.string().optional(),
  imageUrl: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface Category {
  id: string;
  name: string;
}

export default function CreateEventPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [qrPreview, setQrPreview] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingQR, setUploadingQR] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [qrObjectUrl, setQrObjectUrl] = useState<string>('');
  const [imageObjectUrl, setImageObjectUrl] = useState<string>('');
  const router = useRouter();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      location: '',
      categoryId: '',
      totalSlots: '',
      isPaid: false,
      price: '',
      paymentQR: '',
      imageUrl: '',
    },
  });

  const isPaid = form.watch('isPaid');

  useEffect(() => {
    return () => {
      if (qrObjectUrl) URL.revokeObjectURL(qrObjectUrl);
      if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
    };
  }, [qrObjectUrl, imageObjectUrl]);

  const uploadToPublic = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post(`/upload?folder=${encodeURIComponent(folder)}`, formData);
    return res.data?.url as string;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (qrObjectUrl) URL.revokeObjectURL(qrObjectUrl);
    const localPreview = URL.createObjectURL(file);
    setQrObjectUrl(localPreview);
    setQrPreview(localPreview);

    setUploadingQR(true);
    try {
      const url = await uploadToPublic(file, 'payment-qr');
      setQrPreview(url);
      form.setValue('paymentQR', url, { shouldValidate: true, shouldDirty: true });
    } catch (error) {
      console.error('QR upload failed:', error);
      toast.error('Failed to upload QR code');
      setQrPreview('');
      form.setValue('paymentQR', '', { shouldValidate: true, shouldDirty: true });
    } finally {
      setUploadingQR(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
    const localPreview = URL.createObjectURL(file);
    setImageObjectUrl(localPreview);
    setImagePreview(localPreview);

    setUploadingImage(true);
    try {
      const url = await uploadToPublic(file, 'events');
      setImagePreview(url);
      form.setValue('imageUrl', url, { shouldValidate: true, shouldDirty: true });
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Failed to upload event image');
      setImagePreview('');
      form.setValue('imageUrl', '', { shouldValidate: true, shouldDirty: true });
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: EventFormValues) => {
    setLoading(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        date: new Date(data.date).toISOString(),
        location: data.location,
        categoryId: data.categoryId,
        totalSlots: parseInt(data.totalSlots),
        isPaid: data.isPaid,
        price: data.isPaid ? parseFloat(data.price || '0') : null,
        paymentQR: data.isPaid ? data.paymentQR : null,
        imageUrl: data.imageUrl || null,
      };

      console.log('Submitting event:', payload);
      const res = await api.post('/organizer/events', payload);
      console.log('Event created:', res.data);
      toast.success('Event created successfully!');
      router.push('/organizer/events');
    } catch (error: unknown) {
      console.error('Error creating event:', error);
      const err = error as { response?: { data?: { error?: string } } };
      const message = err.response?.data?.error || 'Failed to create event';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 tracking-tight">Create New Event</h1>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
              <FormField
                control={form.control}
                name="imageUrl"
                render={() => (
                  <FormItem>
                    <FormLabel>Event Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/20 transition-colors hover:bg-muted/30">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label htmlFor="image-upload" className="cursor-pointer block">
                            {imagePreview ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={imagePreview}
                                alt="Event Preview"
                                className="max-w-full max-h-64 mx-auto object-cover rounded-lg border bg-background"
                              />
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <Upload className="w-11 h-11 text-muted-foreground/70 mb-1" />
                                <p className="text-sm text-foreground">
                                  {uploadingImage ? 'Uploading...' : 'Click to upload event image'}
                                </p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP</p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Enter event description"
                        className="w-full min-h-28 p-3 border rounded-md bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          {...field}
                        >
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalSlots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Slots</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isPaid"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between border p-4 rounded-md bg-card">
                    <div>
                      <FormLabel>Paid Event</FormLabel>
                      <p className="text-sm text-muted-foreground">Is this a paid event?</p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {isPaid && (
                <>
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ticket Price (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentQR"
                    render={() => (
                      <FormItem>
                        <FormLabel>Payment QR Code</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/20 transition-colors hover:bg-muted/30">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleQRUpload}
                                className="hidden"
                                id="qr-upload"
                              />
                              <label htmlFor="qr-upload" className="cursor-pointer block">
                                {qrPreview ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img
                                    src={qrPreview}
                                    alt="QR Preview"
                                    className="max-w-xs mx-auto border rounded-lg bg-background"
                                  />
                                ) : (
                                  <div className="flex flex-col items-center gap-1">
                                    <Upload className="w-11 h-11 text-muted-foreground/70 mb-1" />
                                    <p className="text-sm text-foreground">
                                      {uploadingQR ? 'Uploading...' : 'Click to upload QR code'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP</p>
                                  </div>
                                )}
                              </label>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
