using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using vega.Models;

namespace vega.Persistence
{
    public class VehiclesRepository : IVehicleRepository
    {
        private readonly VegaDbContext context;

        public VehiclesRepository(VegaDbContext context)
        {
            this.context = context;
        }

        public async Task<Vehicle> GetVehicle(int id)
        {
            return await this.context.Vehicles
                .Include(v => v.Model)
                    .ThenInclude(m => m.Make)
                .Include(v => v.Features)
                    .ThenInclude(vf => vf.Feature)
                .SingleOrDefaultAsync(v => v.Id == id);
        }
    }
}