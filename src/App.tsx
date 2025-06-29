import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import Notes from '@/pages/Notes';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <Router>
      <Routes>
        {!session ? (
          <Route path="*" element={<Login />} />
        ) : (
          <>
            <Route path="/" element={<Index />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
