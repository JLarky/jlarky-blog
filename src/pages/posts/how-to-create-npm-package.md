---
layout: "../../layouts/PostLayout.astro"
title: "Creating an NPM Package in 2024"
date: "2023-09-21"
---

## Jokey Intro

So, you want to create an npm package? My advice? Don't. It's a lot of work, and the results are often not worth the effort. At the time of me writing this, npm has 2,532,666 packages. By the time you finish this article, it's guaranteed there will be at least 10 more.

On the surface, it sounds simple: write some code in a file and push it to [npm](https://www.npmjs.com/). But you can't just push the code; you also need a `package.json` filled with all sorts of metadata. You can't merely push the source code either. If you're using TypeScript (and you should be), suddenly you have a build step, bundlers, minifiers, CommonJS, ES Modules — the list goes on.

## I ain't reading all that. I'm happy for u tho. Or sorry that happened.

- [GH repo](https://github.com/JLarky/is-not-bun)
- [Youtube tutorial](https://www.youtube.com/live/A19Jvot9hI4?si=Rf5iakJOPmcTEMxo)

## The Best Way to Author an NPM Package is Deno

[Deno](https://deno.com/) is an alternative JavaScript runtime that comes with built-in lint, TypeScript, and bundling capabilities. You don't need to be familiar with Deno to follow this tutorial.

For the first step, [install Deno](https://docs.deno.com/runtime/manual/getting_started/installation). If you're on a Mac or Linux, it's just one command:

```
curl -fsSL https://deno.land/x/install/install.sh | sh
```

## 1. Create a New Project

Create a new folder for your project and run `deno init`:

```
mkdir is-not-bun
cd is-not-bun
deno init
touch README.md LICENSE
```

Replace `is-not-bun` with the name of your package. This tutorial is the text version of this [Youtube tutorial](https://www.youtube.com/live/A19Jvot9hI4?si=Rf5iakJOPmcTEMxo) and will address the same problem space of determining if a user is running an npm package using [Bun](https://bun.sh/) (you don't need to know about Bun either).

## 2. Create your code

Create `mod.ts` and write your code:

```ts
import { isBun } from "npm:is-bun";

export function isNotBun(): boolean {
  return !isBun();
}

export function printIsNotBun() {
  if (isNotBun()) {
    console.log("No Bun, no problem");
  } else {
    console.log("Help, I'm trapped in a Bun factory");
  }
}
```

Create `cli.ts` and write your CLI:

```ts
import { printIsNotBun } from "./mod.ts";

printIsNotBun();
```

And run it with:

```bash
deno run cli.ts
```

You will see the output:

```
No Bun, no problem
```

Notice the difference, because we are using Deno we have to add `npm:` prefix when importing npm packages, but the positive is that we don't need to run `npm install`, because Deno will automatically download the package from NPM.

## 3. DNT build script

We are going to use [dnt - Deno to Node Transform](https://github.com/denoland/dnt) tool to build the npm package.

I recommend you to checkout other examples of DNT configs:

- [oak](https://github.com/oakserver/oak/blob/main/_build_npm.ts)
- [upstash](https://github.com/upstash/upstash-redis/blob/main/cmd/build.ts)
- [sveltekit-modal](https://github.com/semicognitive/sveltekit-modal/blob/ec38e1393cadcbba2a4f6dc09cb0a8da445a3f8f/dnt.ts#L4)
- [SimpleWebAuthn](https://github.com/MasterKale/SimpleWebAuthn/blob/master/packages/typescript-types/build_npm.ts)

Create a file `_build_npm.ts` and add the following code:

```ts
#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net --allow-env --allow-run
// Copyright 2018-2022 the oak authors. All rights reserved. MIT license.

/**
 * This is the build script for building npm package.
 *
 * @module
 */

import { build, emptyDir } from "https://deno.land/x/dnt@0.38.1/mod.ts";

async function start() {
  await emptyDir("./npm");

  await build({
    entryPoints: [
      // change me
      "./mod.ts",
      {
        kind: "bin",
        name: "is-not-bun",
        path: "./cli.ts",
      },
    ],
    outDir: "./npm",
    shims: {},
    test: false,
    typeCheck: "both",
    compilerOptions: {
      importHelpers: false,
      sourceMap: true,
      target: "ES2021",
      lib: ["esnext", "dom", "dom.iterable"],
    },
    package: {
      name: "is-not-bun", // change me
      version: Deno.args[0],
      description: "Return true if you are running not in Bun.", // change me
      license: "MIT",
      keywords: ["bun"], // change me
      engines: {
        node: ">=8.0.0",
      },
      repository: {
        type: "git",
        url: "git+https://github.com/JLarky/is-not-bun.git", // change me
      },
      bugs: {
        url: "https://github.com/JLarky/is-not-bun/issues", // change me
      },
      dependencies: {
        "is-bun": "*", // change me
      },
      devDependencies: {},
    },
  });

  await Deno.copyFile("LICENSE", "npm/LICENSE");
  await Deno.copyFile("README.md", "npm/README.md");
}

start();
```

Make sure to replace `is-not-bun` with the name of your project, change your description, keywords, repository, dependencies and entry points.

`"./mod.ts"` is the name of the `"main"` entry in your package, most of the time that's the only entry point you need. But if you are building a CLI tool (for example `tsc`, `ts-node`), that's when `kind: "bin",` comes into play. If you are not planning to build a CLI tool, you can remove the second entry point (the whole object).

## 4. Build your package

First, let's add `npm` to `.gitignore`:

```bash
echo "npm" >> .gitignore
```

And make build script executable:

```bash
chmod +x _build_npm.ts
```

Now we can build the version `0.0.1` of our package with the build script:

```bash
./_build_npm.ts 0.0.1
```

You can check that the build was successful by running:

```bash
(cd npm/; node -e "console.log(require('.'))")
```

The expected output:

```json
{
  isNotBun: [Function: isNotBun],
  printIsNotBun: [Function: printIsNotBun]
}
```

## 5. Publish your package

We are at the final step, we can publish our package to NPM:

```bash
(cd npm/; npm publish)
```

Keep in mind that if you never published to npm before you will have to create an account and login first:

```bash
npm login
```

## That's it

Let's celebrate a bit what we have accomplished:

- We were able to author our package in TypeScript and because we are using Deno we can run `deno run cli.ts` without separate build step or even `npm install` and get nice developer experience (even though we were using dependencies from NPM)
- Using dnt we were able to create nice and modern package setup with three output formats: CommonJS (`npm/script/mod.js`), ES Modules (`npm/esm/mod.js`) and TypeScript source (`npm/src/mod.ts`)
- That npm package is checking all the boxes, it generated `.d.ts` files for TypeScript users and even `.js.map` with source maps for debugging
- As a bonus we even got CLI that you can run with `npx is-not-bun` or as a script in your package.json `"scripts": { "fun": "is-not-bun" }` that you can run with `npm run fun`
- And we can use some nice built-in Deno tools as extra bonus, which I will cover in the next section

## Extra bonus

This part is not technically required, remember when I said that you don't have to actually care about Deno? Well, this is where the sales pitch comes in.

First things first, we have a few files that were created during `deno init`, I'm going to guide you through them.

### `deno.json` and `main.ts`

Remember how I said that DX for development of packages is great in Deno? It's actually even better than that. `deno run` supports `--watch` flag that will re-run your code every time you save a file, no need for `nodemon` and similar tools.

Similar to `package.json` Deno has `deno.json` and at the moment it only has one task defined there:

```bash
deno task dev
```

It will run `main.ts` with `--watch` flag, so you can keep your development code in that file.

So in the [GH repo](https://github.com/JLarky/is-bun) here's the content of `main.ts`:

```ts
import { isNotBun } from "./mod.ts";

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("In Deno isNotBun is", isNotBun());
}
```

### `main_test.ts`

Deno has built-in test runner, so you don't need to install `vitest` or `jest`. To run tests you just do:

```bash
deno test
```

In GH repo this file looks like this:

```ts
import { assertEquals } from "https://deno.land/std@0.195.0/testing/asserts.ts";
import { isNotBun } from "./mod.ts";

Deno.test(function bunTest() {
  assertEquals(isNotBun(), true);
});
```

### `main_bench.ts`

It looks like this file is no longer there with the new version of `deno init`, but I still have it for old time sake. To run simple benchmarks you can do:

```bash
deno bench
```

In GH repo this file looks like this:

```ts
import { isNotBun } from "./mod.ts";

Deno.bench(function benchIsNotBun() {
  isNotBun();
});
```

## Conclusion

Creating npm packages can be challenging. We've seen many tools in this domain, and I encourage you to try dnt. With dnt, I was finally able to pass the [package.json linter](https://publint.dev/), which is no small achievement (try `jotai`, `redux`, `vite`).

This tutorial hasn't covered many dnt features. For more information, please check out this [tweet](https://twitter.com/deno_land/status/1676264059585560578) for further reading and some replies from happy users.
