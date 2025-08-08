import { ModelDefinition } from '@/types/modelTypes';
import { ApiKeyType, SettingsMenuData } from '@/types/settingTypes';
import type { ErrorCode } from '@supabase/auth-js/src/lib/error-codes';
import { KeyRound, LockKeyhole } from 'lucide-react';

/**
 * *******************************************************************************************************************
 * 共通定数
 * *******************************************************************************************************************
 */
export const MOBILE_BREAKPOINT = 768;

/**
 * *******************************************************************************************************************
 * 認証関係
 * *******************************************************************************************************************
 */
export const AUTH_ERROR_MESSAGES = {
  unexpected_failure: 'An unexpected error occurred. Please try again.',
  validation_failed: 'Some fields are invalid. Please review and try again.',
  bad_json: 'Malformed request.',
  email_exists: 'An account with this email already exists.',
  phone_exists: 'An account with this phone number already exists.',
  bad_jwt: 'Your session is invalid or has expired.',
  not_admin: 'You do not have permission to perform this action.',
  no_authorization: 'You must be signed in to perform this action.',
  user_not_found: 'Unable to find a user with those credentials.',
  session_not_found: 'Session not found or has expired.',
  session_expired: 'Your session has expired. Please sign in again.',
  refresh_token_not_found: 'Refresh token not found.',
  refresh_token_already_used: 'Refresh token has already been used.',
  flow_state_not_found: 'Unable to continue signin flow.',
  flow_state_expired: 'Authentication flow expired. Please try again.',
  signup_disabled: 'Sign-ups are currently disabled.',
  user_banned: 'Your account has been suspended.',
  provider_email_needs_verification: 'Please verify your email with the provider before continuing.',
  invite_not_found: 'Invitation link is invalid or has expired.',
  bad_oauth_state: 'OAuth state mismatch. Please try again.',
  bad_oauth_callback: 'OAuth callback failed. Please try again.',
  oauth_provider_not_supported: 'This OAuth provider is not supported.',
  unexpected_audience: 'Invalid audience specified.',
  single_identity_not_deletable: 'This identity cannot be removed.',
  email_conflict_identity_not_deletable:
    'This identity cannot be removed because it conflicts with your email address.',
  identity_already_exists: 'This identity is already associated with another account.',
  email_provider_disabled: 'Email authentication is currently disabled.',
  phone_provider_disabled: 'Phone authentication is currently disabled.',
  too_many_enrolled_mfa_factors: 'Too many MFA factors are enrolled.',
  mfa_factor_name_conflict: 'An MFA factor with this name already exists.',
  mfa_factor_not_found: 'Requested MFA factor was not found.',
  mfa_ip_address_mismatch: 'IP address mismatch during MFA verification.',
  mfa_challenge_expired: 'MFA challenge expired. Please try again.',
  mfa_verification_failed: 'MFA verification failed.',
  mfa_verification_rejected: 'MFA verification was rejected.',
  insufficient_aal: 'Additional authentication is required.',
  captcha_failed: 'CAPTCHA verification failed.',
  saml_provider_disabled: 'SAML provider is disabled.',
  manual_linking_disabled: 'Manual account linking is disabled.',
  sms_send_failed: 'Failed to send SMS verification code.',
  email_not_confirmed: 'Please verify your email address to continue.',
  phone_not_confirmed: 'Please verify your phone number to continue.',
  reauth_nonce_missing: 'Re-authentication token is missing.',
  saml_relay_state_not_found: 'SAML relay state not found.',
  saml_relay_state_expired: 'SAML relay state expired.',
  saml_idp_not_found: 'SAML identity provider not found.',
  saml_assertion_no_user_id: 'Unable to authenticate without a user ID.',
  saml_assertion_no_email: 'Unable to authenticate without an email address.',
  user_already_exists: 'An account with these credentials already exists.',
  sso_provider_not_found: 'SSO provider not found.',
  saml_metadata_fetch_failed: 'Failed to fetch SAML metadata.',
  saml_idp_already_exists: 'This SAML identity provider already exists.',
  sso_domain_already_exists: 'This SSO domain is already registered.',
  saml_entity_id_mismatch: 'SAML entity ID mismatch.',
  conflict: 'The request could not be completed due to a conflict.',
  provider_disabled: 'This authentication provider is disabled.',
  user_sso_managed: 'Your account is managed by SSO. Please sign in with your SSO provider.',
  reauthentication_needed: 'Please re-authenticate to continue.',
  same_password: 'The new password must be different from the current one.',
  reauthentication_not_valid: 'The re-authentication attempt is invalid.',
  otp_expired: 'The one-time passcode has expired.',
  otp_disabled: 'One-time passcodes are disabled.',
  identity_not_found: 'Identity not found.',
  weak_password: 'Password is too weak. Please choose a stronger one.',
  over_request_rate_limit: 'Too many requests. Please wait and try again.',
  over_email_send_rate_limit: 'Too many email requests. Please wait and try again.',
  over_sms_send_rate_limit: 'Too many SMS requests. Please wait and try again.',
  bad_code_verifier: 'Invalid code verifier.',
  anonymous_provider_disabled: 'Anonymous sign-in is disabled.',
  hook_timeout: 'Server function timed out.',
  hook_timeout_after_retry: 'Server function timed out after retry.',
  hook_payload_over_size_limit: 'Request payload is too large.',
  hook_payload_invalid_content_type: 'Invalid payload content type.',
  request_timeout: 'Request timed out. Please try again.',
  mfa_phone_enroll_not_enabled: 'Phone-based MFA enrollment is not enabled for this account.',
  mfa_phone_verify_not_enabled: 'Phone-based MFA verification is not enabled for this account.',
  mfa_totp_enroll_not_enabled: 'TOTP MFA enrollment is not enabled for this account.',
  mfa_totp_verify_not_enabled: 'TOTP MFA verification is not enabled for this account.',
  mfa_webauthn_enroll_not_enabled: 'WebAuthn MFA enrollment is not enabled for this account.',
  mfa_webauthn_verify_not_enabled: 'WebAuthn MFA verification is not enabled for this account.',
  mfa_verified_factor_exists: 'An MFA factor of this type is already verified.',
  invalid_credentials: 'Invalid credentials.',
  email_address_not_authorized: 'This email address is not authorized.',
  email_address_invalid: 'The email address format is invalid.',
} as const satisfies Record<ErrorCode, string>;

