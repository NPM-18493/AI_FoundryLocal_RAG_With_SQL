using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace EFCoreDatabaseLayer.Models;

public partial class LearningRagwithSqlContext : DbContext
{
    private readonly IConfiguration _configuration;
    public LearningRagwithSqlContext()
    {
    }

    public LearningRagwithSqlContext(DbContextOptions<LearningRagwithSqlContext> options, IConfiguration confiuration)
        : base(options)
    {
        _configuration = confiuration;
    }

    public virtual DbSet<ChunkEmbedding> ChunkEmbeddings { get; set; }

    public virtual DbSet<DocumentChunk> DocumentChunks { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ChunkEmbedding>(entity =>
        {
            entity.HasIndex(e => e.DocumentId, "IX_ChunkEmbeddings_DocumentId");

            entity.Property(e => e.Embedding).HasMaxLength(1536);

            entity.HasOne(d => d.Document).WithMany(p => p.ChunkEmbeddings)
                .HasForeignKey(d => d.DocumentId)
                .HasConstraintName("FK_ChunkEmbeddings_DocumentChunks");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
