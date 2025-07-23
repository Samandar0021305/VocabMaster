<template>
  <div class="multiple-choice-game">
    <h3>Multiple Choice</h3>
    <p class="instructions">Choose the correct translation!</p>
    
    <div v-if="currentQuestion < totalQuestions" class="question-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      
      <div class="question">
        <h2>{{ currentWord.original }}</h2>
      </div>
      
      <div class="options">
        <button 
          v-for="(option, index) in options" 
          :key="index"
          @click="selectAnswer(option)"
          class="option-btn"
          :class="{
            'correct': showResult && option === currentWord.translation,
            'incorrect': showResult && option === selectedAnswer && option !== currentWord.translation
          }"
          :disabled="showResult"
        >
          {{ option }}
        </button>
      </div>
      
      <div v-if="showResult" class="result">
        <p v-if="isCorrect" class="correct-text">Correct! 🎉</p>
        <p v-else class="incorrect-text">Incorrect. The answer is: {{ currentWord.translation }}</p>
        <button @click="nextQuestion" class="btn btn-primary">Next Question</button>
      </div>
    </div>
    
    <div v-else class="game-complete">
      <p>Quiz complete! You got {{ correctAnswers }} out of {{ totalQuestions }} correct.</p>
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

const currentQuestion = ref(0)
const totalQuestions = 10
const options = ref<string[]>([])
const selectedAnswer = ref('')
const showResult = ref(false)
const isCorrect = ref(false)
const correctAnswers = ref(0)
const usedWords = ref<Word[]>([])

const progressPercentage = computed(() => (currentQuestion.value / totalQuestions) * 100)

const currentWord = computed(() => {
  if (usedWords.value.length === 0) return props.words[0]
  return usedWords.value[currentQuestion.value] || props.words[0]
})

onMounted(() => {
  setupQuestions()
  generateOptions()
})

const setupQuestions = () => {
  const shuffled = [...props.words].sort(() => Math.random() - 0.5)
  usedWords.value = []
  
  for (let i = 0; i < totalQuestions; i++) {
    usedWords.value.push(shuffled[i % shuffled.length])
  }
}

const generateOptions = () => {
  const correctTranslation = currentWord.value.translation
  const otherTranslations = props.words
    .filter(w => w.id !== currentWord.value.id)
    .map(w => w.translation)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
  
  options.value = [correctTranslation, ...otherTranslations]
    .sort(() => Math.random() - 0.5)
}

const selectAnswer = (answer: string) => {
  selectedAnswer.value = answer
  isCorrect.value = answer === currentWord.value.translation
  showResult.value = true
  
  if (isCorrect.value) {
    correctAnswers.value++
  }
  
  emit('answer', isCorrect.value)
}

const nextQuestion = () => {
  currentQuestion.value++
  selectedAnswer.value = ''
  showResult.value = false
  isCorrect.value = false
  
  if (currentQuestion.value < totalQuestions) {
    generateOptions()
  }
}
</script>

<style scoped>
@keyframes slideInOption {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes correctPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.multiple-choice-game {
  max-width: 700px;
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

.question-container {
  background: white;
  padding: 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.progress-bar {
  height: 12px;
  background: linear-gradient(90deg, #e0e7ff 0%, #cfe2ff 100%);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% { left: 100%; }
}

.question {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7ff 0%, #f0e6ff 100%);
  border-radius: var(--radius-lg);
  animation: slideIn 0.5s ease-out;
}

.question h2 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: var(--text-primary);
  margin: 0;
  animation: bounce 0.5s ease-out;
  font-weight: 700;
}

.options {
  display: grid;
  gap: 1rem;
}

.option-btn {
  padding: 1.25rem;
  border: 3px solid transparent;
  background: white;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  animation: slideInOption 0.5s ease-out;
  animation-fill-mode: both;
}

.option-btn:nth-child(1) { animation-delay: 0.1s; }
.option-btn:nth-child(2) { animation-delay: 0.2s; }
.option-btn:nth-child(3) { animation-delay: 0.3s; }
.option-btn:nth-child(4) { animation-delay: 0.4s; }

.option-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.option-btn:hover:not(:disabled)::before {
  width: 400px;
  height: 400px;
}

.option-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.option-btn:disabled {
  cursor: not-allowed;
}

.option-btn.correct {
  border-color: var(--success-color);
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  animation: correctPulse 0.6s ease-in-out;
}

.option-btn.correct::after {
  content: '✓';
  position: absolute;
  right: 1rem;
  font-size: 1.5rem;
  animation: slideIn 0.3s ease-out;
}

.option-btn.incorrect {
  border-color: var(--danger-color);
  background: linear-gradient(135deg, #f8d7da 0%, #f5c2c7 100%);
  color: #721c24;
  animation: shake 0.5s ease-in-out;
}

.option-btn.incorrect::after {
  content: '✗';
  position: absolute;
  right: 1rem;
  font-size: 1.5rem;
  animation: slideIn 0.3s ease-out;
}

.result {
  margin-top: 2rem;
  text-align: center;
  animation: fadeIn 0.5s ease-out;
}

.correct-text {
  color: var(--success-color);
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  animation: bounce 0.5s ease-out;
}

.incorrect-text {
  color: var(--danger-color);
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.game-complete {
  text-align: center;
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
  .question-container {
    padding: 1.5rem;
  }
  
  .question {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .option-btn {
    padding: 1rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  h3 {
    font-size: 1.5rem;
  }
  
  .question h2 {
    font-size: 1.5rem;
  }
  
  .option-btn {
    font-size: 0.95rem;
  }
}
</style>