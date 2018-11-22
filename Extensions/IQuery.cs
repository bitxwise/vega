namespace vega.Extensions
{
    public interface IQuery
    {
        string SortBy { get; }

        bool IsSortAscending { get; }

        int Page { get; }

        int PageSize { get; }
    }
}