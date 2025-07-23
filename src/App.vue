<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">
          <span class="brand-icon">🎯</span>
          <span class="brand-text">VocabMaster</span>
        </router-link>
        <button
          class="mobile-menu-btn"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span class="menu-bar"></span>
          <span class="menu-bar"></span>
          <span class="menu-bar"></span>
        </button>
        <div class="nav-links" :class="{ 'mobile-open': mobileMenuOpen }">
          <router-link to="/" class="nav-link" @click="mobileMenuOpen = false">
            <span class="nav-icon">🏠</span>
            Home
          </router-link>
          <router-link
            to="/layers"
            class="nav-link"
            @click="mobileMenuOpen = false"
          >
            <span class="nav-icon">📚</span>
            Layers
          </router-link>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </main>
    <footer class="footer">
      <p>© Samandar</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const mobileMenuOpen = ref(false);
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 100;
  animation: slideIn 0.3s ease-out;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  transition: transform 0.3s;
}

.nav-brand:hover {
  transform: scale(1.05);
}

.brand-icon {
  font-size: 2rem;
  animation: bounce 2s infinite;
}

.brand-text {
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

.menu-bar {
  width: 25px;
  height: 3px;
  background: var(--primary-color);
  border-radius: 3px;
  transition: all 0.3s;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2d3748;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  transition: all 0.3s;
  font-weight: 600;
}

.nav-icon {
  font-size: 1.25rem;
}

.nav-link:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.nav-link.router-link-active {
  background: var(--primary-color);
  color: white;
  box-shadow: var(--shadow-sm);
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 1rem;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
    box-shadow: var(--shadow-lg);
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s;
  }

  .nav-links.mobile-open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: all;
  }

  .nav-link {
    width: 100%;
    justify-content: center;
  }

  .main-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .brand-text {
    font-size: 1.25rem;
  }

  .brand-icon {
    font-size: 1.5rem;
  }
}

.footer {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-top: auto;
  animation: slideIn 0.3s ease-out;
}

.footer p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .footer {
    padding: 1rem;
  }

  .footer p {
    font-size: 0.85rem;
  }
}
</style>
