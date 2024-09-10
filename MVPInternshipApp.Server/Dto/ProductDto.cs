using MVPInternshipApp.Server.Models;
using System.Net;

namespace MVPInternshipApp.Server.Dto
{
    public class ProductDto
    {
        public ProductDto() { }
        public ProductDto(Product model)
        {
            Id = model.Id;
            Name = model.Name;
            Price = model.Price;
        }
        public Product ToModel()
        {
            return new Product { Id = Id, Name = Name, Price = Price };
        }
        public int Id { get; set; }
        public string? Name { get; set; }
        public decimal? Price { get; set; }
    }
}
