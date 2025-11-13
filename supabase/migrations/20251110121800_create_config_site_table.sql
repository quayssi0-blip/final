e same for a-- Create config_site table
CREATE TABLE public.config_site (
  id bigserial PRIMARY KEY,
  logo_ar text,
  logo_fr text,
  logo_an text,
  logo_alt_ar text,
  logo_alt_fr text,
  logo_alt_an text,
  site_name_ar text,
  site_name_fr text,
  site_name_an text,
  tagline_ar text,
  tagline_fr text,
  tagline_an text,
  description_ar text,
  description_fr text,
  description_an text,
  meta_title_ar text,
  meta_title_fr text,
  meta_title_an text,
  meta_description_ar text,
  meta_description_fr text,
  meta_description_an text,
  favicon text,
  primary_color varchar(7),
  secondary_color varchar(7),
  theme text,
  default_locale varchar(10) NOT NULL DEFAULT 'en',
  supported_locales jsonb NOT NULL DEFAULT '[]'::jsonb,
  timezone varchar(64),
  currency_code varchar(8),
  contact_email varchar(254),
  support_email varchar(254),
  contact_phone text,
  address_ar text,
  address_fr text,
  address_an text,
  social_facebook text,
  social_twitter text,
  social_instagram text,
  social_linkedin text,
  social_youtube text,
  analytics_id text,
  recaptcha_site_key text,
  recaptcha_secret_key text,
  maintenance_mode boolean NOT NULL DEFAULT false,
  maintenance_message jsonb,
  items_per_page integer DEFAULT 20,
  max_upload_size_bytes bigint DEFAULT 10485760,
  allowed_file_types jsonb DEFAULT '[]'::jsonb,
  misc_json jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add comment to the table
COMMENT ON TABLE public.config_site IS 'Stores site-wide configuration settings including multilingual content';

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON public.config_site
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_timestamp();

-- Insert default configuration
INSERT INTO public.config_site (
  default_locale,
  supported_locales,
  items_per_page,
  maintenance_mode,
  allowed_file_types
) VALUES (
  'fr',
  '["fr", "ar", "an"]'::jsonb,
  20,
  false,
  '["image/jpeg", "image/png", "image/gif", "application/pdf"]'::jsonb
);