using EFCoreDatabaseLayer.Models;

namespace DTOs
{
    public record DocumentChunkDTO(long? Id, string ChunkText, DateTimeOffset CreatedAt, ICollection<ChunkEmbeddingDTO>? ChunkEmbeddings);

    public static class DocumentChunkDTOExtensions
    {
        public static DocumentChunkDTO ToDTO(this DocumentChunk documentChunk)
        {
            return new DocumentChunkDTO(
                documentChunk.Id,
                documentChunk.ChunkText,
                documentChunk.CreatedAt,
                documentChunk.ChunkEmbeddings.Select(ce => ce.ToDTO()).ToList()
            );
        }
    }
}
