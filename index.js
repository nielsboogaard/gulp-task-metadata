'use strict'

var taskFactory = function(fn, metadata) {
    var taskWrapper = function(done) {
        var args = metadata.slice(0);
        args.unshift(done);
        return gulp.task(fn).apply(this, args);
    }
    taskWrapper.displayName = fn;
    return taskWrapper;
}

var wrapTasks = function(tasksObj, metadata) {
    for (var key in tasksObj) {
        var el = tasksObj[key];
        switch (typeof el) {
            case "string":
                tasksObj[key] = taskFactory(el, metadata)
                break;
            case "object":
                tasksObj[key] = wrapTasks(el, metadata);
                break;
        }
    }
    return tasksObj;
}

var series = function() {
    var params = Array.prototype.slice.call(arguments);
    var metadata = params.shift();
    params = wrapTasks(params, metadata);
    return gulp.series.apply(this, params);
}

var parallel = function() {
    var params = Array.prototype.slice.call(arguments);
    var metadata = params.shift();
    params = wrapTasks(params, metadata);
    return gulp.parallel.apply(this, params);
}

/**
 * Wraps all passed tasks in order to inject metadata in each task.
 * Usage:
 *      gulpTaskMetadata.series(['my',metadata'], 'task1', task2', ['task3','task4']).
 *      gulpTaskMetadata.parallel(['my',metadata'], 'task1', task2', ['task3','task4']).
 * The object ['my','metadata'] will now be injected in all the tasks provided to wrapSeries (in this case 'task1' until 'task4')
 * The provided metadata will be injected after the default 'done' callback and can be used as follows: task1(done, metadata) { ... }
 */
module.exports = {
    series: series,
    parallel: parallel
};
