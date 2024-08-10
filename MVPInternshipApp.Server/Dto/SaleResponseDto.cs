using MVPInternshipApp.Server.Models;
using System.Net;

namespace MVPInternshipApp.Server.Dto
{
    public class SaleResponseDto
    {
        public SaleResponseDto() { }
        public SaleResponseDto(Sale model)
        {
            Id = model.Id;
            DateSold = model.DateSold;
            CustomerId = model.CustomerId;
            CustomerName = model.Customer?.Name;
            ProductId = model.ProductId;
            ProductName = model.Product?.Name;
            StoreId = model.StoreId;
            StoreName = model.Store?.Name;
        }
        public Sale ToModel()
        {
            return new Sale { Id = Id, DateSold = DateSold, CustomerId = CustomerId, ProductId = ProductId, StoreId = StoreId };
        }
        public int Id { get; set; }

        public DateTime? DateSold { get; set; }

        public int? CustomerId { get; set; }

        public string? CustomerName { get; set; }

        public int? ProductId { get; set; }

        public string? ProductName { get; set; }

        public int? StoreId { get; set; }

        public string? StoreName { get; set; }
    }
}
