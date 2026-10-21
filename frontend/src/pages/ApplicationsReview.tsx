import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import type { Application, ApplicationStatus } from '../types';
import { gradeLabel } from '../grades';
import { ErrorBox, StatusBadge } from '../components/Common';

const DECISIONS: ApplicationStatus[] = ['SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'WAITLISTED', 'DECLINED'];

export default function ApplicationsReview() {
  const { teamId } = useParams();
  const [apps, setApps] = useState<Application[] | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Application[]>(`/api/my/teams/${teamId}/applications`).then(a => {
      setApps(a);
      if (a.length) setSelected(a[0].id);
    }).catch(e => setError(e.message));
  }, [teamId]);

  const current = apps?.find(a => a.id === selected) ?? null;
  useEffect(() => { setNotes(current?.teamNotes ?? ''); }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const shown = useMemo(() => (apps ?? []).filter(a => !filter || a.status === filter), [apps, filter]);

  async function decide(status: ApplicationStatus) {
    if (!current) return;
    try {
      const updated = await api<Application>(`/api/my/teams/${teamId}/applications/${current.id}`, {
        method: 'PATCH', body: { status, teamNotes: notes },
      });
      setApps(list => list!.map(a => (a.id === updated.id ? updated : a)));
    } catch (e) { setError((e as Error).message); }
  }

  function exportCsv() {
    if (!apps?.length) return;
    const qs = Array.from(new Set(apps.flatMap(a => a.answers.map(x => x.prompt))));
    const esc = (s: unknown) => `"${String(s ?? '').replace(/"/g, '""')}"`;
    const rows = [['Name', 'Email', 'Parent email', 'Grade', 'Status', 'Submitted', ...qs].map(esc).join(',')];
    for (const a of apps) {
      rows.push([a.studentName, a.studentEmail, a.parentEmail, a.grade == null ? '' : gradeLabel(a.grade), a.status, a.submittedAt,
        ...qs.map(q => a.answers.find(x => x.prompt === q)?.response ?? '')].map(esc).join(','));
    }
    const url = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'applications.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container">
      <p><Link to="/manage">← My teams</Link></p>
      <div className="team-card-head">
        <h1>Applicants</h1>
        <div className="row-actions">
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All ({apps?.length ?? 0})</option>
            {[...DECISIONS, 'WITHDRAWN'].map(s => <option key={s} value={s}>{s.replace('_', ' ').toLowerCase()}</option>)}
          </select>
          <button className="btn btn-secondary" onClick={exportCsv} disabled={!apps?.length}>Export CSV</button>
        </div>
      </div>
      <ErrorBox error={error} />
      {apps && apps.length === 0 && <div className="card"><p>No applications yet. Make sure your application is open and share your team page!</p></div>}
      {apps && apps.length > 0 && (
        <div className="review-layout">
          <ul className="applicant-list">
            {shown.map(a => (
              <li key={a.id}>
                <button className={a.id === selected ? 'on' : ''} onClick={() => setSelected(a.id)}>
                  <span><strong>{a.studentName}</strong><br /><span className="small muted">Grade {a.grade == null ? '?' : gradeLabel(a.grade)}</span></span>
                  <StatusBadge status={a.status} />
                </button>
              </li>
            ))}
          </ul>
          {current && (
            <div className="card">
              <div className="team-card-head">
                <div>
                  <h2>{current.studentName}</h2>
                  <p className="muted small">
                    <a href={`mailto:${current.studentEmail}`}>{current.studentEmail}</a>
                    {current.parentEmail && <> · Parent: <a href={`mailto:${current.parentEmail}`}>{current.parentEmail}</a></>}
                    {' · '}Grade {current.grade == null ? '?' : gradeLabel(current.grade)}
                    {current.submittedAt && <> · {new Date(current.submittedAt).toLocaleDateString()}</>}
                  </p>
                </div>
                <StatusBadge status={current.status} />
              </div>
              {current.answers.map(a => (
                <div key={a.questionId} className="answer-view"><h4>{a.prompt}</h4><p className="pre">{a.response || <em className="muted">(no answer)</em>}</p></div>
              ))}
              {current.status !== 'WITHDRAWN' ? (
                <>
                  <label className="field"><span>Private notes (only your team sees these)</span>
                    <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} /></label>
                  <div className="card-actions">
                    <button className="btn btn-ghost" onClick={() => decide('UNDER_REVIEW')}>Mark reviewing</button>
                    <button className="btn btn-ghost" onClick={() => decide('WAITLISTED')}>Waitlist</button>
                    <button className="btn btn-ghost danger" onClick={() => decide('DECLINED')}>Decline</button>
                    <button className="btn btn-primary" onClick={() => decide('ACCEPTED')}>Accept</button>
                  </div>
                  <p className="small muted">Students see the status on their dashboard. Reach out by email with next steps.</p>
                </>
              ) : <p className="muted">The student withdrew this application.</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
