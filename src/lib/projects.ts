import { getCollection, type CollectionEntry } from 'astro:content';
import { HIDDEN_PROJECTS } from '../data/site';
export type Project = CollectionEntry<'projects'>;
// Hidden projects keep their content file but are left out of every page (see HIDDEN_PROJECTS).
export const getProjects = async () => (await getCollection('projects'))
  .filter(p => !HIDDEN_PROJECTS.includes(p.id))
  .sort((a,b) => a.data.order-b.data.order);
