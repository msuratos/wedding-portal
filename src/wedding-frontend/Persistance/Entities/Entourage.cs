using System;
using System.Collections.Generic;

#nullable disable

namespace wedding_frontend.Persistance.Entities
{
    public partial class Entourage
    {
        public Guid EntourageId { get; set; }
        public string Name { get; set; }
        public Guid EntourageOfWeddingId { get; set; }
        public int RoleIdOfEntourage { get; set; }
        public Guid? WeddingId { get; set; }

        public virtual Wedding EntourageOfWedding { get; set; }
        public virtual Wedding Wedding { get; set; }
    }
}
