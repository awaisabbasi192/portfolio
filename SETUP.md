# Portfolio Setup Guide

This portfolio includes advanced features that require configuration. Follow the steps below to enable all functionality.

## 1. EmailJS Configuration (Contact Form)

EmailJS allows the contact form to send real emails without a backend server.

### Setup Steps:

1. **Create EmailJS Account**
   - Go to https://www.emailjs.com/
   - Sign up for a free account
   - Verify your email

2. **Add Email Service**
   - Go to "Email Services" in the dashboard
   - Add your email service (Gmail, Outlook, etc.)
   - Follow the authentication steps

3. **Create Email Template**
   - Go to "Email Templates"
   - Create a new template with these variables:
     - `{{from_name}}` - Visitor's name
     - `{{from_email}}` - Visitor's email
     - `{{subject}}` - Message subject
     - `{{message}}` - Message content

4. **Get Your Credentials**
   - Copy your **Public Key** from Account settings
   - Copy your **Service ID** from Email Services
   - Copy your **Template ID** from Email Templates

5. **Update script.js**
   - Find line with `YOUR_EMAILJS_PUBLIC_KEY` in `script.js`
   - Replace with your Public Key
   - Find lines with `YOUR_SERVICE_ID` and `YOUR_TEMPLATE_ID`
   - Replace with your Service ID and Template ID

### Example Setup:
```javascript
emailjs.init('abc123xyz789'); // Your Public Key
emailjs.send('service_abc123', 'template_xyz789', {
    from_name: 'Visitor Name',
    from_email: 'visitor@example.com',
    subject: 'Hello',
    message: 'Your message here'
});
```

---

## 2. Google Analytics Configuration

Track visitor statistics and user behavior.

### Setup Steps:

1. **Create Google Analytics Account**
   - Go to https://analytics.google.com/
   - Create a new property for your portfolio
   - Set up a web data stream

2. **Get Your Measurement ID**
   - Copy the Measurement ID (format: G-XXXXXXXXXX)

3. **Update index.html**
   - Find the Google Analytics script in `<head>` section
   - Replace `G-XXXXXXXXXX` with your Measurement ID (appears 2 times)

### Example Setup:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-ABC123XYZ');
</script>
```

---

## 3. GitHub API Integration

Display your GitHub repositories on the portfolio.

### Setup Steps:

1. **GitHub Username**
   - Find your GitHub username (e.g., `awaisabbasi192`)

2. **Update script.js**
   - Find the `initGitHubRepos()` function
   - Replace `awaisabbasi192` with your GitHub username
   - The function will automatically fetch your public repositories

### Note:
- No authentication required for public repositories
- Fetches your 6 most recently updated repositories
- Works with public GitHub profiles

---

## 4. Features Included

✅ **Mobile Responsive Navigation**
- Hamburger menu for mobile devices
- Smooth scroll to sections
- Active section highlighting

✅ **Content Sections**
- Services/Offerings
- Blog with search and filtering
- FAQ with accordions
- Certificates & Awards
- Case Studies

✅ **Interactive Features**
- Smooth scroll progress bar
- Page loader animation
- Custom cursor effects
- Social share buttons
- Newsletter signup
- Contact form with email

✅ **Advanced Features**
- Dark/Light theme toggle
- Particle background animation
- Smooth scroll animations
- Responsive grid layouts
- SEO meta tags

✅ **Backend Integration**
- EmailJS for real email sending
- Google Analytics tracking
- GitHub API repository display

---

## 5. Deployment

The portfolio is ready to deploy to GitHub Pages:

```bash
# Push to GitHub
git add .
git commit -m "Update configuration credentials"
git push origin main

# Portfolio will be live at:
# https://yourusername.github.io/portfolio/
```

---

## 6. Customization

### Update Personal Information:
- **Name & Title**: Edit HTML header and hero section
- **About Section**: Update your bio and achievements
- **Experience**: Add your work history
- **Projects**: Add your portfolio projects
- **Skills**: Update your skill categories
- **Contact Email**: Update throughout the HTML

### Color Scheme:
- Edit CSS variables in `styles.css`
- Root variables in `:root` and `body.light`
- Colors include: `--accent`, `--accent-2`, `--bg`, `--surface`, etc.

### Add More Content:
- Services section already has 7 items (edit/add more)
- Blog section has 6 articles (add/remove posts)
- FAQ has 6 questions (add/remove items)
- Certificates has 6 items (add/remove credentials)

---

## 7. Troubleshooting

**Contact form not sending emails?**
- Check EmailJS credentials in script.js
- Verify email service is activated in EmailJS dashboard
- Check browser console for errors

**GitHub repositories not showing?**
- Verify username is correct
- Ensure repositories are public
- Check browser console for API errors

**Analytics not tracking?**
- Verify Google Analytics Measurement ID is correct
- Wait 24-48 hours for data to appear in Analytics dashboard
- Check that tracking is enabled for your website

**Newsletter form not working?**
- Check browser console for JavaScript errors
- Ensure form has email input field
- Verify form has submit button

---

## 8. Support & Resources

- **EmailJS Docs**: https://www.emailjs.com/docs/
- **Google Analytics Docs**: https://support.google.com/analytics/
- **GitHub API Docs**: https://docs.github.com/en/rest/
- **Portfolio Project**: Review `README.md` for project overview

---

**Last Updated**: March 28, 2026
**Portfolio Version**: 2.5 (All 20+ Features)