export const FALLBACK_MESSAGE = 'Something went wrong. Please try again or contact support.';
export const RESEND_VERIFY_EMAIL_SUCCESS_MESSAGE = 'Verification email resent successfully. Please check your inbox.';
export const REQUEST_RESET_SUCCESS_MESSAGE = 'Password-reset link sent! Please check your inbox.';
export const RESET_PASSWORD_SUCCESS_MESSAGE = 'Password reset successful. Please log in.';
export const UPDATE_PASSWORD_SUCCESS_MESSAGE = 'Password updated successfully. Please log in again.';
export const DELETE_ACCOUNT_SUCCESS_MESSAGE = 'Account deleted successfully.';

/**
 * *******************************************************************************************************************
 * 設定ダイアログ関係
 * *******************************************************************************************************************
 */
export const API_KEY_SAVE_SUCCESS_MESSAGE = 'API key saved successfully';
export const API_KEY_SAVE_FAILURE_MESSAGE = 'Failed to save API key';
export const API_KEY_DELETE_SUCCESS_MESSAGE = 'API key deleted successfully';
export const API_KEY_DELETE_FAILURE_MESSAGE = 'Failed to delete API key';

export const NAV_NAMES = {
  General: 'General',
  Security: 'Security',
  ApiKey: 'Api Key',
} as const;

export const SECURITY_SUB_NAV_NAMES = {
  ChangePassword: 'Change Password',
  TwoFactorAuthentication: 'Two-Factor Authentication',
} as const;

export const API_KEY_TYPES = {
  HUGGING_FACE: { id: '1', value: 'Hugging Face' },
} as const;

export const SETTING_ITEMS: SettingsMenuData = {
  nav: [
    { name: NAV_NAMES.ApiKey, icon: KeyRound },
    { name: NAV_NAMES.Security, icon: LockKeyhole, subNav: Object.values(SECURITY_SUB_NAV_NAMES) },
  ],
};

/**
 * *******************************************************************************************************************
 * チャット画面関係
 * *******************************************************************************************************************
 */
export const MODEL_STORAGE_KEY = 'selectedChatModel';

export const HUGGING_FACE_MODEL_DEFINITIONS = {
  META_LLAMA_3_8B: {
    name: 'Meta-Llama-3-8B',
    modelId: 'meta-llama/Meta-Llama-3-8B',
  },
  GPT_2: {
    name: 'GPT-2',
    modelId: 'openai-community/gpt2',
  },
} as const satisfies ModelDefinition;

export const MODEL_DEFINITIONS_BY_API_KEY: Record<ApiKeyType, ModelDefinition> = {
  [API_KEY_TYPES.HUGGING_FACE.value]: HUGGING_FACE_MODEL_DEFINITIONS,
} as const;
