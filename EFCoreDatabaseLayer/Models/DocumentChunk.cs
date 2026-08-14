using System;
using System.Collections.Generic;

namespace EFCoreDatabaseLayer.Models;

public partial class DocumentChunk
{
    public long Id { get; set; }

    public string ChunkText { get; set; } = null!;

    public DateTimeOffset CreatedAt { get; set; }

    public virtual ICollection<ChunkEmbedding> ChunkEmbeddings { get; set; } = new List<ChunkEmbedding>();
}
