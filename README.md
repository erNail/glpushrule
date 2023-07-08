# glpushrule

CLI for managing Gitlab push rules across groups and repositories. Apply sweeping changes with one command.

**Features:**

- Show push rules across groups and repositories
- Add push rules to groups and repositories without existing push rules
- Edit push rules for groups and repositories with existing push rules

**Planned features:**

- Delete push rules across groups and repositories

## Usage

### Install `glpushrule`

```shell
# With npm
npm i -g glpushrule

# With yarn
yarn global add glpushrule
```

### Create a new Gitlab Access Token

`glpushrule` needs read/write access to the API so it can show and edit push rules.
In your Gitlab instance, create a new access token with the `api` scope.

### Set the required environment variables

`glpushrule` requires the Environment variables `GITLAB_HOST` and `GITLAB_TOKEN` to be set.
You can set them via a `.env` file, or in your shell.

To use a `.env` file, create a new file named `.env` in the directory you are executing `glpushrule`

```shell
# .env
GITLAB_HOST="https://gitlab.com/"
GITLAB_TOKEN="<YOUR_SECRET_TOKEN>"
```

Alternatively, you can set them in the shell as follows:

```shell
# Export them in the environment
export GITLAB_HOST="https://gitlab.com/"
export GITLAB_TOKEN="<YOUR_SECRET_TOKEN>"

# Or set them during execution
GITLAB_HOST="https://gitlab.com/" GITLAB_TOKEN="<YOUR_SECRET_TOKEN>" glpushrule --help
```

### Execute `glpushrule`

Show existing push rules (Recommended to test if the correct groups and projects are matched):

```shell
glpushrule show --matcher "/regex/to/match/your/groups/and/projects/paths"
```

Add push rules to groups and projects without push rules:

```shell
glpushrule add --matcher "/regex/to/match/your/groups/and/projects/paths" --rule '{"commitMessageRegex": "^ci: .*"}'
```

Edit push rules for groups and projects with existing push rules:

```shell
glpushrule edit --matcher "/regex/to/match/your/groups/and/projects/paths" --rule '{"commitMessageRegex": "^ci: .*"}'
```

You can also set the `--matcher` and `--rule` flag as Environment variables:

```shell
# .env
GITLAB_HOST="https://gitlab.com/"
GITLAB_TOKEN="<YOUR_SECRET_TOKEN>"
MATCHER="/regex/to/match/your/groups/and/projects/paths"
PUSH_RULE='{
"commitMessageRegex": "^ci: .*"
}'
```

### Available Push Rules

In the example above, the commit message regex is used as an example for adding and editing rules.
The other available push rules can be found in the [gitbeaker](https://github.com/jdalrymple/gitbeaker) project,
in the [`CreateAndEditPushRuleOptions`][1] interface:

[1]: https://github.com/orchestracities/ngsi-timeseries-api/blob/master/docs/manuals/admin/configuration.md#environment-variables

```ts
export interface CreateAndEditPushRuleOptions {
  denyDeleteTag?: boolean;
  memberCheck?: boolean;
  preventSecrets?: boolean;
  commitMessageRegex?: string;
  commitMessagNegativeRegex?: string;
  branchNameRegex?: string;
  authorEmailRegex?: string;
  fileNameRegex?: string;
  maxFileSize?: number;
  commitCommitterCheck?: boolean;
  rejectUnsignedCommits?: boolean;
}
```

### Command documentation

#### `glpushrule` command

```text
# glpushrule --help
Usage: glpushrule [options] [command]

CLI for managing Gitlab push rules across multiple groups and repositories

Options:
  -V, --version                 output the version number
  -m, --matcher <matcherRegEx>  the regex to use for filtering groups and repositories (env: MATCHER)
  -h, --help                    display help for command

Commands:
  edit [options]                edit already existing push rules
  show                          show push rules
  add [options]                 add push rules if non exist
  help [command]                display help for command
```

#### `glpushrule add` command

```text
# glpushrule add --help
Usage: glpushrule add [options]

add push rules if non exist

Options:
  -r, --rule <pushRuleJson>     the push rules as JSON. Example: '{"commitMessageRegex": "^ci: .*"}' (env: PUSH_RULE)
  -h, --help                    display help for command

Global Options:
  -V, --version                 output the version number
  -m, --matcher <matcherRegEx>  the regex to use for filtering groups and repositories (env: MATCHER)
```

#### `glpushrule edit` command

```text
# glpushrule edit --help
Usage: glpushrule edit [options]

edit already existing push rules

Options:
  -r, --rule <pushRulesJson>    the push rules as JSON. Example: '{"commitMessageRegex": "^ci: .*"}' (env: PUSH_RULE)
  -h, --help                    display help for command

Global Options:
  -V, --version                 output the version number
  -m, --matcher <matcherRegEx>  the regex to use for filtering groups and repositories (env: MATCHER)
```

#### Environment Variables

The application uses the following environment variables:

| Environment Variable | Description                                            | Required            |
|----------------------|--------------------------------------------------------|---------------------|
| `GITLAB_HOST`        | The Gitlab instance in which to manage push rules      | Yes                 |
| `GITLAB_TOKEN`       | The Gitlab Access Token with the `api` permission      | Yes                 |
| `MATCHER`            | The regex to use for filtering groups and repositories | No, if set via flag |
| `PUSH_RULE`          | The push rules as JSON                                 | No, if set via flag |

## Development

### Running

```shell
yarn install

# Run with node
yarn run start

# Run with ts-node
yarn run start:dev
```

### Linting

```shell
# Run ESLint without auto fixing
yarn run lint

# Run ESLint with auto fixing
yarn run lint:fix
yarn run lint --fix

# Run pre-commit
pip install -r requirements.txt
yarn run pre-commit
```

### Testing

```shell
yarn run jest
```

## Contributing

Please check out the [CONTRIBUTING.md](./CONTRIBUTING.md)
