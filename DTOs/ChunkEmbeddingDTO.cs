using EFCoreDatabaseLayer.Models;
using Microsoft.Data.SqlTypes;

namespace DTOs
{
    public record ChunkEmbeddingDTO(long? Id, long? DocumentId, SqlVector<float> Embedding, DocumentChunk Document);

    public static class ChunkEmbeddingDTOExtensions
    {
        public static ChunkEmbeddingDTO ToDTO(this ChunkEmbedding chunkEmbedding)
        {
            return new ChunkEmbeddingDTO(
                chunkEmbedding.Id,
                chunkEmbedding.DocumentId,
                chunkEmbedding.Embedding,
                chunkEmbedding.Document
            );
        }
    }
}
