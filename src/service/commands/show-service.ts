import { fetchGroups, fetchProjects } from '../crawler-service';
import logger from '../../utils/logger';
import printSummary from '../summary-service';
import GroupPushRuleService from '../group-push-rule-service';
import ProjectPushRuleService from '../project-push-rule-service';

/**
 * Shows the push rules for groups and projects matching a given regular expression.
 * @param matcher - The regular expression to use for matching the groups and projects.
 * @returns A Promise resolving to void.
 */
async function showPushRules(matcher: RegExp): Promise<void> {
  logger.info('Crawling groups and projects...');

  const groups = await fetchGroups(matcher);
  const projects = await fetchProjects(matcher);

  await GroupPushRuleService.fetchPushRules(groups);
  await ProjectPushRuleService.fetchPushRules(projects);

  printSummary(
    groups.length,
    projects.length,
    GroupPushRuleService.pushRuleCounter + ProjectPushRuleService.pushRuleCounter
  );
}

export default showPushRules;
