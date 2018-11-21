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

        public VehiclesController(VegaDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateVehicle([FromBody] SaveVehicleResource vehicleResource)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var vehicle = this.mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource);

            this.context.Vehicles.Add(vehicle);
            await this.context.SaveChangesAsync();

            var result = this.mapper.Map<Vehicle, SaveVehicleResource>(vehicle);

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] SaveVehicleResource vehicleResource)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var vehicle = await this.context.Vehicles.Include(v => v.Features).SingleOrDefaultAsync(v => v.Id == id);
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
            var vehicle = await this.context.Vehicles.FindAsync(id);
            
            if(vehicle == null)
                return NotFound();

            this.context.Vehicles.Remove(vehicle);

            await this.context.SaveChangesAsync();

            return Ok(id);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVehicle(int id)
        {
            var vehicle = await this.context.Vehicles
                .Include(v => v.Model)
                    .ThenInclude(m => m.Make)
                .Include(v => v.Features)
                    .ThenInclude(vf => vf.Feature)
                .SingleOrDefaultAsync(v => v.Id == id);

            if(vehicle == null)
                return NotFound();
            
            var result = this.mapper.Map<Vehicle, VehicleResource>(vehicle);

            return Ok(result);
        }
    }
}