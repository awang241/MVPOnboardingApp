using MVPInternshipApp.Server.Models;
using System.Net;

namespace MVPInternshipApp.Server.Dto
{
    public class SaleRequestDto
    {
        public SaleRequestDto() { }
        public SaleRequestDto(Sale model)
        {
            Id = model.Id;
            DateSold = model.DateSold;
            CustomerId = model.CustomerId;
            ProductId = model.ProductId;
            StoreId = model.StoreId;
        }
        public Sale ToModel()
        {
            return new Sale { Id = Id, DateSold = DateSold, CustomerId = CustomerId, ProductId = ProductId, StoreId = StoreId };
        }
        public int Id { get; set; }

        public DateTime? DateSold { get; set; }

        public int? CustomerId { get; set; }

        public int? ProductId { get; set; }

        public int? StoreId { get; set; }

    }
}
