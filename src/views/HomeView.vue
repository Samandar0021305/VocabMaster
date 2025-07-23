<template>
  <div class="home">
    <h1>Welcome to Vocabulary Learning</h1>
    <p class="subtitle">Master new words through interactive games!</p>
    
    <div v-if="layers.length === 0" class="empty-state">
      <p>You don't have any vocabulary layers yet.</p>
      <router-link to="/layers" class="btn btn-primary">Create Your First Layer</router-link>
    </div>
    
    <div v-else class="layers-grid">
      <div v-for="layer in layers" :key="layer.id" class="layer-card">
        <h3>{{ layer.name }}</h3>
        <p>{{ layer.words.length }} words</p>
        <div class="card-actions">
          <router-link :to="`/layer/${layer.id}/words`" class="btn btn-secondary">
            Manage Words
          </router-link>
          <button 
            @click="startGame(layer.id)" 
            class="btn btn-primary"
            :disabled="layer.words.length < 3"
          >
            Start Learning
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useVocabularyStore } from '@/stores/vocabulary'

const router = useRouter()
const store = useVocabularyStore()

const layers = computed(() => store.layers)

const startGame = (layerId: string) => {
  router.push(`/game/${layerId}`)
}
</script>

<style scoped>
.home {
  text-align: center;
  animation: fadeIn 0.5s ease-out;
}

h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  color: var(--text-primary);
  font-weight: 800;
  margin-bottom: 0.5rem;
  animation: slideIn 0.5s ease-out;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.subtitle {
  color: var(--text-secondary);
  font-size: clamp(1rem, 3vw, 1.25rem);
  margin-bottom: 2rem;
  animation: slideIn 0.5s ease-out 0.1s both;
  font-weight: 500;
}

.empty-state {
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f5f7ff 0%, #f0e6ff 100%);
  border-radius: var(--radius-xl);
  margin: 2rem auto;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
  animation: fadeIn 0.5s ease-out 0.2s both;
  position: relative;
  overflow: hidden;
}

.empty-state::before {
  content: '🎆';
  position: absolute;
  font-size: 8rem;
  opacity: 0.1;
  top: -2rem;
  right: -2rem;
  animation: bounce 3s infinite;
}

.empty-state p {
  position: relative;
  z-index: 1;
  font-size: 1.1rem;
  color: var(--text-primary);
  font-weight: 500;
}

.layers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.layer-card {
  background: white;
  border: 2px solid transparent;
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
}

.layer-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s;
}

.layer-card:hover::before {
  transform: scaleX(1);
}

.layer-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-color);
}

.layer-card h3 {
  margin: 0 0 0.75rem 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
}

.layer-card p {
  color: var(--medium-gray);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius-lg);
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
  width: 300px;
  height: 300px;
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
  background: linear-gradient(135deg, var(--medium-gray), var(--dark-gray));
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

@media (max-width: 768px) {
  .layers-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .layer-card {
    padding: 1.5rem;
  }
  
  .empty-state {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .card-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .btn {
    width: 100%;
  }
}
</style>