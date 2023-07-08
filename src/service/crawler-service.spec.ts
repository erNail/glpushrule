import 'dotenv/config';
import { fetchGroups, fetchProjects } from './crawler-service';
import logger from '../utils/logger';
import gitlabApi from '../utils/gitlab-api';

jest.mock('../utils/gitlab-api');
jest.mock('../utils/logger');

const mockAllGroups = gitlabApi.Groups.all as jest.Mock;
const mockAllProjects = gitlabApi.Projects.all as jest.Mock;
const mockLoggerInfo = logger.info as jest.Mock;

describe('fetchGroups', () => {
  it('should fetch all groups and return the matched groups', async () => {
    const matcher = /group-path-correct/;
    const groups = [{ full_path: 'group-path-correct/first/group' }, { full_path: 'group-path-wrong/second/group' }];
    mockAllGroups.mockResolvedValue(groups);

    const result = await fetchGroups(matcher);

    expect(mockAllGroups).toHaveBeenCalledTimes(1);
    expect(mockLoggerInfo).toHaveBeenCalledTimes(1);
    expect(mockLoggerInfo).toHaveBeenCalledWith('Matched Groups: %o', ['group-path-correct/first/group']);
    expect(result).toEqual([{ full_path: 'group-path-correct/first/group' }]);
  });
});

describe('fetchProjects', () => {
  it('should fetch all projects and return the matched projects', async () => {
    const matcher = /project-path-correct/;
    const projects = [
      { path_with_namespace: 'project-path-correct/first/group' },
      { path_with_namespace: 'project-path-wrong/second/group' },
    ];
    mockAllProjects.mockResolvedValue(projects);

    const result = await fetchProjects(matcher);

    expect(mockAllProjects).toHaveBeenCalledTimes(1);
    expect(mockAllProjects).toHaveBeenCalledWith({ membership: true });
    expect(mockLoggerInfo).toHaveBeenCalledTimes(1);
    expect(mockLoggerInfo).toHaveBeenCalledWith('Matched Projects: %o', ['project-path-correct/first/group']);
    expect(result).toEqual([{ path_with_namespace: 'project-path-correct/first/group' }]);
  });
});
