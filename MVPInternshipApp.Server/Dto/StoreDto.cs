using MVPInternshipApp.Server.Models;

namespace MVPInternshipApp.Server.Dto
{
    public class StoreDto
    {
        public StoreDto() { }
        public StoreDto(Store model) {
            Id = model.Id;
            Name = model.Name;
            Address = model.Address;
        }
        public Store ToModel()
        {
            return new Store { Id = Id, Name = Name, Address = Address };
        }
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Address { get; set; }
    }
}
