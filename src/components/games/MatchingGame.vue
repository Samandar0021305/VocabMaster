<template>
  <div class="matching-game">
    <h3>Matching Game</h3>
    <p class="instructions">Match the words with their translations!</p>
    
    <div class="game-board">
      <div class="cards-grid">
        <div 
          v-for="(card, index) in shuffledCards" 
          :key="index"
          class="card"
          :class="{ 
            'flipped': flippedCards.includes(index) || matchedCards.includes(index),
            'matched': matchedCards.includes(index)
          }"
          @click="flipCard(index)"
        >
          <div class="card-content">
            {{ card.text }}
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="isComplete" class="game-complete">
      <p>Great job! You matched all the pairs!</p>
      <button @click="$emit('next')" class="btn btn-primary">Next Game</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Word } from '@/types'

interface Card {
  text: string
  wordId: string
  type: 'original' | 'translation'
}

const props = defineProps<{
  words: Word[]
}>()

const emit = defineEmits<{
  answer: [correct: boolean]
  next: []
}>()

const shuffledCards = ref<Card[]>([])
const flippedCards = ref<number[]>([])
const matchedCards = ref<number[]>([])
const attempts = ref(0)

const isComplete = computed(() => matchedCards.value.length === shuffledCards.value.length)

onMounted(() => {
  initializeGame()
})

const initializeGame = () => {
  const gameWords = props.words.slice(0, 6)
  const cards: Card[] = []
  
  gameWords.forEach(word => {
    cards.push({ text: word.original, wordId: word.id, type: 'original' })
    cards.push({ text: word.translation, wordId: word.id, type: 'translation' })
  })
  
  shuffledCards.value = shuffleArray(cards)
}

const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

const flipCard = (index: number) => {
  if (flippedCards.value.includes(index) || matchedCards.value.includes(index)) {
    return
  }
  
  if (flippedCards.value.length === 2) {
    flippedCards.value = []
  }
  
  flippedCards.value.push(index)
  
  if (flippedCards.value.length === 2) {
    checkMatch()
  }
}

const checkMatch = () => {
  const [first, second] = flippedCards.value
  const card1 = shuffledCards.value[first]
  const card2 = shuffledCards.value[second]
  
  attempts.value++
  
  if (card1.wordId === card2.wordId && card1.type !== card2.type) {
    matchedCards.value.push(first, second)
    emit('answer', true)
    flippedCards.value = []
  } else {
    emit('answer', false)
    setTimeout(() => {
      flippedCards.value = []
    }, 1000)
  }
}
</script>

<style scoped>
@keyframes cardFlip {
  0% { transform: perspective(600px) rotateY(0); }
  50% { transform: perspective(600px) rotateY(90deg); }
  100% { transform: perspective(600px) rotateY(0); }
}

@keyframes cardMatch {
  0% { transform: scale(1) rotate(0); }
  50% { transform: scale(1.2) rotate(5deg); }
  100% { transform: scale(1) rotate(0); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.matching-game {
  text-align: center;
  animation: fadeIn 0.5s ease-out;
}

h3 {
  font-size: 2rem;
  color: var(--text-primary);
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.instructions {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.game-board {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.card {
  aspect-ratio: 1;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: var(--radius-lg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transform-style: preserve-3d;
}

.card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
  transform: rotate(45deg);
  transition: all 0.6s;
  opacity: 0;
}

.card:hover:not(.matched)::before {
  animation: shine 0.6s ease-in-out;
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.card:hover:not(.matched) {
  transform: scale(1.05) translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.card-content {
  padding: 1rem;
  font-weight: 600;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  text-align: center;
  word-break: break-word;
}

.card.flipped .card-content {
  opacity: 1;
  animation: fadeIn 0.3s ease-out;
}

.card.flipped:not(.matched) {
  animation: cardFlip 0.6s ease-in-out;
}

.card.matched {
  background: linear-gradient(135deg, var(--success-color), #2ecc71);
  cursor: default;
  animation: cardMatch 0.5s ease-in-out;
}

.card.matched::after {
  content: '✓';
  position: absolute;
  font-size: 3rem;
  color: white;
  opacity: 0.2;
  animation: bounce 1s infinite;
}

.game-complete {
  margin-top: 2rem;
  padding: 2.5rem;
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  animation: slideIn 0.5s ease-out;
}

.game-complete p {
  font-size: 1.25rem;
  color: var(--success-color);
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn:hover::before {
  width: 300px;
  height: 300px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }
  
  .game-board {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  
  h3 {
    font-size: 1.5rem;
  }
  
  .card-content {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}
</style>