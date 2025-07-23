<template>
  <div class="flashcards-game">
    <h3>Flashcards</h3>
    <p class="instructions">Click the card to flip it. Rate your knowledge!</p>
    
    <div v-if="currentIndex < cards.length" class="flashcard-container">
      <div class="progress-info">
        Card {{ currentIndex + 1 }} of {{ cards.length }}
      </div>
      
      <div 
        class="flashcard"
        :class="{ 'flipped': isFlipped }"
        @click="flipCard"
      >
        <div class="card-face front">
          <p>{{ currentCard.original }}</p>
        </div>
        <div class="card-face back">
          <p>{{ currentCard.translation }}</p>
        </div>
      </div>
      
      <div v-if="isFlipped" class="rating-section">
        <p>How well did you know this?</p>
        <div class="rating-buttons">
          <button @click="rateAndNext(false)" class="btn btn-danger">
            Didn't Know
          </button>
          <button @click="rateAndNext(true)" class="btn btn-success">
            Knew It!
          </button>
        </div>
      </div>
    </div>
    
    <div v-else class="game-complete">
      <p>Flashcards complete! You knew {{ correctCount }} out of {{ cards.length }} cards.</p>
      <button @click="$emit('next')" class="btn btn-primary">Next Game</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Word } from '@/types'

const props = defineProps<{
  words: Word[]
}>()

const emit = defineEmits<{
  answer: [correct: boolean]
  next: []
}>()

const currentIndex = ref(0)
const isFlipped = ref(false)
const cards = ref<Word[]>([])
const correctCount = ref(0)

const currentCard = computed(() => cards.value[currentIndex.value] || props.words[0])

onMounted(() => {
  setupCards()
})

const setupCards = () => {
  cards.value = [...props.words].sort(() => Math.random() - 0.5).slice(0, 10)
}

const flipCard = () => {
  isFlipped.value = !isFlipped.value
}

const rateAndNext = (knew: boolean) => {
  if (knew) {
    correctCount.value++
  }
  
  emit('answer', knew)
  
  currentIndex.value++
  isFlipped.value = false
}
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes sparkle {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

.flashcards-game {
  max-width: 600px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-out;
}

h3 {
  text-align: center;
  font-size: 2rem;
  color: var(--text-primary);
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.instructions {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.flashcard-container {
  text-align: center;
  perspective: 1000px;
}

.progress-info {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  background: white;
  border-radius: var(--radius-lg);
  display: inline-block;
  box-shadow: var(--shadow-sm);
}

.flashcard {
  position: relative;
  width: 100%;
  height: 350px;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 2rem;
  animation: float 3s ease-in-out infinite;
}

.flashcard.flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  padding: 2.5rem;
  overflow: hidden;
}

.card-face::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  animation: sparkle 3s infinite;
}

.front {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.front::after {
  content: '👀';
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  opacity: 0.3;
}

.back {
  background: linear-gradient(135deg, var(--success-color), #2ecc71);
  color: white;
  transform: rotateY(180deg);
}

.back::after {
  content: '✨';
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  font-size: 2rem;
  opacity: 0.3;
  animation: bounce 2s infinite;
}

.card-face p {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 600;
  margin: 0;
  word-break: break-word;
  text-align: center;
  line-height: 1.4;
  position: relative;
  z-index: 1;
}

.rating-section {
  margin-top: 2rem;
  animation: slideIn 0.5s ease-out;
}

.rating-section p {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.rating-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.game-complete {
  text-align: center;
  padding: 2.5rem;
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  animation: slideIn 0.5s ease-out;
  position: relative;
  overflow: hidden;
}

.game-complete::before {
  content: '🎓';
  position: absolute;
  font-size: 8rem;
  opacity: 0.1;
  top: -2rem;
  right: -2rem;
  animation: bounce 3s infinite;
}

.game-complete p {
  font-size: 1.25rem;
  color: var(--success-color);
  font-weight: 600;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
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
  box-shadow: var(--shadow-md);
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
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.btn-success {
  background: linear-gradient(135deg, var(--success-color), #229954);
  color: white;
}

.btn-success:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: var(--shadow-lg);
}

.btn-danger {
  background: linear-gradient(135deg, var(--danger-color), #c0392b);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: var(--shadow-lg);
}

@media (max-width: 768px) {
  .flashcard {
    height: 300px;
  }
  
  .card-face {
    padding: 2rem;
  }
  
  .rating-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  h3 {
    font-size: 1.5rem;
  }
  
  .flashcard {
    height: 250px;
  }
  
  .card-face p {
    font-size: 1.25rem;
  }
}
</style>