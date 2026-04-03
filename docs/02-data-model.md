# OPM Fingerstyle — Data Model

## Entity: Guitarist
Purpose: public profile for a guitarist.

Fields:
- id
- slug
- display_name
- real_name_optional
- location_optional
- bio_short
- bio_full_optional
- profile_photo_url
- youtube_channel_url
- contact_email_or_contact_link_optional
- approval_status
- created_at
- updated_at

Approval status values:
- draft
- pending_review
- approved
- rejected

## Entity: GuitaristVideo
Purpose: store featured YouTube videos for a guitarist.

Fields:
- id
- guitarist_id
- youtube_url
- title_optional
- thumbnail_url_optional
- featured_order
- created_at

## Entity: TablatureLink
Purpose: external tablature links related to a guitarist.

Fields:
- id
- guitarist_id
- title
- song_name_optional
- source_label
- external_url
- created_at

## Entity: SocialLink
Purpose: store social/profile links for a guitarist.

Fields:
- id
- guitarist_id
- platform
- external_url

Suggested platform values:
- facebook
- instagram
- youtube
- tiktok
- spotify
- website
- x
- other

## Entity: GearProduct
Purpose: monetizable gear/product entry.

Fields:
- id
- slug
- name
- brand_optional
- category
- short_description
- image_url_optional
- external_url
- affiliate_url_optional
- sponsored_flag
- active_flag
- created_at
- updated_at

Suggested category values:
- acoustic_guitar
- classical_guitar
- strings
- capo
- tuner
- pickup
- microphone
- audio_interface
- amp
- cable
- stand
- accessory

## Entity: Article
Purpose: editorial or SEO content page.

Fields:
- id
- slug
- title
- excerpt
- body
- featured_image_url_optional
- status
- published_at_optional
- created_at
- updated_at

Article status values:
- draft
- published
- archived

## Optional future entity: Song
Purpose: dedicated song-level pages.

Fields:
- id
- slug
- title
- artist_name_optional
- description_optional
- created_at
- updated_at

Not required for first MVP unless song pages are a launch priority.
