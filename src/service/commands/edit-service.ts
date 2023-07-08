import { CreateAndEditPushRuleOptions } from '@gitbeaker/rest';
import { fetchGroups, fetchProjects } from '../crawler-service';
import logger from '../../utils/logger';
import printSummary from '../summary-service';
import GroupPushRuleService from '../group-push-rule-service';
import ProjectPushRuleService from '../project-push-rule-service';

/**
 * Edits the push rules for groups and projects matching a given regular expression.
 * @param matcher - The regular expression to use for matching the groups and projects.
 * @param pushRules - The push rules to edit.
 * @returns A Promise resolving to void.
 */
async function editPushRules(matcher: RegExp, pushRules: CreateAndEditPushRuleOptions): Promise<void> {
  logger.info('Crawling groups and projects...');

  const groups = await fetchGroups(matcher);
  const projects = await fetchProjects(matcher);

  await GroupPushRuleService.editPushRules(groups, pushRules);
  await ProjectPushRuleService.editPushRules(projects, pushRules);

  printSummary(
    groups.length,
    projects.length,
    GroupPushRuleService.pushRuleCounter + ProjectPushRuleService.pushRuleCounter
  );
}

export default editPushRules;
