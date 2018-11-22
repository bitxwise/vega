using System.IO;
using System.Linq;

namespace vega.Core.Models
{
    public class PhotoSettings
    {
        public long MaxBytes { get; set; }

        public string[] ValidFileTypes { get; set; }

        public bool IsSupported(long byteSize)
        {
            return byteSize < MaxBytes;
        }

        public bool IsSupported(string fileName)
        {
            string fileExtension = Path.GetExtension(fileName).ToLower();
            return ValidFileTypes.Any(ext => ext == fileExtension);
        }
    }
}