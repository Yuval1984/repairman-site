/**
 * Mail Configuration
 * API keys and passwords for different applications
 */
export const REPAIRMAN_API_KEY = 'rKey123';
export const ELECTRIC_API_KEY = 'eKey456';

export interface MailConfig {
  // SendGrid service configuration
  service: string;
  apiKey: string;
  from: string;
}

export const EMAIL_USER = 'Joelkr@gmail.com';
export const SENDGRID_API_KEY = REPAIRMAN_API_KEY;

export const smtpConfig: MailConfig = {
  service: 'sendgrid',
  apiKey: SENDGRID_API_KEY,
  from: EMAIL_USER,
};

export const MAIL_CONFIGS: Record<string, MailConfig> = {
  [EMAIL_USER]: smtpConfig,
};

/**
 * Get mail configuration by API key
 */
export function getMailConfigByApiKey(apiKey: string): MailConfig | null {
  return MAIL_CONFIGS[apiKey] || null;
}

