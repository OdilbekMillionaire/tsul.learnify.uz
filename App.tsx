import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { LessonForm } from './components/LessonForm';
import { LessonRenderer } from './components/LessonRenderer';
import { About } from './components/About';
import { Language, LessonFormState, LessonResponse, ViewState, ChatMessage } from './types';
import { generateLesson } from './services/geminiService';
import { TRANSLATIONS } from './constants';
import SplineRobot from './components/SplineRobot';


const App: React.FC = () => {
  // State initialization
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    const saved = localStorage.getItem('learnify_lang');
    return (saved as Language) || Language.UZ_LATIN;
  });

  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [lessonData, setLessonData] = useState<LessonResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lifted Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('learnify_lang', currentLang);
  }, [currentLang]);

  // Handlers
  const handleLangChange = (lang: Language) => {
    setCurrentLang(lang);
  };

  const handleGenerate = async (formData: LessonFormState) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateLesson(formData, currentLang);
      setLessonData(data);
      // Initialize chat with greeting in current language
      setChatHistory([{ role: 'model', content: TRANSLATIONS[currentLang].aiGreeting }]);
      setCurrentView('lesson');
    } catch (err: any) {
      console.error("Generation Error:", err);

      let errorMessage = "Failed to generate lesson. Please check your API Key, internet connection, and try again.";

      // Robust error checking for quota limits
      const errString = err?.toString() || "";
      const errMessage = err?.message || "";

      if (
        errString.includes("429") ||
        errMessage.includes("429") ||
        errString.toLowerCase().includes("quota") ||
        errMessage.toLowerCase().includes("quota") ||
        errString.toLowerCase().includes("exhausted")
      ) {
        errorMessage = "⚠️ API Quota Exceeded. The system is currently busy. Please wait a minute and try again.";
      } else if (errString.includes("503") || errMessage.includes("503")) {
        errorMessage = "⚠️ AI Service Overloaded. Please try again in a few moments.";
      } else if (errString.includes("API key") || errMessage.includes("API key")) {
        errorMessage = "⚠️ Invalid API Key. Please check your configuration.";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (page: ViewState) => {
    // Check if trying to access lesson without data
    if (page === 'lesson' && !lessonData) {
      setCurrentView('create');
      return;
    }

    setCurrentView(page);

    // If users clicks "New Lesson", we reset data.
    if (page === 'create') {
      setLessonData(null);
      setChatHistory([]);
      setError(null);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'landing':
        return (
          <div key="landing" className="animate-fade-in-up">
            <Home currentLang={currentLang} onStartClick={() => handleNavigate('create')} />
          </div>
        );
      case 'about':
        return (
          <div key="about" className="animate-fade-in-up">
            <About currentLang={currentLang} />
          </div>
        );
      case 'lesson':
        if (lessonData) {
          return (
            <div key="lesson">
              <LessonRenderer
                data={lessonData}
                currentLang={currentLang}
                onBack={() => handleNavigate('create')}
                chatHistory={chatHistory}
                onChatHistoryChange={setChatHistory}
              />
            </div>
          );
        }
        return (
          <div key="create-fallback">
            <LessonForm
              currentLang={currentLang}
              onSubmit={handleGenerate}
              isLoading={isLoading}
              error={error}
            />
          </div>
        );
      case 'create':
      default:
        return (
          <div key="create">
            <LessonForm
              currentLang={currentLang}
              onSubmit={handleGenerate}
              isLoading={isLoading}
              error={error}
            />
          </div>
        );
    }
  };

  return (
    <Layout
      currentLang={currentLang}
      onLangChange={handleLangChange}
      currentPage={currentView}
      onNavigate={handleNavigate}
    >
      {renderContent()}
      <SplineRobot />
    </Layout>
  );
};

export default App;