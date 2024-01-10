# expand-teams-app

GitHub App to request reviews from individual team members.

  

## Contributing

In the interest of making this repo as transparent as possible, and because I don't anticipate the code for this changing very frequently, building the TS and versioning the lambda are both manual changes. Here are some instructions on how to open a successful PR.

### Check for Lambda Updates
Before you open a PR, ask yourself both of these questions (both can be true).

1. *Does your PR modify any of the Typescript files?*

 - **Typescript**
 -- `index.ts`
 -- `tsconfig.json`

If so, run `npx tsc` from the root directory to generate the new compiled JS in the `dist` directory, and commit it as well (You may have to [install Typescript](https://www.typescriptlang.org/download) first.)

2. *Does your PR modify any of the following files?*
 - **Typescript**
 -- `index.ts`
 -- `tsconfig.json`
 - **Dependencies**
 -- `package.json`
 -- `package-lock.json`
 - **Docker**
 -- `Dockerfile`

If so, manually increment the `next-version` field in `Gitversion.yml`. If the PR would be a breaking change, increment the `Major` version number in `Major.Minor.Patch`. Otherwise, increment the `Minor` version number. Each PR should be associated with a single major or minor version change. If you anticipate you will need several versions to iterate through some tests, and need to temporarily push a new version in the same PR, increment the `Patch` version number.


