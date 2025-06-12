'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Download, Mail, Calendar, MapPin, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentData {
  paymentId?: string;
  amount?: string;
  currency?: string;
  status?: string;
  transactionDate?: string;
  paymentMethod?: string;
  signature?: string;
}

interface InsuranceData {
  quote?: {
    totalPremium?: number;
    currency?: string;
  };
  trip_start_date?: string;
  trip_end_date?: string;
  trip_countries?: string[];
  travellers?: Array<{
    first_name?: string;
    last_name?: string;
  }>;
  emergency_medical_coverage?: string;
  personal_accident_coverage_level?: string;
  transit_coverage?: string;
  submittedAt?: string;
  invoiceNumber?: string;

}

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [insuranceData, setInsuranceData] = useState<InsuranceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get payment data from URL params (Flywire return URL format)
    const reference = searchParams.get('reference');
    const status = searchParams.get('status');
    const amount = searchParams.get('amount');
    const paymentMethod = searchParams.get('payment_method');
    const sig = searchParams.get('sig');

    // Also check for custom params (from onPaymentSuccess callback)
    const paymentId = searchParams.get('paymentId');
    const currency = searchParams.get('currency');

    if (reference || paymentId) {
      setPaymentData({
        paymentId: reference || paymentId || 'demo-payment-123',
        amount: amount || '1234.56',
        currency: currency || 'EUR',
        status: status === 'success' ? 'completed' : (status || 'completed'),
        transactionDate: new Date().toISOString(),
        paymentMethod: paymentMethod || 'credit_card',
        signature: sig || ''
      });

      // Update localStorage with payment completion if we have a reference
      if (reference && status === 'success') {
        try {
          const stored = localStorage.getItem('insuranceFormData');
          if (stored) {
            const parsed = JSON.parse(stored);
            const submissions = Array.isArray(parsed) ? parsed : [parsed];
            const lastIndex = submissions.length - 1;
            
            if (lastIndex >= 0) {
              submissions[lastIndex] = {
                ...submissions[lastIndex],
                paymentStatus: 'completed',
                paymentReference: reference,
                paymentMethod: paymentMethod,
                paidAt: new Date().toISOString()
              };
              localStorage.setItem('insuranceFormData', JSON.stringify(submissions));
            }
          }
        } catch (error) {
          console.error('Error updating payment status:', error);
        }
      }
    }

    // Get insurance data from localStorage
    try {
      const stored = localStorage.getItem('insuranceFormData');
      if (stored) {
        const parsed = JSON.parse(stored);
        const submissions = Array.isArray(parsed) ? parsed : [parsed];
        const latestSubmission = submissions[submissions.length - 1];
        setInsuranceData(latestSubmission);
      }
    } catch (error) {
      console.error('Error loading insurance data:', error);
    }

    setLoading(false);
  }, [searchParams]);

  const handleDownloadPolicy = () => {
    // In a real app, this would generate and download a PDF policy
    alert('Policy document will be sent to your email shortly.');
  };

  const handleEmailPolicy = () => {
    // In a real app, this would trigger email sending
    alert('Policy document has been sent to your registered email address.');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number | string, currency: string = 'USD') => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(numAmount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your travel insurance policy has been purchased successfully. 
            You&apos;re now protected for your upcoming journey!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Shield className="h-6 w-6 text-green-600 mr-3" />
              Payment Details
            </h2>
            
            <div className="space-y-4">
              {paymentData?.paymentId && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Payment Reference:</span>
                  <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                    {paymentData.paymentId}
                  </span>
                </div>
              )}

              {paymentData?.paymentMethod && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">
                    {paymentData.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="text-2xl font-bold text-[#1A2C50]">
                  {paymentData?.amount && paymentData?.currency 
                    ? formatCurrency(paymentData.amount, paymentData.currency)
                    : insuranceData?.quote?.totalPremium 
                      ? formatCurrency(insuranceData.quote.totalPremium, insuranceData.quote.currency || 'USD')
                      : '$1,234.56'
                  }
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Transaction Date:</span>
                <span className="font-medium">
                  {formatDate(paymentData?.transactionDate || new Date().toISOString())}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Status:</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Completed
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <Button
                onClick={handleDownloadPolicy}
                type="button"
                className="w-full px-8 py-3 text-base bg-[#1A2C50] hover:bg-[#2c3e6b] text-white"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Policy Document
              </Button>
              
              <Button
                onClick={handleEmailPolicy}
                type="button" variant="outline"
                className="w-full px-8 py-3 text-base"
              >
                <Mail className="h-5 w-5 mr-2" />
                Email Policy to Me
              </Button>
            </div>
          </div>

          {/* Trip Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="h-6 w-6 text-[#1A2C50] mr-3" />
              Trip Summary
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Travel Dates
                </div>
                <div className="text-lg font-medium">
                  {formatDate(insuranceData?.trip_start_date || '')} - {formatDate(insuranceData?.trip_end_date || '')}
                </div>
              </div>
              
              <div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  Destination
                </div>
                <div className="text-lg font-medium">
                  {insuranceData?.trip_countries?.[0] || 'International'}
                </div>
              </div>
              
              <div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Users className="h-4 w-4 mr-2" />
                  Travelers
                </div>
                <div className="text-lg font-medium">
                  {insuranceData?.travellers?.length || 1} Traveler(s)
                  {insuranceData?.travellers?.[0] && (
                    <div className="text-sm text-gray-500 mt-1">
                      Primary: {insuranceData.travellers[0].first_name} {insuranceData.travellers[0].last_name}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <div className="text-gray-600 mb-3">Coverage Details:</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Medical Coverage:</span>
                    <span className="font-medium">
                      €{insuranceData?.emergency_medical_coverage || '00'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Personal Accident:</span>
                    <span className="font-medium">
                      €{insuranceData?.personal_accident_coverage_level || '00'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Transit Coverage:</span>
                    <span className="font-medium">
                      €{insuranceData?.transit_coverage || '00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-[#1A2C50] rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-4">
            Important Information
          </h3>
          <div className="space-y-3 text-white">
            <p>• Your policy is effective immediately and covers you for the specified travel dates.</p>
            <p>• Policy documents will be sent to your registered email address within 24 hours.</p>
            <p>• For claims or emergencies, contact our 24/7 helpline at +1-800-TRAVEL-HELP.</p>
            <p>• Keep your policy number handy during your travels.</p>
            <p>• Review the policy terms and conditions sent to your email.</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button
            onClick={() => router.push('/')}type="button"
                className="px-8 py-3 text-base bg-[#1A2C50] hover:bg-[#2c3e6b] text-white"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}