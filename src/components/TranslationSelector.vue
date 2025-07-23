<template>
  <div class="translation-selector">
    <div class="input-section">
      <h3>Enter English Word</h3>
      <div class="input-container">
        <input 
          v-model="englishWord"
          @keyup.enter="fetchSuggestions"
          placeholder="Type an English word..."
          class="word-input"
          :disabled="isLoading"
        >
        <button 
          @click="fetchSuggestions"
          class="btn btn-primary"
          :disabled="!englishWord.trim() || isLoading"
        >
          <span v-if="!isLoading">Get Translations</span>
          <span v-else class="loading">Loading...</span>
        </button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="suggestions.length > 0 && !selectedTranslation" class="suggestions-section">
        <h3>Select Translation for "{{ lastSearchedWord }}"</h3>
        <div class="suggestions-grid">
          <div 
            v-for="(suggestion, index) in suggestions"
            :key="index"
            class="suggestion-card"
            @click="selectTranslation(suggestion)"
          >
            <div class="translation-main">
              <span class="translation-text">{{ suggestion.translation }}</span>
              <span class="confidence-badge" :class="getConfidenceClass(suggestion.confidence)">
                {{ Math.round(suggestion.confidence * 100) }}%
              </span>
            </div>
            <p class="translation-meaning">{{ suggestion.meaning }}</p>
            <p v-if="suggestion.context" class="translation-context">
              <span class="context-icon">📝</span> {{ suggestion.context }}
            </p>
          </div>
        </div>
      </div>
    </transition>

    <transition name="slide-fade">
      <div v-if="selectedTranslation" class="result-section">
        <h3>Selected Translation</h3>
        <div class="result-card">
          <div class="result-pair">
            <div class="word-box english">
              <span class="language-label">English</span>
              <p class="word">{{ lastSearchedWord }}</p>
            </div>
            <div class="arrow-container">
              <span class="arrow">→</span>
            </div>
            <div class="word-box uzbek">
              <span class="language-label">O'zbek</span>
              <p class="word">{{ selectedTranslation.translation }}</p>
            </div>
          </div>
          <div class="result-details">
            <p class="meaning">
              <strong>Ma'nosi:</strong> {{ selectedTranslation.meaning }}
            </p>
            <p v-if="selectedTranslation.context" class="context">
              <strong>Kontekst:</strong> {{ selectedTranslation.context }}
            </p>
          </div>
          <div class="result-actions">
            <button @click="saveTranslation" class="btn btn-success">
              Save to Vocabulary
            </button>
            <button @click="reset" class="btn btn-secondary">
              Try Another Word
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="showSaveConfirmation" class="save-confirmation">
        ✅ Translation saved successfully!
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TranslationService, type TranslationSuggestion } from '@/services/translationService'

const emit = defineEmits<{
  translationSaved: [{ original: string, translation: string, meaning: string }]
}>()

const englishWord = ref('')
const lastSearchedWord = ref('')
const suggestions = ref<TranslationSuggestion[]>([])
const selectedTranslation = ref<TranslationSuggestion | null>(null)
const isLoading = ref(false)
const showSaveConfirmation = ref(false)

const fetchSuggestions = async () => {
  if (!englishWord.value.trim() || isLoading.value) return
  
  isLoading.value = true
  lastSearchedWord.value = englishWord.value.trim()
  selectedTranslation.value = null
  
  try {
    suggestions.value = await TranslationService.getSuggestions(englishWord.value)
  } catch (error) {
    console.error('Failed to fetch translations:', error)
    suggestions.value = []
  } finally {
    isLoading.value = false
  }
}

const selectTranslation = (suggestion: TranslationSuggestion) => {
  selectedTranslation.value = suggestion
  suggestions.value = []
}

const saveTranslation = () => {
  if (!selectedTranslation.value) return
  
  emit('translationSaved', {
    original: lastSearchedWord.value,
    translation: selectedTranslation.value.translation,
    meaning: selectedTranslation.value.meaning
  })
  
  showSaveConfirmation.value = true
  setTimeout(() => {
    showSaveConfirmation.value = false
  }, 3000)
}

const reset = () => {
  englishWord.value = ''
  lastSearchedWord.value = ''
  suggestions.value = []
  selectedTranslation.value = null
}

const getConfidenceClass = (confidence: number) => {
  if (confidence >= 0.9) return 'high'
  if (confidence >= 0.7) return 'medium'
  return 'low'
}
</script>

<style scoped>
.translation-selector {
  max-width: 800px;
  margin: 0 auto;
}

.input-section {
  background: white;
  padding: 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  margin-bottom: 2rem;
}

.input-section h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.input-container {
  display: flex;
  gap: 1rem;
}

.word-input {
  flex: 1;
  padding: 1rem;
  font-size: 1.1rem;
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  background: var(--light-gray);
  transition: all 0.3s;
}

.word-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background: white;
  box-shadow: var(--shadow-sm);
}

.word-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading {
  display: inline-flex;
  align-items: center;
}

.loading::after {
  content: '';
  width: 16px;
  height: 16px;
  margin-left: 0.5rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.suggestions-section {
  background: white;
  padding: 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  margin-bottom: 2rem;
}

.suggestions-section h3 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  text-align: center;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.suggestion-card {
  background: var(--light-gray);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.suggestion-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  background: white;
}

.translation-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.translation-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
}

.confidence-badge {
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
}

.confidence-badge.high {
  background: var(--success-color);
  color: white;
}

.confidence-badge.medium {
  background: var(--warning-color);
  color: white;
}

.confidence-badge.low {
  background: var(--medium-gray);
  color: white;
}

.translation-meaning {
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.translation-context {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.context-icon {
  font-size: 0.8rem;
}

.result-section {
  background: white;
  padding: 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.result-section h3 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  text-align: center;
}

.result-card {
  background: linear-gradient(135deg, #f5f7ff 0%, #f0e6ff 100%);
  border-radius: var(--radius-lg);
  padding: 2rem;
}

.result-pair {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.word-box {
  text-align: center;
  padding: 1.5rem;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  min-width: 150px;
}

.language-label {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.word-box .word {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.word-box.english .word {
  color: var(--info-color);
}

.word-box.uzbek .word {
  color: var(--primary-color);
}

.arrow-container {
  font-size: 2rem;
  color: var(--medium-gray);
}

.result-details {
  border-top: 2px solid rgba(0,0,0,0.1);
  padding-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.result-details p {
  margin: 0.5rem 0;
  color: var(--text-primary);
}

.result-details strong {
  color: var(--text-primary);
  font-weight: 600;
}

.result-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: linear-gradient(135deg, var(--medium-gray), var(--dark-gray));
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-success {
  background: linear-gradient(135deg, var(--success-color), #059669);
  color: white;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.save-confirmation {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: var(--success-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  font-weight: 600;
  animation: slideIn 0.3s ease-out;
  z-index: 1000;
}

@media (max-width: 768px) {
  .input-container {
    flex-direction: column;
  }
  
  .suggestions-grid {
    grid-template-columns: 1fr;
  }
  
  .result-pair {
    flex-direction: column;
    gap: 1rem;
  }
  
  .arrow-container {
    transform: rotate(90deg);
  }
  
  .result-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  .save-confirmation {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    text-align: center;
  }
}
</style>