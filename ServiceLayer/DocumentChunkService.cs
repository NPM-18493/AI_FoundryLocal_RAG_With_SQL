using EFCoreDatabaseLayer.Models;
using Microsoft.Data.SqlTypes;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace ServiceLayer
{
    public class DocumentChunkService : IDocumentChunkService
    {
        private readonly LearningRagwithSqlContext _context;

        public DocumentChunkService(LearningRagwithSqlContext context)
        {
            _context = context;
        }

        public void AddDocumentChunk(DocumentChunk documentChunk)
        {
            _context.DocumentChunks.Add(documentChunk);
            _context.SaveChanges();
        }

        public List<DocumentChunk> GetDocumentChunks(SqlVector<float>? queryEmbedding)
        {
            var indices = queryEmbedding != null
                ? _context.ChunkEmbeddings
                    .OrderBy(c => EF.Functions.VectorDistance("cosine", c.Embedding, queryEmbedding.Value))
                    .Take(1)
                    .Select(c => c.DocumentId)
                : Enumerable.Empty<long>();

            return _context.DocumentChunks.Where(c => queryEmbedding == null || indices.Contains(c.Id)).ToList();
        }
    }
}
