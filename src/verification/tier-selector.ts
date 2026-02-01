/**
 * Verification Tier Selector
 *
 * Scales verification effort with task complexity to optimize cost
 * while maintaining quality. Used by ralph, autopilot, and ultrapilot.
 */

export interface ChangeMetadata {
  filesChanged: number;
  linesChanged: number;
  hasArchitecturalChanges: boolean;
  hasSecurityImplications: boolean;
  testCoverage: 'none' | 'partial' | 'full';
}

export type VerificationTier = 'LIGHT' | 'STANDARD' | 'THOROUGH';

export interface VerificationAgent {
  agent: string;
  model: 'haiku' | 'sonnet' | 'opus';
  evidenceRequired: string[];
}

const TIER_AGENTS: Record<VerificationTier, VerificationAgent> = {
  LIGHT: {
    agent: 'architect-low',
    model: 'haiku',
    evidenceRequired: ['lsp_diagnostics clean'],
  },
  STANDARD: {
    agent: 'architect-medium',
    model: 'sonnet',
    evidenceRequired: ['lsp_diagnostics clean', 'build pass'],
  },
  THOROUGH: {
    agent: 'architect',
    model: 'opus',
    evidenceRequired: ['full architect review', 'all tests pass', 'no regressions'],
  },
};

/**
 * Select appropriate verification tier based on change metadata.
 */
export function selectVerificationTier(changes: ChangeMetadata): VerificationTier {
  // Security and architectural changes always require thorough review
  if (changes.hasSecurityImplications || changes.hasArchitecturalChanges) {
    return 'THOROUGH';
  }

  // Large scope changes require thorough review
  if (changes.filesChanged > 20) {
    return 'THOROUGH';
  }

  // Small, well-tested changes can use light verification
  if (
    changes.filesChanged < 5 &&
    changes.linesChanged < 100 &&
    changes.testCoverage === 'full'
  ) {
    return 'LIGHT';
  }

  // Default to standard verification
  return 'STANDARD';
}

/**
 * Get the verification agent configuration for a tier.
 */
export function getVerificationAgent(tier: VerificationTier): VerificationAgent {
  return TIER_AGENTS[tier];
}

/**
 * Detect if any files represent architectural changes.
 */
export function detectArchitecturalChanges(files: string[]): boolean {
  const architecturalPatterns = [
    /config\.(ts|js|json)$/i,
    /schema\.(ts|prisma|sql)$/i,
    /definitions\.ts$/i,
    /types\.ts$/i,
    /index\.(ts|js)$/i, // barrel exports
    /package\.json$/i,
    /tsconfig\.json$/i,
  ];

  return files.some((file) =>
    architecturalPatterns.some((pattern) => pattern.test(file))
  );
}

/**
 * Detect if any files have security implications.
 */
export function detectSecurityImplications(files: string[]): boolean {
  const securityPatterns = [
    /\/auth\//i,
    /\/security\//i,
    /permission/i,
    /credential/i,
    /secret/i,
    /token/i,
    /\.env/i,
    /password/i,
    /oauth/i,
    /jwt/i,
  ];

  return files.some((file) =>
    securityPatterns.some((pattern) => pattern.test(file))
  );
}

/**
 * Build change metadata from a list of changed files and line count.
 */
export function buildChangeMetadata(
  files: string[],
  linesChanged: number,
  testCoverage: 'none' | 'partial' | 'full' = 'partial'
): ChangeMetadata {
  return {
    filesChanged: files.length,
    linesChanged,
    hasArchitecturalChanges: detectArchitecturalChanges(files),
    hasSecurityImplications: detectSecurityImplications(files),
    testCoverage,
  };
}
