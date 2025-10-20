# Image Animation Guide

## Overview

Project ini sudah memiliki **Framer Motion** dan **Tailwind CSS** dengan plugin **tailwindcss-animate**. Berikut adalah berbagai opsi animasi untuk image profil circular Anda.

---

## 🎨 Animation Options Available

### 1. **Framer Motion Animations** (Recommended)
Library yang sudah terinstall: `framer-motion: ^12.23.12`

### 2. **Tailwind CSS Animations**
Plugin yang sudah terinstall: `tailwindcss-animate: ^1.0.7`

### 3. **Pure CSS3 Animations**
Custom animations dengan CSS

---

## 📦 Framer Motion Examples

### Basic Fade In
```tsx
import { motion } from 'framer-motion';

<motion.img
  src="your-image-url"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
  className="rounded-full w-[148px] h-[148px]"
/>
```

### Zoom In on Load
```tsx
<motion.img
  src="your-image-url"
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ 
    type: "spring",
    stiffness: 260,
    damping: 20
  }}
  className="rounded-full w-[148px] h-[148px]"
/>
```

### Rotate + Fade In
```tsx
<motion.img
  src="your-image-url"
  initial={{ opacity: 0, rotate: -180 }}
  animate={{ opacity: 1, rotate: 0 }}
  transition={{ duration: 0.8 }}
  className="rounded-full w-[148px] h-[148px]"
/>
```

### Slide from Left
```tsx
<motion.img
  src="your-image-url"
  initial={{ x: -100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.6 }}
  className="rounded-full w-[148px] h-[148px]"
/>
```

### Slide from Right
```tsx
<motion.img
  src="your-image-url"
  initial={{ x: 100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.6 }}
  className="rounded-full w-[148px] h-[148px]"
/>
```

### Pop Effect (Scale Bounce)
```tsx
<motion.img
  src="your-image-url"
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{
    type: "spring",
    stiffness: 500,
    damping: 15
  }}
  className="rounded-full w-[148px] h-[148px]"
/>
```

### Hover Effects
```tsx
<motion.img
  src="your-image-url"
  whileHover={{ 
    scale: 1.1,
    rotate: 5,
    transition: { duration: 0.3 }
  }}
  whileTap={{ scale: 0.9 }}
  className="rounded-full w-[148px] h-[148px] cursor-pointer"
/>
```

### Continuous Rotation
```tsx
<motion.img
  src="your-image-url"
  animate={{ rotate: 360 }}
  transition={{
    duration: 3,
    repeat: Infinity,
    ease: "linear"
  }}
  className="rounded-full w-[148px] h-[148px]"
/>
```

### Float Animation
```tsx
<motion.img
  src="your-image-url"
  animate={{ 
    y: [0, -10, 0]
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  className="rounded-full w-[148px] h-[148px]"
/>
```

### Pulse Effect
```tsx
<motion.img
  src="your-image-url"
  animate={{ 
    scale: [1, 1.05, 1]
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  className="rounded-full w-[148px] h-[148px]"
/>
```

### Glow on Hover
```tsx
<motion.img
  src="your-image-url"
  whileHover={{
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)"
  }}
  transition={{ duration: 0.3 }}
  className="rounded-full w-[148px] h-[148px]"
/>
```

---

## 🎯 Tailwind CSS Animations

### Fade In (Simple)
```html
<img 
  src="your-image-url" 
  class="animate-in fade-in duration-1000 rounded-full w-[148px] h-[148px]"
/>
```

### Slide In from Bottom
```html
<img 
  src="your-image-url" 
  class="animate-in slide-in-from-bottom-4 duration-700 rounded-full w-[148px] h-[148px]"
/>
```

### Slide In from Top
```html
<img 
  src="your-image-url" 
  class="animate-in slide-in-from-top-4 duration-700 rounded-full w-[148px] h-[148px]"
/>
```

### Zoom In
```html
<img 
  src="your-image-url" 
  class="animate-in zoom-in duration-500 rounded-full w-[148px] h-[148px]"
/>
```

### Spin
```html
<img 
  src="your-image-url" 
  class="animate-spin rounded-full w-[148px] h-[148px]"
/>
```

### Pulse
```html
<img 
  src="your-image-url" 
  class="animate-pulse rounded-full w-[148px] h-[148px]"
/>
```

### Bounce
```html
<img 
  src="your-image-url" 
  class="animate-bounce rounded-full w-[148px] h-[148px]"
/>
```

