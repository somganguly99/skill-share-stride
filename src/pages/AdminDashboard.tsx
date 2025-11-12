import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LogOut, CheckCircle, XCircle, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [enrollments, courses, allCoursesData] = await Promise.all([
        api.getPendingEnrollments(),
        api.getPendingCourses(),
        api.getCourses(),
      ]);
      setPendingEnrollments(enrollments);
      setPendingCourses(courses);
      setAllCourses(allCoursesData);
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

  const handleApproveEnrollment = async (studentId: number, courseId: number) => {
    try {
      await api.approveEnrollment(studentId, courseId);
      toast({ title: 'Success', description: 'Enrollment approved' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve enrollment', variant: 'destructive' });
    }
  };

  const handleRejectEnrollment = async (studentId: number, courseId: number) => {
    try {
      await api.rejectEnrollment(studentId, courseId);
      toast({ title: 'Success', description: 'Enrollment rejected' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reject enrollment', variant: 'destructive' });
    }
  };

  const handleApproveCourse = async (courseId: number) => {
    try {
      await api.approveCourse(courseId);
      toast({ title: 'Success', description: 'Course approved' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve course', variant: 'destructive' });
    }
  };

  const handleRejectCourse = async (courseId: number) => {
    try {
      await api.rejectCourse(courseId);
      toast({ title: 'Success', description: 'Course rejected' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reject course', variant: 'destructive' });
    }
  };

  const handleRemoveStudent = async (studentId: number, courseId: number) => {
    try {
      await api.removeStudentFromCourse(studentId, courseId);
      toast({ title: 'Success', description: 'Student removed from course' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to remove student', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, Admin</span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="enrollments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="enrollments">Pending Enrollments</TabsTrigger>
            <TabsTrigger value="courses">Pending Courses</TabsTrigger>
            <TabsTrigger value="all-courses">All Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="enrollments">
            <div className="space-y-4">
              {pendingEnrollments.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No pending enrollments</p>
                  </CardContent>
                </Card>
              ) : (
                pendingEnrollments.map((enrollment: any) => (
                  <Card key={`${enrollment.StudentId}-${enrollment.CourseId}`}>
                    <CardHeader>
                      <CardTitle>{enrollment.StudentName}</CardTitle>
                      <CardDescription>wants to enroll in {enrollment.CourseName}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                      <Button onClick={() => handleApproveEnrollment(enrollment.StudentId, enrollment.CourseId)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        onClick={() => handleRejectEnrollment(enrollment.StudentId, enrollment.CourseId)} 
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <div className="space-y-4">
              {pendingCourses.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No pending course requests</p>
                  </CardContent>
                </Card>
              ) : (
                pendingCourses.map((course: any) => (
                  <Card key={course.CourseId}>
                    <CardHeader>
                      <CardTitle>{course.CName}</CardTitle>
                      <CardDescription>by {course.InstructorName} • ₹{course.Price}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{course.CDescription}</p>
                      <div className="flex gap-2">
                        <Button onClick={() => handleApproveCourse(course.CourseId)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button onClick={() => handleRejectCourse(course.CourseId)} variant="destructive">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="all-courses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCourses.map((course: any) => (
                <Card key={course.CourseId}>
                  <CardHeader>
                    <CardTitle>{course.CName}</CardTitle>
                    <CardDescription>{course.InstructorName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {course.Enrolled || 0} students enrolled
                    </p>
                    <Button 
                      onClick={() => navigate(`/admin/course/${course.CourseId}`)} 
                      variant="outline" 
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
