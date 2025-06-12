'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const invoice = searchParams.get('invoice');

  let title = "Payment Status";
  let message = "Your payment status will be updated.";

  if (status === 'success') {
    title = "Payment Successful!";
    message = `Thank you for your payment. ${invoice ? `Your invoice number is: ${invoice}.` : ''} You will receive a confirmation email shortly.`;
  } else if (status === 'pending') {
    title = "Payment Pending";
    message = `Your payment is currently being processed. ${invoice ? `Invoice number: ${invoice}.` : ''} We will notify you once the status updates.`;
  } else if (status === 'failure' || status === 'cancelled') {
    title = "Payment Failed or Cancelled";
    message = `There was an issue with your payment, or it was cancelled. ${invoice ? `Reference invoice number: ${invoice}.` : ''} Please try again or contact support.`;
  }


  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif' }}>
      <h1>{title}</h1>
      <p>{message}</p>
      <Link href="/" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
        Go to Homepage
      </Link>
    </div>
  );
}

export default function InsuranceFormConfirmationPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}