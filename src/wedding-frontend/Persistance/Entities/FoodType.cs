using System;
using System.Collections.Generic;

#nullable disable

namespace wedding_frontend.Persistance.Entities
{
    public partial class FoodType
    {
        public FoodType()
        {
            FoodItems = new HashSet<FoodItem>();
        }

        public int FoodTypeId { get; set; }
        public string Type { get; set; }

        public virtual ICollection<FoodItem> FoodItems { get; set; }
    }
}
