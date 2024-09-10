using MVPInternshipApp.Server.Models;

namespace MVPInternshipApp.Server.Dto
{
    public class CustomerDto
    {
        public CustomerDto() { }
        public CustomerDto(Customer model) { 
            Id = model.Id;
            Name = model.Name;
            Address = model.Address;
        }
        public Customer ToModel()
        {
            return new Customer { Id = Id, Name = Name, Address = Address };
        }

        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Address { get; set; }

        
    }
}
