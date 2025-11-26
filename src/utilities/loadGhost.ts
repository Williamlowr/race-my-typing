export interface GhostEntry {
  key: string;
  time: number;
}

export async function loadGhost(file: File): Promise<GhostEntry[]> {
  const text = await file.text();
  return JSON.parse(text);
}
