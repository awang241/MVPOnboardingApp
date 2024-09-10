using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MVPInternshipApp.Server.Models;

public partial class SalesprojectContext : DbContext
{
    public SalesprojectContext()
    {
    }

    public SalesprojectContext(DbContextOptions<SalesprojectContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Sale> Sales { get; set; }

    public virtual DbSet<Store> Stores { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Customer__3214EC0784BF483D");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Product__3214EC07A9B102BB");
        });

        modelBuilder.Entity<Sale>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Sale__3214EC07D32513F4");

            entity.HasOne(d => d.Customer).WithMany(p => p.Sales).HasConstraintName("FK__Sale__CustomerId__6383C8BA");

            entity.HasOne(d => d.Product).WithMany(p => p.Sales).HasConstraintName("FK__Sale__ProductId__6477ECF3");

            entity.HasOne(d => d.Store).WithMany(p => p.Sales).HasConstraintName("FK__Sale__StoreId__656C112C");
        });

        modelBuilder.Entity<Store>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Store__3214EC07FA0CAF23");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
