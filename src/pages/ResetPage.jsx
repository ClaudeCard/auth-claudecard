import { useState, useEffect } from 'react';
import { supabase, initialHash } from '../lib/supabaseClient';

export default function ResetPage() {
  const params   = new URLSearchParams(window.location.search);
  const returnTo = params.get('return_to') || 'https://claudecard.pro';

  const [ready, setReady]       = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [done, setDone]         = useState(false);

  useEffect(() => {
    // Check initialHash (captured before Supabase clears it) or listen for event
    const hash = new URLSearchParams(initialHash.replace('#', ''));
    if (hash.get('type') === 'recovery') { setReady(true); return; }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setDone(true);
    setTimeout(() => window.location.href = returnTo, 2000);
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.logo}>Claude<span style={{ color: '#C6A05A' }}>Card</span></div>

        {done ? (
          <p style={{ color: '#166534', fontSize: '0.9rem' }}>Password updated. Redirecting you back…</p>
        ) : !ready ? (
          <p style={{ color: '#68748E', fontSize: '0.85rem' }}>Verifying your reset link…</p>
        ) : (
          <>
            <p style={S.sub}>Set a new password</p>
            {error && <p style={S.err}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <input type="password" placeholder="New password (min 6 characters)"
                value={password} onChange={e => setPassword(e.target.value)}
                required autoFocus style={S.inp} />
              <button type="submit" disabled={loading} style={S.btn}>
                {loading ? '…' : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F7FC', padding: '2rem', fontFamily: 'DM Sans, system-ui, sans-serif' },
  card: { width: '100%', maxWidth: '420px', background: '#fff', padding: '2.5rem', boxShadow: '0 4px 32px rgba(12,16,35,0.08)' },
  logo: { fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 700, color: '#0C1023', marginBottom: '0.25rem' },
  sub:  { fontSize: '0.85rem', color: '#68748E', marginBottom: '1.25rem', marginTop: 0 },
  inp:  { border: '1px solid rgba(80,100,160,0.25)', padding: '0.85rem 1rem', fontSize: '0.88rem', color: '#0C1023', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' },
  btn:  { background: '#0C1023', color: '#F5F0E8', border: 'none', padding: '0.9rem', fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' },
  err:  { fontSize: '0.8rem', color: '#C04040', background: '#FEF2F2', padding: '0.6rem 0.75rem', marginBottom: '0.75rem' },
};
