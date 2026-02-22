import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Loader2, BookOpen } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trpc } from '@/lib/trpc';

interface LessonFormData {
  topic: string;
  module: string;
  academicLevel: 'bachelor' | 'master' | 'phd';
  lessonDepth: 'overview' | 'standard' | 'advanced';
  simplicityLevel: 'child' | 'student' | 'researcher';
  lessonFocus: 'theoretical' | 'practical' | 'case_based' | 'legislative';
  structureOptions: {
    bulletPoints: boolean;
    tables: boolean;
    summaries: boolean;
    stepByStep: boolean;
    caseLaw: boolean;
    doctrines: boolean;
    comparativeAnalysis: boolean;
    practicalExercises: boolean;
    glossary: boolean;
    bibliography: boolean;
  };
}

interface GenerationProgress {
  sessionId: number;
  status: 'initializing' | 'searching_web' | 'generating' | 'finalizing' | 'completed' | 'failed';
  currentStage: string;
  progressPercent: number;
  errorMessage?: string;
}

export default function LessonGenerator() {
  const [formData, setFormData] = useState<LessonFormData>({
    topic: '',
    module: '',
    academicLevel: 'bachelor',
    lessonDepth: 'standard',
    simplicityLevel: 'student',
    lessonFocus: 'theoretical',
    structureOptions: {
      bulletPoints: true,
      tables: true,
      summaries: true,
      stepByStep: false,
      caseLaw: false,
      doctrines: false,
      comparativeAnalysis: false,
      practicalExercises: true,
      glossary: true,
      bibliography: true,
    },
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createSessionMutation = trpc.generation.createSession.useMutation();
  const updateProgressMutation = trpc.generation.updateProgress.useMutation();

  const handleInputChange = (field: keyof Omit<LessonFormData, 'structureOptions'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStructureChange = (option: keyof LessonFormData['structureOptions']) => {
    setFormData(prev => ({
      ...prev,
      structureOptions: {
        ...prev.structureOptions,
        [option]: !prev.structureOptions[option],
      },
    }));
  };

  const handleGenerateLesson = async () => {
    if (!formData.topic || !formData.module) {
      setError('Please fill in the topic and module fields');
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      // Create generation session
      const session = await createSessionMutation.mutateAsync({
        topic: formData.topic,
        module: formData.module,
      });

      if (session) {
        setProgress({
          sessionId: session.id,
          status: 'initializing',
          currentStage: 'Initializing lesson generation...',
          progressPercent: 10,
        });

        // Simulate generation stages
        // In production, this would be a real streaming connection
        setTimeout(() => {
          setProgress(prev => prev ? {
            ...prev,
            status: 'searching_web',
            currentStage: 'Searching the web for relevant sources...',
            progressPercent: 30,
          } : null);
        }, 1000);

        setTimeout(() => {
          setProgress(prev => prev ? {
            ...prev,
            status: 'generating',
            currentStage: 'Generating lesson content with AI...',
            progressPercent: 60,
          } : null);
        }, 3000);

        setTimeout(() => {
          setProgress(prev => prev ? {
            ...prev,
            status: 'finalizing',
            currentStage: 'Finalizing and formatting lesson...',
            progressPercent: 90,
          } : null);
        }, 6000);

        setTimeout(() => {
          setProgress(prev => prev ? {
            ...prev,
            status: 'completed',
            currentStage: 'Lesson generation complete!',
            progressPercent: 100,
          } : null);
          setIsGenerating(false);
        }, 8000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate lesson');
      setIsGenerating(false);
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'initializing':
        return 'bg-blue-500';
      case 'searching_web':
        return 'bg-purple-500';
      case 'generating':
        return 'bg-indigo-500';
      case 'finalizing':
        return 'bg-cyan-500';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">Lesson Generator</h1>
          </div>
          <p className="text-slate-600">Create customized AI-powered lessons with web research integration</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Progress Display */}
        {progress && (
          <Card className="mb-6 border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">Generation Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">{progress.currentStage}</span>
                  <span className="text-sm font-bold text-blue-600">{progress.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(progress.status)} transition-all duration-500 ease-out`}
                    style={{ width: `${progress.progressPercent}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Initializing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Web Search</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Generating</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span>Finalizing</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Form */}
        {!isGenerating && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle>Lesson Details</CardTitle>
              <CardDescription>Configure your lesson parameters and preferences</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="customization">Customization</TabsTrigger>
                  <TabsTrigger value="structure">Structure</TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="topic" className="text-sm font-semibold">
                        Lesson Topic *
                      </Label>
                      <Input
                        id="topic"
                        placeholder="e.g., Constitutional Law, Contract Formation"
                        value={formData.topic}
                        onChange={(e) => handleInputChange('topic', e.target.value)}
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <p className="text-xs text-slate-500">The main subject of your lesson</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="module" className="text-sm font-semibold">
                        Module/Course *
                      </Label>
                      <Input
                        id="module"
                        placeholder="e.g., Criminal Law, International Relations"
                        value={formData.module}
                        onChange={(e) => handleInputChange('module', e.target.value)}
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <p className="text-xs text-slate-500">The broader course or module</p>
                    </div>
                  </div>
                </TabsContent>

                {/* Customization Tab */}
                <TabsContent value="customization" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level" className="text-sm font-semibold">
                        Academic Level
                      </Label>
                      <Select value={formData.academicLevel} onValueChange={(value) => handleInputChange('academicLevel', value)}>
                        <SelectTrigger id="level">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                          <SelectItem value="master">Master's Degree</SelectItem>
                          <SelectItem value="phd">PhD Level</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500">Target education level</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="depth" className="text-sm font-semibold">
                        Lesson Depth
                      </Label>
                      <Select value={formData.lessonDepth} onValueChange={(value) => handleInputChange('lessonDepth', value)}>
                        <SelectTrigger id="depth">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="overview">Overview</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500">How detailed the lesson should be</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="simplicity" className="text-sm font-semibold">
                        Simplicity Level
                      </Label>
                      <Select value={formData.simplicityLevel} onValueChange={(value) => handleInputChange('simplicityLevel', value)}>
                        <SelectTrigger id="simplicity">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="child">Simple (Child-friendly)</SelectItem>
                          <SelectItem value="student">Standard (Student level)</SelectItem>
                          <SelectItem value="researcher">Complex (Researcher level)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500">Language and concept complexity</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="focus" className="text-sm font-semibold">
                        Lesson Focus
                      </Label>
                      <Select value={formData.lessonFocus} onValueChange={(value) => handleInputChange('lessonFocus', value)}>
                        <SelectTrigger id="focus">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="theoretical">Theoretical</SelectItem>
                          <SelectItem value="practical">Practical</SelectItem>
                          <SelectItem value="case_based">Case-Based</SelectItem>
                          <SelectItem value="legislative">Legislative</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500">Primary focus of the lesson</p>
                    </div>
                  </div>
                </TabsContent>

                {/* Structure Tab */}
                <TabsContent value="structure" className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-sm font-semibold text-slate-900 mb-4">Select content elements to include:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(formData.structureOptions).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-3 p-2 rounded hover:bg-slate-100 transition-colors">
                          <Checkbox
                            id={key}
                            checked={value}
                            onCheckedChange={() => handleStructureChange(key as keyof LessonFormData['structureOptions'])}
                          />
                          <Label htmlFor={key} className="text-sm font-medium cursor-pointer flex-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Generate Button */}
              <div className="mt-8 flex gap-3">
                <Button
                  onClick={handleGenerateLesson}
                  disabled={isGenerating || !formData.topic || !formData.module}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Lesson'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
