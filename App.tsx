import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { LessonForm } from './components/LessonForm';
import { LessonRenderer } from './components/LessonRenderer';
import { About } from './components/About';
import { LessonHistoryView } from './components/LessonHistoryView';
import { Language, LessonFormState, LessonResponse, ViewState, ChatMessage, StoredLesson } from './types';
import { generateLesson } from './services/geminiService';
import { TRANSLATIONS } from './constants';
import { saveLesson, getAllLessons } from './services/lessonStorageService';

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

  // Credits state
  const [userCredits, setUserCredits] = useState<number>(() => {
    const saved = localStorage.getItem('learnify_credits');
    return saved ? parseInt(saved, 10) : 5000; // Default 5000 credits
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('learnify_lang', currentLang);
  }, [currentLang]);

  useEffect(() => {
    localStorage.setItem('learnify_credits', userCredits.toString());
  }, [userCredits]);

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

      // Auto-save lesson
      const storedLesson: StoredLesson = {
        id: `lesson_${Date.now()}`,
        title: data.title,
        module: formData.module,
        topic: formData.topic,
        content: data,
        chatHistory: [{ role: 'model', content: TRANSLATIONS[currentLang].aiGreeting }],
        createdAt: new Date(),
        lastViewed: new Date(),
        tags: [formData.module, formData.depth],
        sourceCredits: 200, // Placeholder
      };

      try {
        await saveLesson(storedLesson);
      } catch (storageError) {
        console.warn('Failed to save lesson to history:', storageError);
      }

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

  const handleSelectLessonFromHistory = (lesson: StoredLesson) => {
    setLessonData(lesson.content);
    setChatHistory(lesson.chatHistory);
    setCurrentView('lesson');
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
                    userCredits={userCredits}
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
                    userCredits={userCredits}
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
      userCredits={userCredits}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;