---
"current-device": patch
---

Add IIFE build output for browser `<script>` tag usage via CDN (unpkg, jsdelivr). Fixes #385 where the UMD build was removed in v2.0.0, breaking `<script src="https://unpkg.com/current-device">` imports.
