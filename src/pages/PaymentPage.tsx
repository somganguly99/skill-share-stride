import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { useToast } from '../hooks/use-toast';
import { CheckCircle, XCircle, CreditCard } from 'lucide-react';

const PaymentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
      return;
    }
    fetchCourse();
  }, [courseId, user, navigate]);

  const fetchCourse = async () => {
    try {
      const data = await api.getCourseById(Number(courseId));
      setCourse(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load course', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (success: boolean) => {
    try {
      if (success) {
        await api.enrollInCourse(user!.id, Number(courseId));
        toast({ title: 'Success', description: 'Payment successful! Enrollment pending admin approval.' });
        navigate('/student-dashboard');
      } else {
        toast({ 
          title: 'Payment Failed', 
          description: 'Your payment was unsuccessful. Please try again.', 
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to process payment', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!course) return <div className="flex items-center justify-center min-h-screen">Course not found</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle className="text-3xl">Payment Simulator</CardTitle>
          <CardDescription>Choose payment outcome for testing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{course.CName}</h3>
            <p className="text-muted-foreground mb-4">{course.CDescription}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Course Fee:</span>
              <span className="text-2xl font-bold text-primary">₹{course.Price}</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              This is a mock payment system. Select the outcome you want to simulate:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => handlePayment(true)} 
                className="h-24 flex flex-col gap-2"
                variant="default"
              >
                <CheckCircle className="h-8 w-8" />
                <span className="text-lg">Payment Successful</span>
              </Button>
              
              <Button 
                onClick={() => handlePayment(false)} 
                className="h-24 flex flex-col gap-2"
                variant="destructive"
              >
                <XCircle className="h-8 w-8" />
                <span className="text-lg">Payment Failed</span>
              </Button>
            </div>
          </div>

          <Button 
            onClick={() => navigate('/student-dashboard')} 
            variant="outline" 
            className="w-full"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;
