using EFCoreDatabaseLayer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        public IEnumerable<DocumentChunk> Get()
        {
            return _documentChunkService.GetDocumentChunks();
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
