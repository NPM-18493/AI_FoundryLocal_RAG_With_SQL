using EFCoreDatabaseLayer.Models;
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

        public List<DocumentChunk> GetDocumentChunks()
        {
            return _context.DocumentChunks.ToList();
        }
    }
}
