'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { TEMPLATES } from '@/components/templates';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  return (
    <div className="p-8">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* User Info */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="font-semibold">User Details</h2>
        <p>Email: {user?.email}</p>
        <p>ID: {user?.id}</p>
      </div>

      {/* Templates */}
      <div>
        <h2 className="font-semibold mb-3">Resume Templates</h2>

        <div className="grid grid-cols-3 gap-4">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="border p-4 rounded hover:shadow cursor-pointer"
            >
              <h3 className="font-bold">{template.name}</h3>
              <p className="text-sm">{template.description}</p>

              <button
                className="mt-2 bg-black text-white px-3 py-1 rounded"
                onClick={() => {
                  window.location.href = `/editor?template=${template.id}`;
                }}
              >
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}