using System;
using System.Collections.Generic;
using Microsoft.Data.SqlTypes;

namespace EFCoreDatabaseLayer.Models;

public partial class ChunkEmbedding
{
    public long Id { get; set; }

    public long DocumentId { get; set; }

    public SqlVector<float> Embedding { get; set; }

    public virtual DocumentChunk Document { get; set; } = null!;
}
