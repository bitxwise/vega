using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        private readonly IVehicleRepository repository;

        public VehiclesController(VegaDbContext context, IVehicleRepository repository, IMapper mapper)
        {
            this.context = context;
            this.repository = repository;
            this.mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateVehicle([FromBody] SaveVehicleResource vehicleResource)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var vehicle = this.mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource);

            this.repository.Add(vehicle);
            await this.context.SaveChangesAsync();

            vehicle =  await this.repository.Get(vehicle.Id);

            var result = this.mapper.Map<Vehicle, VehicleResource>(vehicle);

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] SaveVehicleResource vehicleResource)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var vehicle = await this.repository.Get(id);
            
            if(vehicle == null)
                return NotFound();
            
            this.mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource, vehicle);
            
            await this.context.SaveChangesAsync();

            var result = this.mapper.Map<Vehicle, SaveVehicleResource>(vehicle);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await this.repository.Get(id, includeRelated: false);
            
            if(vehicle == null)
                return NotFound();

            this.repository.Remove(vehicle);

            await this.context.SaveChangesAsync();

            return Ok(id);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVehicle(int id)
        {
            var vehicle = await this.repository.Get(id);

            if(vehicle == null)
                return NotFound();
            
            var result = this.mapper.Map<Vehicle, VehicleResource>(vehicle);

            return Ok(result);
        }
    }
}