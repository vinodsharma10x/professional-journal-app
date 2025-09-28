import { MarketingNav } from "@/components/marketing-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckCircle, Zap, Crown, ArrowRight } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance">
              Simple, transparent{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">pricing</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty max-w-2xl mx-auto">
              Choose the plan that fits your needs. Start free and upgrade as you grow.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Free Plan */}
              <Card className="border-border/50 bg-card/50 backdrop-blur relative">
                <CardHeader className="text-center pb-8">
                  <div className="flex items-center justify-center mb-4">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Free</CardTitle>
                  <CardDescription className="text-base">
                    Perfect for getting started with your developer journal
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">Up to 50 journal entries</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">Basic categories and tags</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">Rich text editor</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">Basic analytics</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">Mobile app access</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">Export to PDF</span>
                    </li>
                  </ul>
                  <Link href="/auth" className="block">
                    <Button className="w-full bg-transparent" variant="outline">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="border-primary/50 bg-card/50 backdrop-blur relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">Most Popular</Badge>
                </div>
                <CardHeader className="text-center pb-8">
                  <div className="flex items-center justify-center mb-4">
                    <Crown className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-2xl">Pro</CardTitle>
                  <CardDescription className="text-base">
                    Everything you need to supercharge your development journey
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">$12</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">or $120/year (save 17%)</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-sm font-medium text-foreground mb-3">Everything in Free, plus:</div>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">Unlimited journal entries</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">AI-powered insights and summaries</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">Resume import and skill tracking</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">Advanced analytics and trends</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">Custom categories and templates</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">Team sharing and collaboration</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">Priority support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">API access</span>
                    </li>
                  </ul>
                  <Link href="/auth" className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Start Pro Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-muted-foreground">
                    14-day free trial, no credit card required
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">Have questions? We have answers.</p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Can I upgrade or downgrade my plan at any time?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next
                  billing cycle.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Is my data secure and private?</h3>
                <p className="text-muted-foreground">
                  Absolutely. We use end-to-end encryption to protect your data. Your journal entries are private by
                  default and only accessible to you.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">What happens to my data if I cancel?</h3>
                <p className="text-muted-foreground">
                  You can export all your data at any time. If you cancel, you'll have 30 days to export your data
                  before it's permanently deleted.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Do you offer student discounts?</h3>
                <p className="text-muted-foreground">
                  Yes! Students get 50% off the Pro plan. Contact us with your student email for verification.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Can I use DevJournal offline?</h3>
                <p className="text-muted-foreground">
                  Yes, our mobile and desktop apps support offline mode. Your entries will sync when you're back online.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">&copy; 2025 DevJournal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
