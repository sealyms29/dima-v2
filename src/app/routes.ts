import { createBrowserRouter } from "react-router";
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { OurStory } from './pages/OurStory';
import { ServicesPage } from './pages/ServicesPage';
import { MSPOPage } from './pages/MSPOPage';
import { ISO9001Page } from './pages/ISO9001Page';
import { ISO14001Page } from './pages/ISO14001Page';
import { ISO45001Page } from './pages/ISO45001Page';
import { QualityPolicyPage } from './pages/QualityPolicyPage';
import { QualityObjectivesPage } from './pages/QualityObjectivesPage';
import { CertificationMarkPage } from './pages/CertificationMarkPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { MSPOLogoUsagePage } from './pages/MSPOLogoUsagePage';
import { MSPOCertificationProcessPage } from './pages/MSPOCertificationProcessPage';
import { MSPOImpartialityPolicyPage } from './pages/MSPOImpartialityPolicyPage';
import { MSPOTransferProcedurePage } from './pages/MSPOTransferProcedurePage';
import { MSPOComplaintProcedurePage } from './pages/MSPOComplaintProcedurePage';
import { MSPOAppealProcedurePage } from './pages/MSPOAppealProcedurePage';
import { MSPOPublicNotificationPage } from './pages/MSPOPublicNotificationPage';
import { MSPOPublicSummaryReportPage } from './pages/MSPOPublicSummaryReportPage';
import { ISOOverviewPage } from './pages/ISOOverviewPage';
import { ISOAuditProcessPage } from './pages/ISOAuditProcessPage';
import { ISOComplaintsAppealsPage } from './pages/ISOComplaintsAppealsPage';
import { ComplaintAppealPage } from './pages/ComplaintAppealPage';

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/about",
    Component: AboutPage,
  },
  {
    path: "/our-story",
    Component: OurStory,
  },
  {
    path: "/services",
    Component: ServicesPage,
  },
  {
    path: "/services/mspo",
    Component: MSPOPage,
  },
  {
    path: "/services/iso-9001",
    Component: ISO9001Page,
  },
  {
    path: "/services/iso-14001",
    Component: ISO14001Page,
  },
  {
    path: "/services/iso-45001",
    Component: ISO45001Page,
  },
  {
    path: "/iso-overview",
    Component: ISOOverviewPage,
  },
  {
    path: "/iso-audit-process",
    Component: ISOAuditProcessPage,
  },
  {
    path: "/iso-complaints-appeals",
    Component: ISOComplaintsAppealsPage,
  },
  {
    path: "/quality-policy",
    Component: QualityPolicyPage,
  },
  {
    path: "/quality-objectives",
    Component: QualityObjectivesPage,
  },
  {
    path: "/certification-mark",
    Component: CertificationMarkPage,
  },
  {
    path: "/impartiality-policy",
    Component: MSPOImpartialityPolicyPage,
  },
  {
    path: "/mspo-logo-usage",
    Component: MSPOLogoUsagePage,
  },
  {
    path: "/mspo-certification-process",
    Component: MSPOCertificationProcessPage,
  },
  {
    path: "/mspo-transfer-procedure",
    Component: MSPOTransferProcedurePage,
  },
  {
    path: "/mspo-complaint-procedure",
    Component: MSPOComplaintProcedurePage,
  },
  {
    path: "/mspo-appeal-procedure",
    Component: MSPOAppealProcedurePage,
  },
  {
    path: "/mspo-public-notification",
    Component: MSPOPublicNotificationPage,
  },
  {
    path: "/mspo-public-summary-report",
    Component: MSPOPublicSummaryReportPage,
  },
  {
    path: "/contact",
    Component: ContactPage,
  },
  {
    path: "/complaint-appeal",
    Component: ComplaintAppealPage,
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);