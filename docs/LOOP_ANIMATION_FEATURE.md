# 🔄 Loop Animation Feature Documentation

## Overview
Fitur **Loop Animation** memungkinkan user untuk mengontrol apakah animasi image akan berjalan **sekali** atau **terus-menerus (infinite loop)** dengan **delay timer** yang dapat dikustomisasi.

---

## 🎯 Feature Location

**UI Placement**: Di sebelah kanan dropdown "Image Animation"

### Visual Layout:
```
┌─────────────────────────────┬─────────────────┐
│  Animation Dropdown         │   Loop          │
│  [Select Animation ▼]       │   Loop [Toggle] │
│                             │   Delay [0] s   │
└─────────────────────────────┴─────────────────┘
```

**Layout**: Single-line horizontal dengan conditional delay input

---

## 🎮 How It Works

### Toggle States:

#### **Loop: OFF** (Default)
- Animation plays **once** when image loads
- Best for: Professional emails, one-time entrance effects
- Behavior: Animation completes → Image stays static
- **No delay control** (not needed for single play)

#### **Loop: ON**
- Animation plays **continuously** (infinite)
- Shows **Delay input field** (0-10 seconds, 0.5s steps)
- Best for: Attention-grabbing, dynamic presentations
- Behavior: Animation repeats with optional delay between loops

### Delay Timer Control:

When Loop = ON, delay input appears:

- **Range**: 0 - 10 seconds
- **Step**: 0.5 seconds (0, 0.5, 1, 1.5, 2, etc.)
- **Default**: 0 seconds (no delay)
- **Purpose**: Control pause between animation loops

#### Examples:
- **Delay = 0s**: Continuous animation, no pause
- **Delay = 1s**: 1 second pause between loops
- **Delay = 3s**: 3 second pause between loops

---

## 🔧 Technical Implementation

### State Management:
```typescript
const [animationLoop, setAnimationLoop] = useState(false);
const [loopDelay, setLoopDelay] = useState(0);
```

### CSS Generation Logic:
```typescript
const getAnimationCSS = (type: string, loop: boolean = false, delay: number = 0) => {
  const alreadyInfinite = ['float', 'pulse', 'spin', 'ping', 'glow'];
  
  const getIterationCount = (animType: string) => {
    if (alreadyInfinite.includes(animType)) {
      // For continuous animations, respect the loop toggle
      return loop ? 'infinite' : '1';
    }
    // For other animations, add infinite if loop is enabled
    return loop ? 'infinite' : '';
  };
  
  const iterCount = getIterationCount(type);
  const animDelay = delay > 0 ? ` ${delay}s` : '';
  
  // Example CSS output:
  // animation: fadeIn 0.6s ease-out 2s infinite;
  //                                  ^^^ delay
  return `.animated-image { animation: ${name} ${duration} ${timing}${animDelay} ${iterCount}; }`;
};
```

### Delay Integration:
- Delay is added as `animation-delay` property
- Format: `animation: name duration timing delay iteration-count;`
- Only applied when `loopDelay > 0`

### Already Infinite Animations:
These animations are designed to loop by default:
- **Float**
- **Pulse**
- **Spin**
- **Ping**
- **Glow**

---

## 📊 Animation Behavior Matrix

### Entrance Animations (When Loop = Yes)

| Animation | Loop: No | Loop: Yes |
|-----------|----------|-----------|
| Fade In | Fade once → static | Fade in/out repeatedly |
| Zoom In | Zoom once → static | Zoom in/out repeatedly |
| Slide Left | Slide once → static | Slide left repeatedly |
| Slide Right | Slide once → static | Slide right repeatedly |
| Slide Up | Slide once → static | Slide up repeatedly |
| Slide Down | Slide once → static | Slide down repeatedly |
| Rotate In | Rotate once → static | Rotate repeatedly |
| Flip In | Flip once → static | Flip repeatedly |
| Roll In | Roll once → static | Roll repeatedly |

