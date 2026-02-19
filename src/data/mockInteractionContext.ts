import type {
  InteractionChapter,
  TopicGroup,
  InteractionMetadata,
} from '@/types'

import contextJson from './interactionContext.json'

type ChaptersById = Record<string, InteractionChapter[]>
type TopicsById = Record<string, TopicGroup[]>
type MetadataById = Record<string, InteractionMetadata>

const chapters = contextJson.chapters as ChaptersById
const topics = contextJson.topics as TopicsById
const metadata = contextJson.metadata as MetadataById

export function getChaptersForInteraction(id: number | string): InteractionChapter[] {
  const key = typeof id === 'number' ? String(id) : id
  return key != null ? chapters[key] ?? [] : []
}

export function getTopicsForInteraction(id: number | string): TopicGroup[] {
  const key = typeof id === 'number' ? String(id) : id
  return key != null ? topics[key] ?? [] : []
}

export function getMetadataForInteraction(
  id: number | string,
  fallbackSentiment?: string
): InteractionMetadata {
  const key = typeof id === 'number' ? String(id) : id
  const base = key != null ? metadata[key] ?? {} : {}
  if (fallbackSentiment && base.emotion == null)
    return { ...base, emotion: fallbackSentiment }
  return base
}
