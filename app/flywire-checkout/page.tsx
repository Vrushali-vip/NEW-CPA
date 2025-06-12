// 'use client';

// import { useEffect, Suspense } from 'react'; // Added Suspense
// import Script from 'next/script';
// import { useSearchParams } from 'next/navigation'; // To read query params

// // This component will extract params and call the main logic
// function FlywireCheckoutContent() {
//   const searchParams = useSearchParams();

//   // Extract parameters from URL
//   const firstName = searchParams.get('firstName') || 'Payer'; // Default values if not provided
//   const lastName = searchParams.get('lastName') || 'Name';
//   const email = searchParams.get('email') || 'payer@example.com';
//   const amountString = searchParams.get('amount');
//   const invoiceNumber = searchParams.get('invoiceNumber') || `INV-${Date.now()}`;

//   const amount = amountString ? parseFloat(amountString) : 0; // Convert amount to number

//   useEffect(() => {
//     const handlePayment = () => {
//       if (typeof window !== 'undefined' && window.FlywirePayment) {
//         // Basic check for amount
//         if (amount <= 0) {
//           alert('Invalid payment amount. Cannot proceed.');
//           // Optionally redirect or show a more permanent error
//           // window.location.href = '/payment-error'; // Example
//           return;
//         }

//         const config = {
//           // Provider code needs to be set here or passed if it's dynamic
//           // For now, assuming it's static within your Flywire setup or you'll add it
//           // provider: 'YOUR_FLYWIRE_PROVIDER_CODE', // IMPORTANT: You need to set this
//           amount: amount, // Use the amount from URL
//           currency: 'EUR', // Assuming EUR, change if needed
//           description: `Payment for Invoice ${invoiceNumber}`,
//           payer: {
//             firstName: firstName,
//             lastName: lastName,
//             email: email,
//             phone: '+44 1234 567 890', // From your original code
//             address: '10, Downing St.', // From your original code
//             city: 'London', // From your original code
//             state: '',
//             zip: 'SW1A',
//             country: 'GB',
//           },
//           metadata: {
//             invoiceNumber: invoiceNumber,
//             bookingReference: `BR-${Date.now()}`, // Example
//           },
//           // IMPORTANT: Update with your actual domain and success/failure pages
//           redirectUrl: `${window.location.origin}/insurance-form-confirmation?status=success&invoice=${invoiceNumber}`, // Example redirect

//           form: {
//             requestPayerInfo: true,
//             requestRecipientInfo: true,
//             skipCompletedSteps: true,
//           },

//           validation: {
//             onInvalidInput: function (errors: Array<{field: string, msg: string}>) {
//               errors.forEach((error) => alert(error.msg));
//             },
//           },

//           callback: {
//             callbackId: invoiceNumber, // Use a unique ID like invoice number
//             callbackUrl: 'https://api.yourdomain.com/flywire-notifications', // Your backend notification URL
//             callbackVersion: '2',
//           },

//           paymentOptionsConfig: {
//             sort: [
//               { currency: ['local', 'foreign'] },
//               { amount: 'asc' },
//               { type: ['bank_transfer', 'credit_card', 'online'] },
//             ],
//             filters: {
//               type: ['credit_card', 'bank_transfer', 'online', 'direct_debit'],
//               currency: [],
//             },
//           },

//           communication: {
//             payerEmailNotifications: true,
//             showLiveChat: true,
//           },
//         };

//         const modal = window.FlywirePayment.initiate(config);
//         modal.render();
//       } else {
//         // Retry if Flywire SDK isn't loaded yet
//         // console.log("FlywirePayment SDK not found, retrying...");
//         setTimeout(handlePayment, 200);
//       }
//     };

//     // Call handlePayment once the component mounts and Flywire script is expected to be loaded
//     handlePayment();

//   }, [firstName, lastName, email, amount, invoiceNumber]); // Dependencies for useEffect

//   return (
//     <>
//       <Script
//         src="https://checkout.flywire.com/flywire-payment.js"
//         strategy="afterInteractive"
//         onLoad={() => {
//           // console.log('Flywire script loaded, effect will attempt to initiate.');
//         }}
//         onError={(e) => {
//           console.error('Error loading Flywire script:', e);
//           alert('Failed to load payment gateway. Please try again later.');
//         }}
//       />
//       {/* You can add a loading message here if desired */}
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
//         <p style={{ fontSize: '18px' }}>Loading Payment Gateway...</p>
//       </div>
//     </>
//   );
// }


