<template>
  <div class="meaning-cards-game">
    <h3>English-Uzbek Meaning Cards</h3>
    <p class="instructions">
      Select the correct Uzbek meaning for the English word
    </p>

    <div v-if="currentRound < totalRounds" class="game-container">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>

      <div class="word-display">
        <h2>{{ currentWord }}</h2>
        <p class="word-type">English Word</p>
      </div>

      <div class="cards-grid">
        <div 
          v-for="(option, index) in currentOptions" 
          :key="index"
          class="meaning-card"
          :class="{
            'selected': selectedIndex === index,
            'correct': showResult && option.isCorrect,
            'incorrect': showResult && selectedIndex === index && !option.isCorrect,
            'disabled': showResult
          }"
          @click="selectCard(index, option)"
        >
          <div class="card-content">
            <p class="meaning-text">{{ option.meaning }}</p>
            <transition name="fade">
              <div v-if="showResult && selectedIndex === index" class="feedback">
                <div v-if="option.isCorrect" class="correct-feedback">
                  <span class="icon">✓</span>
                  <p class="word-pair">{{ currentWord }} = {{ option.translation }}</p>
                </div>
                <div v-else class="incorrect-feedback">
                  <span class="icon">✗</span>
                  <p class="word-pair">{{ currentWord }} ≠ {{ option.translation }}</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <transition name="slide-fade">
        <div v-if="showResult" class="round-result">
          <button @click="nextRound" class="btn btn-primary">
            {{ currentRound < totalRounds - 1 ? 'Next Round' : 'Finish' }}
          </button>
        </div>
      </transition>
    </div>

    <div v-else class="game-complete">
      <h2>Game Complete!</h2>
      <p class="final-score">
        You got {{ correctAnswers }} out of {{ totalRounds }} correct!
      </p>
      <div class="score-visual">
        <div class="score-bar">
          <div 
            class="score-fill" 
            :style="{ width: scorePercentage + '%' }"
          ></div>
        </div>
        <span class="score-text">{{ scorePercentage }}%</span>
      </div>
      <button @click="$emit('next')" class="btn btn-primary">Next Game</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Word } from '@/types'

interface MeaningOption {
  meaning: string
  translation: string
  isCorrect: boolean
}

const props = defineProps<{
  words: Word[]
}>()

const emit = defineEmits<{
  answer: [correct: boolean]
  next: []
}>()

const uzbekMeanings = {
  'hello': { meaning: "Salomlashish uchun ishlatiladigan so'z", translation: "salom" },
  'goodbye': { meaning: "Xayrlashish vaqtida aytiladi", translation: "xayr" },
  'thank you': { meaning: "Minnatdorchilik bildirish uchun", translation: "rahmat" },
  'water': { meaning: "Ichish uchun zarur bo'lgan suyuqlik", translation: "suv" },
  'book': { meaning: "O'qish uchun yozilgan sahifalar to'plami", translation: "kitob" },
  'friend': { meaning: "Yaqin munosabatda bo'lgan inson", translation: "do'st" },
  'house': { meaning: "Odamlar yashaydigan bino", translation: "uy" },
  'food': { meaning: "Ovqatlanish uchun iste'mol qilinadigan narsa", translation: "ovqat" },
  'love': { meaning: "Chuqur mehr va muhabbat hissi", translation: "sevgi" },
  'time': { meaning: "Soat va kunlar o'lchovi", translation: "vaqt" },
  'money': { meaning: "To'lov vositasi, pul birligi", translation: "pul" },
  'work': { meaning: "Mehnat qilish, ish faoliyati", translation: "ish" },
  'family': { meaning: "Yaqin qarindoshlar guruhi", translation: "oila" },
  'happy': { meaning: "Xursandchilik, quvonch hissi", translation: "baxtli" },
  'sad': { meaning: "G'amginlik, qayg'u holati", translation: "g'amgin" },
  'big': { meaning: "Hajmi yoki o'lchami katta", translation: "katta" },
  'small': { meaning: "Hajmi yoki o'lchami kichik", translation: "kichik" },
  'hot': { meaning: "Yuqori haroratga ega", translation: "issiq" },
  'cold': { meaning: "Past haroratga ega", translation: "sovuq" },
  'day': { meaning: "24 soatlik vaqt birligi", translation: "kun" }
}

const distractorMeanings = [
  "Harakat yoki faoliyat jarayoni",
  "Joy yoki makon haqida ma'lumot",
  "Vaqt yoki davr ko'rsatkichi",
  "Sifat yoki holat tavsifi",
  "Inson yoki jonzot nomi",
  "Buyum yoki narsa tavsifi",
  "Tabiiy hodisa yoki voqea",
  "His-tuyg'u yoki kayfiyat",
  "Miqdor yoki son ko'rsatkichi",
  "Rang yoki ko'rinish tavsifi"
]

const currentRound = ref(0)
const totalRounds = 5
const currentOptions = ref<MeaningOption[]>([])
const selectedIndex = ref<number | null>(null)
const showResult = ref(false)
const correctAnswers = ref(0)
const gameWords = ref<string[]>([])

const currentWord = computed(() => gameWords.value[currentRound.value] || '')
const progressPercentage = computed(() => ((currentRound.value + 1) / totalRounds) * 100)
const scorePercentage = computed(() => Math.round((correctAnswers.value / totalRounds) * 100))

