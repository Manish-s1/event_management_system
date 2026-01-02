"use client";

import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";

export interface EventCardProps {
  id: string;
  title: string;
  date: string | Date;
  location: string;
  isPaid: boolean;
  price?: number | null;
  availableSlots: number;
  categoryName?: string;
  imageUrl?: string | null;
}

export default function EventCard(props: EventCardProps) {
  const {
    id,
    title,
    date,
    location,
    isPaid,
    price,
    availableSlots,
    categoryName,
    imageUrl,
  } = props;

  const d = new Date(date);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 relative flex items-center justify-center bg-slate-100">
        {imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageUrl}
            alt={title}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-r from-blue-500 to-purple-600" />
        )}
      </div>
      <div className="p-6">
        {categoryName ? (
          <div className="text-xs font-semibold text-blue-600 mb-2">
            {categoryName}
          </div>
        ) : null}
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>{d.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users className="w-4 h-4" />
            <span>{availableSlots} slots available</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-4 h-4 text-slate-600">Rs</span>
            {isPaid ? (
              <span className="text-slate-900 font-semibold">{price ?? 0}</span>
            ) : (
              <span className="text-green-700 font-semibold">Free</span>
            )}
          </div>
        </div>

        <Link
          href={`/events/${id}`}
          className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          View Details & Register
        </Link>
      </div>
    </div>
  );
}
