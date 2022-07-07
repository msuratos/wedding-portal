using System;
using System.Collections.Generic;

#nullable disable

namespace wedding_frontend.Persistance.Entities
{
    public partial class Trivia
    {
        public Trivia()
        {
            TriviaQuestions = new HashSet<TriviaQuestion>();
        }

        public Guid TriviaId { get; set; }
        public Guid WeddingId { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Description { get; set; }
        public bool? IsOpen { get; set; }
        public string Title { get; set; }

        public virtual Wedding Wedding { get; set; }
        public virtual ICollection<TriviaQuestion> TriviaQuestions { get; set; }
    }
}
