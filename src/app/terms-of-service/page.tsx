export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white px-4 py-16 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Terms of Service
        </h1>
        
        <div className="space-y-6 text-zinc-600 dark:text-zinc-400">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Agreement to Terms
            </h2>
            <p>
              By accessing or using BI Handoffs ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Description of Service
            </h2>
            <p>
              BI Handoffs is a collaboration tool that allows users to add comments and annotations to web content. The Service enables teams to provide feedback, share insights, and communicate about visual content.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              User Accounts
            </h2>
            <p className="mb-3">
              To use the Service, you must:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Sign in using a valid Google account</li>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Acceptable Use
            </h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Post offensive, abusive, or harmful content</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Use the Service to spam or harass others</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              User Content
            </h2>
            <p>
              You retain all rights to the content you post on the Service. By posting content, you grant us a license to use, display, and distribute your content as necessary to provide the Service. You are solely responsible for the content you post.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Intellectual Property
            </h2>
            <p>
              The Service and its original content, features, and functionality are owned by BI Handoffs and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Termination
            </h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Disclaimer of Warranties
            </h2>
            <p>
              The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Limitation of Liability
            </h2>
            <p>
              In no event shall BI Handoffs, its directors, employees, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of any changes by updating the "Last updated" date. Your continued use of the Service after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of your jurisdiction, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at:{' '}
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
