"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "duplex-tracker:dashboard-overview-hidden";
// localStorage's own "storage" event only fires in *other* tabs -- this
// custom event lets a same-tab write notify this component's subscription
// too, so toggling updates immediately instead of only on next reload.
const LOCAL_EVENT = "duplex-tracker:dashboard-overview-hidden-changed";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LOCAL_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LOCAL_EVENT, callback);
  };
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) === "1";
}

// SSR has no localStorage -- always render the overview visible there, same
// as this hook's first client read before it can sync to the real value.
function getServerSnapshot() {
  return false;
}

// Purely a per-device display preference (like the theme toggle), not data
// either person needs synced -- localStorage is enough, no DB round trip.
export function DashboardOverview({ children }: { children: React.ReactNode }) {
  const hidden = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    localStorage.setItem(STORAGE_KEY, hidden ? "0" : "1");
    window.dispatchEvent(new Event(LOCAL_EVENT));
  }

  return (
    <>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={toggle}
          className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase hover:text-primary"
        >
          {hidden ? "Show overview" : "Hide overview"}
        </button>
      </div>
      {!hidden && children}
    </>
  );
}
