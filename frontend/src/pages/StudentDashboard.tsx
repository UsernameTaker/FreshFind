import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { Application } from '../types';
import { ErrorBox, StatusBadge } from '../components/Common';

export default function StudentDashboard() {
  const [apps, setApps] = useState<Application[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => api<Application[]>('/api/applications').then(setApps).catch(e => setError(e.message));
  useEffect(() => { load(); }, []);

  async function withdraw(id: number) {
    if (!confirm('Withdraw this application? You can re-apply while applications are open.')) return;
    try { await api(`/api/applications/${id}/withdraw`, { method: 'POST' }); load(); }
    catch (e) { setError((e as Error).message); }
  }

  return (
    <div className="container narrow">
      <h1>My applications</h1>
      <ErrorBox error={error} />
      {apps && apps.length === 0 && <p>No applications yet. <Link to="/">Find a team →</Link></p>}
      {apps?.map(a => (
        <div className="card row-card" key={a.id}>
          <div>
            <h3><Link to={`/teams/${a.teamId}`}>{a.teamName}</Link></h3>
            <p className="muted small">
              {a.submittedAt ? `Submitted ${new Date(a.submittedAt).toLocaleDateString()}` : `Last saved ${new Date(a.updatedAt).toLocaleDateString()}`}
            </p>
          </div>
          <div className="row-actions">
            <StatusBadge status={a.status} />
            {(a.status === 'DRAFT' || a.status === 'WITHDRAWN') && <Link className="btn btn-primary" to={`/apply/${a.teamId}`}>{a.status === 'DRAFT' ? 'Continue' : 'Re-apply'}</Link>}
            {['SUBMITTED', 'UNDER_REVIEW', 'WAITLISTED'].includes(a.status) && (
              <><Link className="btn btn-ghost" to={`/apply/${a.teamId}`}>View</Link>
                <button className="btn btn-ghost" onClick={() => withdraw(a.id)}>Withdraw</button></>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
