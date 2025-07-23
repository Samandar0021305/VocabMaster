<template>
  <div class="layer-management">
    <h1>Manage Vocabulary Layers</h1>
    
    <div class="add-layer-form">
      <input 
        v-model="newLayerName" 
        @keyup.enter="addLayer"
        placeholder="Enter layer name..."
        class="input"
      >
      <button @click="addLayer" class="btn btn-primary" :disabled="!newLayerName.trim()">
        Add Layer
      </button>
    </div>
    
    <div v-if="layers.length === 0" class="empty-state">
      <p>No layers created yet. Create your first layer above!</p>
    </div>
    
    <div v-else class="layers-list">
      <div v-for="layer in layers" :key="layer.id" class="layer-item">
        <div class="layer-info">
          <h3>{{ layer.name }}</h3>
          <p>{{ layer.words.length }} words</p>
        </div>
        <div class="layer-actions">
          <router-link :to="`/layer/${layer.id}/words`" class="btn btn-secondary">
            Manage Words
          </router-link>
          <button @click="deleteLayer(layer.id)" class="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVocabularyStore } from '@/stores/vocabulary'

const store = useVocabularyStore()
const newLayerName = ref('')

const layers = computed(() => store.layers)

const addLayer = () => {
  if (newLayerName.value.trim()) {
    store.addLayer(newLayerName.value.trim())
    newLayerName.value = ''
  }
}

const deleteLayer = (id: string) => {
  if (confirm('Are you sure you want to delete this layer and all its words?')) {
    store.deleteLayer(id)
  }
}
</script>

<style scoped>
.layer-management {
  max-width: 800px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-out;
}

h1 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: var(--text-primary);
  font-weight: 800;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.add-layer-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: slideIn 0.5s ease-out 0.1s both;
}

.input {
  flex: 1;
  padding: 1rem;
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  font-size: 1rem;
  background: white;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s;
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
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
  content: '📁';
  position: absolute;
  font-size: 8rem;
  opacity: 0.1;
  top: -2rem;
  left: -2rem;
  animation: pulse 3s infinite;
}

.layers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.layer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideIn 0.5s ease-out;
  position: relative;
  overflow: hidden;
}

.layer-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, var(--primary-color), var(--secondary-color));
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.3s;
}

.layer-item:hover::before {
  transform: scaleY(1);
}

.layer-item:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.layer-info h3 {
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 700;
}

.layer-info p {
  margin: 0;
  color: var(--medium-gray);
  font-weight: 500;
}

.layer-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
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
  width: 200px;
  height: 200px;
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
  .add-layer-form {
    flex-direction: column;
  }
  
  .layer-item {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .layer-actions {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .layer-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .btn {
    width: 100%;
  }
}
</style>