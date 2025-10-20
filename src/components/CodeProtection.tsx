'use client';

import { useEffect } from 'react';

export function CodeProtection() {
  useEffect(() => {
    // Only run protection in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Bypass protection if debug mode enabled
    // Usage: Add ?debug=true to URL
    const urlParams = new URLSearchParams(window.location.search);
    const isDebugMode = urlParams.get('debug') === 'true';
    
    if (isDebugMode) {
      console.log('🔓 Debug mode enabled - Code protection disabled');
      return;
    }

    // 1. Disable right-click
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Disable F12, Ctrl+Shift+I, Ctrl+U (view source)
    const disableDevTools = (e: KeyboardEvent) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I (Inspect)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
      
      // Cmd+Option+I (Mac)
      if (e.metaKey && e.altKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }
    };

    // 3. Detect DevTools opening
    const detectDevTools = () => {
      const threshold = 160; // DevTools width threshold
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        // DevTools detected - you can redirect or show warning
        // For now, just reload to clear console
        // window.location.reload();
      }
    };

    // 4. Disable text selection (optional, bisa ganggu UX)
    const disableSelection = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // 5. Clear console periodically
    const clearConsoleInterval = setInterval(() => {
      console.clear();
    }, 2000);

    // 6. Disable copy-paste (optional)
    const disableCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableDevTools);
    // document.addEventListener('selectstart', disableSelection); // Uncomment to disable text selection
    // document.addEventListener('copy', disableCopy); // Uncomment to disable copy
    
    // Check for DevTools periodically
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Add debugger trap (will pause if DevTools open)
    const debuggerTrap = () => {
      const start = Date.now();
      // @ts-ignore
      debugger;
      const end = Date.now();
      
      // If more than 100ms passed, DevTools is likely open
      if (end - start > 100) {
        // Optional: redirect or show warning
        // window.location.href = '/';
      }
    };
    
    // Run debugger trap every 5 seconds
    const debuggerInterval = setInterval(debuggerTrap, 5000);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableDevTools);
      // document.removeEventListener('selectstart', disableSelection);
      // document.removeEventListener('copy', disableCopy);
      clearInterval(clearConsoleInterval);
      clearInterval(devToolsInterval);
      clearInterval(debuggerInterval);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
