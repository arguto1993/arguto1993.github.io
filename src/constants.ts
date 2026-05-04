import data from './data.json';
import { buildSectionVisibility } from './sectionRegistry.js';

export const SECTION_VISIBILITY = buildSectionVisibility(data);