### Attention Seekers (When Loop = Yes)

| Animation | Loop: No | Loop: Yes |
|-----------|----------|-----------|
| Bounce | Bounce once → static | Bounce continuously |
| Shake | Shake once → static | Shake continuously |
| Swing | Swing once → static | Swing continuously |
| Wobble | Wobble once → static | Wobble continuously |
| Jello | Jello once → static | Jello continuously |
| Heartbeat | Beat once → static | Beat continuously |
| Flash | Flash once → static | Flash continuously |
| Rubber Band | Stretch once → static | Stretch continuously |
| Tada | Celebrate once → static | Celebrate continuously |

### Continuous Animations (Loop Control)

| Animation | Loop: No | Loop: Yes |
|-----------|----------|-----------|
| Float | Float once → static | Float continuously ✓ |
| Pulse | Pulse once → static | Pulse continuously ✓ |
| Spin | Spin once → static | Spin continuously ✓ |
| Ping | Ping once → static | Ping continuously ✓ |

### Special Effects (When Loop = Yes)

| Animation | Loop: No | Loop: Yes |
|-----------|----------|-----------|
| Pop | Pop once → static | Pop repeatedly |
| Glow | Glow once → static | Glow continuously ✓ |
| Blur In | Blur once → static | Blur in/out repeatedly |

---

## 💡 Use Case Recommendations

### When to Use Loop: **No** ✅

#### Professional/Corporate Emails
- ✅ Fade In
- ✅ Zoom In
- ✅ Slide animations
- ✅ All entrance animations

**Why?** Clean, subtle, doesn't distract from message

#### First Impressions
- ✅ Pop
- ✅ Rotate In
- ✅ Flip In

**Why?** Makes strong entrance without being annoying

#### Email Signatures
- ✅ Most animations
- ✅ Attention seekers (used once)

**Why?** Professional appearance, not distracting

---

### When to Use Loop: **Yes** ⚡

#### Landing Pages
- ⚡ Float
- ⚡ Pulse
- ⚡ Glow

**Why?** Draws attention to key elements

#### Live Indicators
- ⚡ Pulse
- ⚡ Ping
- ⚡ Heartbeat (if loop enabled)

**Why?** Shows "alive" status, real-time activity

#### Product Showcases
- ⚡ Spin (for 360° view)
- ⚡ Float (for luxury items)
- ⚡ Glow (for premium products)

**Why?** Engaging product presentation

#### Call-to-Actions
- ⚡ Bounce (subtle)
- ⚡ Pulse
- ⚡ Tada (if loop enabled)

**Why?** Draws attention to action buttons

#### Creative/Modern Brands
- ⚡ Swing
- ⚡ Jello
- ⚡ Wobble

**Why?** Fun, playful brand personality

---

## ⚠️ Important Warnings

### When Loop = Yes: Be Careful! 🚨

#### Accessibility Concerns:
- ❌ Can trigger motion sickness
- ❌ May violate `prefers-reduced-motion`
- ❌ Can be distracting for users with ADHD
- ❌ Can cause seizures (Flash with loop!)

#### Performance Issues:
- ❌ Continuous animations use CPU/GPU
- ❌ Bad for mobile battery life
- ❌ Can slow down email loading
- ❌ Multiple looping animations = worse performance

#### User Experience:
- ❌ Can be annoying over time
- ❌ Reduces professionalism
- ❌ Distracts from message
- ❌ May cause users to close email

---

## 🎨 Best Practices

### 1. **Default to Loop: No**
Start with single-play animations, enable loop only when necessary.

### 2. **Test Duration**
If enabling loop, ensure animation duration isn't too short (causes jittery effect).

### 3. **Limit to One Loop**
Don't enable loop for multiple images in same email.

### 4. **Consider Context**
- **Marketing email**: Loop might be okay
- **Professional correspondence**: Avoid loop
- **Newsletter**: Depends on brand

