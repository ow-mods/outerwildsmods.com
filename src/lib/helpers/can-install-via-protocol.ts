import type { Mod } from './api/get-mod-list';
import { owmlUniqueName } from './constants';

// New manager doesn't support alpha yet, and OWML isn't actually a mod.
export const canInstallViaProtocol = (mod: Mod) => !mod.alpha && mod.uniqueName !== owmlUniqueName;
