using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Activities
{
    public class MapppingProfile : Profile
    {
        public MapppingProfile()
        {
            CreateMap<Activity, ActivityDto>()
            .ForMember(x => x.Attendees, m => m.MapFrom(src => src.UserActivities));
            CreateMap<UserActivity, AttendeeDto>()
                    .ForMember(x => x.Username, o => o.MapFrom(s => s.AppUser.UserName))
                    .ForMember(x => x.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                    .ForMember(x => x.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                    .ForMember(x => x.Following, o => o.MapFrom<FollowingResolver>());
        }
    }
}