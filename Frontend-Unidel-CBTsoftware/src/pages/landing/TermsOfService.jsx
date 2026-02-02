/**
 * Terms of Service Page
 */
import React from "react";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";
import PageLayout, { PageHeader, Section } from "../../containers/PageLayout";
import { TextBlock } from "../../components/landing/LandingComponents";

const TermsOfService = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <PageLayout>
      <PageHeader
        subtitle="Legal"
        title="Terms of Service"
        description="Last updated: January 1, 2026. Please read these terms carefully before using the University of Delta's digital platforms and services."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Policies", href: "#" },
          { label: "Terms of Service" },
        ]}
      />

      <Section>
        <div className="max-w-4xl mx-auto">
          <TextBlock>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the University of Delta's website, student
              portal, CBT platform, or any other digital services ("Services"),
              you agree to be bound by these Terms of Service. If you do not
              agree to these terms, you may not use our Services.
            </p>

            <h2>2. User Accounts</h2>
            <p>
              To access certain Services, you may be required to create an
              account. You are responsible for:
            </p>
            <ul>
              <li>Maintaining the confidentiality of your login credentials</li>
              <li>All activities that occur under your account</li>
              <li>
                Notifying us immediately of any unauthorized use of your account
              </li>
              <li>
                Providing accurate and complete information during registration
              </li>
            </ul>

            <h2>3. Acceptable Use</h2>
            <p>You agree not to use our Services to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>
                Engage in academic dishonesty, including cheating, plagiarism,
                or impersonation
              </li>
              <li>Attempt to gain unauthorized access to systems or data</li>
              <li>Interfere with or disrupt the Services or servers</li>
              <li>Upload malicious software or harmful content</li>
              <li>Harass, threaten, or defame other users</li>
              <li>Share your login credentials with others</li>
            </ul>

            <h2>4. CBT Platform Rules</h2>
            <p>When using the Computer-Based Testing platform, you must:</p>
            <ul>
              <li>Use only authorized devices and browsers</li>
              <li>
                Ensure stable internet connectivity before starting an exam
              </li>
              <li>Not use any unauthorized materials or assistance</li>
              <li>Submit your answers before the time expires</li>
              <li>Report any technical issues immediately to invigilators</li>
            </ul>
            <p>
              Violation of CBT rules may result in nullification of your exam
              results and disciplinary action.
            </p>

            <h2>5. Intellectual Property</h2>
            <p>
              All content on our Services, including text, graphics, logos, and
              software, is the property of the University of Delta or its
              licensors and is protected by intellectual property laws. You may
              not reproduce, distribute, or create derivative works without our
              express written permission.
            </p>

            <h2>6. Student Conduct</h2>
            <p>
              Use of our Services is subject to the University of Delta's
              Student Handbook and Code of Conduct. Violations may result in
              disciplinary action, including suspension or expulsion.
            </p>

            <h2>7. Disclaimer of Warranties</h2>
            <p>
              Our Services are provided "as is" without warranties of any kind.
              While we strive to maintain high availability and accuracy, we do
              not guarantee uninterrupted access or error-free operation.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, the University of Delta
              shall not be liable for any indirect, incidental, or consequential
              damages arising from your use of our Services, including but not
              limited to loss of data, academic delays, or technical failures.
            </p>

            <h2>9. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued
              use of the Services after changes are posted constitutes
              acceptance of the modified terms.
            </p>

            <h2>10. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with
              the laws of the Federal Republic of Nigeria. Any disputes shall be
              subject to the exclusive jurisdiction of Nigerian courts.
            </p>

            <h2>11. Contact</h2>
            <p>
              For questions about these Terms of Service, please contact:
              <br />
              <strong>Email:</strong> legal@unidel.edu.ng
              <br />
              <strong>Address:</strong> Legal Department, University of Delta,
              Oleh, Delta State, Nigeria
            </p>
          </TextBlock>
        </div>
      </Section>
    </PageLayout>
  );
};

export default TermsOfService;
