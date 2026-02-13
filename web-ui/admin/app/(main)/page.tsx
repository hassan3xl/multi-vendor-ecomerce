"use client";

import React, { useState } from "react";
import { Sun, Moon, Palette, Code, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeDemo() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // Toggle dark class on document element for proper shadcn/ui theming
    if (!isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Beautiful Design System</span>
          </div>
          <h2 className="text-5xl font-bold mb-4">Explore Your Theme</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A comprehensive demonstration of your custom shadcn/ui theme with
            smooth dark mode support using OKLCH colors.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </section>

        {/* Color Palette Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Palette className="w-8 h-8" />
            Color Palette
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ColorCard
              title="Background"
              description="Main page background"
              colorClass="bg-background border"
            />
            <ColorCard
              title="Primary"
              description="Primary actions and emphasis"
              colorClass="bg-primary text-primary-foreground"
            />
            <ColorCard
              title="Secondary"
              description="Secondary UI elements"
              colorClass="bg-secondary text-secondary-foreground"
            />
            <ColorCard
              title="Muted"
              description="Subtle backgrounds"
              colorClass="bg-muted text-muted-foreground"
            />
            <ColorCard
              title="Accent"
              description="Hover states and highlights"
              colorClass="bg-accent text-accent-foreground"
            />
            <ColorCard
              title="Card"
              description="Card backgrounds"
              colorClass="bg-card text-card-foreground border"
            />
          </div>
        </section>

        {/* Components Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Layers className="w-8 h-8" />
            Components
          </h3>

          <div className="space-y-8">
            {/* Buttons */}
            <div className="p-6 rounded-lg bg-card border">
              <h4 className="text-xl font-semibold mb-4">Buttons</h4>
              <div className="flex flex-wrap gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            {/* Input Fields */}
            <div className="p-6 rounded-lg bg-card border">
              <h4 className="text-xl font-semibold mb-4">Input Fields</h4>
              <div className="space-y-3 max-w-md">
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <textarea
                  placeholder="Your message"
                  rows={3}
                  className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* Cards */}
            <div className="p-6 rounded-lg bg-card border">
              <h4 className="text-xl font-semibold mb-4">Cards</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FeatureCard
                  icon={<Code className="w-6 h-6" />}
                  title="Clean Code"
                  description="Well-structured and maintainable codebase"
                />
                <FeatureCard
                  icon={<Layers className="w-6 h-6" />}
                  title="Composable"
                  description="Build complex UIs from simple components"
                />
                <FeatureCard
                  icon={<Sparkles className="w-6 h-6" />}
                  title="Beautiful"
                  description="Elegant design that works in any theme"
                />
              </div>
            </div>

            {/* Status Indicators */}
            <div className="p-6 rounded-lg bg-card border">
              <h4 className="text-xl font-semibold mb-4">Status Indicators</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm font-medium text-muted-foreground">
                    Muted
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-primary">
                  <p className="text-sm font-medium text-primary-foreground">
                    Primary
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-sm font-medium text-secondary-foreground">
                    Secondary
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-accent">
                  <p className="text-sm font-medium text-accent-foreground">
                    Accent
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chart Colors Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Palette className="w-8 h-8" />
            Chart Colors
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <ChartColor
              colorClass="bg-[oklch(0.646_0.222_41.116)]"
              name="Chart 1"
            />
            <ChartColor
              colorClass="bg-[oklch(0.6_0.118_184.704)]"
              name="Chart 2"
            />
            <ChartColor
              colorClass="bg-[oklch(0.398_0.07_227.392)]"
              name="Chart 3"
            />
            <ChartColor
              colorClass="bg-[oklch(0.828_0.189_84.429)]"
              name="Chart 4"
            />
            <ChartColor
              colorClass="bg-[oklch(0.769_0.188_70.08)]"
              name="Chart 5"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            These are the chart colors defined in your theme - perfect for data
            visualization
          </p>
        </section>

        {/* Footer */}
        <footer className="border-t mt-16">
          <div className="max-w-7xl mx-auto px-6 py-8 text-center text-muted-foreground">
            <p>Built with shadcn/ui • Tailwind CSS • React • OKLCH Colors</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function ColorCard({ title, description, colorClass }: any) {
  return (
    <div
      className={`p-6 rounded-lg ${colorClass} min-h-32 flex flex-col justify-end`}
    >
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="p-6 rounded-lg bg-background border hover:border-ring transition-colors">
      <div className="mb-3 text-primary">{icon}</div>
      <h5 className="font-semibold mb-2">{title}</h5>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function ChartColor({ colorClass, name }: any) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-16 h-16 rounded-lg ${colorClass} border`}></div>
      <span className="text-sm font-medium text-foreground">{name}</span>
    </div>
  );
}
