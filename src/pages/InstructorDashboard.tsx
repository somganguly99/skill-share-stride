import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { LogOut, Plus, BookOpen } from 'lucide-react';

const InstructorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'instructor') {
      navigate('/login');
      return;
    }
    fetchCourses();
  }, [user, navigate]);

  const fetchCourses = async () => {
    try {
      const data = await api.getCourses();
      const instructorCourses = data.filter((c: any) => c.InstructorId === user!.id);
      setCourses(instructorCourses);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load courses', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const videoUrl = formData.get('videoUrl') as string;
    const duration = formData.get('duration') as string;
    
    // Calculate price based on duration (500-2000 Rs)
    const durationInHours = parseFloat(duration);
    const price = Math.floor(500 + (durationInHours * 250));

    try {
      await api.createCourseRequest({
        CName: formData.get('name'),
        CDescription: formData.get('description'),
        Credits: Math.ceil(durationInHours * 2),
        CDuration: duration,
        videoUrl,
        Price: price,
        Level: 'beginner',
        Category: formData.get('category'),
      }, user!.id);
      
      toast({ title: 'Success', description: 'Course request submitted for admin approval' });
      setDialogOpen(false);
      fetchCourses();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit course request', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.name || user?.email}</span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">My Courses</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Request New Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Course Request</DialogTitle>
                <DialogDescription>Submit a new course for admin approval</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Course Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">YouTube Video URL</Label>
                  <Input id="videoUrl" name="videoUrl" type="url" placeholder="https://www.youtube.com/watch?v=..." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input id="duration" name="duration" type="number" step="0.5" min="1" max="10" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" placeholder="e.g., Programming, Design, Business" required />
                </div>
                <Button type="submit" className="w-full">Submit Request</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <Card key={course.CourseId} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{course.CName}</CardTitle>
                <CardDescription>₹{course.Price} • {course.CDuration}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{course.CDescription}</p>
                <div className="mt-4">
                  <Button 
                    onClick={() => navigate(`/instructor/course/${course.CourseId}`)} 
                    variant="outline" 
                    className="w-full"
                  >
                    Manage Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {courses.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No courses yet. Create your first course request!</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default InstructorDashboard;
