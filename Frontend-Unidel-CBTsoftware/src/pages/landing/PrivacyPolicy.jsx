/**
 * Privacy Policy Page
 */
import React from "react";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";
import PageLayout, { PageHeader, Section } from "../../containers/PageLayout";
import { TextBlock } from "../../components/landing/LandingComponents";

const PrivacyPolicy = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <PageLayout>
      <PageHeader
        subtitle="Legal"
        title="Privacy Policy"
        description="Last updated: January 1, 2026. This privacy policy explains how the University of Delta collects, uses, and protects your personal information."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Policies", href: "#" },
          { label: "Privacy Policy" },
        ]}
      />

      <Section>
        <div className="max-w-4xl mx-auto">
          <TextBlock>
            <h2>1. Information We Collect</h2>
            <p>
              The University of Delta collects information that you provide
              directly to us, including when you apply for admission, register
              for courses, use our CBT platform, or contact us for support. This
              may include:
            </p>
            <ul>
              <li>
                Personal identification information (name, email address, phone
                number, date of birth)
              </li>
              <li>Academic records and credentials</li>
              <li>Financial information for fee payments</li>
              <li>Technical information when using our digital platforms</li>
              <li>
                Biometric data for examination verification (where applicable)
              </li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process your admission application and enrollment</li>
              <li>Administer courses, examinations, and academic records</li>
              <li>Provide access to university facilities and services</li>
              <li>Communicate important updates and announcements</li>
              <li>Ensure the integrity of our examination processes</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>

            <h2>3. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction. These measures include
              encryption, access controls, and regular security assessments.
            </p>

            <h2>4. Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except as
              necessary to:
            </p>
            <ul>
              <li>Comply with legal obligations</li>
              <li>
                Verify academic credentials with authorized bodies (NUC, JAMB,
                etc.)
              </li>
              <li>
                Process financial transactions through authorized payment
                processors
              </li>
              <li>Provide services you have requested</li>
            </ul>

            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>
                Request deletion of your information (subject to legal retention
                requirements)
              </li>
              <li>
                Object to processing of your information in certain
                circumstances
              </li>
            </ul>

            <h2>6. Cookies and Tracking</h2>
            <p>
              Our website and digital platforms use cookies to enhance your
              experience, analyze usage patterns, and improve our services. You
              can manage cookie preferences through your browser settings.
            </p>

            <h2>7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to
              fulfill the purposes for which it was collected, comply with legal
              obligations, and support legitimate academic and administrative
              needs. Academic records may be retained indefinitely as part of
              our archival obligations.
            </p>

            <h2>8. Contact Us</h2>
            <p>
              If you have questions about this privacy policy or wish to
              exercise your rights, please contact the Data Protection Officer:
            </p>
            <p>
              <strong>Email:</strong> dpo@unidel.edu.ng
              <br />
              <strong>Address:</strong> Office of the Registrar, University of
              Delta, Oleh, Delta State, Nigeria
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will
              notify you of any significant changes by posting the new policy on
              our website and, where appropriate, by direct communication.
            </p>
          </TextBlock>
        </div>
      </Section>
    </PageLayout>
  );
};

export default PrivacyPolicy;
