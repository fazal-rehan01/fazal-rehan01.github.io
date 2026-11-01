# Rehan Fazal — SOC Analyst Portfolio

A dark, responsive single-page cybersecurity portfolio for an aspiring SOC Analyst, focused on network security, threat detection, and security awareness.

The site is plain HTML, CSS, and JavaScript — no build step and no framework. `index.html` is the single source of truth.

## What's Included

- Dark cybersecurity theme with cyan and neon-green accents
- Responsive, mobile-first layout with an accessible slide-down navigation menu
- Hero section with terminal animation, skill tags, and CTAs
- About section covering focus areas and career goals
- Two detailed project case studies:
  - Network Packet Sniffer (Python / Scapy)
  - Phishing Awareness Training Platform (HTML / CSS / JavaScript)
- Skills matrix with animated proficiency bars
- Current learning path with progress indicators
- Home lab environment and planned network topology
- Certifications and training roadmap
- Blog / thought-leadership section
- Live GitHub repository feed using the GitHub REST API
- Contact details and a form that opens the visitor's email client
- SEO meta tags, Open Graph tags, JSON-LD `Person` schema, and a favicon
- Accessible markup: skip link, focus states, ARIA attributes, reduced-motion support, and WCAG AA color contrast
- Printable stylesheet
- One-page resume PDF at `assets/resume.pdf`

## File Structure

```
soc-portfolio/
├── index.html            # All page content and structure
├── css/
│   └── style.css         # Theme, layout, components, responsive rules
├── js/
│   └── main.js           # Navigation, animations, GitHub API, contact form
├── assets/
│   └── resume.pdf        # Downloadable resume
├── images/               # Add your headshot here
└── README.md
```

## Run Locally

Open `index.html` directly, or serve the folder to avoid browser restrictions on local files:

```bash
cd soc-portfolio
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Customization

### Headshot

The hero uses a styled placeholder. To use a photo:

1. Add your image at `images/rehan-fazal.jpg`.
2. In `index.html`, replace the `.headshot-placeholder` block with:

```html
<img src="images/rehan-fazal.jpg" alt="Rehan Fazal" class="headshot-image">
```

3. Add a `.headshot-image` rule in `css/style.css` (for example, `width: 100%; aspect-ratio: 4 / 4.6; object-fit: cover; border-radius: 20px;`).

### Resume

`assets/resume.pdf` is a generated one-page resume. Replace it with your latest version, keeping the same filename so the hero button keeps working.

### Projects

Edit the project cards inside the `#projects` section of `index.html`. Each card includes tags, a description, a problem/outcome summary, technical implementation notes, SOC relevance, learning outcomes, and repository links.

### Skills, Learning Path, Certifications, and Blog

These are static content blocks in `index.html`. Update the text and the inline `--level` / `--progress` CSS variables to change bar widths (for example, `style="--level: 82%"`).

### GitHub Feed

The feed uses the public GitHub API. The username is set at the top of `js/main.js`:

```js
var GITHUB_USERNAME = 'fazal-rehan01';
```

Unauthenticated requests are limited to 60 per hour per IP. The widget displays a friendly fallback if the limit is reached. For a busy production site, add a token through a small serverless proxy instead of exposing it in client-side code.

### Contact Form

The form validates input, includes a honeypot field, and opens the visitor's email client with a pre-filled message addressed to `kfazal.0000@gmail.com`. No message data is stored by the site.

To deliver messages server-side instead, replace the `mailto` block in `initContactForm()` (`js/main.js`) with a request to a form service:

- **Formspree:** set the form `action` to your endpoint and `method="POST"`, then submit with `fetch`.
- **Netlify Forms:** add `netlify` to the `<form>` element and deploy on Netlify.
- **Custom endpoint:** post the `FormData` to your API and handle the response.

### Colors and Typography

Theme tokens live at the top of `css/style.css` under `:root`:

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#0a0e17` | Page background |
| `--accent` | `#00d4ff` | Primary cyan accent |
| `--green` | `#00ff88` | Secondary neon-green accent |
| `--card` | `#101827` | Card surfaces |
| `--text` | `#e8f0fa` | Primary text |
| `--font-sans` | Inter | Body and headings |
| `--font-mono` | JetBrains Mono | Code and labels |

## Deployment

### GitHub Pages

1. Push the project to a GitHub repository.
2. Open **Settings → Pages**.
3. Select the branch (for example, `main`) and the `/ (root)` folder.
4. The site will be published at `https://<username>.github.io/<repo>/`.

### Netlify

Drag the `soc-portfolio` folder into Netlify Drop, or connect the repository for automatic deployments. No build command is required; publish directory is `/`.

### Vercel

Import the repository and deploy as a static site. Leave the build command empty and set the output directory to the project root.

### HTTPS

All three platforms provide free TLS certificates. If you use a custom domain, enable HTTPS in the hosting provider's dashboard.

## Analytics

No analytics tracker is bundled. Add a privacy-friendly option such as Plausible, Fathom, or Umami by pasting the provider's script before `</body>` in `index.html`.

## Accessibility Notes

- Skip-to-content link for keyboard users
- Visible `:focus-visible` outlines
- `aria-expanded`, `aria-controls`, `aria-current`, and `aria-live` where relevant
- Navigation closes with `Escape` and returns focus to the toggle
- Decorative icons marked `aria-hidden`
- Respects `prefers-reduced-motion`
- Text contrast meets WCAG 2.1 AA for normal text

## Browser Support

Latest versions of Chrome, Firefox, Safari, and Edge. The site degrades gracefully without JavaScript: the mobile navigation becomes a static wrapped menu, all content remains readable, reveal animations are disabled, and the contact section shows a direct email link in place of the form.

## Notes

- The earlier `generate_site.py` draft was corrupted and out of sync with the site, so it was removed. Edit `index.html` directly.
- Replace the placeholder social links only if your usernames change; contact details currently point to `kfazal.0000@gmail.com`, `linkedin.com/in/rehank03`, `github.com/fazal-rehan01`, and `tryhackme.com/p/kfazal.0000`.

## License

MIT — free to adapt for your own portfolio.
