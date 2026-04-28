import { useCallback, useEffect, useState } from "react";
import { OPEN_SETTINGS_EVENT } from "@/features/settings/lib/settingsEvents";
import type { SectionId } from "@/features/settings/ui/SettingsModal";

const SETTINGS_SECTIONS = new Set<SectionId>([
  "appearance",
  "providers",
  "compaction",
  "extensions",
  "voice",
  "general",
  "projects",
  "chats",
  "doctor",
  "about",
]);

export function useSettingsModal() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsInitialSection, setSettingsInitialSection] =
    useState<SectionId>("appearance");

  const openSettings = useCallback((section: SectionId = "appearance") => {
    setSettingsInitialSection(section);
    setSettingsOpen(true);
  }, []);

  useEffect(() => {
    const handleOpenSettingsEvent = (event: Event) => {
      const section = (event as CustomEvent<{ section?: string }>).detail
        ?.section;
      if (section && SETTINGS_SECTIONS.has(section as SectionId)) {
        openSettings(section as SectionId);
        return;
      }

      openSettings();
    };

    window.addEventListener(
      OPEN_SETTINGS_EVENT,
      handleOpenSettingsEvent as EventListener,
    );
    return () => {
      window.removeEventListener(
        OPEN_SETTINGS_EVENT,
        handleOpenSettingsEvent as EventListener,
      );
    };
  }, [openSettings]);

  return {
    openSettings,
    settingsInitialSection,
    settingsOpen,
    setSettingsOpen,
  };
}
