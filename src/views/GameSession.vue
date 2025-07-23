<template>
  <div class="game-session">
    <div v-if="!layer" class="error-state">
      <p>Layer not found!</p>
      <router-link to="/" class="btn btn-primary">Back to Home</router-link>
    </div>
    
    <div v-else-if="layer.words.length < 3" class="error-state">
      <p>This layer needs at least 3 words to start a game!</p>
      <router-link :to="`/layer/${layerId}/words`" class="btn btn-primary">Add More Words</router-link>
    </div>
    
    <div v-else>
      <div class="game-header">
        <h2>{{ layer.name }}</h2>
        <div class="game-stats">
          <span>Game {{ currentGameIndex + 1 }} of {{ games.length }}</span>
          <span>Score: {{ session?.score || 0 }} / {{ session?.totalQuestions || 0 }}</span>
        </div>
      </div>
      
      <component 
        :is="currentGameComponent" 
        :words="layer.words"
        @answer="handleAnswer"
        @next="nextGame"
      />
      
      <div v-if="isComplete" class="completion-screen">
        <h2>Session Complete!</h2>
        <p class="final-score">Final Score: {{ session?.score || 0 }} / {{ session?.totalQuestions || 0 }}</p>
        <p class="percentage">{{ Math.round(((session?.score || 0) / (session?.totalQuestions || 1)) * 100) }}% Correct</p>
        <div class="completion-actions">
          <button @click="restartSession" class="btn btn-primary">Play Again</button>
          <router-link to="/" class="btn btn-secondary">Back to Home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVocabularyStore } from '@/stores/vocabulary'

const MatchingGame = defineAsyncComponent(() => import('@/components/games/MatchingGame.vue'))
const MultipleChoiceGame = defineAsyncComponent(() => import('@/components/games/MultipleChoiceGame.vue'))
const TypingGame = defineAsyncComponent(() => import('@/components/games/TypingGame.vue'))
const FlashcardsGame = defineAsyncComponent(() => import('@/components/games/FlashcardsGame.vue'))
const TrueFalseGame = defineAsyncComponent(() => import('@/components/games/TrueFalseGame.vue'))
const MeaningCardsGame = defineAsyncComponent(() => import('@/components/games/MeaningCardsGame.vue'))

const route = useRoute()
const router = useRouter()
const store = useVocabularyStore()

const layerId = computed(() => route.params.layerId as string)
const layer = computed(() => store.getLayerById(layerId.value))
const session = computed(() => store.currentSession)

const games = [MeaningCardsGame, MatchingGame, MultipleChoiceGame, TypingGame, FlashcardsGame, TrueFalseGame]

const currentGameIndex = computed(() => session.value?.currentGameIndex || 0)
const currentGameComponent = computed(() => games[currentGameIndex.value] || null)
const isComplete = computed(() => currentGameIndex.value >= games.length)

onMounted(() => {
  if (!layer.value || layer.value.words.length < 3) {
    return
  }
  store.startGameSession(layerId.value)
})

const handleAnswer = (correct: boolean) => {
  store.updateSessionScore(correct)
}

const nextGame = () => {
  if (currentGameIndex.value < games.length - 1) {
    store.nextGame()
  } else {
    store.nextGame()
  }
}

const restartSession = () => {
  store.startGameSession(layerId.value)
}
</script>

<style scoped>
.game-session {
  max-width: 900px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-out;
}

.error-state {
  text-align: center;
  padding: 3rem;
  background: linear-gradient(135deg, #ffe5e5 0%, #ffcccc 100%);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  animation: slideIn 0.5s ease-out;
}

.error-state p {
  color: var(--text-primary);
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  animation: slideIn 0.5s ease-out;
}

.game-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-weight: 800;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
}

.game-stats {
  display: flex;
  gap: 2rem;
  color: var(--text-primary);
  font-weight: 600;
  flex-wrap: wrap;
}

.game-stats span {
  padding: 0.5rem 1rem;
  background: var(--light-gray);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.completion-screen {
  text-align: center;
  padding: 3rem;
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border-radius: var(--radius-xl);
  margin-top: 2rem;
  box-shadow: var(--shadow-xl);
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
}

.completion-screen::before {
  content: '🎉';
  position: absolute;
  font-size: 10rem;
  opacity: 0.1;
  top: -3rem;
  right: -3rem;
  animation: bounce 2s infinite;
}

.completion-screen::after {
  content: '🎆';
  position: absolute;
  font-size: 8rem;
  opacity: 0.1;
  bottom: -2rem;
  left: -2rem;
  animation: bounce 2s infinite 0.5s;
}

.completion-screen h2 {
  color: var(--success-color);
  margin-bottom: 1rem;
  font-size: 2.5rem;
  position: relative;
  z-index: 1;
}

.final-score {
  font-size: 1.75rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
}

.percentage {
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(135deg, var(--success-color), #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  animation: pulse 2s infinite;
}

.completion-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: var(--radius-lg);
  text-decoration: none;
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

.btn-secondary {
  background: linear-gradient(135deg, var(--medium-gray), var(--dark-gray));
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

@media (max-width: 768px) {
  .game-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .game-stats {
    justify-content: center;
  }
  
  .completion-screen {
    padding: 2rem;
  }
  
  .percentage {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .game-stats {
    gap: 0.5rem;
  }
  
  .game-stats span {
    font-size: 0.85rem;
    padding: 0.375rem 0.75rem;
  }
  
  .completion-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .btn {
    width: 100%;
  }
}
</style>