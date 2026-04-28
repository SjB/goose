import { useEffect } from "react";

interface UseGlobalAppShortcutsArgs {
  onCloseActiveSession: () => void;
  onNewConversation: () => void;
  onOpenSearch: () => void;
  onToggleSettings: () => void;
  onToggleSidebar: () => void;
}

export function useGlobalAppShortcuts({
  onCloseActiveSession,
  onNewConversation,
  onOpenSearch,
  onToggleSettings,
  onToggleSidebar,
}: UseGlobalAppShortcutsArgs) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "," && e.metaKey) {
        e.preventDefault();
        onToggleSettings();
      }
      if (e.key === "b" && e.metaKey) {
        e.preventDefault();
        onToggleSidebar();
      }
      if (e.key === "k" && e.metaKey) {
        e.preventDefault();
        onOpenSearch();
      }
      if (e.key === "w" && e.metaKey) {
        e.preventDefault();
        onCloseActiveSession();
      }
      if (e.key === "n" && e.metaKey) {
        e.preventDefault();
        onNewConversation();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    onCloseActiveSession,
    onNewConversation,
    onOpenSearch,
    onToggleSettings,
    onToggleSidebar,
  ]);
}