### Ping
```html
<img 
  src="your-image-url" 
  class="animate-ping rounded-full w-[148px] h-[148px]"
/>
```

### Hover Scale
```html
<img 
  src="your-image-url" 
  class="transition-transform duration-300 hover:scale-110 rounded-full w-[148px] h-[148px]"
/>
```

### Hover Rotate
```html
<img 
  src="your-image-url" 
  class="transition-transform duration-300 hover:rotate-6 rounded-full w-[148px] h-[148px]"
/>
```

---

## 🔥 Pure CSS3 Custom Animations

### Custom Keyframe Animation

```css
@keyframes avatarEntrance {
  0% {
    opacity: 0;
    transform: scale(0.5) rotate(-180deg);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1) rotate(90deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.avatar-entrance {
  animation: avatarEntrance 1s ease-out;
}
```

### Shimmer Effect
```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.avatar-shimmer {
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

### 3D Flip
```css
@keyframes flip3d {
  0% {
    transform: perspective(400px) rotateY(0);
  }
  100% {
    transform: perspective(400px) rotateY(360deg);
  }
}

.avatar-flip {
  animation: flip3d 1.5s ease-in-out;
}
```

---

## 💡 Recommended for Email Signature Image

### Option 1: Subtle Fade + Scale (Professional)
```tsx
<motion.img
  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/Group-1773-1759278642509.png"
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
  className="rounded-full w-[148px] h-[148px]"
  alt="Profile"
/>
```

### Option 2: Gentle Hover Effect
```tsx
<motion.img
  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/Group-1773-1759278642509.png"
  whileHover={{ 
    scale: 1.05,
    transition: { duration: 0.2 }
  }}
  className="rounded-full w-[148px] h-[148px]"
  alt="Profile"
/>
```

### Option 3: Slide In from Left
```tsx
<motion.img
  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/Group-1773-1759278642509.png"
  initial={{ x: -50, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  className="rounded-full w-[148px] h-[148px]"
  alt="Profile"
/>
```

### Option 4: Pop with Spring
```tsx
<motion.img
  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/Group-1773-1759278642509.png"
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{
    type: "spring",
    stiffness: 300,
    damping: 20
  }}
  className="rounded-full w-[148px] h-[148px]"
  alt="Profile"
/>
```

---

## 📚 Documentation Links

### Framer Motion
- **Main Docs**: https://motion.dev/docs/react-animation
- **Gestures (Hover, Tap)**: https://motion.dev/docs/react-gestures
- **Examples**: https://motion.dev/examples

### Tailwind CSS Animations
- **Tailwind Animate Plugin**: https://github.com/jamiebuilds/tailwindcss-animate
- **TW Elements Animations**: https://tw-elements.com/docs/standard/content-styles/animations/

### CSS Tricks
- **Avatar Hover Effects**: https://css-tricks.com/a-fancy-hover-effect-for-your-avatar/
- **CSS Image Effects**: https://freefrontend.com/css-image-effects/

---

## 🛠️ How to Implement in EmailSignatureGenerator

### Find the Image Component
Location: `src/components/EmailSignatureGenerator.tsx`

Look for the image rendering section around line 130 or where `userImageUrl` is used.

### Replace with Animated Version

**Before:**
```tsx
<img 
  src={userImageUrl} 
  className="rounded-full w-[148px] h-[148px]"
/>
```

**After (with Framer Motion):**
```tsx
import { motion } from 'framer-motion';

<motion.img 
  src={userImageUrl}
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
  whileHover={{ scale: 1.05 }}
  className="rounded-full w-[148px] h-[148px]"
/>
```

---

## ⚡ Performance Tips

1. **Use `will-change` for smooth animations:**
   ```css
   .animated-image {
     will-change: transform, opacity;
   }
   ```

2. **Prefer transform over position:**
   - ✅ `transform: translateX(10px)`
   - ❌ `left: 10px`

3. **Limit simultaneous animations:**
   - Don't animate too many properties at once
   - Stick to opacity, transform, and scale

4. **Use hardware acceleration:**
   ```css
   transform: translateZ(0);
   ```

---

## 🎭 Choosing the Right Animation

### For Professional/Corporate:
- Subtle fade-in
- Gentle scale
- Minimal movement

### For Creative/Modern:
- Pop effects
- Slide animations
- Hover interactions

### For Fun/Casual:
- Bounce
- Spin
- Pulse effects

---

## Next Steps

1. Choose animation yang sesuai dengan brand
2. Test di berbagai browser
3. Pastikan tidak mengganggu readability
4. Check performance dengan DevTools
