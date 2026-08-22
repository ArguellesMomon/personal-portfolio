import { useCallback, useState } from 'react';

// Fails silently (returns false) rather than throwing — the Clipboard API
// can be unavailable (insecure context, permissions), and copy-to-clipboard
// here is a convenience on top of the primary mailto link, not the only
// way to get the email address, so a failure shouldn't be loud.
export default function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
        return true;
      } catch {
        return false;
      }
    },
    [resetDelay]
  );

  return { copied, copy };
}
