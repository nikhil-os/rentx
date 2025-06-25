// Payment page route for /Payment
'use client';
import { Suspense } from 'react';
import PaymentSection from '@/components/payment/PaymentSection';

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-[#F8F1E9]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-700"></div>
    </div>}>
      <PaymentSection />
    </Suspense>
  );
}
