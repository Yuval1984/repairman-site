# Work Portfolio Carousel - Implementation Guide

This document explains the work portfolio carousel feature added to the Repairman.co.il website.

## 📍 Location

The carousel is displayed on the **Electrician Services page** (`/electrician`) between the "My Services" section and the "Why Choose Joe Tecno?" testimonials section.

## ✨ Features

### 1. **Responsive Image Carousel**

- Smooth sliding transitions between images
- Touch-friendly for mobile devices
- Keyboard navigation support (Arrow keys)
- Circular navigation (loops from last to first)

### 2. **Navigation Controls**

- **Previous/Next Buttons**: Large, accessible circular buttons on each side
- **Dot Indicators**: Visual dots below carousel showing current position
- **Keyboard Support**: Arrow Left/Right keys for navigation
- **Touch Swipe**: (Ready to be enhanced with touch gestures)

### 3. **Image Display**

- **Aspect Ratio**: Optimized for landscape images (16:9 recommended)
- **Captions**: Each image has an overlay caption describing the work
- **Responsive Heights**:
  - Desktop: 500px
  - Tablet: 400px
  - Mobile: 300px

### 4. **Accessibility**

- ARIA labels on all buttons
- Keyboard navigation support
- Focus indicators for keyboard users
- Alt text for all images

## 🎨 Design Features

- **Rounded corners** (16px border-radius)
- **Shadow effects** for depth
- **Smooth animations** (0.5s transitions)
- **Yellow accent color** (#f4b000) matching the brand
- **Hover effects** on buttons and indicators
- **Gradient overlay** on image captions for readability

## 📁 File Structure

```
public/assets/electrician/work/
├── README.md              # Instructions for adding images
├── project-1.jpg          # Your work photos (to be added)
├── project-2.jpg
├── project-3.jpg
├── project-4.jpg
├── project-5.jpg
└── project-6.jpg
```

## 🔧 How to Add Your Work Photos

### Step 1: Prepare Your Images

1. **Select 6 best work photos** showing variety of electrical projects
2. **Optimize images**:
   - Resize to 1200x800px (or similar landscape ratio)
   - Compress to under 500KB per image
   - Use tools like TinyPNG, ImageOptim, or Squoosh
3. **Rename files** to:
   - `project-1.jpg`
   - `project-2.jpg`
   - `project-3.jpg`
   - `project-4.jpg`
   - `project-5.jpg`
   - `project-6.jpg`

### Step 2: Upload Images

Place your images in: `public/assets/electrician/work/`

### Step 3: Update Captions (Optional)

Edit `src/app/components/electrician-page/electrician-page.ts`:

```typescript
workImages = [
  {
    src: '/assets/electrician/work/project-1.jpg',
    alt: 'Electrical panel installation',
    caption: 'Professional Electrical Panel Installation',
  },
  // ... update captions to match your actual work
];
```

## 📱 User Experience

### Desktop

- Large images (500px height)
- Hover effects on navigation buttons
- Click indicators to jump to specific image
- Arrow keys for keyboard navigation

### Mobile

- Smaller images (300px height)
- Touch-friendly navigation buttons
- Swipe-ready (can be enhanced with gesture library)
- Responsive layout

## 🚀 Adding More Images

To display more than 6 images:

1. **Add images** to `public/assets/electrician/work/`
2. **Update the array** in `electrician-page.ts`:

```typescript
workImages = [
  // ... existing 6 images
  {
    src: '/assets/electrician/work/project-7.jpg',
    alt: 'Description',
    caption: 'Project Title',
  },
  {
    src: '/assets/electrician/work/project-8.jpg',
    alt: 'Description',
    caption: 'Project Title',
  },
];
```

The carousel automatically adjusts to any number of images!

## 🎯 Best Practices for Work Photos

### Good Photo Examples:

- ✅ Clean, well-lit electrical panels
- ✅ Completed installations from best angle
- ✅ Before/after comparisons
- ✅ Professional workmanship close-ups
- ✅ Variety of service types

### Avoid:

- ❌ Blurry or dark photos
- ❌ Cluttered backgrounds
- ❌ Work in progress (show completed work)
- ❌ Low resolution images
- ❌ Photos with personal information visible

## 🎨 Customization Options

### Change Carousel Height

Edit in `electrician-page.scss`:

```scss
.carousel__image {
  height: 500px; // Change this value
}
```

### Change Animation Speed

Edit in `electrician-page.scss`:

```scss
.carousel__track {
  transition: transform 0.5s ease-in-out; // Change 0.5s
}
```

### Change Colors

```scss
.carousel__btn {
  background: rgba(255, 255, 255, 0.95); // Button background

  &:hover {
    background: #f4b000; // Button hover color
  }
}

.carousel__indicator--active {
  background: #f4b000; // Active indicator color
}
```

## 🔍 SEO Benefits

The carousel includes:

- **Alt text** for each image (search engines can read)
- **Descriptive captions** with keywords
- **Semantic HTML** structure
- **Proper image optimization** for fast loading

This helps with:

- Image search results on Google
- Better page load times
- Improved user engagement
- Visual proof of work quality

## 🛠️ Technical Details

### Components Modified:

1. **electrician-page.html** - Added carousel markup
2. **electrician-page.ts** - Added carousel logic and navigation
3. **electrician-page.scss** - Added carousel styling

### Navigation Methods:

- `nextSlide()` - Move to next image
- `previousSlide()` - Move to previous image
- `goToSlide(index)` - Jump to specific image
- `onCarouselKeydown(event)` - Keyboard navigation handler

### State Management:

- `currentSlide` - Tracks which image is currently displayed (0-indexed)
- `workImages` - Array of image objects with src, alt, and caption

## 📊 Performance

The carousel is optimized for:

- **Fast loading** - Uses CSS transforms for smooth animations
- **Minimal JavaScript** - Pure Angular, no heavy libraries
- **Lazy loading ready** - Can be enhanced with lazy loading for images
- **Mobile optimized** - Responsive images and touch-friendly controls

## 🎓 Future Enhancements

Consider adding:

1. **Auto-play** - Automatic sliding every few seconds
2. **Touch gestures** - Swipe left/right on mobile
3. **Lightbox** - Click image to view full-screen
4. **Thumbnail strip** - Small previews below main image
5. **Lazy loading** - Load images as needed for better performance
6. **Image zoom** - Pinch to zoom on mobile

## 📞 Support

For customization help or questions:

- Review the code in `src/app/components/electrician-page/`
- Check the styling in `electrician-page.scss`
- Refer to this guide for instructions

---

**Last Updated**: October 23, 2025

The carousel is ready to showcase your electrical work! Just add your photos to `public/assets/electrician/work/` and they'll automatically appear on the website.
