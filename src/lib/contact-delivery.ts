import { practiceContact } from "./site";
import { isLocalHost } from "./request";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const runtimeEnv = import.meta.env ?? {};

const REQUIRED_SMTP_KEYS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
] as const;

export type SmtpDeliveryConfig = {
  mode: "smtp";
  available: true;
  to: string;
  from: string;
  transport: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
};

export type LocalPreviewDeliveryConfig = {
  mode: "local-preview";
  available: true;
  to: string;
  from: string;
  missingKeys: string[];
  operatorMessage: string;
};

export type UnavailableDeliveryConfig = {
  mode: "unavailable";
  available: false;
  to: string;
  from: string;
  issues: string[];
  operatorMessage: string;
};

export type ContactDeliveryConfig =
  | SmtpDeliveryConfig
  | LocalPreviewDeliveryConfig
  | UnavailableDeliveryConfig;

function getMissingRequiredKeys(env: NodeJS.ProcessEnv) {
  return REQUIRED_SMTP_KEYS.filter((key) => !env[key]);
}

function isValidEmail(value: string | undefined) {
  return Boolean(value && EMAIL_PATTERN.test(value));
}

function getInvalidOptionalIssues(env: NodeJS.ProcessEnv) {
  const issues: string[] = [];

  const smtpPort = Number(env.SMTP_PORT);
  if (env.SMTP_PORT && (!Number.isInteger(smtpPort) || smtpPort <= 0)) {
    issues.push("SMTP_PORT must be a valid port number.");
  }

  if (env.CONTACT_FROM_EMAIL && !isValidEmail(env.CONTACT_FROM_EMAIL)) {
    issues.push("CONTACT_FROM_EMAIL must be a valid email address.");
  }

  if (env.CONTACT_TO_EMAIL && !isValidEmail(env.CONTACT_TO_EMAIL)) {
    issues.push("CONTACT_TO_EMAIL must be a valid email address.");
  }

  return issues;
}

export function getContactDeliveryConfig(
  requestHost: string,
  env: NodeJS.ProcessEnv = process.env,
): ContactDeliveryConfig {
  const missingKeys = getMissingRequiredKeys(env);
  const issues = [...missingKeys, ...getInvalidOptionalIssues(env)];
  const to = env.CONTACT_TO_EMAIL ?? practiceContact.email;
  const from = env.CONTACT_FROM_EMAIL ?? env.SMTP_USER ?? practiceContact.email;

  if (issues.length > 0) {
    const operatorMessage = [
      "[contact] Form delivery is unavailable.",
      `Issues: ${issues.join(", ")}`,
    ].join(" ");

    if (runtimeEnv.DEV || isLocalHost(requestHost)) {
      return {
        mode: "local-preview",
        available: true,
        to,
        from,
        missingKeys: issues,
        operatorMessage,
      };
    }

    return {
      mode: "unavailable",
      available: false,
      to,
      from,
      issues,
      operatorMessage,
    };
  }

  return {
    mode: "smtp",
    available: true,
    to,
    from,
    transport: {
      host: env.SMTP_HOST!,
      port: Number(env.SMTP_PORT),
      secure: env.SMTP_SECURE === "true" || Number(env.SMTP_PORT) === 465,
      auth: {
        user: env.SMTP_USER!,
        pass: env.SMTP_PASS!,
      },
    },
  };
}

export function logLocalPreviewSubmission(
  operatorMessage: string,
  payload: unknown,
) {
  console.info(operatorMessage);
  console.info("[contact] Local preview submission:", payload);
}
