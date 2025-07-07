import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Spudin Game List",
  description: "Terms of Service for Spudin Game List - Rules and conditions for using our gaming platform",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Terms of Service
          </h1>
          
          <div className="text-gray-200 space-y-6">
            <p className="text-sm text-gray-300 mb-8">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using Spudin Game List (&quot;Service&quot;, &quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), 
                you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
              <p>
                These Terms of Service ("Terms") govern your use of our gaming platform and services. 
                By creating an account or using our service, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                2. Description of Service
              </h2>
              <p>
                Spudin Game List is a platform that allows users to:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Track and manage their personal game libraries</li>
                <li>Discover new games through our database</li>
                <li>Rate and review games</li>
                <li>Create and maintain game lists and collections</li>
                <li>Share gaming experiences with other users</li>
                <li>Access game information and metadata</li>
              </ul>
              <p>
                Our service integrates with third-party APIs and databases to provide comprehensive game information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                3. User Accounts and Registration
              </h2>
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-purple-300">
                  Account Creation
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>You must be at least 13 years old to create an account</li>
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining the security of your account</li>
                  <li>You must not share your account credentials with others</li>
                  <li>One person may not maintain more than one account</li>
                </ul>

                <h3 className="text-lg font-medium text-purple-300">
                  Account Responsibilities
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>You are responsible for all activities that occur under your account</li>
                  <li>You must notify us immediately of any unauthorized use</li>
                  <li>You must keep your contact information up to date</li>
                  <li>You may delete your account at any time through account settings</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                4. Acceptable Use Policy
              </h2>
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-purple-300">
                  Permitted Uses
                </h3>
                <p>You may use our service to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Track your personal gaming activities</li>
                  <li>Share reviews and ratings in good faith</li>
                  <li>Discover and research games</li>
                  <li>Interact respectfully with other users</li>
                  <li>Create personal game collections and lists</li>
                </ul>

                <h3 className="text-lg font-medium text-purple-300">
                  Prohibited Activities
                </h3>
                <p>You agree not to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Post offensive, harmful, or inappropriate content</li>
                  <li>Harass, threaten, or intimidate other users</li>
                  <li>Submit false or misleading reviews or ratings</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated tools to scrape or harvest data</li>
                  <li>Spam or send unsolicited communications</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Impersonate other users or entities</li>
                  <li>Upload malware or malicious code</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                5. User Content
              </h2>
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-purple-300">
                  Content Ownership
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>You retain ownership of content you create and submit</li>
                  <li>You grant us a license to use, display, and distribute your content</li>
                  <li>You represent that you have the right to share the content you submit</li>
                  <li>You are responsible for the accuracy of your content</li>
                </ul>

                <h3 className="text-lg font-medium text-purple-300">
                  Content Standards
                </h3>
                <p>All user content must be:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Accurate and truthful to the best of your knowledge</li>
                  <li>Respectful and non-offensive</li>
                  <li>Relevant to gaming and our platform</li>
                  <li>Original or properly attributed</li>
                  <li>Free from spam or promotional material</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                6. Intellectual Property
              </h2>
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-purple-300">
                  Our Rights
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Spudin Game List owns all rights to the platform and its features</li>
                  <li>Our trademarks and logos are protected intellectual property</li>
                  <li>The platform's design, code, and functionality are proprietary</li>
                </ul>

                <h3 className="text-lg font-medium text-purple-300">
                  Third-Party Content
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Game data is provided by third-party sources (RAWG.io)</li>
                  <li>Game images, descriptions, and metadata belong to their respective owners</li>
                  <li>We respect intellectual property rights of game developers and publishers</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                7. Privacy and Data Protection
              </h2>
              <p>
                Your privacy is important to us. Our collection and use of personal information 
                is governed by our Privacy Policy, which is incorporated into these Terms by reference. 
                By using our service, you consent to the collection and use of your information 
                as outlined in our Privacy Policy.
              </p>
              <p>
                <a 
                  href="/privacy-policy" 
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  View our Privacy Policy
                </a>
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                8. Service Availability and Modifications
              </h2>
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-purple-300">
                  Service Availability
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service</li>
                  <li>Scheduled maintenance will be announced in advance when possible</li>
                  <li>We are not liable for service interruptions beyond our control</li>
                </ul>

                <h3 className="text-lg font-medium text-purple-300">
                  Service Modifications
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>We may modify, update, or discontinue features at any time</li>
                  <li>We will provide reasonable notice for significant changes</li>
                  <li>Continued use after changes constitutes acceptance of modifications</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                9. Termination
              </h2>
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-purple-300">
                  Termination by You
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>You may terminate your account at any time</li>
                  <li>Account deletion can be done through your account settings</li>
                  <li>Some data may be retained for legal or technical reasons</li>
                </ul>

                <h3 className="text-lg font-medium text-purple-300">
                  Termination by Us
                </h3>
                <p>We may terminate or suspend your account if you:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Violate these Terms of Service</li>
                  <li>Engage in prohibited activities</li>
                  <li>Abuse or harass other users</li>
                  <li>Attempt to compromise our systems</li>
                  <li>Fail to respond to security concerns</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                10. Disclaimers and Limitations of Liability
              </h2>
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-purple-300">
                  Service Disclaimers
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Our service is provided "as is" without warranties</li>
                  <li>We do not guarantee the accuracy of game data or user content</li>
                  <li>Third-party integrations may have their own terms and limitations</li>
                  <li>We are not responsible for user-generated content</li>
                </ul>

                <h3 className="text-lg font-medium text-purple-300">
                  Limitation of Liability
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Our liability is limited to the maximum extent permitted by law</li>
                  <li>We are not liable for indirect, incidental, or consequential damages</li>
                  <li>Our total liability shall not exceed the amount you paid for the service</li>
                  <li>Some jurisdictions do not allow these limitations</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                11. Indemnification
              </h2>
              <p>
                You agree to defend, indemnify, and hold harmless Spudin Game List and its officers, 
                directors, employees, and agents from any claims, damages, obligations, losses, 
                liabilities, costs, or debt arising from:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Your use of the service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Content you submit to the platform</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                12. Governing Law
              </h2>
              <p>
                These Terms shall be interpreted and governed by the laws of [Your Jurisdiction], 
                without regard to its conflict of law provisions. Any disputes arising from these 
                Terms or your use of the service shall be resolved in the courts of [Your Jurisdiction].
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                13. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of 
                significant changes through:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Email notification to registered users</li>
                <li>Prominent notice on our platform</li>
                <li>Updating the "Last updated" date</li>
              </ul>
              <p>
                Continued use of the service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                14. Contact Information
              </h2>
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-white/5 rounded-lg p-4 mt-4">
                <p><strong>Email:</strong> zagreusaiman@gmail.com</p>
                <p><strong>Support:</strong> zagreusaiman@gmail.com</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                15. Severability
              </h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, 
                that provision will be limited or eliminated to the minimum extent necessary 
                so that the Terms will otherwise remain in full force and effect.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-600">
            <p className="text-center text-gray-300">
              By using Spudin Game List, you acknowledge that you have read these Terms of Service 
              and agree to be bound by them. Thank you for being part of our gaming community!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
