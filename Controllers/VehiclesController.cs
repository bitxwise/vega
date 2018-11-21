using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using vega.Controllers.Resources;
using vega.Models;
using vega.Persistence;

namespace vega.Controllers
{
    [Route("/api/vehicles")]
    public class VehiclesController : Controller
    {
        private readonly IMapper mapper;
        private readonly VegaDbContext context;

        public VehiclesController(VegaDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateVehicle([FromBody] VehicleResource vehicleResource)
        {
            var vehicle = this.mapper.Map<VehicleResource, Vehicle>(vehicleResource);

            this.context.Vehicles.Add(vehicle);
            await this.context.SaveChangesAsync();

            var result = this.mapper.Map<Vehicle, VehicleResource>(vehicle);
            
            return Ok(result);
        }
    }
}