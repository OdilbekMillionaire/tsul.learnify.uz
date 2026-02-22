import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Download, Trash2, Eye, MessageSquare, Calendar, BookMarked, Search } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

interface Lesson {
  id: number;
  title: string;
  module: string;
  topic: string;
  createdAt: Date;
  userRating?: number;
  userFeedback?: string;
  lessonDepth: string;
  academicLevel: string;
}

export default function LessonHistory() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [ratingData, setRatingData] = useState({
    rating: 5,
    feedback: '',
    contentQuality: 5,
    accuracy: 5,
    clarity: 5,
    relevance: 5,
  });

  const lessonsQuery = trpc.lessons.list.useQuery({ limit: 50 });
  const deleteLessonMutation = trpc.lessons.delete.useMutation();
  const rateLessonMutation = trpc.ratings.rate.useMutation();
  const exportPDFMutation = trpc.lessons.exportPDF.useMutation();

  const lessons = (lessonsQuery.data || []) as Lesson[];
  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.module.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteLesson = async (lessonId: number) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      try {
        await deleteLessonMutation.mutateAsync(lessonId);
        lessonsQuery.refetch();
      } catch (error) {
        console.error('Failed to delete lesson:', error);
      }
    }
  };

  const handleExportPDF = async (lessonId: number) => {
    try {
      const result = await exportPDFMutation.mutateAsync(lessonId);
      if (result.url) {
        window.open(result.url, '_blank');
      }
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  const handleRateLesson = async (lessonId: number) => {
    try {
      await rateLessonMutation.mutateAsync({
        lessonId,
        ...ratingData,
      });
      lessonsQuery.refetch();
      setSelectedLesson(null);
    } catch (error) {
      console.error('Failed to rate lesson:', error);
    }
  };

  const renderStars = (rating: number, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => onRate?.(star)}
            className={`transition-colors ${
              star <= rating
                ? 'text-yellow-400'
                : 'text-gray-300'
            } ${onRate ? 'cursor-pointer hover:text-yellow-300' : 'cursor-default'}`}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Lesson History</h1>
          <p className="text-slate-600">View, manage, and rate your generated lessons</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search lessons by title, topic, or module..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Lessons Grid */}
        {filteredLessons.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-12 pb-12 text-center">
              <BookMarked className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No lessons found</h3>
              <p className="text-slate-600">
                {lessons.length === 0
                  ? 'Start by generating your first lesson'
                  : 'Try adjusting your search query'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map(lesson => (
              <Card key={lesson.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <CardTitle className="text-lg line-clamp-2">{lesson.title}</CardTitle>
                    <Badge variant="secondary" className="whitespace-nowrap">
                      {lesson.lessonDepth}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      {formatDate(lesson.createdAt)}
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-4 space-y-4">
                  {/* Lesson Info */}
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-slate-700">Module:</span>
                      <p className="text-slate-600">{lesson.module}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Topic:</span>
                      <p className="text-slate-600">{lesson.topic}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Level:</span>
                      <p className="text-slate-600">{lesson.academicLevel}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="border-t pt-3">
                    <p className="text-xs font-semibold text-slate-700 mb-2">Your Rating</p>
                    {lesson.userRating ? (
                      <div className="space-y-2">
                        {renderStars(lesson.userRating)}
                        {lesson.userFeedback && (
                          <p className="text-xs text-slate-600 italic">{lesson.userFeedback}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">Not rated yet</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{lesson.title}</DialogTitle>
                          <DialogDescription>
                            {lesson.module} • {lesson.topic}
                          </DialogDescription>
                        </DialogHeader>
                        {/* Lesson content would be displayed here */}
                        <div className="py-4">
                          <p className="text-sm text-slate-600">Lesson content preview...</p>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleExportPDF(lesson.id)}
                      disabled={exportPDFMutation.isPending}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setSelectedLesson(lesson)}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Rate
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Rate Lesson</DialogTitle>
                          <DialogDescription>
                            Share your feedback on this lesson
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label className="text-sm font-semibold mb-2 block">Overall Rating</Label>
                            {renderStars(ratingData.rating, (rating) =>
                              setRatingData(prev => ({ ...prev, rating }))
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs font-semibold mb-1 block">Content Quality</Label>
                              {renderStars(ratingData.contentQuality, (rating) =>
                                setRatingData(prev => ({ ...prev, contentQuality: rating }))
                              )}
                            </div>
                            <div>
                              <Label className="text-xs font-semibold mb-1 block">Accuracy</Label>
                              {renderStars(ratingData.accuracy, (rating) =>
                                setRatingData(prev => ({ ...prev, accuracy: rating }))
                              )}
                            </div>
                            <div>
                              <Label className="text-xs font-semibold mb-1 block">Clarity</Label>
                              {renderStars(ratingData.clarity, (rating) =>
                                setRatingData(prev => ({ ...prev, clarity: rating }))
                              )}
                            </div>
                            <div>
                              <Label className="text-xs font-semibold mb-1 block">Relevance</Label>
                              {renderStars(ratingData.relevance, (rating) =>
                                setRatingData(prev => ({ ...prev, relevance: rating }))
                              )}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="feedback" className="text-sm font-semibold mb-2 block">
                              Feedback (Optional)
                            </Label>
                            <Textarea
                              id="feedback"
                              placeholder="Share your thoughts about this lesson..."
                              value={ratingData.feedback}
                              onChange={(e) => setRatingData(prev => ({ ...prev, feedback: e.target.value }))}
                              className="min-h-24"
                            />
                          </div>

                          <Button
                            onClick={() => handleRateLesson(lesson.id)}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={rateLessonMutation.isPending}
                          >
                            Submit Rating
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDeleteLesson(lesson.id)}
                      disabled={deleteLessonMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
