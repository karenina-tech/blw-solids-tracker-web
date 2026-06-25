// Guidelines are monitored by the blw-solids-tracker-skill repo.
// When an issue is opened there flagging a change, update guidelines.json and bump _meta.version.
import guidelinesData from '../../guidelines.json';

export type MilestoneKey =
  | 'headControl'
  | 'canSitWithMinimalSupport'
  | 'reachAndGrab'
  | 'showsInterestInFood';

export interface GuidelinesConfig {
  _meta: {
    version: string;
    lastReviewed: string;
    reviewedBy: string;
    sources: Array<{ id: string; citation: string }>;
  };
  ageRules: {
    standardMinimumMonths: number;
    absoluteMinimumMonths: number;
    earlyWindowMonths: number[];
    earlyWindowApprovedFeedingTypes: string[];
    earlyWindowEffectiveAgeMonths: number;
  };
  developmentalMilestones: {
    required: MilestoneKey[];
    informational: MilestoneKey[];
  };
}

export function getGuidelines(): GuidelinesConfig {
  return guidelinesData as GuidelinesConfig;
}
