'use client'

import { useState, useEffect } from 'react';
import Header from '@/components/components/header';
import Footer from '@/components/components/footer';
import Link from 'next/link';
import { Tag } from 'lucide-react';
import axios from 'axios';

interface Category {
  id: string;
  name: string;
  _count: {
    events: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Event Categories</h1>
            <p className="text-slate-600">Browse events by category</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl h-32 animate-pulse"></div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.id}`}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-500 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Tag className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{category.name}</h3>
                      <p className="text-sm text-slate-600">{category._count.events} events</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Tag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No categories available</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
