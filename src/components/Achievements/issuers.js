import { GraduationCap } from 'lucide-react';

// Real logo files (see public/issuers/) for issuers that have one. Academic
// milestones (thesis defense, honors — not issued by a platform) have no
// logo and fall back to a plain icon instead (see ISSUER_FALLBACK_ICON).
export const ISSUER_LOGOS = {
  DataCamp: '/issuers/datacamp.png',
  'JPCS - DLSL Chapter': '/issuers/jpcs-dlsl.png',
};

// Used only when an issuer has no logo in ISSUER_LOGOS above.
export const ISSUER_FALLBACK_ICON = GraduationCap;

// Fixed display order for filter chips and grouped sections — deliberate
// (real, verifiable credentials before personal academic milestones)
// rather than alphabetical. Add a new issuer here (and a logo file above)
// as more certificates come in.
export const ISSUER_ORDER = ['DataCamp', 'JPCS - DLSL Chapter', 'Academic'];
