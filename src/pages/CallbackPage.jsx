import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function CallbackPage() {
  const params   = new URLSearchParams(window.location.search);
  const returnTo = params.get('return_to') || 'https://claudecard.pro';

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        window.location.href = returnTo;
      }
    });

    // Also check for an existing session (in case event already fired)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) window.location.href = returnTo;
    });
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F7FC', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
      <p style={{ color: '#68748E', fontSize: '0.9rem' }}>Completing sign in…</p>
    </div>
  );
}
