
# HTTP Performance Framework

https://stunning-enigma-c04d9094.pages.github.io/

## Notice !

If this is a branch of another project, **do not merge** this branch. It holds the performance test scenarios and is _not_ an actual branch of the code.

## Getting started

First, create a new orphaned branch in the project to hold your performance scenarios

```bash
# Open your service
$ cd <your-service-project>

# Create a new `performance` branch
$ git checkout --orphan performance

# Clear out all of the files so your branch is empty
$ git reset --hard
```

Next, you will want to pull in the performance framework

```bash
# Pull in the performance framework
$ git pull git@github.com:simpletun/performance-framework master

# Push up your new performance branch
$ git push origin performance
```

From there, you can start writing your scenarios!
