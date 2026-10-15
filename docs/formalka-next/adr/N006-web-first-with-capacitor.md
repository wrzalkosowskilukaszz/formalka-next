# ADR-N006: Platform: one React web app, wrapped with Capacitor

- **Status:** Proposed (amends ADR-0010 for the case app only)
- **Date:** 2026-10-15
- **Deciders:** Łukasz (owner), Claude

## Context
The case needs two things a plain PWA can't give reliably, verified 2026-10-15:
- **reminders without a server:** Notification Triggers have not launched;
- **durable storage on iOS:** Safari removes script-writable storage after 7 days without interaction, though Home Screen apps are exempt.

React Native would double the UI work for one developer and weaken desktop, where people read and print.

## Decision
- The case app is a bundled static React + TypeScript app shell with the shared packages (rules, i18n, tokens). It runs:
  - on the web: desktop, and Android or iOS browsers;
  - in Capacitor shells: Android first (Play internal testing), iOS later (TestFlight).
- The shells provide local notifications, native storage, file share and optional biometric lock.
- The guide site stays as it is (ADR-0010 remote-URL plan unchanged).

## Consequences
- One UI codebase; native config and store builds add work (13 §2 items 7, 14).
- iOS web users in the alpha depend on export/backup.
- App-store listings must state independence (ADR-0010; rule 10).

## Alternatives considered
- **PWA only:** no server-free reminders, and fragile iOS storage.
- **React Native + Expo:** native quality, but a second UI stack and weak desktop.

## Revisit when
Web platforms ship scheduled notifications, or the native shell's maintenance outweighs its use.
