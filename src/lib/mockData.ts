import type { 
  Club, 
  Player, 
  TrainingLog, 
  NetAllocation, 
  MatchRecord, 
  StadiumTier, 
  FinancialRecord, 
  StaffMember, 
  CalendarEvent, 
  CricketRecord 
} from '../types/database';

export const fallbackClub: Club = {
  id: 'Unassigned',
  name: 'Awaiting Club Import',
  manager: 'Manager',
  region: 'Unassigned',
  division_fc: '—',
  division_od: '—',
  division_t20: '—',
  fan_club_members: 0,
  fan_mood: '—',
  sponsor_confidence: '—',
  morale: '—',
  bank_balance: 0,
  weekly_wage_bill: 0,
  stadium_name: 'Unassigned Ground',
  stadium_capacity: 0,
  form_avg: '—',
  coach_quality: '—',
  its_points: 0
};

// 100% Fresh Slate: All collections start completely empty awaiting real Battrick ingestion
export const fallbackSquad: Player[] = [];
export const fallbackNets: NetAllocation[] = [];
export const fallbackStaff: StaffMember[] = [];
export const fallbackCalendar: CalendarEvent[] = [];
export const fallbackRecords: CricketRecord[] = [];
export const fallbackTrainingLogs: TrainingLog[] = [];
export const fallbackMatches: MatchRecord[] = [];
export const fallbackFinances: FinancialRecord[] = [];
export const fallbackStadiumTiers: StadiumTier[] = [];
