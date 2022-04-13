# Wedding Portal
Another wedding registry portal with an added twist!

## Features
- [x] Admin page to edit wedding information: ceremony details, reception details, entourage, about us, registery, etc...
- [x] Actual public frontend site for the wedding
- [ ] RSVP
- [ ] Slide show
- [ ] Trivia
- [ ] Song requests
- [ ] Games

## _TODO_
- [ ] RSVP
  - [ ] Admin CMS: implement uploading excel file of guest list to upload
  - [ ] Frontend: implement RSVP logic
    - [ ] search their name
    - [ ] populate their 'plus ones' to also rsvp for them
    - [ ] song requests
- [ ] Slideshow Queueing
- [ ] Trivia
- [ ] Song Requests Queueing
- [ ] Games

## _Notes_

DbContext Scaffold
```bash
dotnet ef dbcontext scaffold Name=WeddingDbContext Microsoft.EntityFrameworkCore.SqlServer -c WeddingDbContext --context-dir ./Persistance -o ./Persistance/Entities -t Weddings -t Entourages --force
```