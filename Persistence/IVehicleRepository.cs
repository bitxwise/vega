using System.Threading.Tasks;
using vega.Models;

namespace vega.Persistence
{
    public interface IVehicleRepository
    {
        void Add(Vehicle vehicle);
        Task<Vehicle> Get(int id, bool includeRelated = true);
        void Remove(Vehicle vehicle);
    }
}