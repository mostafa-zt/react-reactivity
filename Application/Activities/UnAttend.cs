using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.CustomException;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UnAttend
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this._userAccessor = userAccessor;
                this._context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);

                if (activity == null)
                    throw new AppException("Could not find activity", HttpStatusCode.NotFound);

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                var attendees = await _context.UserActivities.SingleOrDefaultAsync(x => x.ActivityId == activity.Id && x.AppUserId == user.Id);

                // if (attendees != null)
                //     throw new AppException("Already attending this activity", HttpStatusCode.BadRequest);
                if (attendees == null)
                    return Unit.Value;

                if (attendees.IsHost)
                    throw new AppException("You can not remove yourself as host", HttpStatusCode.BadRequest);

                _context.UserActivities.Remove(attendees);

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving chnages");
            }
        }
    }
}