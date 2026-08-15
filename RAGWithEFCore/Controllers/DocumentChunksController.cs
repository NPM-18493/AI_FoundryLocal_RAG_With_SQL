using EFCoreDatabaseLayer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlTypes;
using RAGWithEFCore.Utilities;
using ServiceLayer;

namespace RAGWithEFCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentChunksController : ControllerBase
    {
        private readonly ICustomEmbeddingService _embeddingService;
        private readonly IDocumentChunkService _documentChunkService;

        public DocumentChunksController(IDocumentChunkService documentChunkService, ICustomEmbeddingService embeddingService)
        {
            _documentChunkService = documentChunkService;
            _embeddingService = embeddingService;
        }

        [HttpGet(Name = "GetDocumentChunks")]
        public IEnumerable<DocumentChunk> Get(string query)
        {
            SqlVector<float>? queryEmbedding = string.IsNullOrEmpty(query) ? null : VectorToFloatConverter.VectorToFloat(_embeddingService.GenerateEmbeddingAsync(query).Result);
            return _documentChunkService.GetDocumentChunks(queryEmbedding);
        }

        [HttpPost(Name = "AddDocumentChunk")]
        public IActionResult Post([FromBody] DocumentChunk documentChunk)
        {
            ReadOnlyMemory<double> chunkEmbedding = _embeddingService.GenerateEmbeddingAsync(documentChunk.ChunkText).Result;
            _documentChunkService.AddDocumentChunk(new DocumentChunk()
            {
                ChunkText = documentChunk.ChunkText,
                CreatedAt = DateTime.UtcNow,
                ChunkEmbeddings = [
                    new ChunkEmbedding {
                        Embedding = VectorToFloatConverter.VectorToFloat(chunkEmbedding)
                    }
                    ]
            });
            return CreatedAtRoute("GetDocumentChunks", new { id = documentChunk.Id }, documentChunk);
        }
    }
}
