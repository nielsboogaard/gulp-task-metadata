# gulp-task-metadata

This plugin provides metadata to your gulp tasks. This way you can hand over specific configuration to all tasks, which enables you to re-use and run those tasks in parallel with different sets of configuration for each task instance.

Please note that this plugin is compatible with Gulp 4, not 3.x.

## Usage

First, install `gulp-task-metadata` as a development dependency:

```shell
npm install --save-dev gulp-task-metadata
```
Then, add it to your `gulpfile.js` and replace all calls (or only the ones needed) to `gulp.series` and `gulp.parallel` with calls to this plugin. Make sure you prepend the metadata you want to provide as the first argument.

```javascript
var gulpTaskMetadata = require('gulp-task-metadata');

gulpTaskMetadata.series(['metadata'], ...); //instead of gulp.series(...)
gulpTaskMetadata.parallel(['metadata'], ...); //instead of gulp.parallel(...)
```

Basic example:
```javascript
var gulpTaskMetadata = require('gulp-task-metadata');

gulp.task('runTasks', function(){
    gulpTaskMetadata.series([{ foo: bar }], 'task1', 'task2')();
    gulpTaskMetadata.parallel(['otherConf'], 'task1')();
});

gulp.task('task1', function(done, conf) {
    console.log('task1 conf:', conf);
    done();
});

gulp.task('task2', function(done, conf) {
    console.log('task2 conf:', conf);
    done();
});
```

## API

gulp-task-metadata is used the same way as the default `series` and `parallel` methods from Undertaker which Gulp uses, except that de first argument holds the metadata which should be provided to the following tasks.

### `series(metadata, taskName || fn...)`

#### metadata
Type: `Array`

The metadata to provide to all the given tasks

#### taskName || fn...
Type: `String` or `Function`

Takes a variable amount of strings (taskName) and/or functions (fn) and returns a function of the composed tasks or functions. Any taskNames are retrieved from the registry using the get method.

When the returned function is executed, the tasks or functions will be executed in series, each waiting for the prior to finish. If an error occurs, execution will stop.

### `parallel(metadata, taskName || fn...)`

#### metadata
Type: `Array`

The metadata to provide to all the given tasks

#### taskName || fn...
Type: `String` or `Function`

Takes a variable amount of strings (taskName) and/or functions (fn) and returns a function of the composed tasks or functions. Any taskNames are retrieved from the registry using the get method.

When the returned function is executed, the tasks or functions will be executed in parallel, all being executed at the same time. If an error occurs, all execution will complete.
