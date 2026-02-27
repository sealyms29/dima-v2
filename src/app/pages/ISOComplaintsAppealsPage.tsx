import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import { ISOComplaintsAppeals } from '../components/shared/ISOComplaintsAppeals';

export function ISOComplaintsAppealsPage() {
  return (
    <PageLayout>
      <PageHero
        badge="ISO Certification"
        title="ISO Complaints and Appeals"
        subtitle="Formal procedures for handling complaints and appeals under ISO certification schemes"
      />

      <section className="relative py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <ISOComplaintsAppeals />
        </div>
      </section>
    </PageLayout>
  );
}