onMounted(() => {
  setupGame()
})

const setupGame = () => {
  const availableWords = Object.keys(uzbekMeanings)
  gameWords.value = availableWords.sort(() => Math.random() - 0.5).slice(0, totalRounds)
  generateOptions()
}

const generateOptions = () => {
  const word = currentWord.value.toLowerCase()
  const correctMeaning = uzbekMeanings[word as keyof typeof uzbekMeanings]
  
  if (!correctMeaning) {
    const fallbackMeaning = {
      meaning: `${currentWord.value} so'zining ma'nosi`,
      translation: currentWord.value.toLowerCase()
    }
    
    const options: MeaningOption[] = [
      { ...fallbackMeaning, isCorrect: true }
    ]
    
    const randomMeanings = distractorMeanings
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(meaning => ({
        meaning,
        translation: 'noto\'g\'ri',
        isCorrect: false
      }))
    
    currentOptions.value = [...options, ...randomMeanings].sort(() => Math.random() - 0.5)
    return
  }
  
  const correctOption: MeaningOption = {
    meaning: correctMeaning.meaning,
    translation: correctMeaning.translation,
    isCorrect: true
  }
  
  const otherMeanings = Object.entries(uzbekMeanings)
    .filter(([key]) => key !== word)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(([_, value]) => ({
      meaning: value.meaning,
      translation: value.translation,
      isCorrect: false
    }))
  
  currentOptions.value = [correctOption, ...otherMeanings].sort(() => Math.random() - 0.5)
}

const selectCard = (index: number, option: MeaningOption) => {
  if (showResult.value) return
  
  selectedIndex.value = index
  showResult.value = true
  
  if (option.isCorrect) {
    correctAnswers.value++
  }
  
  emit('answer', option.isCorrect)
}

const nextRound = () => {
  currentRound.value++
  selectedIndex.value = null
  showResult.value = false
  
  if (currentRound.value < totalRounds) {
    generateOptions()
  }
}
</script>

<style scoped>
@keyframes cardPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.meaning-cards-game {
  max-width: 900px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-out;
}

h3 {
  text-align: center;
  font-size: 2rem;
  color: var(--text-primary);
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.instructions {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.game-container {
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
}

.word-display {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7ff 0%, #f0e6ff 100%);
  border-radius: var(--radius-lg);
  animation: slideIn 0.5s ease-out;
}

.word-display h2 {
  font-size: clamp(2rem, 5vw, 3rem);
  color: var(--primary-color);
  margin: 0 0 0.5rem 0;
  font-weight: 800;
  letter-spacing: 1px;
}

.word-type {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.meaning-card {
  background: white;
  border: 3px solid #e0e7ff;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  animation: slideIn 0.5s ease-out;
  animation-fill-mode: both;
}

.meaning-card:nth-child(1) { animation-delay: 0.1s; }
.meaning-card:nth-child(2) { animation-delay: 0.2s; }
.meaning-card:nth-child(3) { animation-delay: 0.3s; }
.meaning-card:nth-child(4) { animation-delay: 0.4s; }

.meaning-card:hover:not(.disabled) {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.meaning-card.selected:not(.disabled) {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, #f5f7ff 0%, #f0e6ff 100%);
  animation: cardPulse 0.6s ease-in-out;
}

.meaning-card.correct {
  border-color: var(--success-color);
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
}

.meaning-card.incorrect {
  border-color: var(--danger-color);
  background: linear-gradient(135deg, #f8d7da 0%, #f5c2c7 100%);
}

.meaning-card.disabled {
  cursor: not-allowed;
}

.card-content {
  text-align: center;
  width: 100%;
}

.meaning-text {
  font-size: 1.1rem;
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0;
  font-weight: 500;
}

.feedback {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(0,0,0,0.1);
}

.correct-feedback .icon,
.incorrect-feedback .icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: block;
}

.correct-feedback .icon {
  color: var(--success-color);
}

.incorrect-feedback .icon {
  color: var(--danger-color);
}

.word-pair {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.correct-feedback .word-pair {
  color: var(--success-color);
}

.incorrect-feedback .word-pair {
  color: var(--danger-color);
}

.round-result {
  text-align: center;
  margin-top: 2rem;
}

.game-complete {
  text-align: center;
  padding: 3rem;
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  animation: slideIn 0.5s ease-out;
}

.game-complete h2 {
  color: var(--success-color);
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.final-score {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 2rem;
  font-weight: 600;
}

.score-visual {
  margin-bottom: 2rem;
}

.score-bar {
  height: 30px;
  background: rgba(255,255,255,0.5);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--success-color) 0%, #2ecc71 100%);
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.score-text {
  font-size: 2rem;
  font-weight: 800;
  color: var(--success-color);
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
  .game-container {
    padding: 1.5rem;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .meaning-card {
    min-height: 150px;
    padding: 1.25rem;
  }
  
  .word-display {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .word-display h2 {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  h3 {
    font-size: 1.5rem;
  }
  
  .game-container {
    padding: 1rem;
  }
  
  .meaning-text {
    font-size: 1rem;
  }
  
  .word-display h2 {
    font-size: 1.5rem;
  }
}
</style>