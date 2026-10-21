export type Role = 'STUDENT' | 'TEAM' | 'ADMIN';
export type TeamType = 'COMMUNITY' | 'SCHOOL';
export type QuestionType = 'SHORT_TEXT' | 'LONG_TEXT' | 'MULTIPLE_CHOICE';
export type ApplicationStatus =
  | 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'WAITLISTED' | 'DECLINED' | 'WITHDRAWN';

export interface User {
  id: number; email: string; name: string; role: Role;
  grade: number | null; zip: string | null; parentEmail: string | null;
}

export interface TeamSummary {
  id: number; name: string; teamNumber: string | null; type: TeamType; programs: string[];
  city: string | null; state: string | null; zip: string | null; distanceMiles: number | null;
  minGrade: number | null; maxGrade: number | null; recruiting: boolean; claimed: boolean;
  websiteUrl: string | null; joinUrl: string | null; hasOpenApplication: boolean; blurb: string | null;
}

export interface FormSummary {
  acceptingApplications: boolean; title: string; deadline: string | null;
  eligibleGrades: number[]; questionCount: number;
}

export interface TeamDetail {
  id: number; name: string; teamNumber: string | null; type: TeamType; programs: string[];
  description: string | null; schoolName: string | null; city: string | null; state: string | null; zip: string | null;
  websiteUrl: string | null; websiteAutoFound: boolean; websiteStatus: string;
  websiteTitle: string | null; websiteDescription: string | null; joinUrl: string | null;
  contactEmail: string | null; meetingInfo: string | null; costInfo: string | null;
  minGrade: number | null; maxGrade: number | null; recruiting: boolean; claimed: boolean;
  source: 'SELF' | 'IMPORTED'; form: FormSummary | null;
}

export interface TeamUpsert {
  name: string; teamNumber: string; type: TeamType; programs: string[]; description: string;
  schoolName: string; city: string; state: string; zip: string; websiteUrl: string; contactEmail: string;
  meetingInfo: string; costInfo: string; minGrade: number | null; maxGrade: number | null; recruiting: boolean;
}

export interface Question {
  id: number | null; prompt: string; helpText: string | null; type: QuestionType;
  required: boolean; wordLimit: number | null; options: string | null;
}

export interface Form {
  id: number | null; teamId: number; teamName: string; title: string; intro: string | null;
  open: boolean; acceptingApplications: boolean; deadline: string | null;
  eligibleGrades: number[]; questions: Question[];
}

export interface Answer { questionId: number; prompt: string; response: string; }

export interface Application {
  id: number; teamId: number; teamName: string; status: ApplicationStatus; grade: number | null;
  parentEmail: string | null; answers: Answer[]; createdAt: string; updatedAt: string; submittedAt: string | null;
  studentName: string; studentEmail: string; teamNotes: string | null;
}

export interface Claim {
  id: number; teamId: number; teamName: string; userName: string; userEmail: string;
  message: string | null; status: string; createdAt: string;
}

export interface JobStatus {
  name: string | null; running: boolean; startedAt: string | null; finishedAt: string | null; summary: string;
}
