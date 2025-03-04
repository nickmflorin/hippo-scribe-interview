# Hippo Scribe

This repository contains a small web application for use in an interview by
[Hippo Scribe](https://gethipposcribe.com/).

### System Requirements

The contents of this document assume that you are using a MacOS machine. If you are not, steps
outlined for setting up and running the application locally will be similar, but not exactly the
same.

- [nvm]: A [node] version manager.
- [Node][node] v20.x
- [homebrew]: A MacOSX package manager.
- [pnpm]: A [node] package manager.
- [Vercel CLI][vercel-cli]: [Vercel][vercel]'s command line utility.

## 1. Getting Started

This section of the documentation outlines - at a high level - how to setup your machine for local
development for the first time. For more detailed explanations related to local development or
production deployments, see the Section 2: Development.

**Note**: _This documentation describes how to setup and configure the application for local
development on MacOSX. Many of the steps outlined in this section may also be applicable for a
Windows/Ubuntu machine as well, but the steps will not be exactly as they are described here._

### 1.1: Repository

Clone this repository locally and `cd` into the directory.

```bash
$ git clone git@github.com:nickmflorin/hippo-scribe.git
```

### 1.2: Installing System Requirements

This section walks through how to install and configure the prerequisites (System Requirements) for
this project.

#### 1.2.a [Node][node]

[Node][node] is the engine that supports the application. This project uses [node] v20.0.0. Your
machine will most likely already have a system installation of [node], but even if it does not -
that is okay, we will not be using the system installation of [node] but will rather isolate the
version of [node] being used for this project to this repository using [nvm].

**Important**: _Do not use a system installation of [node]. It will complicate your development
environment. Instead, see the next section for details about usage of [nvm]._

##### 1.2.a.i Installing [nvm]

It is strongly recommended that you use [nvm] to manage the version(s) of [node] that are being used
for this project, rather than system installations. It will allow you to more easily isolate the
version of [node] being used for this project to the project directory, avoiding conflicts with
global or system installations of [node].

Instructions for installing [nvm] can be found
[here](https://github.com/nvm-sh/nvm#installing-and-updating), but are also mentioned below for
purposes of completeness:

First, simply run the install script:

```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

The above command will download a script and then run it. The script it runs will first clone the
[nvm] repository at `~/.nvm` and then attempt to add the following source lines to your machine's
shell profile script (which may be either `~/.bash_profile`, `~/.zshrc`, `~/.profile`, or
`~/.bashrc` - depending on your OS):

```bash
$ export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

**Note**: _This installation will automatically make changes to your shell profile script. The exact
file will depend on the type of machine you are running as well as the period of time in which the
machine was created. Most likely, your shell profile script will be `~/.zshrc` - which is the shell
profile used for Mac's created since the introduction of the M1 processor._

Since the [nvm] installation involved making changes to your shell profile script behind the scenes,
in order for those changes to take effect, you need to subsequently source your shell profile script
(`~/.zshrc` in this example):

```bash
$ . ~/.zshrc
```

Finally, verify that your system recognizes the `nvm` command by running the following:

```bash
$ nvm
```

##### 1.2.a.ii Node Version

Now that [nvm] is installed, we need to use it to establish the correct version of [node], 20, that
is suitable for this project. This project's repository comes equipped with a `.nvmrc` file that
automatically tells [nvm] what version of [node] to use - but that version may still need to be
installed.

First, instruct [nvm] to use the [node] version specified by the `.nvmrc` file with the following
command:

```bash
$ nvm use
```

If you see an output similar to the following:

```bash
Found '/<path-to-repository>/nick.florin/.nvmrc' with version <v20.0.0>
Now using node v20.0.0 (npm v8.6.0)
```

It means that the correct version of [node] that is required for this project is already installed
with [nvm] and that version of [node] is active for this project's directory. The rest of this step
can be skipped and you can proceed to the next step, "1.2.a.iii: Homebrew".

On the other hand, if you see an error similar to the following:

```bash
Found '/<path-to-repository>/nick.florin/.nvmrc' with version <v20.0.0>
N/A: version "v20.0.0 -> N/A" is not yet installed.

You need to run "nvm install v20.0.0" to install it before using it.
```

It means that the correct version of [node] that is required for this project is not already
installed with [nvm], and must be installed before using it. To do this, simply run the following
command from the root of the project repository:

```bash
$ nvm install
```

This command will use [nvm] to install the correct version of [node] that is required for this
project, based on the specification in the project's `.nvmrc` file.

Finally, all that is left to do is to instruct [nvm] to use this version of [node] by executing the
following command - again, from the root of the project repository:

```bash
$ nvm use
```

For a sanity check, confirm that [nvm] is pointing to the correct version of [node] in the project
directory by executing the following command:

```bash
$ nvm current
```

The output of this command should be similar to the following:

```bash
$ v20.x.x
```

At this point, if [nvm] is not pointing at the correct version of [node] or is pointing at a system
installation of [node], something went awry - consult a team member before proceeding.

### 1.2.b: Homebrew

If on MacOSX, you will need to install [homebrew], which is a MacOSX package manager.

### 1.2.c: pnpm

This application uses [`pnpm`][pnpm] to manage dependencies. Before installing the project's
dependencies, [pnpm] must be downloaded and setup on your machine. To download [`pnpm`][pnpm],
simply execute the following `curl` command:

```bash
$ curl -fsSL https://get.pnpm.io/install.sh | sh -
```

After downloading [`pnpm`][pnpm], make sure to source your machine's shell profile script (here, we
assume that is `~/.zshrc`):

```bash
$ . ~/.zshrc
```

Finally, ensure that the `pnpm` command is recognized by your machine:

```bash
$ pnpm -v
```

The [`pnpm`][pnpm] version should be 8.x.x. If it is not, refer to the next section, "Managing PNPM
Version".

###### Managing PNPM Version

[`pnpm`][pnpm] uses [corepack] to manage versions on your local machine. [corepack] can be installed
on your machine via [homebrew]:

```bash
$ brew install corepack
```

Once [corepack] is installed, activate it as follows:

```bash
$ corepack enable
```

Now you should be able to manage your [`pnpm`][pnpm] version for this project independently of the
system installation:

```bash
$ corepack prepare pnpm@<version> --activate
```

or

```bash
$ corepack prepare pnpm@latest --activate
```

### 1.2.d: Vercel CLI

Once [`pnpm`][pnpm] is installed, [Vercel]'s [CLI][vercel-cli] needs to be installed. This
application uses [Vercel]'s [CLI][vercel-cli] to manage environment variables in both production and
development environments, particularly environment variables that represent sensitive information.

To install [Vercel]'s [CLI][vercel-cli], simply use [`pnpm`][pnpm] to install the package globally:

```bash
$ pnpm i -g vercel
```

If you notice an error similar to the following:

```
Error: Cannot find module 'stream/web'
```

It means that you are not using the correct version of [node] (v20.x.x). Simply execute `nvm use` to
ensure your [node] version is correct, and then try to run the installation command again.

Once the [CLI][vercel-cli] is installed, you must login with your [Vercel][vercel] credentials:

```bash
$ vercel login
```

### 1.3: Environment

This section discusses how to properly setup environment variables and dependencies in the
application.

#### 1.3.a ENV File

When running the application locally, there will likely be additional, sensitive keys that needed to
be added to the environment via environment variables. These keys **cannot** be committed to source
control, and precaution must be taken to avoid doing so.

The files that this application uses to define environment variables that represent sensitive
information are as follows:

1. `.env.local`
2. `.env.development.local`
3. `.env`

Each of these files are ignored by the `.gitignore` file and will not be committed to source
control. The `.env` file will be loaded first, followed by the `.env.development.local` file and
then finally, the `.env.local` file (in a "development" environment). The `.env.local` and
`.env.development.local` files can be created on an individual developer basis, for purposes of
overridding certain configurations when developing. On the other hand, the `.env` file is used for
storing sensitive information directly from [Vercel][vercel]'s infrastructure.

**Note:** _Sensitive keys, tokens or keys related to access control should **only** ever be added to
`.env.local`, `.env.development.local` or `.env`. Other environment files (`.env.development`,
`.env.production`, .etc) are committed to source control, and should **never** contain sensitive
information._

_For more information regarding environment variables in [NextJS][nextjs], and the order in which
they are loaded (and overridden) please refer to Section 2.5._

To populate your local environment with the required environment variables necessary to run the
application locally, simply execute the following command:

```bash
pnpm pullenv
```

This command will pull the sensitive environment variables for the development environment from
[Vercel][vercel]. The environment variables will be placed inside of the `.env` file, which is the
first set of environment variables loaded by [NextJS][nextjs]. This means that any values for those
environment variables that are defined in any other environment file (`.env.local`,
`.env.development`, etc.) will override those defined in the `.env` file.

For more information regarding the environment variables, refer to Section 2.5.

#### 1.3.b: Dependencies

When setting up the environment for the first time, you must do a fresh install of the dependencies.

##### 1.3.b.i Font Awesome

Before installing the dependencies, you will need to be given an environment variable,
`FONT_AWESOME_AUTH_TOKEN`, that is required to install certain dependencies. Currently, this
application uses a "pro" license for [FontAwesome][fontawesome] to support the icons in the
application. There are [FontAwesome][fontawesome]-related packages in the `package.json` file that
require an authenticated, "pro" license key to be in the environment when installing the packages.

**Note**: This authentication token is only required if the [FontAwesome][fontawesome]-related
packages have not already been installed to your `./node_modules` folder - which will likely only
ever be when setting up the environment for the first time or after deleting the `./node_modules`
folder manually.

Consult a team member for the `FONT_AWESOME_AUTH_TOKEN` environment variable, and add it to your
`.env.local` or `.env.development.local` file. Once that environment variable is defined, you can do
a fresh install of the dependencies:

```bash
$ pnpm install
```

This will install the project dependencies in the `package.json` file.

## 2. Local Development

This section of the documentation describes various interactions that you will need to understand in
order to properly work with this application locally. This section assumes that you have already
completed the steps outlined in the prior section, "Getting Started".

### 2.1 IDE

This project is optimized for development using the [VSCode][vscode] IDE. While other IDEs may also
work in this repository, you must take steps to ensure that our editor configurations (like trimmed
whitespace, indentation, and `prettyprint` with [Prettier][prettier]) that are applied to this
repository while using [VSCode][vscode] are also consistently applied in your IDE. This ensures that
your commits will conform to the established repository style.

### 2.2 Running Locally

After pulling down the latest state of the repository, the development server can be started by
running the following command:

```bash
$ pnpm dev
```

**Note**: If changes were made to the `package.json` file, you may need to install the dependencies
via `pnpm install`.

### 2.3 Building

Before committing any changes you have made, you must ensure that you validate your work by ensuring
that you can successfully build the project:

```bash
$ pnpm build
```

This is required because [NextJS][nextjs] does not perform type checks while the development server
is running. Only the `build` command will compile the code and run all type checks.

Sometimes, you may get misleading results from the local build. For instance, you might notice that
the build is failing due to errors that you had just fixed, but were not picked up in the subsequent
build. This can happen because [NextJS][nextjs] will cache part of the build. To fix this, or as as
a general sanity-check, clear the cache before running the build:

```bash
$ rm -rf ./.next
$ pnpm build
```

**Note**: [NextJS][nextjs] will also automatically perform linting checks during the `build`
process - any linting errors will result in the build failing automatically but linting warnings
will not. This includes linting performed by [ESLint][eslint], [Stylelint][stylelint] and
[Prettier][prettier].

### 2.4 Linting

This project uses [ESLint][eslint] to lint files that are not CSS or SCSS based,
[Stylelint][stylelint] to lint files that are CSS or SCSS based, and [Prettier][prettier] inside of
the [ESLint][eslint] configuration which is responsible for formatting files of all types. Both
[ESLint][eslint] and [Stylelint][stylelint] are configured to automatically format the file when the
file is saved (a configuration that is defined in `./vscode/settings.json`). If that is not
desirable, you can easily turn that setting off in yoru local [VSCode][vscode] settings.

#### 2.4.a Formatting & Code Style

The philosophy that the project has in regard to formatting and/or code styles can be summarized as
follows:

> There is usually not a right or wrong answer, but it is better to choose than to not.

In other words, many formatting rules were not chosen for a specific reason other than having a
decision. It is better to rely on the available formatting tools to remove as much ambiguity as
possible, rather than spending time debating or arguing the rules themselves.

#### 2.4.b Performing Linting Checks

[NextJS][nextjs] will automatically perform linting checks during the `build` process, but it is
desired that they be performed independently without performing the entire `build` process, use the
following command:

```bash
$ pnpm lint
```

This will run [ESLint][eslint], [Stylelint][stylelint] and [Prettier][prettier] (via
[ESLint][eslint]) on the project.

With that being said, the project's [Jest][jest] testing suite is configured to perform linting and
formatting checks via [ESLint][eslint], [Stylelint][stylelint] and [Prettier][prettier] as well.
This is the recommended way to perform the checks, because the output is much, much more suitable
for debugging and the hot reloading feature of [Jest][jest] will save you a lot of time.

This can be done simply as:

```bash
$ pnpm test
```

For more information related to [Jest][jest] and the linting checks it performs, please see the
section further down in this documentation, "Testing".

#### 2.4.c Automatically Fixing [ESLint][eslint] Violations

Some [ESLint][eslint] violations can be automatically fixed by [ESLint][eslint] itself. This can be
performed via the `eslint-fix` command, which is defined in the `package.json` file:

```bash
$ pnpm eslint-fix
```

This command will automatically fix and format all [ESLint][eslint] and [Prettier][prettier]
violations in the repository that are capable of being auto-fixed.

### 2.5 Environment

There are 3 distinct environments that the application runs in, with the current environment being
dictated by the `NODE_ENV` environment variable:

| Environment (`NODE_ENV`) | Default Environment File | Override Environment File | Overridden by `.env.local` |
| :----------------------: | :----------------------: | :-----------------------: | :------------------------: |
|      `development`       |    `.env.development`    | `.env.development.local`  |            Yes             |
|       `production`       |    `.env.production`     |  `.env.production.local`  |            Yes             |
|          `test`          |       `.env.test`        |            N/A            |             No             |

Additionally, there is a third environment file, `.env`, that contains environment variables that
define environment variables for _all_ environments.

For each environment the default environment file specifies defaults that the environment variable
will have for the file's associated environment. These files should _always_ be committed to source
control.

When the environment is `development`, the default environment variables will be loaded from
`.env.development`. Similarly, when the environment is `production`, the default environment
variables will be loaded from `.env.production`. Finally, when the environment is `test`, the
default environment variables will be loaded from `.env.test`. In each case, any environment
variables defined in the environment specific file, `.env.${NODE_ENV}`, will override those defined
in the global environment variable file, `.env`.

#### 2.5.a Local Overrides

It is often necessary that the environment variables for any given environment be overridden, either
locally in development or on a server. When overriding the default environment variables for a given
environment is required, a `.env.local` file is used. The environment variables defined in this file
will override the default environment variables _only when in a `production` or `development`
environment_. If the environment is `test`, the environment variables in `.env.local` will not be
loaded.

Note that if you would like to override the environment variables for just a single environment, a
corresponding `.env.development.local` or `.env.production.local` file can be used. Each of these
files will be given precedence over the `.env.local` file.

For further documentation regarding the environment configuration, please see the
[NextJS Documentation](https://nextjs.org/docs/basic-features/environment-variables).

### 2.6 Testing

This documentation is intended to outline configurations, patterns and methodologies that are used
to test the Console application.

We use [Jest][jest] to handle integration and unit testing in the Console. The entire test suite can
be run with the following command:

```bash
$ pnpm test
```

#### 2.6.a Projects

Originally, there was only one configuration file for the testing suite, `jest.config.ts`. However,
due to the complexities of some of the tests that have to be run, the configuration had to be split
up into [projects](https://jestjs.io/docs/configuration#projects-arraystring--projectconfig), such
that certain tests can use different sets of configuration parameters that would not otherwise be
possible with a single configuration.

The [Jest][jest] testing suite is broken down into 2
"[projects](https://jestjs.io/docs/configuration#projects-arraystring--projectconfig)":

1. **Prettier**: Prettier checks that are performed against relevant files in the project.
2. **ESLint**: ESLint checks that are performed against non `.scss` files in the project.

The following table describes the various aspects of each individual
[Jest](https://jestjs.io/docs/getting-started) project in the application:

| Project  |        Config File        |       Files Tested        | Test Files Located |
| :------: | :-----------------------: | :-----------------------: | :----------------: |
| Prettier | `jest.config.prettier.ts` |       All Relevant        |        N/A         |
|  ESLint  |  `jest.config.eslint.ts`  | All Relevant, non `.scss` |        N/A         |

#### 2.6.b Linting

Linting checks from [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) can be
performed both via the `npm run lint` command or simply the command that runs the test suite:

```bash
$ pnpm test
```

However, it is highly recommended that the [Jest](https://jestjs.io/docs/getting-started) test suite
is used when performing linting checks locally because
[Jest](https://jestjs.io/docs/getting-started) does a phenomenal job providing clearer, more
detailed and more readable debugging information when the checks fail. Additionally,
[Jest](https://jestjs.io/docs/getting-started) provides the benefit of "watch mode" - which allows
you to dynamically make the changes and immediately see the checks pass as a result of the changes
that were made.

## 3. Production

This section of the documentation describes how to work with the application in a production
setting.

This application uses [Vercel][vercel] for its production infrastructure.

### 3.1 Deploying

The application's instance in [Vercel][vercel] is automatically configured to listen to changes on
either the `master` or `develop` branch, and automatically deploy.

When the `develop` branch changes, [Vercel][vercel] will automatically redeploy the application in a
`preview` environment. The URL of the deployed instance is dynamic, and can be retrieved directly
from the [Vercel][vercel] deployments dashboard.

When the `master` branch changes, [Vercel][vercel] will automatically redeploy the application in a
`production` environment, at the application's public and primary URL.

With this in mind, deploying the application is as simple as merging the most up to date changes
into the `master` branch (from the `develop` branch) and pushing up to the remote. When this
happens, [Vercel][vercel] will automatically redeploy the production instance.

First, checkout the `master` branch:

```bash
$ git checkout master
```

Then, make sure you have the latest changes from the `develop` branch on the remote:

```bash
$ git fetch origin develop
```

Then, merge the changes from `origin/develop` into `master`, making sure to use the `--ff-only` flag
to ensure that the commits are linear and can be applied directly on top of the last commit on
`master`:

```bash
$ git merge --ff-only origin/develop
```

Finally, push the changes up to `master` to trigger the deploy:

```bash
$ git push origin master
```

[psql]: https://www.postgresql.org/docs/current/app-psql.html
[homebrew]: https://brew.sh/
[postgresql]: https://www.postgresql.org/docs/current/app-psql.html
[nvm]: https://github.com/nvm-sh/nvm
[node]: https://nodejs.org/en/
[postgres]: https://www.postgresql.org/
[homepage]: ./ReadMe.md
[react]: https://reactjs.org/
[nextjs]: https://nextjs.org/
[prettier]: https://prettier.io/
[vscode]: https://code.visualstudio.com/
[eslint]: https://eslint.org/
[jest]: https://jestjs.io/docs/getting-started
[sass]: https://sass-lang.com/
[prisma]: https://www.prisma.io/
[fontawesome]: https://fontawesome.com/docs
[pnpm]: https://pnpm.io/installation
[corepack]: https://nodejs.org/api/corepack.html
[vercel]: https://vercel.com/
[vercel-cli]: https://vercel.com/docs/cli
