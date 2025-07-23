<template>
  <div class="typing-game">
    <h3>Typing Practice</h3>
    <p class="instructions">Type the translation for each word!</p>
    
    <div v-if="currentIndex < totalQuestions" class="question-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      
      <div class="question">
        <h2>{{ currentWord.original }}</h2>
      </div>
      
      <div class="answer-section">
        <input 
          v-model="userAnswer"
          @keyup.enter="checkAnswer"
          type="text"
          class="answer-input"
          :class="{
            'correct': showResult && isCorrect,
            'incorrect': showResult && !isCorrect
          }"
          :disabled="showResult"
          placeholder="Type the translation..."
          ref="answerInput"
        >
        
        <button 
          @click="checkAnswer" 
          class="btn btn-primary"
          :disabled="!userAnswer.trim() || showResult"
        >
          Check
        </button>
      </div>
      
      <div v-if="showResult" class="result">
        <p v-if="isCorrect" class="correct-text">Correct! 🎉</p>
        <p v-else class="incorrect-text">
          Incorrect. The answer is: <strong>{{ currentWord.translation }}</strong>
        </p>
        <button @click="nextQuestion" class="btn btn-primary">Next</button>
      </div>
    </div>
    
    <div v-else class="game-complete">
      <p>Typing practice complete! You got {{ correctAnswers }} out of {{ totalQuestions }} correct.</p>
      <button @click="$emit('next')" class="btn btn-primary">Next Game</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import type { Word } from '@/types'

const props = defineProps<{
  words: Word[]
}>()

const emit = defineEmits<{
  answer: [correct: boolean]
  next: []
}>()

const currentIndex = ref(0)
const totalQuestions = 8
const userAnswer = ref('')
const showResult = ref(false)
const isCorrect = ref(false)
const correctAnswers = ref(0)
const questionWords = ref<Word[]>([])
const answerInput = ref<HTMLInputElement>()

const progressPercentage = computed(() => (currentIndex.value / totalQuestions) * 100)

const currentWord = computed(() => {
  return questionWords.value[currentIndex.value] || props.words[0]
})

onMounted(() => {
  setupQuestions()
  focusInput()
})

const setupQuestions = () => {
  const shuffled = [...props.words].sort(() => Math.random() - 0.5)
  questionWords.value = []
  
  for (let i = 0; i < totalQuestions; i++) {
    questionWords.value.push(shuffled[i % shuffled.length])
  }
}

const checkAnswer = () => {
  if (!userAnswer.value.trim() || showResult.value) return
  
  const normalizedUser = userAnswer.value.trim().toLowerCase()
  const normalizedCorrect = currentWord.value.translation.toLowerCase()
  
  isCorrect.value = normalizedUser === normalizedCorrect
  showResult.value = true
  
  if (isCorrect.value) {
    correctAnswers.value++
  }
  
  emit('answer', isCorrect.value)
}

const nextQuestion = () => {
  currentIndex.value++
  userAnswer.value = ''
  showResult.value = false
  isCorrect.value = false
  
  if (currentIndex.value < totalQuestions) {
    nextTick(() => {
      focusInput()
    })
  }
}

const focusInput = () => {
  answerInput.value?.focus()
}
</script>

<style scoped>
.typing-game {
  max-width: 600px;
  margin: 0 auto;
}

h3 {
  text-align: center;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 800;
}

.instructions {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.progress-bar {
  height: 8px;
  background-color: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.progress-fill {
  height: 100%;
  background-color: #3498db;
  transition: width 0.3s ease;
}

.question {
  text-align: center;
  margin-bottom: 3rem;
}

.question h2 {
  font-size: 2rem;
  color: var(--text-primary);
  margin: 0;
  font-weight: 700;
}

.answer-section {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.answer-input {
  flex: 1;
  padding: 0.75rem;
  font-size: 1.1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: border-color 0.3s;
}

.answer-input:focus {
  outline: none;
  border-color: #3498db;
}

.answer-input.correct {
  border-color: #27ae60;
  background-color: #d4edda;
}

.answer-input.incorrect {
  border-color: #e74c3c;
  background-color: #f8d7da;
}

.answer-input:disabled {
  cursor: not-allowed;
}

.result {
  margin-top: 2rem;
  text-align: center;
}

.correct-text {
  color: #27ae60;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.incorrect-text {
  color: #e74c3c;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.incorrect-text strong {
  color: var(--text-primary);
  font-weight: 800;
}

.game-complete {
  text-align: center;
  padding: 2rem;
  background-color: #ecf0f1;
  border-radius: 8px;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1rem;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>