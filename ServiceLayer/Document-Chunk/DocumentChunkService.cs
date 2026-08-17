using EFCoreDatabaseLayer.Models;
using Microsoft.Data.SqlTypes;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace ServiceLayer.Document_Chunk
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

        public List<DocumentChunk> GetDocumentChunks(SqlVector<float>? queryEmbedding, int noOfChunks = 3)
        {

            var indices = _context.ChunkEmbeddings
                    .OrderBy(c => EF.Functions.VectorDistance("cosine", c.Embedding, queryEmbedding.Value)) //cosine, euclidean, dot
                    .Take(noOfChunks)
                    .Select(c => new { DocumentId = c.DocumentId, Distance = EF.Functions.VectorDistance("cosine", c.Embedding, queryEmbedding.Value) });

            var result = from c in _context.DocumentChunks
                         join i in indices on c.Id equals i.DocumentId
                         orderby i.Distance
                         select c;
            return result.ToList();
        }
    }
}
