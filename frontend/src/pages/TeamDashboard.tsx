import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { TeamDetail } from '../types';
import { ErrorBox } from '../components/Common';

export default function TeamDashboard() {
  const [teams, setTeams] = useState<TeamDetail[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { api<TeamDetail[]>('/api/my/teams').then(setTeams).catch(e => setError(e.message)); }, []);

  return (
    <div className="container narrow">
      <div className="team-card-head">
        <h1>My teams</h1>
        <Link to="/manage/new" className="btn btn-primary">+ Add a team</Link>
      </div>
      <ErrorBox error={error} />
      {teams && teams.length === 0 && (
        <div className="card">
          <p>You don't manage any teams yet.</p>
          <p className="small muted">Already listed? <Link to="/">Search for your team</Link> and click “Claim this team”. Otherwise, add it as a new team.</p>
        </div>
      )}
      {teams?.map(t => (
        <div className="card" key={t.id}>
          <div className="team-card-head">
            <div>
              <h3><Link to={`/teams/${t.id}`}>{t.name}</Link></h3>
              <p className="muted small">{t.programs.join(', ') || 'No programs set'} · {[t.city, t.state].filter(Boolean).join(', ')}</p>
            </div>
            {t.form?.acceptingApplications ? <span className="badge badge-green">Applications open</span>
              : <span className="badge badge-gray">Applications closed</span>}
          </div>
          <div className="card-actions">
            <Link className="btn btn-secondary" to={`/manage/${t.id}/profile`}>Edit profile</Link>
            <Link className="btn btn-secondary" to={`/manage/${t.id}/form`}>{t.form ? 'Edit application' : 'Build application'}</Link>
            <Link className="btn btn-primary" to={`/manage/${t.id}/applications`}>Review applicants</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
