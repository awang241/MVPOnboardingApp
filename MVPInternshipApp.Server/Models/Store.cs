using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MVPInternshipApp.Server.Models;

[Table("Store")]
public partial class Store
{
    [Key]
    public int Id { get; set; }

    [StringLength(255)]
    public string? Name { get; set; }

    [StringLength(500)]
    public string? Address { get; set; }

    [InverseProperty("Store")]
    public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
}
