import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogOut, BookOpen, Award } from 'lucide-react';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [coursesData, enrolledData] = await Promise.all([
        api.getCourses(),
        api.getStudentEnrollments(user!.id),
      ]);
      setCourses(coursesData);
      setEnrolledCourses(enrolledData);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePurchase = (courseId: number) => {
    navigate(`/payment/${courseId}`);
  };

  const handleViewCourse = (courseId: number) => {
    navigate(`/course/${courseId}`);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Student Dashboard</h1>
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
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">My Enrolled Courses</h2>
          {enrolledCourses.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">You haven't enrolled in any courses yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course: any) => (
                <Card key={course.CourseId} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{course.CName}</CardTitle>
                    <CardDescription>{course.InstructorName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.CDescription}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-sm">{course.Credits} Credits</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => handleViewCourse(course.CourseId)} className="w-full">
                      Continue Learning
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Available Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.filter((c: any) => !enrolledCourses.find((ec: any) => ec.CourseId === c.CourseId)).map((course: any) => (
              <Card key={course.CourseId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{course.CName}</CardTitle>
                      <CardDescription>{course.InstructorName}</CardDescription>
                    </div>
                    <span className="text-lg font-bold text-primary">₹{course.Price}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{course.CDescription}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-secondary rounded-full">{course.Level}</span>
                    <span className="text-xs px-2 py-1 bg-secondary rounded-full">{course.CDuration}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handlePurchase(course.CourseId)} className="w-full">
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
