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
    public class ProductController : ControllerBase
    {
        private readonly SalesprojectContext _context;

        public ProductController(SalesprojectContext context)
        {
            _context = context;
        }

        // GET: api/Product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            try {
                var products = await _context.Products.ToListAsync();
                return Ok(products.Select(p => new ProductDto(p)));
            }
            catch (Exception ex) {
                return StatusCode(500, ex.Message);
            }
        }

        // GET: api/Product/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            if (id <= 0) {
                return BadRequest();
            }
            ActionResult result;
            try {
                var product = await _context.Products.FindAsync(id);

                if (product == null) {
                    result = NotFound();
                }
                else {
                    var productDto = new ProductDto(product);
                    result = Ok(productDto);
                }
            }
            catch (Exception ex) {
                result = StatusCode(500, ex.Message);
            }
            return result;
        }

        // PUT: api/Product/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, ProductDto productDto)
        {
            if (id < 0 || productDto == null || id != productDto.Id)
            {
                return BadRequest();
            }

            var product = productDto.ToModel();
            _context.Entry(product).State = EntityState.Modified;

            ActionResult result;
            try {
                await _context.SaveChangesAsync();
                result = NoContent();
            }
            catch (DbUpdateConcurrencyException ex) {
                if (!ProductExists(id)) {
                    result = NotFound();
                }
                else {
                    result = StatusCode(500, ex.Message);
                }
            }
            catch (Exception ex) {
                result = StatusCode(500, ex.Message);
            }

            return result;
        }

        // POST: api/Product
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductDto>> PostProduct(ProductDto productDto)
        {
            if (productDto == null) {
                return BadRequest();
            }
            var product = productDto.ToModel();
            _context.Products.Add(product);
            ActionResult result;
            try {
                await _context.SaveChangesAsync();
                result = CreatedAtAction("GetProduct", new { id = product.Id }, new ProductDto(product));
            } catch (Exception ex) {
                result = StatusCode(500, ex.Message);
            }

            return result;
        }

        // DELETE: api/Product/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            if (id <= 0) {
                return BadRequest();
            }
            var product = await _context.Products.Where(p => p.Id == id)
                                                .Include(p => p.Sales)
                                                .FirstOrDefaultAsync();
            if (product == null)
            {
                return NotFound();
            }

            if (product.Sales.Count > 0) {
                return StatusCode(403, "Cannot delete product with existing sales. Delete the sales associated with this product first");
            }

            _context.Products.Remove(product);
            ActionResult result;
            try {
                await _context.SaveChangesAsync();
                result = NoContent();
            }
            catch (Exception ex) {
                result = StatusCode(500, ex.Message);
            }

            return result;
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
