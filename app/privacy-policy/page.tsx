import type { Metadata } from "next";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy - Spudin Game List",
  description: "Privacy policy for Spudin Game List - How we collect, use, and protect your data",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-900 text-white pt-0">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full">
        <Image
          src="/landing/banner.jpg"
          alt="Privacy Policy - Spudin's Game List"
          fill
          priority
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Privacy Policy
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mb-8 drop-shadow-md">
            How we collect, use, and protect your gaming data
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

        {/* Information We Collect */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">1. Information We Collect</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Account Information</CardTitle>
                <CardDescription className="text-slate-300">
                  Data collected during registration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-3">
                  When you create an account with Spudin Game List, we collect:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  <li>Email address</li>
                  <li>Username (if provided)</li>
                  <li>Profile information (name, avatar)</li>
                  <li>Authentication data through secure third-party providers</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Game Data</CardTitle>
                <CardDescription className="text-slate-300">
                  Your gaming activities and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-3">
                  We store information about your gaming activities including:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  <li>Games you&apos;ve added to your lists</li>
                  <li>Ratings and reviews you provide</li>
                  <li>Game completion status</li>
                  <li>Personal notes and comments</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Usage Information</CardTitle>
                <CardDescription className="text-slate-300">
                  Automatically collected data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-3">
                  We automatically collect certain information when you use our service:
                </p>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                  <li>Usage patterns and preferences</li>
                  <li>Log data and analytics</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">2. How We Use Your Information</h2>
          <div className="bg-slate-800 p-6 md:p-8 rounded-lg">
            <p className="text-lg text-slate-200 mb-6">
              We use the collected information to:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Provide and maintain our game tracking service</li>
              <li>Personalize your experience and recommendations</li>
              <li>Communicate with you about updates and features</li>
              <li>Improve our service and develop new features</li>
              <li>Ensure security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>
        </section>

        {/* Information Sharing and Disclosure */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">3. Information Sharing and Disclosure</h2>
          <div className="bg-slate-800 p-6 md:p-8 rounded-lg">
            <p className="text-lg text-slate-200 mb-6">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong className="text-white">With your consent:</strong> When you explicitly agree to share information</li>
              <li><strong className="text-white">Service providers:</strong> With trusted partners who help us operate our service</li>
              <li><strong className="text-white">Legal requirements:</strong> When required by law or to protect our rights</li>
              <li><strong className="text-white">Business transfers:</strong> In connection with mergers or acquisitions</li>
            </ul>
          </div>
        </section>

        {/* Data Security */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">4. Data Security</h2>
          <div className="bg-slate-800 p-6 md:p-8 rounded-lg">
            <p className="text-lg text-slate-200 mb-6">
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication through trusted providers</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal data on a need-to-know basis</li>
              <li>Incident response procedures</li>
            </ul>
          </div>
        </section>

        {/* Your Rights and Choices */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">5. Your Rights and Choices</h2>
          <div className="bg-slate-800 p-6 md:p-8 rounded-lg">
            <p className="text-lg text-slate-200 mb-6">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
              <li><strong className="text-white">Correction:</strong> Update or correct inaccurate information</li>
              <li><strong className="text-white">Deletion:</strong> Request deletion of your account and data</li>
              <li><strong className="text-white">Portability:</strong> Export your data in a readable format</li>
              <li><strong className="text-white">Withdrawal:</strong> Withdraw consent for data processing</li>
            </ul>
          </div>
        </section>

        {/* Cookies and Tracking */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">6. Cookies and Tracking</h2>
          <div className="bg-slate-800 p-6 md:p-8 rounded-lg">
            <p className="text-lg text-slate-200 mb-6">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Remember your preferences and settings</li>
              <li>Authenticate and secure your account</li>
              <li>Analyze usage patterns and improve our service</li>
              <li>Provide personalized content and recommendations</li>
            </ul>
            <p className="text-slate-200 mt-4">
              You can control cookie settings through your browser preferences.
            </p>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">7. Third-Party Services</h2>
          <div className="bg-slate-800 p-6 md:p-8 rounded-lg">
            <p className="text-lg text-slate-200 mb-6">
              Our service integrates with third-party providers:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-6">
              <li><strong className="text-white">IGDB API:</strong> For game data and information</li>
              <li><strong className="text-white">Supabase:</strong> For authentication and database services</li>
              <li><strong className="text-white">Google:</strong> For authentication services</li>
            </ul>
            <p className="text-slate-200">
              These services have their own privacy policies that govern their use of your information.
            </p>
          </div>
        </section>

        {/* Children's Privacy & International Data Transfers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-purple-400">8. Children&apos;s Privacy</h2>
            <div className="bg-slate-800 p-6 md:p-8 rounded-lg">
              <p className="text-slate-200">
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6 text-purple-400">9. International Data Transfers</h2>
            <div className="bg-slate-800 p-6 md:p-8 rounded-lg">
              <p className="text-slate-200">
                Your information may be transferred to and stored on servers located outside your country of residence. We ensure appropriate safeguards are in place to protect your information during such transfers.
              </p>
            </div>
          </div>
        </div>

        {/* Changes to Privacy Policy & Contact Us */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-purple-400">10. Changes to This Privacy Policy</h2>
            <div className="bg-slate-800 p-6 md:p-8 rounded-lg">
              <p className="text-slate-200 mb-4">
                We may update this privacy policy from time to time. We will notify you of any changes by:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Posting the new privacy policy on this page</li>
                <li>Updating the &quot;Last updated&quot; date</li>
                <li>Sending you an email notification for significant changes</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6 text-purple-400">11. Contact Us</h2>
            <div className="bg-slate-800 p-6 md:p-8 rounded-lg">
              <p className="text-slate-200 mb-4">
                If you have any questions about this privacy policy or our data practices, please contact us at:
              </p>
              <div className="bg-slate-700 rounded-lg p-4 mb-4">
                <p className="text-white"><strong>Email:</strong> zagreusaiman@gmail.com</p>
              </div>
              <p className="text-slate-200">
                For questions about your rights and responsibilities as a user, please also review our{" "}
                <a 
                  href="/terms-of-service" 
                  className="text-purple-400 hover:text-purple-300 underline transition-colors"
                >
                  Terms of Service
                </a>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="bg-slate-800 p-6 md:p-8 rounded-lg text-center">
          <p className="text-slate-200">
            Thank you for trusting Spudin Game List with your gaming data. We are committed to protecting your privacy and providing you with a secure gaming experience.
          </p>
        </div>
      </div>
    </main>
  );
}
