using DTOs;
using Microsoft.Data.SqlTypes;

namespace ServiceLayer.Document_Chunk
{
    public interface IDocumentChunkService
    {
        List<DocumentChunkDTO> GetDocumentChunks(SqlVector<float>? queryEmbedding, int noOfChunks = 3);
        void AddDocumentChunk(DocumentChunkDTO documentChunk);
    }
}
