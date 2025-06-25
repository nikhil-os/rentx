'use client';
// booking/page.js
// Booking page route for /booking

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import BookingForm from "@/components/booking/BookingForm";
// import ChatbotWidget from "@/components/homepage/ChatbotWidget";

// Client component that uses search params
function BookingContent() {
  const searchParams = useSearchParams();
  const rentalId = searchParams.get('rentalId');
  
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-16">
      <BookingForm rentalId={rentalId} />
    </div>
  );
}

export default function BookingPage() {
  return (
    <main className="bg-[#F8F1E9] min-h-screen flex flex-col justify-between">
      <Suspense fallback={<div className="flex items-center justify-center h-96">Loading...</div>}>
        <BookingContent />
      </Suspense>
      {/* <ChatbotWidget /> */}
    </main>
  );
}
