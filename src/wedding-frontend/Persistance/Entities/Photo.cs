using System;
using System.Collections.Generic;

#nullable disable

namespace wedding_frontend.Persistance.Entities
{
    public partial class Photo
    {
        public Guid PhotoId { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public string ForPage { get; set; }
        public DateTime CreatedDate { get; set; }
        public Guid FkWeddingId { get; set; }

        public virtual Wedding FkWedding { get; set; }
    }
}
