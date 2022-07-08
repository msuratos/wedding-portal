using System;
using System.Collections.Generic;

#nullable disable

namespace wedding_frontend.Persistance.Entities
{
    public partial class TriviaQuestion
    {
        public TriviaQuestion()
        {
            TriviaUserAnswers = new HashSet<TriviaUserAnswer>();
        }

        public Guid TriviaQuestionId { get; set; }
        public Guid TriviaId { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public int SortRank { get; set; }

        public virtual Trivia Trivia { get; set; }
        public virtual ICollection<TriviaUserAnswer> TriviaUserAnswers { get; set; }
    }
}
