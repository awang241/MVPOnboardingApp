using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MVPInternshipApp.Server.Dto;
using MVPInternshipApp.Server.Models;

namespace MVPInternshipApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleController : ControllerBase
    {
        private readonly SalesprojectContext _context;

        public SaleController(SalesprojectContext context)
        {
            _context = context;
        }

        // GET: api/Sale
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SaleResponseDto>>> GetSales()
        {
            var sales = await _context.Sales.ToListAsync();
            return Ok(sales.Select(s => new SaleResponseDto(s)));
        }

        // GET: api/Sale/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SaleResponseDto>> GetSale(int id)
        {
            var sale = await _context.Sales.FindAsync(id);

            if (sale == null)
            {
                return NotFound();
            }

            return new SaleResponseDto(sale);
        }

        // PUT: api/Sale/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSale(int id, SaleRequestDto saleData)
        {
            var sale = saleData.ToModel();
            if (id != sale.Id || !SaleReferencedIdsExist(sale))
            {
                return BadRequest();
            }
            _context.Entry(sale).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SaleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Sale
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SaleResponseDto>> PostSale(SaleRequestDto saleData)
        {
            var sale = saleData.ToModel();
            if (!SaleReferencedIdsExist(sale))
            {
                return BadRequest();
            }
            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSale", new { id = sale.Id }, new SaleResponseDto(sale));
        }

        // DELETE: api/Sale/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSale(int id)
        {
            var sale = await _context.Sales.FindAsync(id);
            if (sale == null)
            {
                return NotFound();
            }

            _context.Sales.Remove(sale);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SaleExists(int id)
        {
            return _context.Sales.Any(e => e.Id == id);
        }

        private bool SaleReferencedIdsExist(Sale sale)
        {
            if (sale != null) {
                bool validProductId = sale.ProductId == null || _context.Products.Any(e => e.Id == sale.ProductId);
                bool validCustomerId = sale.CustomerId == null || _context.Customers.Any(e => e.Id == sale.CustomerId);
                bool validStoreId = sale.StoreId == null || _context.Stores.Any(e => e.Id == sale.StoreId);
                return validProductId && validCustomerId && validStoreId;
            }
            return false;
        }
    }
}
