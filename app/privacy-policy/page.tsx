import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Spudin Game List",
  description: "Privacy policy for Spudin Game List - How we collect, use, and protect your data",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Privacy Policy
          </h1>
          
          <div className="text-gray-200 space-y-6">
            <p className="text-sm text-gray-300 mb-8">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                1. Information We Collect
              </h2>
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-purple-300">
                  Account Information
                </h3>
                <p>
                  When you create an account with Spudin Game List, we collect:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Email address</li>
                  <li>Username (if provided)</li>
                  <li>Profile information (name, avatar)</li>
                  <li>Authentication data through secure third-party providers</li>
                </ul>
                
                <h3 className="text-lg font-medium text-purple-300">
                  Game Data
                </h3>
                <p>
                  We store information about your gaming activities including:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Games you've added to your lists</li>
                  <li>Ratings and reviews you provide</li>
                  <li>Game completion status</li>
                  <li>Personal notes and comments</li>
                </ul>

                <h3 className="text-lg font-medium text-purple-300">
                  Usage Information
                </h3>
                <p>
                  We automatically collect certain information when you use our service:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                  <li>Usage patterns and preferences</li>
                  <li>Log data and analytics</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                2. How We Use Your Information
              </h2>
              <p>
                We use the collected information to:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Provide and maintain our game tracking service</li>
                <li>Personalize your experience and recommendations</li>
                <li>Communicate with you about updates and features</li>
                <li>Improve our service and develop new features</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                3. Information Sharing and Disclosure
              </h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>With your consent:</strong> When you explicitly agree to share information</li>
                <li><strong>Service providers:</strong> With trusted partners who help us operate our service</li>
                <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business transfers:</strong> In connection with mergers or acquisitions</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                4. Data Security
              </h2>
              <p>
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication through trusted providers</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal data on a need-to-know basis</li>
                <li>Incident response procedures</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                5. Your Rights and Choices
              </h2>
              <p>
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your data in a readable format</li>
                <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                6. Cookies and Tracking
              </h2>
              <p>
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Remember your preferences and settings</li>
                <li>Authenticate and secure your account</li>
                <li>Analyze usage patterns and improve our service</li>
                <li>Provide personalized content and recommendations</li>
              </ul>
              <p>
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                7. Third-Party Services
              </h2>
              <p>
                Our service integrates with third-party providers:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>RAWG API:</strong> For game data and information</li>
                <li><strong>Supabase:</strong> For authentication and database services</li>
                <li><strong>Google:</strong> For authentication services</li>
              </ul>
              <p>
                These services have their own privacy policies that govern their use of your information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                8. Children's Privacy
              </h2>
              <p>
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                9. International Data Transfers
              </h2>
              <p>
                Your information may be transferred to and stored on servers located outside your country of residence. We ensure appropriate safeguards are in place to protect your information during such transfers.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                10. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Posting the new privacy policy on this page</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending you an email notification for significant changes</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                11. Contact Us
              </h2>
              <p>
                If you have any questions about this privacy policy or our data practices, please contact us at:
              </p>
              <div className="bg-white/5 rounded-lg p-4 mt-4">
                <p><strong>Email:</strong> privacy@spudingamelist.com</p>
                <p><strong>Address:</strong> [Your Company Address]</p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-600">
            <p className="text-center text-gray-300">
              Thank you for trusting Spudin Game List with your gaming data. We are committed to protecting your privacy and providing you with a secure gaming experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
