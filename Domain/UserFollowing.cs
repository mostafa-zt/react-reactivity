namespace Domain
{
    public class UserFollowing
    {
        public string ObserveId { get; set; }
        public AppUser Observer { get; set; }
        public string TargetId { get; set; }
        public AppUser Target  { get; set; }
    }
}