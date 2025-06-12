'use client';

import React, { useState } from 'react';

export default function SendTestPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Sending email...');
    try {
      const res = await fetch('/api/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, policyNumber, startDate, endDate }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✅ Email sent successfully!');
      } else {
        setMessage(`❌ Failed: ${data.message}`);
        console.error('API error message:', data.message);
      }
    } catch (error) {
      setMessage('❌ Network or unexpected error');
      console.error('Fetch error:', error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Send Test Email</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem' }}>
        <input
          required
          type="email"
          placeholder="Recipient Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          required
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          required
          type="text"
          placeholder="Policy Number"
          value={policyNumber}
          onChange={e => setPolicyNumber(e.target.value)}
        />
        <input
          required
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <input
          required
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
        <button type="submit">Send Email</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
