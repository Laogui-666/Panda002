'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export default function CanadaVisaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-morandi-cream to-morandi-blush">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="bg-white rounded-3xl shadow-lg py-12 px-8 mb-6 text-center">
          <div className="text-6xl mb-4">🇨🇦</div>
          <h1 className="text-3xl font-bold text-morandi-deep mb-4">加拿大签证申请表</h1>
          <p className="text-morandi-mist mb-8">加拿大签证申请功能正在完善中，敬请期待...</p>
          
          <div className="flex justify-center gap-4">
            <Link 
              href="/services/visa/schengen"
              className="px-6 py-3 bg-morandi-ocean text-white rounded-xl font-medium hover:bg-morandi-ocean/90 transition-all"
            >
              试试申根签证
            </Link>
            <Link 
              href="/services/visa"
              className="px-6 py-3 bg-morandi-mist/10 text-morandi-deep rounded-xl font-medium hover:bg-morandi-mist/20 transition-all"
            >
              返回签证服务
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
