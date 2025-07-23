<template>
  <div class="word-management">
    <router-link to="/layers" class="back-link">� Back to Layers</router-link>
    
    <h1>{{ layer?.name || 'Layer' }} - Word Management</h1>
    
    <div class="add-word-form">
      <input 
        v-model="newWord.original" 
        @keyup.enter="focusTranslation"
        placeholder="Original word..."
        class="input"
      >
      <input 
        v-model="newWord.translation" 
        @keyup.enter="addWord"
        placeholder="Translation..."
        class="input"
        ref="translationInput"
      >
      <button @click="addWord" class="btn btn-primary" :disabled="!canAddWord">
        Add Word
      </button>
    </div>
    
    <div v-if="!layer?.words.length" class="empty-state">
      <p>No words added yet. Add your first word above!</p>
    </div>
    
    <div v-else class="words-list">
      <div v-for="word in layer.words" :key="word.id" class="word-item">
        <div v-if="editingWord?.id === word.id" class="word-edit">
          <input 
            v-model="editingWord.original" 
            @keyup.enter="saveEdit"
            @keyup.escape="cancelEdit"
            class="input input-small"
          >
          <input 
            v-model="editingWord.translation" 
            @keyup.enter="saveEdit"
            @keyup.escape="cancelEdit"
            class="input input-small"
          >
          <button @click="saveEdit" class="btn btn-small btn-primary">Save</button>
          <button @click="cancelEdit" class="btn btn-small btn-secondary">Cancel</button>
        </div>
        <div v-else class="word-display">
          <div class="word-content">
            <span class="word-original">{{ word.original }}</span>
            <span class="word-arrow">�</span>
            <span class="word-translation">{{ word.translation }}</span>
          </div>
          <div class="word-actions">
            <button @click="startEdit(word)" class="btn btn-small btn-secondary">Edit</button>
            <button @click="deleteWord(word.id)" class="btn btn-small btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVocabularyStore } from '@/stores/vocabulary'
import type { Word } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useVocabularyStore()

const layerId = computed(() => route.params.id as string)
const layer = computed(() => store.getLayerById(layerId.value))

const newWord = ref({ original: '', translation: '' })
const editingWord = ref<Word & { original: string; translation: string } | null>(null)
const translationInput = ref<HTMLInputElement>()

const canAddWord = computed(() => 
  newWord.value.original.trim() && newWord.value.translation.trim()
)

onMounted(() => {
  if (!layer.value) {
    router.push('/layers')
  }
})

const focusTranslation = () => {
  translationInput.value?.focus()
}

const addWord = () => {
  if (canAddWord.value) {
    store.addWord(layerId.value, newWord.value.original.trim(), newWord.value.translation.trim())
    newWord.value = { original: '', translation: '' }
  }
}

const deleteWord = (wordId: string) => {
  if (confirm('Are you sure you want to delete this word?')) {
    store.deleteWord(layerId.value, wordId)
  }
}

const startEdit = (word: Word) => {
  editingWord.value = { ...word }
}

const saveEdit = () => {
  if (editingWord.value && editingWord.value.original.trim() && editingWord.value.translation.trim()) {
    store.updateWord(
      layerId.value, 
      editingWord.value.id, 
      editingWord.value.original.trim(), 
      editingWord.value.translation.trim()
    )
    editingWord.value = null
  }
}

const cancelEdit = () => {
  editingWord.value = null
}
</script>

<style scoped>
.word-management {
  max-width: 800px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-out;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
}

.back-link:hover {
  background: var(--primary-color);
  color: white;
  transform: translateX(-4px);
}

h1 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: var(--text-primary);
  font-weight: 800;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.add-word-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  animation: slideIn 0.5s ease-out 0.1s both;
}

.input {
  flex: 1;
  padding: 1rem;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  font-size: 1rem;
  background: var(--light-gray);
  transition: all 0.3s;
}

.input-small {
  padding: 0.6rem;
  font-size: 0.9rem;
  flex: 0 1 200px;
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
  background: white;
  box-shadow: var(--shadow-sm);
}

.input::placeholder {
  color: var(--medium-gray);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: linear-gradient(135deg, #f5f7ff 0%, #f0e6ff 100%);
  border-radius: var(--radius-xl);
  color: var(--text-primary);
  box-shadow: var(--shadow-lg);
  animation: fadeIn 0.5s ease-out 0.2s both;
  position: relative;
  overflow: hidden;
  font-weight: 500;
}

.empty-state::before {
  content: '📝';
  position: absolute;
  font-size: 8rem;
  opacity: 0.1;
  bottom: -2rem;
  right: -2rem;
  animation: bounce 3s infinite;
}

.words-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.word-item {
  background: white;
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  box-shadow: var(--shadow-md);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideIn 0.3s ease-out;
}

.word-item:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.word-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.word-edit {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.word-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.word-original {
  font-weight: 700;
  color: var(--primary-color);
  font-size: 1.1rem;
}

.word-arrow {
  color: var(--medium-gray);
  flex-shrink: 0;
}

.word-translation {
  color: var(--text-primary);
  font-size: 1.05rem;
  font-weight: 500;
}

.word-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn {
  padding: 0.6rem 1.25rem;
  border: none;
  border-radius: var(--radius-md);
  text-decoration: none;
  cursor: pointer;
  font-size: 0.9rem;
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
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn:hover::before {
  width: 150px;
  height: 150px;
}

.btn-small {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: linear-gradient(135deg, var(--info-color), #3182ce);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-danger {
  background: linear-gradient(135deg, var(--danger-color), #e53e3e);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

@media (max-width: 768px) {
  .add-word-form {
    flex-direction: column;
    padding: 1rem;
  }
  
  .word-display {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .word-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .word-actions {
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
  }
  
  .word-edit {
    flex-direction: column;
    width: 100%;
  }
  
  .input-small {
    width: 100%;
    flex: 1;
  }
}

@media (max-width: 480px) {
  .btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
  
  .btn-small {
    padding: 0.35rem 0.7rem;
    font-size: 0.8rem;
  }
}
</style>