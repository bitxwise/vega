using System.Collections.Generic;
using System.Threading.Tasks;
using vega.Core.Models;

namespace vega.Core
{
    public interface IVehicleRepository
    {
        void Add(Vehicle vehicle);
        Task<IEnumerable<Vehicle>> GetAllAsync(VehicleQuery query = null);
        Task<Vehicle> GetAsync(int id, bool includeRelated = true);
        void Remove(Vehicle vehicle);
    }
}