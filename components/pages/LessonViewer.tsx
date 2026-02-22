import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, MessageCircle, FileText, Link as LinkIcon, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface LessonViewerProps {
  lessonId: number;
}

export default function LessonViewer({ lessonId }: LessonViewerProps) {
  const [chatInput, setChatInput] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const lessonQuery = trpc.lessons.get.useQuery(lessonId);
  const sourcesQuery = trpc.lessons.getSources.useQuery(lessonId);
  const chatHistoryQuery = trpc.chat.getHistory.useQuery(lessonId);
  const exportChatMutation = trpc.chat.exportChatPDF.useMutation();
  const exportLessonMutation = trpc.lessons.exportPDF.useMutation();
  const addMessageMutation = trpc.chat.addMessage.useMutation();

  const lesson = lessonQuery.data;
  const sources = sourcesQuery.data || [];
  const chatHistory = chatHistoryQuery.data || [];

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    setIsLoadingChat(true);
    try {
      await addMessageMutation.mutateAsync({
        lessonId,
        role: 'user',
        content: chatInput,
      });
      setChatInput('');
      await chatHistoryQuery.refetch();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleExportChat = async () => {
    try {
      const result = await exportChatMutation.mutateAsync(lessonId);
      if (result.url) {
        window.open(result.url, '_blank');
      }
    } catch (error) {
      console.error('Failed to export chat:', error);
    }
  };

  const handleExportLesson = async () => {
    try {
      const result = await exportLessonMutation.mutateAsync(lessonId);
      if (result.url) {
        window.open(result.url, '_blank');
      }
    } catch (error) {
      console.error('Failed to export lesson:', error);
    }
  };

  if (lessonQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <p className="text-slate-600">Lesson not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const lessonContent = lesson.lessonContent as any;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{lesson.title}</h1>
          <div className="flex flex-wrap gap-2 items-center mb-4">
            <Badge variant="default">{lesson.module}</Badge>
            <Badge variant="secondary">{lesson.topic}</Badge>
            <Badge variant="outline">{lesson.lessonDepth}</Badge>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleExportLesson}
              disabled={exportLessonMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Lesson PDF
            </Button>
            <Button
              onClick={handleExportChat}
              disabled={exportChatMutation.isPending}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Chat PDF
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lesson Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="content">
                  <FileText className="w-4 h-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="sources">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Sources ({sources.length})
                </TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6">
                {/* Objectives */}
                {lessonContent.objectives && lessonContent.objectives.length > 0 && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">Learning Objectives</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {lessonContent.objectives.map((obj: string, idx: number) => (
                          <li key={idx} className="flex gap-3 text-sm text-slate-700">
                            <span className="font-semibold text-blue-600 flex-shrink-0">{idx + 1}.</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Key Concepts */}
                {lessonContent.concepts && lessonContent.concepts.length > 0 && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">Key Concepts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {lessonContent.concepts.map((concept: string, idx: number) => (
                          <Badge key={idx} variant="secondary">
                            {concept}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Definition and Structure */}
                {lessonContent.definitionAndStructure && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {lessonContent.definitionAndStructure.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {lessonContent.definitionAndStructure.content}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Historical Development */}
                {lessonContent.historicalDevelopment && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {lessonContent.historicalDevelopment.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {lessonContent.historicalDevelopment.content}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Glossary */}
                {lessonContent.glossary && lessonContent.glossary.length > 0 && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">Glossary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {lessonContent.glossary.map((item: any, idx: number) => (
                          <div key={idx} className="border-b pb-3 last:border-b-0">
                            <h4 className="font-semibold text-slate-900">{item.term}</h4>
                            <p className="text-sm text-slate-600 mt-1">{item.definition}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Conclusion */}
                {lessonContent.conclusion && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">Conclusion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {lessonContent.conclusion}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Sources Tab */}
              <TabsContent value="sources">
                {sources.length === 0 ? (
                  <Card className="border-0 shadow-lg">
                    <CardContent className="pt-6">
                      <p className="text-slate-600 text-center">No sources found for this lesson</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {sources.map((source: any, idx: number) => (
                      <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-slate-900 line-clamp-2">
                                {source.title}
                              </h4>
                              <p className="text-xs text-slate-500 mt-1">{source.domain}</p>
                              {source.snippet && (
                                <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                                  {source.snippet}
                                </p>
                              )}
                              {source.relevanceScore && (
                                <div className="mt-2">
                                  <span className="text-xs font-semibold text-slate-700">
                                    Relevance: {Math.round(source.relevanceScore * 100)}%
                                  </span>
                                </div>
                              )}
                            </div>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 flex-shrink-0"
                            >
                              <LinkIcon className="w-5 h-5" />
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg h-full flex flex-col">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  AI Teacher
                </CardTitle>
                <CardDescription>Ask questions about this lesson</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col overflow-hidden pt-4">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
                  {chatHistory.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">
                      Start a conversation with the AI Teacher
                    </p>
                  ) : (
                    chatHistory.map((msg: any, idx: number) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-900'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask a question..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !isLoadingChat) {
                          handleSendMessage();
                        }
                      }}
                      disabled={isLoadingChat}
                      className="text-sm"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoadingChat || !chatInput.trim()}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoadingChat ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Send'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
