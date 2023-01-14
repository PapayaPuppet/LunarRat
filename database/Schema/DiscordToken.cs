namespace LunarRat.Schema;

public class DiscordToken
{
    public Guid TokenGuid { get; set; }
    public Guid UserGuid { get; set; }
    public virtual User Owner { get; set; }
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public string Scope { get; set; }
    public string TokenType { get; set; }
    public DateTime GeneratedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
}