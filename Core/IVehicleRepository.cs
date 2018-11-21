using System.Threading.Tasks;
using vega.Models;

namespace vega.Persistence
{
    public interface IVehicleRepository
    {
        void Add(Vehicle vehicle);
        Task<Vehicle> GetAsync(int id, bool includeRelated = true);
        void Remove(Vehicle vehicle);
    }
}