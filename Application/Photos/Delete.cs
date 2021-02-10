using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.CustomException;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
            {
                this._userAccessor = userAccessor;
                this._photoAccessor = photoAccessor;
                this._context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(x => x.Photos).SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

                if (photo == null)
                    throw new AppException("Not Found", System.Net.HttpStatusCode.NotFound);

                if (photo.IsMain)
                    throw new AppException("You can not delete your main photo", System.Net.HttpStatusCode.BadRequest);

                var result = _photoAccessor.DeletePhoto(photo.Id);

                if (result == null)
                    throw new AppException("problem deleting th photo", System.Net.HttpStatusCode.InternalServerError);

                user.Photos.Remove(photo);

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving chnages");
            }
        }
    }
}