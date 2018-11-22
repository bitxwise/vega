using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace vega.Extensions
{
    public static class IQueryableExtensions
    {
        public static IQueryable<T> ApplyOrdering<T>(this IQueryable<T> queryable, IQuery query, Dictionary<string, Expression<Func<T, object>>> fieldExpressionMap)
        {
            if(string.IsNullOrWhiteSpace(query.SortBy) || !fieldExpressionMap.ContainsKey(query.SortBy))
                    return queryable;

            if(query.IsSortAscending)
                return queryable.OrderBy(fieldExpressionMap[query.SortBy]);
            else
                return queryable.OrderByDescending(fieldExpressionMap[query.SortBy]);
        }
    }
}