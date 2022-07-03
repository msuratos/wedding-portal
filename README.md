# Wedding Portal
Another wedding registry portal with an added twist!

## Features
- [x] Admin page to edit wedding information: ceremony details, reception details, entourage, about us, registery, etc...
- [x] Actual public frontend site for the wedding
- [x] RSVP
- [ ] Song requests
- [ ] Slide show
- [ ] Trivia
- [ ] Games

## _TODO_
- [ ] Song Requests Queueing
- [ ] Slideshow Queueing
- [ ] Trivia
- [ ] Games

## _Notes_

DbContext Scaffold (Frontend)
```bash
dotnet ef dbcontext scaffold Name=WeddingDbContext Microsoft.EntityFrameworkCore.SqlServer -c WeddingDbContext --context-dir ./Persistance -o ./Persistance/Entities -t Weddings -t Entourages -t Guests -t GuestGroups -t Photos -t SongRequests -t FoodItems -t FoodTypes --force
```