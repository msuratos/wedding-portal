using System;
using System.Collections.Generic;

#nullable disable

namespace wedding_frontend.Persistance.Entities
{
    public partial class Schedule
    {
        public int ScheduleId { get; set; }
        public Guid WeddingId { get; set; }
        public string Activity { get; set; }
        public DateTime ActivityStartTime { get; set; }
        public DateTime ActivityEndTime { get; set; }

        public virtual Wedding Wedding { get; set; }
    }
}
