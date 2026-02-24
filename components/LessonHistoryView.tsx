import React, { useState, useEffect } from 'react';
import { StoredLesson } from '../types';
import { getAllLessons, deleteLesson, searchLessons, updateLessonMetadata } from '../services/lessonStorageService';

interface LessonHistoryViewProps {
  onSelectLesson: (lesson: StoredLesson) => void;
  currentLang: string;
}

export const LessonHistoryView: React.FC<LessonHistoryViewProps> = ({ onSelectLesson, currentLang }) => {
  const [lessons, setLessons] = useState<StoredLesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<StoredLesson[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessons();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchLessons(searchQuery).then(setFilteredLessons);
    } else {
      setFilteredLessons(lessons);
    }
  }, [searchQuery, lessons]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const all = await getAllLessons();
      setLessons(all);
      setFilteredLessons(all);
    } catch (error) {
      console.error('Failed to load lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this lesson permanently?')) {
      await deleteLesson(id);
      await loadLessons();
    }
  };

  const handleRateLesson = async (id: string, rating: number) => {
    await updateLessonMetadata(id, { rating });
    await loadLessons();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(currentLang === 'uz_latin' ? 'en-US' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-600">Loading history...</div>;
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-2">No lessons generated yet</p>
        <p className="text-sm text-slate-500">Your generated lessons will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search lessons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredLessons.length === 0 ? (
        <div className="text-center py-8 text-slate-600">No results found</div>
      ) : (
        <div className="grid gap-3">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
              onClick={() => onSelectLesson(lesson)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">{lesson.title}</h4>
                  <div className="text-sm text-slate-600 mt-1">
                    <span>{lesson.module}</span> · <span>{lesson.topic}</span>
                  </div>
                </div>
                <div className="text-sm text-slate-500 whitespace-nowrap ml-2">
                  {formatDate(lesson.createdAt)}
                </div>
              </div>

              {lesson.rating && (
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < lesson.rating! ? 'text-yellow-400' : 'text-slate-300'}>
                      ★
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between gap-2 text-sm">
                <div className="flex gap-1 flex-wrap">
                  {lesson.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchQuery(tag);
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(lesson.id);
                  }}
                  className="text-red-600 hover:text-red-700 text-xs font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
