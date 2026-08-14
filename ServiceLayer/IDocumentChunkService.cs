using EFCoreDatabaseLayer.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace ServiceLayer
{
    public interface IDocumentChunkService
    {
        List<DocumentChunk> GetDocumentChunks();
        void AddDocumentChunk(DocumentChunk documentChunk);
    }
}
