using System;
using System.Collections.Generic;

#nullable disable

namespace wedding_frontend.Persistance.Entities
{
    public partial class TriviaUserAnswer
    {
        public Guid TriviaUserAnswerId { get; set; }
        public Guid TriviaQuestionId { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Username { get; set; }
        public string UserAnswer { get; set; }

        public virtual TriviaQuestion TriviaQuestion { get; set; }
    }
}
