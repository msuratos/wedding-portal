namespace wedding_admin_cms.Persistance.Entities
{
  public class FoodType
  {
    public FoodType()
    {
      FoodItems = new HashSet<FoodItem>();
    }

    public int FoodTypeId { get; set; }
    public string Type { get; set; }

    public ICollection<FoodItem> FoodItems { get; set; }
  }
}