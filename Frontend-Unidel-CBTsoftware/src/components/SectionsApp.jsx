import React, { Suspense } from "react";
import * as Landing from "../pages/landing/Export-landing";

// Landing page sections - all lazy loaded for smooth performance
export const SectionsApp = () => {
  const SectionLoader = (
    <div className="py-20 text-center text-gray-500">Loading...</div>
  );

  return (
    <div>
      {/* 1. Hero - First impression */}
      <section id="home">
        <Suspense fallback={SectionLoader}>
          <Landing.HeroSection />
        </Suspense>
      </section>

      {/* 2. About - Who we are */}
      <section id="about">
        <Suspense fallback={SectionLoader}>
          <Landing.Overview />
        </Suspense>
      </section>

      {/* 3. Programs - What we offer */}
      <section id="programs">
        <Suspense fallback={SectionLoader}>
          <Landing.Programs />
        </Suspense>
      </section>

      {/* 4. Faculties - Academic structure */}
      <section id="faculties">
        <Suspense fallback={SectionLoader}>
          <Landing.Faculties />
        </Suspense>
      </section>

      {/* 5. Departments - Detailed structure */}
      <section id="departments">
        <Suspense fallback={SectionLoader}>
          <Landing.Departments />
        </Suspense>
      </section>

      {/* 6. Research - Innovation */}
      <section id="research">
        <Suspense fallback={SectionLoader}>
          <Landing.Research />
        </Suspense>
      </section>

      {/* 7. Courses - Available courses */}
      <section id="courses">
        <Suspense fallback={SectionLoader}>
          <Landing.Courses />
        </Suspense>
      </section>

      {/* 8. How it Works - CBT explanation */}
      <section id="how-it-works">
        <Suspense fallback={SectionLoader}>
          <Landing.HowItWorks />
        </Suspense>
      </section>

      {/* 9. Campus - Visit us */}
      <section id="campus">
        <Suspense fallback={SectionLoader}>
          <Landing.Campus />
        </Suspense>
      </section>

      {/* 10. Gallery - Visual showcase */}
      <section id="gallery">
        <Suspense fallback={SectionLoader}>
          <Landing.Gallery />
        </Suspense>
      </section>

      {/* 11. Library - Resources */}
      <section id="library">
        <Suspense fallback={SectionLoader}>
          <Landing.Library />
        </Suspense>
      </section>

      {/* 12. Apply - Admissions */}
      <section id="apply">
        <Suspense fallback={SectionLoader}>
          <Landing.ApplyNow />
        </Suspense>
      </section>

      {/* 13. Fees - Tuition info */}
      <section id="fees">
        <Suspense fallback={SectionLoader}>
          <Landing.Fees />
        </Suspense>
      </section>

      {/* 14. Scholarships - Financial aid */}
      <section id="scholarships">
        <Suspense fallback={SectionLoader}>
          <Landing.Scholarships />
        </Suspense>
      </section>

      {/* 15. Leadership - Administration */}
      <section id="leadership">
        <Suspense fallback={SectionLoader}>
          <Landing.Leadership />
        </Suspense>
      </section>

      {/* 16. Team - Staff */}
      <section id="team">
        <Suspense fallback={SectionLoader}>
          <Landing.Team />
        </Suspense>
      </section>

      {/* 17. Events - Calendar */}
      <section id="events">
        <Suspense fallback={SectionLoader}>
          <Landing.Events />
        </Suspense>
      </section>

      {/* 18. News - Updates */}
      <section id="news">
        <Suspense fallback={SectionLoader}>
          <Landing.News />
        </Suspense>
      </section>

      {/* 19. Careers - Job placement */}
      <section id="careers">
        <Suspense fallback={SectionLoader}>
          <Landing.Careers />
        </Suspense>
      </section>

      {/* 20. Pricing - Plans */}
      <section id="pricing">
        <Suspense fallback={SectionLoader}>
          <Landing.Pricing />
        </Suspense>
      </section>

      {/* 21. Help Center - Support */}
      <section id="help">
        <Suspense fallback={SectionLoader}>
          <Landing.HelpCenter />
        </Suspense>
      </section>

      {/* 22. Contact - Get in touch */}
      <section id="contact">
        <Suspense fallback={SectionLoader}>
          <Landing.Contact />
        </Suspense>
      </section>
    </div>
  );
};
