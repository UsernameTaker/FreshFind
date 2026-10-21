import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';
import type { User } from '../types';
import { ErrorBox, GradeSelect } from '../components/Common';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [params] = useSearchParams();
  const [name, setName] = useState(user!.name);
  const [grade, setGrade] = useState<number | null>(user!.grade);
  const [zip, setZip] = useState(user!.zip ?? '');
  const [parentEmail, setParentEmail] = useState(user!.parentEmail ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const student = user!.role === 'STUDENT';

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    try {
      const u = await api<User>('/api/auth/me', { method: 'PUT', body: { name, grade, zip, parentEmail: parentEmail || null } });
      setUser(u);
      setSaved(true);
    } catch (err) { setError((err as Error).message); }
  }

  return (
    <div className="container auth-box">
      <form className="card" onSubmit={submit}>
        <h1>{params.get('welcome') ? 'Welcome! 👋' : 'Your profile'}</h1>
        {params.get('welcome') && <p className="muted">Add your ZIP and grade so we can show you nearby teams (optional).</p>}
        <ErrorBox error={error} />
        {saved && <div className="alert alert-ok">Saved. <Link to="/">Find teams →</Link></div>}
        <p className="small muted">{user!.email} · {user!.role.toLowerCase()} account</p>
        <label className="field"><span>Name</span><input required value={name} onChange={e => setName(e.target.value)} /></label>
        {student && (
          <>
            <label className="field"><span>Grade</span><GradeSelect value={grade} onChange={setGrade} placeholder="Prefer not to say" /></label>
            <label className="field"><span>ZIP code</span>
              <input inputMode="numeric" maxLength={5} value={zip} onChange={e => setZip(e.target.value.replace(/\D/g, ''))} /></label>
            <label className="field"><span>Parent/guardian email <em className="muted">(needed to apply)</em></span>
              <input type="email" value={parentEmail} onChange={e => setParentEmail(e.target.value)} /></label>
          </>
        )}
        <button className="btn btn-primary">Save</button>
      </form>
    </div>
  );
}
