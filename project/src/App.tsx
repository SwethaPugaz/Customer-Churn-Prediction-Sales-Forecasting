import React, { useState } from 'react';
// Sidebar removed
import { Header } from './components/Header';
import { DashboardContent } from './components/DashboardContent';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  // Sidebar state removed

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <main className="p-6">
          <DashboardContent />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;