'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [health, setHealth] = useState<string>('Checking...');

  useEffect(() => {
    fetch('http://localhost:8000/health')
      .then((res) => res.json())
      .then((data) => setHealth(data.message))
      .catch((err) => setHealth('Failed to connect to backend'));
  }, []);

  return (
    <main className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>Dashboard Page</h1>
      <p>Basic UI Placeholder</p>
      
      <div className='mt-8 p-4 border rounded bg-slate-50 text-slate-800'>
        <h2 className='font-semibold'>Backend Connectivity Test:</h2>
        <p>{health}</p>
      </div>
    </main>
  );
}
