import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Layer, Word, GameSession } from '@/types'

export const useVocabularyStore = defineStore('vocabulary', () => {
  const layers = ref<Layer[]>([])
  const currentSession = ref<GameSession | null>(null)

  const loadFromStorage = () => {
    const stored = localStorage.getItem('vocabulary-layers')
    if (stored) {
      layers.value = JSON.parse(stored)
    }
  }

  const saveToStorage = () => {
    localStorage.setItem('vocabulary-layers', JSON.stringify(layers.value))
  }

  watch(layers, saveToStorage, { deep: true })

  const addLayer = (name: string) => {
    const newLayer: Layer = {
      id: Date.now().toString(),
      name,
      words: [],
      createdAt: Date.now()
    }
    layers.value.push(newLayer)
  }

  const deleteLayer = (id: string) => {
    const index = layers.value.findIndex(layer => layer.id === id)
    if (index !== -1) {
      layers.value.splice(index, 1)
    }
  }

  const addWord = (layerId: string, original: string, translation: string) => {
    const layer = layers.value.find(l => l.id === layerId)
    if (layer) {
      const newWord: Word = {
        id: Date.now().toString(),
        original,
        translation
      }
      layer.words.push(newWord)
    }
  }

  const deleteWord = (layerId: string, wordId: string) => {
    const layer = layers.value.find(l => l.id === layerId)
    if (layer) {
      const index = layer.words.findIndex(w => w.id === wordId)
      if (index !== -1) {
        layer.words.splice(index, 1)
      }
    }
  }

  const updateWord = (layerId: string, wordId: string, original: string, translation: string) => {
    const layer = layers.value.find(l => l.id === layerId)
    if (layer) {
      const word = layer.words.find(w => w.id === wordId)
      if (word) {
        word.original = original
        word.translation = translation
      }
    }
  }

  const getLayerById = (id: string) => {
    return layers.value.find(layer => layer.id === id)
  }

  const startGameSession = (layerId: string) => {
    currentSession.value = {
      layerId,
      currentGameIndex: 0,
      score: 0,
      totalQuestions: 0
    }
  }

  const updateSessionScore = (correct: boolean) => {
    if (currentSession.value) {
      currentSession.value.totalQuestions++
      if (correct) {
        currentSession.value.score++
      }
    }
  }

  const nextGame = () => {
    if (currentSession.value) {
      currentSession.value.currentGameIndex++
    }
  }

  const endSession = () => {
    currentSession.value = null
  }

  loadFromStorage()

  return {
    layers: computed(() => layers.value),
    currentSession: computed(() => currentSession.value),
    addLayer,
    deleteLayer,
    addWord,
    deleteWord,
    updateWord,
    getLayerById,
    startGameSession,
    updateSessionScore,
    nextGame,
    endSession
  }
})