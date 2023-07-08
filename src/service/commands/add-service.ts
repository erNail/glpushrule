import { CreateAndEditPushRuleOptions } from '@gitbeaker/rest';
import { fetchGroups, fetchProjects } from '../crawler-service';
import logger from '../../utils/logger';
import printSummary from '../summary-service';
import GroupPushRuleService from '../group-push-rule-service';
import ProjectPushRuleService from '../project-push-rule-service';

/**
 * Adds push rules to groups and projects matching a given regular expression.
 * @param matcher - The regular expression to use for matching the groups and projects.
 * @param pushRules - The push rules to add.
 * @returns A Promise resolving to void.
 */
async function addPushRules(matcher: RegExp, pushRules: CreateAndEditPushRuleOptions): Promise<void> {
  logger.info('Crawling groups and projects...');

  const groups = await fetchGroups(matcher);
  const projects = await fetchProjects(matcher);

  await GroupPushRuleService.addPushRules(groups, pushRules);
  await ProjectPushRuleService.addPushRules(projects, pushRules);

  printSummary(
    groups.length,
    projects.length,
    GroupPushRuleService.pushRuleCounter + ProjectPushRuleService.pushRuleCounter
  );
}

export default addPushRules;
