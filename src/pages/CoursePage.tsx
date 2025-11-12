import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { PlayCircle, CheckCircle, Award, ArrowLeft } from 'lucide-react';

interface Module {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  completed: boolean;
}

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
      return;
    }
    fetchCourseData();
  }, [courseId, user, navigate]);

  const fetchCourseData = async () => {
    try {
      const courseData = await api.getCourseById(Number(courseId));
      setCourse(courseData);
      
      // Generate modules from video duration (mock data)
      const mockModules: Module[] = [
        { id: 1, title: 'Introduction', startTime: '0:00', endTime: '10:30', completed: false },
        { id: 2, title: 'Core Concepts', startTime: '10:30', endTime: '25:45', completed: false },
        { id: 3, title: 'Practical Applications', startTime: '25:45', endTime: '42:15', completed: false },
        { id: 4, title: 'Advanced Topics', startTime: '42:15', endTime: '58:00', completed: false },
        { id: 5, title: 'Conclusion & Summary', startTime: '58:00', endTime: '1:05:00', completed: false },
      ];
      setModules(mockModules);
      
      const quizzesData = await api.getQuizzesByCourse(Number(courseId));
      setQuizzes(quizzesData);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load course', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleModuleCompletion = (moduleId: number) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, completed: !m.completed } : m
    ));
  };

  const handleQuizAttempt = (quizId: number) => {
    if (!completedQuizzes.includes(quizId)) {
      setCompletedQuizzes([...completedQuizzes, quizId]);
      toast({ title: 'Quiz completed!', description: 'Your attempt has been recorded.' });
    }
  };

  const canGenerateCertificate = () => {
    return modules.every(m => m.completed) && completedQuizzes.length === quizzes.length && quizzes.length > 0;
  };

  const handleGenerateCertificate = async () => {
    try {
      await api.generateCertificate(user!.id, Number(courseId));
      toast({ title: 'Congratulations!', description: 'Your certificate has been generated.' });
      navigate('/student-dashboard');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to generate certificate', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!course) return <div className="flex items-center justify-center min-h-screen">Course not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button onClick={() => navigate('/student-dashboard')} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{course.CName}</h1>
          <p className="text-muted-foreground">{course.InstructorName}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <PlayCircle className="h-20 w-20 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="modules">
              <TabsList className="w-full">
                <TabsTrigger value="modules" className="flex-1">Modules</TabsTrigger>
                <TabsTrigger value="quizzes" className="flex-1">Quizzes</TabsTrigger>
              </TabsList>

              <TabsContent value="modules">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Modules</CardTitle>
                    <CardDescription>Complete all modules to earn your certificate</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {modules.map((module) => (
                      <div key={module.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Checkbox 
                          checked={module.completed}
                          onCheckedChange={() => toggleModuleCompletion(module.id)}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{module.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {module.startTime} - {module.endTime}
                          </p>
                        </div>
                        {module.completed && <CheckCircle className="h-5 w-5 text-primary" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quizzes">
                <Card>
                  <CardHeader>
                    <CardTitle>Module Quizzes</CardTitle>
                    <CardDescription>Attempt all quizzes to complete the course</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {quizzes.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No quizzes available yet</p>
                    ) : (
                      quizzes.map((quiz: any) => (
                        <div key={quiz.QuizId} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold">Module Quiz {quiz.QuizId}</h4>
                              <p className="text-sm text-muted-foreground">Total Marks: {quiz.TotalMarks}</p>
                            </div>
                            <Button 
                              onClick={() => handleQuizAttempt(quiz.QuizId)}
                              disabled={completedQuizzes.includes(quiz.QuizId)}
                            >
                              {completedQuizzes.includes(quiz.QuizId) ? 'Completed' : 'Attempt Quiz'}
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Modules</span>
                    <span>{modules.filter(m => m.completed).length} / {modules.length}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${(modules.filter(m => m.completed).length / modules.length) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Quizzes</span>
                    <span>{completedQuizzes.length} / {quizzes.length}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: quizzes.length > 0 ? `${(completedQuizzes.length / quizzes.length) * 100}%` : '0%' }}
                    />
                  </div>
                </div>

                {canGenerateCertificate() ? (
                  <Button onClick={handleGenerateCertificate} className="w-full">
                    <Award className="h-4 w-4 mr-2" />
                    Generate Certificate
                  </Button>
                ) : (
                  <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground text-center">
                    Complete all modules and quizzes to earn your certificate
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursePage;
