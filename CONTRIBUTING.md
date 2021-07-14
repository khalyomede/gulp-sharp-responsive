# Contributing

Thank you for considering contributing to this library!

## Summary

- [Where to provide offer your help](#where-to-provide-offer-your-help)
- [Steps to propose changes](#steps-to-propose-changes)

## Where to provide offer your help

You can give you help for:

- Fixing english and typos in all the documents
- Fix issues on the code
- Propose improvements in the code

## Steps to propose changes

- [1. Choose an issue to resolve](#1-choose-an-issue-to-resolve)
- [2. Fork the project](#2-fork-the-project)
- [3. Create a branch](#3-create-a-branch)
- [4. Test your feature or fix](#4-test-your-feature-or-fix)
- [5. Commit your changes](#5-commit-your-changes)
- [6. Propose your change](#6-propose-your-change)

### 1. Choose an issue to resolve

Every pull request should be linked to an existing issue. If there is no issue yet for the problem you are solving, just create an issue before.

### 2. Fork the project

In Github, click the button "fork". This will create a copy of this project in your own Github namespace.

### 3. Create a branch

Creating a branch in your own forked project will help make this clearer and follow convention, or when you want to contribute multiple times for the project.

The branch names follow this convention:

```txt
<issue-id>-<hyphen-cased-issue-title>
```

For example, if you are solving issue 12 with title "remove unused imports", your branch will have the name "12-remove-unused-imports".

Create a new branch **from master**.

```
git checkout master && git checkout -b 12-remove-unused-imports
```

### 4. Test your feature or fix

Run this command to test everything still works.

```bash
npm run test
```

### 5. Commit your changes

Commit messages follow a convention too. One you are ready to commit some changes, use this naming convention:

```txt
#<issue-id> <type-of-change> <message>
```

For example, if you have removed unused imports, your commit message will be: "#12 fix remove unused imports"

The type of changes are the following:

- add: a feature addition
- fix: a patch
- break: any of the above that would also break existing installation of this plugin

### 6. Propose your change

Head on your github namespace project, and you should see a message to automatically create a PR by target the original project. Pull request must target the master branch.

Thanks a lot!
