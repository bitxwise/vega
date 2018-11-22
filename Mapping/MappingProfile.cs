using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using vega.Controllers.Resources;
using vega.Core.Models;

namespace vega.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Domain to API Resource
            CreateMap<Photo, PhotoResource>();
            CreateMap<Make, MakeResource>();
            CreateMap<Model, NamedResource>();
            CreateMap<Feature, NamedResource>();
            CreateMap<Vehicle, SaveVehicleResource>()
                .ForMember(vr => vr.Contact, opt => opt.MapFrom(v => new ContactResource { Email = v.ContactEmail, Name = v.ContactName, Phone = v.ContactPhone }))
                .ForMember(vr => vr.Features, opt => opt.MapFrom(v => v.Features.Select(vf => vf.FeatureId)));
            CreateMap<Vehicle, VehicleResource>()
                .ForMember(vr => vr.Make, opt => opt.MapFrom(v => v.Model.Make))
                .ForMember(vr => vr.Contact, opt => opt.MapFrom(v => new ContactResource { Email = v.ContactEmail, Name = v.ContactName, Phone = v.ContactPhone }))
                .ForMember(vr => vr.Features, opt => opt.MapFrom(v => v.Features.Select(vf => new NamedResource { Id = vf.Feature.Id, Name = vf.Feature.Name })));

            // API Resource to Domain
            CreateMap<VehicleQueryResource, VehicleQuery>();
            CreateMap<SaveVehicleResource, Vehicle>()
                .ForMember(v => v.Id, opt => opt.Ignore())
                .ForMember(v => v.ContactEmail, opt => opt.MapFrom(vr => vr.Contact.Email))
                .ForMember(v => v.ContactName, opt => opt.MapFrom(vr => vr.Contact.Name))
                .ForMember(v => v.ContactPhone, opt => opt.MapFrom(vr => vr.Contact.Phone))
                .ForMember(v => v.Features, opt => opt.Ignore())
                .AfterMap((vr, v) => {
                    // Remove unselected features
                    var removedFeatures = v.Features.Where(f => !vr.Features.Contains(f.FeatureId)).ToArray();
                    foreach(var f in removedFeatures)
                        v.Features.Remove(f);
                    
                    
                    // Add new features
                    var addedFeatures = vr.Features.Where(id => !v.Features.Any(f => f.FeatureId == id)).Select(id => new VehicleFeature { FeatureId = id }).ToArray();
                    foreach(var f in addedFeatures)
                        v.Features.Add(f);
                });
        }
    }
}