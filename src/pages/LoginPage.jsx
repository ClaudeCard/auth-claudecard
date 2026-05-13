import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const RETURN_SITES = {
  claudecard:     'https://claudecard.pro',
  granny_frannies:'https://grannyfrannies.com',
  savvy_scuba:    'https://savvyscuba.com',
  sweet_stone:    'https://sweetstone.com',
};

export default function LoginPage() {
  const params   = new URLSearchParams(window.location.search);
  const returnTo = params.get('return_to') || 'https://claudecard.pro';

  const [mode, setMode]       = useState('signin');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [msg, setMsg]         = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(''); setMsg('');

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message === 'Invalid login credentials' ? 'Incorrect email or password.' : error.message); setLoading(false); return; }
      window.location.href = returnTo;

    } else if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      if (!data.session) { setMsg('Check your email to confirm your account, then sign in.'); setMode('signin'); }
      else window.location.href = returnTo;

    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `https://auth.claudecard.pro/reset?return_to=${encodeURIComponent(returnTo)}`,
      });
      if (error) { setError(error.message); } else { setMsg('Reset email sent — check your inbox.'); setMode('signin'); }
    }

    setLoading(false);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `https://auth.claudecard.pro/callback?return_to=${encodeURIComponent(returnTo)}` },
    });
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.logo}>Claude<span style={{ color: '#C6A05A' }}>Card</span></div>
        <p style={S.sub}>
          {mode === 'signin' ? 'Sign in to your Passport' :
           mode === 'signup' ? 'Create your Passport' : 'Reset your password'}
        </p>

        {error && <p style={S.err}>{error}</p>}
        {msg   && <p style={S.ok}>{msg}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <input type="email" placeholder="Email address" value={email}
            onChange={e => setEmail(e.target.value)} required style={S.inp} />
          {mode !== 'forgot' && (
            <input type="password" placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)} required style={S.inp} />
          )}
          <button type="submit" disabled={loading} style={S.btn}>
            {loading ? '…' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Email'}
          </button>
        </form>

        {mode === 'signin' && (
          <button onClick={handleGoogle} style={S.google}>
            <svg width="16" height="16" viewBox="0 0 48 48" style={{ marginRight: '0.5rem' }}>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.16C6.51 42.62 14.62 48 24 48z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.16C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.16C12.43 13.72 17.74 9.5 24 9.5z"/>
            </svg>
            Continue with Google
          </button>
        )}

        <div style={S.links}>
          {mode === 'signin' && <>
            <button onClick={() => { setMode('signup'); setError(''); setMsg(''); }} style={S.link}>Create account →</button>
            <button onClick={() => { setMode('forgot'); setError(''); setMsg(''); }} style={{ ...S.link, color: 'rgba(104,116,142,0.6)' }}>Forgot password?</button>
          </>}
          {mode !== 'signin' && (
            <button onClick={() => { setMode('signin'); setError(''); setMsg(''); }} style={S.link}>← Back to sign in</button>
          )}
        </div>

        <p style={S.footer}>
          Signing in connects your rewards across ClaudeCard, Granny Frannie's, Savvy Scuba, and every world that joins next.
        </p>
      </div>
    </div>
  );
}

const S = {
  page:   { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F7FC', padding: '2rem', fontFamily: 'DM Sans, system-ui, sans-serif' },
  card:   { width: '100%', maxWidth: '420px', background: '#fff', padding: '2.5rem', boxShadow: '0 4px 32px rgba(12,16,35,0.08)' },
  logo:   { fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 700, color: '#0C1023', marginBottom: '0.25rem' },
  sub:    { fontSize: '0.85rem', color: '#68748E', marginBottom: '1.75rem', marginTop: 0 },
  inp:    { border: '1px solid rgba(80,100,160,0.25)', padding: '0.85rem 1rem', fontSize: '0.88rem', color: '#0C1023', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' },
  btn:    { background: '#0C1023', color: '#F5F0E8', border: 'none', padding: '0.9rem', fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', marginTop: '0.25rem' },
  google: { width: '100%', marginTop: '0.75rem', padding: '0.8rem', border: '1px solid rgba(80,100,160,0.2)', background: '#fff', color: '#0C1023', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' },
  links:  { display: 'flex', justifyContent: 'space-between', marginTop: '1rem' },
  link:   { background: 'none', border: 'none', color: '#68748E', cursor: 'pointer', fontSize: '0.78rem', padding: 0, fontFamily: 'inherit' },
  err:    { fontSize: '0.8rem', color: '#C04040', background: '#FEF2F2', padding: '0.6rem 0.75rem', marginBottom: '0.75rem' },
  ok:     { fontSize: '0.8rem', color: '#166534', background: '#F0FDF4', padding: '0.6rem 0.75rem', marginBottom: '0.75rem' },
  footer: { fontSize: '0.72rem', color: 'rgba(104,116,142,0.6)', marginTop: '1.5rem', lineHeight: 1.6, textAlign: 'center' },
};
