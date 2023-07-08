import 'dotenv/config';
import { CreateAndEditPushRuleOptions, GroupSchema, GroupStatisticsSchema, ProjectSchema } from '@gitbeaker/rest';
import { fetchGroups, fetchProjects } from '../crawler-service';
import logger from '../../utils/logger';
import printSummary from '../summary-service';
import GroupPushRuleService from '../group-push-rule-service';
import ProjectPushRuleService from '../project-push-rule-service';
import editPushRules from './edit-service';

jest.mock('../crawler-service');
jest.mock('../../utils/logger');
jest.mock('../summary-service');
jest.mock('../group-push-rule-service');
jest.mock('../project-push-rule-service');

describe('editPushRules', () => {
  const mockFetchGroups = fetchGroups as jest.MockedFunction<typeof fetchGroups>;
  const mockFetchProjects = fetchProjects as jest.MockedFunction<typeof fetchProjects>;
  const mockLogger = logger as jest.Mocked<typeof logger>;
  const mockPrintSummary = printSummary as jest.MockedFunction<typeof printSummary>;
  const mockGroupPushRuleService = GroupPushRuleService as jest.Mocked<typeof GroupPushRuleService>;
  const mockProjectPushRuleService = ProjectPushRuleService as jest.Mocked<typeof ProjectPushRuleService>;

  const testMatcher = /test/;
  const testPushRules: CreateAndEditPushRuleOptions = { commitMessageRegex: 'test' };
  const testGroups = [{ id: 1, full_path: 'test/test' } as GroupSchema & { statistics: GroupStatisticsSchema }];
  const testProjects = [{ id: 2, path: 'test-project' } as ProjectSchema];

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch groups and projects, edit push rules, and print summary', async () => {
    mockFetchGroups.mockResolvedValue(testGroups);
    mockFetchProjects.mockResolvedValue(testProjects);
    mockGroupPushRuleService.pushRuleCounter = 5;
    mockProjectPushRuleService.pushRuleCounter = 10;
    await editPushRules(testMatcher, testPushRules);

    expect(mockFetchGroups).toHaveBeenCalledWith(testMatcher);
    expect(mockFetchProjects).toHaveBeenCalledWith(testMatcher);
    expect(mockGroupPushRuleService.editPushRules).toHaveBeenCalledWith(testGroups, testPushRules);
    expect(mockProjectPushRuleService.editPushRules).toHaveBeenCalledWith(testProjects, testPushRules);
    expect(mockPrintSummary).toHaveBeenCalledWith(
      testGroups.length,
      testProjects.length,
      mockGroupPushRuleService.pushRuleCounter + mockProjectPushRuleService.pushRuleCounter
    );
    expect(mockLogger.info).toHaveBeenCalledWith('Crawling groups and projects...');
  });
});
