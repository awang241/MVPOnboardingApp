using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MVPInternshipApp.Server.Dto;
using MVPInternshipApp.Server.Models;

namespace MVPInternshipApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly SalesprojectContext _context;

        public CustomerController(SalesprojectContext context)
        {
            _context = context;
        }

        // GET: api/Customer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomersAsync()
        {
            try {
                var customers = await _context.Customers.ToListAsync();
                return Ok(customers.Select(x => new CustomerDto(x)));
            } catch (Exception e){
                return StatusCode(500, e.Message);
            }
        }

        // GET: api/Customer/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerDto>> GetCustomerAsync(int id)
        {
            if (id <= 0) {
                return BadRequest();
            }
            ActionResult result;
            try {
                var customer = await _context.Customers.FindAsync(id);

                if (customer == null) {
                    result =  NotFound();
                } else {
                    var dto = new CustomerDto(customer);
                    result = Ok(dto);
                }
            }
            catch (Exception e) {
                result = StatusCode(500, e.Message);
            }
            return result;            
        }

        // PUT: api/Customer/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomerAsync(int id, CustomerDto customerDto)
        {
            if (id < 0 || customerDto == null || id != customerDto.Id)
            {
                return BadRequest();
            }
            var customer = customerDto.ToModel();
            _context.Entry(customer).State = EntityState.Modified;
            ActionResult result;

            try {
                await _context.SaveChangesAsync();
                result = NoContent();
            }
            catch (DbUpdateConcurrencyException e) {
                if (!CustomerExists(id)) {
                    result = NotFound();
                }
                else {
                    result = StatusCode(500, e.Message);
                }
            }
            catch (Exception e) {
                result = StatusCode(500, e.Message);
            }

            return result;
        }

        // POST: api/Customer
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CustomerDto>> PostCustomerAsync(CustomerDto customerDto)
        {
            if (customerDto == null) {
                return BadRequest();
            }
            try {
                var customer = customerDto.ToModel();
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetCustomer", new { id = customer.Id }, new CustomerDto(customer));
            }
            catch (Exception e) {
                return StatusCode(500, e.Message);
            }
            
        }

        // DELETE: api/Customer/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomerAsync(int id)
        {
            if (id <= 0) {
                return BadRequest();
            }
            ActionResult result;
            try {
                var customer = await _context.Customers.Where(c => c.Id == id)
                                                    .Include(c => c.Sales)
                                                    .FirstOrDefaultAsync();
                if (customer == null) {
                    result = NotFound();
                }
                else if (customer.Sales.Count > 0) {
                    result = StatusCode(403, "Cannot delete customer with existing sales. Delete the sales associated with this customer first");
                }
                else {
                    _context.Customers.Remove(customer);
                    await _context.SaveChangesAsync();
                    result = NoContent();
                }

            }
            catch (Exception e) {
                result = StatusCode(500, e.Message);
            }
            
            return result;
        }

        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.Id == id);
        }
    }
}
