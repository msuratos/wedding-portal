using System;
using System.Collections.Generic;

#nullable disable

namespace wedding_frontend.Persistance.Entities
{
    public partial class SongRequest
    {
        public int SongRequestId { get; set; }
        public string SongName { get; set; }
        public string RequestedBy { get; set; }
        public DateTime RequestedDate { get; set; }
        public Guid FkWeddingId { get; set; }

        public virtual Wedding FkWedding { get; set; }
    }
}
