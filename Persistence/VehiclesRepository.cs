using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using vega.Core;
using vega.Core.Models;

namespace vega.Persistence
{
    public class VehiclesRepository : IVehicleRepository
    {
        private readonly VegaDbContext context;

        public VehiclesRepository(VegaDbContext context)
        {
            this.context = context;
        }

        public void Add(Vehicle vehicle)
        {
            this.context.Add(vehicle);
        }

        public async Task<IEnumerable<Vehicle>> GetAllAsync(Filter filter = null)
        {
            var query = this.context.Vehicles
                .Include(v => v.Model)
                    .ThenInclude(m => m.Make)
                .Include(v => v.Features)
                    .ThenInclude(vf => vf.Feature)
                .AsQueryable();

            if(filter != null)
            {
                if(filter.MakeId.HasValue)
                    query = query.Where(v => v.Model.MakeId == filter.MakeId.Value);
                
                if(filter.ModelId.HasValue)
                    query = query.Where(v => v.Model.Id == filter.ModelId.Value);
            }

            return await query.ToArrayAsync();
        }

        public async Task<Vehicle> GetAsync(int id, bool includeRelated = true)
        {
            if(!includeRelated)
                return await this.context.Vehicles.FindAsync(id);

            return await this.context.Vehicles
                .Include(v => v.Model)
                    .ThenInclude(m => m.Make)
                .Include(v => v.Features)
                    .ThenInclude(vf => vf.Feature)
                .SingleOrDefaultAsync(v => v.Id == id);
        }

        public void Remove(Vehicle vehicle)
        {
            this.context.Remove(vehicle);
        }
    }
}