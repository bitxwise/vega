using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace vega.Controllers.Resources
{
    public class VehicleResource
    {
        public int Id { get; set; }

        public NamedResource Make { get; set; }
        public NamedResource Model { get; set; }
        
        public bool IsRegistered { get; set; }

        public ContactResource Contact { get; set; }
        
        public ICollection<NamedResource> Features { get; set; }

        public VehicleResource()
        {
            Features = new Collection<NamedResource>();
        }
    }
}