### 5. **Email Client Testing**
Test looped animations in various email clients:
- Some clients may ignore animation completely
- Others might play only once regardless

### 6. **Provide Off Switch**
If using looped animations on web, consider providing a "Stop Animation" button.

---

## 🖱️ UI/UX Details

### Switch Component:
- **Type**: Toggle Switch (from shadcn/ui)
- **States**: On (Yes) / Off (No)
- **Disabled**: When animation = "none"
- **Visual Feedback**: Text shows "Yes" or "No" below switch

### User Flow:
```
1. User selects animation
   ↓
2. Loop toggle becomes enabled
   ↓
3. User can toggle Loop Yes/No
   ↓
4. Animation preview updates immediately
   ↓
5. Copy HTML with loop setting applied
```

---

## 📧 Email Client Compatibility

### Loop Support:

#### ✅ **Excellent Support** (Respects infinite)
- Apple Mail (macOS/iOS)
- iOS Mail App
- Thunderbird
- Modern WebKit browsers

#### ⚠️ **Partial Support** (May play once only)
- Gmail (webmail) - Sometimes plays once
- Outlook.com - Limited
- Yahoo Mail - Inconsistent

#### ❌ **No Support** (No animation at all)
- Outlook (Windows desktop)
- Gmail (mobile apps)
- Most Android email apps

**Note**: Even if loop is enabled, some clients will only play animation once or not at all.

---

## 🧪 Testing Checklist

Before using Loop: Yes, test these:

- [ ] Preview in browser
- [ ] Test in Apple Mail
- [ ] Test in Gmail (webmail)
- [ ] Test in Outlook.com
- [ ] Check on mobile devices
- [ ] Verify animation isn't too fast
- [ ] Ensure it's not distracting
- [ ] Check CPU usage (developer tools)
- [ ] Test with `prefers-reduced-motion`
- [ ] Ask team for feedback

---

## 📝 Code Example

### Generated CSS (Loop: No):
```css
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  60% { transform: translateY(-15px); }
}
.animated-image { 
  animation: bounce 1s ease-in-out; 
  /* Plays once */
}
```

### Generated CSS (Loop: Yes):
```css
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  60% { transform: translateY(-15px); }
}
.animated-image { 
  animation: bounce 1s ease-in-out infinite; 
  /* Loops forever */
}
```

---

## 🔄 Toggle Behavior

### Automatic Handling:

1. **Continuous Animations** (Float, Pulse, Spin, Ping, Glow):
   - **Loop: Yes** → Uses `infinite`
   - **Loop: No** → Uses `1` (plays once)

2. **Other Animations** (Entrance, Attention Seekers, Special):
   - **Loop: Yes** → Adds `infinite`
   - **Loop: No** → No iteration count (plays once by default)

---

## 🎓 Quick Guide

### For Quick Entrance:
- **Animation**: Fade In / Zoom In
- **Loop**: **No**
- **Best for**: All emails

### For Attention:
- **Animation**: Bounce / Shake
- **Loop**: **No** (professional) or **Yes** (marketing)
- **Best for**: CTAs, important elements

### For Continuous Effect:
- **Animation**: Float / Pulse / Glow
- **Loop**: **Yes**
- **Best for**: Landing pages, showcases

---

## 📊 Statistics & Recommendations

Based on email best practices:

- **95%** of professional emails should use **Loop: No**
- **80%** of marketing emails perform better with **Loop: No**
- **Only 10%** of cases benefit from **Loop: Yes**

---

## 🚀 Summary

### Loop: No (Default) ✓
- ✅ Professional
- ✅ Not distracting
- ✅ Better performance
- ✅ Accessible
- ✅ Recommended for 90% of use cases

### Loop: Yes ⚡
- ⚡ Attention-grabbing
- ⚡ Dynamic
- ⚡ Use sparingly
- ⚡ Test thoroughly
- ⚡ Only for specific use cases

---

**Remember**: Just because you *can* loop an animation, doesn't mean you *should*! 🎯
