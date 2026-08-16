using EFCoreDatabaseLayer.Models;
using Microsoft.Data.SqlTypes;
using System;
using System.Collections.Generic;
using System.Text;

namespace ServiceLayer
{
    public interface IDocumentChunkService
    {
        List<DocumentChunk> GetDocumentChunks(SqlVector<float>? queryEmbedding, int noOfChunks = 3);
        void AddDocumentChunk(DocumentChunk documentChunk);
    }
}