// export default function FlywireCheckoutPage() {
//   return (
//     // Suspense is good practice when using useSearchParams
//     <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><p>Loading...</p></div>}>
//       <FlywireCheckoutContent />
//     </Suspense>
//   );
// }


'use client';

import { useEffect, Suspense, useState, useMemo } from 'react'; // Added useMemo
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';

function FlywireCheckoutContent() {
  const searchParams = useSearchParams();
  const [paramsLoaded, setParamsLoaded] = useState(false);

  // Memoize derived params to stabilize useEffect dependencies
  const firstName = useMemo(() => searchParams.get('firstName'), [searchParams]);
  const lastName = useMemo(() => searchParams.get('lastName'), [searchParams]);
  const email = useMemo(() => searchParams.get('email'), [searchParams]);
  const amountString = useMemo(() => searchParams.get('amount'), [searchParams]);
  const invoiceNumberFromUrl = useMemo(() => searchParams.get('invoiceNumber'), [searchParams]);

  const amount = useMemo(() => (amountString ? parseFloat(amountString) : 0), [amountString]);
  const invoiceNumber = useMemo(() =>
    (invoiceNumberFromUrl && invoiceNumberFromUrl.trim() !== ""
      ? invoiceNumberFromUrl
      : `INV-FW-${Date.now()}`), // Fallback invoice number
    [invoiceNumberFromUrl]
  );

  useEffect(() => {
    if (searchParams.has('amount') && searchParams.has('firstName')) {
      if (!paramsLoaded) {
        console.log("[FlywireCheckout] Essential searchParams detected. Marking params as loaded.");
        setParamsLoaded(true);
      }
    }
  }, [searchParams, paramsLoaded]);

  useEffect(() => {
    if (!paramsLoaded) {
      console.log("[FlywireCheckout] Waiting for params to be confirmed loaded before initiating payment.");
      return;
    }

    console.log("[FlywireCheckout] Params confirmed loaded. Proceeding with payment initiation logic.");
    console.log("[FlywireCheckout] Current Params Values:", { firstName, lastName, email, amount, invoiceNumber });

    const handlePayment = () => {
      if (typeof window !== 'undefined' && window.FlywirePayment) {
        console.log("[FlywireCheckout] Flywire SDK (window.FlywirePayment) found.");

        // --- Parameter Validation ---
        if (!firstName || firstName.trim() === "" ||
            !lastName || lastName.trim() === "" ||
            !email || email.trim() === "" || !/^\S+@\S+\.\S+$/.test(email)) {
          const errorMsg = 'Payer information (First Name, Last Name, valid Email) from URL is missing or invalid. Unable to proceed.';
          console.error("[FlywireCheckout] VALIDATION FAILED - Payer Core Info:", { firstName, lastName, email });
          alert(errorMsg);
          return;
        }

        if (amount <= 0) {
          const errorMsg = 'Invalid payment amount. Cannot proceed.';
          console.error("[FlywireCheckout] VALIDATION FAILED - Amount:", amount);
          alert(errorMsg);
          return;
        }
        // --- End Parameter Validation ---

        // --- Payer Object Construction ---
        // Uses dynamic first/last/email from URL, static address/phone from your Flywire snippet
        const payerDetails = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: '+44 1234 567 890', // From your Flywire snippet
          address: '10, Downing St.',  // From your Flywire snippet
          city: 'London',             // From your Flywire snippet
          state: '',                  // From your Flywire snippet (empty)
          zip: 'SW1A',                // From your Flywire snippet
          country: 'GB',              // From your Flywire snippet
        };
        console.log("[FlywireCheckout] PAYER object for Flywire config:", payerDetails);
        // --- End Payer Object Construction ---

        // --- Flywire Configuration - Based on YOUR Flywire Snippet ---
        const config = {
          // NO 'provider' key, as per your snippet
          amount: amount, // Essential: Assuming this is a top-level property
          currency: 'EUR', // Essential: Assuming EUR. Change if your snippet implies otherwise or if dynamic.

          payer: payerDetails,

          metadata: { // From your Flywire snippet, invoiceNumber made dynamic
            invoiceNumber: invoiceNumber,
            bookingReference: `BR-${Date.now()}`, // Or use a dynamic booking ref if you have one
          },
          // IMPORTANT: Replace 'yourdomain.com' with your actual domain, even for testing locally if needed
          redirectUrl: `https://yourdomain.com/confirmation?invoice=${invoiceNumber}`, // From your snippet, added dynamic invoice for tracking

          form: { // From your Flywire snippet
            requestPayerInfo: true,
            requestRecipientInfo: true, // If this is not needed, set to false
            skipCompletedSteps: true,
          },

          validation: { // From your Flywire snippet
            onInvalidInput: function (errors: Array<{field?: string, msg: string}>) { // Added field as optional
              console.error("[FlywireCheckout] FLYWIRE onInvalidInput:", errors);
              errors.forEach((error) => alert(error.msg));
            },
          },

          callback: { // From your Flywire snippet, callbackId made dynamic
            callbackId: invoiceNumber, // Using dynamic invoiceNumber for better tracking
            // IMPORTANT: Replace with your actual API endpoint
            callbackUrl: 'https://api.yourdomain.com/flywire-notifications',
            callbackVersion: '2',
          },

          paymentOptionsConfig: { // From your Flywire snippet
            sort: [
              { currency: ['local', 'foreign'] },
              { amount: 'asc' },
              { type: ['bank_transfer', 'credit_card', 'online'] },
            ],
            filters: {
              type: ['credit_card', 'bank_transfer', 'online', 'direct_debit'],
              currency: [],
            },
          },

          communication: { // From your Flywire snippet
            payerEmailNotifications: true,
            showLiveChat: true,
          },
        };
        console.log("[FlywireCheckout] FULL Flywire config to be initiated (NO PROVIDER KEY):", JSON.stringify(config, null, 2));
        // --- End Flywire Configuration ---

        // --- Flywire Initiation and Rendering ---
        try {
          console.log("[FlywireCheckout] Attempting to call window.FlywirePayment.initiate()...");
          const modal = window.FlywirePayment.initiate(config);
          console.log("[FlywireCheckout] window.FlywirePayment.initiate() called. Modal object:", modal);

          if (modal && typeof modal.render === 'function') {
            console.log("[FlywireCheckout] Modal object seems valid. Attempting to call modal.render()...");
            modal.render();
            console.log("[FlywireCheckout] Flywire modal.render() called successfully (no immediate synchronous error).");
          } else {
            const errorMsg = "Payment gateway could not be properly initialized (Flywire's initiate() did not return a valid modal object with a render method). Please ensure your account is correctly set up with Flywire.";
            console.error("[FlywireCheckout] INIT FAILED - Invalid Modal Object:", modal);
            alert(errorMsg);
          }
        } catch (e) {
          const errorMsg = "A critical error occurred while trying to set up the payment gateway during initiate/render.";
          console.error("[FlywireCheckout] CRITICAL ERROR during Flywire initiate/render:", e);
          alert(errorMsg + " Check console for details.");
        }
        // --- End Flywire Initiation and Rendering ---

      } else {
        console.log("[FlywireCheckout] window.FlywirePayment not found. Retrying in 250ms...");
        setTimeout(handlePayment, 250);
      }
    };

    handlePayment();

  }, [paramsLoaded, firstName, lastName, email, amount, invoiceNumber]);

  return (
    <>
      <Script
        src="https://checkout.flywire.com/flywire-payment.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('[FlywireCheckout] External Flywire script (flywire-payment.js) LOADED successfully.');
        }}
        onError={(e) => {
          console.error('[FlywireCheckout] CRITICAL ERROR loading external Flywire script (flywire-payment.js):', e);
          alert('Failed to load payment gateway script. Please check your internet connection or contact support.');
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial, sans-serif', padding: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px' }}>Loading Secure Payment Gateway... <br/> If this message persists for more than a few seconds, please check the browser console for errors</p>
      </div>
    </>
  );
}

export default function FlywireCheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
        <p style={{ fontSize: '18px' }}>Loading Payment Page...</p>
      </div>
    }>
      <FlywireCheckoutContent />
    </Suspense>
  );
}