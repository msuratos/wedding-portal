using System;
using System.Collections.Generic;

#nullable disable

namespace wedding_frontend.Persistance.Entities
{
    public partial class FoodItem
    {
        public int FoodId { get; set; }
        public Guid WeddingId { get; set; }
        public int FoodTypeId { get; set; }
        public string Food { get; set; }
        public string Description { get; set; }

        public virtual FoodType FoodType { get; set; }
        public virtual Wedding Wedding { get; set; }
    }
}
