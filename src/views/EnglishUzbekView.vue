<template>
  <div class="english-uzbek-view">
    <span style="color: red">This feature is in test mode.</span>

    <h1>English-Uzbek Vocabulary Learning</h1>
    <p class="subtitle">
      Learn Uzbek meanings of English words through contextual understanding
    </p>

    <div class="input-section">
      <div class="word-input-container">
        <input
          v-model="customWord"
          @keyup.enter="startCustomGame"
          placeholder="Enter an English word..."
          class="word-input"
        />
        <button
          @click="startCustomGame"
          class="btn btn-primary"
          :disabled="!customWord.trim()"
        >
          Start Learning
        </button>
      </div>
      <p class="hint">
        Or try one of these words: hello, book, friend, happy, time, work
      </p>
    </div>

    <div v-if="gameStarted" class="game-wrapper">
      <MeaningCardsGame :words="gameWords" @next="resetGame" />
    </div>

    <div v-else class="features">
      <div class="feature-card">
        <span class="feature-icon">📖</span>
        <h3>Contextual Learning</h3>
        <p>Learn meanings, not just translations</p>
      </div>
      <div class="feature-card">
        <span class="feature-icon">🎯</span>
        <h3>Interactive Cards</h3>
        <p>Choose the correct meaning from 4 options</p>
      </div>
      <div class="feature-card">
        <span class="feature-icon">📱</span>
        <h3>Responsive Design</h3>
        <p>Works perfectly on all devices</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MeaningCardsGame from "@/components/games/MeaningCardsGame.vue";
import type { Word } from "@/types";

const customWord = ref("");
const gameStarted = ref(false);
const gameWords = ref<Word[]>([]);

const startCustomGame = () => {
  if (!customWord.value.trim()) return;

  gameWords.value = [
    {
      id: Date.now().toString(),
      original: customWord.value.trim(),
      translation: customWord.value.trim().toLowerCase(),
    },
  ];

  gameStarted.value = true;
};

const resetGame = () => {
  gameStarted.value = false;
  customWord.value = "";
  gameWords.value = [];
};
</script>

<style scoped>
.english-uzbek-view {
  max-width: 1000px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-out;
}

h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  color: var(--text-primary);
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  color: var(--text-secondary);
  font-size: clamp(1rem, 3vw, 1.25rem);
  margin-bottom: 3rem;
  text-align: center;
  font-weight: 500;
}

.input-section {
  background: white;
  padding: 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  margin-bottom: 3rem;
}

.word-input-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
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

.hint {
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
}

.game-wrapper {
  animation: slideIn 0.5s ease-out;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  text-align: center;
  transition: all 0.3s;
  animation: fadeIn 0.5s ease-out;
  animation-fill-mode: both;
}

.feature-card:nth-child(1) {
  animation-delay: 0.1s;
}
.feature-card:nth-child(2) {
  animation-delay: 0.2s;
}
.feature-card:nth-child(3) {
  animation-delay: 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: var(--text-primary);
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: var(--text-secondary);
  margin: 0;
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
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--primary-dark)
  );
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .word-input-container {
    flex-direction: column;
  }

  .word-input {
    width: 100%;
  }

  .btn {
    width: 100%;
  }

  .input-section {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .features {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
