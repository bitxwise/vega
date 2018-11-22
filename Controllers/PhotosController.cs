using System;
using System.IO;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using vega.Controllers.Resources;
using vega.Core;
using vega.Core.Models;

namespace vega.Controllers
{
    [Route("/api/vehicles/{vehicleId}/photos")]
    public class PhotosController : Controller
    {
        private readonly IVehicleRepository vehicleRepository;
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;
        private readonly IHostingEnvironment host;

        public PhotosController(IVehicleRepository vehicleRepository, IUnitOfWork unitOfWork, IMapper mapper, IHostingEnvironment host)
        {
            this.host = host;
            this.mapper = mapper;
            this.unitOfWork = unitOfWork;
            this.vehicleRepository = vehicleRepository;
        }

        [HttpPost]
        public async Task<IActionResult> UploadPhoto(int vehicleId, IFormFile file)
        {
            var vehicle = await vehicleRepository.GetAsync(vehicleId, includeRelated: false);
            if(vehicle == null)
                return NotFound();

            var uploadFolderPath = Path.Combine(host.WebRootPath, "uploads");
            if(!Directory.Exists(uploadFolderPath))
                Directory.CreateDirectory(uploadFolderPath);
            
            var fileName = string.Concat(Guid.NewGuid().ToString(), Path.GetExtension(file.FileName));
            var filePath = Path.Combine(uploadFolderPath, fileName);
            
            using(var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var photo = new Photo() { FileName = fileName };
            vehicle.Photos.Add(photo);

            await unitOfWork.CompleteAsync();

            return Ok(mapper.Map<Photo, PhotoResource>(photo));
        }
    }
}