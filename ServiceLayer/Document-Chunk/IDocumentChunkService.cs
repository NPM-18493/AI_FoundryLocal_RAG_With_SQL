using EFCoreDatabaseLayer.Models;
using Microsoft.Data.SqlTypes;

namespace ServiceLayer.Document_Chunk
{
    public interface IDocumentChunkService
    {
        List<DocumentChunk> GetDocumentChunks(SqlVector<float>? queryEmbedding, int noOfChunks = 3);
        void AddDocumentChunk(DocumentChunk documentChunk);
    }
}
