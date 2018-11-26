using System.Collections.Generic;

namespace vega.Controllers.Resources
{
    public class QueryResultResource<T>
    {
        public IEnumerable<T> Items { get; set; }
        public int TotalItems { get; set; }
    }
}