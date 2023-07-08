import 'dotenv/config';
import { GroupSchema, GroupStatisticsSchema, ProjectSchema } from '@gitbeaker/rest';
import { fetchGroups, fetchProjects } from '../crawler-service';
import logger from '../../utils/logger';
import printSummary from '../summary-service';
import GroupPushRuleService from '../group-push-rule-service';
import ProjectPushRuleService from '../project-push-rule-service';
import showPushRules from './show-service';

jest.mock('../crawler-service');
jest.mock('../../utils/logger');
jest.mock('../summary-service');
jest.mock('../group-push-rule-service');
jest.mock('../project-push-rule-service');
jest.mock('../crawler-service');
jest.mock('../group-push-rule-service');

describe('showPushRules', () => {
  const mockFetchGroups = fetchGroups as jest.MockedFunction<typeof fetchGroups>;
  const mockFetchProjects = fetchProjects as jest.MockedFunction<typeof fetchProjects>;
  const mockLogger = logger as jest.Mocked<typeof logger>;
  const mockPrintSummary = printSummary as jest.MockedFunction<typeof printSummary>;
  const mockGroupPushRuleService = GroupPushRuleService as jest.Mocked<typeof GroupPushRuleService>;
  const mockProjectPushRuleService = ProjectPushRuleService as jest.Mocked<typeof ProjectPushRuleService>;

  const testMatcher = /test/;
  const testGroups = [{ id: 1, full_path: 'test/test' } as GroupSchema & { statistics: GroupStatisticsSchema }];
  const testProjects = [{ id: 2, path: 'test-project' } as ProjectSchema];

  it('should fetch groups and projects, fetch push rules, and print summary', async () => {
    mockFetchGroups.mockResolvedValue(testGroups);
    mockFetchProjects.mockResolvedValue(testProjects);
    mockGroupPushRuleService.pushRuleCounter = 5;
    mockProjectPushRuleService.pushRuleCounter = 10;
    await showPushRules(testMatcher);

    expect(mockFetchGroups).toHaveBeenCalledWith(testMatcher);
    expect(mockFetchProjects).toHaveBeenCalledWith(testMatcher);
    expect(mockGroupPushRuleService.fetchPushRules).toHaveBeenCalledWith(testGroups);
    expect(mockProjectPushRuleService.fetchPushRules).toHaveBeenCalledWith(testProjects);
    expect(mockPrintSummary).toHaveBeenCalledWith(
      testGroups.length,
      testProjects.length,
      mockGroupPushRuleService.pushRuleCounter + mockProjectPushRuleService.pushRuleCounter
    );
    expect(mockLogger.info).toHaveBeenCalledWith('Crawling groups and projects...');
  });
});
