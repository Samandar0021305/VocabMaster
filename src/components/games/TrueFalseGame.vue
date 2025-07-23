<template>
  <div class="true-false-game">
    <h3>True or False</h3>
    <p class="instructions">Is this the correct translation?</p>
    
    <div v-if="currentQuestion < totalQuestions" class="question-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      
      <div class="question-card">
        <div class="word-pair">
          <h2>{{ currentPair.word.original }}</h2>
          <div class="arrow">↓</div>
          <h2 class="translation">{{ currentPair.displayTranslation }}</h2>
        </div>
      </div>
      
      <div v-if="!showResult" class="answer-buttons">
        <button @click="answer(true)" class="btn btn-true">
          ✓ True
        </button>
        <button @click="answer(false)" class="btn btn-false">
          ✗ False
        </button>
      </div>
      
      <div v-if="showResult" class="result">
        <p v-if="isCorrect" class="correct-text">Correct! 🎉</p>
        <p v-else class="incorrect-text">
          Incorrect. 
          <span v-if="!currentPair.isCorrect">
            The correct translation is: <strong>{{ currentPair.word.translation }}</strong>
          </span>
          <span v-else>
            This was the correct translation!
          </span>
        </p>
        <button @click="nextQuestion" class="btn btn-primary">Next</button>
      </div>
    </div>
    
    <div v-else class="game-complete">
      <p>True/False complete! You got {{ correctAnswers }} out of {{ totalQuestions }} correct.</p>
      <button @click="$emit('next')" class="btn btn-primary">Next Game</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Word } from '@/types'

interface QuestionPair {
  word: Word
  displayTranslation: string
  isCorrect: boolean
}

const props = defineProps<{
  words: Word[]
}>()

const emit = defineEmits<{
  answer: [correct: boolean]
  next: []
}>()

const currentQuestion = ref(0)
const totalQuestions = 10
const showResult = ref(false)
const isCorrect = ref(false)
const correctAnswers = ref(0)
const questions = ref<QuestionPair[]>([])
const userAnswer = ref<boolean | null>(null)

const progressPercentage = computed(() => (currentQuestion.value / totalQuestions) * 100)

const currentPair = computed(() => {
  return questions.value[currentQuestion.value] || {
    word: props.words[0],
    displayTranslation: props.words[0].translation,
    isCorrect: true
  }
})

onMounted(() => {
  generateQuestions()
})

const generateQuestions = () => {
  questions.value = []
  
  for (let i = 0; i < totalQuestions; i++) {
    const isCorrectPair = Math.random() > 0.5
    const word = props.words[i % props.words.length]
    
    let displayTranslation: string
    if (isCorrectPair) {
      displayTranslation = word.translation
    } else {
      const otherWords = props.words.filter(w => w.id !== word.id)
      const randomWord = otherWords[Math.floor(Math.random() * otherWords.length)]
      displayTranslation = randomWord.translation
    }
    
    questions.value.push({
      word,
      displayTranslation,
      isCorrect: isCorrectPair
    })
  }
  
  questions.value.sort(() => Math.random() - 0.5)
}

const answer = (isTrue: boolean) => {
  userAnswer.value = isTrue
  isCorrect.value = isTrue === currentPair.value.isCorrect
  showResult.value = true
  
  if (isCorrect.value) {
    correctAnswers.value++
  }
  
  emit('answer', isCorrect.value)
}

const nextQuestion = () => {
  currentQuestion.value++
  showResult.value = false
  isCorrect.value = false
  userAnswer.value = null
}
</script>

<style scoped>
.true-false-game {
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

.question-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 3rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.word-pair {
  text-align: center;
}

.word-pair h2 {
  margin: 0;
  font-size: 1.8rem;
  color: var(--text-primary);
  font-weight: 700;
}

.arrow {
  font-size: 2rem;
  color: var(--medium-gray);
  margin: 1rem 0;
  font-weight: 600;
}

.translation {
  color: var(--primary-color);
  font-weight: 700;
}

.answer-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.1rem;
  font-weight: 600;
}

.btn-true {
  background-color: #27ae60;
  color: white;
}

.btn-true:hover {
  background-color: #229954;
  transform: scale(1.05);
}

.btn-false {
  background-color: #e74c3c;
  color: white;
}

.btn-false:hover {
  background-color: #c0392b;
  transform: scale(1.05);
}

.result {
  text-align: center;
  margin-top: 2rem;
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

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}
</style>