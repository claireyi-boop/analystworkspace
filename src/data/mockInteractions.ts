import type {
  CustomerInteraction,
  IssuesRow,
  FeedbackItem,
  SentimentSlice,
  WordCloudItem,
} from '@/types'

import interactionsJson from './interactions.json'

export const ALL_DATA: CustomerInteraction[] = interactionsJson as CustomerInteraction[]

export const ISSUES_DATA: IssuesRow[] = [
  { name: 'Service speed', count: '1,232', negative: 40, neutral: 30, positive: 30 },
  { name: 'Order accuracy', count: '983', negative: 35, neutral: 25, positive: 40 },
  { name: 'Drive-thru', count: '882', negative: 30, neutral: 30, positive: 40 },
  { name: 'Mobile app', count: '712', negative: 25, neutral: 40, positive: 35 },
  { name: 'Product quality', count: '673', negative: 20, neutral: 20, positive: 60 },
]

export const STRENGTHS_DATA: IssuesRow[] = [
  { name: 'Staff friendliness', count: '1,232', positive: 60, neutral: 30, negative: 10 },
  { name: 'Promotions', count: '983', positive: 55, neutral: 35, negative: 10 },
  { name: 'New items', count: '882', positive: 50, neutral: 40, negative: 10 },
  { name: 'Product quality', count: '712', positive: 45, neutral: 45, negative: 10 },
  { name: 'Cleanliness', count: '673', positive: 40, neutral: 40, negative: 20 },
]

export const FEEDBACK_DATA: FeedbackItem[] = [
  {
    id: 1,
    name: 'Alex_G88',
    source: 'Google reviews',
    time: '1 hr',
    score: 2,
    text: "The new Zesty Truffle Fries are actually really good! However, I tried to use my 'Buy One Get One' coupon in the app, and it kept saying 'Invalid Code' even though it doesn't expire until next week...",
    color: 'bg-red-500',
  },
  {
    id: 2,
    name: 'SarahRunsOnNom',
    source: 'Post purchase survey',
    time: '01/29/2026',
    score: 5,
    text: "Super fast! I barely pulled into the 'Mobile Pickup' spot and the runner was already coming out with my bag. The food was piping hot.",
    color: 'bg-teal-500',
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    source: 'Google reviews',
    time: '3 hrs ago',
    score: 5,
    text: 'Service speed is back to what it used to be. For a while, this location was struggling, but today I was through the drive-thru in under 4 minutes.',
    color: 'bg-teal-500',
  },
  {
    id: 4,
    name: 'MarkTExplores',
    source: 'X',
    time: '4 hrs ago',
    score: 1,
    text: "Usually love this place, but the drive-thru tonight was a disaster. I sat in the 'Express' lane for 25 minutes.",
    color: 'bg-red-500',
  },
]

export const SENTIMENT_DATA: SentimentSlice[] = [
  { name: 'Very Dissatisfied', value: 2, color: '#ef4444' },
  { name: 'Dissatisfied', value: 5, color: '#f87171' },
  { name: 'Neutral', value: 12, color: '#e5e7eb' },
  { name: 'Satisfied', value: 21, color: '#4ade80' },
  { name: 'Very satisfied', value: 25, color: '#22c55e' },
  { name: 'Extremely satisfied', value: 33, color: '#16a34a' },
]

export const WORD_CLOUD: WordCloudItem[] = [
  { text: 'Drive-Thru', value: 55, color: '#ef4444' },
  { text: 'Coupon', value: 45, color: '#f97316' },
  { text: 'Wait', value: 30, color: '#f59e0b' },
  { text: 'Fries', value: 25, color: '#64748b' },
  { text: 'App', value: 20, color: '#64748b' },
]

export const CHART_DATA_MAPPED = ISSUES_DATA.map((d) => ({
  name: d.name,
  count: parseInt(d.count.replace(',', ''), 10),
  color: '#ef4444',
}))
