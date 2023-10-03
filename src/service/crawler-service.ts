import { GroupSchema, ProjectSchema } from '@gitbeaker/rest';
import logger from '../utils/logger';
import gitlabApi from '../utils/gitlab-api';

/**
 * Fetches all groups and subgroups and filters them based on the provided regular expression matcher.
 * @param matcher - The regular expression to filter the groups by their full path.
 * @returns The array of matched groups.
 */
export async function fetchGroups(matcher: RegExp): Promise<GroupSchema[]> {
  // Fetches all groups and subgroups
  const groups = await gitlabApi.Groups.all();
  const matchedGroups = groups.filter((group) => matcher.test(group.full_path));
  logger.info(
    'Matched Groups: %o',
    matchedGroups.map((group) => group.full_path)
  );
  return matchedGroups;
}

/**
 * Fetches all projects where the user is a member and filters them based on the provided regular expression matcher.
 * @param matcher - The regular expression to filter the projects by their path with namespace.
 * @returns The array of matched projects.
 */
export async function fetchProjects(matcher: RegExp): Promise<ProjectSchema[]> {
  const projects = await gitlabApi.Projects.all({ membership: true });
  const matchedProjects = projects.filter((project) => matcher.test(project.path_with_namespace));
  logger.info(
    'Matched Projects: %o',
    matchedProjects.map((project) => project.path_with_namespace)
  );
  return matchedProjects;
}
