using System.Collections.Generic;

namespace vega.Core.Models
{
    public class QueryResult<T>
    {
        public IEnumerable<T> Items { get; set; }
        public int TotalItems { get; set; }
    }
}