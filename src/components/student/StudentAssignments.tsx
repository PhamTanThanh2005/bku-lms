import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Search, Calendar, Award, BookOpen } from "lucide-react";
import {
  DEMO_ASSIGNMENTS,
  DEMO_COURSES,
  COURSE_ENROLLMENTS,
  User,
} from "../../lib/mockData";

interface StudentAssignmentsProps {
  user: User;
  onNavigate: (page: string, data?: any) => void;
}

export function StudentAssignments({
  user,
  onNavigate,
}: StudentAssignmentsProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const myCourses = DEMO_COURSES.filter((course) =>
    COURSE_ENROLLMENTS[course.id]?.includes(user.id)
  );

  const myAssignments = DEMO_ASSIGNMENTS.filter((assignment) =>
    myCourses.some((course) => course.id === assignment.courseId)
  );

  const filteredAssignments = myAssignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingAssignments = filteredAssignments.filter(
    (a) => a.status === "pending"
  );
  const submittedAssignments = filteredAssignments.filter(
    (a) => a.status === "submitted"
  );
  const gradedAssignments = filteredAssignments.filter(
    (a) => a.status === "graded"
  );
  const overdueAssignments = filteredAssignments.filter(
    (a) => a.status === "overdue"
  );

  const getStatusInfo = (status: string) => {
    const variants: {
      [key: string]: { variant: any; label: string; color: string };
    } = {
      pending: {
        variant: "default",
        label: "Chưa nộp",
        color: "bg-orange-100",
      },
      submitted: {
        variant: "secondary",
        label: "Đã nộp",
        color: "bg-blue-100",
      },
      graded: { variant: "default", label: "Đã chấm", color: "bg-green-100" },
      overdue: {
        variant: "destructive",
        label: "Quá hạn",
        color: "bg-red-100",
      },
    };
    return variants[status] || variants.pending;
  };

  const renderAssignmentCard = (assignment: (typeof DEMO_ASSIGNMENTS)[0]) => {
    const statusInfo = getStatusInfo(assignment.status);
    const dueDate = new Date(assignment.dueDate);

    return (
      <Card
        key={assignment.id}
        className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
        onClick={() =>
          onNavigate("assignment-detail", { assignmentId: assignment.id })
        }
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-primary">
                  {assignment.title}
                </h3>
                <Badge variant={statusInfo.variant as any}>
                  {statusInfo.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <BookOpen className="w-4 h-4" />
                <span>{assignment.courseName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm pt-2 border-t mt-2">
            <div className="flex items-center gap-1 text-muted-foreground font-medium">
              <Calendar className="w-4 h-4 text-destructive" />
              <span className="text-destructive">
                Hạn: {dueDate.toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex items-center gap-1 text-primary font-bold">
              <Award className="w-4 h-4" />
              <span>{assignment.maxScore} điểm</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="uppercase text-primary text-3xl font-bold">
          Bài tập của tôi
        </h1>
        <p className="text-muted-foreground mt-1 italic">
          Quản lý và theo dõi các bài tập
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary" />
        <Input
          placeholder="Tìm kiếm bài tập..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2 items-center hover:border-primary transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-primary">
              Chưa nộp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">
              {pendingAssignments.length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 items-center hover:border-primary transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-primary">
              Đã nộp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">
              {submittedAssignments.length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 items-center hover:border-primary transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-primary">
              Đã chấm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">
              {gradedAssignments.length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 items-center hover:border-primary transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-primary">
              Quá hạn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">
              {overdueAssignments.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-5 bg-muted p-1">
          <TabsTrigger value="all" className="font-semibold">
            Tất cả
          </TabsTrigger>
          <TabsTrigger value="pending" className="font-semibold">
            Chưa nộp
          </TabsTrigger>
          <TabsTrigger value="submitted" className="font-semibold">
            Đã nộp
          </TabsTrigger>
          <TabsTrigger value="graded" className="font-semibold">
            Đã chấm
          </TabsTrigger>
          <TabsTrigger value="overdue" className="font-semibold">
            Quá hạn
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 pt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {filteredAssignments.map(renderAssignmentCard)}
          </div>
          {filteredAssignments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground italic">
              Không tìm thấy bài tập nào
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 pt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {pendingAssignments.map(renderAssignmentCard)}
          </div>
          {pendingAssignments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground italic">
              Không có bài tập chưa nộp
            </div>
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4 pt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {submittedAssignments.map(renderAssignmentCard)}
          </div>
          {submittedAssignments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground italic">
              Chưa có bài tập nào đã nộp
            </div>
          )}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4 pt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {gradedAssignments.map(renderAssignmentCard)}
          </div>
          {gradedAssignments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground italic">
              Chưa có bài tập nào đã chấm
            </div>
          )}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4 pt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {overdueAssignments.map(renderAssignmentCard)}
          </div>
          {overdueAssignments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground italic">
              Không có bài tập quá hạn
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
