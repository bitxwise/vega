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

        public static IQueryable<T> ApplyPaging<T>(this IQueryable<T> queryable, IQuery query)
        {
            if(!query.Page.HasValue || !query.PageSize.HasValue)
                return queryable;

            if(query.Page.Value <= 0)
                throw new ArgumentException("Page must be at least 1.", "query.Page");

            if(query.PageSize.Value <= 0)
                throw new ArgumentException("Page size must be at least 1.", "query.PageSize");

            return queryable.Skip((query.Page.Value - 1) * query.PageSize.Value).Take(query.PageSize.Value);
        }
    }
}