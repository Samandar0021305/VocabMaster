export interface Word {
  id: string
  original: string
  translation: string
}

export interface Layer {
  id: string
  name: string
  words: Word[]
  createdAt: number
}

export interface GameSession {
  layerId: string
  currentGameIndex: number
  score: number
  totalQuestions: number
}

export type GameType = 'matching' | 'multipleChoice' | 'typing' | 'flashcards' | 'trueFalse'