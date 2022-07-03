namespace wedding_admin_cms.Persistance.Entities
{
  public class FoodItem
  {
    public int FoodId { get; set; }
    public Guid WeddingId { get; set; }   // foreign key
    public int FoodTypeId { get; set; }   // foreign key
    public string Food { get; set; }
    public string Description { get; set; }
    
    public FoodType FoodType { get; set; }
    public Wedding Wedding { get; set; }
  }
}