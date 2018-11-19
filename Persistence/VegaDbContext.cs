using Microsoft.EntityFrameworkCore;
using vega.Models;

namespace vega.Persistence
{
    public class VegaDbContext : DbContext
    {
        public VegaDbContext(DbContextOptions<VegaDbContext> options)
            : base(options)
        {
            
        }

        public DbSet<Feature> Features { get; set; }

        public DbSet<Make> Makes { get; set; }
    }
}