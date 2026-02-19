// Navigation
export interface NavItem {
  label: string
  path: string
  icon?: string
}

// Widget (dashboard card / workspace context)
export interface Widget {
  id: string
  title: string
  chartType?: 'bar' | 'line' | 'pie' | 'table' | 'feed'
  dataKey?: string
}

// Optional attributes from customer interaction data (e.g. JSON import)
export interface InteractionAttributes {
  loyaltyTier?: string
  couponUsed?: boolean
  orderItem?: string
  emotion?: string
}

// Customer interaction – base
export interface InteractionBase {
  id: number | string
  type: 'survey' | 'call' | 'social' | 'review'
  category: string
  sentiment: 'Negative' | 'Neutral' | 'Positive'
  date: string
  channel: string
  topic: string
  nps?: number | null
  attributes?: InteractionAttributes
}

export interface SurveyResponse extends InteractionBase {
  type: 'survey'
  text: string
}

export interface TranscriptEntry {
  time: string
  speaker: string
  type: string
  text: string
}

export interface CallTranscript extends InteractionBase {
  type: 'call'
  transcript: string | TranscriptEntry[]
  duration?: string
  rawText?: string
}

export interface SocialPost extends InteractionBase {
  type: 'social'
  text: string
}

export interface GoogleReview extends InteractionBase {
  type: 'review'
  text: string
}

export type CustomerInteraction =
  | SurveyResponse
  | CallTranscript
  | SocialPost
  | GoogleReview

// Filter state
export interface ActiveFilter {
  type: string
  value: string
}

export interface GlobalFilter {
  id: string
  type: string
  value: string
}

// Chart / table row data
export interface IssuesRow {
  name: string
  count: string
  negative?: number
  neutral?: number
  positive?: number
}

export interface FeedbackItem {
  id: number
  name: string
  source: string
  time: string
  score: number
  text: string
  color: string
}

export interface SentimentSlice {
  name: string
  value: number
  color: string
}

export interface WordCloudItem {
  text: string
  value: number
  color: string
}

// Single-interaction context (Chapters / Topics / Metadata)
export interface InteractionChapter {
  timestamp?: string
  title: string
  summary: string
}

export interface TopicTag {
  label: string
  count?: number
}

export interface TopicGroup {
  model: string
  heading?: string
  tags: TopicTag[]
}

export interface InteractionMetadata {
  emotion?: string
  csat?: string | number
  orderId?: string
  userId?: string
  responseId?: string
  dateCreated?: string
  orderDate?: string
}
