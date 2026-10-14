import { getCollection, type CollectionEntry } from 'astro:content';
import { SECTIONS } from '../content.config';

export type Story = CollectionEntry<'stories'>;
export { SECTIONS };

export async function stories(): Promise<Story[]> {
  const all = await getCollection('stories', s => import.meta.env.DEV || !s.data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function guides() {
  const all = await getCollection('guides', g => import.meta.env.DEV || !g.data.draft);
  return all.sort((a, b) => a.data.order - b.data.order || a.data.level - b.data.level);
}

export const readMins = (s: Story) => Math.max(1, Math.round((s.body ?? '').split(/\s+/).length / 220));
export const url = (s: Story) => `/stories/${s.id}/`;
export const fmtDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
