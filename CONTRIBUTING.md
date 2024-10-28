# How to contribute

Thanks for considering contributing to Feed for Deno!

## Getting Started

If you're new to contributing to open-source projects, you can start by checking out the [GitHub documentation](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests) on how to contribute to a project.

### Installation

The project uses [Deno](https://deno.land/) as the runtime environment. You can install Deno by following the instructions on the [official website](https://deno.com/).

### Commit Messages and Pull Requests

Please follow the [conventional commit guidelines](https://www.conventionalcommits.org/en/v1.0.0/) when writing commit messages. This will help us to generate the changelog automatically.

When creating a pull request, please make sure to include a detailed description of the changes you made. This will help us to understand the changes and review the pull request faster.

## Running Tests

You can run the tests using the following command:

```bash
deno test
```

If you want to run the tests on just a specific generator (e.g., `RSS`), you can use the following command:

```bash
deno test --filter "RSS"
```

Every new pull request and commit will trigger the tests to run automatically using GitHub Actions. If the tests fail, the pull request will require a change to pass the tests.

> [!NOTE]
> Sometimes, the CI fails due to formatting issues. You can fix the formatting by running `deno fmt` and pushing the changes.
