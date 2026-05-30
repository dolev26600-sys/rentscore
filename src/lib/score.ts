export interface TenantProfileData {
  years_renting?: number;
  income_range?: string;
  job_seniority?: string;
  housing_status?: string;
  has_guarantor?: boolean;
  contract_preference?: string;
}

export function calculateTenantScore(profile: TenantProfileData): number {
  let score = 50;

  // +4 per year renting, max 20
  if (profile.years_renting) {
    score += Math.min(profile.years_renting * 4, 20);
  }

  // +5 for income_range
  if (profile.income_range) score += 5;

  // +3 for job_seniority
  if (profile.job_seniority) score += 3;

  // +2 for housing_status
  if (profile.housing_status) score += 2;

  // +5 for has_guarantor
  if (profile.has_guarantor) score += 5;

  // +2 for contract_preference
  if (profile.contract_preference) score += 2;

  return Math.min(score, 100);
}
