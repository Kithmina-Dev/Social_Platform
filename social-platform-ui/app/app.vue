<template>
  <div class="app-container">
    <header class="app-header">
      <h1>Social Platform</h1>
      <nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/test">Test Page</NuxtLink>
        <NuxtLink to="/demo">Demo Mode</NuxtLink>
        <NuxtLink to="/api-test">API Test</NuxtLink>
      </nav>
    </header>
    <main class="app-content">
      <NuxtPage />
    </main>
    <footer class="app-footer">
      <p>© 2025 Social Platform</p>
    </footer>
  </div>
</template>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: #4267B2;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header nav a {
  color: white;
  text-decoration: none;
  margin-left: 1rem;
}

.app-content {
  flex: 1;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background-color: #4267B2;
  color: white;
  text-align: center;
  padding: 1rem;
}
</style>
