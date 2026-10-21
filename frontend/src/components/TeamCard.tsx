import { Link } from 'react-router-dom';
import type { TeamSummary } from '../types';
import { gradeRange } from '../grades';

export default function TeamCard({ team }: { team: TeamSummary }) {
  const place = [team.city, team.state].filter(Boolean).join(', ');
  const grades = gradeRange(team.minGrade, team.maxGrade);
  return (
    <article className="card team-card">
      <div className="team-card-head">
        <div>
          <h3><Link to={`/teams/${team.id}`}>{team.name}</Link></h3>
          <p className="muted small">
            {team.teamNumber && <>#{team.teamNumber} · </>}
            {team.type === 'COMMUNITY' ? 'Community team' : 'School team'}
            {place && <> · {place}</>}
            {team.distanceMiles != null && <> · <strong>{team.distanceMiles} mi</strong></>}
          </p>
        </div>
        {team.hasOpenApplication ? <span className="badge badge-green">Applications open</span>
          : team.recruiting ? <span className="badge badge-blue">Recruiting</span> : null}
      </div>
      <div className="chips">
        {team.programs.map(p => <span key={p} className="chip">{p}</span>)}
        {grades && <span className="chip chip-outline">{grades}</span>}
      </div>
      {team.blurb && <p className="blurb">{team.blurb}</p>}
      <div className="card-actions">
        <Link to={`/teams/${team.id}`} className="btn btn-secondary">Details</Link>
        {team.hasOpenApplication && <Link to={`/apply/${team.id}`} className="btn btn-primary">Apply</Link>}
        {!team.hasOpenApplication && team.joinUrl && (
          <a href={team.joinUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">How to join</a>
        )}
        {team.websiteUrl && (
          <a href={team.websiteUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Website</a>
        )}
      </div>
    </article>
  );
}
