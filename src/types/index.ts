export type Role = 'Admin' | 'Recruiter' | 'Hiring Manager';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  photoURL?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Contract';
  status: 'Active' | 'Draft' | 'Closed' | 'Archived';
  applicantsCount: number;
  createdAt: string;
  hiringManager: string;
  priority: 'Critical' | 'High' | 'Medium';
  targetDate: string;
  description: string;
  jdQuality?: 'Good' | 'Average' | 'Bad';
  weights?: Record<string, number>;
  skillsRequired?: string[];
  experienceRequired?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  jobId: string;
  jobTitle: string;
  status: 'Applied' | 'Matched' | 'Assessment Pending' | 'Assessment Completed' | 'Shortlisted' | 'Interviewing' | 'Offered' | 'Hired';
  matchScore: number;
  appliedDate: string;
  source: 'LinkedIn' | 'Referral' | 'Campus' | 'Careers Site';
  location: string;
  skills: string[];
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  interviewer: string;
  stage: 'Recruiter Screen' | 'Technical' | 'Hiring Manager' | 'Culture';
  scheduledAt: string;
  mode: 'Video' | 'On-site';
  status: 'Scheduled' | 'Feedback Due' | 'Completed';
}

export interface CampusDrive {
  id: string;
  institution: string;
  role: string;
  date: string;
  registrations: number;
  shortlisted: number;
  owner: string;
  status: 'Planning' | 'Live' | 'Completed';
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  channel: 'Email' | 'Slack' | 'In-app';
  audience: Role | 'All';
  status: 'Draft' | 'Scheduled' | 'Sent';
  sendAt: string;
}
