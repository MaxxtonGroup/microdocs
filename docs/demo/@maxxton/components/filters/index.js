/**
 * Exports of all filters
 * @author R. Reinartz (r.reinartz@maxxton.com)
 */
System.register(["./filter-by-query.pipe", "./filter-boolean-field-by-query.pipe", "./group-by-key.pipe", "./sort-by-key.pipe", "./string.pipe", "./empty.pipe", "./not-empty.pipe", "./object-iterator.pipe", "./filter-by-field.pipe"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var filter_by_query_pipe_1, filter_boolean_field_by_query_pipe_1, group_by_key_pipe_1, sort_by_key_pipe_1, string_pipe_1, empty_pipe_1, not_empty_pipe_1, object_iterator_pipe_1, filter_by_field_pipe_1;
    var FILTERS;
    return {
        setters:[
            function (filter_by_query_pipe_1_1) {
                filter_by_query_pipe_1 = filter_by_query_pipe_1_1;
                exports_1({
                    "FilterByQueryPipe": filter_by_query_pipe_1_1["FilterByQueryPipe"]
                });
            },
            function (filter_boolean_field_by_query_pipe_1_1) {
                filter_boolean_field_by_query_pipe_1 = filter_boolean_field_by_query_pipe_1_1;
                exports_1({
                    "FilterBooleanFieldByQueryPipe": filter_boolean_field_by_query_pipe_1_1["FilterBooleanFieldByQueryPipe"]
                });
            },
            function (group_by_key_pipe_1_1) {
                group_by_key_pipe_1 = group_by_key_pipe_1_1;
                exports_1({
                    "GroupByKeyPipe": group_by_key_pipe_1_1["GroupByKeyPipe"]
                });
            },
            function (sort_by_key_pipe_1_1) {
                sort_by_key_pipe_1 = sort_by_key_pipe_1_1;
                exports_1({
                    "SortByKeyPipe": sort_by_key_pipe_1_1["SortByKeyPipe"]
                });
            },
            function (string_pipe_1_1) {
                string_pipe_1 = string_pipe_1_1;
                exports_1({
                    "StringFilterPipe": string_pipe_1_1["StringFilterPipe"]
                });
            },
            function (empty_pipe_1_1) {
                empty_pipe_1 = empty_pipe_1_1;
                exports_1({
                    "EmptyPipe": empty_pipe_1_1["EmptyPipe"]
                });
            },
            function (not_empty_pipe_1_1) {
                not_empty_pipe_1 = not_empty_pipe_1_1;
                exports_1({
                    "NotEmptyPipe": not_empty_pipe_1_1["NotEmptyPipe"]
                });
            },
            function (object_iterator_pipe_1_1) {
                object_iterator_pipe_1 = object_iterator_pipe_1_1;
                exports_1({
                    "ObjectIteratorPipe": object_iterator_pipe_1_1["ObjectIteratorPipe"]
                });
            },
            function (filter_by_field_pipe_1_1) {
                filter_by_field_pipe_1 = filter_by_field_pipe_1_1;
                exports_1({
                    "FilterByFieldPipe": filter_by_field_pipe_1_1["FilterByFieldPipe"]
                });
            }],
        execute: function() {
            //combined
            exports_1("FILTERS", FILTERS = [
                filter_boolean_field_by_query_pipe_1.FilterBooleanFieldByQueryPipe,
                filter_by_query_pipe_1.FilterByQueryPipe,
                group_by_key_pipe_1.GroupByKeyPipe,
                sort_by_key_pipe_1.SortByKeyPipe,
                string_pipe_1.StringFilterPipe,
                empty_pipe_1.EmptyPipe,
                not_empty_pipe_1.NotEmptyPipe,
                object_iterator_pipe_1.ObjectIteratorPipe,
                filter_by_field_pipe_1.FilterByFieldPipe
            ]);
        }
    }
});
