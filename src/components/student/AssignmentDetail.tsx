import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, Upload, Download, Calendar, Award } from "lucide-react";
import { DEMO_ASSIGNMENTS, DEMO_SUBMISSIONS } from "../../lib/mockData";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";

interface AssignmentDetailProps {
  assignmentId: string;
  onNavigate: (page: string, data?: any) => void;
}

export function AssignmentDetail({
  assignmentId,
  onNavigate,
}: AssignmentDetailProps) {
  const assignment = DEMO_ASSIGNMENTS.find((a) => a.id === assignmentId);
  const [submissionText, setSubmissionText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!assignment) {
    return <div>Không tìm thấy bài tập</div>;
  }

  const getStatusInfo = (status: string) => {
    const variants: {
      [key: string]: { variant: any; label: string; color: string };
    } = {
      pending: {
        variant: "default",
        label: "Chưa nộp",
        color: "text-orange-600",
      },
      submitted: {
        variant: "secondary",
        label: "Đã nộp",
        color: "text-blue-600",
      },
      graded: { variant: "default", label: "Đã chấm", color: "text-green-600" },
      overdue: {
        variant: "destructive",
        label: "Quá hạn",
        color: "text-red-600",
      },
    };
    return variants[status] || variants.pending;
  };

  const statusInfo = getStatusInfo(assignment.status);
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = dueDate < new Date();

  const handleSubmit = () => {
    // Mock submission
    setSubmitted(true);
    setTimeout(() => {
      onNavigate("assignments");
    }, 1500);
  };

  const mySubmission = DEMO_SUBMISSIONS.find(
    (s) => s.assignmentId === assignmentId
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => onNavigate("assignments")}
          className="mb-4 font-semibold text-primary hover:bg-blue-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách bài tập
        </Button>
      </div>

      {submitted && (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <AlertDescription className="font-medium">
            Nộp bài thành công! Đang chuyển về danh sách bài tập...
          </AlertDescription>
        </Alert>
      )}

      {/* Assignment Info */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-primary font-bold text-xl uppercase">
                  {assignment.title}
                </CardTitle>
                <Badge variant={statusInfo.variant as any}>
                  {statusInfo.label}
                </Badge>
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                {assignment.courseName}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-primary font-bold mb-1 justify-end">
                <Award className="w-5 h-5" />
                <span>{assignment.maxScore} điểm</span>
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  isOverdue ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>
                  Hạn:{" "}
                  {dueDate.toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Mô tả bài tập</h3>
              <p className="text-gray-700">{assignment.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Submission */}
      {mySubmission ? (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-primary font-bold">
              Bài nộp của bạn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground font-semibold">
                  Thời gian nộp
                </label>
                <p className="font-medium">
                  {new Date(mySubmission.submittedAt).toLocaleString("vi-VN")}
                </p>
              </div>
              {mySubmission.score !== undefined && (
                <div>
                  <label className="text-sm text-muted-foreground font-semibold">
                    Điểm
                  </label>
                  <p className="text-destructive font-bold text-xl">
                    {mySubmission.score}/{assignment.maxScore}
                  </p>
                </div>
              )}
            </div>

            {mySubmission.fileUrl && (
              <div>
                <label className="text-sm text-muted-foreground font-semibold">
                  File đã nộp
                </label>
                <div className="flex items-center gap-2 mt-1 p-2 bg-blue-50 rounded border border-blue-100 w-fit">
                  <span className="font-medium text-primary">
                    {mySubmission.fileUrl}
                  </span>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {mySubmission.feedback && (
              <div>
                <label className="text-sm text-muted-foreground font-semibold">
                  Nhận xét của giảng viên
                </label>
                <div className="mt-1 p-3 bg-yellow-50 rounded-lg border border-yellow-100 text-gray-800 italic">
                  <p>"{mySubmission.feedback}"</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        // Submit Assignment Form
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-primary font-bold">
              Nộp bài tập
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="font-semibold">Ghi chú (tùy chọn)</label>
              <Textarea
                placeholder="Nhập ghi chú về bài làm của bạn..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                rows={4}
                className="border-gray-300"
              />
            </div>

            <div className="border-2 border-dashed border-primary/30 bg-blue-50/50 rounded-lg p-8 text-center hover:bg-blue-50 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2 font-medium">
                Kéo và thả file hoặc
              </p>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Chọn file
              </Button>
              <p className="text-xs text-muted-foreground mt-2 italic">
                Hỗ trợ: PDF, DOC, DOCX, ZIP (Tối đa 10MB)
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSubmit}
                className="bg-primary flex-1 font-bold"
                disabled={isOverdue}
              >
                {isOverdue ? "Đã quá hạn" : "Nộp bài"}
              </Button>
              <Button
                variant="outline"
                onClick={() => onNavigate("assignments")}
              >
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
