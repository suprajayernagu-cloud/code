# 🧪 Quick Testing Guide

## 1. Local Setup

```bash
cd /Users/siddiqkolimi/Desktop/HiringsToday/code

# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser
open http://localhost:5173
```

## 2. Test Each Feature (5 minutes total)

### A. Job Detail Page (1 min)
1. Visit: `http://localhost:5173/job/1`
2. ✅ Should see premium layout with 13 sections
3. ✅ Header has company logo, title, salary, location
4. ✅ Main content shows overview, responsibilities, eligibility
5. ✅ Sidebar shows related jobs
6. ✅ Apply button visible at top and middle

**Check HTML Content (critical for AdSense):**
```bash
# In browser DevTools:
# Right-click > View Page Source
# Search for "Overview"
# Should find text (not "undefined" or "Loading")
```

### B. Job Detail - Full Scroll (2 min)
Scroll through entire job page:
- [ ] Hero section (title, company, salary, apply button)
- [ ] Overview section (long text)
- [ ] Responsibilities (3+ items with details)
- [ ] Eligibility (2+ items)
- [ ] Skills Required (3+ skill cards)
- [ ] Salary Insights (paragraph)
- [ ] Why Apply (bullet points)
- [ ] Interview Preparation Tips (accordion)
- [ ] How to Apply (step-by-step)
- [ ] About Company (company info, founded, etc.)
- [ ] FAQ (accordion with Q&A)
- [ ] Related Jobs (sidebar with 3-5 jobs)

### C. Blog Listing (1 min)
1. Visit: `http://localhost:5173/blog`
2. ✅ Title: "Career & Job Search Insights"
3. ✅ Category buttons (All, Interview Prep, Career Growth, etc.)
4. ✅ 6 article cards visible
5. ✅ Each card shows image, title, category, excerpt
6. Click "All" category filter - all 6 should show
7. Click "Career Growth" - should filter to 2 articles
8. Click article card - should go to detail page

### D. Blog Detail Page (1 min)
1. From blog list, click "How to Ace Tech Interviews"
2. ✅ Full article title at top
3. ✅ Back button to return to blog
4. ✅ Category badge
5. ✅ Author info, date, read time
6. ✅ Featured image
7. ✅ Full article content with headers (H2, H3)
8. ✅ Share buttons (Twitter, LinkedIn, Facebook, Copy)
9. ✅ Related articles section at bottom
10. ✅ CTA button "Browse Jobs Now"

### E. Navigation (30 sec)
1. Click NavBar "Blog" link
2. ✅ Should go to `/blog`
3. Click NavBar "Jobs" link
4. ✅ Should go to home `/`
5. Test on mobile (toggle DevTools mobile view)
6. ✅ Mobile menu should show all links

### F. Search Bar (1 min)
1. Type "Engineer" in search bar
2. ✅ Should show 3-5 job suggestions
3. Each suggestion shows:
   - Job title (bold)
   - Company and location
   - Salary (if available)
4. Click a suggestion
5. ✅ Should navigate to `/job/[id]`

## 3. Responsive Design Test (2 min)

### Desktop (1920px)
1. Press F12 to open DevTools
2. Layout should be 3-column on job detail page
3. Related jobs in right sidebar
4. All text readable without zoom

### Tablet (768px)
1. Ctrl+Shift+M (or Cmd+Shift+M) to toggle device mode
2. Choose iPad
3. Layout should be 2-column or 1-column
4. Related jobs move below main content
5. Navigation menu works

### Mobile (375px)
1. Choose iPhone SE or similar
2. Layout should stack vertically
3. Related jobs at bottom
4. Nav menu should be hamburger (clickable)
5. Search bar fits screen
6. All buttons touch-friendly (40px+ size)
7. Text readable without zoom

## 4. SEO Checks (3 min)

### Meta Tags
1. Right-click on job detail page
2. Select "View Page Source" (not Inspect)
3. Search for:
   - `<title>` - should have job title + company
   - `<meta name="description"` - should have description
   - `<meta property="og:` - should have OG tags
   - `<link rel="canonical"` - should have correct URL
4. Repeat for blog article page

### Structured Data
1. Press Ctrl+U (Cmd+U on Mac) for page source
2. Search for `<script type="application/ld+json">`
3. Should find JSON-LD data (not empty)
4. Content should include job/article details

