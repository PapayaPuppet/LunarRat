namespace LunarRat.Schema;

public enum SkillRank
{
    Unranked = 0,
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5
}

public class CharacterSheet
{
    public Guid CharacterSheetGuid { get; set; }
    public Guid UserGuid { get; set; }
    public virtual User Owner { get; set; }

    public string CharacterName { get; set; }
    
    public SkillRank Artillery { get; set; }
    public SkillRank Axe { get; set; }
    public SkillRank BeastMastery { get; set; }
    public SkillRank Bow { get; set; }
    public SkillRank Dagger { get; set; }
    public SkillRank Greatsword { get; set; }
    public SkillRank Hammer { get; set; }
    public SkillRank Mace { get; set; }
    public SkillRank Pistol { get; set; }
    public SkillRank Polearm { get; set; }
    public SkillRank Rifle { get; set; }
    public SkillRank Sword { get; set; }
    public SkillRank Thrown { get; set; }
    public SkillRank Torch { get; set; }
    public SkillRank Unarmed { get; set; }
    
    public SkillRank HeavyArmor { get; set; }
    public SkillRank LightArmor { get; set; }
    public SkillRank MediumArmor { get; set; }
    public SkillRank Shield { get; set; }
    
    public SkillRank Athletics { get; set; }
    public SkillRank Bolstering { get; set; }
    public SkillRank Engineering { get; set; }
    public SkillRank Explosives { get; set; }
    public SkillRank Fortitude { get; set; }
    public SkillRank Intimidation { get; set; }
    public SkillRank Medic { get; set; }
    public SkillRank Perception { get; set; }
    public SkillRank Persuasion { get; set; }
    public SkillRank Stealth { get; set; }
    public SkillRank Tracking { get; set; }
    
    public DateTime LastEditedAt { get; set; }
}