Here is a comprehensive `README.md` specifically designed for your blog maintenance and deployment workflow. It covers the exact steps for creating posts, updating `blog.js`, and updating `sitemap.xml`, as you requested.

You can save this as `README.md` in the root of your GitHub repository.

---

```markdown
# Aimad Ul Islam Blog – Maintenance & Deployment Guide

This document serves as a technical reference for adding new blog posts, updating metadata, and deploying the website to GitHub Pages. The blog is built with plain HTML, CSS, and vanilla JavaScript.

## 📁 Relevant File Structure

```text
/
├── index.html            # Main portfolio site (linked to blog)
├── blog.html             # Blog homepage (search, categories, pagination)
├── css/
│   └── blog.css          # Blog-specific styles (matches main site)
├── js/
│   └── blog.js           # JavaScript core (contains BLOG_POSTS data)
├── posts/                # All individual blog post files go here
│   ├── kali-linux-setup-guide.html
│   ├── nmap-complete-guide.html
│   └── ... (new posts go here)
├── sitemap.xml           # XML sitemap for search engines
├── robots.txt            # Crawler instructions
└── CNAME                 # Custom domain configuration for GitHub Pages
```

---

## 🖊️ How to Add or Edit a Blog Post

There are **three steps** to adding a new post to the blog system.

### Step 1: Create the HTML File in the `posts/` folder

To save time and ensure consistency, **do not write the HTML from scratch**. Instead, copy an existing post file (e.g., `posts/kali-linux-setup-guide.html`) and rename it to match your new post (e.g., `posts/wireshark-guide.html`).

Once copied, edit the following metadata at the top of the new HTML file:

- `title` and `<meta name="description">`
- `canonical` URL
- `og:title`, `og:description`, and `og:url`
- `article:published_time`
- The **JSON-LD Schema** block (update `headline`, `datePublished`, `dateModified`, and `url`)
- The **breadcrumb** navigation links
- The **article header** (Title, Subtitle, Categories, Tags, Date, Reading Time)
- The **main body content** of the article.

### Step 2: Register the Post in `js/blog.js`

This step is mandatory, as the `blog.js` file drives the main blog listing, search, categories, sidebar, and pagination.

Open `js/blog.js` and find the `const BLOG_POSTS = [ ... ]` array. Add a new object at the end of the array with the following structure (replace the placeholder values with your post's data):

```javascript
  {
    id: 9,  // Make sure this number is unique and sequential (check the last ID in the array)
    title: "Wireshark Deep Dive: Packet Analysis for Beginners",
    subtitle: "Learn how to capture, filter, and analyze network traffic like a pro using Wireshark.",
    excerpt: "Wireshark is the gold standard for network analysis. This comprehensive guide walks you through packet capturing, display filters, and identifying malicious traffic patterns.",
    slug: "wireshark-guide",
    file: "posts/wireshark-guide.html", // Ensure this matches the filename created in Step 1
    category: ["Cybersecurity", "Networking", "Tutorials"],
    tags: ["wireshark", "packet-analysis", "network-security", "troubleshooting"],
    author: "Aimad Ul Islam",
    date: "2026-08-15", // Format: YYYY-MM-DD
    updated: "2026-08-15",
    readingTime: 15, // Estimated minutes to read
    featured: false, // Set to true if you want this to appear as the Featured Post
    image: "", // Optional: absolute URL to an image
    imageAlt: "Wireshark interface showing packet capture",
    emoji: "🦈", // Fallback emoji for the post grid
  },
```

> **Key Tip:** The `category` and `tags` arrays must match existing categories or tags to be properly highlighted by the blog's CSS and filtering system.

### Step 3: Update the `sitemap.xml` for SEO

The sitemap is static, so you must manually add your new post to it to ensure search engines (like Google and Bing) crawl it efficiently.

Open `sitemap.xml` and add a `<url>` block to the list (usually at the end, right before the closing `</urlset>` tag):

```xml
  <url>
    <loc>https://aimadulislam.dpdns.org/posts/wireshark-guide.html</loc>
    <lastmod>2026-08-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
```

> **Pro Tip:** Keep `<changefreq>` as `monthly` or `weekly` for posts, and set `<priority>` between `0.6` and `0.8` for standard articles.

---

## 🚀 Deployment to GitHub Pages

Once you have created the HTML file, updated `blog.js`, and updated `sitemap.xml`, commit your changes and push them to GitHub.

```bash
git add posts/wireshark-guide.html js/blog.js sitemap.xml
git commit -m "Add new blog post: Wireshark Deep Dive"
git push origin main
```

Your live site at `https://aimadulislam.dpdns.org` will update automatically within a few minutes thanks to the GitHub Pages build process.

- **`CNAME` file:** This is already configured in the repository, so your custom domain (`aimadulislam.dpdns.org`) will persist across deployments.
- **SSL:** If you are using Cloudflare in front of GitHub Pages (as previously configured), make sure your SSL is set to **"Full"** and **"Always Use HTTPS"** is enabled for encryption.

---

## ✅ Bonus Tips

- **Editing a Post:** If you update the content of an existing post, just update the HTML file in `posts/` and **ensure you update the `updated` date** in both the HTML meta tags and the `js/blog.js` entry so your readers know it's fresh content.
- **Image Hosting:** If you want to include screenshots in your posts, host them on a free image host (like Postimages.org) and use the absolute URL in your `<img>` tag within the HTML file.
- **404 Error Check:** After uploading, always open the live version of your new blog post. Click the links around the site to ensure the breadcrumbs, navigation, and related posts sections link correctly.
```
