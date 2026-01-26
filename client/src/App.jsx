import React from 'react';
import StarChart from './components/StarChart';
import HabitabilityCalc from './components/HabitabilityCalc';
import FitsViewer from './components/FitsViewer';

function App() {
  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <header className="border-b border-white/10 bg-space-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500"></div>
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Cosmos Dashboard
            </h1>
          </div>
          <nav className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Data</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Analysis</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Intro Section */}
        <section className="text-center py-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-space-highlight to-space-accent">Universe</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Interactive visualization of stellar classifications, habitability analysis, and FITS imagery processing.
          </p>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Chart - Spans 2 columns */}
          <div className="lg:col-span-2 min-h-[500px]">
            <StarChart />
          </div>

          {/* Sidebar Tools */}
          <div className="space-y-8">
            <HabitabilityCalc />
            <FitsViewer />
          </div>

        </div>

      </main>
    </div>
  );
}

export default App;
