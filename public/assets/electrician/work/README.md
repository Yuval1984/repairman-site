# Work Portfolio Images

Add your electrical work photos to this directory.

## Required Images

The carousel is currently configured to show 6 images. Add your work photos with the following filenames:

- `project-1.jpg`
- `project-2.jpg`
- `project-3.jpg`
- `project-4.jpg`
- `project-5.jpg`
- `project-6.jpg`

## Image Specifications

### Recommended:

- **Format**: JPG or PNG
- **Dimensions**: 1200x800px (3:2 aspect ratio) or similar landscape orientation
- **File size**: Keep under 500KB each for optimal loading
- **Quality**: High resolution but optimized for web

### Tips for Best Results:

1. **Good lighting** - Make sure the work is well-lit and clearly visible
2. **Clear focus** - Sharp images that showcase your work quality
3. **Professional angle** - Show the completed work from the best angle
4. **Clean composition** - Remove clutter from the background if possible
5. **Showcase variety** - Different types of electrical work

## Image Categories

Consider including photos of:

- ✅ Electrical panel installations
- ✅ Three-phase connection work
- ✅ Lighting installations (indoor/outdoor)
- ✅ Outlet and switch installations
- ✅ Water heater work
- ✅ Sabbath clock installations
- ✅ Circuit testing equipment
- ✅ Before/after comparisons

## Adding More Images

To add more than 6 images:

1. Add the new image files to this directory
2. Update the `workImages` array in `src/app/components/electrician-page/electrician-page.ts`
3. Add a new entry like:
   ```typescript
   {
     src: '/assets/electrician/work/project-7.jpg',
     alt: 'Description of work',
     caption: 'Project Title'
   }
   ```

## Image Optimization Tools

Before uploading, optimize your images using:

- **TinyPNG** - https://tinypng.com/
- **ImageOptim** - https://imageoptim.com/
- **Squoosh** - https://squoosh.app/

This will reduce file sizes while maintaining quality, resulting in faster page load times.

## Changing Captions

Edit the captions in `src/app/components/electrician-page/electrician-page.ts` in the `workImages` array to match your actual projects.

---

**Note**: The carousel will display a placeholder background color (#f5f1e8) until you add your images.
