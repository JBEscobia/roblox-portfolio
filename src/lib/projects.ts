import { getCollection, type CollectionEntry } from 'astro:content';
export type Project = CollectionEntry<'projects'>;
export const getProjects = async () => (await getCollection('projects')).sort((a,b) => a.data.order-b.data.order);
