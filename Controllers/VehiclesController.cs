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
        private readonly IVehicleRepository repository;
        private readonly IUnitOfWork unitOfWork;

        public VehiclesController(IVehicleRepository repository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            this.repository = repository;
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateVehicle([FromBody] SaveVehicleResource vehicleResource)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var vehicle = this.mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource);

            this.repository.Add(vehicle);
            await this.unitOfWork.CompleteAsync();

            vehicle =  await this.repository.GetAsync(vehicle.Id);

            var result = this.mapper.Map<Vehicle, VehicleResource>(vehicle);

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] SaveVehicleResource vehicleResource)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var vehicle = await this.repository.GetAsync(id);
            
            if(vehicle == null)
                return NotFound();
            
            this.mapper.Map<SaveVehicleResource, Vehicle>(vehicleResource, vehicle);
            
            await this.unitOfWork.CompleteAsync();

            vehicle = await this.repository.GetAsync(id);
            var result = this.mapper.Map<Vehicle, SaveVehicleResource>(vehicle);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await this.repository.GetAsync(id, includeRelated: false);
            
            if(vehicle == null)
                return NotFound();

            this.repository.Remove(vehicle);

            await this.unitOfWork.CompleteAsync();

            return Ok(id);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVehicle(int id)
        {
            var vehicle = await this.repository.GetAsync(id);

            if(vehicle == null)
                return NotFound();
            
            var result = this.mapper.Map<Vehicle, VehicleResource>(vehicle);

            return Ok(result);
        }
    }
}