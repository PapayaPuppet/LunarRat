namespace LunarRat.Schema;

public enum RollType
{
    Attack = 0,
    Defense = 1
}

public class Roll
{
    public Guid RollGuid { get; set; }
    public RollType RollType { get; set; }
    public int Number { get; set; }
    public string Label { get; set; }
    public string Description { get; set; }
}