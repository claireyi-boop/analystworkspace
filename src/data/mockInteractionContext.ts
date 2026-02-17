import type {
  InteractionChapter,
  TopicGroup,
  InteractionMetadata,
} from '@/types'

export const CHAPTERS_BY_ID: Record<number, InteractionChapter[]> = {
  4: [
    {
      timestamp: '00:45',
      title: 'Issue identification',
      summary:
        "Customer states order is 'completely wrong,' citing a Missing Item (Chicken Fiesta Bowl) and a Product Quality issue (Flat Soda).",
    },
    {
      timestamp: '01:05',
      title: 'Issue identification',
      summary:
        'Agent fails to apologize, refuses ownership and uses an unprofessional tone in response to customer frustration.',
    },
    {
      timestamp: '01:28',
      title: 'Resolution Barrier',
      summary:
        'Agent cites policy to deny compensation for the low-value item (soda), increasing Customer Effort and forcing customer to re-escalate the issue.',
    },
  ],
  10: [
    {
      timestamp: '00:30',
      title: 'Technical issue',
      summary: 'Customer reports login button greyed out on iOS 17; cannot access rewards.',
    },
    {
      timestamp: '02:15',
      title: 'Troubleshooting',
      summary: 'Agent walks through app version and device settings.',
    },
  ],
}

export const TOPICS_BY_ID: Record<number, TopicGroup[]> = {
  1: [
    { model: 'Topic model: Restaurants', heading: 'Order Fulfillment', tags: [{ label: 'Drive-Thru Wait', count: 3 }, { label: 'Service Speed', count: 3 }] },
    { model: 'Customer Emotion', tags: [{ label: 'Frustration', count: 3 }] },
  ],
  4: [
    { model: 'Topic model: Restaurants', heading: 'Order Fulfillment', tags: [{ label: 'Missing/Incorrect Order', count: 3 }, { label: 'Product Quality', count: 3 }] },
    { model: 'Customer Emotion', tags: [{ label: 'Frustration', count: 3 }, { label: 'Loyalty', count: 3 }] },
    { model: 'Topic model: Nom Nom Express Custom', heading: 'Operational Root Cause', tags: [{ label: 'Missing Item: Hot Kitchen', count: 3 }, { label: 'Product Quality', count: 3 }, { label: 'Channel Error: Drive-Thru', count: 3 }] },
  ],
  3: [
    { model: 'Topic model: Billing', heading: 'Coupons & Promotions', tags: [{ label: 'App Error', count: 3 }, { label: 'Billing', count: 3 }] },
  ],
}

export const METADATA_BY_ID: Record<number, InteractionMetadata> = {
  1: { emotion: 'Very negative', csat: 2, orderId: 'NNE-126-B7', userId: 'FE123', responseId: 'TTDC-4001', dateCreated: '6:45 PM, Nov 20, 2024', orderDate: '1:02 PM, Nov 24, 2024' },
  3: { emotion: 'Negative', csat: 3, responseId: 'SURVEY-38223', dateCreated: '9:03 PM Oct 1, 2025' },
  4: { emotion: 'Frustrated', csat: 'Very low: 2', orderId: 'NNE-199-B7', responseId: 'CALL-4217', dateCreated: '9:03 PM Oct 1, 2025' },
  10: { emotion: 'Negative', responseId: 'CALL-4217', dateCreated: '9:03 PM Oct 1, 2025' },
}

export function getChaptersForInteraction(id: number): InteractionChapter[] {
  return CHAPTERS_BY_ID[id] ?? []
}

export function getTopicsForInteraction(id: number): TopicGroup[] {
  return TOPICS_BY_ID[id] ?? []
}

export function getMetadataForInteraction(
  id: number,
  fallbackSentiment?: string
): InteractionMetadata {
  const base = METADATA_BY_ID[id] ?? {}
  if (fallbackSentiment && base.emotion == null)
    return { ...base, emotion: fallbackSentiment }
  return base
}
