"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Sparkles,
  FileText,
  Brain,
  Target,
  Upload,
  Zap,
  CheckCircle,
  ArrowRight,
  Moon,
  Sun,
  Star,
  Users,
  Clock,
  Shield,
  Lightbulb,
  BookOpen,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Smart Summaries",
    description:
      "Transform lengthy documents into concise, actionable summaries that capture the key insights.",
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
  },
  {
    icon: Brain,
    title: "AI Flashcards",
    description:
      "Generate interactive flashcards automatically to help you memorize and retain important information.",
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/50",
  },
  {
    icon: Target,
    title: "Key Points Extraction",
    description:
      "Identify and extract the most important points from any document with AI-powered analysis.",
    gradient: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/50",
  },
];

const benefits = [
  {
    icon: Clock,
    title: "Save Time",
    description: "Process documents 10x faster than manual reading",
  },
  {
    icon: Lightbulb,
    title: "Better Understanding",
    description: "AI helps you grasp complex concepts quickly",
  },
  {
    icon: TrendingUp,
    title: "Improved Retention",
    description: "Flashcards and summaries boost memory retention",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your documents are processed securely and privately",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Graduate Student",
    content:
      "This tool has revolutionized how I study. I can process research papers in minutes instead of hours!",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Business Analyst",
    content:
      "Perfect for summarizing lengthy reports. The key points feature saves me so much time in meetings.",
    rating: 5,
  },
  {
    name: "Dr. Emily Watson",
    role: "Researcher",
    content:
      "The AI-generated flashcards are incredibly accurate. Great for preparing presentations and lectures.",
    rating: 5,
  },
];

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md dark:bg-gray-950/80 dark:border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    AI Notes Summarizer
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDarkMode(!darkMode)}
                  className="rounded-full"
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
                <Link href="/auth/signin">
                  <Button variant="outline" className="rounded-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Powered by Advanced AI
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Transform Your Documents into
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Actionable Insights
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Upload any document and let our AI create summaries, flashcards,
              and extract key points instantly. Study smarter, not harder.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signup">
                <Button className="h-14 px-8 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                  <Upload className="h-5 w-5 mr-2" />
                  Start Free Today
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  variant="outline"
                  className="h-14 px-8 text-lg font-semibold rounded-2xl border-gray-200 dark:border-gray-700"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  View Demo
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Free to start
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Secure & private
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Powerful AI Features
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our advanced AI technology transforms how you interact with
                documents
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className="border-0 shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm hover:scale-[1.02] transition-all duration-200"
                  >
                    <CardHeader
                      className={`${feature.bgColor} rounded-t-xl border-b`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-3 bg-gradient-to-r ${feature.gradient} rounded-xl shadow-lg`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl text-gray-900 dark:text-white">
                          {feature.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Why Choose AI Notes Summarizer?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="text-center space-y-4 p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-900/70 transition-all duration-200"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Loved by Students & Professionals
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                See what our users are saying about AI Notes Summarizer
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 italic">
                        "{testimonial.content}"
                      </p>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
              <CardContent className="p-12 text-center space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold">
                    Ready to Transform Your Documents?
                  </h2>
                  <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                    Join thousands of students and professionals who are already
                    using AI to study and work more efficiently.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/auth/signup">
                    <Button className="h-14 px-8 text-lg font-semibold rounded-2xl bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                      <Zap className="h-5 w-5 mr-2" />
                      Get Started Free
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                  <div className="flex items-center space-x-2 text-blue-100">
                    <Users className="h-5 w-5" />
                    <span>Join 10,000+ users</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm dark:border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      AI Notes Summarizer
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Transform your documents into actionable insights with
                    AI-powered analysis.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Product
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/features"
                      className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Features
                    </Link>
                    <Link
                      href="/pricing"
                      className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Pricing
                    </Link>
                    <Link
                      href="/demo"
                      className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Demo
                    </Link>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Support
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/help"
                      className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Help Center
                    </Link>
                    <Link
                      href="/contact"
                      className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Contact Us
                    </Link>
                    <Link
                      href="/status"
                      className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Status
                    </Link>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Legal
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/privacy"
                      className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      href="/terms"
                      className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Terms of Service
                    </Link>
                    <Link
                      href="/cookies"
                      className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Cookie Policy
                    </Link>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  © 2024 AI Notes Summarizer. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