### HTML Content (Critical!)
1. Page source (Ctrl+U)
2. Search for "Overview" or specific job content
3. Should find actual text (not "undefined")
4. All enriched fields should be present

## 5. Browser Console Check (1 min)

1. Open DevTools (F12)
2. Go to Console tab
3. ✅ Should see: `✓ Loaded [X] jobs from [source]`
4. ❌ Should NOT see red errors
5. For warnings: OK if yellow (some are library issues)

## 6. Network Check (1 min)

1. DevTools > Network tab
2. Refresh page
3. Look for:
   - index.html - should be <100KB
   - JS bundles - reasonable sizes
   - Images - loaded with lazy loading
   - No failed requests (404 errors)
4. Total page load: <3 seconds

## 7. Performance Audit (2 min)

1. DevTools > Lighthouse tab
2. Click "Generate report"
3. Target scores:
   - Performance: 90+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+
4. If lower, note the issues
5. Common issues: images not optimized, unused CSS

## 8. Cross-Device Testing

### Tested Browsers
- [ ] Chrome (Desktop)
- [ ] Safari (Desktop)
- [ ] Firefox (Desktop)
- [ ] Chrome (Mobile)
- [ ] Safari (Mobile)

### Tested on Devices
- [ ] Desktop (1920px)
- [ ] Laptop (1366px)
- [ ] Tablet (768px)
- [ ] Phone (375px)

### Tested Orientations
- [ ] Desktop: Landscape
- [ ] Tablet: Both portrait and landscape
- [ ] Phone: Both portrait and landscape

## 9. Feature Testing

### Job Detail Features
- [ ] Apply button links to external URL
- [ ] Related jobs sidebar shows 3-5 jobs
- [ ] Clicking related job navigates to that job
- [ ] Salary displays correctly (format: ₹X LPA)
- [ ] Location displays correctly
- [ ] Company logo appears (or shows initials)

### Blog Features
- [ ] Blog list shows all articles
- [ ] Category filtering works (All, Interview Prep, etc.)
- [ ] Clicking article goes to detail
- [ ] Social share buttons have correct URLs
- [ ] Related articles show at bottom
- [ ] "Browse Jobs Now" CTA goes to home

### Search Features
- [ ] Typing triggers suggestions
- [ ] Autocomplete shows company and location
- [ ] No suggestions for 1 character
- [ ] Clicking suggestion navigates to job
- [ ] Search on mobile works

## 10. Final Checklist

### Critical (Must Work)
- [ ] Job detail page loads
- [ ] Content visible in HTML (view source)
- [ ] Meta tags present
- [ ] Structured data present
- [ ] Mobile responsive

### Important (Should Work)
- [ ] Blog loads
- [ ] Navigation works
- [ ] Search works
- [ ] Related jobs show
- [ ] No console errors

### Nice to Have
- [ ] Lighthouse 90+
- [ ] Load time <3s
- [ ] All images load
- [ ] Share buttons work
- [ ] UI looks polished

## Troubleshooting

### Problem: Blank page
**Solution:**
```bash
# Clear cache
npm run dev
# Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
# Check console for errors (F12 > Console)
```

### Problem: "Jobs not loading"
**Solution:**
```bash
# Check if data file exists
ls -la src/Untitled-1.json
# Check console for fetch errors
# Verify JSON format is valid
node -c src/Untitled-1.json
```

### Problem: Meta tags missing
**Solution:**
- Check view-source (not Inspect)
- Rebuild: `npm run build`
- Clear browser cache
- Try different browser

### Problem: Images not showing
**Solution:**
- Check URLs are HTTPS
- Test URL in browser directly
- Verify CORS headers
- Use different image host

## Performance Quick Check

```bash
# Build for production
npm run build

# Check bundle sizes
ls -lh dist/assets/

# Expected:
# - Main JS: <200KB
# - CSS: <50KB
# - Total: <500KB
```

## Final Sign-off

Before deployment, confirm:

```
✅ All feature tests passed
✅ Responsive design works
✅ No console errors
✅ Meta tags present
✅ Content in HTML
✅ Performance acceptable
✅ Links work
✅ Mobile tested
```

**Status:** Ready for deployment ✅

---

**Time to complete all tests:** ~30 minutes
**Critical time:** Meta tags & content visibility check (5 min)
