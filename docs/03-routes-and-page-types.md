# OPM Fingerstyle — Routes and Page Types

## Route list

### Homepage
Route:
```text
/
```

Purpose:
- explain the site
- highlight featured guitarists
- highlight recent videos/tabs
- link to major sections

### Guitarist directory
Route:
```text
/guitarists
```

Purpose:
- browse all approved guitarists

Main elements:
- guitarist cards
- search or filter later
- link to profile pages

### Guitarist profile
Route:
```text
/guitarists/[slug]
```

Purpose:
- show the guitarist profile
- show selected videos
- show tab links
- show social links
- optionally show light gear block

### Videos listing
Route:
```text
/videos
```

Purpose:
- aggregate video-related content

### Tabs listing
Route:
```text
/tabs
```

Purpose:
- aggregate tablature-related content

### Gear index
Route:
```text
/gear
```

Purpose:
- browse products or gear guides

### Gear detail
Route:
```text
/gear/[slug]
```

Purpose:
- show product or gear guide content
- support affiliate links
- support sponsor/product placement

### Blog index
Route:
```text
/blog
```

### Blog article
Route:
```text
/blog/[slug]
```

Purpose:
- SEO and educational content
- internal linking to guitarists and gear

### Submit profile
Route:
```text
/submit
```

Purpose:
- allow creator profile submission

### Legal/info pages
Routes:
```text
/about
/contact
/affiliate-disclosure
/privacy-policy
```

## Page rules

### Guitarist profile page rules
Must contain:
- name
- bio
- profile image
- YouTube channel link or at least one video
- tabs section if available
- socials if available

Should not:
- look like a product landing page
- place aggressive ad blocks above core content

### Gear page rules
May contain:
- product block
- sponsor block
- affiliate links
- comparison content
- buying guidance

### Blog page rules
Must prioritize useful content over thin SEO copy.
