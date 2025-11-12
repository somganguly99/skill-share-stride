// API base URL - update this to your XAMPP backend URL
const API_BASE_URL = 'http://localhost:3000/api';

interface LoginResponse {
  success: boolean;
  user?: any;
  message?: string;
}

export const api = {
  // Authentication
  login: async (email: string, password: string, role: 'student' | 'instructor' | 'admin'): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    return response.json();
  },

  register: async (data: any, role: 'student' | 'instructor') => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, role }),
    });
    return response.json();
  },

  // Courses
  getCourses: async () => {
    const response = await fetch(`${API_BASE_URL}/courses`);
    return response.json();
  },

  getCourseById: async (courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
    return response.json();
  },

  createCourseRequest: async (courseData: any, instructorId: number) => {
    const response = await fetch(`${API_BASE_URL}/courses/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...courseData, instructorId }),
    });
    return response.json();
  },

  // Enrollment
  enrollInCourse: async (studentId: number, courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, courseId }),
    });
    return response.json();
  },

  getStudentEnrollments: async (studentId: number) => {
    const response = await fetch(`${API_BASE_URL}/enrollments/student/${studentId}`);
    return response.json();
  },

  // Admin
  getPendingEnrollments: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/enrollments/pending`);
    return response.json();
  },

  getPendingCourses: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/courses/pending`);
    return response.json();
  },

  approveEnrollment: async (studentId: number, courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/admin/enrollments/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, courseId }),
    });
    return response.json();
  },

  rejectEnrollment: async (studentId: number, courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/admin/enrollments/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, courseId }),
    });
    return response.json();
  },

  approveCourse: async (courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/admin/courses/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    });
    return response.json();
  },

  rejectCourse: async (courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/admin/courses/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    });
    return response.json();
  },

  removeStudentFromCourse: async (studentId: number, courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/admin/enrollments/remove`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, courseId }),
    });
    return response.json();
  },

  // Quiz
  createQuiz: async (courseId: number, quizData: any) => {
    const response = await fetch(`${API_BASE_URL}/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, ...quizData }),
    });
    return response.json();
  },

  getQuizzesByCourse: async (courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/quiz/course/${courseId}`);
    return response.json();
  },

  submitQuizAttempt: async (studentId: number, quizId: number, answers: any) => {
    const response = await fetch(`${API_BASE_URL}/quiz/attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, quizId, answers }),
    });
    return response.json();
  },

  // Certificate
  generateCertificate: async (studentId: number, courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/certificate/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, courseId }),
    });
    return response.json();
  },

  getCertificate: async (studentId: number, courseId: number) => {
    const response = await fetch(`${API_BASE_URL}/certificate/${studentId}/${courseId}`);
    return response.json();
  },
};
