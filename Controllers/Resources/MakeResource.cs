using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace vega.Controllers.Resources
{
    public class MakeResource : NamedResource
    {
        public ICollection<NamedResource> Models { get; set; }

        public MakeResource()
        {
            Models = new Collection<NamedResource>();
        }
    }
}