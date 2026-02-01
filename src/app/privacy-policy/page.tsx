export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-16 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Privacy Policy
        </h1>
        
        <div className="space-y-6 text-zinc-600 dark:text-zinc-400">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Introduction
            </h2>
            <p>
              Welcome to BI Handoffs ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our application.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Information We Collect
            </h2>
            <p className="mb-3">
              When you sign in to BI Handoffs using Google OAuth, we collect:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li><strong>Profile Information:</strong> Your name, email address, and profile picture from your Google account</li>
              <li><strong>Usage Data:</strong> Comments, annotations, and interactions you create within the application</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              How We Use Your Information
            </h2>
            <p className="mb-3">We use your information to:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Provide and maintain our service</li>
              <li>Identify you as a user of the application</li>
              <li>Enable collaboration features (comments and annotations)</li>
              <li>Improve and optimize our application</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Data Storage and Security
            </h2>
            <p>
              Your data is stored securely using Supabase, a trusted database provider. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Data Sharing
            </h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We only share your data:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>With other users as part of the collaboration features (e.g., comments you post)</li>
              <li>When required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Your Rights
            </h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Third-Party Services
            </h2>
            <p className="mb-3">
              We use the following third-party services:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li><strong>Google OAuth:</strong> For authentication</li>
              <li><strong>Supabase:</strong> For data storage</li>
              <li><strong>Vercel:</strong> For hosting</li>
            </ul>
            <p className="mt-3">
              These services have their own privacy policies governing the use of your information.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Cookies
            </h2>
            <p>
              We use essential cookies and local storage to maintain your session and provide core functionality. We do not use tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Children's Privacy
            </h2>
            <p>
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Changes to This Privacy Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:{' '}
              <a 
                href="mailto:akshay.borade09@gmail.com"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                akshay.borade09@gmail.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <a
            href="/"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
