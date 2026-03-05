import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Award, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-base text-foreground leading-tight">Office Skills</h1>
            <p className="text-xs text-muted-foreground leading-tight">Training App</p>
          </div>
        </div>
        <a href="/api/login">
          <Button data-testid="button-login-header" size="sm">Sign In</Button>
        </a>
      </header>

      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            Don Bosco Erdem Vocational School
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight max-w-2xl">
            Master Office Administration Skills
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mb-8 leading-relaxed">
            Interactive exercises designed for vocational students to practice document management, office procedures, and professional skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <a href="/api/login">
              <Button data-testid="button-login-hero" size="lg" className="px-8">
                Start Learning
              </Button>
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Free for all students</p>
        </section>

        <section className="border-t border-border bg-card px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-foreground text-center mb-8">What You Will Practice</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: FileText, title: "Document Matching", desc: "Match terms to their definitions" },
                { icon: BookOpen, title: "Document Structure", desc: "Arrange components in order" },
                { icon: Award, title: "Classification", desc: "Classify documents by type" },
                { icon: Users, title: "Case Studies", desc: "Solve labor contract scenarios" },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center text-center p-5 rounded-md border border-card-border bg-background gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{feature.title}</p>
                    <p className="text-muted-foreground text-xs mt-1">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          Office Skills Training App &mdash; Don Bosco Erdem Vocational School
        </p>
      </footer>
    </div>
  );
}
