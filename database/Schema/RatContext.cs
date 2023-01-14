using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace LunarRat.Schema;

public class RatContext : DbContext
{
    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        IConfiguration config = new ConfigurationBuilder().Build();
        options.UseSqlServer(config.GetConnectionString("LunarRat"));
    }

    //
    public DbSet<User> Users { get; set; }
    public DbSet<CharacterSheet> CharacterSheets { get; set; }
    
    //Game Info
    public DbSet<Roll> DiceRolls { get; set; }
    
    //Internals
    public DbSet<DiscordToken> DiscordTokens { get; set; }
        
}