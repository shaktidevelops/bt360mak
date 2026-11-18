/**
 * BT360MAK - battrickData.js
 * Default club data, skill definitions, pitch tactics, and initial state.
 */

const BT_DATA = {
  club: {
    id: '94120',
    name: 'Mak Lions CC',
    manager: 'Shakti Mak',
    division: 'Division II.3',
    fanClub: '1,420 members',
    fanMood: 'High Flying 🚀',
    bankBalance: 850000,
    weeklyWageBill: 171800,
    stadiumName: 'Lions Den Arena',
    stadiumCapacity: 18000,
    formAvg: 'Superb',
    trainingPopsSeason: 6,
    coachQuality: 'Sensational (Level 15)'
  },

  skillsHierarchy: [
    'nonexistent', 'abysmal', 'woeful', 'feeble', 'mediocre',
    'competent', 'respectable', 'proficient', 'strong', 'superb',
    'quality', 'remarkable', 'wonderful', 'exceptional', 'sensational',
    'exquisite', 'masterclass', 'miraculous', 'legendary', 'mythical',
    'titanic', 'ethereal', 'divine'
  ],

  pitchTypes: {
    'Hard': {
      label: 'Hard Pitch',
      desc: 'Significant bounce and pace. Heavily favors express fast and fast-medium bowlers. High scores if batsmen possess high concentration.',
      bowlerBonus: { 'Fast': '+25%', 'FastMedium': '+15%', 'Medium': '-5%', 'Spin': '-15%' },
      colorClass: 'hard'
    },
    'Green': {
      label: 'Green Pitch',
      desc: 'Abundant seam movement and swing. Ideal conditions for swing and seamers. Batsmen will struggle against early movement.',
      bowlerBonus: { 'Fast': '+10%', 'FastMedium': '+30%', 'Medium': '+20%', 'Spin': '-30%' },
      colorClass: 'green'
    },
    'Dusty': {
      label: 'Dusty Pitch',
      desc: 'Dry, abrasive surface offering sharp turn and variable bounce. Heaven for finger and wrist spinners; hostile for quicks.',
      bowlerBonus: { 'Fast': '-25%', 'FastMedium': '-20%', 'Medium': '-10%', 'Spin': '+40%' },
      colorClass: 'dusty'
    },
    'Slow': {
      label: 'Slow Pitch',
      desc: 'Low bounce and slow pace. Fast bowlers lose sting; medium pacers, cutters, and slow bowlers thrive with disciplined lines.',
      bowlerBonus: { 'Fast': '-20%', 'FastMedium': '-10%', 'Medium': '+20%', 'Spin': '+15%' },
      colorClass: 'slow'
    },
    'Flat': {
      label: 'Flat Highway',
      desc: 'True and even bounce. Heavy advantage to batsmen. Bowlers must rely on stamina and exceptional consistency to break through.',
      bowlerBonus: { 'Fast': '-5%', 'FastMedium': '-5%', 'Medium': '-5%', 'Spin': '+5%' },
      colorClass: 'flat'
    },
    'Uneven': {
      label: 'Uneven Pitch',
      desc: 'Unpredictable, erratic bounce. Dangerous conditions; aids all bowling styles, especially tight disciplined spells.',
      bowlerBonus: { 'Fast': '+20%', 'FastMedium': '+15%', 'Medium': '+10%', 'Spin': '+25%' },
      colorClass: 'uneven'
    }
  },

  squad: [
    {
      id: 'BT-91024',
      name: 'Rohit Sharma',
      age: 24,
      wage: 28500,
      hand: 'RHB',
      bowlingType: 'None',
      batting: 'Sensational',
      bowling: 'Feeble',
      keeping: 'Feeble',
      fielding: 'Superb',
      consistency: 'Remarkable',
      concentration: 'Wonderful',
      stamina: 'Superb',
      form: 'Superb',
      fatigue: 'Revived',
      leadership: 'Proficient',
      experience: 'Remarkable',
      bti: 184500,
      subskill: '15.4',
      activeNet: 'Batting (2)',
      marketValue: 4200000,
      role: 'Opening Batsman'
    },
    {
      id: 'BT-84920',
      name: 'Jasprit Bumrah',
      age: 23,
      wage: 31200,
      hand: 'RHB',
      bowlingType: 'Fast',
      batting: 'Feeble',
      bowling: 'Sensational',
      keeping: 'Abysmal',
      fielding: 'Wonderful',
      consistency: 'Sensational',
      concentration: 'Competent',
      stamina: 'Superb',
      form: 'Blissful',
      fatigue: 'Energized',
      leadership: 'Competent',
      experience: 'Wonderful',
      bti: 192000,
      subskill: '15.7',
      activeNet: 'Bowling (2)',
      marketValue: 4800000,
      role: 'Opening Strike Bowler'
    },
    {
      id: 'BT-77412',
      name: 'Virat Kohli',
      age: 26,
      wage: 42000,
      hand: 'RHB',
      bowlingType: 'RM',
      batting: 'Exquisite',
      bowling: 'Feeble',
      keeping: 'Abysmal',
      fielding: 'Exceptional',
      consistency: 'Masterclass',
      concentration: 'Miraculous',
      stamina: 'Remarkable',
      form: 'Superb',
      fatigue: 'Rested',
      leadership: 'Exceptional',
      experience: 'Sensational',
      bti: 248000,
      subskill: '16.2',
      activeNet: 'None',
      marketValue: 6500000,
      role: 'Anchor Batsman (C)'
    },
    {
      id: 'BT-63201',
      name: 'Rishabh Pant',
      age: 22,
      wage: 19400,
      hand: 'LHB',
      bowlingType: 'None',
      batting: 'Exceptional',
      bowling: 'Abysmal',
      keeping: 'Wonderful',
      fielding: 'Proficient',
      consistency: 'Proficient',
      concentration: 'Strong',
      stamina: 'Proficient',
      form: 'Superb',
      fatigue: 'Revived',
      leadership: 'Respectable',
      experience: 'Proficient',
      bti: 132000,
      subskill: '14.3',
      activeNet: 'Keeping (1)',
      marketValue: 2900000,
      role: 'Wicketkeeper Batsman'
    },
    {
      id: 'BT-54819',
      name: 'Ravindra Jadeja',
      age: 25,
      wage: 26700,
      hand: 'LHB',
      bowlingType: 'Slow (SLA)',
      batting: 'Wonderful',
      bowling: 'Remarkable',
      keeping: 'Abysmal',
      fielding: 'Sensational',
      consistency: 'Exceptional',
      concentration: 'Exceptional',
      stamina: 'Exceptional',
      form: 'Superb',
      fatigue: 'Rested',
      leadership: 'Proficient',
      experience: 'Remarkable',
      bti: 178000,
      subskill: '13.8',
      activeNet: 'Fielding (1)',
      marketValue: 3800000,
      role: 'All-Rounder'
    },
    {
      id: 'BT-44129',
      name: 'Rashid Khan',
      age: 21,
      wage: 24000,
      hand: 'RHB',
      bowlingType: 'Leg Spin',
      batting: 'Competent',
      bowling: 'Exceptional',
      keeping: 'Abysmal',
      fielding: 'Wonderful',
      consistency: 'Sensational',
      concentration: 'Remarkable',
      stamina: 'Remarkable',
      form: 'Blissful',
      fatigue: 'Energized',
      leadership: 'Capable',
      experience: 'Proficient',
      bti: 165000,
      subskill: '14.8',
      activeNet: 'Bowling (2)',
      marketValue: 3700000,
      role: 'Lead Spinner'
    }
  ],

  nets: [
    { net: 1, type: 'Batting', playerId: 'BT-91024', name: 'Rohit Sharma', coach: '1.15x', etaWeeks: 6 },
    { net: 2, type: 'Batting', playerId: 'BT-91024', name: 'Rohit Sharma', coach: '1.15x', etaWeeks: 6 },
    { net: 3, type: 'Bowling', playerId: 'BT-84920', name: 'Jasprit Bumrah', coach: '1.15x', etaWeeks: 5 },
    { net: 4, type: 'Bowling', playerId: 'BT-84920', name: 'Jasprit Bumrah', coach: '1.15x', etaWeeks: 5 },
    { net: 5, type: 'Wicket Keeping', playerId: 'BT-63201', name: 'Rishabh Pant', coach: '1.05x', etaWeeks: 8 },
    { net: 6, type: 'Fielding', playerId: 'BT-54819', name: 'Ravindra Jadeja', coach: '1.10x', etaWeeks: 4 },
    { net: 7, type: 'Bowling', playerId: 'BT-44129', name: 'Rashid Khan', coach: '1.15x', etaWeeks: 6 },
    { net: 8, type: 'Bowling', playerId: 'BT-44129', name: 'Rashid Khan', coach: '1.15x', etaWeeks: 6 },
    { net: 9, type: 'Fitness / Stamina', playerId: 'BT-63201', name: 'Rishabh Pant', coach: '1.00x', etaWeeks: 3 },
    { net: 10, type: 'Physio / Recovery', playerId: 'All Squad', name: 'Fatigue Protection', coach: '1.00x', etaWeeks: '-' }
  ],

  trainingPops: [
    { date: '2026-11-13', player: 'Rohit Sharma', skill: 'Batting', oldVal: 'Exceptional', newVal: 'Sensational', weeks: 7 },
    { date: '2026-11-06', player: 'Jasprit Bumrah', skill: 'Bowling', oldVal: 'Exceptional', newVal: 'Sensational', weeks: 6 },
    { date: '2026-10-30', player: 'Rishabh Pant', skill: 'Keeping', oldVal: 'Remarkable', newVal: 'Wonderful', weeks: 8 },
    { date: '2026-10-23', player: 'Ravindra Jadeja', skill: 'Batting', oldVal: 'Remarkable', newVal: 'Wonderful', weeks: 9 }
  ],

  stadium: [
    { tier: 'Standing Room', current: 12000, ratio: '68%', rec: 17000, price: 5, cost: 35 },
    { tier: 'Uncovered Seats', current: 4500, ratio: '23%', rec: 5750, price: 8, cost: 60 },
    { tier: 'Covered Seats', current: 1200, ratio: '7%', rec: 1750, price: 15, cost: 100 },
    { tier: 'Members Enclosure (BT+)', current: 300, ratio: '2%', rec: 500, price: 35, cost: 220 }
  ]
};
