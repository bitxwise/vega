using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using vega.Controllers.Resources;
using vega.Core;
using vega.Core.Models;

namespace vega.Controllers
{
    [Route("/api/vehicles/{vehicleId}/photos")]
    public class PhotosController : Controller
    {
        private readonly IPhotoRepository photoRepository;
        private readonly IVehicleRepository vehicleRepository;
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;
        private readonly IHostingEnvironment host;
        private readonly PhotoSettings photoSettings;

        public PhotosController(IPhotoRepository photoRepository, IVehicleRepository vehicleRepository, IUnitOfWork unitOfWork, IMapper mapper, IHostingEnvironment host, IOptionsSnapshot<PhotoSettings> options)
        {
            this.photoRepository = photoRepository;
            this.photoSettings = options.Value;
            this.host = host;
            this.mapper = mapper;
            this.unitOfWork = unitOfWork;
            this.vehicleRepository = vehicleRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<PhotoResource>> GetPhotos(int vehicleId)
        {
            var photos = await photoRepository.GetPhotos(vehicleId);
            return mapper.Map<IEnumerable<Photo>, IEnumerable<PhotoResource>>(photos);
        }

        [HttpPost]
        public async Task<IActionResult> UploadPhoto(int vehicleId, IFormFile file)
        {
            #region Validation

            var vehicle = await vehicleRepository.GetAsync(vehicleId, includeRelated: false);
            if (vehicle == null)
                return NotFound();

            if (file == null || file.Length == 0)
                return BadRequest("No file specified");

            if (!photoSettings.IsSupported(file.Length))
                return BadRequest(string.Format("File size {0} exceeded maximum size {1}", file.Length, photoSettings.MaxBytes));

            if (!photoSettings.IsSupported(file.FileName))
                return BadRequest(string.Format("File type not supported. Only the following file types are supported: {0}", string.Join(", ", photoSettings.ValidFileTypes)));

            #endregion Validation

            var uploadFolderPath = Path.Combine(host.WebRootPath, "uploads");
            if (!Directory.Exists(uploadFolderPath))
                Directory.CreateDirectory(uploadFolderPath);

            var fileName = string.Concat(Guid.NewGuid().ToString(), Path.GetExtension(file.FileName));
            var filePath = Path.Combine(uploadFolderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
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