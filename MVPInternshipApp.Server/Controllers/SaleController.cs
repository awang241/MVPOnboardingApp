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
            try {
                var sales = await _context.Sales
                .Include(s => s.Product)
                .Include(s => s.Customer)
                .Include(s => s.Store)
                .ToListAsync();
                return Ok(sales.Select(s => new SaleResponseDto(s)));
            }
            catch (Exception ex) {
                return StatusCode(500, ex.Message);
            }
            
        }

        // GET: api/Sale/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SaleResponseDto>> GetSale(int id)
        {
            if (id < 0) {
                return BadRequest();
            }
            try {
                var sale = await _context.Sales
                                .Include(s => s.Product)
                                .Include(s => s.Customer)
                                .Include(s => s.Store)
                                .FirstOrDefaultAsync(s => s.Id == id);

                if (sale == null) {
                    return NotFound();
                }
                return new SaleResponseDto(sale);
            }
            catch (Exception ex) {
                return StatusCode(500, ex.Message);
            }
        }

        // PUT: api/Sale/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSale(int id, SaleRequestDto saleData)
        {
            var sale = saleData?.ToModel();
            if (id < 0 || sale == null || id != sale.Id || !SaleReferencedIdsExist(sale))
            {
                return BadRequest();
            }
            _context.Entry(sale).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) {
                if (!SaleExists(id)) {
                    return NotFound();
                }
                else {
                    throw;
                }
            }
            catch (Exception ex) {
                return StatusCode(500, ex.Message);
            }

            return NoContent();
        }

        // POST: api/Sale
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SaleResponseDto>> PostSale(SaleRequestDto saleData)
        {
            var sale = saleData?.ToModel();
            if (sale == null || !SaleReferencedIdsExist(sale))
            {
                return BadRequest();
            }
            _context.Sales.Add(sale);
            try {
                await _context.SaveChangesAsync();
                foreach (var item in _context.Entry(sale).Navigations) {
                    item.Load();
                }
                return CreatedAtAction("GetSale", new { id = sale.Id }, new SaleResponseDto(sale));
            }
            catch (Exception ex) {
                return StatusCode(500, ex.Message);
            }
        }

        // DELETE: api/Sale/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSale(int id)
        {
            if (id < 0) {
                return BadRequest();
            }

            var sale = await _context.Sales.FindAsync(id);
            if (sale == null)
            {
                return NotFound();
            }

            _context.Sales.Remove(sale);
            try {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex) {
                return StatusCode(500, ex.Message);
            }
        }

        private bool SaleExists(int id)
        {
            return _context.Sales.Any(e => e.Id == id);
        }

        private bool SaleReferencedIdsExist(Sale sale)
        {
            if (sale != null) {
                bool validProductId = sale.ProductId != null && sale.ProductId >= 0 && _context.Products.Any(e => e.Id == sale.ProductId);
                bool validCustomerId = sale.CustomerId != null && sale.CustomerId >= 0 && _context.Customers.Any(e => e.Id == sale.CustomerId);
                bool validStoreId = sale.StoreId != null && sale.StoreId >= 0 && _context.Stores.Any(e => e.Id == sale.StoreId);
                return validProductId && validCustomerId && validStoreId;
            }
            return false;
        }
    }
}
