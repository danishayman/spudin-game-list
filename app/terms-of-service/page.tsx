import type { Metadata } from "next";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms of Service - Spudin Game List",
  description: "Terms of Service for Spudin Game List - Rules and conditions for using our gaming platform",
};

export default function TermsOfServicePage() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-900 text-white pt-0">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full">
        <Image
          src="/landing/banner.jpg"
          alt="Terms of Service - Spudin's Game List"
          fill
          priority
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Terms of Service
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mb-8 drop-shadow-md">
            Rules and conditions for using our gaming platform
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-16 px-4">
        <div className="bg-slate-800 p-6 md:p-8 rounded-lg mb-8">
          <p className="text-sm text-slate-300 text-center">
            <strong>Last updated:</strong> 14 August 2025
          </p>
        </div>

        {/* Acceptance of Terms */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">1. Acceptance of Terms</h2>
          <div className="bg-slate-800 p-6 md:p-8 rounded-lg">
            <p className="text-lg text-slate-200 mb-4">
              By accessing and using Spudin Game List (&quot;Service&quot;, &quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), 
              you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
            <p className="text-slate-300">
              These Terms of Service (&quot;Terms&quot;) govern your use of our gaming platform and services. 
              By creating an account or using our service, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms.
            </p>
          </div>
        </section>

        {/* Description of Service */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">2. Description of Service</h2>
          <div className="bg-slate-800 p-6 md:p-8 rounded-lg">
            <p className="text-lg text-slate-200 mb-6">
              Spudin Game List is a platform that allows users to:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-4">
              <li>Track and manage their personal game libraries</li>
              <li>Discover new games through our database</li>
              <li>Rate and review games</li>
              <li>Create and maintain game lists and collections</li>
              <li>Share gaming experiences with other users</li>
              <li>Access game information and metadata</li>
            </ul>
            <p className="text-slate-300">
              Our service integrates with third-party APIs and databases to provide comprehensive game information.
            </p>
          </div>
        </section>

        {/* User Accounts */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">3. User Accounts and Registration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Account Creation</CardTitle>
                <CardDescription className="text-slate-300">
                  Requirements for creating an account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>You must be at least 13 years old to create an account</li>
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining the security of your account</li>
                  <li>You must not share your account credentials with others</li>
                  <li>One person may not maintain more than one account</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Account Responsibilities</CardTitle>
                <CardDescription className="text-slate-300">
                  Your responsibilities as a user
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>You are responsible for all activities that occur under your account</li>
                  <li>You must notify us immediately of any unauthorized use</li>
                  <li>You must keep your contact information up to date</li>
                  <li>You may delete your account at any time through account settings</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Acceptable Use Policy */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">4. Acceptable Use Policy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Permitted Uses</CardTitle>
                <CardDescription className="text-slate-300">
                  What you can do on our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-3">You may use our service to:</p>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  <li>Track your personal gaming activities</li>
                  <li>Share reviews and ratings in good faith</li>
                  <li>Discover and research games</li>
                  <li>Interact respectfully with other users</li>
                  <li>Create personal game collections and lists</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Prohibited Activities</CardTitle>
                <CardDescription className="text-slate-300">
                  Activities that are not allowed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-3">You agree not to:</p>
                <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
                  <li>Post offensive, harmful, or inappropriate content</li>
                  <li>Harass, threaten, or intimidate other users</li>
                  <li>Submit false or misleading reviews or ratings</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated tools to scrape or harvest data</li>
                  <li>Spam or send unsolicited communications</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Impersonate other users or entities</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* User Content & Intellectual Property */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">5. User Content & Intellectual Property</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Content Ownership</CardTitle>
                <CardDescription className="text-slate-300">
                  Rights to content you create
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>You retain ownership of content you create and submit</li>
                  <li>You grant us a license to use, display, and distribute your content</li>
                  <li>You represent that you have the right to share the content you submit</li>
                  <li>You are responsible for the accuracy of your content</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Platform Rights</CardTitle>
                <CardDescription className="text-slate-300">
                  Our intellectual property rights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Spudin Game List owns all rights to the platform and its features</li>
                  <li>Our trademarks and logos are protected intellectual property</li>
                  <li>The platform&apos;s design, code, and functionality are proprietary</li>
                  <li>Game data is provided by third-party sources (IGDB)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Privacy & Service Terms */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">6. Privacy & Service Availability</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Privacy Protection</CardTitle>
                <CardDescription className="text-slate-300">
                  How we handle your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  Your privacy is important to us. Our collection and use of personal information 
                  is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                <a 
                  href="/privacy-policy" 
                  className="text-purple-400 hover:text-purple-300 underline transition-colors"
                >
                  View our Privacy Policy →
                </a>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Service Availability</CardTitle>
                <CardDescription className="text-slate-300">
                  Platform uptime and modifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service</li>
                  <li>Scheduled maintenance will be announced in advance when possible</li>
                  <li>We may modify, update, or discontinue features at any time</li>
                  <li>Continued use after changes constitutes acceptance of modifications</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Termination & Liability */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">7. Termination & Liability</h2>
          <div className="bg-slate-800 p-6 md:p-8 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Account Termination</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-purple-300 mb-2">By You:</h4>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
                      <li>You may terminate your account at any time</li>
                      <li>Account deletion can be done through your account settings</li>
                      <li>Some data may be retained for legal or technical reasons</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-300 mb-2">By Us:</h4>
                    <p className="text-slate-300 text-sm mb-2">We may terminate or suspend your account if you:</p>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
                      <li>Violate these Terms of Service</li>
                      <li>Engage in prohibited activities</li>
                      <li>Abuse or harass other users</li>
                      <li>Attempt to compromise our systems</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Limitation of Liability</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-2 text-sm">
                  <li>Our service is provided &quot;as is&quot; without warranties</li>
                  <li>We do not guarantee the accuracy of game data or user content</li>
                  <li>Our liability is limited to the maximum extent permitted by law</li>
                  <li>We are not liable for indirect, incidental, or consequential damages</li>
                  <li>Our total liability shall not exceed the amount you paid for the service</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Information */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">8. Legal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Indemnification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm">
                  You agree to defend, indemnify, and hold harmless Spudin Game List from any claims, damages, or liabilities arising from your use of the service or violation of these Terms.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Governing Law</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm">
                  These Terms shall be interpreted and governed by applicable laws, without regard to conflict of law provisions. Any disputes shall be resolved through appropriate legal channels.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Severability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm">
                  If any provision of these Terms is found to be unenforceable, that provision will be limited to the minimum extent necessary so that the Terms will otherwise remain in full force.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Changes & Contact */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">9. Changes & Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Changes to Terms</CardTitle>
                <CardDescription className="text-slate-300">
                  How we handle updates to these terms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  We reserve the right to modify these Terms at any time. We will notify users of 
                  significant changes through:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  <li>Email notification to registered users</li>
                  <li>Prominent notice on our platform</li>
                  <li>Updating the &quot;Last updated&quot; date</li>
                </ul>
                <p className="text-slate-300 mt-4 text-sm">
                  Continued use of the service after changes constitutes acceptance of the new Terms.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Contact Us</CardTitle>
                <CardDescription className="text-slate-300">
                  Get in touch with questions about these terms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-white"><strong>Email:</strong> zagreusaiman@gmail.com</p>
                  <p className="text-white"><strong>Support:</strong> zagreusaiman@gmail.com</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer Message */}
        <div className="bg-slate-800 p-6 md:p-8 rounded-lg text-center">
          <p className="text-slate-200">
            By using Spudin Game List, you acknowledge that you have read these Terms of Service 
            and agree to be bound by them. Thank you for being part of our gaming community!
          </p>
        </div>
      </div>
    </main>
  );
}
