import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen, FileText, Layout, FolderOpen, Briefcase, HelpCircle,
  ChevronRight, LogOut, CheckCircle2
} from "lucide-react";
import type { Lesson, UserProgress } from "@shared/schema";

const ICON_MAP: Record<string, any> = {
  BookOpen, FileText, Layout, FolderOpen, Briefcase, HelpCircle
};

const COLOR_MAP: Record<string, { bg: string; icon: string; badge: string }> = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-950/30",   icon: "text-blue-600 dark:text-blue-400",   badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" },
  green:  { bg: "bg-green-50 dark:bg-green-950/30", icon: "text-green-600 dark:text-green-400", badge: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/30", icon: "text-purple-600 dark:text-purple-400", badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300" },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/30", icon: "text-orange-600 dark:text-orange-400", badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300" },
  red:    { bg: "bg-red-50 dark:bg-red-950/30",     icon: "text-red-600 dark:text-red-400",     badge: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300" },
  teal:   { bg: "bg-teal-50 dark:bg-teal-950/30",   icon: "text-teal-600 dark:text-teal-400",   badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300" },
};

function LessonCard({ lesson, progressList }: { lesson: Lesson; progressList: UserProgress[] }) {
  const [, navigate] = useLocation();
  const IconComp = ICON_MAP[lesson.icon] || BookOpen;
  const colors = COLOR_MAP[lesson.color] || COLOR_MAP.blue;

  const lessonProgress = progressList.filter(p => p.lessonId === lesson.id);
  const completedCount = lessonProgress.filter(p => p.completed).length;
  const totalExercises = lessonProgress.length;
  const isStarted = lessonProgress.length > 0;
  const isComplete = completedCount > 0 && completedCount === totalExercises;
  const progressPct = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

  return (
    <Card
      className="cursor-pointer hover-elevate border-card-border"
      onClick={() => navigate(`/lessons/${lesson.id}`)}
      data-testid={`card-lesson-${lesson.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className={`w-11 h-11 rounded-md ${colors.bg} flex items-center justify-center flex-shrink-0`}>
            <IconComp className={`w-5 h-5 ${colors.icon}`} />
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {isComplete && (
              <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Done
              </span>
            )}
            {isStarted && !isComplete && (
              <Badge variant="outline" className={`text-xs ${colors.badge} border-transparent`}>
                In Progress
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-3">
          <h3 className="font-semibold text-foreground text-sm leading-snug">{lesson.title}</h3>
          <p className="text-muted-foreground text-xs mt-1 leading-relaxed line-clamp-2">{lesson.description}</p>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isStarted ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{completedCount} of {totalExercises} completed</span>
              <span>{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-1.5" />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Not started yet</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const { user, isLoading: authLoading } = useAuth();

  const { data: lessons = [], isLoading: lessonsLoading } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"],
    enabled: !!user,
  });

  const { data: progressList = [], isLoading: progressLoading } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress"],
    enabled: !!user,
  });

  const completedLessons = lessons.filter(lesson => {
    const lessonProg = progressList.filter(p => p.lessonId === lesson.id);
    return lessonProg.length > 0 && lessonProg.every(p => p.completed);
  }).length;

  const displayName = user?.firstName || user?.email?.split("@")[0] || "Student";
  const initials = (user?.firstName?.[0] || "") + (user?.lastName?.[0] || displayName[0] || "S");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-50 px-4 md:px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-sm text-foreground leading-tight">Office Skills Training</h1>
              <p className="text-xs text-muted-foreground">Don Bosco Erdem</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.profileImageUrl || undefined} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                  {initials.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground hidden sm:block">{displayName}</span>
            </div>
            <a href="/api/logout">
              <Button variant="ghost" size="icon" data-testid="button-logout">
                <LogOut className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 md:px-6 py-6 max-w-3xl mx-auto w-full">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Welcome back, {displayName}!
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {completedLessons === 0
              ? "Pick a lesson below to start practicing."
              : `You've completed ${completedLessons} of ${lessons.length} lessons. Keep going!`
            }
          </p>
        </div>

        {(lessonsLoading || progressLoading || authLoading) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-card-border">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-11 h-11 rounded-md" />
                    <div className="flex-1 space-y-2 mt-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-2 w-full rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lessons.map(lesson => (
              <LessonCard key={lesson.id} lesson={lesson} progressList={progressList} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
