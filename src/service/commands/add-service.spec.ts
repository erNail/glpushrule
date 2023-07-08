import 'dotenv/config';
import { CreateAndEditPushRuleOptions, GroupSchema, GroupStatisticsSchema, ProjectSchema } from '@gitbeaker/rest';
import { fetchGroups, fetchProjects } from '../crawler-service';
import logger from '../../utils/logger';
import printSummary from '../summary-service';
import GroupPushRuleService from '../group-push-rule-service';
import ProjectPushRuleService from '../project-push-rule-service';
import addPushRules from './add-service';

jest.mock('../crawler-service');
jest.mock('../../utils/logger');
jest.mock('../summary-service');
jest.mock('../group-push-rule-service');
jest.mock('../project-push-rule-service');

describe('addPushRules', () => {
  const mockFetchGroups = fetchGroups as jest.MockedFunction<typeof fetchGroups>;
  const mockFetchProjects = fetchProjects as jest.MockedFunction<typeof fetchProjects>;
  const mockLogger = logger as jest.Mocked<typeof logger>;
  const mockPrintSummary = printSummary as jest.MockedFunction<typeof printSummary>;

  const testMatcher = /test/;
  const testPushRules: CreateAndEditPushRuleOptions = { commitMessageRegex: 'test' };
  const testGroups = [{ id: 1, full_path: 'test/test' } as GroupSchema & { statistics: GroupStatisticsSchema }];
  const testProjects = [{ id: 2, path: 'test-project' } as ProjectSchema];

  it('should log, fetch groups and projects, add push rules, and print summary', async () => {
    mockFetchGroups.mockResolvedValue(testGroups);
    mockFetchProjects.mockResolvedValue(testProjects);
    await addPushRules(testMatcher, testPushRules);

    expect(mockLogger.info).toHaveBeenCalledWith('Crawling groups and projects...');
    expect(mockFetchGroups).toHaveBeenCalledWith(testMatcher);
    expect(mockFetchProjects).toHaveBeenCalledWith(testMatcher);

    expect(GroupPushRuleService.addPushRules).toHaveBeenCalledWith(testGroups, testPushRules);
    expect(ProjectPushRuleService.addPushRules).toHaveBeenCalledWith(testProjects, testPushRules);
    expect(mockPrintSummary).toHaveBeenCalledTimes(1);

    expect(GroupPushRuleService.pushRuleCounter + ProjectPushRuleService.pushRuleCounter).toBeDefined();
  });
});
