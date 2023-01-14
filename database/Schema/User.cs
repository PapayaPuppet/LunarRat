namespace LunarRat.Schema;

public class User
{
    public Guid UserGuid { get; set; }
    public string Name { get; set; }
    public string DiscordId { get; set; }
    public string Locale { get; set; }
    
    public List<DiscordToken> DiscordTokens { get; set; }
}