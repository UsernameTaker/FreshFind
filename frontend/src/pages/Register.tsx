import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth';
import type { Role } from '../types';
import { ErrorBox } from '../components/Common';
import { homeFor, safeNext } from './Login';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [role, setRole] = useState<Role>(params.get('role') === 'TEAM' ? 'TEAM' : 'STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const u = await register({ email, password, name, role, ageConfirmed });
      nav(safeNext(params.get('next')) ?? (u.role === 'STUDENT' ? '/profile?welcome=1' : homeFor(u.role)));
    } catch (err) { setError((err as Error).message); } finally { setBusy(false); }
  }

  return (
    <div className="container auth-box">
      <form className="card" onSubmit={submit}>
        <h1>Create an account</h1>
        <div className="segmented" role="radiogroup">
          <button type="button" className={role === 'STUDENT' ? 'on' : ''} onClick={() => setRole('STUDENT')}>I'm a student</button>
          <button type="button" className={role === 'TEAM' ? 'on' : ''} onClick={() => setRole('TEAM')}>I run a team</button>
        </div>
        <ErrorBox error={error} />
        <label className="field"><span>{role === 'TEAM' ? 'Your name (coach / team lead)' : 'Your name'}</span>
          <input required maxLength={100} value={name} onChange={e => setName(e.target.value)} /></label>
        <label className="field"><span>Email</span>
          <input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label className="field"><span>Password <em className="muted">(8+ characters)</em></span>
          <input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} /></label>
        {role === 'STUDENT' && (
          <label className="check">
            <input type="checkbox" checked={ageConfirmed} onChange={e => setAgeConfirmed(e.target.checked)} required />
            I'm 13 or older, or a parent/guardian is creating this account with me.
          </label>
        )}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
        <p className="small muted">Already have one? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
