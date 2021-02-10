using System.Threading.Tasks;
using Application.Interfaces;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Application.CustomException;
using System.Linq;

namespace Application.Profiles
{
    public class ProfileReader : IProfileReader
    {
        private readonly IUserAccessor _userAccessor;
        private readonly DataContext _context;
        public ProfileReader(DataContext context, IUserAccessor userAccessor)
        {
            this._context = context;
            this._userAccessor = userAccessor;

        }
        public async Task<Profile> ReadProfile(string username)
        {
            var user = await _context.Users.Include(x => x.Photos)
                                            .Include(x => x.Followers)
                                            .Include(x => x.Followings)
                                            .SingleOrDefaultAsync(x => x.UserName == username);

            if (user == null)
                throw new AppException("Not found", System.Net.HttpStatusCode.NotFound);

            var curentUser = await _context.Users.Include(x => x.Followings).SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

            var profile = new Profile()
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                Photos = user.Photos,
                Bio = user.Bio,
                FollowerCount = user.Followers.Count(),
                FollowingCount = user.Followings.Count()
            };

            if (curentUser.Followings.Any(x => x.TargetId == user.Id))
                profile.IsFollowed = true;

            return profile;
        }
    }
}