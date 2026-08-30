export const INDUSTRY_OPTIONS = [
  "CRM", "Accounting", "ERP", "HR/Payroll", "Point of Sale", "E-commerce",
  "Payments", "Logistics/Transport", "Property/Real Estate", "Healthcare",
  "Education", "Marketing", "Customer Support", "Communication",
  "Booking/Appointments", "Inventory", "Project Management",
  "Financial Services", "Other",
] as const;

export const COMPANY_SIZE_OPTIONS = ["1-10", "11-50", "51-200", "201-500", "500+"] as const;

export const PLATFORM_CATEGORY_OPTIONS = INDUSTRY_OPTIONS; // same list, per the spec

export const PLATFORM_USER_OPTIONS = [
  "SMEs", "Enterprise", "Startups", "Schools", "Churches/Nonprofits",
  "Healthcare Practices", "Transport Companies", "Professional Services",
  "Retail", "Other",
] as const;

export const GEOGRAPHIC_MARKET_OPTIONS = [
  "South Africa", "Southern Africa", "Africa", "International",
] as const;

export const HAS_API_OPTIONS = ["yes", "no", "in_development", "not_sure"] as const;
export const API_TYPE_OPTIONS = ["REST", "GraphQL", "SOAP", "Other"] as const;
export const YES_NO_NOT_SURE = ["yes", "no", "not_sure"] as const;
export const YES_NO = ["yes", "no"] as const;
export const AUTH_TYPE_OPTIONS = [
  "oauth2", "api_keys", "oauth2_and_api_keys", "other", "none",
] as const;

export const EXPOSABLE_ACTIONS: Record<string, string[]> = {
  Customers: ["Create customer", "Update customer", "Retrieve customer", "Delete/archive customer"],
  Sales: ["Create lead", "Update lead", "Retrieve lead", "Create opportunity", "Update opportunity"],
  Communication: ["Send message", "Receive message", "Send email", "Receive email", "Trigger notifications"],
  Operations: ["Create task", "Update task", "Retrieve task", "Trigger workflow", "Receive status updates"],
  Finance: ["Create invoice", "Retrieve invoice", "Payment status", "Customer payment information"],
  Other: ["Custom API actions"],
};

export const EXISTING_INTEGRATION_OPTIONS = [
  "Zapier", "Make", "n8n", "Microsoft Power Automate", "Other", "None",
] as const;

export const MARKETPLACE_OPTIONS = ["yes", "no", "planned"] as const;

export const INTEREST_TYPE_OPTIONS = [
  "Synkra integration", "Joint integration", "Referral partnership",
  "Reseller partnership", "Co-marketing", "Technology partnership",
  "Marketplace listing", "Automation services partnership", "Other",
] as const;

export const CUSTOMER_COUNT_OPTIONS = [
  "1-100", "101-500", "501-1,000", "1,001-5,000", "5,001-10,000", "10,000+",
] as const;

export const SA_PERCENTAGE_OPTIONS = ["<10%", "10-25%", "26-50%", "51-75%", "76-100%"] as const;

export const ACCESS_PRICING_OPTIONS = [
  "free", "included_in_subscription", "paid", "usage_based", "enterprise_only", "not_sure",
] as const;

export const PARTNER_PRICING_OPTIONS = ["yes", "no", "under_discussion"] as const;
export const PREFERRED_CONTACT_OPTIONS = ["Email", "Phone", "Either"] as const;

export type IntegrationPartnerFormData = {
  // Section 1 - Company
  company_name: string;
  website: string;
  country: string;
  primary_markets: string;
  industry: string;
  company_size: string;

  // Section 2 - Contact
  contact_name: string;
  contact_title: string;
  contact_email: string;
  contact_phone: string;
  preferred_contact_method: string;

  // Section 3 - Platform
  platform_name: string;
  platform_description: string;
  platform_categories: string[];
  platform_users: string[];
  geographic_market: string[];

  // Section 4 - Integration capabilities
  has_api: string;
  api_docs_url: string;
  api_type: string;
  has_webhooks: string;
  auth_type: string;
  has_dev_portal: string;
  dev_docs_url: string;

  // Section 5 - Exposable actions
  exposable_actions: string[];
  other_capabilities: string;

  // Section 6 - Existing ecosystem
  existing_integrations: string[];
  existing_integrations_other: string;
  has_marketplace: string;
  has_third_party_devs: string;

  // Section 7 - Partnership interest
  interest_types: string[];
  why_partner: string;
  desired_integration_outcome: string;

  // Section 8 - Customer overlap
  customer_count_range: string;
  sa_customer_percentage: string;
  customer_business_types: string;

  // Section 9 - Technical contact (conditional)
  tech_contact_name: string;
  tech_contact_email: string;
  sandbox_available: string;
  test_credentials_available: string;
  dev_account_available: string;

  // Section 10 - Commercial
  access_pricing_model: string;
  has_additional_third_party_costs: string;
  has_partner_pricing: string;
  has_referral_program: string;
  referral_program_details: string;

  // Section 12 - Consent
  consent_accurate: boolean;
  consent_marketing: boolean;
};

export const EMPTY_FORM: IntegrationPartnerFormData = {
  company_name: "", website: "", country: "", primary_markets: "", industry: "", company_size: "",
  contact_name: "", contact_title: "", contact_email: "", contact_phone: "", preferred_contact_method: "",
  platform_name: "", platform_description: "", platform_categories: [], platform_users: [], geographic_market: [],
  has_api: "", api_docs_url: "", api_type: "", has_webhooks: "", auth_type: "", has_dev_portal: "", dev_docs_url: "",
  exposable_actions: [], other_capabilities: "",
  existing_integrations: [], existing_integrations_other: "", has_marketplace: "", has_third_party_devs: "",
  interest_types: [], why_partner: "", desired_integration_outcome: "",
  customer_count_range: "", sa_customer_percentage: "", customer_business_types: "",
  tech_contact_name: "", tech_contact_email: "", sandbox_available: "", test_credentials_available: "", dev_account_available: "",
  access_pricing_model: "", has_additional_third_party_costs: "", has_partner_pricing: "", has_referral_program: "", referral_program_details: "",
  consent_accurate: false, consent_marketing: false,
};
