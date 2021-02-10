using System;
using System.Threading;
using System.Threading.Tasks;
using Application.CustomException;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class Add
    {
        public class Command : IRequest
        {
            public string Username { get; set; }
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

                var observer = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());
                var target = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (target == null)
                    throw new AppException("Not found", System.Net.HttpStatusCode.NotFound);

                var following = await _context.Followings.SingleOrDefaultAsync(x => x.ObserveId == observer.Id && x.TargetId == target.Id);

                if (following != null)
                    throw new AppException("You are already following this user", System.Net.HttpStatusCode.BadRequest);

                if (following == null)
                {
                    following = new Domain.UserFollowing()
                    {
                        Observer = observer,
                        Target = target
                    };
                }

                _context.Followings.Add(following);

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Problem saving chnages");
            }
        }
    }
}